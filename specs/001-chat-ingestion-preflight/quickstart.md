# Quickstart & Verification Guide: Chat Ingestion & Pre-Flight Validation Engine

- **Feature**: `001-chat-ingestion-preflight`
- **Date**: 2026-11-07
- **Status**: Completed

---

## 1. Overview

This guide describes how to verify the Chat Ingestion and Pre-Flight Validation engine against real-world sample WhatsApp files.

---

## 2. Test Fixtures

The verification suite requires four mock chat fixtures in `tests/fixtures/`:

1. `valid_chat_ios.txt`: 60 messages between "Alex" and "Jordan" with iOS bracketed timestamps, multiple double-text bursts, and system notices (`<Media omitted>`).
2. `valid_chat_android.txt`: 80 messages between "Sam" and "Taylor" with Android hyphen timestamps.
3. `invalid_group_chat.txt`: 40 messages across 3 participants ("Alex", "Jordan", "Morgan"). Expected: `INVALID_PARTICIPANT_COUNT`.
4. `invalid_too_few_messages.txt`: 12 messages between "Alex" and "Jordan". Expected: `TOO_FEW_MESSAGES`.
5. `valid_with_media.zip`: A ZIP archive containing `_chat.txt` (50 messages) and sample dummy images (`photo.jpg`, `voice.opus`). Expected: extracts `_chat.txt`, rejects media, returns valid summary.

---

## 3. Running Unit & Integration Tests

```bash
# Run unit tests for pre-flight validation
npm test tests/unit/ingestion/preflight.test.ts

# Run contract tests
npm test tests/contract/ingestion.test.ts
```

### Expected Outcomes
- `valid_chat_ios.txt`: `success: true`, `messageCount: 58` (after filtering 2 system notices), `participants: ["Alex", "Jordan"]`.
- `invalid_group_chat.txt`: `success: false`, `reason: "INVALID_PARTICIPANT_COUNT"`.
- `invalid_too_few_messages.txt`: `success: false`, `reason: "TOO_FEW_MESSAGES"`.
- `valid_with_media.zip`: `success: true`, 0 media files saved to storage.

