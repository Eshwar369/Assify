import os
import sys
import json
import time
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

# Add Assify root to sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT_DIR))

from backend.ingestion.parser import parse_whatsapp, detect_participants
from backend.analytics.chronemics import (
    aggregate_conversational_turns,
    detect_silence_seams,
    classify_seams_with_llm,
    _heuristic_seam_classification,
    synthesize_chronemics_metrics,
)

def run():
    sys.stdout.reconfigure(encoding="utf-8")
    load_dotenv(ROOT_DIR / ".env")
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("[ERROR] OPENAI_API_KEY is not set in .env!")
        return

    client = OpenAI(api_key=api_key)

    data_file = ROOT_DIR / "data" / "assify_data.txt"
    if not data_file.exists():
        print(f"[ERROR] Data file not found: {data_file}")
        return

    print("=" * 60)
    print("ASSIFY NEURO-SYMBOLIC CHRONEMICS ENGINE — REAL RUN")
    print("=" * 60)

    # 1. Parse Data
    t0 = time.time()
    raw_text = data_file.read_text(encoding="utf-8")
    senders = detect_participants(raw_text)
    print(f"[1/4] Senders detected: {senders}")
    user_sender = "*" if "*" in senders else senders[0]
    contact_sender = [s for s in senders if s != user_sender][0] if len(senders) > 1 else "Unknown"
    print(f"      User Role: '{user_sender}' | Contact Role: '{contact_sender}'")

    messages = parse_whatsapp(raw_text, user_sender=user_sender, contact_id="contact_sleepless_zombiee")
    t_parse = time.time() - t0
    print(f"      Parsed {len(messages):,} messages in {t_parse:.3f}s")

    # 2. Turn Aggregation (Symbolic Pass 1)
    t0 = time.time()
    turns = aggregate_conversational_turns(messages, threshold_seconds=90)
    t_turns = time.time() - t0
    print(f"[2/4] Aggregated into {len(turns):,} conversational bursts (turns) in {t_turns:.3f}s")

    # 3. Seam Detection (Symbolic Pass 2)
    t0 = time.time()
    seams = detect_silence_seams(turns, gap_hours=3.5)
    t_seams = time.time() - t0
    print(f"[3/4] Detected {len(seams)} silence seams (> 3.5h) in {t_seams:.3f}s")

    # 4. Neuro Pass (LLM Seam Classification with GPT-4o-mini)
    print(f"[4/4] Sending sampled seams to GPT-4o-mini for neuro classification...")
    t0 = time.time()
    classified_seams = classify_seams_with_llm(seams, openai_client=client, model="gpt-4o-mini", max_seams=40)
    t_llm = time.time() - t0
    print(f"      LLM Classification returned in {t_llm:.2f}s for {len(classified_seams)} seams")

    # Let's inspect classifications
    type_counts = {}
    for c in classified_seams:
        t = c.get("type", "UNKNOWN")
        type_counts[t] = type_counts.get(t, 0) + 1

    print("\n--- Seam Taxonomy Breakdown (GPT-4o-mini) ---")
    for stype, count in sorted(type_counts.items(), key=lambda x: -x[1]):
        pct = (count / len(classified_seams)) * 100 if classified_seams else 0
        print(f"  • {stype:<18}: {count:>3} ({pct:.1f}%)")

    # Print sample classified seams
    print("\n--- Sample Classified Seams (First 5) ---")
    for s in classified_seams[:5]:
        sid = s.get("seam_id")
        stype = s.get("type")
        init = s.get("initiator")
        reason = s.get("reason", "")
        # Find matching raw seam
        raw_match = next((raw for raw in seams if raw["seam_id"] == sid), None)
        gap = f"{raw_match['gap_hours']}h" if raw_match else "?"
        next_s = raw_match["next_sender"] if raw_match else "?"
        snippet = raw_match["next_snippet"][:50].replace('\n', ' ') if raw_match else ""
        print(f"  Seam #{sid} ({gap} silence | {next_s}): [{stype}] -> initiator: {init}")
        print(f"    Text: \"{snippet}...\"")
        print(f"    Reason: {reason}\n")

    # 5. Grounded Metric Synthesis
    stats = synthesize_chronemics_metrics(
        contact_id="contact_sleepless_zombiee",
        messages=messages,
        turns=turns,
        classified_seams=classified_seams
    )

    # Also compute heuristic baseline for comparison
    heuristic_seams = _heuristic_seam_classification(
        seams if len(seams) <= 40 else [seams[int(i * (len(seams)/40))] for i in range(40)]
    )
    heuristic_stats = synthesize_chronemics_metrics(
        contact_id="contact_sleepless_zombiee",
        messages=messages,
        turns=turns,
        classified_seams=heuristic_seams
    )

    print("=" * 60)
    print("FINAL CHRONEMICS TELEMETRY COMPARISON")
    print("=" * 60)
    print(f"Total Messages Analyzed   : {stats['total_messages']:,}")
    print(f"User Messages ('*')       : {stats['user_msg_count']:,} ({(stats['user_msg_count']/stats['total_messages'])*100:.1f}%)")
    print(f"Contact Messages (Zombiee): {stats['contact_msg_count']:,} ({(stats['contact_msg_count']/stats['total_messages'])*100:.1f}%)")
    print(f"User Median Delay         : {stats['user_median_delay_m']} min")
    print(f"Contact Median Delay      : {stats['contact_median_delay_m']} min")
    print(f"User Double Texts         : {stats['user_double_texts']}")
    print(f"Contact Double Texts      : {stats['contact_double_texts']}")
    print(f"Late Night Percentage     : {stats['late_night_pct']}%")
    print(f"Longest Silence Gap       : {stats['longest_gap_hours']} hours")
    print("-" * 60)
    print("INITIATION RATIO COMPARISON:")
    print(f"  • Grounded Neuro (GPT-4o-mini) : User {stats['user_initiation_pct']}% vs Contact {stats['contact_initiation_pct']}%")
    print(f"  • Pure Heuristic (Rule-based)  : User {heuristic_stats['user_initiation_pct']}% vs Contact {heuristic_stats['contact_initiation_pct']}%")
    print("=" * 60)

if __name__ == "__main__":
    run()
