"""
==============================================================================
ASSIFY — Daily Forensic & Chronemics Assessment Engine
Target: Assessment of conversation records from October 19th (or any target date)
Stack: SQLite (WAL) + Python Deterministic Chronemics + GPT-4o-mini Structured JSON
==============================================================================
"""

import os
import sys
import json
import sqlite3
import argparse
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, List, Optional, Tuple
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Ensure Assify workspace root is on sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from backend.database.db import get_db_connection
from backend.analytics.chronemics import aggregate_conversational_turns, parse_iso_or_datetime
from backend.profiler.synthesizer import CULTURAL_PRAGMATICS_ENGINE


# ==============================================================================
# 1. Pydantic Schema for Structured Day Assessment
# ==============================================================================
class IconicReceipt(BaseModel):
    quote: str = Field(description="Exact quote from the day's messages")
    speaker: str = Field(description="'user' or 'contact'")
    context_time: str = Field(description="Approximate time, e.g., '01:00 AM' or '22:00 PM'")
    forensic_roast: str = Field(description="Sharp, brutally honest Delulu Check commentary")


class DailyBehaviorFlag(BaseModel):
    flag_type: str = Field(description="'red_flag' | 'green_flag'")
    category: str = Field(description="e.g. 'Insomnia Bonding', 'Vulnerability Avoidance', 'Emotional Honesty'")
    evidence: str = Field(description="Specific quote or interaction pattern from this date")
    verdict: str = Field(description="Forensic psychological breakdown")


class DayAssessmentReport(BaseModel):
    target_date: str = Field(description="Date analyzed, e.g. '2026-10-19'")
    daily_dynamic_title: str = Field(description="Witty, theatrical headline for this day's interaction")
    delulu_score: int = Field(ge=0, le=100, description="Delusion Index for this specific day (0-100)")
    chemistry_score: int = Field(ge=0, le=100, description="Banter & intimacy chemistry for this day (0-100)")
    power_balance_user: int = Field(ge=0, le=100, description="User power percentage (0-100)")
    power_balance_contact: int = Field(ge=0, le=100, description="Contact power percentage (0-100)")
    primary_vibe: str = Field(description="e.g. 'Chaotic Late-Night Banter morphing into Long-Distance Melancholy'")
    thematic_arc_breakdown: List[Dict[str, str]] = Field(
        description="Chronological phases of the day (phase_title, time_window, emotional_shift, summary)"
    )
    core_vulnerability_event: str = Field(description="The most emotionally honest or pivotal moment of the day")
    red_flags: List[DailyBehaviorFlag] = Field(description="Key red flags logged today")
    green_flags: List[DailyBehaviorFlag] = Field(description="Key green flags logged today")
    greatest_hits: List[IconicReceipt] = Field(description="Top 3 to 5 iconic receipts from the day")
    sociolinguistic_notes: str = Field(
        description="Decoding of Telugu/Hinglish banter ('pulihora', 'yedhava', 'chetha la undi') & code switching"
    )
    the_verdict: str = Field(description="Brutal Delulu Check style closing ruling on where things stand")
    prescription: str = Field(description="Clear, actionable next step for the user")


# ==============================================================================
# 2. Database Retrieval for Target Date
# ==============================================================================
def fetch_messages_for_date(
    date_str: str = "2026-10-19",
    contact_id: Optional[str] = None,
    db_path: Optional[Path | str] = None,
) -> Tuple[Dict[str, Any], List[Dict[str, Any]]]:
    """
    Fetches contact profile and all messages for a specific calendar date (YYYY-MM-DD).
    """
    conn = get_db_connection(db_path)
    try:
        # Resolve contact
        if contact_id:
            contact = conn.execute("SELECT * FROM contacts WHERE id = ?", (contact_id,)).fetchone()
        else:
            contact = conn.execute("SELECT * FROM contacts LIMIT 1;").fetchone()

        if not contact:
            raise ValueError("No contact records found in database. Run ingestion first!")

        cid = contact["id"]

        # Fetch messages within date range [YYYY-MM-DD 00:00:00, YYYY-MM-DD 23:59:59]
        query = """
            SELECT id, contact_id, time_stamp, sender, raw_sender, content, media_type, is_question
            FROM messages
            WHERE contact_id = ? 
              AND time_stamp >= ? 
              AND time_stamp < date(?, '+1 day')
            ORDER BY time_stamp ASC
        """
        rows = conn.execute(query, (cid, date_str, date_str)).fetchall()
        messages = [dict(r) for r in rows]

        return dict(contact), messages
    finally:
        conn.close()


