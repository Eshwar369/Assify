# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: `specs/[###-feature-name]/spec.md`  
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`  

<!--
  ============================================================================
  ARCHITECTURAL PLANNING WORKFLOW (WHAT VS. HOW RESOLUTION):
  ----------------------------------------------------------------------------
  This document translates the technology-agnostic requirements from spec.md
  into concrete, executable software architecture.

  MANDATORY PLANNING GATES:
  1. Technical Context must be fully defined; unresolved items must be resolved
     in Phase 0 research.
  2. The Constitution Check gate MUST pass before Phase 0 research begins,
     and MUST be re-verified after Phase 1 design completes.
  3. Any constitutional deviation MUST be justified in the Complexity Tracking table.
  ============================================================================
-->

## Summary

[Synthesize from feature spec: extract the primary business and functional requirement, then summarize the technical architecture, libraries, and design patterns selected to implement it.]

---

## Technical Context

<!--
  ADVISORY TECHNICAL CONTEXT GRID:
  Enumerate all technical environment parameters. Any unknown or debated choice
  MUST be flagged with `[NEEDS CLARIFICATION]` and resolved in Phase 0 research.
-->

| Dimension | Specification & Version | Architectural Role & Rationale |
| :--- | :--- | :--- |
| **Language/Version** | [e.g., TypeScript 5.4+ / Python 3.12+ / Rust 1.75+] | [Core language runtime standard] |
| **Primary Dependencies** | [e.g., Framework, UI library, state management tool] | [Core application frameworks] |
| **Storage Engine** | [e.g., Local SQLite (WAL mode) / PostgreSQL / MMKV] | [Persistence layer and caching mechanism] |
| **Testing Toolchain** | [e.g., Jest / Pytest / Vitest / Playwright] | [Unit, contract, and integration test runners] |
| **Target Platform** | [e.g., iOS 16+, Android API 33+, Linux x86_64, Web] | [Target execution environments] |
| **Project Type** | [e.g., Mobile App / Web Service / Microservice / CLI / Library] | [Application deployment topology] |
| **Performance Goals** | [e.g., <200ms P95 latency, 60 FPS animations, cold start <1.5s] | [Quantifiable non-functional performance benchmarks] |
| **Constraints** | [e.g., Offline-first architecture, <30MB binary size, zero leaks] | [Operational, memory, network, and security constraints] |
| **Scale & Scope** | [e.g., 5 core entities, 12 API endpoints, 8 UI screens] | [Estimated dimensional surface area of the feature] |

---

## Constitution Check

*GATE: Must pass before Phase 0 research begins. Re-evaluated and validated after Phase 1 design.*

<!--
  ACTION REQUIRED: Enumerate EVERY Article defined in .specify/memory/constitution.md.
  Provide concrete verification evidence explaining how the proposed architecture
  strictly honors the article.
-->

- [ ] **Article I: [Article 1 Name, e.g., Architectural Integrity & Layering]**
  - *Evidence*: [Explain how the design honors this article, e.g., "Service logic isolated from transport layer in src/services/; zero direct DB queries in UI controllers."]
- [ ] **Article II: [Article 2 Name, e.g., Component-First Law / Shared Primitives]**
  - *Evidence*: [Explain evidence, e.g., "All visual components consume centralized tokens; zero bespoke container cards declared in route screens."]
- [ ] **Article III: [Article 3 Name, e.g., Test-Driven Integrity (NON-NEGOTIABLE)]**
  - *Evidence*: [Explain evidence, e.g., "Failing contract and unit tests scheduled in Phase 3 prior to implementation code."]
- [ ] **Article IV: [Article 4 Name, e.g., Anti-Slop Enforcement & Platform Quality]**
  - *Evidence*: [Explain evidence, e.g., "Layout eliminates card nesting, respects safe area insets, and enforces light theme tokens."]
- [ ] **Article V: [Article 5 Name, e.g., Security, Privacy & Telemetry]**
  - *Evidence*: [Explain evidence, e.g., "Zero-trust PII sanitization boundary configured prior to external network dispatch."]

---

## Phased Design Deliverables (Phase 0 & Phase 1)

<!--
  The planning workflow produces four concrete sub-artifacts before task generation.
-->

### 1. Phase 0: Research & Unknowns (`research.md`)
*Required when technical choices or trade-offs require investigation.*
- **Decision Triplet Standard**: Every research outcome must be recorded as:
  1. **Decision**: The selected library, architecture, or pattern.
  2. **Rationale**: Technical, performance, or operational justification.
  3. **Alternatives Considered**: Specific alternatives evaluated and the technical reasons for their rejection.

### 2. Phase 1: Domain Data Model (`data-model.md`)
*Required when the feature introduces or modifies persisted entities.*
- Concrete entity definitions, field datatypes, nullability, validation constraints.
- Relationship mapping (1:1, 1:N, N:M) and cascading deletion behaviors.
- Entity lifecycle states and valid state machine transitions.

### 3. Phase 1: Interface Contracts (`contracts/`)
*Required when the feature introduces public interfaces, APIs, or component props.*
- Machine-readable contracts: OpenAPI schemas (`api.yaml`), TypeScript interface definitions (`types.ts`), or Protocol Buffer definitions.
- Strictly-typed request and response structures (prohibiting loose or untyped payloads).

### 4. Phase 1: Validation Runbook (`quickstart.md`)
*Required for developer and automated end-to-end verification.*
- Runnable CLI commands to initialize dependencies and environment variables.
- Step-by-step instructions to execute automated test suites and verify happy-path and error flows.

---

## Project Structure

### Documentation (this feature)
```text
specs/[###-feature]/
├── plan.md              # This file (Technical architecture and constitution gate)
├── research.md          # Phase 0 output (Resolved technical decisions and trade-offs)
├── data-model.md        # Phase 1 output (Entity schemas and state transitions)
├── quickstart.md        # Phase 1 output (Validation runbook and testing commands)
├── contracts/           # Phase 1 output (API specs, schemas, and interface definitions)
└── tasks.md             # Phase 2 output (Dependency-ordered executable backlog)
```

### Source Code Layout (repository root)

<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete filesystem layout
  for this specific feature. Use exact directory paths matching repository conventions.
-->

```text
[PROJECT_ROOT]/
├── src/
│   ├── models/          # Domain entities and validation schemas (per data-model.md)
│   ├── services/        # Headless business logic, chronemics, and data transformers
│   ├── providers/       # Base provider abstract interfaces and concrete adapters
│   ├── components/      # Reusable UI primitives and presentation components
│   └── routes/          # Navigation screens, controllers, or HTTP API endpoints
└── tests/
    ├── unit/            # Unit tests covering services and transformers in isolation
    ├── contract/        # Contract tests validating schemas against contracts/
    └── integration/     # End-to-end integration flows exercising complete journeys
```

**Structure Decision**: [Document the chosen architectural pattern (e.g., Modular Monolith, Clean Architecture, Ports & Adapters) and explain how it prevents layer coupling.]

---

## Complexity Tracking

> **Fill ONLY if Constitution Check requires an exception that must be justified.**

| Constitutional Clause | Proposed Exception | Technical Necessity | Simpler Alternative Rejected Because |
| :--- | :--- | :--- | :--- |
| [e.g., Article II] | [e.g., Direct native module bridge] | [e.g., Hardware acceleration for real-time video] | [e.g., Standard JS bridge introduces unacceptable frame drops (>30ms)] |

---

## AI Coding Agent Directives for Architectural Planning

```markdown
1. CONSTITUTION CHECK GATE: Before defining technical designs, you MUST evaluate every Article
   in `constitution.md`. You MUST explicitly record verification evidence in the Constitution
   Check table. If a design violates an invariant without justification, you MUST HALT.
2. COMPONENT BOUNDARIES: You MUST define concrete directory structures and module boundaries.
   Screen components MUST NOT query databases or external network clients directly; all access
   MUST flow through designated domain services and providers.
3. CONCRETE PATHS ONLY: In the Project Structure section, you MUST eliminate generic option
   placeholders and provide the exact filesystem tree where code will be added or modified.
4. DEPENDENCY PRUNING: You MUST NOT propose new dependencies if existing workspace libraries
   can fulfill the requirement without disproportionate complexity.
```
