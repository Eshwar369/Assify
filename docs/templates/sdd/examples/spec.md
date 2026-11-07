# Feature Specification: Offline WhatsApp Chat Import & 1-on-1 Forensics

**Feature Branch**: `002-offline-whatsapp-forensics`  
**Created**: 2026-11-04  
**Status**: Approved  
**Input**: User description: "Build the complete offline WhatsApp chat ingestion, 1-on-1 participant validation, 0-LLM deterministic chronemics engine, 5-Act unboxing presentation, and high-resolution 9:16 story card export pipeline for Assify."

---

## User Scenarios & Testing

### User Story 1 - 1-on-1 WhatsApp Chat Archive Ingestion & Identity Resolution (Priority: P1) 🎯 MVP

As an individual navigating an ambiguous dating dynamic or talking stage,  
I want to import a WhatsApp conversation export directly into Assify and identify who I am in the conversation,  
So that the system can validate the integrity of our chat, reject invalid group or solo chats, and prepare my conversation for forensic analysis.

**Why this priority**: Without reliable, local ingestion and participant validation, no downstream analysis is possible. This represents the absolute functional foundation and the Minimum Viable Product slice.

**Independent Test**: Provide an exported WhatsApp plain text or zip archive with exactly two participants. The system parses the messages, prompts the user to select their identity via a 2-option modal, enforces the 30-message volume threshold, computes unique message hashes, and confirms that exactly two participants are mapped without making any external network calls.

**Acceptance Scenarios**:
1. **Given** a valid WhatsApp export file with exactly 2 distinct participants and $\ge 30$ conversational messages,  
   **When** the user selects or shares the file into the application,  
   **Then** the system displays a participant resolution modal asking *"Which one are you?"* with two interactive buttons showing the participant names.  
   - **Evidence Check**: Automated unit test confirms parser extracts exactly 2 participant identifiers and transitions state to identity resolution.
2. **Given** the user is presented with the participant resolution modal,  
   **When** the user taps their own name,  
   **Then** the selected participant is assigned the user role, the counterpart is assigned the partner role, and a deterministic contact identifier is generated.  
   - **Evidence Check**: Unit test verifies deterministic SHA-256 contact identifier computation matches sorted participant handles.
3. **Given** an exported chat containing fewer than 30 valid conversational messages,  
   **When** the user attempts to import the file,  
   **Then** the system halts ingestion immediately and displays an explanatory dialog: *"Need at least 30 messages to uncover the truth."*  
   - **Evidence Check**: Automated test confirms import aborts with validation error and 0 records persisted.
4. **Given** an exported chat containing only 1 person (self-notes) or 3 or more participants (group chat),  
   **When** the user attempts to import the file,  
   **Then** the system halts ingestion and presents a dedicated boundary alert explaining that Assify is designed exclusively for 1-on-1 conversations.  
   - **Evidence Check**: Acceptance test verifies non-2 participant payloads are rejected with explicit boundary error codes.

---

### User Story 2 - Deterministic 0-LLM Chronemics & Timing Telemetry (Priority: P2)

As a curious user seeking objective relationship clarity,  
I want Assify to calculate mathematical timing telemetry from our message timestamps without using artificial intelligence,  
So that I can see factual, unmanipulated metrics about who texts first, response delays, double-texting patterns, and late-night conversation volume.

**Why this priority**: Factual chronemics provide the objective forensic backbone of the analysis. Users demand hard mathematical receipts before reviewing psychological profiles or delusion scores.

**Independent Test**: Pass a pre-parsed sequence of timestamped messages with known time gaps into the chronemics engine. Verify that turn clustering (90s window), session seams (3.5h silence), overnight sleep gap exclusions (23:00 to 08:00), and chasing double-texts ($\ge 30\text{m}$) match hand-calculated expected values with 100% mathematical precision.

**Acceptance Scenarios**:
1. **Given** a sequence of messages from the same sender sent within 90 seconds of each other,  
   **When** chronemics analysis runs,  
   **Then** the messages are consolidated into a single Conversational Turn whose start is anchored to the first message and end is anchored to the last message of the cluster.  
   - **Evidence Check**: Automated test validates that 5 consecutive messages within 75 seconds produce exactly 1 turn.