# ==============================================================================
# 3. 0-LLM Deterministic Chronemics Analysis (The Mathematical Truth)
# ==============================================================================
def compute_daily_chronemics(messages: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Performs empirical chronemics telemetry on messages strictly within the day:
    - Volume & Sender ratios
    - Word & character density
    - Conversational Turn aggregation (<90s threshold)
    - Response latencies (median, p90)
    - Double-texting bursts
    - Circadian distribution & Hourly histogram
    """
    total = len(messages)
    if total == 0:
        return {"total_messages": 0}

    user_msgs = [m for m in messages if m["sender"] == "user"]
    contact_msgs = [m for m in messages if m["sender"] == "contact"]

    user_cnt = len(user_msgs)
    contact_cnt = len(contact_msgs)
    user_pct = round((user_cnt / total) * 100, 1)
    contact_pct = round((contact_cnt / total) * 100, 1)

    # Word & Char counts
    user_words = sum(len(m.get("content", "").split()) for m in user_msgs)
    contact_words = sum(len(m.get("content", "").split()) for m in contact_msgs)

    user_chars = sum(len(m.get("content", "")) for m in user_msgs)
    contact_chars = sum(len(m.get("content", "")) for m in contact_msgs)

    avg_user_word_len = round(user_words / max(1, user_cnt), 1)
    avg_contact_word_len = round(contact_words / max(1, contact_cnt), 1)

    # Turns Aggregation
    turns = aggregate_conversational_turns(messages, threshold_seconds=90)

    # Double texts (turns with > 1 message)
    user_double_texts = sum(t.message_count - 1 for t in turns if t.sender == "user" and t.message_count > 1)
    contact_double_texts = sum(t.message_count - 1 for t in turns if t.sender == "contact" and t.message_count > 1)

    # Response latencies between alternating turns
    user_latencies_sec: List[float] = []
    contact_latencies_sec: List[float] = []

    for i in range(len(turns) - 1):
        t1 = turns[i]
        t2 = turns[i + 1]
        delta_sec = (t2.start_time - t1.end_time).total_seconds()

        # Only measure conversational responses (< 3 hours), exclude long sleep gaps
        if 0 <= delta_sec <= 10800 and t1.sender != t2.sender:
            if t2.sender == "user":
                user_latencies_sec.append(delta_sec)
            else:
                contact_latencies_sec.append(delta_sec)

    import statistics
    user_median_delay_m = round(statistics.median(user_latencies_sec) / 60.0, 2) if user_latencies_sec else 0.5
    contact_median_delay_m = round(statistics.median(contact_latencies_sec) / 60.0, 2) if contact_latencies_sec else 0.5

    user_p90_delay_m = round(statistics.quantiles(user_latencies_sec, n=10)[8] / 60.0, 2) if len(user_latencies_sec) >= 10 else user_median_delay_m
    contact_p90_delay_m = round(statistics.quantiles(contact_latencies_sec, n=10)[8] / 60.0, 2) if len(contact_latencies_sec) >= 10 else contact_median_delay_m

    # Circadian distribution (Hours)
    hourly_distribution: Dict[int, Dict[str, int]] = {h: {"user": 0, "contact": 0, "total": 0} for h in range(24)}
    late_night_count = 0  # 00:00 to 05:00
    morning_count = 0     # 05:00 to 12:00
    afternoon_count = 0   # 12:00 to 17:00
    evening_count = 0     # 17:00 to 24:00

    for m in messages:
        dt = parse_iso_or_datetime(m["time_stamp"])
        h = dt.hour
        sender = m["sender"]
        if sender in ("user", "contact"):
            hourly_distribution[h][sender] += 1
            hourly_distribution[h]["total"] += 1

        if 0 <= h < 5:
            late_night_count += 1
        elif 5 <= h < 12:
            morning_count += 1
        elif 12 <= h < 17:
            afternoon_count += 1
        else:
            evening_count += 1

    return {
        "total_messages": total,
        "user_msg_count": user_cnt,
        "contact_msg_count": contact_cnt,
        "user_pct": user_pct,
        "contact_pct": contact_pct,
        "user_words": user_words,
        "contact_words": contact_words,
        "avg_user_words_per_msg": avg_user_word_len,
        "avg_contact_words_per_msg": avg_contact_word_len,
        "total_turns": len(turns),
        "user_double_texts": user_double_texts,
        "contact_double_texts": contact_double_texts,
        "user_median_delay_m": user_median_delay_m,
        "contact_median_delay_m": contact_median_delay_m,
        "user_p90_delay_m": user_p90_delay_m,
        "contact_p90_delay_m": contact_p90_delay_m,
        "late_night_count": late_night_count,
        "late_night_pct": round((late_night_count / total) * 100, 1),
        "morning_count": morning_count,
        "morning_pct": round((morning_count / total) * 100, 1),
        "afternoon_count": afternoon_count,
        "afternoon_pct": round((afternoon_count / total) * 100, 1),
        "evening_count": evening_count,
        "evening_pct": round((evening_count / total) * 100, 1),
        "hourly_distribution": hourly_distribution,
    }


# ==============================================================================
# 4. Multi-Phase Transcript Sampling for LLM Synthesis
# ==============================================================================
def sample_daily_transcript(messages: List[Dict[str, Any]], max_per_phase: int = 40) -> str:
    """
    Partitions the target day's messages into 4 distinct chronological windows
    to provide the LLM a balanced, representative picture without token truncation:
    - Phase 1: Late Night / Insomnia (00:00 - 05:00)
    - Phase 2: Morning / Awakening (05:00 - 12:00)
    - Phase 3: Afternoon Sync (12:00 - 17:00)
    - Phase 4: Evening & Nightfall (17:00 - 24:00)
    """
    phase_1_msgs = []
    phase_2_msgs = []
    phase_3_msgs = []
    phase_4_msgs = []

    for m in messages:
        dt = parse_iso_or_datetime(m["time_stamp"])
        h = dt.hour
        if 0 <= h < 5:
            phase_1_msgs.append(m)
        elif 5 <= h < 12:
            phase_2_msgs.append(m)
        elif 12 <= h < 17:
            phase_3_msgs.append(m)
        else:
            phase_4_msgs.append(m)

    def extract_subsample(msg_list: List[Dict], count: int) -> List[Dict]:
        if len(msg_list) <= count:
            return msg_list
        # Pick first 15, middle stepped, and last 15
        head = msg_list[:12]
        tail = msg_list[-13:]
        mid_pool = msg_list[12:-13]
        step = max(1, len(mid_pool) // (count - 25))
        mid = [mid_pool[j] for j in range(0, len(mid_pool), step)][:(count - 25)]
        return head + mid + tail

    phases = [
        ("PHASE 1: THE MIDNIGHT TO 4 AM INSOMNIA MARATHON (LATE NIGHT)", extract_subsample(phase_1_msgs, max_per_phase)),
        ("PHASE 2: MORNING RESUMPTION & DAILY AWAKENING (05:00 - 12:00)", extract_subsample(phase_2_msgs, max_per_phase)),
        ("PHASE 3: AFTERNOON DISPATCHES & SOCIAL UPDATES (12:00 - 17:00)", extract_subsample(phase_3_msgs, max_per_phase)),
        ("PHASE 4: EVENING WIND-DOWN & NIGHT CLIMAX (17:00 - 24:00)", extract_subsample(phase_4_msgs, max_per_phase)),
    ]

    blocks = []
    for title, m_list in phases:
        if not m_list:
            continue
        lines = [f"\n=== {title} ({len(m_list)} sampled exchanges) ==="]
        for m in m_list:
            ts = parse_iso_or_datetime(m["time_stamp"]).strftime("%H:%M")
            sender = m["sender"].upper()
            content = m.get("content", "").replace("\n", " ").strip()
            if content and "<media omitted>" not in content.lower():
                lines.append(f"[{ts}] {sender}: {content[:160]}")
        blocks.append("\n".join(lines))

    return "\n".join(blocks)


# ==============================================================================
# 5. Neuro-LLM Assessment Engine (GPT-4o-mini)
# ==============================================================================
DAY_ASSESSMENT_PROMPT = """You are the Senior Relationship Intelligence Forensic Engine for ASSIFY (the Delulu Check production benchmark).
Your mission is to perform a forensic, culturally grounded, comedy-roasted but psychologically precise assessment of an entire single day of conversations ({target_date}).

{cultural_engine}

EMPIRICAL TELEMETRY FOR THIS DAY:
- Total Messages Today: {total_messages:,}
- Volume Split: Contact {contact_pct}% ({contact_count:,} msgs) vs User {user_pct}% ({user_count:,} msgs)
- Double-Text Bursts: Contact {contact_double_texts:,} vs User {user_double_texts:,}
- Response Speed (Median): Contact {contact_median}m vs User {user_median}m
- Response Speed (P90): Contact {contact_p90}m vs User {user_p90}m
- Circadian Profile: {late_night_pct}% of the day's messages sent during the late-night window (00:00 - 05:00)!

CRITICAL GUIDELINES:
1. DELULU PRODUCTION BENCHMARK: Roast with surgical precision based on real empirical events. Never invent lazy stereotypes (e.g., do not call Contact a dry texter or ghoster when Contact sent {contact_pct}% of the 3,000 messages and hundreds of double-texts!).
2. POWER BALANCE CONSTRAINTS: Power balance must strictly reflect the day's real dynamics. Both respond in under 1 minute; Contact dominates volume. Power should remain within 40/60 to 60/40.
3. THE EMOTIONAL ARC OF THIS DAY:
   Pay close attention to how the day progresses:
   - The 1 AM - 4 AM banter, flirting ('Actually makeout a day keeps the doctor away', 'pothav ra yedhava'), and existential talk about breakups.
   - The afternoon church and daily routines.
   - The late-night shift around 22:00 where they confront the agonizing reality of long distance ('Ee long distance em baledu 😭😭', 'Chetha la undi').
4. ICONIC RECEIPTS: Cite 3 to 5 real quotes from today's transcript and deliver hilarious, insightful commentary.

Generate a JSON object strictly adhering to the schema.
"""


def run_llm_day_assessment(
    contact: Dict[str, Any],
    stats: Dict[str, Any],
    messages: List[Dict[str, Any]],
    date_str: str = "2026-10-19",
    openai_client=None,
    model: str = "gpt-4o-mini",
) -> DayAssessmentReport:
    """
    Executes the Neuro-Symbolic LLM pass using OpenAI GPT-4o-mini in structured JSON mode.
    """
    if openai_client is None:
        load_dotenv(ROOT_DIR / ".env")
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY missing from environment or .env!")
        from openai import OpenAI
        openai_client = OpenAI(api_key=api_key)

    transcript_sample = sample_daily_transcript(messages, max_per_phase=45)

    prompt = DAY_ASSESSMENT_PROMPT.format(
        target_date=date_str,
        cultural_engine=CULTURAL_PRAGMATICS_ENGINE,
        total_messages=stats["total_messages"],
        contact_pct=stats["contact_pct"],
        contact_count=stats["contact_msg_count"],
        user_pct=stats["user_pct"],
        user_count=stats["user_msg_count"],
        contact_double_texts=stats["contact_double_texts"],
        user_double_texts=stats["user_double_texts"],
        contact_median=stats["contact_median_delay_m"],
        user_median=stats["user_median_delay_m"],
        contact_p90=stats["contact_p90_delay_m"],
        user_p90=stats["user_p90_delay_m"],
        late_night_pct=stats["late_night_pct"],
    )

    schema_json = json.dumps(DayAssessmentReport.model_json_schema(), indent=2)

    user_payload = f"""Analyze the following single-day transcript for {date_str} between User and {contact['display_name']}:

{transcript_sample}

Generate the assessment adhering to this JSON schema:
{schema_json}
"""

    response = openai_client.chat.completions.create(
        model=model,
        temperature=0.7,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": user_payload},
        ],
    )

    raw_json = response.choices[0].message.content
    parsed_data = json.loads(raw_json)
    return DayAssessmentReport.model_validate(parsed_data)


# ==============================================================================
# 6. Terminal Display & ASCII Visualizer
# ==============================================================================
def render_terminal_report(
    contact: Dict[str, Any],
    stats: Dict[str, Any],
    report: Optional[DayAssessmentReport] = None,
    date_str: str = "2026-10-19",
):
    """
    Prints a rich, formatted terminal dashboard of the day's assessment.
    """
    c_name = contact.get("display_name", "Contact")
    u_name = contact.get("user_name", "User")
    total = stats["total_messages"]

    print("\n" + "█" * 78)
    print(f"  ASSIFY FORENSIC ASSESSMENT — DATE: {date_str} (MESSAGES EVALUATION)")
    print(f"  Participants: {u_name} (User) vs {c_name} (Contact)")
    print("█" * 78)

    print("\n" + "━" * 78)
    print("📊 1. DETERMINISTIC CHRONEMICS TELEMETRY (0-LLM EMPIRICAL METRICS)")
    print("━" * 78)
    print(f"  Total Messages Exchanged : {total:,}")
    print(f"  Message Share            : {stats['contact_pct']}% {c_name} ({stats['contact_msg_count']:,}) | {stats['user_pct']}% {u_name} ({stats['user_msg_count']:,})")
    print(f"  Word Count Split         : {stats['contact_words']:,} words ({c_name}) vs {stats['user_words']:,} words ({u_name})")
    print(f"  Avg Words Per Message    : {stats['avg_contact_words_per_msg']} ({c_name}) vs {stats['avg_user_words_per_msg']} ({u_name})")
    print(f"  Double-Text Bursts       : {stats['contact_double_texts']} ({c_name}) vs {stats['user_double_texts']} ({u_name})")
    print(f"  Median Response Latency  : {c_name}: {stats['contact_median_delay_m']}m ({round(stats['contact_median_delay_m']*60)}s) | {u_name}: {stats['user_median_delay_m']}m ({round(stats['user_median_delay_m']*60)}s)")
    print(f"  P90 Response Latency     : {c_name}: {stats['contact_p90_delay_m']}m | {u_name}: {stats['user_p90_delay_m']}m")
    print(f"  Late-Night Share (0-5 AM): {stats['late_night_pct']}% ({stats['late_night_count']:,} messages)")

    # ASCII 24-Hour Velocity Histogram
    print("\n  24-Hour Conversational Velocity Profile (Hourly Activity):")
    hourly = stats.get("hourly_distribution", {})
    max_h_msgs = max((hourly[h]["total"] for h in range(24)), default=1)
    for h in range(24):
        h_data = hourly.get(h, {"user": 0, "contact": 0, "total": 0})
        t_count = h_data["total"]
        bar_len = int((t_count / max(1, max_h_msgs)) * 36)
        bar = "█" * bar_len
        u_sub = h_data["user"]
        c_sub = h_data["contact"]
        if t_count > 0:
            print(f"    {h:02d}:00 │ {bar:<36} {t_count:3d} msgs (U:{u_sub:2d} | C:{c_sub:2d})")

    if report:
        print("\n" + "━" * 78)
        print("🧠 2. NEURO-PSYCHOLOGICAL ASSESSMENT & DELULU DOSSIER (GPT-4o-mini)")
        print("━" * 78)
        print(f"  Daily Dynamic Headline : \"{report.daily_dynamic_title}\"")
        print(f"  Delulu Score for Today : {report.delulu_score}/100")
        print(f"  Chemistry Score        : {report.chemistry_score}/100")
        print(f"  Power Balance          : {u_name} {report.power_balance_user}% vs {c_name} {report.power_balance_contact}%")
        print(f"  Primary Emotional Vibe : {report.primary_vibe}")
        print(f"  Core Vulnerability     : {report.core_vulnerability_event}")

        print("\n  🎭 Thematic Day Arcs:")
        for arc in report.thematic_arc_breakdown:
            title = arc.get("phase_title", "Phase")
            window = arc.get("time_window", "")
            summary = arc.get("summary", "")
            shift = arc.get("emotional_shift", "")
            print(f"    • [{window}] {title}")
            print(f"      Shift  : {shift}")
            print(f"      Detail : {summary}\n")

        print("  🚩 Behavioral Flags Detected Today:")
        for rf in report.red_flags:
            print(f"    ❌ [{rf.category.upper()}]: {rf.evidence}")
            print(f"       Forensic: {rf.verdict}")
        for gf in report.green_flags:
            print(f"    ✅ [{gf.category.upper()}]: {gf.evidence}")
            print(f"       Forensic: {gf.verdict}")

        print("\n  🔥 Iconic Receipts (Greatest Hits from the 19th):")
        for hit in report.greatest_hits:
            print(f"    💬 [{hit.context_time}] {hit.speaker.upper()}: \"{hit.quote}\"")
            print(f"       Roast: {hit.forensic_roast}\n")

        print("  🗣️ Sociolinguistic & Cultural Context:")
        print(f"    {report.sociolinguistic_notes}")

        print("\n" + "━" * 78)
        print("⚖️ 3. THE FINAL VERDICT & ACTIONABLE PRESCRIPTION")
        print("━" * 78)
        print(f"  THE VERDICT  : {report.the_verdict}")
        print(f"  PRESCRIPTION : {report.prescription}")

    print("█" * 78 + "\n")


# ==============================================================================
# 7. Markdown Report Generator
# ==============================================================================
def generate_markdown_report(
    contact: Dict[str, Any],
    stats: Dict[str, Any],
    report: Optional[DayAssessmentReport] = None,
    date_str: str = "2026-10-19",
) -> str:
    """
    Generates a GitHub-flavored Markdown dossier for documentation and sharing.
    """
    c_name = contact.get("display_name", "Contact")
    u_name = contact.get("user_name", "User")
    total = stats["total_messages"]

    md = []
    md.append(f"# 📋 ASSIFY Relationship Forensic Assessment: {date_str}\n")
    md.append(f"> **Target Date:** `{date_str}` | **Participants:** `{u_name}` & `{c_name}`\n")

    md.append("## 📊 1. Mathematical Chronemics Telemetry\n")
    md.append("| Metric | Value | Detail |")
    md.append("| :--- | :--- | :--- |")
    md.append(f"| **Total Messages** | `{total:,}` | Full day message exchange |")
    md.append(f"| **Message Share** | **{stats['contact_pct']}% {c_name}** vs **{stats['user_pct']}% {u_name}** | {c_name}: {stats['contact_msg_count']:,} msgs, {u_name}: {stats['user_msg_count']:,} msgs |")
    md.append(f"| **Word Count** | `{stats['contact_words']:,}` ({c_name}) vs `{stats['user_words']:,}` ({u_name}) | Total words spoken |")
    md.append(f"| **Double Texts** | `{stats['contact_double_texts']}` ({c_name}) vs `{stats['user_double_texts']}` ({u_name}) | Multi-message bursts without reply |")
    md.append(f"| **Median Delay** | `{stats['contact_median_delay_m']}m` ({c_name}) vs `{stats['user_median_delay_m']}m` ({u_name}) | Sub-minute response cadence |")
    md.append(f"| **P90 Delay** | `{stats['contact_p90_delay_m']}m` ({c_name}) vs `{stats['user_p90_delay_m']}m` ({u_name}) | 90th percentile latency |")
    md.append(f"| **Late-Night Share** | `{stats['late_night_pct']}%` | {stats['late_night_count']:,} msgs between 00:00 - 05:00 AM |\n")

    if report:
        md.append("## 🎭 2. Neuro-Psychological Dossier\n")
        md.append(f"### **Headline:** \"{report.daily_dynamic_title}\"\n")
        md.append(f"- **Delulu Score:** `{report.delulu_score}/100`")
        md.append(f"- **Chemistry Score:** `{report.chemistry_score}/100`")
        md.append(f"- **Power Balance:** `{u_name} {report.power_balance_user}%` vs `{c_name} {report.power_balance_contact}%`")
        md.append(f"- **Primary Vibe:** {report.primary_vibe}")
        md.append(f"- **Core Vulnerability:** {report.core_vulnerability_event}\n")

        md.append("### 🕰️ Thematic Conversation Arcs\n")
        for arc in report.thematic_arc_breakdown:
            md.append(f"#### {arc.get('phase_title')} ({arc.get('time_window')})")
            md.append(f"- **Shift:** {arc.get('emotional_shift')}")
            md.append(f"- **Summary:** {arc.get('summary')}\n")

        md.append("### 🚩 Behavioral Flags\n")
        for rf in report.red_flags:
            md.append(f"- ❌ **[{rf.category}]:** *\"{rf.evidence}\"*\n  - **Forensic:** {rf.verdict}")
        for gf in report.green_flags:
            md.append(f"- ✅ **[{gf.category}]:** *\"{gf.evidence}\"*\n  - **Forensic:** {gf.verdict}\n")

        md.append("### 🔥 Greatest Hits & Iconic Receipts\n")
        for hit in report.greatest_hits:
            md.append(f"> **[{hit.context_time}] {hit.speaker.upper()}:** \"{hit.quote}\"\n>\n> *Roast:* {hit.forensic_roast}\n")

        md.append("### 🗣️ Sociolinguistic & Cultural Context\n")
        md.append(f"{report.sociolinguistic_notes}\n")

        md.append("## ⚖️ 3. The Final Verdict & Prescription\n")
        md.append(f"> **VERDICT:** {report.the_verdict}\n")
        md.append(f"**Actionable Prescription:**\n{report.prescription}\n")

    return "\n".join(md)


# ==============================================================================
# 8. Main Entrypoint & Reusable API
# ==============================================================================
def assess_date(
    date_str: str = "2026-10-19",
    contact_id: Optional[str] = None,
    run_llm: bool = True,
    save_markdown_path: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Public reusable API function. Can be called from FastAPI endpoints or scripts.
    """
    contact, messages = fetch_messages_for_date(date_str, contact_id)
    if not messages:
        raise ValueError(f"No messages found for date {date_str} and contact {contact_id or 'default'}")

    stats = compute_daily_chronemics(messages)

    report = None
    if run_llm:
        report = run_llm_day_assessment(contact, stats, messages, date_str=date_str)

    if save_markdown_path:
        md_content = generate_markdown_report(contact, stats, report, date_str=date_str)
        p = Path(save_markdown_path)
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(md_content, encoding="utf-8")

    return {
        "contact": contact,
        "date": date_str,
        "chronemics": stats,
        "report": report.model_dump() if report else None,
    }


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Assess conversation messages from the database for a specific date (default: 2026-10-19)")
    parser.add_argument("--date", type=str, default="2026-10-19", help="Target date in YYYY-MM-DD format (default: 2026-10-19)")
    parser.add_argument("--contact", type=str, default=None, help="Optional contact ID (defaults to first contact in DB)")
    parser.add_argument("--no-llm", action="store_true", help="Skip OpenAI LLM pass (chronemics-only mode)")
    parser.add_argument("--save-md", type=str, default="MARKDOWN/assessment_2026_10_19.md", help="Save markdown dossier to path")
    args = parser.parse_args()

    print(f"[*] Loading messages for date: {args.date}...")
    contact, messages = fetch_messages_for_date(args.date, args.contact)
    print(f"[*] Retrieved {len(messages):,} messages for '{contact['display_name']}' on {args.date}.")

    print("[*] Computing 0-LLM chronemics telemetry...")
    stats = compute_daily_chronemics(messages)

    report = None
    if not args.no_llm:
        print("[*] Running GPT-4o-mini structured forensic assessment...")
        report = run_llm_day_assessment(contact, stats, messages, date_str=args.date)

    # Render terminal output
    render_terminal_report(contact, stats, report, date_str=args.date)

    if args.save_md:
        md_content = generate_markdown_report(contact, stats, report, date_str=args.date)
        out_file = ROOT_DIR / args.save_md
        out_file.parent.mkdir(parents=True, exist_ok=True)
        out_file.write_text(md_content, encoding="utf-8")
        print(f"[✓] Saved Markdown dossier to: {out_file}")


if __name__ == "__main__":
    main()
