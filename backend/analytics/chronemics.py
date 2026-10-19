import json
import statistics
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass, asdict


@dataclass
class ConversationalTurn:
    """
    Represents a merged conversational burst from one sender sent within < 90 seconds.
    Solves the 'rapid-fire 4-text' fragmentation illusion.
    """
    sender: str  # 'user' or 'contact'
    start_time: datetime
    end_time: datetime
    content: str
    message_count: int
    word_count: int


def parse_iso_or_datetime(ts: str | datetime) -> datetime:
    """Ensures timestamp is a native datetime object."""
    if isinstance(ts, datetime):
        return ts
    try:
        return datetime.fromisoformat(ts)
    except Exception:
        # Fallback for common formats
        for fmt in ("%Y-%m-%dT%H:%M:%S", "%Y-%m-%d %H:%M:%S"):
            try:
                return datetime.strptime(ts, fmt)
            except ValueError:
                pass
        raise ValueError(f"Cannot parse timestamp: {ts}")


def aggregate_conversational_turns(
    messages: List[Dict],
    threshold_seconds: int = 90
) -> List[ConversationalTurn]:
    """
    STAGE 1 (Symbolic Pass):
    Merges consecutive messages from the same sender sent within threshold_seconds.
    """
    if not messages:
        return []

    # Sort messages chronologically
    sorted_msgs = sorted(messages, key=lambda m: parse_iso_or_datetime(m["time_stamp"]))

    turns: List[ConversationalTurn] = []
    current_sender = sorted_msgs[0]["sender"]
    first_time = parse_iso_or_datetime(sorted_msgs[0]["time_stamp"])
    last_time = first_time
    contents = [sorted_msgs[0]["content"]]
    msg_count = 1

    for msg in sorted_msgs[1:]:
        sender = msg["sender"]
        msg_time = parse_iso_or_datetime(msg["time_stamp"])
        delta_sec = (msg_time - last_time).total_seconds()

        if sender == current_sender and delta_sec <= threshold_seconds:
            # Merge into active turn
            contents.append(msg["content"])
            last_time = msg_time
            msg_count += 1
        else:
            # Finalize previous turn
            full_text = "\n".join(contents)
            words = len(full_text.split())
            turns.append(
                ConversationalTurn(
                    sender=current_sender,
                    start_time=first_time,
                    end_time=last_time,
                    content=full_text,
                    message_count=msg_count,
                    word_count=words,
                )
            )
            # Start new turn
            current_sender = sender
            first_time = msg_time
            last_time = msg_time
            contents = [msg["content"]]
            msg_count = 1

    # Append the last turn
    full_text = "\n".join(contents)
    words = len(full_text.split())
    turns.append(
        ConversationalTurn(
            sender=current_sender,
            start_time=first_time,
            end_time=last_time,
            content=full_text,
            message_count=msg_count,
            word_count=words,
        )
    )

    return turns


def detect_silence_seams(
    turns: List[ConversationalTurn],
    gap_hours: float = 3.5
) -> List[Dict]:
    """
    STAGE 1.2 (Symbolic Pass):
    Finds transitions between turns where silence exceeds gap_hours.
    Extracts the seam context: what was said before silence, and what broke the silence.
    """
    seams = []
    for i in range(len(turns) - 1):
        prev_t = turns[i]
        next_t = turns[i + 1]
        gap_sec = (next_t.start_time - prev_t.end_time).total_seconds()
        gap_h = gap_sec / 3600.0

        if gap_h >= gap_hours:
            # Snippet of previous turn (last 180 chars)
            prev_snippet = prev_t.content[-180:].strip()
            # Snippet of next turn (first 180 chars)
            next_snippet = next_t.content[:180].strip()

            seams.append({
                "seam_id": len(seams) + 1,
                "gap_hours": round(gap_h, 1),
                "prev_sender": prev_t.sender,
                "prev_snippet": prev_snippet,
                "next_sender": next_t.sender,
                "next_snippet": next_snippet,
                "timestamp": next_t.start_time.isoformat(),
            })

    return seams


