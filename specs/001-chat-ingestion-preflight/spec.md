# Feature Specification: WhatsApp Chat Ingestion & Pre-Flight Validation Engine

**Feature Branch**: `001-chat-ingestion-preflight`

**Created**: 2026-11-07

**Status**: Ready for Planning

**Input**: User description: "WhatsApp Chat Ingestion (.txt / .zip) via OS Share Sheet and In-App Drop with Pre-Flight Validation (N == 2 participants, >= 30 messages, system noise filtered) and lightweight summary extraction"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Direct File Drop & Ingestion of Raw Chat Log (Priority: P1)

A user opens Assify, taps the document dropzone, and selects an uncompressed WhatsApp `.txt` export file. The system immediately parses the file locally, verifies that exactly two distinct participants exist and that there are at least 30 messages, and extracts the participant names, core chronemic metrics (reply speed, double-texts), and cleaned conversation text.

**Why this priority**: This represents the foundational MVP entry point for analyzing conversations. Without robust, local ingestion and validation of a chat file, no downstream diagnostic or Delulu analysis can take place.

**Independent Test**: Can be tested independently by uploading a valid 2-person WhatsApp `.txt` file with 50+ messages and confirming that the participant names, message counts, and basic chronemics metrics are accurately extracted and ready for analysis.

**Acceptance Scenarios**:

1. **Given** a valid WhatsApp `.txt` export with 2 participants and 100 messages, **When** the user selects the file in the app, **Then** the file is validated and parsed in under 1 second, extracting the 2 participant names and basic chronemics without errors.
2. **Given** a WhatsApp export containing system notices (`<Media omitted>`, `Messages and calls are end-to-end encrypted`), **When** the file is processed, **Then** all system notices are filtered out from the cleaned text and message count.

---

### User Story 2 - Pre-Flight Rejection with Clear Native Feedback (Priority: P2)

A user selects a chat export that violates forensic boundaries—either because it is a group chat ($N > 2$), a self-chat/single participant ($N < 2$), or contains fewer than 30 messages. The system halts processing immediately and displays a clean native modal alert explaining the exact reason, allowing the user to dismiss it and return to the dropzone without corrupting app state.

**Why this priority**: Critical for data integrity and user expectations. Assify's psychological models are built specifically for 1-on-1 romantic dynamics with sufficient sample size. Enforcing boundaries gracefully prevents crashes and bogus scores.

**Independent Test**: Can be tested by attempting to import a 3-person group chat export or a 10-message snippet and verifying that processing halts with the native HIG alert dialog and returns the user safely to the dropzone.

**Acceptance Scenarios**:

1. **Given** an exported chat containing 3 or more participants, **When** the file is ingested, **Then** the pre-flight check halts and displays a native alert: *"Assify requires a 1-on-1 conversation with at least 30 messages."*
2. **Given** an exported chat containing only 15 messages, **When** the file is ingested, **Then** the pre-flight check halts and displays the same native alert.
3. **Given** the rejection alert is visible, **When** the user taps "OK", **Then** the dialog dismisses and the app returns cleanly to the initial dropzone state.

---

### User Story 3 - Streamlined ZIP Archive Extraction & Media Scrubbing (Priority: P3)

A user selects or shares a WhatsApp export exported with media (resulting in a `.zip` archive). The system unzips the archive in transient memory, identifies and extracts the primary chat text file (e.g. `_chat.txt`), and immediately purges all audio, photo, sticker, and video files without writing them to disk.

**Why this priority**: WhatsApp users frequently export chats with media by mistake. Supporting `.zip` archives directly while instantly discarding media protects user storage, memory, and privacy.

**Independent Test**: Can be tested by providing a `.zip` archive containing a chat `.txt` plus 5 image files and 2 audio files, and verifying that only the chat text is parsed while zero media files are saved to local persistent storage.

**Acceptance Scenarios**:

1. **Given** a WhatsApp `.zip` archive containing `_chat.txt` and multiple `.jpg`/`.opus` media files, **When** the user imports the file, **Then** `_chat.txt` is extracted and passed to the pre-flight parser while all media files are discarded immediately.
2. **Given** a corrupted `.zip` file or an archive containing no `.txt` file, **When** the user imports the file, **Then** the app rejects the file with a clear alert indicating an unreadable chat archive.

---

### User Story 4 - OS Share Sheet Intent Receiver (Priority: P4)

A user inside WhatsApp exports a chat directly to Assify via the system Share Sheet. Assify opens seamlessly, ingests the incoming stream or shared file pointer, validates it via the pre-flight engine, and transitions directly into the diagnostic flow without requiring manual file navigation.

**Why this priority**: Enables the primary high-converting user flow—analyzing a conversation immediately while looking at it in WhatsApp.

