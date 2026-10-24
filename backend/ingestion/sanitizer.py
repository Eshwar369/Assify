import re
from typing import List, Dict, Optional, Any

# ==============================================================================
# PII SANITIZATION & REDACTION ENGINE (Apple App Store 5.1 & GDPR Compliance)
# ==============================================================================

# 1. Phone number patterns (handles international, Indian, US formats)
PHONE_PATTERNS = [
    # Indian mobile (+91 98765 43210, +91-9876543210, 9876543210)
    re.compile(r"\b(?:\+91[\s.-]?)?[6-9]\d{4}[\s.-]?\d{5}\b"),
    # US & international phone formats: +1 (555) 234-5678, +44 20 7946 0919, 555-123-4567
    re.compile(r"\b(?:\+\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b"),
    # Generic international phone with country code: +12345678901
    re.compile(r"\b\+\d{1,4}[\s.-]?\(?\d{1,4}\)?[\s.-]?\d{2,4}[\s.-]?\d{2,9}\b"),
]

# 2. Email pattern
EMAIL_REGEX = re.compile(
    r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"
)

# 3. Credit / Debit card pattern (16 digits separated by space or hyphen or continuous)
CARD_REGEX = re.compile(
    r"\b(?:\d{4}[-\s]){3}\d{4}\b"
)

# 4. Indian UPI VPA patterns (e.g. user@oksbi, name@paytm, user@ybl)
UPI_REGEX = re.compile(
    r"\b[a-zA-Z0-9.\-_]{2,64}@(oksbi|okhdfcbank|okaxis|okicici|paytm|ybl|ibl|axl|upi|sbi|hdfc|icici|axis|barodampay)\b",
    re.IGNORECASE,
)


def sanitize_text(
    text: str,
    user_name: Optional[str] = None,
    contact_name: Optional[str] = None,
    custom_replacements: Optional[Dict[str, str]] = None,
) -> str:
    """
    Scrubs Personally Identifiable Information (PII) from raw text before LLM prompt assembly.
    - Strips credit/debit card numbers -> [ACCOUNT_REDACTED]
    - Strips UPI IDs -> [ACCOUNT_REDACTED]
    - Strips email addresses -> [EMAIL_REDACTED]
    - Strips phone numbers -> [PHONE_REDACTED]
    - Anonymizes participant names -> [USER] and [PARTNER]
    """
    if not text:
        return ""

    sanitized = text

    # Step 1: Financial Details & UPI (Run before email to avoid matching UPI as standard email)
    sanitized = CARD_REGEX.sub("[ACCOUNT_REDACTED]", sanitized)
    sanitized = UPI_REGEX.sub("[ACCOUNT_REDACTED]", sanitized)

    # Step 2: Email addresses
    sanitized = EMAIL_REGEX.sub("[EMAIL_REDACTED]", sanitized)

    # Step 3: Phone numbers
    for pattern in PHONE_PATTERNS:
        sanitized = pattern.sub("[PHONE_REDACTED]", sanitized)

    # Step 4: Participant Name Redaction
    # Collect names to replace, ordering longest first to avoid substring collisions
    name_replacements = []
    if contact_name and len(contact_name.strip()) > 1:
        c_clean = contact_name.strip()
        name_replacements.append((c_clean, "[PARTNER]"))
        # Also include individual tokens if long enough (e.g. 'Zombiee' from 'Sleepless Zombiee')
        parts = c_clean.split()
        if len(parts) > 1:
            for part in parts:
                if len(part) >= 4 and part.lower() not in {"the", "and", "with", "from"}:
                    name_replacements.append((part, "[PARTNER]"))

    if user_name and len(user_name.strip()) > 1 and user_name.strip() != "*":
        u_clean = user_name.strip()
        name_replacements.append((u_clean, "[USER]"))
        parts = u_clean.split()
        if len(parts) > 1:
            for part in parts:
                if len(part) >= 4 and part.lower() not in {"the", "and", "with", "from"}:
                    name_replacements.append((part, "[USER]"))

    if custom_replacements:
        for k, v in custom_replacements.items():
            if len(k.strip()) > 1:
                name_replacements.append((k.strip(), v))

    # Sort replacements by target length descending
    name_replacements.sort(key=lambda x: len(x[0]), reverse=True)

    for target, token in name_replacements:
        # Use word boundaries for clean word substitution
        pattern = re.compile(rf"\b{re.escape(target)}\b", re.IGNORECASE)
        sanitized = pattern.sub(token, sanitized)

    return sanitized


def sanitize_messages(
    messages: List[Dict[str, Any]],
    user_name: Optional[str] = None,
    contact_name: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """
    Returns a copy of the messages list with all message contents and sender labels scrubbed.
    """
    sanitized_list = []
    for m in messages:
        m_copy = dict(m)
        raw_content = m_copy.get("content", "")
        m_copy["content"] = sanitize_text(
            raw_content,
            user_name=user_name,
            contact_name=contact_name,
        )
        sanitized_list.append(m_copy)
    return sanitized_list