SEAM_CLASSIFICATION_PROMPT = """You are an expert Conversational Turn-Taking Analyst specializing in interpersonal relationship psychology.
Your task is to classify conversational transition "seams" across periods of silence.

Each seam contains:
- `gap_hours`: Hours of silence
- `prev_sender` and `prev_snippet`: What was said right before silence
- `next_sender` and `next_snippet`: What was said to break the silence

CLASSIFICATION TAXONOMY:
1. "TRUE_INITIATION": The next_sender genuinely started an entirely new conversation or topic after silence.
2. "CHASE_FOLLOWUP": The prev_sender and next_sender are the SAME PERSON, following up after being ignored or left on read.
3. "DELAYED_ANSWER": The next_sender is finally answering an unresolved question or topic from the prev_turn after hours of delay.
4. "ROUTINE_RITUAL": Standard greetings ("good morning", "good night", "gn", "gm", checking in routinely without new substance).

OUTPUT FORMAT:
Output JSON ONLY matching this structure:
{
  "classifications": [
    {
      "seam_id": 1,
      "type": "TRUE_INITIATION",
      "initiator": "user",
      "reason": "Started new topic about weekend dinner"
    }
  ]
}
"""


def classify_seams_with_llm(
    seams: List[Dict],
    openai_client=None,
    model: str = "gpt-4o-mini",
    max_seams: int = 40
) -> List[Dict]:
    """
    STAGE 2 (Neuro Pass):
    Sends candidate seams to GPT-4o-mini to categorize true initiations vs chasing.
    """
    if not seams:
        return []

    # Select up to max_seams evenly distributed across the conversation
    if len(seams) > max_seams:
        step = len(seams) / max_seams
        sampled_seams = [seams[int(i * step)] for i in range(max_seams)]
    else:
        sampled_seams = seams

    # If no client provided, use deterministic heuristic fallback
    if openai_client is None:
        return _heuristic_seam_classification(sampled_seams)

    payload = json.dumps([
        {
            "seam_id": s["seam_id"],
            "gap_hours": s["gap_hours"],
            "prev_sender": s["prev_sender"],
            "prev_snippet": s["prev_snippet"],
            "next_sender": s["next_sender"],
            "next_snippet": s["next_snippet"],
        }
        for s in sampled_seams
    ], ensure_ascii=False)

    try:
        response = openai_client.chat.completions.create(
            model=model,
            temperature=0.0,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": SEAM_CLASSIFICATION_PROMPT},
                {"role": "user", "content": f"Classify these transition seams:\n{payload}"}
            ]
        )
        data = json.loads(response.choices[0].message.content)
        return data.get("classifications", [])
    except Exception as e:
        print(f"Warning: LLM seam classification failed ({e}), using heuristic fallback.")
        return _heuristic_seam_classification(sampled_seams)


def _heuristic_seam_classification(seams: List[Dict]) -> List[Dict]:
    """Fallback classifier when offline or without API key."""
    classifications = []
    ritual_words = ["gm", "good morning", "gn", "good night", "morning", "night", "sweet dreams"]

    for s in seams:
        prev_s = s["prev_sender"]
        next_s = s["next_sender"]
        snippet_lower = s["next_snippet"].lower()

        if any(r in snippet_lower for r in ritual_words):
            class_type = "ROUTINE_RITUAL"
            initiator = "none"
        elif prev_s == next_s:
            class_type = "CHASE_FOLLOWUP"
            initiator = next_s
        elif "?" in s["prev_snippet"] and not any(r in snippet_lower for r in ritual_words):
            class_type = "DELAYED_ANSWER"
            initiator = "none"
        else:
            class_type = "TRUE_INITIATION"
            initiator = next_s

        classifications.append({
            "seam_id": s["seam_id"],
            "type": class_type,
            "initiator": initiator,
            "reason": "Heuristic rule fallback",
        })

    return classifications


