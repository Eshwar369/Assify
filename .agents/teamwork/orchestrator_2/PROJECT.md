# Project: GitHub Spec Kit & SDD Enterprise Production Standards

## Architecture
- Artifact System: 4-Tier Spec-Driven Development (Constitution -> Spec -> Plan -> Tasks)
- Storage & Directory Layout:
  - Research Synthesis & Practitioner Guide: `docs/sdd_patterns_and_best_practices.md`
  - Generic Reusable Templates: `docs/templates/sdd/generic/`
    - `constitution.md`
    - `spec.md`
    - `plan.md`
    - `tasks.md`
  - Project-Tailored Real-World Reference Examples: `docs/templates/sdd/examples/`
    - `constitution.md`
    - `spec.md`
    - `plan.md`
    - `tasks.md`
- Target Stack for Reference Examples:
  - React Native (0.76+) / Expo SDK 54 LTS
  - Hermes engine, TypeScript
  - Styling: Light Apple HIG tokens (`#FFFFFF` canvas, `#F5F5F7` grouped, `#BF9B28` deluluGold)
  - Components: Component-First architecture (`mobile/src/components/ui/` primitives)
  - Anti-Slop Enforcement: `native-slop.md` 20 tells elimination
  - State & Storage: Zustand + MMKV, BaseDatabaseProvider (SQLite WAL mode MVP / Supabase PostgreSQL Phase 2)
  - Telemetry: 0-LLM deterministic chronemics engine
  - Backend: FastAPI async service

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Multi-Source Online Research & Synthesis | Synthesize patterns, structures, and phrasing from GitHub Spec Kit, specify-cli, Thoughtworks, and practitioner engineering blogs | M1 | Survey / R1 (DONE) |
| 2 | Anti-Pattern & Pitfall Taxonomy | Detailed analysis of 10 SDD failure modes (Monolithic task trap, context exhaustion, green-check blindness, etc.) with mitigations | M1 | Survey / R1 (DONE) |
| 3 | Generic Constitution Template | Generic `.specify/memory/constitution.md` template with RFC 2119 directives, sync impact report, semantic versioning, and prompt guidance | M1 | Survey / R2 (DONE) |
| 4 | Generic Feature Specification Template | Generic `specs/<feature>/spec.md` template with What/Why firewall, user stories P1 MVP slicing, FR-###, SC-###, and clarification caps | M1 | Survey / R2 (DONE) |
| 5 | Generic Implementation Plan Template | Generic `specs/<feature>/plan.md` template with Technical Context grid, Constitution Check gate, Phase 0/1 outputs, and complexity tracking | M1 | Survey / R2 (DONE) |
| 6 | Generic Granular Task Breakdown Template | Generic `specs/<feature>/tasks.md` template with strict task grammar, Phase 1-N structure, US grouping, [P] flags, and convergence loops | M1 | Survey / R2 (DONE) |
| 7 | Project-Tailored Constitution Example | Fully articulated `constitution.md` for Assify enforcing Light Apple tokens, Component-First law, anti-slop rules, BaseDatabaseProvider, and TDD | M2 | Survey / R3 |
| 8 | Project-Tailored Feature Specification Example | Fully articulated `spec.md` for Assify offline WhatsApp chat import, 1-on-1 participant validation, 0-LLM chronemics, and 5-Act unboxing | M2 | Survey / R3 |
| 9 | Project-Tailored Implementation Plan Example | Fully articulated `plan.md` for Assify detailing React Native component tree, Zustand stores, SQLite migrations, and Constitution Check | M2 | Survey / R3 |
| 10 | Project-Tailored Granular Tasks Example | Fully articulated `tasks.md` for Assify with exact relative paths, TDD test tasks before code, Phase 1 Setup, Phase 2 Foundational, US1 MVP, and Convergence | M2 | Survey / R3 |
| 11 | Cross-Artifact Consistency & Verification | End-to-end linting, verification of all deliverables against MAIN_APP_REQUIREMENTS.md, constitution.md, and workspace standards | M1/M2 Gates | Survey / Acceptance |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Research Synthesis & Generic SDD Templates | Author `docs/sdd_patterns_and_best_practices.md` and generic templates in `docs/templates/sdd/generic/` | Survey Complete | DONE |
| M2 | Project-Tailored Real-World Reference Examples | Author 4 concrete reference templates in `docs/templates/sdd/examples/` reflecting Assify's React Native / Expo stack | M1 (DONE) | READY |

## Interface Contracts
### SDD Core Grammar Contract
- Task Grammar: `- [ ] [T###] [P?] [US#?] Description with exact/relative/path`
- Requirement Grammar: `FR-###: System MUST/MUST NOT ...`
- Success Criteria Grammar: `SC-###: Objective measurable metric ...`
- Acceptance Scenario Grammar: `Given [context], When [action], Then [outcome]` with explicit `Evidence Check:`
- Constitution Principle Grammar: `Article [N]: [Name]` with RFC 2119 keywords and explicit `Rationale:`

## Code Layout
- `docs/sdd_patterns_and_best_practices.md` (654 lines)
- `docs/templates/sdd/generic/constitution.md` (175 lines)
- `docs/templates/sdd/generic/spec.md` (223 lines)
- `docs/templates/sdd/generic/plan.md` (166 lines)
- `docs/templates/sdd/generic/tasks.md` (237 lines)
- `docs/templates/sdd/examples/constitution.md` (M2)
- `docs/templates/sdd/examples/spec.md` (M2)
- `docs/templates/sdd/examples/plan.md` (M2)
- `docs/templates/sdd/examples/tasks.md` (M2)
