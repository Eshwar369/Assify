import pytest
from backend.ingestion.sanitizer import sanitize_text, sanitize_messages


def test_sanitize_phone_numbers():
    text = (
        "Call me at +91 98765 43210 or my US office at +1 (555) 234-5678. "
        "Also my old mobile was 9876543210. Text me there!"
    )
    sanitized = sanitize_text(text)
    assert "+91 98765 43210" not in sanitized
    assert "+1 (555) 234-5678" not in sanitized
    assert "9876543210" not in sanitized
    assert "[PHONE_REDACTED]" in sanitized


def test_sanitize_email_addresses():
    text = "Send the contract to john.doe@example.com or backup_22@delulu.co.in thanks!"
    sanitized = sanitize_text(text)
    assert "john.doe@example.com" not in sanitized
    assert "backup_22@delulu.co.in" not in sanitized
    assert "[EMAIL_REDACTED]" in sanitized


def test_sanitize_participant_names():
    text = "Hey Sleepless Zombiee, Eshwar told me that Zombiee is planning a trip."
    sanitized = sanitize_text(
        text,
        user_name="Eshwar",
        contact_name="Sleepless Zombiee"
    )
    assert "Eshwar" not in sanitized
    assert "Sleepless Zombiee" not in sanitized
    assert "[USER]" in sanitized
    assert "[PARTNER]" in sanitized


def test_sanitize_financial_and_upi():
    text = (
        "Transfer 500 to my UPI rahul@oksbi or paytm handle priya.sharma@paytm. "
        "Do not use card 4111 2222 3333 4444 or 5500-1234-5678-9012."
    )
    sanitized = sanitize_text(text)
    assert "rahul@oksbi" not in sanitized
    assert "priya.sharma@paytm" not in sanitized
    assert "4111 2222 3333 4444" not in sanitized
    assert "5500-1234-5678-9012" not in sanitized
    assert "[ACCOUNT_REDACTED]" in sanitized


def test_sanitize_does_not_break_innocent_dates_and_times():
    text = "Let's meet at 11:30 PM on 24/10/2026. We sent 40000 messages!"
    sanitized = sanitize_text(text)
    assert "11:30 PM" in sanitized
    assert "24/10/2026" in sanitized
    assert "40000" in sanitized


def test_sanitize_messages_list():
    raw_msgs = [
        {
            "id": "msg_1",
            "time_stamp": "2026-10-20T23:14:00",
            "sender": "user",
            "raw_sender": "Eshwar",
            "content": "Hey Sarah, call me on +91 9988776655 tomorrow.",
        },
        {
            "id": "msg_2",
            "time_stamp": "2026-10-20T23:15:00",
            "sender": "contact",
            "raw_sender": "Sarah",
            "content": "Sure Eshwar! Send 200 to my UPI sarah@okhdfcbank first 😂",
        },
    ]

    sanitized_msgs = sanitize_messages(raw_msgs, user_name="Eshwar", contact_name="Sarah")
    assert len(sanitized_msgs) == 2
    assert "+91 9988776655" not in sanitized_msgs[0]["content"]
    assert "[PHONE_REDACTED]" in sanitized_msgs[0]["content"]
    assert "sarah@okhdfcbank" not in sanitized_msgs[1]["content"]
    assert "[ACCOUNT_REDACTED]" in sanitized_msgs[1]["content"]
    # Check name replacement
    assert "Eshwar" not in sanitized_msgs[0]["content"]
    assert "Sarah" not in sanitized_msgs[0]["content"]