2. **Given** two alternating turns separated by an overnight gap between 11:30 PM and 8:15 AM (8 hours 45 minutes),  
   **When** median response latency is computed,  
   **Then** the overnight sleep interval is excluded from the calculation, preventing sleep from skewing daytime responsiveness metrics.  
   - **Evidence Check**: Test suite verifies overnight gaps $>4\text{ hours}$ spanning 23:00 to 08:00 are clamped out of latency datasets.
3. **Given** a user sends a conversational turn, followed by silence for 45 minutes without a partner response, followed by another turn from the user,  
   **When** double-text classification runs,  
   **Then** the second turn is strictly categorized as 1 Chasing Double-Text.  
   - **Evidence Check**: Assertion test confirms follow-up turns sent after $\ge 30\text{ minutes}$ increment the chasing double-text counter by 1.
4. **Given** an imported conversation spanning multiple days,  
   **When** the chronemics summary is generated,  
   **Then** the system outputs: initiation ratio (User % vs Partner %), median response latency per participant, chasing double-text counts, and late-night message percentage (exchanged between 11:00 PM and 4:00 AM).  
   - **Evidence Check**: Contract test validates chronemics output object contains all required fields within bounds [0.0, 1.0] and non-negative integers.
5. **Given** a conversation where the final conversational turn was sent by a participant with no subsequent response from the partner,  
   **When** median response latency is computed,  
   **Then** the final unanswered turn is identified as a terminal turn and omitted from alternating turn latency datasets, preventing indefinite trailing silence from skewing responsiveness metrics.  
   - **Evidence Check**: Automated unit test verifies that appending an unanswered trailing turn leaves the computed median response latencies for both participants unchanged.

---

### User Story 3 - 5-Act Theatrical Unboxing & 9:16 Social Story Card Export (Priority: P3)

As an engaged user who has completed chat ingestion and analysis,  
I want to experience a dramatic, 5-act paged unboxing reveal and export high-resolution 9:16 vertical story cards,  
So that I can share my relationship diagnosis, delusional score receipts, and hilarious superlatives directly to social media (Instagram, Snapchat).

**Why this priority**: The theatrical reveal delivers the core emotional payoff (from anxiety to empowerment), and 1-tap 9:16 story card export powers the organic viral loop of the product.

**Independent Test**: Trigger the unboxing sequence with a completed forensic dossier. Verify that the user can swipe or tap through 5 distinct narrative acts (Forensic Intake, Delulu Meter, Power Split, Flags Locker, Final Ruling), observe the Delulu needle gauge spring into place with its circus tier badge, rehydrate sanitization tokens to human display names, and capture an offscreen 9:16 high-resolution image to the system share sheet.

**Acceptance Scenarios**:
1. **Given** analysis synthesis is ready,  
   **When** the unboxing screen opens,  
   **Then** the interface presents Act 1 showing participant archetypes and executive diagnosis, allowing the user to swipe or tap right to advance sequentially through all 5 acts.  
   - **Evidence Check**: UI component test verifies sequential act progression and page indexing from 1 through 5.
2. **Given** the user navigates to Act 2 (The Delulu Meter),  
   **When** the act becomes active,  
   **Then** the circular gauge needle animates smoothly from 0 to the target score (0–100%) and displays the corresponding tier badge: Ground Reality (0–35%), Circus Apprentice (36–69%), or Head Clown (70–100%).  
   - **Evidence Check**: Component assertion confirms score-to-tier classification and needle target clamping.
3. **Given** the user is viewing Act 4 (Red & Green Flags Locker) or Act 5 (Final Ruling),  
   **When** quotes from the conversation are rendered on screen,  
   **Then** all internal privacy tokens are rehydrated to display the participants' actual real-world names.  
   - **Evidence Check**: Snapshot test confirms zero un-rehydrated privacy tokens appear in rendered text.
