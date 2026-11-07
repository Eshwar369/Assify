# Research & Architectural Decisions: WhatsApp Chat Ingestion & Pre-Flight Validation Engine

- **Feature**: `001-chat-ingestion-preflight`
- **Date**: 2026-11-07
- **Status**: Completed

---

## 1. WhatsApp Timestamp & Header Parsing Across Platforms

### Context & Challenge
WhatsApp exports use slightly different date-time and separator formats depending on OS (Android vs. iOS) and user locale (12-hour AM/PM vs. 24-hour; DD/MM/YYYY vs. MM/DD/YYYY):
- **Android**: `12/04/24, 8:45 PM - Alex: Hello` or `12/04/2024, 20:45 - Alex: Hello`
- **iOS**: `[12/04/24, 20:45:12] Alex: Hello` or `[12/04/24, 8:45:12 PM] Alex: Hello`

Additionally, multi-line messages (e.g. paragraphs or code snippets) do not begin with a timestamp header; they must be coalesced into the preceding message.

### Decision
Use a lightweight dual-regex pre-compiler:
1. `IOS_REGEX`: `/^\[(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s+[AP]M)?)\]\s+([^:]+):\s+(.*)$/i`
2. `ANDROID_REGEX`: `/^(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?:\s+[AP]M)?)\s+-\s+([^:]+):\s+(.*)$/i`

### Rationale
- Detects the format on the first matching header.
- Extracts `dateStr`, `timeStr`, `sender`, and `text` in a single pass.
- Any line not matching either header is automatically treated as a multi-line continuation of the current message.

### Alternatives Considered
- Heavy NLP/date parsing libraries (e.g. `chrono-node`): Rejected due to bundle size (+500KB) and high latency over 30,000 lines.
- Static delimiter splitting (`split(" - ")`): Rejected because user messages frequently contain hyphens (`-`).

---

## 2. In-Memory ZIP Unpacking & Media Discard

### Context & Challenge
Users often export chats with media included, producing a `.zip` archive (50MB–500MB) containing photos (`.jpg`), voice messages (`.opus`), stickers (`.webp`), and a single text log (`_chat.txt` on iOS or `<Chat Name>.txt` on Android). Writing all media to disk violates our privacy mandate, eats device storage, and slows down ingestion.

### Decision
Use a stream-compatible in-memory ZIP reader (e.g. `jszip`):
1. Scan the central directory headers in the `.zip` buffer.
2. Locate the single `.txt` entry (case-insensitive match for `\.txt$`).
3. Decompress exclusively that entry into memory.
4. Immediately drop the archive buffer; zero media bytes are ever unpacked or persisted to local disk storage.

### Rationale
- Completely fulfills the Privacy-First Local Sanctuary rule.
- Eliminates filesystem writes for media.
- Reduces processing time from tens of seconds to under 400ms for a 100MB ZIP file.

### Alternatives Considered
- Platform native unzipper (`react-native-zip-archive`): Writes entire contents to a temporary directory on disk, requiring subsequent file scans and manual disk deletion passes. Rejected because unencrypted media touches disk storage.

---

## 3. System Notice Scrubbing

### Context & Challenge
WhatsApp inserts non-conversational operational notifications into the log that must not be counted as user messages or participants:
- `Messages and calls are end-to-end encrypted...`
- `<Media omitted>` or `[image omitted]` or `‎attached: ...`
- `This message was deleted` or `You deleted this message`
- `Missed voice call` / `Missed video call`
- Disappearing messages notices

### Decision
Maintain a concise set of regexes and substring markers:
1. Lines where sender matches system tokens (e.g. absent colon separator on Android: `Date, Time - Notice`).
2. Message bodies matching:
   - `/^<Media omitted>$/i`
   - `/^This message was deleted$/i`
   - `/^Messages and calls are end-to-end encrypted/i`
   - Hidden unicode direction markers (e.g. `\u200E` used in iOS exports before attachments).

### Rationale
Cleanly isolates genuine conversational turns from metadata without needing external translation or locale engines.

---

## 4. Chronemic Metrics Calculation (Reply Latency & Double-Texts)

### Context & Challenge
Downstream diagnostics need fast indicators of power imbalance without iterating over thousands of raw objects repeatedly.

### Decision
Compute summary statistics during the initial streaming pass:
1. **Median Response Latency (MRL)**:
   - When turn changes from Participant A to Participant B, delta $t = \text{timestamp}_B - \text{timestamp}_A$.
   - Filter out gaps $> 12 \text{ hours}$ (classified as sleep/night gaps rather than conversational pauses).
   - Compute median of remaining deltas.
2. **Double-Texts**:
   - When Participant A sends consecutive messages separated by $> 5 \text{ minutes}$ without an intervening reply from Participant B, increment A's double-text counter.

### Rationale
Single-pass $O(N)$ accumulation with negligible memory footprint.

