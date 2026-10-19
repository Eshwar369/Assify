import os
import sys
import re
import time
import hashlib
from pathlib import Path
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT_DIR))

from backend.database.db import get_db_connection
from backend.ingestion.parser import parse_whatsapp, detect_participants
from backend.ingestion.preference_tagger import extract_the_keep_items
from backend.analytics.chronemics import (
    aggregate_conversational_turns,
    detect_silence_seams,
    classify_seams_with_llm,
    synthesize_chronemics_metrics,
)


def _generate_contact_id(raw_contact_name: str, raw_user_name: str) -> str:
    """
    Creates a deterministic, URL-safe contact ID from participants' raw names.
    Example: 'c_sleepless_zombiee_6f1a8b'
    """
    clean_name = re.sub(r"[^a-zA-Z0-9]+", "_", raw_contact_name.strip()).strip("_").lower()
    if not clean_name:
        clean_name = "contact"
    hasher = hashlib.sha256(f"{raw_contact_name}::{raw_user_name}".encode("utf-8")).hexdigest()[:6]
    return f"c_{clean_name}_{hasher}"


def ingest_chat(
    raw_text: str,
    user_sender: Optional[str] = None,
    contact_display_name: Optional[str] = None,
    openai_client=None,
    db_path: Optional[Path | str] = None,
    seam_gap_hours: float = 3.5,
    max_neuro_seams: int = 40,
) -> Dict[str, Any]:
    """
    Production Ingestion Pipeline:
    1. Detects senders and roles.
    2. Upserts contact entity into `contacts` table.
    3. Normalizes messages and bulk-inserts into `messages` table in a single transaction.
    4. Runs Neuro-Symbolic Chronemics pipeline and persists results into `chronemics_stats`.
    
    Returns structured ingestion summary.
    """
    t_start = time.time()

    # 1. Detect Participants
    participants = detect_participants(raw_text)
    if not participants:
        raise ValueError("No valid message senders detected in the provided chat export.")

    if user_sender is None:
        # Auto-detect user: prefer '*' if present, otherwise first participant
        user_sender = "*" if "*" in participants else participants[0]

    other_senders = [p for p in participants if p != user_sender]
    raw_contact = other_senders[0] if other_senders else "Unknown"

    display_name = contact_display_name.strip() if contact_display_name else raw_contact
    contact_id = _generate_contact_id(raw_contact, user_sender)

    # 2. Parse Messages
    t0 = time.time()
    parsed_msgs = parse_whatsapp(raw_text, user_sender=user_sender, contact_id=contact_id)
    t_parse = time.time() - t0

    if not parsed_msgs:
        raise ValueError("Chat file contains no parseable messages matching WhatsApp formats.")

    # 3. Chronemics Processing
    t0 = time.time()
    turns = aggregate_conversational_turns(parsed_msgs, threshold_seconds=90)
    seams = detect_silence_seams(turns, gap_hours=seam_gap_hours)
    classified_seams = classify_seams_with_llm(
        seams,
        openai_client=openai_client,
        model="gpt-4o-mini",
        max_seams=max_neuro_seams
    )
    stats = synthesize_chronemics_metrics(
        contact_id=contact_id,
        messages=parsed_msgs,
        turns=turns,
        classified_seams=classified_seams
    )
    # Extract candidate preferences and memories for 'The Keep'
    preferences = extract_the_keep_items(
        parsed_msgs,
        openai_client=openai_client,
        model="gpt-4o-mini",
        include_ai_oracle=True
    )
    t_chron = time.time() - t0

    # 4. Atomic Database Persistence
    t0 = time.time()
    conn = get_db_connection(db_path)
    try:
        with conn:
            # 4.1 Upsert Contact
            conn.execute(
                """
                INSERT INTO contacts (id, raw_name, display_name, user_name, created_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(id) DO UPDATE SET
                    raw_name = excluded.raw_name,
                    display_name = excluded.display_name,
                    user_name = excluded.user_name;
                """,
                (contact_id, raw_contact, display_name, user_sender)
            )

            # 4.2 Refresh Messages for this contact
            conn.execute("DELETE FROM messages WHERE contact_id = ?;", (contact_id,))
            msg_rows = [
                (
                    m["id"],
                    m["contact_id"],
                    m["time_stamp"],
                    m["sender"],
                    m["raw_sender"],
                    m["content"],
                    m["media_type"],
                    m["media_path"],
                    m["media_meta"],
                    m["is_deleted"],
                    m["is_question"],
                )
                for m in parsed_msgs
            ]
            conn.executemany(
                """
                INSERT INTO messages (
                    id, contact_id, time_stamp, sender, raw_sender,
                    content, media_type, media_path, media_meta, is_deleted, is_question
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                """,
                msg_rows
            )

            # 4.3 Upsert Chronemics Telemetry
            conn.execute(
                """
                INSERT INTO chronemics_stats (
                    contact_id, total_messages, user_msg_count, contact_msg_count,
                    user_initiation_pct, contact_initiation_pct,
                    user_median_delay_m, contact_median_delay_m,
                    user_double_texts, contact_double_texts,
                    late_night_pct, longest_gap_hours, calculated_at
                ) VALUES (
                    :contact_id, :total_messages, :user_msg_count, :contact_msg_count,
                    :user_initiation_pct, :contact_initiation_pct,
                    :user_median_delay_m, :contact_median_delay_m,
                    :user_double_texts, :contact_double_texts,
                    :late_night_pct, :longest_gap_hours, CURRENT_TIMESTAMP
                )
                ON CONFLICT(contact_id) DO UPDATE SET
                    total_messages = excluded.total_messages,
                    user_msg_count = excluded.user_msg_count,
                    contact_msg_count = excluded.contact_msg_count,
                    user_initiation_pct = excluded.user_initiation_pct,
                    contact_initiation_pct = excluded.contact_initiation_pct,
                    user_median_delay_m = excluded.user_median_delay_m,
                    contact_median_delay_m = excluded.contact_median_delay_m,
                    user_double_texts = excluded.user_double_texts,
                    contact_double_texts = excluded.contact_double_texts,
                    late_night_pct = excluded.late_night_pct,
                    longest_gap_hours = excluded.longest_gap_hours,
                    calculated_at = CURRENT_TIMESTAMP;
                """,
                stats
            )

            # 4.4 Populate The Keep (Preferences & Date Oracle Vault)
            conn.execute("DELETE FROM preferences_vault WHERE contact_id = ?;", (contact_id,))
            if preferences:
                pref_rows = [
                    (
                        contact_id,
                        p["category"],
                        p["item_name"],
                        p["context_quote"],
                        p["time_stamp"],
                        p["status"],
                        p.get("target_person", "contact"),
                        p.get("ai_generated", 0),
                        p.get("metadata"),
                    )
                    for p in preferences
                ]
                conn.executemany(
                    """
                    INSERT INTO preferences_vault (
                        contact_id, category, item_name, context_quote, time_stamp, status,
                        target_person, ai_generated, metadata
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
                    """,
                    pref_rows
                )
        t_db = time.time() - t0
    finally:
        conn.close()

    total_time = time.time() - t_start

    return {
        "status": "success",
        "contact": {
            "id": contact_id,
            "raw_name": raw_contact,
            "display_name": display_name,
            "user_sender": user_sender,
        },
        "message_count": len(parsed_msgs),
        "turn_count": len(turns),
        "seam_count": len(seams),
        "neuro_seams_classified": len(classified_seams),
        "preferences_found": len(preferences),
        "chronemics": stats,
        "timing": {
            "parse_sec": round(t_parse, 3),
            "chronemics_sec": round(t_chron, 3),
            "db_persist_sec": round(t_db, 3),
            "total_sec": round(total_time, 3),
        }
    }


if __name__ == "__main__":
    from openai import OpenAI
    sys.stdout.reconfigure(encoding="utf-8")
    load_dotenv(ROOT_DIR / ".env")

    client = None
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key:
        client = OpenAI(api_key=api_key)

    sample_path = ROOT_DIR / "data" / "assify_data.txt"
    if sample_path.exists():
        print(f"Testing ingest_service on {sample_path}...")
        text = sample_path.read_text(encoding="utf-8")
        result = ingest_chat(
            raw_text=text,
            user_sender="*",
            contact_display_name="Zombiee",
            openai_client=client
        )
        print("\n=== Ingestion Successful ===")
        print(f"Contact ID       : {result['contact']['id']}")
        print(f"Display Name     : {result['contact']['display_name']}")
        print(f"Total Messages   : {result['message_count']:,}")
        print(f"DB Write Time    : {result['timing']['db_persist_sec']}s")
        print(f"Total Pipeline   : {result['timing']['total_sec']}s")
        print(f"User Init Ratio  : {result['chronemics']['user_initiation_pct']}%")
        print(f"Contact Init     : {result['chronemics']['contact_initiation_pct']}%")
        print(f"The Keep Items   : {result['preferences_found']}")