4. **Given** the user taps the "Share Story" button on the Master Verdict or an individual Act card,  
   **When** export is triggered,  
   **Then** the system generates a high-resolution 9:16 aspect ratio vertical image card and invokes the native operating system share sheet.  
   - **Evidence Check**: Automated verification verifies view capture produces a valid PNG file with 9:16 aspect ratio dimensions.

---

## Edge Cases (Four-Quadrant Matrix)

### Quadrant 1: Boundary & Limit Conditions
1. **Zero-Byte or Empty File**: If an uploaded `.txt` or `.zip` file is 0 bytes or contains no text lines, the system **MUST** halt immediately and display: *"The selected file is empty."*
2. **29-Message Edge**: If an archive contains exactly 29 valid conversational lines (one below the 30-message threshold), the system **MUST** reject the import with: *"Need at least 30 messages to uncover the truth."*
3. **High-Volume Archive (50,000+ Messages)**: When ingesting a massive multi-year archive, the system **MUST** process the message stream without running out of memory, completing parsing within 2.0 seconds.
4. **Extreme Multiline Messages**: If a participant sends a single monologue spanning 200+ lines of text or song lyrics, the system **MUST** preserve the message as a single conversational unit bound to the initial timestamp rather than splitting it into phantom messages.
5. **Terminal Turn Exclusion (Unanswered Trailing Turn)**: If a conversation ends with an unanswered message or cluster from one participant (e.g. partner leaves final message unanswered for days or weeks), the system **MUST** classify this final sequence as a Terminal Turn and **MUST** exclude it from alternating response latency median (MRL) calculations, preventing indefinite trailing silence from corrupting responsiveness metrics.

### Quadrant 2: Network & Transient Failures
6. **Network Drop During AI Synthesis**: If external network connectivity fails or times out during profile generation, the system **MUST** stop the scanner animation and present an error card: *"Analysis taking longer than expected"* with an actionable **"Retry Synthesis"** button. The parsed chat and chronemics **MUST** remain safely persisted so that retrying requires zero file re-uploading.
7. **100% Offline Vault Access**: When the device is completely offline (e.g., Airplane Mode), the user **MUST** be able to browse all previously analyzed contacts, view 5-Act dossiers, unlock via biometrics, and export 9:16 story cards without any network calls or error dialogs.
8. **Corrupted or Truncated ZIP Archive**: If a user uploads a `.zip` file with corrupted headers or incomplete decompression streams, the system **MUST** catch the decompression error and display: *"Unable to unpack chat archive. Please export directly from WhatsApp as a plain text or zip file."*

### Quadrant 3: Concurrency & Idempotency
9. **Double-Tap Submission Lock**: If a user rapidly taps the import or file selection button multiple times, the system **MUST** ignore redundant triggers and process the file exactly once.
10. **Zero-Delta Re-Import**: If a user re-exports and uploads an identical chat containing 0 new messages compared to the stored record, the system **MUST** skip AI synthesis entirely, display a brief notification: *"Chat is already up to date"*, and open the existing dossier immediately with 0 tokens consumed.
11. **Incremental / Differential Delta Ingestion**: When a user re-exports and uploads an updated chat archive for an existing contact containing $N_{new} > 0$ new messages (e.g., 45 new messages after 2 weeks), the system **MUST** skip already-persisted messages via deterministic SHA-256 content hashes, ingest only newly appended messages, recompute lifetime chronemics across the full message history, and generate comparative delta badges in the updated dossier (e.g., *"Delulu Score: 82% (+12% since last check)"*, *"Response Latency: slowed by 24m"*, *"3 New Red Flags Detected"*).
12. **Same-Minute Message Bursts**: If a participant sends 6 messages within the same clock minute (where exported timestamps lack second resolution), the system **MUST** generate unique, deterministic message identifiers using source line offsets, guaranteeing zero row collisions.

