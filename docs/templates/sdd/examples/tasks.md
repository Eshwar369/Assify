---
description: "Concrete task list for Offline WhatsApp Chat Import & 1-on-1 Forensics"
---

# Tasks: Offline WhatsApp Chat Import & 1-on-1 Forensics

**Input**: Design documents from `docs/templates/sdd/examples/plan.md` and `docs/templates/sdd/examples/spec.md`  
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/`  
**Tests**: Mandatory per Constitution Article V (TDD Red-Green-Refactor enforced across all user stories)  
**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.  

---

## Format: `- [ ] [TaskID] [P?] [Story?] Description with exact/relative/path`

- **`- [ ]`**: Standard Markdown checkbox. Toggled to `- [x]` ONLY after automated verification succeeds.
- **`[TaskID]`**: Sequential zero-padded identifier (`T001`, `T002`, `T003`...). Task IDs are immutable.
- **`[P]`**: Parallel flag. Indicates the task operates on an isolated file with zero unresolved prerequisites in the same phase.
- **`[Story]`**: User story identifier (`[US1]`, `[US2]`, `[US3]`). Mandatory in User Story phases; forbidden in Setup, Foundational, and Polish phases.
- **`Description & File Path`**: Precise action description containing the exact relative filesystem path to create or modify enclosed in backticks.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Repository configuration, dependency verification, and design token initialization.

- [ ] T001 Initialize Expo SDK 54 TypeScript project structure and configure compiler options in `mobile/tsconfig.json`
- [ ] T002 [P] Install core dependencies (`expo-sqlite`, `zustand`, `react-native-mmkv`, `react-native-reanimated`, `react-native-view-shot`, `expo-sharing`, `expo-local-authentication`) in `mobile/package.json`
- [ ] T003 [P] Implement Light Apple HIG canonical design tokens and spacing scales in `mobile/src/theme/tokens.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core database abstractions, SQLite WAL migrations, and base provider contracts that **MUST** be complete and verified before **ANY** user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this foundational phase is fully complete and verified.

- [ ] T004 Author initial database DDL schema migration defining contacts, messages, chronemics, and dossiers tables with `BIGINT` millisecond epoch timestamps (preventing 32-bit PostgreSQL overflow in Phase 2) in `mobile/src/database/migrations/001_initial_schema.sql`
- [ ] T005 [P] Define `BaseDatabaseProvider` abstract contract, DTOs, and provider registry functions (`registerDatabaseProvider`, `getDatabaseProvider`) in `mobile/src/database/BaseDatabaseProvider.ts`
- [ ] T006 Implement `SQLiteDatabaseProvider` conforming to `BaseDatabaseProvider` with WAL mode and 5000ms busy timeout handling in `mobile/src/database/SQLiteDatabaseProvider.ts` (depends on T004, T005)
- [ ] T007 [P] Implement deterministic SHA-256 message and contact hashing utilities in `mobile/src/services/parser/HashUtils.ts`
- [ ] T008 [P] Configure global MMKV synchronous key-value store wrapper in `mobile/src/stores/settingsStore.ts`

**Checkpoint**: Base database provider and SQLite WAL storage verified. User story implementation can now begin.

---

## Phase 3: User Story 1 - 1-on-1 WhatsApp Chat Archive Ingestion & Identity Resolution (Priority: P1) 🎯 MVP

**Goal**: Ingest WhatsApp plain text (`.txt`) and zipped (`.zip`) exports, enforce 1-on-1 participant count ($N=2$) and minimum 30-message volume gates, resolve participant identity via 1-tap modal, and persist deduplicated messages into SQLite.  
**Independent Test**: Provide an exported chat file with 2 participants and $\ge 30$ messages. Verify that the parser extracts participants, the participant modal opens, user identity is assigned, and deduplicated messages are committed to SQLite with zero network calls (`npx jest mobile/tests/unit/test_chat_parser.test.ts`).

### Tests for User Story 1 (TDD Red Phase)
> **NOTE: Write these tests FIRST; verify they FAIL with assertion errors before implementation**

