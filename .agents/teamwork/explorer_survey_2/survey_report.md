# GitHub Spec Kit & Spec-Driven Development (SDD): Architectural Survey, Schema Standards, and Template Blueprint

**Document**: Definitive Survey & Schema Analysis Report  
**Investigator**: `explorer_survey_2`  
**Working Directory**: `c:\Users\DELL\gen ai\Assify\.agents\teamwork\explorer_survey_2\`  
**Milestone**: Milestone 2 — Spec Kit Survey & Schema Analysis  
**Repository & Toolkit**: [`github/spec-kit`](https://github.com/github/spec-kit) | [`specify-cli`](https://pypi.org/project/specify-cli/)  
**Date**: November 2026  

---

## Executive Summary

This survey provides a comprehensive technical investigation of **GitHub Spec Kit** (`github/spec-kit`, `specify-cli`) and the broader **Spec-Driven Development (SDD)** ecosystem. By analyzing official templates, commands, CLI implementations, and real-world enterprise adoptions (e.g., Thoughtworks, Martin Fowler, GitHub Next, community case studies), this report defines the exact schemas, structural conventions, markdown headings, directives, and traceability mechanics governing the 4 core SDD artifacts:

1. **Project Constitution (`.specify/memory/constitution.md`)**: The supreme legal governance document establishing non-negotiable architectural invariants, RFC 2119 directives, and quality gates.
2. **Feature Specification (`specs/<NNN-feature>/spec.md`)**: The technology-agnostic declaration of user journeys, functional requirements (`FR-###`), measurable success criteria (`SC-###`), and edge cases.
3. **Implementation Plan (`specs/<NNN-feature>/plan.md`)**: The concrete engineering blueprint translating product intent into technical architecture, validated by an explicit Constitution Check gate, and supported by Phase 0 research (`research.md`), data models (`data-model.md`), interface contracts (`contracts/`), and validation guides (`quickstart.md`).
4. **Granular Task Breakdown (`specs/<NNN-feature>/tasks.md`)**: The executable, dependency-ordered, test-driven task backlog organized by user stories (`[US#]`), parallel flags (`[P]`), and exact relative file paths.

Additionally, this survey analyzes supporting mechanisms including **Requirements Checklists as Unit Tests for English** (`checklists/`), **Cross-Artifact Analysis** (`/speckit-analyze`), **Append-Only Convergence** (`/speckit-converge`), and **Extension Hooks** (`extensions.yml`).

---

## Table of Contents