### Quadrant 4: Security, Permission & Privacy Boundaries
13. **Self-Chat Rejection ($N < 2$)**: If an archive contains messages from only 1 participant (notes to self), ingestion **MUST** abort with: *"Assify needs a 2-person conversation to analyze relationship dynamics."*
14. **Group Chat Rejection ($N > 2$)**: If an archive contains 3 or more participants, ingestion **MUST** abort with: *"Assify is built for 1-on-1 situationships. Please export a direct personal chat."*
15. **WhatsApp System Notices & Media Placeholders**: Messages matching system patterns (`Messages and calls are end-to-end encrypted`, `<Media omitted>`, `Missed voice call`, `This message was deleted`) **MUST** be filtered out from chronemics and profile datasets.
16. **Zero-Trust PII Masking & Spaced Phone Redaction**: Prior to transmitting any message text to an external AI service, all phone numbers, email addresses, financial accounts/UPI identifiers, and participant names **MUST** be masked with standardized privacy tokens. The phone number regex sanitizer **MUST** explicitly support standard Indian WhatsApp phone conventions with 5-5 digit spacing (`+91 98765 43210`, `+91-98765-43210`, `+919876543210`, and 10-digit spaced `98765 43210`), ensuring spaced phone numbers are never leaked unmasked across external network boundaries.
17. **Biometric Guard on OS Share Intent**: If biometric lock is enabled in settings and a chat is shared into Assify via the operating system share sheet, the system **MUST** enforce biometric/PIN authentication before reading or displaying any chat content.
18. **Midnight Time Rollover**: Conversational turns spanning 23:59 to 00:01 across calendar days **MUST** compute elapsed seconds continuously without negative duration errors or date boundary artifacts.

---

## Requirements

### Functional Requirements

- **FR-001**: System **MUST** ingest WhatsApp chat archives formatted as plain text (`.txt`) and zipped archives (`.zip`), extracting the text stream in memory without writing unmanaged temporary files to disk.
- **FR-002**: System **MUST** strip invisible Unicode direction marks (`\u200e`, `\u200f`), Byte Order Marks (BOM), and normalize non-breaking spaces before message tokenization.
- **FR-003**: System **MUST** parse both Android (`ts - Sender: Msg`) and iOS (`[ts] Sender: Msg`) timestamp conventions across 12-hour AM/PM and 24-hour military notation.
- **FR-004**: System **MUST** enforce a strict participant boundary requiring exactly two distinct human participants ($N = 2$), rejecting single-user and group archives.
- **FR-005**: System **MUST** enforce a minimum message threshold requiring at least 30 valid conversational messages prior to forensic analysis.
- **FR-006**: System **MUST** prompt the user with a 1-tap participant resolution modal immediately upon ingestion to assign user and partner roles.
- **FR-007**: System **MUST** calculate deterministic content hashes for contacts and individual messages using SHA-256 incorporating source line offsets.
- **FR-008**: System **MUST** calculate 0-LLM chronemics telemetry including: 90-second turn clustering, 3.5-hour silence seam detection, median response latency with overnight sleep clamping (23:00 to 08:00), terminal turn exclusion (omitting final unanswered turns from alternating latency medians), chasing double-texts ($\ge 30\text{m}$ gap), and late-night volume ratio (23:00 to 04:00).
- **FR-009**: System **MUST** enforce pre-flight zero-trust PII sanitization on all outbound message text, replacing phone numbers (including Indian mobile numbers with 5-5 digit spacing `+91 98765 43210`, US formats, and international E.164), email addresses, financial accounts/UPI identifiers, and participant names with privacy tokens (`[PHONE_REDACTED]`, `[EMAIL_REDACTED]`, `[ACCOUNT_REDACTED]`, `[USER]`, `[PARTNER]`).
- **FR-010**: System **MUST** render an interactive 5-act theatrical unboxing flow and generate high-resolution 9:16 vertical story card images on demand.
- **FR-011**: System **MUST** support incremental/differential delta ingestion for existing contacts, deduplicating messages via deterministic content hashes, persisting only newly appended messages, re-evaluating lifetime chronemics, and generating comparative delta badges.

---

### Key Entities

