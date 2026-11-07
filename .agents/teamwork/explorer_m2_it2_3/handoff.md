# Handoff Report: Milestone 2 Iteration 2 — Missing Tasks & Chronemics/Sanitization Edge Cases Analysis

**Author**: `explorer_m2_it2_3`  
**Archetype**: `teamwork_explorer`  
**Parent Orchestrator**: `orchestrator_2` (Conversation ID: `898607cd-2905-4a6e-af79-531d6b976d98`)  
**Working Directory**: `c:\Users\DELL\gen ai\Assify\.agents\teamwork\explorer_m2_it2_3\`  
**Target Files**:
- `docs/templates/sdd/examples/tasks.md`
- `docs/templates/sdd/examples/spec.md`  
**Timestamp**: 2026-11-04T07:40:00Z  

---

## 1. Observation

### 1.1 `tasks.md` Deficit: Missing Centralized Primitive & Screen Routes
1. **Constitutional & Plan Mandates**:
   - `docs/templates/sdd/examples/constitution.md` (Article II, lines 43–52):
     > "Screens (specifically route files under `mobile/src/app/(tabs)/*` and `mobile/src/app/dossier/*`) MUST NOT declare bespoke card containers, metric boxes, shadow frames, or segmented switchers in local `StyleSheet.create` blocks. Every visual structure, data row, and layout container shared across screens MUST be extracted and maintained as a centralized primitive in `mobile/src/components/ui/`: `StatStrip`, `SegmentedControl`, `EditorialSection`, `ReceiptQuote`, `DeluluGauge`."
   - `docs/templates/sdd/examples/plan.md` (lines 310–324):
     ```text
     mobile/src/app/
     ├── (tabs)/
     │   ├── index.tsx                 # Home canvas & dropzone screen
     │   ├── vault.tsx                 # Saved contacts & past dossiers screen
     │   └── settings.tsx              # Biometric lock & 1-tap hard wipe screen
     └── dossier/
         ├── unboxing.tsx              # 5-Act paged theatrical reveal screen
         └── report.tsx                # Full unlocked dossier & story share screen
     mobile/src/components/ui/
     ├── StatStrip.tsx
     ├── SegmentedControl.tsx
     ├── EditorialSection.tsx
     ├── ReceiptQuote.tsx
     ├── DeluluGauge.tsx
     └── ParticipantModal.tsx
     ```
2. **Current `tasks.md` Omissions**:
   - Grep verification across `docs/templates/sdd/examples/tasks.md`:
     - `mobile/src/components/ui/SegmentedControl.tsx`: **0 occurrences** (NOT FOUND).
     - `mobile/src/app/(tabs)/vault.tsx`: **0 occurrences** (NOT FOUND).
     - `mobile/src/app/dossier/report.tsx`: **0 occurrences** (NOT FOUND).
   - In `tasks.md` Phase 5 (lines 104–109), only `StatStrip.tsx`, `EditorialSection.tsx`, `ReceiptQuote.tsx`, `DeluluGauge.tsx`, `QuoteRehydrator.ts`, `StoryExporter.ts`, and `unboxing.tsx` are authored. The final unlocked presentation screen (`report.tsx`), the historical contacts tab (`vault.tsx`), and the tactile tab switcher primitive (`SegmentedControl.tsx`) are completely unrepresented.

### 1.2 `tasks.md` Deficit: Task Count Discrepancy & Commented-out Convergence Tasks
1. In `worker_m2/handoff.md`:
   - Worker claimed: `"38 total active tasks (T001 through T038)"`.
   - Worker's validation test used naive regex `[l.strip() for l in lines if l.strip().startswith('- [ ]')]` which returned 38.
2. In `docs/templates/sdd/examples/tasks.md` (lines 206–209):
   ```markdown
   <!-- Pre-defined gap resolution examples for convergence audit:
   - [ ] T037 Remediate multiline quote wrapping (partial) in `mobile/src/components/ui/ReceiptQuote.tsx`
   - [ ] T038 Fix terminal turn exclusion edge case per FR-008 (missing) in `mobile/src/services/chronemics/ChronemicsEngine.ts`
   -->
   ```
3. Direct Inspection of Checkboxes:
   - Non-commented active tasks in Phases 1 through 6: exactly **36 active tasks** (`T001` through `T036`).
   - Tasks `T037` and `T038` are inside HTML comments (`<!-- ... -->`). They are inert illustrative examples, not active tasks.
   - Commented `T038` admitted: `Fix terminal turn exclusion edge case per FR-008 (missing)`, acknowledging that a core FR-008 telemetry requirement was not implemented in the active tasks.

### 1.3 `spec.md` Deficit: Missing Telemetry & Delta Ingestion Edge Cases
1. In `requirements/00_base_requirements/MAIN_APP_REQUIREMENTS.md`:
   - Section 3.6 (lines 175–178):
     > "Incremental Delta Processing: If new messages are detected ($N_{new} > 0$), previously stored messages are skipped via deterministic content hashes. Assify computes telemetry across the lifetime conversation AND computes specific delta badges (e.g., *'Delulu Score: 82% (+12% since last check)'*, *'Response Latency: slowed by 24m'*, *'3 New Red Flags Detected'*)."
   - Section 4.3.3 (line 209):
     > "Terminal Turn Exclusion: The final unanswered message of a conversation is classified as a terminal turn and excluded from alternating latency medians."
2. In `.agents/teamwork/spec_miner_survey_1/survey_report.md` §3.2:
   - Edge Case 7: Incremental Delta Ingestion.
   - Edge Case 9: Terminal Turn Exclusion.
3. In `docs/templates/sdd/examples/spec.md`:
   - Edge Cases Quadrant 1 (lines 104–109): Only lists Zero-Byte, 29-Message Edge, High-Volume Archive, and Extreme Multiline. **Terminal Turn Exclusion is missing.**
   - Edge Cases Quadrant 3 (lines 115–119): Only lists Double-Tap Lock, Zero-Delta Re-Import, and Same-Minute Bursts. **Incremental / Differential Delta Ingestion is missing.**
   - FR-008 (line 141): Omits terminal turn exclusion from the list of mathematical chronemics requirements.

### 1.4 `spec.md` Deficit: Spaced Indian Mobile Number Regex Vulnerability
1. In `spec_miner_survey_1/survey_report.md` §3.2 (Edge Case 11):
   - Chat message contains mobile `+91 98765 43210`.
2. Empirical Regex Execution:
   - A standard naive regex `\+91[-.\s]?\d{10}\b` fails on standard 5-5 grouped Indian WhatsApp numbers:
     ```python
     import re
     naive_regex = re.compile(r'\+91[-.\s]?\d{10}\b')
     assert naive_regex.search('+91 98765 43210') is None  # FAILS TO MATCH!
     ```
   - WhatsApp in India displays international phone numbers with a space between the country code and the mobile number, and a space separating the 10 digits into two 5-digit groups (`+91 98765 43210`).
   - If `spec.md` (FR-009, SC-002, Edge Case 14) and `test_pii_sanitizer.test.ts` only specify unspaced 10-digit formats, phone numbers leak unmasked across external network boundaries.

---

## 2. Logic Chain

1. **Constitutional Alignment & Full User Journey**:
   - `constitution.md` mandates that `SegmentedControl.tsx` is one of the 5 canonical primitives.
   - `plan.md` establishes `report.tsx` (the screen where unboxed dossiers are reviewed and exported as 9:16 story cards) and `vault.tsx` (the screen where users browse vaulted contacts and past dossiers offline).
   - Without tasks to build `SegmentedControl.tsx`, `report.tsx`, and `vault.tsx`, an autonomous worker following `tasks.md` will terminate with an incomplete application, leaving the unboxing screen dead-ended and the vault tab blank.
2. **Task Count Integrity**:
   - Commented-out lines in markdown do not execute. Counting them as active tasks is a false completion assertion.
   - Adding the 3 missing items (`SegmentedControl.tsx`, `report.tsx`, `vault.tsx`) brings the active task list to **39 active tasks** (`T001` to `T039`).
   - Phase 7 (Append-Only Convergence) is an append-only container reserved for `/speckit-converge`. It must not contain pseudo-tasks with `- [ ]` checkboxes inside comments that mislead automated task counters.
3. **Telemetry Determinism & Zero Data Skew**:
   - When a conversation ends with an unreciprocated message, calculating response latency on that trailing turn either triggers a division-by-zero, causes an infinite/undefined duration, or severely skews median responsiveness metrics.
   - Codifying **Terminal Turn Exclusion** in `spec.md` (Edge Case Matrix & FR-008) and `tasks.md` ensures mathematical determinism.
4. **Differential Delta Ingestion**:
   - The core value proposition in `MAIN_APP_REQUIREMENTS.md` Scenario C is the 2-week check-in (evolutionary delta audit).
   - Codifying **Incremental / Differential Delta Ingestion** in `spec.md` (Edge Case Matrix & FR-011) and `tasks.md` ensures the system ingests new messages, preserves history, and computes delta badges without re-processing previously hashed records.
5. **PII Leakage Prevention**:
   - WhatsApp's standard formatting for Indian contacts is `+91 98765 43210`.
   - The regex pattern `(?:\+?91[\s.-]?)?(?:[6-9]\d{9}|[6-9]\d{4}[\s.-]?\d{5})\b` correctly matches spaced, hyphenated, unspaced, and un-prefixed Indian mobile numbers, eliminating PII leaks across the external AI boundary.

---

## 3. Caveats

1. **FastAPI Backend Boundary**: The current feature branch `002-offline-whatsapp-forensics` is scoped to the React Native mobile client running local SQLite WAL storage and 0-LLM chronemics. Network timeout handling for the AI synthesis scanner (`Analysis taking longer than expected` with `Retry Synthesis`) is an in-app state machine capability in `chatStore.ts` and `unboxing.tsx`.
2. **Read-Only Explorer Role**: As an explorer subagent, I have made zero modifications to files outside `.agents/teamwork/explorer_m2_it2_3/`. All proposed changes below are structured as drop-in replacement specifications for `worker_m2_it2`.

---

## 4. Conclusion & Exact Proposed Fixes

### 4.1 Proposed Exact Changes for `docs/templates/sdd/examples/tasks.md`

#### A. Active Task Count & Sequence Restructuring
- Restructure Phase 5 to include `SegmentedControl.tsx` primitive, `report.tsx` screen, and `vault.tsx` screen.
- Restructure Phase 6 to include incremental delta ingestion in `ChatParser.ts`.
- Total Active Tasks: **39 active tasks** (`T001` through `T039`).
- Phase 7: Clear out active `- [ ]` checkboxes from comments; provide clear guidance for `/speckit-converge`.

#### B. Exact Task Specification for Phase 5 (User Story 3)
Replace lines 93–113 of `docs/templates/sdd/examples/tasks.md` with:

```markdown
## Phase 5: User Story 3 - 5-Act Theatrical Unboxing & 9:16 Social Story Card Export (Priority: P3)

**Goal**: Present an interactive 5-act paged unboxing reveal with physics-spring Delulu needle gauge, rehydrate privacy tokens to real participant names client-side, render full unlocked dossier reports with tactile segmented switching, browse historical dossiers in the vault tab, and capture high-resolution 1080x1920 9:16 PNG story cards to the native OS share sheet.  
**Independent Test**: Load a completed dossier into the unboxing view. Verify that the user can navigate through Acts 1 to 5, the Delulu needle springs to the target score with correct circus tier styling, completing Act 5 navigates to `report.tsx`, switching segments filters dossier sections, saved dossiers display in `vault.tsx`, and tapping "Share Story" invokes native view capture producing a valid 9:16 image (`npx jest mobile/tests/components/ui/test_delulu_gauge.test.ts`).

### Tests for User Story 3 (TDD Red Phase)
- [ ] T024 [P] [US3] Author component tests for Reanimated Delulu gauge needle angle calculation and circus tier color mapping in `mobile/tests/components/ui/test_delulu_gauge.test.ts`
- [ ] T025 [P] [US3] Author unit tests for client-side quote token rehydration (`[USER]`/`[PARTNER]` $\rightarrow$ real names) in `mobile/tests/unit/test_quote_rehydrator.test.ts`
- [ ] T026 [P] [US3] Author contract test for offscreen 9:16 view-shot image generation and OS share sheet invocation in `mobile/tests/unit/test_story_exporter.test.ts`

### Implementation for User Story 3 (TDD Green Phase)
- [ ] T027 [P] [US3] Implement centralized `StatStrip` and `EditorialSection` UI primitives in `mobile/src/components/ui/StatStrip.tsx` and `mobile/src/components/ui/EditorialSection.tsx`
- [ ] T028 [P] [US3] Implement centralized tactile `SegmentedControl` pill switcher primitive with physics spring indicator in `mobile/src/components/ui/SegmentedControl.tsx`
- [ ] T029 [P] [US3] Implement centralized `ReceiptQuote` component with sender badge in `mobile/src/components/ui/ReceiptQuote.tsx`
- [ ] T030 [P] [US3] Implement Reanimated physics `DeluluGauge` component with circus tier badges in `mobile/src/components/ui/DeluluGauge.tsx`
- [ ] T031 [P] [US3] Implement client-side presentation quote rehydrator in `mobile/src/services/sanitizer/QuoteRehydrator.ts`
- [ ] T032 [US3] Implement high-resolution 9:16 offscreen view-shot exporter service using `react-native-view-shot` in `mobile/src/services/share/StoryExporter.ts`
- [ ] T033 [US3] Implement 5-act paged unboxing reveal screen route in `mobile/src/app/dossier/unboxing.tsx` (depends on T029, T030, T031, T032)
- [ ] T034 [US3] Implement full unlocked forensic dossier and story share screen route in `mobile/src/app/dossier/report.tsx` (depends on T027, T028, T029, T030, T031, T033)
- [ ] T035 [US3] Implement saved contacts and historical dossier vault screen route with `SegmentedControl` filter in `mobile/src/app/(tabs)/vault.tsx` (depends on T023, T028, T034)

**Checkpoint**: All 3 user stories are complete, verified, and integrated into the mobile user journey.
```

#### C. Exact Task Specification for Phase 6 (Polish & Cross-Cutting Concerns)
Replace lines 115–124 of `docs/templates/sdd/examples/tasks.md` with:

```markdown
## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: System hardening, offline vault verification, 1-tap hard wipe, and performance benchmarking.

- [ ] T036 Implement 1-tap exhaustive hard wipe purging SQLite tables, `FileSystem.cacheDirectory`, and MMKV keys in `mobile/src/app/(tabs)/settings.tsx`
- [ ] T037 Implement zero-delta import detection and incremental delta ingestion with change badges in `mobile/src/services/parser/ChatParser.ts`
- [ ] T038 Author performance benchmark test verifying 50,000 messages parse in $<1.2\text{s}$ in `mobile/tests/integration/test_parsing_benchmark.test.ts`
- [ ] T039 Run repository-wide TypeScript typechecking, ESLint validation, and Jest test suite in `mobile/package.json`
```

#### D. Exact Task Specification for Phase 7 (Append-Only Convergence)
Replace lines 188–210 of `docs/templates/sdd/examples/tasks.md` with:

```markdown
## Phase 7: Append-Only Convergence

<!--
  ============================================================================
  THE APPEND-ONLY CONVERGENCE LOOP:
  ----------------------------------------------------------------------------
  Executed by /speckit-converge post-implementation.
  NEVER rewrite or alter completed tasks above. If the convergence audit
  detects gaps between code reality and spec intent, append new tasks below.

  Gap Classifications:
  - (missing): Requirement completely omitted from codebase.
  - (partial): Feature implemented but fails an edge case or acceptance criteria.
  - (contradicts): Code directly violates a specification or constitutional clause.
  - (unrequested): Unprompted code or unapproved library introduced.

  NOTE: This section is an append-only target. Prior to convergence execution,
  it contains 0 active tasks. Do not insert active checkbox syntax inside comments.
  ============================================================================
-->
```

#### E. Task Header & Metadata Alignment in `tasks.md`
Ensure header reflects:
- Total active tasks: **39 active tasks** (`T001` through `T039`).
- Verification rule: automated task counters matching `^- \[ \]` will find exactly 39 tasks across Phases 1–6.

---

### 4.2 Proposed Exact Changes for `docs/templates/sdd/examples/spec.md`

#### A. Edge Cases Additions (Quadrants 1, 3, and 4)
In `docs/templates/sdd/examples/spec.md` Section "Edge Cases (Four-Quadrant Matrix)", replace lines 102–128 with:

```markdown
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
```

#### B. User Story 2 Acceptance Scenario Update
In `docs/templates/sdd/examples/spec.md`, append Acceptance Scenario 5 under User Story 2 (after line 68):

```markdown
5. **Given** a conversation where the final conversational turn was sent by a participant with no subsequent response from the partner,  
   **When** median response latency is computed,  
   **Then** the final unanswered turn is identified as a terminal turn and omitted from alternating turn latency datasets, preventing indefinite trailing silence from skewing responsiveness metrics.  
   - **Evidence Check**: Automated unit test verifies that appending an unanswered trailing turn leaves the computed median response latencies for both participants unchanged.
```

#### C. Functional Requirements Update
In `docs/templates/sdd/examples/spec.md`, update **FR-008** and **FR-009**, and add **FR-011**:

```markdown
- **FR-008**: System **MUST** calculate 0-LLM chronemics telemetry including: 90-second turn clustering, 3.5-hour silence seam detection, median response latency with overnight sleep clamping (23:00 to 08:00), terminal turn exclusion (omitting final unanswered turns from alternating latency medians), chasing double-texts ($\ge 30\text{m}$ gap), and late-night volume ratio (23:00 to 04:00).
- **FR-009**: System **MUST** enforce pre-flight zero-trust PII sanitization on all outbound message text, replacing phone numbers (including Indian mobile numbers with 5-5 digit spacing `+91 98765 43210`, US formats, and international E.164), email addresses, financial accounts/UPI identifiers, and participant names with privacy tokens (`[PHONE_REDACTED]`, `[EMAIL_REDACTED]`, `[ACCOUNT_REDACTED]`, `[USER]`, `[PARTNER]`).
- **FR-011**: System **MUST** support incremental/differential delta ingestion for existing contacts, deduplicating messages via deterministic content hashes, persisting only newly appended messages, re-evaluating lifetime chronemics, and generating comparative delta badges.
```

#### D. Success Criteria Update
In `docs/templates/sdd/examples/spec.md`, update **SC-002** and add **SC-006**:

```markdown
- **SC-002**: 100% of outbound text payloads submitted to external AI services contain zero unmasked phone numbers (including grouped/spaced Indian mobile numbers like `+91 98765 43210`), email addresses, or participant real names.
- **SC-006**: Incremental delta imports of up to 500 new messages on an existing archive complete ingestion, deduplication, and lifetime chronemics recalculation in under 1.5 seconds.
```

---

## 5. Verification Method

To independently verify these specifications and regex mechanisms:

1. **Verify Spaced Indian Phone Regex Matching**:
   Run the following Python command to verify that `(?:\+?91[\s.-]?)?(?:[6-9]\d{9}|[6-9]\d{4}[\s.-]?\d{5})\b` handles all WhatsApp phone formats:
   ```bash
   python -c "
   import re
   pattern = re.compile(r'(?:\+?91[\s.-]?)?(?:[6-9]\d{9}|[6-9]\d{4}[\s.-]?\d{5})\b')
   test_cases = [
       '+91 98765 43210',
       '+91 9876543210',
       '+91-98765-43210',
       '+919876543210',
       '98765 43210',
       '9876543210'
   ]
   for tc in test_cases:
       assert pattern.search(tc) is not None, f'Failed on {tc}'
       print(f'PASS: {tc} matched -> {pattern.search(tc).group(0)}')
   "
   ```

2. **Verify Task Checklist Integrity & Total Count**:
   After the worker applies the proposed task changes:
   ```bash
   python -c "
   import re
   with open('docs/templates/sdd/examples/tasks.md', 'r', encoding='utf-8') as f:
       content = f.read()
   
   # Strip HTML comments before counting active tasks
   uncommented_content = re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)
   active_tasks = re.findall(r'^- \[ \] (T\d+)', uncommented_content, flags=re.MULTILINE)
   
   print(f'Active Task Count: {len(active_tasks)}')
   assert len(active_tasks) == 39, f'Expected 39 active tasks, got {len(active_tasks)}'
   
   # Verify mandated primitives and screens
   for item in ['SegmentedControl.tsx', 'vault.tsx', 'report.tsx']:
       assert item in uncommented_content, f'Missing {item}'
       print(f'PASS: Found active task for {item}')
   "
   ```

3. **Verify Spec Edge Cases Presence**:
   After the worker applies the proposed spec changes:
   ```bash
   python -c "
   with open('docs/templates/sdd/examples/spec.md', 'r', encoding='utf-8') as f:
       spec = f.read()
   
   assert 'Terminal Turn Exclusion' in spec, 'Missing Terminal Turn Exclusion'
   assert 'Incremental / Differential Delta Ingestion' in spec, 'Missing Incremental Delta Ingestion'
   assert '+91 98765 43210' in spec, 'Missing 5-5 spaced phone number specification'
   print('PASS: All missing edge cases verified in spec.md')
   "
   ```