def synthesize_chronemics_metrics(
    contact_id: str,
    messages: List[Dict],
    turns: List[ConversationalTurn],
    classified_seams: List[Dict]
) -> Dict:
    """
    STAGE 3 (Grounded Synthesis):
    Combines hard message counts with verified seam classifications.
    Returns dictionary matching the chronemics_stats table schema.
    """
    user_msgs = [m for m in messages if m["sender"] == "user"]
    contact_msgs = [m for m in messages if m["sender"] == "contact"]

    total_messages = len(messages)
    user_msg_count = len(user_msgs)
    contact_msg_count = len(contact_msgs)

    # 1. Initiation Counts from verified TRUE_INITIATION seams
    user_inits = sum(1 for c in classified_seams if c.get("type") == "TRUE_INITIATION" and c.get("initiator") == "user")
    contact_inits = sum(1 for c in classified_seams if c.get("type") == "TRUE_INITIATION" and c.get("initiator") == "contact")
    total_inits = user_inits + contact_inits

    if total_inits > 0:
        user_init_pct = round((user_inits / total_inits) * 100.0, 1)
        contact_init_pct = round((contact_inits / total_inits) * 100.0, 1)
    else:
        user_init_pct = 50.0
        contact_init_pct = 50.0

    # 2. Response Latencies (between conversational turns, excluding sleep gaps > 7h)
    user_delays_m: List[float] = []
    contact_delays_m: List[float] = []
    max_gap_hours = 0.0

    for i in range(len(turns) - 1):
        t1 = turns[i]
        t2 = turns[i + 1]
        gap_sec = (t2.start_time - t1.end_time).total_seconds()
        gap_hours = gap_sec / 3600.0

        if gap_hours > max_gap_hours:
            max_gap_hours = gap_hours

        # Only measure turns where sender alternates (turn-taking response)
        if t1.sender != t2.sender:
            delay_minutes = gap_sec / 60.0
            # If replied in the same minute (0 sec in WhatsApp export), treat as ~0.5 min (30s)
            effective_delay = 0.5 if delay_minutes == 0 else delay_minutes
            # Exclude overnight sleep gaps (> 7 hours)
            if effective_delay <= 420.0 and effective_delay >= 0:
                if t2.sender == "user":
                    user_delays_m.append(effective_delay)
                else:
                    contact_delays_m.append(effective_delay)

    user_median_delay = round(statistics.median(user_delays_m), 1) if user_delays_m else 5.0
    contact_median_delay = round(statistics.median(contact_delays_m), 1) if contact_delays_m else 5.0

    # 3. Double-Text Counts (Turns with message_count >= 2)
    user_double_texts = sum(1 for t in turns if t.sender == "user" and t.message_count >= 2)
    contact_double_texts = sum(1 for t in turns if t.sender == "contact" and t.message_count >= 2)

    # 4. Late-Night Percentage (Messages sent between 11 PM and 4 AM)
    late_night_count = 0
    for m in messages:
        dt = parse_iso_or_datetime(m["time_stamp"])
        if dt.hour >= 23 or dt.hour < 4:
            late_night_count += 1

    late_night_pct = round((late_night_count / total_messages) * 100.0, 1) if total_messages > 0 else 0.0

    return {
        "contact_id": contact_id,
        "total_messages": total_messages,
        "user_msg_count": user_msg_count,
        "contact_msg_count": contact_msg_count,
        "user_initiation_pct": user_init_pct,
        "contact_initiation_pct": contact_init_pct,
        "user_median_delay_m": user_median_delay,
        "contact_median_delay_m": contact_median_delay,
        "user_double_texts": user_double_texts,
        "contact_double_texts": contact_double_texts,
        "late_night_pct": late_night_pct,
        "longest_gap_hours": round(max_gap_hours, 1),
    }
