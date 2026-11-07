---
description: "Task list template for feature implementation"
---

# Tasks: [FEATURE_NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`  
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`  
**Tests**: Mandatory per Constitution (TDD Red-Green-Refactor enforced across all user stories)  
**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.  

<!--
  ============================================================================
  TASK LIST EXECUTION GOVERNANCE:
  ----------------------------------------------------------------------------
  This document is the actionable, dependency-ordered backlog executed by
  autonomous AI coding agents and human engineers.

  CRITICAL EXECUTION INVARIANTS:
  1. Every task MUST include an exact, relative file path in its description.
  2. Tasks are executed ONE AT A TIME in strict phase and dependency sequence.
  3. Tests MUST be written and verified FAILING before implementation code is written.
  4. A task checkbox is marked [x] ONLY after its automated verification command
     exits with status code 0.
  5. Never alter or renumber past completed tasks. If new gaps are discovered,
     append them to Phase N+1: Convergence.
  ============================================================================
-->

## Format: `- [ ] [TaskID] [P?] [Story?] Description with exact/relative/path`

- **`- [ ]`**: Standard Markdown checkbox. Toggled to `- [x]` ONLY after automated verification succeeds.
- **`[TaskID]`**: Sequential zero-padded identifier (`T001`, `T002`, `T003`...). Task IDs are immutable.
- **`[P]`**: Parallel flag. Indicates the task operates on an isolated file with zero unresolved prerequisites in the same phase.
- **`[Story]`**: User story identifier (`[US1]`, `[US2]`). **Mandatory in User Story phases; forbidden in Setup, Foundational, and Polish phases**.
- **`Description & File Path`**: Precise action description containing the exact relative filesystem path to create or modify.

### Reserved Task Syntax Flags vs. Template Placeholders

- **Reserved Structural Syntax Flags**: `[P]` (parallel execution marker) and `[US#]` (user story traceability markers, e.g., `[US1]`, `[US2]`, `[US3]`) are functional execution grammar flags parsed by SDD tooling. Autonomous agents and templating tools **MUST NOT** treat them as unpopulated placeholders, and **MUST NOT** substitute, rename, or strip them during template instantiation.
- **Template Substitution Variables**: Placeholders enclosed in brackets matching uppercase conventions (e.g., `[PROJECT_ROOT]`, `[CONFIG_FILE]`, `[ENTITY_NAME]`, `[SERVICE_NAME]`, `[COMPONENT_NAME]`, `[SCREEN_NAME]`) **MUST** be replaced with concrete project-specific names.
- **Flag-Safe Extraction Regex**: Parsers extracting unpopulated placeholders **MUST** use negative lookahead to exclude reserved flags: `\[(?!(?:P|US\d+)\b)([A-Z0-9_]+)\]`.

## Path Conventions

- **Single Project**: `src/`, `tests/` at repository root
- **Full-Stack Web**: `backend/src/`, `frontend/src/`
- **Mobile Client**: `mobile/src/`, `mobile/__tests__/`
- Paths shown below assume standard project conventions; adjust based on `plan.md` structure.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, tooling configuration, and dependency installation.

- [ ] T001 Initialize directory layout and package configuration in `[PROJECT_ROOT]/`
- [ ] T002 [P] Install core runtime and library dependencies declared in `plan.md`
- [ ] T003 [P] Configure linter, TypeScript compiler, and code style rules in `[CONFIG_FILE]`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure, database schemas, and base provider contracts that **MUST** be complete before **ANY** user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this foundational phase is fully complete and verified.

- [ ] T004 Create database schema migrations and tables in `path/to/migrations/`
- [ ] T005 [P] Implement base abstract provider interface contracts in `path/to/providers/base.ts`
- [ ] T006 [P] Implement core storage or database provider adapter in `path/to/providers/storage.ts`
- [ ] T007 [P] Implement base domain entity models per `data-model.md` in `path/to/models/base.ts`
- [ ] T008 Configure centralized error handling and logging middleware in `path/to/errors.ts`

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel or sequential priority order.

---

## Phase 3: User Story 1 - [Brief Title] (Priority: P1) 🎯 MVP

**Goal**: [Synthesize goal from spec: What core capability does this story deliver?]  
**Independent Test**: [Concrete command or user journey verifying User Story 1 as a standalone MVP]  

### Tests for User Story 1 (TDD Red Phase)
> **NOTE: Write these tests FIRST; verify they FAIL with assertion errors before implementation**

- [ ] T009 [P] [US1] Unit test for domain validation logic in `tests/unit/test_[ENTITY_NAME].ts`
- [ ] T010 [P] [US1] Contract test for service interface per `contracts/` in `tests/contract/test_[SERVICE_NAME].ts`

### Implementation for User Story 1 (TDD Green Phase)
- [ ] T011 [P] [US1] Create domain entity data model with strict validation in `src/models/[ENTITY_NAME].ts`
- [ ] T012 [US1] Implement core service business logic in `src/services/[SERVICE_NAME].ts` (depends on T011)
- [ ] T013 [P] [US1] Implement shared UI layout primitive in `src/components/ui/[COMPONENT_NAME].tsx`
- [ ] T014 [US1] Wire component into screen route and application state in `src/routes/[SCREEN_NAME].tsx` (depends on T012, T013)

**Checkpoint**: At this point, User Story 1 MUST be fully functional and testable independently. Stop and validate the working MVP!

---

## Phase 4: User Story 2 - [Brief Title] (Priority: P2)

**Goal**: [Synthesize goal from spec for User Story 2]  
**Independent Test**: [Concrete verification for User Story 2]  

### Tests for User Story 2 (TDD Red Phase)
- [ ] T015 [P] [US2] Contract test for secondary service interface in `tests/contract/test_[SERVICE2_NAME].ts`
- [ ] T016 [P] [US2] Integration test exercising User Story 2 journey in `tests/integration/test_[JOURNEY2_NAME].ts`

### Implementation for User Story 2 (TDD Green Phase)
- [ ] T017 [P] [US2] Create secondary domain entity model in `src/models/[ENTITY2_NAME].ts`
- [ ] T018 [US2] Implement secondary service logic in `src/services/[SERVICE2_NAME].ts` (depends on T017)
- [ ] T019 [US2] Integrate secondary capability into user interface in `src/components/[VIEW_NAME].tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both function independently without regressions.

---

## Phase 5: User Story 3 - [Brief Title] (Priority: P3)

**Goal**: [Synthesize goal from spec for User Story 3]  
**Independent Test**: [Concrete verification for User Story 3]  

### Tests for User Story 3 (TDD Red Phase)
- [ ] T020 [P] [US3] Unit test for edge case scenario in `tests/unit/test_[SCENARIO3_NAME].ts`

### Implementation for User Story 3 (TDD Green Phase)
- [ ] T021 [US3] Implement enhancement service logic in `src/services/[ENHANCEMENT_NAME].ts`
- [ ] T022 [US3] Connect enhancement trigger to navigation screen in `src/routes/[SCREEN_NAME].tsx`

**Checkpoint**: All specified user stories are functional and testable.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: System-wide hardening, non-functional optimizations, and end-to-end verification.

- [ ] T023 [P] Add structured telemetry and performance metrics in `src/telemetry/[LOGGER_NAME].ts`
- [ ] T024 [P] Verify documentation and API schemas are synchronized in `docs/`
- [ ] T025 Run full automated test suite and verify end-to-end flow per `quickstart.md`
- [ ] T026 Execute production build and bundle size verification in `package.json`

---

## Dependencies & Execution Order

### Phase Dependencies
- **Phase 1 (Setup)**: Starts immediately with zero prerequisites.
- **Phase 2 (Foundational)**: Depends on Phase 1 completion. **BLOCKS all user stories**.
- **Phase 3+ (User Stories)**: Depend on Phase 2 completion. Proceed in strict priority order (P1 MVP $\rightarrow$ P2 $\rightarrow$ P3).
- **Phase N (Polish)**: Depends on all user stories reaching passing checkpoints.
- **Phase N+1 (Convergence)**: Triggered post-implementation to audit alignment.

### Within Each User Story
1. Automated tests **MUST** be authored and verified failing before implementation begins.
2. Domain entities and data models **MUST** be implemented before dependent services.
3. Services **MUST** be implemented before UI presentation and routing integration.
4. Each story must achieve a passing checkpoint before progressing to the next priority.

### Parallel Opportunities (`[P]`)
- Tasks marked with `[P]` operate on isolated files and may be executed concurrently without file lock contention.
- Independent test authoring tasks marked `[P]` can run simultaneously across different test files.

---

## Parallel Execution Example: User Story 1

```bash
# Launch parallel test generation for User Story 1:
Agent 1: "Write unit test in tests/unit/test_[ENTITY_NAME].ts" (T009)
Agent 2: "Write contract test in tests/contract/test_[SERVICE_NAME].ts" (T010)

# Launch parallel model and UI primitive implementation:
Agent 1: "Create entity model in src/models/[ENTITY_NAME].ts" (T011)
Agent 2: "Implement UI primitive in src/components/ui/[COMPONENT_NAME].tsx" (T013)
```

---

## Implementation Strategy & MVP Delivery

### 1. MVP First (User Story 1 Only)
1. Complete **Phase 1: Setup**.
2. Complete **Phase 2: Foundational Gate** (BLOCKING).
3. Complete **Phase 3: User Story 1**.
4. **STOP AND VALIDATE**: Execute the independent test for User Story 1. Verify working MVP software before writing any additional code!

### 2. Incremental Story Delivery
- Add User Story 2 $\rightarrow$ Validate independently $\rightarrow$ Checkpoint.
- Add User Story 3 $\rightarrow$ Validate independently $\rightarrow$ Checkpoint.
- Every story increment adds discrete user value without regressing existing features.

---

## AI Coding Agent Directives for Implementation

```markdown
1. SINGLE TASK FOCUS: You MUST execute exactly ONE task per prompt turn. Do not look ahead,
   modify unrelated files, or execute subsequent tasks until the active task is verified.
2. VERIFICATION-FIRST PROTOCOL:
   - Step 1: Inspect target files and verify prerequisite dependencies.
   - Step 2: Implement minimal functional code adhering strictly to the task description.
   - Step 3: Run the exact verification command specified in the task block.
   - Step 4: If the verification fails, fix the code and rerun until passing.
   - Step 5: Mark the task checkbox `[x]` ONLY after the command exits with code 0.
3. SCOPE QUARANTINE: You MUST NOT touch any file not explicitly listed in the active task's description.
4. TDD DISCIPLINE: For test tasks, you MUST verify that the newly written test FAILS before
   proceeding to the implementation task.
```

---

## Phase N+1: Append-Only Convergence

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
  ============================================================================
-->

<!-- EXAMPLE OF APPENDED CONVERGENCE TASKS (Uncomment if gaps are discovered):
- [ ] T027 Remediate missing edge case per FR-004 (partial) in `src/services/[SERVICE_NAME].ts`
- [ ] T028 Fix constitutional boundary violation (contradicts) in `src/routes/[SCREEN_NAME].tsx`
-->

---
