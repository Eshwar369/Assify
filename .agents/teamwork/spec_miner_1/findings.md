# GitHub Spec Kit (`github/spec-kit`, `specify-cli`) & Spec-Driven Development (SDD) Technical Research Report

**Researcher**: teamwork_spec_miner_1  
**Working Directory**: `c:\Users\DELL\gen ai\Assify\.agents\teamwork\spec_miner_1/`  
**Date**: November 2026 (Verified Against Official 2025–2026 GitHub Releases & Documentation)  
**Primary Sources**:  
- GitHub Official Repository: [`github/spec-kit`](https://github.com/github/spec-kit) & PyPI [`specify-cli`](https://pypi.org/project/specify-cli/)
- GitHub Official Blog: *"Spec-driven development with AI: Get started with a new open source toolkit"* by Den Delimarsky (Sept 2, 2025)
- GitHub Official Blog: *"Spec-driven development: Using Markdown as a programming language when building with AI"* by Tomas Vesely (Sept 30, 2025)
- Local Spec Kit Skills & Schemas: `.agents/skills/speckit-*` (`specify`, `plan`, `tasks`, `clarify`, `constitution`, `implement`, `converge`, `analyze`, `checklist`)

---

## 1. Executive Summary & Repository Architecture

### 1.1 Overview & Origins
**GitHub Spec Kit** (`github/spec-kit`, distributed via PyPI as `specify-cli`) is an open-source framework developed by GitHub (originated within GitHub Next and spearheaded by Principal Product Engineers Den Delimarsky and Tomas Vesely) to establish **Spec-Driven Development (SDD)** as the industry-standard software engineering paradigm for autonomous and semi-autonomous AI coding agents.

Spec Kit addresses the systemic failures of unstructured AI programming ("vibe coding"), including:
- Context rot and attention degradation over multi-turn conversations
- LLM hallucinations caused by ambiguous or missing specifications
- Architecture erosion caused by LLMs choosing expedient, fragmented patches rather than holistic system designs
- Lack of verifiable completion criteria and quality gates

### 1.2 Architecture Overview
Spec Kit is architected into three symbiotic layers:

```
┌─────────────────────────────────────────────────────────────────┐
│                    User & AI Agent Interface                    │
│   (Copilot Chat, Claude Code, Gemini CLI, Cursor, Windsurf)     │
└─────────────────────────────────┬───────────────────────────────┘
                                  │ Slash Commands & Agent Skills
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Specify CLI (`specify-cli`)                   │
│  - Environment Validation (`specify check`)                     │
│  - Workspace Scaffolding (`specify init`)                       │
│  - Preset & Extension Layering (`specify preset`, `extension`)  │
│  - Workflow Automation (`specify workflow`, `bundle`)           │
│  - Local MCP Server (`specify mcp`)                             │
└─────────────────────────────────┬───────────────────────────────┘
                                  │ Filesystem & Execution Contracts
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│              Project Workspace (`.specify/` & `specs/`)         │
│  - Governance Memory (`.specify/memory/constitution.md`)        │
│  - Active Feature Tracking (`.specify/feature.json`)            │
│  - Configuration (`.specify/init-options.json`, `extensions.yml`)│
│  - Resolved Templates & Script Hooks (`.specify/scripts/`)      │
│  - Feature Artifacts (`specs/NNN-feature/{spec,plan,tasks}.md`) │
└─────────────────────────────────────────────────────────────────┘
```

1. **The CLI Layer (`specify-cli`)**: A lightweight Python utility installed via `uv tool install specify-cli` or `pipx install specify-cli`. It handles project bootstrapping, diagnostics, preset management, extension package installation, template resolution, and optional Model Context Protocol (MCP) server hosting.
2. **The Workspace & Governance Layer (`.specify/`)**: A repository-level metadata directory storing non-negotiable project governance (`constitution.md`), feature pointer state (`feature.json`), initialization settings (`init-options.json`), and lifecycle hooks (`extensions.yml`).
3. **The Feature Artifact Layer (`specs/<NNN-feature>/`)**: An isolated, version-controlled feature bundle containing the executable specification lifecycle artifacts: `spec.md`, `plan.md`, `tasks.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`, and `checklists/`.

---

## 2. Core Concepts, Files, and Artifact Specifications

Spec Kit organizes feature development around structured Markdown contracts. Markdown is treated not as passive documentation, but as a high-level, human-readable, AI-executable programming language.

### 2.1 Project Constitution (`.specify/memory/constitution.md`)
The Constitution is the highest governing authority in a Spec Kit project. It defines immutable architectural rules, security boundaries, coding standards, and quality gates.

- **Authority**: Non-negotiable. When downstream commands (`plan`, `analyze`, `converge`) encounter a conflict between a proposed feature and a constitution `MUST` principle, the command raises a `CRITICAL` error. The feature design must adapt to the constitution, never the reverse.
- **Scaffold & Placeholders**: Generated from `constitution-template.md` via `resolve-template.ps1 constitution-template -Json`. Placeholders take the form `[ALL_CAPS_IDENTIFIER]`.
- **Versioning Policy**: Follows strict Semantic Versioning:
  - **MAJOR**: Backward-incompatible governance removals or principle redefinitions.
  - **MINOR**: Addition of new principles or materially expanded mandatory guidance.
  - **PATCH**: Clarifications, wording adjustments, or typo fixes.
- **Sync Impact Report**: Every amendment generates an HTML comment report at the top of the file documenting version transition (`v1.0.0 -> v1.1.0`), modified principles, added/removed sections, and deferred follow-ups.

#### Canonical Constitution Structure
```markdown
# Project Constitution: [Project Name]
<!-- Sync Impact Report: v1.0.0 -> v1.1.0; Added Article IV (Event Sourcing) -->
**Version**: 1.1.0 | **Ratified**: 2026-01-15 | **Last Amended**: 2026-11-03

## Core Principles

### Article I: Architectural Integrity
- System components MUST be decoupled via explicit interface contracts.
- Direct database access across domain service boundaries is STRICTLY PROHIBITED.

### Article II: Test-First Mandate
- Core domain logic MUST achieve 100% test coverage before merge.
- End-to-end user scenarios MUST be represented in automated integration suites.

### Article III: Observability & Security
- All external API endpoints MUST emit structured JSON logs with correlation IDs.
- Secrets MUST NOT be stored in repository files or configuration templates.

## Governance
- Amendments require pull request approval from at least two senior maintainers.
- Automated compliance is verified via `/speckit-analyze` prior to task implementation.
```

---

### 2.2 Feature Specification (`specs/<feature-dir>/spec.md`)
The specification captures **WHAT** the user needs and **WHY**, strictly omitting **HOW** (no implementation details, frameworks, languages, or internal data structures).

- **Directory Resolution**: Resolved under `specs/<prefix>-<short-name>`:
  - Sequential numbering: `specs/001-user-auth` (derived from `.specify/init-options.json` `"feature_numbering": "sequential"`).
  - Timestamp numbering: `specs/20261103-204500-user-auth`.
  - Persisted in `.specify/feature.json`: `{"feature_directory": "specs/001-user-auth"}` so downstream commands do not rely on git branch parsing.
- **Clarification Bound**: Specifications are strictly limited to **maximum 3 `[NEEDS CLARIFICATION]` markers**. AI generators must make informed guesses based on industry standards rather than halting for trivial details.
- **Quality Checklist**: Automatically validated against `specs/<feature-dir>/checklists/requirements.md`.

#### Canonical `spec.md` Structure
```markdown
# Feature Specification: [Feature Name]

## Overview & Context
[High-level user-facing summary: problem statement and target audience]

## User Scenarios & Testing
### Scenario 1: Successful Primary Flow (Priority: P1)
- **Given** [pre-condition]
- **When** [user action]
- **Then** [expected observable outcome]

### Scenario 2: Error / Edge Case (Priority: P2)
- **Given** [unusual state]
- **When** [user action]
- **Then** [graceful degradation or clear error response]

## Functional Requirements
- **FR-001**: User can initiate password reset using an email address.
- **FR-002**: System MUST send a single-use token valid for exactly 15 minutes.
- **FR-003**: System MUST invalidate all active sessions upon successful password update.

## Success Criteria (Measurable & Technology-Agnostic)
- **SC-001**: 95% of users complete the password reset flow in under 2 minutes.
- **SC-002**: Zero credential recovery tokens exposed via application logs or URL queries.
- **SC-003**: System sustains 500 concurrent reset requests without rate-limit exhaustion.

## Assumptions & Dependencies
- Standard SMTP relay service is accessible.
- User accounts have verified primary email addresses.
```

---

### 2.3 Technical Plan (`specs/<feature-dir>/plan.md`)
The implementation plan translates the specification into a concrete technical architecture and engineering strategy.

- **Prerequisites**: Executed via `/speckit-plan` after reading `spec.md` and `.specify/memory/constitution.md`.
- **Phased Decomposition**:
  - **Phase 0: Research & Architecture Decisions**: Resolves all technical unknowns and outputs `research.md`.
  - **Phase 1: Design & Contracts**: Defines data entities (`data-model.md`), external interfaces (`contracts/`), and execution validation steps (`quickstart.md`).
- **Constitution Check Gate**: A formal evaluation verifying that architectural decisions comply with every Article in `constitution.md`. Violations immediately halt execution.

#### Canonical `plan.md` Structure
```markdown
# Implementation Plan: [Feature Name]

## Technical Context
- **Language / Runtime**: Go 1.23 / Node 22 / Python 3.12
- **Primary Dependencies**: Gin Web Framework, GORM, PostgreSQL 16
- **Storage**: Relational database with connection pooling
- **Testing Strategy**: Table-driven unit tests, Testcontainers for integration

## Constitution Check
- [x] Article I (Decoupled Components): Separate auth handler, service, and repository.
- [x] Article II (Test-First): Contract test suites planned before endpoints.
- [x] Article III (Observability): Structured zap logger injected into all context calls.

## Phase 0: Research & Unknowns
- Resolved in `research.md`: Evaluated bcrypt vs argon2id for token hashing; selected argon2id for higher GPU resistance.

## Phase 1: Design & Contracts
- **Data Model**: Outlined in `data-model.md` (`User`, `ResetToken`, `AuditLog`).
- **Interface Contracts**: Defined in `contracts/auth-api.yaml`.
- **Validation Guide**: Documented in `quickstart.md`.
```

---

### 2.4 Implementation Tasks (`specs/<feature-dir>/tasks.md`)
The task breakdown file represents the executable backlog for the implementing agent.

- **Strict Task Item Grammar**:
  ```text
  - [ ] [TaskID] [P?] [Story?] Description with exact file path
  ```
  - `- [ ]`: Standard markdown checkbox (marked `[X]` upon completion).
  - `TaskID`: Sequential zero-padded number (`T001`, `T002`, `T003`...).
  - `[P]`: Parallel flag. Indicates the task touches isolated files and has no unfinished dependencies.
  - `[Story]`: Story tag (e.g. `[US1]`, `[US2]`) mapping the task directly to a user story in `spec.md`. Required for user story phases; omitted for setup, foundational, and polish phases.
  - `Description with file path`: Explicit action naming the exact target file.
- **Phasing Structure**:
  1. `## Phase 1: Setup` (Project initialization, config, directories)
  2. `## Phase 2: Foundational` (Blocking prerequisites, base models, DB schemas)
  3. `## Phase 3+: User Story Phases` (Organized by story priority P1, P2...)
  4. `## Phase Final: Polish & Cross-Cutting Concerns` (Documentation, cleanup, end-to-end runs)
  5. `## Phase N: Convergence` (Appended dynamically by `/speckit-converge` when discrepancies exist)

#### Canonical `tasks.md` Structure
```markdown
# Tasks: Password Reset Feature

## Phase 1: Setup
- [ ] T001 Initialize auth module directory layout in src/auth/
- [ ] T002 [P] Install argon2 and uuid dependencies in go.mod

## Phase 2: Foundational
- [ ] T003 Define ResetToken migration in src/db/migrations/20261103_reset_tokens.sql
- [ ] T004 Implement TokenRepository interface in src/auth/repository.go

## Phase 3: User Story 1 - Request Password Reset (Priority: P1)
- [ ] T005 [P] [US1] Create ResetRequest DTO in src/auth/dto.go
- [ ] T006 [US1] Implement TokenService.GenerateToken in src/auth/token_service.go
- [ ] T007 [US1] Implement POST /auth/password-reset endpoint in src/auth/handler.go

## Phase 4: User Story 2 - Complete Password Reset (Priority: P2)
- [ ] T008 [P] [US2] Implement TokenService.ValidateToken in src/auth/token_service.go
- [ ] T009 [US2] Update UserRepository.UpdatePassword in src/user/repository.go
- [ ] T010 [US2] Invalidate user sessions in src/auth/session_manager.go

## Phase 5: Polish & Cross-Cutting
- [ ] T011 Add audit log entries for failed reset attempts in src/auth/audit.go
- [ ] T012 Run end-to-end quickstart scenarios per quickstart.md
```

---

### 2.5 Supporting Artifacts

#### A. `research.md` (Phase 0 Output)
Documents technical decisions made during planning:
- **Format**:
  - `Decision`: What technology or pattern was chosen.
  - `Rationale`: Why it satisfies the requirements and constraints.
  - `Alternatives Considered`: What else was evaluated and why it was rejected.

#### B. `data-model.md` (Phase 1 Output)
Extracts domain entities directly from `spec.md` and `plan.md`:
- Entity names, field schemas, types, and relationships.
- Constraint preservation: Field limits, nullability, enums, and validation rules are quoted verbatim so implementation agents cannot make arbitrary choices.
- State transitions (e.g. `Draft -> Pending -> Approved -> Archived`).

#### C. Interface Contracts (`contracts/`)
Machine-readable and human-verifiable interface definitions:
- OpenAPI / Swagger schemas (`.yaml` / `.json`) for REST APIs.
- Protobuf definitions (`.proto`) for gRPC services.
- CLI argument grammars and JSON schemas for terminal tools.
- UI component prop contracts for frontend modules.

#### D. `quickstart.md`
A runnable, end-to-end validation guide:
- Setup commands, mock data population, test execution commands, and expected console/HTTP responses.
- Proves the feature works end-to-end without needing to read implementation internals.

#### E. Checklists (`checklists/*.md`) — "Unit Tests for English"
Spec Kit introduces a profound paradigm: **Checklists are unit tests for requirements writing, NOT implementation verification tests.**
- **Purpose**: Verify that the specification itself is complete, unambiguous, consistent, measurable, and covers edge cases *before* code is written.
- **Reviewer Ownership**: Checkboxes (`- [ ]`) in custom checklists are owned by human reviewers. An agent generates the checklist items but does NOT check them off. A checked box (`- [x]`) means the reviewer confirmed the requirement is clearly written; it does not mean the code is implemented.
- **Built-in Quality Checklist**: `checklists/requirements.md` (maintained by `specify` and `clarify`).
- **Domain-Specific Checklists**: Generated via `/speckit-checklist` (`ux.md`, `security.md`, `api.md`, `performance.md`).

| Anti-Pattern (Testing Implementation) ❌ | Spec Kit Standard (Testing Requirements Quality) ✅ |
| :--- | :--- |
| "Verify the login button redirects to /dashboard" | "Is the post-login destination URL explicitly defined for all role types? [Clarity, Spec §FR-2]" |
| "Test rate limiting returns HTTP 429" | "Are rate-limiting thresholds and window durations quantified with specific numbers? [Measurability, Spec §FR-8]" |
| "Confirm user avatar loads properly" | "Is fallback behavior specified when avatar CDN requests fail or time out? [Edge Cases, Gap]" |

---

## 3. CLI Commands and Complete Lifecycle

Spec Kit provides two levels of interaction: the host **Specify CLI (`specify`)** and the in-session **Agent Slash Commands / Skills (`/speckit-*`)**.

### 3.1 Specify CLI Subcommands Reference

| Subcommand | Syntax / Flags | Description |
| :--- | :--- | :--- |
| **`specify init`** | `specify init <name> [flags]`<br>`--integration <copilot\|claude\|gemini\|cursor\|windsurf>`<br>`--here` (or `.`)<br>`--script <ps\|sh\|py>`<br>`--force`<br>`--non-interactive`<br>`--integration-options "<opts>"` | Scaffolds a new project or initializes Spec Kit in an existing brownfield repository. Creates `.specify/`, copies templates, helper scripts, and registers agent integration files. |
| **`specify check`** | `specify check [--verbose]` | Performs a read-only environment diagnostic: verifies Python, `uv`, Git, required tools, and inspects project agent configurations. |
| **`specify version`** | `specify version` | Displays CLI version, runtime info, and installation source. |
| **`specify integration`** | `specify integration list`<br>`specify integration use <name>`<br>`specify integration upgrade` | Inspects, installs, switches, or updates AI agent integration definitions. |
| **`specify extension`** | `specify extension search [query]`<br>`specify extension add <name> [--dev <path>]`<br>`specify extension remove <name>` | Manages modular extensions that inject new commands, lifecycle hooks, and external tools (Jira, GitHub, Linear). |
| **`specify preset`** | `specify preset search [query]`<br>`specify preset add <id> [--priority <N>]`<br>`specify preset remove <id>` | Configures organizational presets that override templates, terminology, and process standards. |
| **`specify workflow`** | `specify workflow run <name>`<br>`specify workflow step <step_id>` | Executes multi-step, resumable terminal automation workflows. |
| **`specify artifact`** | `specify artifact inspect <name> [--json]` | Inspects resolved command templates, scripts, hooks, and composition stacks. |
| **`specify self`** | `specify self upgrade` | Automatically checks for and upgrades the `specify-cli` package. |
| **`specify mcp`** | `specify mcp [--port <P>]` | Launches an experimental local Model Context Protocol (MCP) stdio server exposing CLI JSON tools to MCP clients. |

---

### 3.2 The Spec Kit Agent Lifecycle

The complete lifecycle follows nine sequential phases:

```
 1. /speckit-constitution  ──> Establishes repository principles & governance
           │
           ▼
 2. /speckit-specify       ──> Natural language -> specs/NNN-feature/spec.md
           │
           ▼
 3. /speckit-clarify       ──> Interactive scan & max 5 targeted ambiguity questions
           │
           ▼
 4. /speckit-checklist     ──> Generates domain unit tests for requirements (ux, api, sec)
           │
           ▼
 5. /speckit-plan          ──> Tech context, constitution check, research.md, data-model, contracts
           │
           ▼
 6. /speckit-tasks         ──> Strict dependency-ordered tasks.md by user story (US1, US2...)
           │
           ▼
 7. /speckit-analyze       ──> Read-only cross-artifact consistency check (spec vs plan vs tasks)
           │
           ▼
 8. /speckit-implement     ──> Pre-checklists gate, ignore files, phase-by-phase execution
           │
           ▼
 9. /speckit-converge      ──> Code vs Artifacts gap detection; appends Phase N: Convergence
```

#### Detailed Phase Breakdown:

1. **/speckit-constitution**:
   - Evaluates input principles. Overwrites `.specify/memory/constitution.md`.
   - Increments semantic version (MAJOR/MINOR/PATCH), outputs Sync Impact Report, suggests commit message.
2. **/speckit-specify**:
   - Parses natural language intent. Resolves feature directory `specs/<NNN>-<short-name>`.
   - Resolves `spec-template` via `.specify/scripts/powershell/resolve-template.ps1`.
   - Evaluates constitution constraints. Injects functional requirements (FR-###) and success criteria (SC-###).
   - Generates and self-validates `checklists/requirements.md`.
   - Persists active feature directory into `.specify/feature.json`.
3. **/speckit-clarify**:
   - Scans specification across 10 structured dimensions (Functional Scope, Domain/Data Model, Interaction/UX, Non-Functional, Integrations, Edge Cases, Constraints, Terminology, Completion Signals).
   - Prioritizes top ambiguities; presents **maximum 5 questions sequentially**.
   - Provides recommended choice with rationale. Upon user response, atomically updates `spec.md` with a `## Clarifications` section (`### Session YYYY-MM-DD`), refines affected requirements, and re-evaluates `checklists/requirements.md`.
4. **/speckit-checklist**:
   - Clarifies intent with up to 3 questions. Loads spec and plan.
   - Generates or appends to `checklists/<domain>.md` (`ux.md`, `security.md`, etc.).
   - Formulates checklist items evaluating requirement quality (Completeness, Clarity, Consistency, Measurability, Coverage). Leaves all checkboxes unchecked (`- [ ]`) for human reviewer ownership.
5. **/speckit-plan**:
   - Runs `setup-plan.ps1 -Json`. Loads constitution and spec.
   - Evaluates Constitution Check gate.
   - Dispatches Phase 0 research tasks -> writes `research.md`.
   - Executes Phase 1 design -> writes `data-model.md`, `contracts/*`, and `quickstart.md`.
   - Re-evaluates constitution alignment post-design.
6. **/speckit-tasks**:
   - Runs `setup-tasks.ps1 -Json`.
   - Maps user stories (P1, P2...) to individual task phases.
   - Extracts entity constraints and interface contracts into task descriptions.
   - Flags parallelizable tasks with `[P]` and stories with `[US#]`.
   - Writes `specs/<feature-dir>/tasks.md`.
7. **/speckit-analyze**:
   - Strictly read-only cross-artifact audit (`spec.md` vs `plan.md` vs `tasks.md` vs `constitution.md`).
   - Runs 6 detection passes: Duplication, Ambiguity, Underspecification, Constitution Alignment, Coverage Gaps (requirements with 0 tasks), and Inconsistencies.
   - Classifies findings (CRITICAL, HIGH, MEDIUM, LOW) and outputs a structured Markdown report without writing to disk.
8. **/speckit-implement**:
   - Runs `check-prerequisites.ps1 -RequireTasks -IncludeTasks`.
   - **Checklist Gate**: Scans `checklists/*.md`. If any checklist contains unchecked items (`- [ ]`), halts and prompts: *"Some checklists have unchecked items. Do you want to proceed anyway? (yes/no)"*.
   - **Environment Guard**: Inspects project tech stack from `plan.md` and generates/verifies appropriate ignore files (`.gitignore`, `.dockerignore`, `.eslintignore`, etc.).
   - Executes tasks phase-by-phase. Marks completed items `[X]` in `tasks.md`.
9. **/speckit-converge**:
   - Assesses the current state of the codebase against `spec.md`, `plan.md`, `tasks.md`, and `constitution.md`.
   - **Append-Only Contract**: Never modifies existing code or rewrites existing tasks.
   - Classifies discrepancies into 4 gap types:
     - `missing`: Required functionality is entirely absent.
     - `partial`: Code exists but fails full acceptance criteria.
     - `contradicts`: Code conflicts with specification or a constitution MUST rule.
     - `unrequested`: Code exists that was never specified (surfaced for review).
   - If gaps exist, appends `## Phase N: Convergence` with new sequential task IDs (`T042...`) to `tasks.md`. If no gaps exist, leaves `tasks.md` byte-for-byte unchanged and outputs *"✅ Converged"*.

---

### 3.3 Extension Hook Lifecycle (`.specify/extensions.yml`)
Spec Kit features an event-driven extension hook system. Before and after every major lifecycle command, Spec Kit checks `.specify/extensions.yml`:

```yaml
hooks:
  before_specify:
    - extension: "speckit.git"
      command: "speckit-git-branch"
      description: "Create and checkout feature branch"
      optional: false
  after_specify:
    - extension: "speckit.jira"
      command: "speckit-jira-sync"
      description: "Sync spec summary to Jira issue"
      optional: true
  before_implement: []
  after_implement:
    - extension: "speckit.git"
      command: "speckit-git-commit"
      description: "Commit implemented tasks"
      optional: false
  after_converge: []
```
- **Execution semantics**: Mandatory hooks (`optional: false`) emit `EXECUTE_COMMAND:` and halt until the hook completes. Optional hooks (`optional: true`) present a prompt allowing the developer or agent to invoke the command.

---

## 4. Multi-Agent Tooling Integrations

Spec Kit was engineered with a strict **zero-lock-in philosophy**. Projects can initialize or switch AI coding agents at any time using `specify init --integration <agent>` or `specify integration use <agent>`.

### 4.1 Supported AI Coding Assistants

| Agent / Surface | Integration Key | Generated Files & Architecture | Workflow Experience |
| :--- | :--- | :--- | :--- |
| **GitHub Copilot** | `copilot` | `.github/prompts/speckit.*.prompt.md`<br>`.github/copilot-instructions.md`<br>VS Code Workspace settings | Native integration in VS Code & Copilot CLI. Developers invoke `/speckit.specify` or slash prompts in Copilot Chat. Prompts dynamically resolve `.specify/` templates. |
| **Claude / Claude Code** | `claude` (or `claude-code`) | `.claude/commands/speckit-*.md`<br>`CLAUDE.md` context file | Claude Code terminal agent automatically detects slash commands `/speckit-specify`. Guardrails in `CLAUDE.md` prevent Claude from bypassing specifications. |
| **Gemini CLI / Antigravity** | `gemini` (or `antigravity`) | `.agent/skills/speckit-*/SKILL.md`<br>`.gemini/commands/` | Maps Spec Kit commands into high-leverage agent skills. Agents read `SKILL.md`, enforce pre/post hooks, and leverage structured tool calls for file editing. |
| **Cursor** | `cursor` (or `cursor-agent`) | `.cursor/rules/speckit-*.mdc`<br>`.cursorrules` | Configures Cursor Composer and Chat. Rules instruct Cursor's multi-file indexing engine to prioritize `spec.md` and `plan.md` over ad-hoc codebase scanning. |
| **Windsurf** | `windsurf` | `.windsurfrules`<br>`.windsurf/workflows/` | Injects Cascade agent rules ensuring that Windsurf respects task ordering in `tasks.md` and verifies Constitution gates. |
| **Zed, Aider, OpenCode** | `generic` / `aider` | `AGENTS.md` / `INSTRUCTIONS.md` | Provides universal markdown instruction sets for command-line LLM wrappers and lightweight editors. |

### 4.2 Seamless Agent Switching
Because all feature state is stored in plain, standard Markdown files (`spec.md`, `plan.md`, `tasks.md`), a developer can draft a specification using **Claude 3.7 Sonnet** in Claude Code, refine architecture in **Cursor**, execute implementation tasks using **GitHub Copilot CLI**, and run convergence audits with **Antigravity / Gemini**, with zero loss of context or state mismatch.

---

## 5. Philosophy of Spec-Driven Development (SDD)

### 5.1 The Breakdown of "Vibe Coding" & Prompt Engineering
In the early era of generative AI (2022–2024), developers predominantly relied on **prompt engineering**: sending conversational queries to an LLM, receiving a block of code, pasting it into an editor, and iteratively prompting to fix broken behavior.

At production scale, this methodology fails catastrophically due to three fundamental LLM constraints:
1. **The Context Rot & Attention Degradation Problem**: LLMs possess finite effective context attention. As conversations extend across dozens of turns, older instructions (such as naming conventions, security policies, and boundary constraints) are lost in the "middle" of the context window.
2. **The Hallucination Cascade**: When prompted with vague requirements ("Build user authentication with email reset"), the LLM is forced to sample from its statistical training distribution to fill in hundreds of unspecified design choices (token lifetimes, hashing algorithms, database schemas, route paths). When one guess conflicts with a previous guess, the LLM invents fictitious libraries or incompatible abstractions to reconcile the contradiction.
3. **The Path of Least Resistance (Architectural Erosion)**: Without rigid structural boundaries, LLMs generate code that is locally expedient but globally disastrous (e.g. putting business logic inside database controllers, hardcoding credentials, or skipping error branches).

### 5.2 How Structured Markdown Contracts Bound LLM Context
Spec-Driven Development replaces conversational memory with **version-controlled filesystem memory**. 

```
Conventional Prompting:
[Conversational Noise + Unspecified Intent + Entire Codebase Dump] ──> LLM Hallucination & Drift

Spec-Driven Development:
[Bounded Spec (WHAT)]  ──> [Technical Plan (HOW)]  ──> [Bounded Task (DO)]  ──> Zero Hallucination
```

Spec Kit enforces four mathematical and cognitive guardrails on the LLM:
1. **Progressive Disclosure**: No single LLM prompt receives the entire project context.
   - When specifying: LLM only sees user prompt + Constitution -> produces `spec.md`.
   - When planning: LLM only sees `spec.md` + Constitution -> produces `plan.md`, `research.md`, `data-model.md`.
   - When generating tasks: LLM only sees `spec.md` + `plan.md` -> produces `tasks.md`.
   - When implementing: LLM receives **only one task at a time** (e.g. `T005 Implement User model in src/models/user.py`), along with the relevant schema contract. The LLM's full attention is concentrated on writing 50 lines of pristine code.
2. **Two-Way Traceability**: Every line of code traces back to a task (`T005`), which traces to a user story (`US1`), which traces to a functional requirement (`FR-002`), which satisfies a measurable success criterion (`SC-001`).
3. **Decoupling Intent from Implementation**: By strictly separating WHAT (`spec.md`) from HOW (`plan.md`), product owners and engineers can iterate on requirements without touching code, and refactor architectures without rewriting user stories.

### 5.3 Comparative Matrix: SDD vs. Prompt Engineering vs. TDD vs. BDD

| Dimension | Prompt Engineering | Test-Driven Development (TDD) | Behavior-Driven Development (BDD) | Spec-Driven Development (SDD) |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Artifact** | Ephemeral chat messages, system prompts | Unit/Integration tests (`*_test.go`, `test_*.py`) | Feature files (`.feature`, Gherkin scenarios) | Structured Markdown contracts (`constitution`, `spec`, `plan`, `tasks`) |
| **Primary Author** | Developer prompting LLM | Developer | Product Owner + QA + Developer | Human + AI Pair |
| **Primary Executor** | LLM guessing implementation | Local test runner (e.g. `pytest`, `go test`) | Cucumber / SpecFlow test runner | Autonomous AI coding agent guided by contracts |
| **Handling of Context** | Unbounded, noisy, prone to attention loss | Localized to tested unit; ignores system architecture | Localized to scenario; lacks technical planning | Curated, phased progressive disclosure; bounded per task |
| **Hallucination Risk** | **Extremely High** | Medium (caught post-generation by test failure) | Medium (caught post-generation) | **Minimal** (constrained upfront by contract & data model) |
| **Architecture Enforcement** | None (LLM drifts freely) | Weak (tests verify behavior, not module boundaries) | Weak (verifies user outcomes, not system design) | **Strong** (Constitution Check gates + cross-artifact analysis) |
| **Relationship to Tests** | Often skips tests or writes superficial tests | Tests drive code generation | Scenarios drive test generation | **Subsumes both**: Generates contracts, scenario tests, and tasks |

---

## 6. Comprehensive Discovery & Feature Tables

### 6.1 Features Discovered
| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | CLI | `specify init` | Scaffolds Spec Kit in new or brownfield repo | Target dir, `--integration`, `--script`, `--here` | `.specify/`, templates, scripts, agent config | Fails if dir exists without `--force` | Official Docs & PyPI |
| 2 | CLI | `specify check` | System & agent configuration diagnostic | None (optional `--verbose`) | Console diagnostic report | Non-zero exit if tools/dependencies missing | Official Docs |
| 3 | CLI | `specify integration` | Manages agent integration configs | Subcommand (`list`, `use`, `upgrade`) | Updated agent integration files | Errors on unknown agent key | Official Docs |
| 4 | CLI | `specify extension` | Installs/manages workflow extension packages | Subcommand (`search`, `add`, `remove`), flags | Updated `.specify/extensions.yml` | Errors on package conflict or missing repo | Official Docs |
| 5 | CLI | `specify preset` | Configures organizational template presets | Subcommand (`search`, `add`, `remove`), `--priority` | Layered template resolution configs | Errors on unresolvable preset layer | Official Docs |
| 6 | CLI | `specify mcp` | Hosts local stdio Model Context Protocol server | Port / stdio flags | JSON-RPC MCP server endpoint | Errors if port bound or client disconnects | GitHub Releases |
| 7 | Governance | `/speckit-constitution` | Establishes/amends non-negotiable project rules | Natural language principles, governance inputs | `.specify/memory/constitution.md` | Halts on deferred non-governance intents | `speckit-constitution/SKILL.md` |
| 8 | Lifecycle | `/speckit-specify` | Generates feature spec from user description | Natural language feature description | `specs/<dir>/spec.md`, `checklists/requirements.md` | Halts if description empty or >3 clarifications | `speckit-specify/SKILL.md` |
| 9 | Lifecycle | `/speckit-clarify` | Scans ambiguities; interactive targeted Q&A | Active `spec.md`, user answers | Updated `spec.md` with `## Clarifications` | Enforces hard cap of 5 questions | `speckit-clarify/SKILL.md` |
| 10 | Quality | `/speckit-checklist` | Generates requirements unit tests ("tests for English") | Domain intent (UX, API, Security) | `checklists/<domain>.md` with `- [ ] CHK###` | Forbids implementation testing language | `speckit-checklist/SKILL.md` |
| 11 | Lifecycle | `/speckit-plan` | Architecture design, research, and contracts | `spec.md`, `constitution.md` | `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md` | Fails if Constitution Check gate fails | `speckit-plan/SKILL.md` |
| 12 | Lifecycle | `/speckit-tasks` | Generates sequential, story-mapped task backlog | `plan.md`, `spec.md`, `data-model.md` | `specs/<dir>/tasks.md` | Enforces strict checklist format with file paths | `speckit-tasks/SKILL.md` |
| 13 | Audit | `/speckit-analyze` | Read-only cross-artifact consistency audit | `spec.md`, `plan.md`, `tasks.md`, `constitution.md` | Markdown analysis report (in-memory) | CRITICAL on constitution MUST violations | `speckit-analyze/SKILL.md` |
| 14 | Execution | `/speckit-implement` | Executes tasks and manages environment ignore files | `tasks.md`, `plan.md`, `checklists/` | Code files created/modified, `tasks.md` marked `[X]` | Prompts/halts if checklist items unchecked | `speckit-implement/SKILL.md` |
| 15 | Convergence | `/speckit-converge` | Closes gap between artifacts and actual code | Codebase, `spec.md`, `plan.md`, `tasks.md` | Appends `## Phase N: Convergence` to `tasks.md` | Never rewrites existing tasks or code | `speckit-converge/SKILL.md` |
| 16 | Hook Engine | Extension Hooks | Pre- and post-execution command triggers | `.specify/extensions.yml` | Dispatched hook commands (`EXECUTE_COMMAND:`) | Halts on mandatory hook failure | All skill files |
| 17 | Template Engine | `resolve-template` | Multi-layer template composition stack | Template name, overrides, presets | Resolved template string (`TEMPLATE_CONTENT`) | Halts if template cannot be resolved | `resolve-template.ps1` |

---

### 6.2 Edge Cases & Observed Behaviors
| # | Feature | Input / Condition | Observed & Enforced Behavior |
|---|---------|-------------------|-----------------------------|
| 1 | `speckit-specify` | User provides feature description with multiple ambiguous choices | Agent makes informed guesses using domain best practices; injects maximum 3 `[NEEDS CLARIFICATION]` markers. Never halts for trivial defaults. |
| 2 | `speckit-specify` | Spec directory naming conflict | Checks `.specify/init-options.json`. If `sequential`, increments to next available 3-digit number (`004-xxx`). If `timestamp`, uses `YYYYMMDD-HHMMSS`. |
| 3 | `speckit-clarify` | User replies with "yes", "recommended", or "suggested" | Automatically adopts the AI's pre-analyzed recommendation and advances to the next question. |
| 4 | `speckit-clarify` | More than 5 ambiguous categories detected in spec | Ranks categories by (Impact * Uncertainty) heuristic; selects top 5 and explicitly flags remainder under Deferred. |
| 5 | `speckit-checklist` | Checklist item attempts to verify code behavior (e.g. "Verify button clicks") | Strict validator rejects item. Must rewrite as requirements quality question (e.g. "Are click target dimensions and touch states specified?"). |
| 6 | `speckit-checklist` | Agent executes checklist generation | Generated items are strictly left unchecked (`- [ ]`). Checkbox state belongs exclusively to human reviewer. |
| 7 | `speckit-plan` | Architecture introduces pattern violating Constitution MUST principle | Plan execution immediately stops with ERROR. Gate cannot be bypassed without formal constitution amendment. |
| 8 | `speckit-tasks` | User stories have non-blocking dependencies | Tasks tagged with `[P]` (parallelizable) and story identifier `[US#]`. Enables parallel subagents to work without branch collisions. |
| 9 | `speckit-implement` | `checklists/requirements.md` or custom checklist contains unchecked items (`- [ ]`) | Halts execution immediately; prompts user for explicit confirmation before proceeding. |
| 10 | `speckit-converge` | Codebase satisfies 100% of spec, plan, and tasks | Leaves `tasks.md` byte-for-byte unchanged (no empty header) and reports "✅ Converged". |
| 11 | `speckit-converge` | Codebase contains code outside of spec/plan | Categorizes finding as `unrequested` (MEDIUM/LOW severity); appends task to review/justify or remove, never deletes code directly. |
| 12 | `speckit-converge` | Project run on brand new feature before code exists | Gracefully treats entire specified scope as `missing` remaining work; never crashes. |
| 13 | Extensions | `.specify/extensions.yml` contains syntax error | Logs parser error clearly; warns user that no mandatory hooks were checked; proceeds safely without silent failure. |

---

## 7. Conclusions & Strategic Synthesis

1. **Spec Kit is not a code generator—it is a cognitive bounding harness.** Its brilliance lies in understanding that LLM failures are not primarily model intelligence failures, but context and specification failures.
2. **Markdown is the new compilation target.** By formalizing requirements into structured Markdown with strict schemas (`constitution.md`, `spec.md`, `plan.md`, `tasks.md`), human engineers retain complete architectural control while offloading mechanical task execution to AI coding agents.
3. **The Spec-Driven Development cycle guarantees determinism.** From constitution gating and interactive clarification caps (max 5) to requirements quality checklists and append-only convergence audits, Spec Kit provides the missing engineering discipline that transforms AI agents from erratic toys into enterprise-grade software developers.