1. [Architectural Anatomy of GitHub Spec Kit](#1-architectural-anatomy-of-github-spec-kit)
2. [Deep Schema Analysis: The 4 Core Artifacts](#2-deep-schema-analysis-the-4-core-artifacts)
   - [2.1 Project Constitution (`constitution.md`)](#21-project-constitution-constitutionmd)
   - [2.2 Feature Specification (`spec.md`)](#22-feature-specification-specmd)
   - [2.3 Technical Implementation Plan (`plan.md`)](#23-technical-implementation-plan-planmd)
   - [2.4 Granular Task Breakdown (`tasks.md`)](#24-granular-task-breakdown-tasksmd)
3. [Supporting Artifacts & Quality Checklists](#3-supporting-artifacts--quality-checklists)
   - [3.1 Phase 0 & Phase 1 Artifacts (`research.md`, `data-model.md`, `contracts/`, `quickstart.md`)](#31-phase-0--phase-1-artifacts)
   - [3.2 Checklists as "Unit Tests for English" & Reviewer Ownership](#32-checklists-as-unit-tests-for-english--reviewer-ownership)
4. [Traceability & Cross-Artifact Dependency Flow](#4-traceability--cross-artifact-dependency-flow)
   - [4.1 Traceability Syntax & Mapping Matrix](#41-traceability-syntax--mapping-matrix)
   - [4.2 Pre-Implementation Verification (`/speckit-analyze`)](#42-pre-implementation-verification-speckit-analyze)
   - [4.3 Post-Implementation Convergence (`/speckit-converge`)](#43-post-implementation-convergence-speckit-converge)
5. [AI Coding Agent Directives & Prompt Engineering Conventions](#5-ai-coding-agent-directives--prompt-engineering-conventions)
6. [Industry Patterns, Anti-Patterns & Synthesis Comparison](#6-industry-patterns-anti-patterns--synthesis-comparison)
7. [Synthesis Blueprint for Downstream Template Designers](#7-synthesis-blueprint-for-downstream-template-designers)

---

## 1. Architectural Anatomy of GitHub Spec Kit

Spec Kit reorganizes AI-assisted software engineering from conversational prompting into deterministic, compiler-like generation anchored in version-controlled markdown contracts.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        1. DEVELOPER OR AI AGENT                        │
│    (GitHub Copilot Workspace, Claude Code, Cursor, Windsurf, Gemini)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ CLI Commands & Slash Commands
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   2. HOST CLI ENGINE (`specify-cli`)                    │
│    - Environment Diagnostics (`specify check`)                         │
│    - Scaffolding & Setup (`specify init`, `setup-plan`, `setup-tasks`) │
│    - Template Resolution (`resolve-template.ps1`, preset cascades)     │
│    - Extension Hook Pipeline (`specify extension`, `extensions.yml`)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Filesystem Contracts
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     3. REPOSITORY ARTIFACT STORAGE                     │
│                                                                        │
│   .specify/                          specs/<NNN-feature>/              │
│   ├── memory/constitution.md         ├── spec.md                       │
│   ├── feature.json                   ├── plan.md                       │
│   ├── init-options.json              ├── tasks.md                      │
│   ├── extensions.yml                 ├── research.md                   │
│   └── scripts/                       ├── data-model.md                 │
│       ├── resolve-template.ps1       ├── contracts/                    │
│       └── check-prerequisites.ps1    ├── quickstart.md                 │
│                                      └── checklists/requirements.md    │
└────────────────────────────────────────────────────────────────────────┘
```

### The Three Tiers of SDD Adoption (Fowler & Böckeler Taxonomy)
According to Martin Fowler and Thoughtworks Distinguished Engineer Birgitta Böckeler:
1. **Tier 1: Spec-First**: A structured specification is written before code prompting to align human and machine intent.
2. **Tier 2: Spec-Anchored**: The specification is maintained as a persistent, version-controlled repository artifact that survives context window resets and guides iterative maintenance.
3. **Tier 3: Spec-as-Source**: The specification acts as the single primary source of truth from which implementation code, tests, and documentation are deterministically compiled and audited.

---

## 2. Deep Schema Analysis: The 4 Core Artifacts

### 2.1 Project Constitution (`constitution.md`)

- **Standard Path**: `.specify/memory/constitution.md`
- **Command / Trigger**: `/speckit-constitution` (or `specify constitution`)
- **Authority**: Highest in repository. Non-negotiable. Supersedes all other documentation, conversation prompts, and agent heuristics.

#### A. Exact Structural Schema & Headings
```markdown
# [PROJECT_NAME] Constitution
<!-- Sync Impact Report: vX.Y.Z -> vA.B.C; [Description of changes] -->

**Version**: [CONSTITUTION_VERSION] | **Ratified**: [RATIFICATION_DATE] | **Last Amended**: [LAST_AMENDED_DATE]

## Core Principles

### [PRINCIPLE_1_NAME]
<!-- Example: I. Architectural Boundaries -->
[PRINCIPLE_1_DESCRIPTION]
<!-- Non-negotiable normative rules using RFC 2119 keywords (MUST / MUST NOT) and explicit rationale -->

### [PRINCIPLE_2_NAME]
<!-- Example: II. Component-First Law -->
[PRINCIPLE_2_DESCRIPTION]

### [PRINCIPLE_3_NAME]
<!-- Example: III. Test-Driven Development (NON-NEGOTIABLE) -->
[PRINCIPLE_3_DESCRIPTION]

### [PRINCIPLE_4_NAME]
<!-- Example: IV. Anti-Slop Enforcement -->
[PRINCIPLE_4_DESCRIPTION]

### [PRINCIPLE_5_NAME]
<!-- Example: V. Security & Observability -->
[PRINCIPLE_5_DESCRIPTION]

## [SECTION_2_NAME]
<!-- Example: Architectural Invariants & Stack Constraints -->
[SECTION_2_CONTENT]

## [SECTION_3_NAME]
<!-- Example: Quality Gates & Review Workflow -->
[SECTION_3_CONTENT]

## Governance
<!-- Example: Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->
[GOVERNANCE_RULES]
```

#### B. Field & Section Directives
1. **Sync Impact Report (HTML Comment)**:
   - Positioned at the very top of the file as an HTML comment (`<!-- Sync Impact Report: ... -->`).
   - Acts as temporary scratch material during amendments for human reviewers.
   - Outlines: Version change (`old -> new`), list of modified principles, added sections, removed sections, and follow-up deferred TODOs.
2. **Metadata Line**:
   - `**Version**: X.Y.Z | **Ratified**: YYYY-MM-DD | **Last Amended**: YYYY-MM-DD`
   - Strict Semantic Versioning:
     - **MAJOR**: Backward-incompatible governance changes, removal/redefinition of core principles.
     - **MINOR**: Addition of new principles, tech stack expansions, or tightened quality gates.
     - **PATCH**: Wording improvements, clarifications, typo fixes.
3. **Core Principles**:
   - Must use declarative, testable language using RFC 2119 terms (`MUST`, `MUST NOT`, `REQUIRED`, `SHALL`, `SHOULD`, `SHOULD NOT`, `RECOMMENDED`, `MAY`). Vague terms ("should consider", "as appropriate") are strictly forbidden.
   - Every principle must explicitly provide a **Rationale** explaining why the constraint exists.
4. **Governance Section**:
   - Explicit supremacy clause stating that the Constitution binds all agents, developers, and tools.
   - Amendment procedure: Requires explicit peer/Staff+ review and migration plan.
   - Automated compliance gate: Evaluated automatically by `/speckit-plan` (Phase 0 gate) and `/speckit-analyze`. Violations raise `CRITICAL` blockers.

---

### 2.2 Feature Specification (`spec.md`)

- **Standard Path**: `specs/<NNN-feature-name>/spec.md` (e.g. `specs/001-user-auth/spec.md`)
- **Command / Trigger**: `/speckit-specify <description>` (followed by `/speckit-clarify`)
- **Core Principle**: **WHAT & WHY ONLY**. Strictly zero implementation details (no frameworks, languages, database queries, internal component structures, or API payloads).

#### A. Exact Structural Schema & Headings
```markdown
# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`
**Created**: [DATE]
**Status**: Draft | Under Review | Approved | Implemented
**Input**: User description: "$ARGUMENTS"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - [Brief Title] (Priority: P1)
[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently to form a viable MVP]

**Acceptance Scenarios**:
1. **Given** [initial state], **When** [action], **Then** [expected outcome]
2. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 2 - [Brief Title] (Priority: P2)
[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:
1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### Edge Cases
- What happens when [boundary condition]?
- How does system handle [error/offline scenario]?

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST [specific capability]
- **FR-002**: System MUST [specific capability]
- **FR-003**: Users MUST be able to [key interaction]
- **FR-004**: System MUST [data persistence requirement]
- **FR-005**: System MUST [security/behavior requirement]

### Key Entities *(include if feature involves data)*
- **[Entity 1]**: [What it represents, key attributes without implementation leakage]
- **[Entity 2]**: [What it represents, relationships to other entities]

## Success Criteria *(mandatory)*

### Measurable Outcomes
- **SC-001**: [Measurable metric, e.g. "Users can complete onboarding in under 60 seconds"]
- **SC-002**: [Measurable metric, e.g. "System handles 5,000 concurrent updates without error"]
- **SC-003**: [Quality metric, e.g. "95% of first-time actions succeed without validation failure"]
- **SC-004**: [Business/outcome metric, e.g. "Zero transaction drops under network loss"]

## Assumptions
- [Assumption about target users / environment]
- [Assumption about scope boundaries - what is intentionally excluded from v1]
- [Assumption about existing systems / dependencies]
```

#### B. Field & Section Directives
1. **User Scenarios & Independent Slicing**:
   - Stories must be ordered by priority (`P1`, `P2`, `P3`...).
   - **`User Story 1 (P1)` is the designated MVP slice**. Implementing only US1 must produce a functional, demonstratable product increment.
   - Each story requires an **Independent Test** definition.
   - Acceptance scenarios must use strict BDD Gherkin phrasing: `Given [context], When [action], Then [outcome]`.
2. **Functional Requirements (`FR-###`)**:
   - Each requirement is assigned a stable, zero-padded identifier (`FR-001`, `FR-002`).
   - Phrased with RFC 2119 imperatives (`MUST`, `MUST NOT`).
3. **Ambiguity Guard & Clarification Limits**:
   - AI authors are bounded to a **maximum of 3 `[NEEDS CLARIFICATION]` tags** across the entire specification.
   - Clarifications are restricted to high-impact ambiguities (scope boundaries, security/legal compliance, critical UX fork).
   - For all other questions, the agent must make informed industry-standard defaults and record them in the `## Assumptions` section.
4. **Success Criteria (`SC-###`)**:
   - Must be strictly measurable and technology-agnostic.
   - Prohibited: "API response under 200ms" (tech leak; use "Users see immediate visual feedback in under 200ms"), "PostgreSQL query optimized", "Redux state managed cleanly".

---

### 2.3 Technical Implementation Plan (`plan.md`)

- **Standard Path**: `specs/<NNN-feature-name>/plan.md`
- **Command / Trigger**: `/speckit-plan`
- **Core Principle**: **HOW**. Translates the technology-agnostic `spec.md` into concrete software architecture, directory structures, and library choices.

#### A. Exact Structural Schema & Headings
```markdown
# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link to spec.md]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

## Summary
[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context
**Language/Version**: [e.g., TypeScript 5.4 / React Native 0.74 or NEEDS CLARIFICATION]
**Primary Dependencies**: [e.g., Expo SDK 51, Tamagui, Zustand, TanStack Query]
**Storage**: [e.g., SQLite via Expo SQLite, MMKV, WatermelonDB, or N/A]
**Testing**: [e.g., Jest, React Native Testing Library, Maestro E2E]
**Target Platform**: [e.g., iOS 16+, Android API 33+, Web]
**Project Type**: [e.g., mobile-app, web-service, library, CLI]
**Performance Goals**: [e.g., 60 FPS animations, <100ms interaction latency, cold start <1.5s]
**Constraints**: [e.g., offline-first, <30MB binary size, zero native-slop tells]
**Scale/Scope**: [e.g., 20 screens, 5 core domain entities, 100k daily active offline records]

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Article I (Architectural Boundaries): Explicit verification evidence mapping to design
- [x] Article II (Component-First Law): Explicit verification evidence
- [x] Article III (Test-Driven Integrity): Explicit verification evidence
- [x] Article IV (Anti-Slop Enforcement): Explicit verification evidence
- [x] Article V (Security & Privacy): Explicit verification evidence

## Project Structure

### Documentation (this feature)
```text
specs/[###-feature]/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (generated by /speckit-tasks)
```

### Source Code (repository root)
```text
[Concrete filesystem tree showing exact directories where code will be created or modified]
```

**Structure Decision**: [Document the selected architectural pattern and directory structure]

## Complexity Tracking
> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., New state manager] | [Specific requirement] | [Why standard Zustand was insufficient] |
```

#### B. Field & Section Directives
1. **Advisory Technical Context Grid**:
   - Replaces conversational guessing with a fixed technical parameter table.
   - Any unresolved variable is flagged with `NEEDS CLARIFICATION` and dispatched to Phase 0 research.
2. **Constitution Check Gate**:
   - A mandatory programmatic gate evaluated twice: once before Phase 0 research begins, and again after Phase 1 design completes.
   - Every Article in `constitution.md` must be enumerated with an explicit checkbox and evidence citation.
   - If any rule is violated without justification in the Complexity Tracking table, the planning phase halts with an error.
3. **Phased Design Outputs**:
   - **Phase 0 Research (`research.md`)**: Resolves all unknowns using a structured format: `Decision`, `Rationale`, `Alternatives Considered`.
   - **Phase 1 Domain Design (`data-model.md`)**: Defines entities, field constraints, nullability, enums, relationships, and state machine transitions.
   - **Phase 1 Interface Contracts (`contracts/`)**: OpenAPI specifications, TypeScript prop definitions, schemas, or RPC signatures.
   - **Phase 1 Validation Runbook (`quickstart.md`)**: Runnable instructions to test the feature end-to-end.
4. **Concrete Source Code Tree**:
   - Generic placeholders (`[REMOVE IF UNUSED]`) must be stripped in delivered plans, leaving only the real target project structure.

---

### 2.4 Granular Task Breakdown (`tasks.md`)

- **Standard Path**: `specs/<NNN-feature-name>/tasks.md`
- **Command / Trigger**: `/speckit-tasks` (consumed by `/speckit-implement`)
- **Core Principle**: **DO**. An actionable, dependency-ordered, micro-scoped backlog where every item is individually executable by an AI coding agent without conversational guesswork.

#### A. Exact Structural Schema & Headings
```markdown
---
description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/
**Tests**: [Mandatory per Constitution / Optional / TDD Workflow]
**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
[Explicit relative path conventions for project, e.g., mobile/src/..., backend/src/...]

## Phase 1: Setup (Shared Infrastructure)
**Purpose**: Project initialization and basic structure
- [ ] T001 Initialize directory layout in path/to/dir/
- [ ] T002 [P] Install dependencies in package.json
- [ ] T003 [P] Configure tooling and linting rules in config/

---

## Phase 2: Foundational (Blocking Prerequisites)
**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented
**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Create database schema migrations in path/to/migrations/
- [ ] T005 [P] Implement core storage service interface in path/to/storage.ts
- [ ] T006 [P] Implement base domain models in path/to/models.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP
**Goal**: [Brief description of what this story delivers]
**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1
> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**
- [ ] T007 [P] [US1] Unit test for entity calculation in path/to/entity.test.ts
- [ ] T008 [P] [US1] Contract test for service interface in path/to/contract.test.ts

### Implementation for User Story 1
- [ ] T009 [P] [US1] Create DomainEntity model with validation in path/to/model.ts
- [ ] T010 [US1] Implement DomainService business logic in path/to/service.ts (depends on T009)
- [ ] T011 [US1] Build UI Component in path/to/component.tsx
- [ ] T012 [US1] Wire component into screen route in path/to/screen.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)
**Goal**: [Brief description of what this story delivers]
**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2
- [ ] T013 [P] [US2] Contract test for sync service in path/to/sync.test.ts

### Implementation for User Story 2
- [ ] T014 [P] [US2] Create SyncEntity model in path/to/sync_model.ts
- [ ] T015 [US2] Implement SyncService background worker in path/to/sync_service.ts
- [ ] T016 [US2] Integrate sync status indicator in path/to/component.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase N: Polish & Cross-Cutting Concerns
**Purpose**: Improvements that affect multiple user stories

- [ ] T017 [P] Add typed telemetry logging across all story entry points in path/to/telemetry.ts
- [ ] T018 Run full test suite and verify end-to-end flow per quickstart.md
- [ ] T019 Update developer documentation in docs/

---

## Dependencies & Execution Order
### Phase Dependencies
- **Setup (Phase 1)**: No dependencies - starts immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion.
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies
- **User Story 1 (P1)**: Can start after Phase 2 - zero dependencies on other stories.
- **User Story 2 (P2)**: Can start after Phase 2 - independently testable.

### Within Each User Story
- Tests written and verified failing before implementation.
- Models before services.
- Services before UI / endpoints.
- Story complete and verified before moving to next story.

### Parallel Opportunities
- All tasks marked `[P]` can run concurrently without file write collisions.

---

## Parallel Example: User Story 1
```bash
# Launch parallel model generation:
Task: "Create DomainEntity model in path/to/model.ts"
Task: "Create SecondaryEntity model in path/to/secondary.ts"
```

---

## Implementation Strategy
### MVP First (User Story 1 Only)
1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1
4. STOP and VALIDATE: Verify independent MVP functionality.

### Incremental Delivery
Stories deliver additive value without regressing previous checkpoints.
```

#### B. Strict Task Grammar & Rules
Every task must adhere to the formal grammar:
```text
- [ ] [TaskID] [P?] [Story?] Detailed action description with exact/file/path
```
1. `- [ ]`: Standard markdown checkbox. Toggled to `- [x]` only upon verified completion.
2. `TaskID`: Sequential, zero-padded identifier (`T001`, `T002`, `T003`...). IDs must never be renumbered or reused.
3. `[P]`: Parallel flag. Indicates the task operates on an isolated file and has no unresolved prerequisite dependencies in the same phase.
4. `[Story]`: User story tag (`[US1]`, `[US2]`). **Mandatory in User Story phases; forbidden in Setup, Foundational, and Polish phases**.
5. `Description & File Path`: Exact, unambiguous file path must be explicitly included in every single task description. Vague tasks like `- [ ] Implement user model` are syntax violations.

---

## 3. Supporting Artifacts & Quality Checklists

### 3.1 Phase 0 & Phase 1 Artifacts

```
                      PLANNING PHASE DELIVERABLES
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
   research.md               data-model.md              contracts/
(Phase 0 Research)        (Phase 1 Entities)       (Phase 1 Interfaces)
 - Decision                - Entity Name            - OpenAPI / Schemas
 - Rationale               - Fields & Types         - TypeScript Types
 - Alternatives            - State Transitions      - Component Props
                                   │
                                   ▼
                             quickstart.md
                        (Validation Runbook)
                         - Setup Commands
                         - Execution Steps
                         - Expected State
```

1. **`research.md` (Phase 0 Output)**:
   - Eliminates speculative coding by investigating architectural choices before drafting design specs.
   - Each entry follows a strict triplet: **Decision**, **Rationale**, and **Alternatives Considered**.
2. **`data-model.md` (Phase 1 Output)**:
   - Captures entity schemas, relationships (1:1, 1:N, N:M), nullability, field length constraints, validation rules, and state machine transitions.
   - Hardens domain rules so implementation agents do not hallucinate schema variations.
3. **Interface Contracts (`contracts/`)**:
   - Holds machine-readable interfaces: OpenAPI (`.yaml`), Protocol Buffers (`.proto`), TypeScript contract definitions, or UI component prop interfaces.
4. **`quickstart.md` (Phase 1 Output)**:
   - An executable validation runbook providing step-by-step shell commands, test invocations, and expected outputs to independently verify feature completion.

---

### 3.2 Checklists as "Unit Tests for English" & Reviewer Ownership

One of the most vital architectural breakthroughs in GitHub Spec Kit is treating **Checklists as Unit Tests for Specifications**:

> **Checklists test the QUALITY of the requirements, NOT the behavior of the implemented code.**

```
┌────────────────────────────────────────────────────────────────────────┐
│                   SPECIFICATION QUALITY GOVERNANCE                     │
├──────────────────────────────────┬─────────────────────────────────────┤
│ 1. Machine-Evaluated Checklists  │ 2. Reviewer-Owned Domain Checklists │
│    (`checklists/requirements.md`)│    (`checklists/security.md`, etc.) │
├──────────────────────────────────┼─────────────────────────────────────┤
│ - Evaluated by AI agent/linter   │ - Owned EXCLUSIVELY by humans       │
│ - Tests syntax, tech-neutrality, │ - Tests domain depth, compliance,   │
│   measurability, FR/SC formatting│   security invariants, UX edge cases│
│ - Automatically toggled by agent │ - AI agent is STRICTLY FORBIDDEN    │
│   during specify/clarify passes  │   from checking these boxes         │
│ - Validates spec structure       │ - Serves as human approval GATE     │
└──────────────────────────────────┴─────────────────────────────────────┘
```

#### The Reviewer Ownership Contract
In `checklists/requirements.md` and domain checklists:
- **`[ ]` (Unchecked)**: Indicates requirement is unverified, ambiguous, or lacks human sign-off.
- **`[x]` (Checked)**: Signifies that a human reviewer has audited the specification text and confirmed that the requirement is complete, unambiguous, and compliant. **It does NOT mean the code is written!**
- **The Implementation Gate**: When `/speckit-implement` executes, it scans all `checklists/*.md`. If any custom checklist contains unchecked boxes (`- [ ]`), the agent halts and demands explicit human override before proceeding.

---

## 4. Traceability & Cross-Artifact Dependency Flow

### 4.1 Traceability Syntax & Mapping Matrix

Spec Kit enforces a deterministic, bidirectional audit chain connecting user needs to code commits:

$$\text{User Story [US#]} \longleftrightarrow \text{Requirements [FR-###]} \longleftrightarrow \text{Success Criteria [SC-###]} \longleftrightarrow \text{Tasks [T###] [US#]} \longleftrightarrow \text{Source Files}$$

| Artifact | Source Element | Target in Next Artifact | Syntax Example |
| :--- | :--- | :--- | :--- |
| **`spec.md`** | User Story | `tasks.md` Phase Header & Tasks | `### User Story 1 (P1)` $\rightarrow$ `## Phase 3: User Story 1` & `[US1]` |
| **`spec.md`** | Functional Requirement | `plan.md` & `tasks.md` Descriptions | `FR-001: System MUST persist...` $\rightarrow$ `T009 [US1] Implement storage in src/...` |
| **`spec.md`** | Success Criteria | `plan.md` & `tasks.md` Polish Phase | `SC-001: P95 < 100ms` $\rightarrow$ `T018 Performance optimization in src/...` |
| **`plan.md`** | Data Model Entity | `tasks.md` Model Tasks | `data-model.md: UserProfile` $\rightarrow$ `T006 [P] Create UserProfile in src/models/` |
| **`plan.md`** | Interface Contract | `tasks.md` Contract Tests | `contracts/api.yaml` $\rightarrow$ `T007 [P] [US1] Contract test in tests/` |
| **`constitution.md`** | Core Principles | `plan.md` Constitution Check Gate | `Article I` $\rightarrow$ `- [x] Article I: Contract defined in contracts/` |

---

### 4.2 Pre-Implementation Verification (`/speckit-analyze`)

The `/speckit-analyze` command performs a **strictly read-only cross-artifact audit** across `spec.md`, `plan.md`, and `tasks.md` prior to code implementation.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        /speckit-analyze AUDIT                          │
├───────────────────────┬────────────────────────────────────────────────┤
│ Audit Dimension       │ Failure Condition Flagged                      │
├───────────────────────┼────────────────────────────────────────────────┤
│ **Duplication**       │ Overlapping or redundant FR statements         │
│ **Ambiguity**         │ Unquantified adjectives ("fast", "intuitive")   │
│ **Underspecification**│ Requirements without testable outcomes        │
│ **Coverage Gaps**     │ FR-### or SC-### with 0 mapped tasks in tasks.md│
│ **Orphan Tasks**      │ Tasks referencing files/components not in plan │
│ **Constitution Gate** │ Any plan or task violating a constitutional MUST│
│ **Ordering Anomaly**  │ Story implementation scheduled before foundation│
└───────────────────────┴────────────────────────────────────────────────┘
```
Findings are reported with graded severities (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`). Any `CRITICAL` finding (such as a constitutional violation or an unmapped P1 requirement) halts implementation until rectified.

---

### 4.3 Post-Implementation Convergence (`/speckit-converge`)

Following execution by `/speckit-implement`, the `/speckit-converge` command audits the actual codebase against the intent defined in `spec.md`, `plan.md`, `tasks.md`, and `constitution.md`.

#### The Append-Only Convergence Contract
- **NEVER REWRITE**: The command is strictly forbidden from modifying existing tasks, rewriting the spec, or changing prior history.
- **Append Contract**: If gaps are detected between code reality and spec intent, it appends a single new section to the bottom of `tasks.md`:
  ```markdown
  ## Phase N: Convergence
  - [ ] T042 Implement missing error boundary per FR-003 (missing) in mobile/src/components/ErrorBoundary.tsx
  - [ ] T043 Remediate direct DB call violating Constitution Article I (contradicts) in backend/src/api/user.ts
  ```
- **Convergence Gap Classification**:
  1. `missing`: Obligation is completely absent from the code.
  2. `partial`: Feature exists but fails an acceptance criterion or edge case.
  3. `contradicts`: Code directly violates specification intent or a constitutional principle.
  4. `unrequested`: Code introduces unprompted scope or unapproved libraries (flagged for review or removal).
- **Clean Result**: If all criteria are met, `tasks.md` remains byte-for-byte unchanged, and the command reports: `✅ Converged — the implementation satisfies the spec, plan, and tasks.`

---

## 5. AI Coding Agent Directives & Prompt Engineering Conventions

Spec Kit is designed to be agent-agnostic, supporting GitHub Copilot, Claude Code, Cursor, Windsurf, Gemini, and Antigravity. To prevent hallucination and attention decay, it relies on specific prompt engineering conventions:

### 1. The "What vs. How" Firewall
- When executing `/speckit-specify`, agents are instructed: *"Focus on WHAT users need and WHY. Avoid HOW to implement (no tech stack, APIs, database tables, or framework names)."*
- When executing `/speckit-plan`, agents are instructed: *"Translate the technology-agnostic spec into concrete technical architecture and evaluate the Constitution Gate."*
- When executing `/speckit-implement`, agents are restricted to the active task in `tasks.md` and prohibited from modifying spec documents.

### 2. Progressive Disclosure & Context Window Engineering
Rather than dumping thousands of lines of documentation into the agent's context window simultaneously:
1. **Spec Phase**: Loads only `constitution.md` and user arguments.
2. **Plan Phase**: Loads `constitution.md` and `spec.md`.
3. **Tasks Phase**: Loads `spec.md`, `plan.md`, `data-model.md`, and `contracts/`.
4. **Implement Phase**: Loads **one task at a time** along with its immediate target source file and contract definition.

### 3. Extension Hooks (`extensions.yml`)
Spec Kit supports lifecycle event interception via `.specify/extensions.yml`:
- `before_specify` / `after_specify` (e.g. automated git branch creation)
- `before_plan` / `after_plan`
- `before_tasks` / `after_tasks`
- `before_implement` / `after_implement` (e.g. automated git commit, lint checks)
- `before_converge` / `after_converge`
Hooks can be **Automatic** (`optional: false`, agent must execute and wait) or **Optional** (`optional: true`, agent prompts user).

---

## 6. Industry Patterns, Anti-Patterns & Synthesis Comparison

| Engineering Dimension | Vibe Coding Anti-Pattern ❌ | Standard Agile PRD ⚠️ | GitHub Spec Kit SDD Standard ✅ |
| :--- | :--- | :--- | :--- |
| **Source of Truth** | Ephemeral chat context window | Confluence / Jira ticket (drifts) | Version-controlled Git markdown contracts |
| **Separation of Concerns** | Prompts mix UI, DB, and logic | Business requirements mixed with tech | Rigid separation: Constitution $\rightarrow$ Spec $\rightarrow$ Plan $\rightarrow$ Tasks |
| **Architectural Invariants** | Hallucinated on statistical probability | Static corporate wiki, unverified | Programmatic Constitution Check gate |
| **Task Granularity** | "Build the entire auth feature" | High-level user stories | Single-file, dependency-ordered tasks with exact paths |
| **Verification & Quality** | Ad-hoc manual terminal debugging | Post-implementation manual QA | Checklists as Unit Tests for English + Automated Convergence |
| **Context Management** | Context rot & attention degradation | Monolithic documents | Progressive disclosure & single-task micro-contexts |
| **Drift Mitigation** | Code diverges silently from intent | Docs abandoned after Sprint 1 | `/speckit-converge` appends remediation tasks to backlog |

### Critical Anti-Patterns to Prevent in Template Authoring
1. **Specification Theater**: Generating excessive markdown boilerplate that is neither read by humans nor enforced by agents. Templates must be punchy, high-signal, and strictly actionable.
2. **Waterfall-AI Paralysis**: Drafting massive multi-week monolithic specs before writing code. Templates must mandate **P1 / MVP slicing** so User Story 1 can be delivered immediately.
3. **Implementation Leakage in Specs**: Mentioning SQLite tables, React Hooks, or REST verbs inside `spec.md`. This prevents architectural flexibility and misleads business reviewers.
4. **Unbounded Clarification Loops**: Asking developers 20 trivial questions before drafting. Templates must limit clarifications to **maximum 3 high-impact markers** and enforce standard industry defaults for the rest.
5. **Reviewer Checkbox Hallucination**: AI agents marking domain checklists as complete. Templates must explicitly declare reviewer ownership: human checkmarks represent quality review, not code completion.

---

## 7. Synthesis Blueprint for Downstream Template Designers

To guide the upcoming authoring of generic templates (`docs/templates/sdd/generic/`) and project-tailored reference examples (`docs/templates/sdd/examples/`), the downstream designer agents must enforce the following rules:

### A. Generic Templates (`docs/templates/sdd/generic/`)
- Must contain verbatim official section headers and markdown hierarchy.
- Must include detailed instructional comments (`<!-- ACTION REQUIRED: ... -->`) explaining section intent, formatting rules, and AI guardrails.
- Must provide clean, unpolluted placeholders using `[UPPERCASE_IDENTIFIERS]`.
- Must incorporate explicit prompt engineering directives informing coding agents how to parse and populate each section.

### B. Project Reference Templates (`docs/templates/sdd/examples/`)
- Must be fully articulated, concrete reference documents tailored specifically to this project's architecture:
  - **Stack**: React Native 0.74+ / Expo SDK 51, TypeScript, Zustand, Tamagui, TanStack Query, Expo SQLite / MMKV.
  - **Constitution Example**: Enforces the **Component-First Law** (zero screen-level container drift, primitives in `mobile/src/components/ui/`), **Anti-Slop Enforcement** (`native-slop.md` 20 tells: no card-nesting, no floating tab collisions, no wireframe borders), **Test-First Integrity** (100% domain coverage, failing tests committed before implementation), and **Strict Architectural Boundaries**.
  - **Spec Example**: A realistic feature specification (e.g., Offline Assignment Submission & Sync) complete with P1 MVP user story, Gherkin acceptance scenarios, testable `FR-###` requirements, and measurable `SC-###` outcomes.
  - **Plan Example**: Fully articulated implementation plan including concrete React Native directory trees, Constitution Check verification, and references to supporting contracts (`contracts/api.yaml`) and data models (`data-model.md`).
  - **Tasks Example**: Concrete task ledger adhering strictly to `- [ ] [TaskID] [P?] [Story?] Description with exact/file/path`, demonstrating Phase 1 Setup, Phase 2 Foundational Gate, Phase 3 US1 MVP, Phase 4 US2 Sync, Phase Final Polish, and Phase Convergence.

---
*Report compiled and verified by explorer_survey_2.*
