# Dispatch: Milestone 2 Worker (Project-Tailored Real-World Reference Examples)

You are worker_m2.
Working directory: c:\Users\DELL\gen ai\Assify\.agents\teamwork\worker_m2\
Parent orchestrator: orchestrator_2 (Conversation ID: 898607cd-2905-4a6e-af79-531d6b976d98)
Original Request Path: c:\Users\DELL\gen ai\Assify\.agents\teamwork\ORIGINAL_REQUEST.md

## Scope & Write Ownership
You exclusively own and MUST create the following 4 files:
1. `c:\Users\DELL\gen ai\Assify\docs\templates\sdd\examples\constitution.md`
2. `c:\Users\DELL\gen ai\Assify\docs\templates\sdd\examples\spec.md`
3. `c:\Users\DELL\gen ai\Assify\docs\templates\sdd\examples\plan.md`
4. `c:\Users\DELL\gen ai\Assify\docs\templates\sdd\examples\tasks.md`

DO NOT modify files outside your ownership.

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Input Resources
- c:\Users\DELL\gen ai\Assify\.agents\teamwork\ORIGINAL_REQUEST.md
- c:\Users\DELL\gen ai\Assify\.agents\teamwork\spec_miner_survey_1\survey_report.md
- c:\Users\DELL\gen ai\Assify\requirements\00_base_requirements\MAIN_APP_REQUIREMENTS.md
- c:\Users\DELL\gen ai\Assify\ASSIFY_MASTER_BLUEPRINT.md
- c:\Users\DELL\gen ai\Assify\.specify\memory\constitution.md
- c:\Users\DELL\gen ai\Assify\docs\templates\sdd\generic\ (the 4 generic templates you will instantiate)

## Detailed Requirements for Deliverables

### Deliverable 1: `docs/templates/sdd/examples/constitution.md`
Instantiate the generic constitution template specifically for Assify (v2.0.0-PROD):
- Title: `# Assify Core Constitution`
- Sync Impact Report comment and SemVer line (`**Version**: 2.0.0 | **Ratified**: 2026-11-04`).
- Article I: Architectural Integrity & Universal Database Provider (`BaseDatabaseProvider` abstraction, SQLite WAL mode MVP on mobile, Supabase PostgreSQL Phase 2 cloud readiness).
- Article II: Component-First Law (Components import tokens; screens in `app/(tabs)/*` import components; zero screen-level container drift; centralized primitives in `mobile/src/components/ui/`: `StatStrip`, `SegmentedControl`, `EditorialSection`, `ReceiptQuote`).
- Article III: Anti-Slop Enforcement (`native-slop.md` 20 tells: no "everything's a card", no floating pill collisions, no wireframe 1px gray borders; spatial grouping with background hierarchy + hairlines).
- Article IV: Design Token Locks (100% Light Apple HIG Design System: `#FFFFFF` pure white canvas, `#F5F5F7` secondary background, `#BF9B28` deluluGold; ZERO dark mode for MVP to avoid theme schizophrenia).
- Article V: Test-Driven Development & Evidence Before Completion (100% domain coverage, red-green-refactor, failing tests committed before implementation).
- Article VI: Biometric Sanctuary & Zero-Trust PII Sanitization (local SHA-256 hashing, client-side PII scrubbing, 1-tap hard wipe).
- Architectural Invariants & Stack Constraints (Expo SDK 54 LTS, React Native 0.76+, Hermes, Zustand + MMKV, FastAPI).
- Quality Gates & Governance clauses.

### Deliverable 2: `docs/templates/sdd/examples/spec.md`
Concrete feature specification for: **Offline WhatsApp Chat Import & 1-on-1 Forensics**:
- Title: `# Feature Specification: Offline WhatsApp Chat Import & 1-on-1 Forensics`
- User Stories (prioritized):
  * User Story 1 (P1 🎯 MVP): 1-on-1 WhatsApp chat zip/txt import with participant resolution modal ($N=2$ gate), 30 message minimum, and SHA-256 message deduplication.
  * User Story 2 (P2): 0-LLM Deterministic Chronemics Computation (90-second turn clustering, 3.5h silence seams, sleep clamping 23:00–07:00, initiation ratio, response time asymmetry).
  * User Story 3 (P3): Theatrical 5-Act Unboxing & 9:16 Story Card View Capture.
- Given-When-Then BDD acceptance scenarios for every story with explicit `Evidence Check:` linking to automated unit/contract tests.
- Four-Quadrant Edge Case Matrix covering at least 12 real-world edge cases from `survey_report.md` (e.g. system messages, group chat rejection, 29-message rejection, multiline messages, deleted messages, midnight time rollover, empty media attachments, corrupted zip, storage full, etc.).
- Functional Requirements: `FR-001` through `FR-010` with zero-padded IDs and RFC 2119 keywords (`MUST`).
- Key Entities: `Participant`, `RawMessage`, `SanitizedMessage`, `ChronemicsReport`, `StoryCardSnapshot`.
- Measurable Success Criteria: `SC-001` through `SC-005` (e.g. parsing 50,000 messages in <1.2s, 100% PII removal, 0 crash on malformed inputs).
- Zero technical implementation leakage in the spec body (What vs. How firewall).

