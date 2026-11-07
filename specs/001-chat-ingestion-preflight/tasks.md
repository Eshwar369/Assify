# Tasks: WhatsApp Chat Ingestion & Pre-Flight Validation Engine

**Input**: Design documents from `specs/001-chat-ingestion-preflight/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/ingestion-parser.ts`, `quickstart.md`  
**TDD Enforcement**: Every story starts with failing tests proving the requirement, followed by implementation, followed by verification.

---

## Phase 1: Setup & Environment

**Purpose**: Create project directory layout and establish test fixtures

- [X] T001 Create ingestion domain directory layout in `src/core/ingestion/` and `src/ui/alerts/`
- [X] T002 [P] Create mock chat test fixtures in `tests/fixtures/valid_chat_ios.txt` and `tests/fixtures/valid_chat_android.txt`
- [X] T003 [P] Create boundary rejection mock fixtures in `tests/fixtures/invalid_group_chat.txt` and `tests/fixtures/invalid_too_few_messages.txt`

---

## Phase 2: Foundational Contracts & Types

**Purpose**: Core types and domain models that all stories depend on

- [X] T004 Define domain types and contracts in `src/core/ingestion/types.ts` matching `contracts/ingestion-parser.ts` (`ParsedChatSummary`, `ChronemicMetrics`, `ValidationResult`)

**Checkpoint**: Core domain interfaces ready — user story implementation can begin.

---

## Phase 3: User Story 1 - Direct File Drop & Ingestion of Raw Chat Log (Priority: P1) 🎯 MVP

**Goal**: Parse raw WhatsApp `.txt` logs across iOS and Android, extract the 2 participants, count messages, and calculate response latency and double-text bursts in a single pass.

**Independent Test**: Load `tests/fixtures/valid_chat_ios.txt` and verify that `Alex` and `Jordan` are extracted with accurate message counts, reply latencies, and cleaned text.

### Tests for User Story 1 (TDD - Write First)
- [X] T005 [P] [US1] Unit test for dual-regex line parser and system cleaner in `tests/unit/line-parser.test.ts`
- [X] T006 [P] [US1] Unit test for single-pass chronemics accumulator in `tests/unit/chronemics-accumulator.test.ts`

### Implementation for User Story 1
- [X] T007 [P] [US1] Implement dual-format WhatsApp line parser in `src/core/ingestion/line-parser.ts`
- [X] T008 [P] [US1] Implement system notice cleaner in `src/core/ingestion/system-cleaner.ts`
- [X] T009 [US1] Implement single-pass chronemics accumulator in `src/core/ingestion/chronemics-accumulator.ts`

**Checkpoint**: User Story 1 passes all unit tests independently.

---

## Phase 4: User Story 2 - Pre-Flight Rejection with Clear Native Feedback (Priority: P2)

**Goal**: Halt ingestion and trigger native modal dialog if $N \ne 2$ or message count $< 30$.

**Independent Test**: Pass `invalid_group_chat.txt` and verify `INVALID_PARTICIPANT_COUNT` is returned; pass `invalid_too_few_messages.txt` and verify `TOO_FEW_MESSAGES` is returned.

### Tests for User Story 2 (TDD - Write First)
- [X] T010 [P] [US2] Unit test for boundary rules in `tests/unit/preflight-validator.test.ts`

### Implementation for User Story 2
- [X] T011 [US2] Implement pre-flight boundary validator in `src/core/ingestion/preflight-validator.ts`
- [X] T012 [P] [US2] Implement native Apple HIG alert helper in `src/ui/alerts/rejection-dialog.ts`

**Checkpoint**: User Stories 1 and 2 work together and handle invalid inputs gracefully.

---

## Phase 5: User Story 3 - Streamlined ZIP Archive Extraction & Media Scrubbing (Priority: P3)

**Goal**: Unpack `.zip` archives in transient memory, isolate `_chat.txt`, and drop all media files without disk writes.

**Independent Test**: Provide mock ZIP containing text and dummy image; verify summary is extracted with zero media files written to disk.

### Tests for User Story 3 (TDD - Write First)
- [X] T013 [P] [US3] Unit test for in-memory ZIP extractor in `tests/unit/zip-extractor.test.ts`

### Implementation for User Story 3
- [X] T014 [US3] Implement in-memory ZIP decompression using `jszip` in `src/core/ingestion/zip-extractor.ts`

**Checkpoint**: User Story 3 extracts `.zip` archives with 0 bytes of media persisted.

---

## Phase 6: User Story 4 - Ingestion Service Coordinator & Integration (Priority: P4)

**Goal**: Expose unified `IChatIngestionService` coordinating file detection, decompression, validation, and summary production.

**Independent Test**: Run contract test verifying `ingest()` on both `.txt` and `.zip` buffers.

### Tests for User Story 4 (TDD - Write First)
- [X] T015 [US4] Contract integration test for `ChatIngestionService` in `tests/contract/ingestion-service.test.ts`

### Implementation for User Story 4
- [X] T016 [US4] Implement `ChatIngestionService` in `src/core/ingestion/ingestion-service.ts`
- [X] T017 [US4] Export public API entrypoint in `src/core/ingestion/index.ts`

---

## Phase 7: Polish & Verification

- [X] T018 Run complete automated test suite (`tests/unit/` + `tests/contract/`)
- [X] T019 Verify all validation scenarios against `quickstart.md`
- [X] T020 Run linter and typechecker to ensure clean build