- [ ] T009 [P] [US1] Author unit tests for WhatsApp timestamp parsing (Android/iOS, 12h/24h), multiline buffering, and Unicode normalization in `mobile/tests/unit/test_chat_parser.test.ts`
- [ ] T010 [P] [US1] Author unit tests for $N=2$ participant boundary gate, $<30$ message volume rejection, and system notice scrubbing in `mobile/tests/unit/test_chat_validation.test.ts`
- [ ] T011 [P] [US1] Author integration test for SQLite bulk message persistence and collision-free line-offset hashing in `mobile/tests/integration/test_sqlite_provider.test.ts`

### Implementation for User Story 1 (TDD Green Phase)
- [ ] T012 [P] [US1] Declare chat parser interface contracts, DTOs, and regex tokenizers in `mobile/src/services/parser/types.ts`
- [ ] T013 [US1] Implement streaming regex line lexer supporting Android and iOS WhatsApp formats with ZIP decompression in `mobile/src/services/parser/ChatParser.ts` (depends on T012, T007)
- [ ] T014 [P] [US1] Implement centralized Apple-style 1-tap participant resolution modal primitive in `mobile/src/components/ui/ParticipantModal.tsx`
- [ ] T015 [US1] Implement ingestion state machine and active participant resolution state in `mobile/src/stores/chatStore.ts` consuming abstract `BaseDatabaseProvider` via `getDatabaseProvider()` (depends on T013, T005)
- [ ] T016 [US1] Initialize `SQLiteDatabaseProvider`, register into `BaseDatabaseProvider` registry, and wire file picker dropzone and participant modal into home screen route in `mobile/src/app/(tabs)/index.tsx` (depends on T006, T014, T015)

**Checkpoint**: User Story 1 is fully functional and independently testable. Run `npx jest mobile/tests/unit/test_chat_parser.test.ts` to validate the working MVP!

---

## Phase 4: User Story 2 - Deterministic 0-LLM Chronemics & Timing Telemetry (Priority: P2)

**Goal**: Calculate mathematical timing telemetry from message timestamps without AI models: 90-second turn clustering, 3.5-hour silence seams, median response latency with overnight sleep clamping (23:00 to 08:00), and chasing double-text classification ($\ge 30\text{m}$).  
**Independent Test**: Pass a pre-parsed message sequence into the chronemics engine. Verify that all timing metrics, sleep gap exclusions, and double-text counts match mathematical ground truth (`npx jest mobile/tests/unit/test_chronemics.test.ts`).

### Tests for User Story 2 (TDD Red Phase)
- [ ] T017 [P] [US2] Author unit tests for 90-second turn clustering, 3.5-hour silence seam detection, and terminal turn exclusion in `mobile/tests/unit/test_chronemics.test.ts`
- [ ] T018 [P] [US2] Author unit tests for overnight sleep gap clamping (23:00 to 08:00) and chasing double-text identification ($\ge 30\text{m}$) in `mobile/tests/unit/test_chronemics_latencies.test.ts`
- [ ] T019 [P] [US2] Author unit tests for pre-flight zero-trust regex PII sanitization (phones, emails, UPI, names) in `mobile/tests/unit/test_pii_sanitizer.test.ts`

### Implementation for User Story 2 (TDD Green Phase)
- [ ] T020 [P] [US2] Define chronemics engine interface contracts and turn data structures in `mobile/src/services/chronemics/types.ts`
- [ ] T021 [US2] Implement deterministic 0-LLM chronemics mathematical engine in `mobile/src/services/chronemics/ChronemicsEngine.ts` (depends on T020)
- [ ] T022 [P] [US2] Implement client-side zero-trust regex PII sanitizer in `mobile/src/services/sanitizer/PiiSanitizer.ts`
- [ ] T023 [US2] Integrate chronemics generation and persistence into vault storage store in `mobile/src/stores/vaultStore.ts` consuming abstract `BaseDatabaseProvider` via `getDatabaseProvider()` (depends on T021, T005)

**Checkpoint**: User Stories 1 AND 2 operate seamlessly. Telemetry math runs deterministically with 100% test coverage.

---

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

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: System hardening, offline vault verification, 1-tap hard wipe, and performance benchmarking.