### Deliverable 3: `docs/templates/sdd/examples/plan.md`
Concrete architectural implementation plan translating the spec into Assify's full-stack codebase:
- Title: `# Implementation Plan: Offline WhatsApp Chat Import & 1-on-1 Forensics`
- Technical Context grid: React Native 0.76+, Expo SDK 54 LTS, Hermes, Zustand + MMKV, Expo SQLite (WAL mode), Jest + React Native Testing Library, iOS 16+ / Android API 33+.
- Mandatory `Constitution Check` gate: Explicit evaluation and verification evidence for Articles I through VI.
- Phased Design Deliverables:
  * `research.md` decision triplets (Regex parser vs streaming lexer, SQLite WAL config, view-shot capture).
  * `data-model.md` schemas with SQLite DDL, indexes, and state machine transitions.
  * `contracts/` interface definitions for `IChatParser`, `IChronemicsEngine`, and `BaseDatabaseProvider`.
  * `quickstart.md` step-by-step verification runbook.
- Concrete Directory Layout Tree: Exact files across `mobile/src/components/ui/`, `mobile/src/services/`, `mobile/src/stores/`, `mobile/src/database/`, `app/(tabs)/`.
- Complexity Tracking table.

### Deliverable 4: `docs/templates/sdd/examples/tasks.md`
Concrete, dependency-ordered, test-driven task breakdown:
- YAML frontmatter.
- Strict task grammar: `- [ ] [TaskID] [P?] [Story?] Description with exact/relative/path`.
- Path conventions: `mobile/src/...`, `mobile/tests/...`.
- Phase 1: Setup (Shared Infrastructure).
- Phase 2: Foundational (Blocking Prerequisites) — database migrations in `mobile/src/database/migrations/`, `BaseDatabaseProvider` SQLite implementation.
- Phase 3: User Story 1 (P1 MVP) — TDD tests in `mobile/tests/unit/test_chat_parser.test.ts`, parser service, participant modal primitive, screen integration.
- Phase 4: User Story 2 (P2 Chronemics) — TDD tests for 90s clustering and 3.5h silence seams, chronemics engine in `mobile/src/services/chronemics/`.
- Phase 5: User Story 3 (P3 Theatrical Unboxing & Share Cards) — view-shot card snapshot, unboxing modal.
- Phase 6: Polish & Cross-Cutting Concerns — performance benchmarking, zero-delta caching.
- Phase 7: Append-Only Convergence (Terminal EOF Section) — pre-defined placeholder examples of gap resolution.

## Verification & Output
1. Run syntax, regex, and structure checks.
2. Ensure every task has an exact relative file path in backticks.
3. Ensure terminal convergence section is at EOF.
4. Write your completion report to `c:\Users\DELL\gen ai\Assify\.agents\teamwork\worker_m2\handoff.md`.
5. Message orchestrator_2 when done.


## 2026-11-04T04:03:03Z
[Message] sender=898607cd-2905-4a6e-af79-531d6b976d98 priority=MESSAGE_PRIORITY_HIGH
You are worker_m2.
Your working directory is: c:\Users\DELL\gen ai\Assify\.agents\teamwork\worker_m2\
Read your dispatch instructions in: c:\Users\DELL\gen ai\Assify\.agents\teamwork\worker_m2\DISPATCH.md
Follow the instructions carefully.
MANDATORY: Read c:\Users\DELL\gen ai\Assify\.agents\teamwork\ORIGINAL_REQUEST.md before starting work.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Create the 4 project-tailored reference example templates for Assify:
1. c:\Users\DELL\gen ai\Assify\docs\templates\sdd\examples\constitution.md
2. c:\Users\DELL\gen ai\Assify\docs\templates\sdd\examples\spec.md
3. c:\Users\DELL\gen ai\Assify\docs\templates\sdd\examples\plan.md
4. c:\Users\DELL\gen ai\Assify\docs\templates\sdd\examples\tasks.md

Follow all architectural constraints (Light Apple HIG tokens, Component-First Law, Anti-Slop 20 tells elimination, BaseDatabaseProvider, 0-LLM chronemics, TDD mandates).
Write your handoff report to c:\Users\DELL\gen ai\Assify\.agents\teamwork\worker_m2\handoff.md.
When finished, send a message to orchestrator_2 (ID: 898607cd-2905-4a6e-af79-531d6b976d98).