**Independent Test**: Can be tested by sending an OS share intent with a `.txt` or `.zip` mime type to Assify and verifying that the app launches and immediately begins the pre-flight validation pipeline.

**Acceptance Scenarios**:

1. **Given** the user triggers "Export Chat" in WhatsApp and chooses Assify, **When** the app receives the intent, **Then** it automatically passes the shared file to the validation engine.

---

### Edge Cases

- **Mixed Timestamp Formats**: WhatsApp exports vary by platform and locale (e.g., `[DD/MM/YY, HH:MM:SS]` on iOS vs `MM/DD/YY, H:MM AM - ` on Android). The pre-flight line parser must detect and adapt to both bracketed and hyphen-delimited formats without failing.
- **Multilingual System Notices**: System notices like deleted messages or media placeholders appear in different languages (e.g., `<Media omitted>`, `<Medien weggelassen>`, `This message was deleted`). The cleaner must reliably identify system notice patterns across standard variants.
- **Multi-line Messages**: When a single message spans multiple paragraphs or line breaks, lines without timestamp headers must be correctly appended to the active message content rather than counted as separate messages or participant lines.
- **Extremely Large Logs**: Chats with 50,000+ messages must not crash app memory. Parsing must stream or iterate line-by-line in a single pass without allocating bulky objects for every line.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST accept WhatsApp export files in both `.txt` and `.zip` formats via in-app document picker and system Share Sheet.
- **FR-002**: System MUST unpack `.zip` archives in transient memory, extract exclusively the conversational `.txt` file, and discard all media files immediately.
- **FR-003**: System MUST identify the number of unique human participants in the conversation log during the initial streaming pass.
- **FR-004**: System MUST verify that participant count equals exactly 2 ($N = 2$) and valid message count is at least 30 ($\ge 30$).
- **FR-005**: System MUST halt processing and display a native Apple HIG modal alert when a chat fails participant count or volume checks: *"Assify requires a 1-on-1 conversation with at least 30 messages."*
- **FR-006**: System MUST filter out standard WhatsApp system notices (encryption announcements, omitted media markers, deleted message notifications) from both the message count and cleaned transcript text.
- **FR-007**: System MUST perform a single-pass computation of basic chronemics metrics:
  - Median response latency per participant
  - Consecutive message burst (double-text) counts per participant
- **FR-008**: System MUST produce a standardized, lightweight `ParsedChatSummary` data structure containing the 2 participant names, valid message count, chronemics metrics, and cleaned transcript string.
- **FR-009**: System MUST NOT store individual raw message objects in persistent database storage during ingestion.
- **FR-010**: System MUST NOT require biometric authentication (FaceID/TouchID/PIN) to enter or process chat files.

### Key Entities

- **ParsedChatSummary**:
  - `participants`: Tuple of two distinct human participant strings `[string, string]`.
  - `messageCount`: Total integer count of valid conversational messages ($\ge 30$).
  - `cleanedChatText`: Sanitized, consolidated transcript string with system notices removed.
  - `metrics`: Chronemic metrics object containing:
    - `userResponseTimeMins`: Estimated median response latency for participant 1.
    - `partnerResponseTimeMins`: Estimated median response latency for participant 2.
    - `userDoubleTexts`: Count of consecutive multi-message bursts by participant 1.
    - `partnerDoubleTexts`: Count of consecutive multi-message bursts by participant 2.
- **ValidationResult**:
  - `isValid`: Boolean indicating whether the chat passed pre-flight rules.
  - `rejectionReason`: Optional error code (`TOO_FEW_MESSAGES` | `INVALID_PARTICIPANT_COUNT` | `CORRUPTED_ARCHIVE` | `NONE`).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Ingestion and pre-flight validation of a 1,000-message chat completes in under 500 milliseconds on a standard mobile device.
- **SC-002**: Ingestion of a large 25,000-message chat file uses less than 30MB peak transient RAM during parsing.
- **SC-003**: 100% of non-qualifying files (group chats, one-sided notes, files $<30$ messages, corrupted archives) are safely blocked before any downstream analysis runs.
- **SC-004**: 100% of photos, videos, stickers, and voice notes contained in `.zip` archives are discarded with 0 bytes written to disk storage.
- **SC-005**: User can dismiss a validation rejection and return to the dropzone in a single tap with zero app freezes or memory leaks.

---

## Assumptions

- Target platform is React Native / Expo (iOS and Android).
- Chat exports originate from official WhatsApp clients using standard export formats.
- Biometric authentication is intentionally omitted for frictionless onboarding.
- Downstream diagnostic engines consume the lightweight `ParsedChatSummary` directly without requiring per-message relational database rows.