- [ ] T036 Implement 1-tap exhaustive hard wipe purging persisted tables via `BaseDatabaseProvider.wipeAllData()`, `FileSystem.cacheDirectory`, and MMKV keys in `mobile/src/app/(tabs)/settings.tsx` (depends on T005, T008)
- [ ] T037 Implement zero-delta import detection and incremental delta ingestion with change badges in `mobile/src/services/parser/ChatParser.ts`
- [ ] T038 Author performance benchmark test verifying 50,000 messages parse in $<1.2\text{s}$ in `mobile/tests/integration/test_parsing_benchmark.test.ts`
- [ ] T039 Run repository-wide TypeScript typechecking, ESLint validation, and Jest test suite in `mobile/package.json`

---

## Dependencies & Execution Order

### Phase Dependencies
- **Phase 1 (Setup)**: Initialized immediately with zero prerequisites.
- **Phase 2 (Foundational)**: Depends on Phase 1 completion. **BLOCKS all user story phases**.
- **Phase 3 (User Story 1)**: Depends on Phase 2 completion. Delivers working MVP ingestion and identity resolution.
- **Phase 4 (User Story 2)**: Depends on Phase 3 completion. Adds deterministic chronemics and PII scrubbing.
- **Phase 5 (User Story 3)**: Depends on Phase 4 completion. Adds 5-Act unboxing and 9:16 story card export.
- **Phase 6 (Polish)**: Hardens system, enforces 1-tap hard wipe, and benchmarks throughput.
- **Phase 7 (Convergence)**: Terminal audit section executed post-implementation.

### Within Each User Story
1. Automated unit/contract tests **MUST** be authored and verified failing before writing implementation code.
2. Data structures and service interfaces **MUST** be declared before implementation logic.
3. Centralized UI primitives **MUST** be created in `mobile/src/components/ui/` before wiring into screen routes.
4. Checkpoints **MUST** pass before advancing to the next user story phase.

---

## Parallel Execution Example: User Story 1

```bash
# Launch parallel test authoring for User Story 1:
Agent 1: "Author unit tests for timestamp parsing in mobile/tests/unit/test_chat_parser.test.ts" (T009)
Agent 2: "Author boundary tests for N=2 gate in mobile/tests/unit/test_chat_validation.test.ts" (T010)

# Launch parallel interface and primitive implementation:
Agent 1: "Declare parser types in mobile/src/services/parser/types.ts" (T012)
Agent 2: "Implement ParticipantModal primitive in mobile/src/components/ui/ParticipantModal.tsx" (T014)
```

---

## Implementation Strategy & MVP Delivery

### 1. MVP First (User Story 1 Only)
1. Complete **Phase 1: Setup**.
2. Complete **Phase 2: Foundational Gate** (BLOCKING).
3. Complete **Phase 3: User Story 1**.
4. **STOP AND VALIDATE**: Run `npx jest mobile/tests/unit/test_chat_parser.test.ts`. Verify working MVP ingestion and identity resolution before proceeding!

### 2. Incremental Story Delivery
- Add User Story 2 $\rightarrow$ Validate 0-LLM chronemics and sleep clamping $\rightarrow$ Checkpoint.
- Add User Story 3 $\rightarrow$ Validate 5-Act unboxing and 9:16 story card export $\rightarrow$ Checkpoint.
- Run Phase 6 Polish $\rightarrow$ Validate 1-tap hard wipe and zero-delta optimization.

---

## AI Coding Agent Directives for Implementation

```markdown
1. SINGLE TASK FOCUS: You MUST execute exactly ONE task per prompt turn.
2. VERIFICATION-FIRST PROTOCOL: Run the designated test command and verify exit code 0
   before checking the box `[x]`.
3. COMPONENT-FIRST LAW: You MUST NOT author custom card styling inside screen routes.
   Consume primitives exclusively from `mobile/src/components/ui/`.
4. SCOPE QUARANTINE: Touch ONLY the exact file path declared in the active task description.
5. NO SHORTCUTS: Maintain genuine SQLite state and mathematical chronemics logic.
```

---

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
