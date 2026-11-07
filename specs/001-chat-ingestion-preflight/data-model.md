# Data Model: WhatsApp Chat Ingestion & Pre-Flight Validation Engine

- **Feature**: `001-chat-ingestion-preflight`
- **Date**: 2026-11-07
- **Status**: Completed

---

## 1. Core Domain Types

### `ParsedChatSummary`
The immutable output of the ingestion pipeline. Represents the validated conversation ready for diagnostic synthesis.

| Field | Type | Description |
|---|---|---|
| `participants` | `[string, string]` | The two distinct human participants identified in the chat |
| `messageCount` | `number` | Total number of valid conversational messages (guaranteed $\ge 30$) |
| `dateRange` | `{ start: string; end: string }` | Earliest and latest message timestamps in ISO-8601 format |
| `cleanedChatText` | `string` | Consolidated transcript text stripped of system notices and media markers |
| `metrics` | `ChronemicMetrics` | Lightweight computed chronemics (response latency and double-texts) |

---

### `ChronemicMetrics`
Pre-calculated interaction dynamics extracted in a single pass over timestamps.

| Field | Type | Description |
|---|---|---|
| `userResponseTimeMins` | `number` | Median reply latency for participant 1 in minutes |
| `partnerResponseTimeMins` | `number` | Median reply latency for participant 2 in minutes |
| `userDoubleTexts` | `number` | Count of multi-message chase bursts (>5m gap) by participant 1 |
| `partnerDoubleTexts` | `number` | Count of multi-message chase bursts (>5m gap) by participant 2 |
| `userMessageCount` | `number` | Total valid messages sent by participant 1 |
| `partnerMessageCount` | `number` | Total valid messages sent by participant 2 |

---

### `ValidationResult`
The outcome of the pre-flight checks.

```typescript
export type RejectionReason =
  | 'TOO_FEW_MESSAGES'          // Fewer than 30 valid messages
  | 'INVALID_PARTICIPANT_COUNT'  // N != 2 (group chat or self chat)
  | 'EMPTY_OR_UNREADABLE'       // File empty or corrupted
  | 'NO_TXT_IN_ARCHIVE';        // .zip contained no text file

export type ValidationResult =
  | { success: true; summary: ParsedChatSummary }
  | { success: false; reason: RejectionReason; rawCount?: number; participantCount?: number };
```

---

## 2. In-Memory Lifecycle & Garbage Collection

```
User File (.txt / .zip)
       │
       ▼
[Reader / Unzipper] ──► Extracts string contents into transient memory
       │
       ▼
[Stream Line-Parser]
       ├── Validates N == 2
       ├── Validates count >= 30
       ├── Computes ChronemicMetrics
       └── Accumulates cleaned text
       │
       ▼
 Emits `ValidationResult`
       ├── Success ──► passes `ParsedChatSummary` to Analysis Engine
       └── Failure ──► displays native Alert; memory dereferenced immediately
```

* **Zero Persistence Constraint**: Neither the raw `.txt` file, the `.zip` binary buffer, nor individual message row objects are stored in SQLite or file storage during ingestion.