| Entity Name | Conceptual Role | Core Attributes (Conceptual) | Relationships |
| :--- | :--- | :--- | :--- |
| **Participant** | A human conversational actor in the chat | Name, role (User vs Partner), message count, initiation count | Belongs to 1 Conversation; Associated with many Messages |
| **RawMessage** | An unredacted message line parsed from the chat | Source sequence index, timestamp, raw sender handle, text content, media flag | Belongs to 1 Participant; Transforms into 1 SanitizedMessage |
| **SanitizedMessage** | A privacy-scrubbed message ready for analysis | Content hash, timestamp, sanitized sender token, masked body | Derived from 1 RawMessage; Contributes to ChronemicsReport |
| **ChronemicsReport** | Deterministic timing metrics for a conversation | Initiation ratio, median response latency, chasing double-text count, late-night ratio | Computed from sequence of SanitizedMessages; Belongs to 1 Contact |
| **StoryCardSnapshot** | A renderable 9:16 vertical social export artifact | Card type (Master Verdict, Flags Locker, Superlatives), image dimensions (1080x1920), cached image URI | Generated from 1 ChronemicsReport and Dossier; Exportable to OS Share Sheet |

---

## Success Criteria

### Measurable Outcomes
- **SC-001**: System parses and validates a 50,000-message chat archive in under 1.2 seconds on standard consumer mobile hardware.
- **SC-002**: 100% of outbound text payloads submitted to external AI services contain zero unmasked phone numbers (including grouped/spaced Indian mobile numbers like `+91 98765 43210`), email addresses, or participant real names.
- **SC-003**: 0% mathematical variance across repeated chronemics computations on the identical chat archive (100% deterministic reproducibility).
- **SC-004**: Zero-delta re-imports complete in 0.0 seconds and consume exactly 0 AI API tokens.
- **SC-005**: 100% of rendered 9:16 story card images conform to the 1080x1920 aspect ratio and render with high-contrast text on pure white canvas backgrounds.
- **SC-006**: Incremental delta imports of up to 500 new messages on an existing archive complete ingestion, deduplication, and lifetime chronemics recalculation in under 1.5 seconds.

---

## Assumptions

- **WhatsApp Export Format**: WhatsApp export files follow standard text dump conventions with timestamps, sender names, and colons. Non-standard third-party modification dumps are out of scope.
- **Device Hardware**: Target mobile devices support hardware-accelerated SHA-256 computation and native biometric authentication prompts.
- **Language Scope**: Initial conversation ingestion supports English, South Asian Hinglish, and Telugu conversational patterns.
- **Local Storage Capacity**: The host mobile device has at least 50MB of free local storage for SQLite database persistence and cached image generation.

---

## Non-Goals (Out of Scope)

- ❌ Multi-person group chat forensic analysis (Assify is exclusively calibrated for 1-on-1 situationships).
- ❌ Audio voice note transcription via Whisper (deferred to Phase 2 backlog).
- ❌ In-app conversational AI chat coach ("Doctor Delulu" deferred to Phase 2).
- ❌ Cloud synchronization and user account sign-in (MVP operates 100% offline-first in local vault).
- ❌ Dark mode theme implementation (Assify strictly uses 100% Light Apple HIG Design System).

---

## AI Coding Agent Directives for Specification Drafting

```markdown
1. WHAT VS HOW FIREWALL: You MUST NOT mention programming languages (TypeScript, Python),
   frameworks (React, Expo), state libraries (Zustand), database engines (SQLite), or REST routes.
   Specify strictly WHAT the system does and WHY.
2. OBJECTIVE SUCCESS CRITERIA: Every SC criterion MUST have a quantifiable numerical threshold
   (e.g., <1.2s parsing time, 100% PII removal, 0 token burn).
3. EXHAUSTIVE EDGE CASES: You MUST address all four edge case quadrants (Boundaries, Network,
   Concurrency, Security) with explicit, verifiable system behaviors.
4. BOUNDED CLARIFICATIONS: Zero unresolved clarification tags remain; standard industry defaults
   are documented in the Assumptions section.
```
