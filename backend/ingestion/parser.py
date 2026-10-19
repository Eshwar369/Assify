import re
import zipfile
import io
from datetime import datetime
from typing import List, Dict, Optional


def clean_raw_text(text: str) -> str:
    """
    Strips invisible unicode control characters and normalizes whitespace.
    Fixes the iOS \u200e invisible LTR mark and Android \u202f narrow space.
    """
    return (
        text.replace("\u200e", "")
            .replace("\u200f", "")
            .replace("\ufeff", "")
            .replace("\u202f", " ")
            .replace("\u00a0", " ")
            .replace("\r\n", "\n")
    )


# Regex Pattern A: Android format (e.g., "23/03/2026, 12:15 - Sender: Message")
ANDROID_REGEX = re.compile(
    r"^(\d{1,4}[/.-]\d{1,2}[/.-]\d{1,4},?\s+\d{1,2}:\d{2}(?::\d{2})?(?:\s*[ap]m)?)\s*-\s*([^:]+):\s*(.*)$",
    re.IGNORECASE,
)

# Regex Pattern B: iOS format (e.g., "[23/03/26, 12:15:30 PM] Sender: Message")
IOS_REGEX = re.compile(
    r"^\[(\d{1,4}[/.-]\d{1,2}[/.-]\d{1,4},?\s+\d{1,2}:\d{2}(?::\d{2})?(?:\s*[ap]m)?)\]\s*([^:]+):\s*(.*)$",
    re.IGNORECASE,
)

# System message patterns (no colon separating sender and message)
SYSTEM_PATTERNS = [
    "Messages and calls are end-to-end encrypted",
    "disappearing messages",
    "changed the subject",
    "changed this group's icon",
    "added you",
    "left the group",
    "security code changed",
]


def extract_text_from_file_bytes(file_bytes: bytes, filename: str) -> str:
    """
    Handles both raw .txt files and .zip exports from WhatsApp.
    """
    if filename.endswith(".zip"):
        with zipfile.ZipFile(io.BytesIO(file_bytes)) as z:
            txt_files = [f for f in z.namelist() if f.endswith(".txt") and not f.startswith("__MACOSX")]
            if not txt_files:
                raise ValueError("No .txt chat export found inside the uploaded ZIP archive.")
            raw_bytes = z.read(txt_files[0])
            return raw_bytes.decode("utf-8", errors="replace")
    else:
        return file_bytes.decode("utf-8", errors="replace")


def detect_participants(raw_text: str) -> List[str]:
    """
    Inspects the chat header to discover unique senders.
    Returns: List of unique sender names (e.g., ['*', 'Sleepless Zombiee'])
    """
    sanitized = clean_raw_text(raw_text)
    senders = set()

    for line in sanitized.split("\n")[:300]:
        line = line.strip()
        if not line or any(sys in line for sys in SYSTEM_PATTERNS):
            continue

        match = ANDROID_REGEX.match(line) or IOS_REGEX.match(line)
        if match:
            sender = match.group(2).strip()
            if not any(sys in sender for sys in SYSTEM_PATTERNS):
                senders.add(sender)

    return sorted(list(senders))


def parse_timestamp(ts_str: str) -> Optional[datetime]:
    """
    Parses timestamp string into standard Python datetime object.
    Supports 12-hour AM/PM and 24-hour formats with various date separators.
    """
    ts_str = ts_str.strip().rstrip(",")
    formats = [
        "%d/%m/%Y, %H:%M",
        "%d/%m/%y, %H:%M",
        "%d/%m/%Y, %I:%M %p",
        "%d/%m/%y, %I:%M %p",
        "%d/%m/%Y, %I:%M:%S %p",
        "%d/%m/%y, %I:%M:%S %p",
        "%m/%d/%Y, %I:%M %p",
        "%m/%d/%y, %I:%M %p",
        "%Y-%m-%d, %H:%M",
        "%Y/%m/%d, %H:%M",
    ]
    for fmt in formats:
        try:
            return datetime.strptime(ts_str, fmt)
        except ValueError:
            continue
    return None


def parse_whatsapp(
    raw_text: str,
    user_sender: str,
    contact_id: str
) -> List[Dict]:
    """
    Main parser: Converts raw WhatsApp text into normalized database records.
    Handles multi-line messages, media tagging, and sender standardization.
    """
    sanitized = clean_raw_text(raw_text)
    messages = []
    current_msg = None

    for line_num, line in enumerate(sanitized.split("\n")):
        line_clean = line.strip()
        if not line_clean:
            continue

        if any(sys in line_clean for sys in SYSTEM_PATTERNS):
            continue

        match = ANDROID_REGEX.match(line_clean) or IOS_REGEX.match(line_clean)

        if match:
            if current_msg:
                messages.append(current_msg)

            raw_ts = match.group(1).strip()
            raw_sender = match.group(2).strip()
            content = match.group(3).strip()

            parsed_dt = parse_timestamp(raw_ts)
            dt_iso = parsed_dt.isoformat() if parsed_dt else raw_ts

            sender_role = "user" if raw_sender == user_sender else "contact"

            media_type = "text"
            is_deleted = False

            lower_content = content.lower()
            if "<media omitted>" in lower_content or "(file attached)" in lower_content:
                media_type = "file"
                if any(ext in lower_content for ext in [".jpg", ".png", ".jpeg", ".webp"]):
                    media_type = "image"
                elif any(ext in lower_content for ext in [".opus", ".ogg", ".mp3", ".m4a"]):
                    media_type = "voice"
            elif "this message was deleted" in lower_content or "you deleted this message" in lower_content:
                is_deleted = True
                media_type = "system"

            is_question = "?" in content

            msg_id = f"{contact_id}_{line_num}_{abs(hash(raw_ts + content)) % 1000000}"

            current_msg = {
                "id": msg_id,
                "contact_id": contact_id,
                "time_stamp": dt_iso,
                "sender": sender_role,
                "raw_sender": raw_sender,
                "content": content,
                "media_type": media_type,
                "media_path": None,
                "media_meta": None,
                "is_deleted": int(is_deleted),
                "is_question": int(is_question),
            }
        else:
            if current_msg:
                current_msg["content"] += "\n" + line.strip()

    if current_msg:
        messages.append(current_msg)

    return messages
