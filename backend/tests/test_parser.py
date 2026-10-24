import pytest
from datetime import datetime
from backend.ingestion.parser import (
    parse_timestamp,
    clean_raw_text,
    detect_participants,
    parse_whatsapp,
)


def test_parse_timestamp_24_hour_with_seconds():
    # 24-hour formats with seconds (Bug 6.2 fix)
    dt1 = parse_timestamp("23/03/26, 18:30:15")
    assert dt1 == datetime(2026, 3, 23, 18, 30, 15)

    dt2 = parse_timestamp("23/03/2026, 18:30:15")
    assert dt2 == datetime(2026, 3, 23, 18, 30, 15)

    dt3 = parse_timestamp("2026-03-23, 18:30:15")
    assert dt3 == datetime(2026, 3, 23, 18, 30, 15)


def test_parse_timestamp_standard_formats():
    # 12-hour AM/PM formats
    dt1 = parse_timestamp("23/03/2026, 06:30:15 PM")
    assert dt1 == datetime(2026, 3, 23, 18, 30, 15)

    dt2 = parse_timestamp("23/03/26, 12:15 PM")
    assert dt2 == datetime(2026, 3, 23, 12, 15)


def test_deterministic_message_ids():
    # Bug 6.1: Deterministic hashing (must not rely on process-salted hash())
    sample_text = (
        "23/03/2026, 18:30 - Sarah: Hey, how are you doing?\n"
        "23/03/2026, 18:31 - *: Doing great, working on Assify.\n"
    )

    msgs_run1 = parse_whatsapp(sample_text, user_sender="*", contact_id="c_sarah_123")
    msgs_run2 = parse_whatsapp(sample_text, user_sender="*", contact_id="c_sarah_123")

    assert len(msgs_run1) == 2
    assert len(msgs_run2) == 2

    for m1, m2 in zip(msgs_run1, msgs_run2):
        assert m1["id"] == m2["id"]
        # Ensure MD5 hash is 8 chars hex
        parts = m1["id"].split("_")
        assert len(parts[-1]) == 8


def test_ios_and_android_regex_parsing():
    android_sample = "23/03/2026, 18:30:15 - Sarah: Android message here"
    ios_sample = "[23/03/26, 18:30:15] Sarah: iOS message here"

    msgs_android = parse_whatsapp(android_sample, user_sender="*", contact_id="c_sarah_123")
    msgs_ios = parse_whatsapp(ios_sample, user_sender="*", contact_id="c_sarah_123")

    assert len(msgs_android) == 1
    assert msgs_android[0]["content"] == "Android message here"
    assert "2026-03-23T18:30:15" in msgs_android[0]["time_stamp"]

    assert len(msgs_ios) == 1
    assert msgs_ios[0]["content"] == "iOS message here"
    assert "2026-03-23T18:30:15" in msgs_ios[0]["time_stamp"]
