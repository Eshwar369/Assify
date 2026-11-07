# Dispatch: Milestone 1 Worker (Research Synthesis & Generic SDD Templates)

You are worker_m1.
Working directory: c:\Users\DELL\gen ai\Assify\.agents\teamwork\worker_m1\
Parent orchestrator: orchestrator_2 (Conversation ID: 898607cd-2905-4a6e-af79-531d6b976d98)
Original Request Path: c:\Users\DELL\gen ai\Assify\.agents\teamwork\ORIGINAL_REQUEST.md

## Scope & Write Ownership
You exclusively own and MUST create the following files:
1. `c:\Users\DELL\gen ai\Assify\docs\sdd_patterns_and_best_practices.md`
2. `c:\Users\DELL\gen ai\Assify\docs\templates\sdd/generic/constitution.md`
3. `c:\Users\DELL\gen ai\Assify\docs\templates\sdd/generic/spec.md`
4. `c:\Users\DELL\gen ai\Assify\docs\templates\sdd/generic/plan.md`
5. `c:\Users\DELL\gen ai\Assify\docs\templates\sdd/generic/tasks.md`

DO NOT modify files outside your ownership.

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Input Resources
- c:\Users\DELL\gen ai\Assify\.agents\teamwork\ORIGINAL_REQUEST.md
- c:\Users\DELL\gen ai\Assify\.agents\teamwork\orchestrator_2\PROJECT.md
- c:\Users\DELL\gen ai\Assify\.agents\teamwork\spec_miner_survey_1\survey_report.md
- c:\Users\DELL\gen ai\Assify\.agents\teamwork\explorer_survey_2\survey_report.md
- c:\Users\DELL\gen ai\Assify\.agents\teamwork\explorer_survey_3\survey_report.md
- c:\Users\DELL\gen ai\Assify\docs\spec_kit_research_report.md

## Detailed Objectives

### Deliverable 1: `docs/sdd_patterns_and_best_practices.md`
Synthesize the survey findings into a comprehensive, authoritative production guide:
- Executive Summary & The Shift from "Vibe Coding" to Spec-Driven Development.
- The 3 Tiers of SDD Adoption (Fowler & Böckeler: Spec-First, Spec-Anchored, Spec-as-Source).
- The 8-Stage SDD Lifecycle Funnel: Constitution -> Specify -> Clarify -> Checklist -> Plan -> Tasks -> Analyze -> Implement -> Converge.
- Structural conventions & phrasing: RFC 2119 keyword binding (`MUST`, `MUST NOT`), "Always / Ask First / Never" triad, Given-When-Then BDD scenarios with explicit `Evidence Check:` test links.
- The "What vs. How Firewall": Absolute prohibition of tech stack leakage in `spec.md`.
- Comprehensive Anti-Pattern Taxonomy (10 documented failure modes: Monolithic Task Trap, Keystroke Micro-management Trap, Flat-List Fallacy, Static Plan Rigidity, Context Window Exhaustion / "Lost in the Middle", Specification Theater, Cognitive Surrender, Comprehension Debt, etc.) with root causes and concrete remedies.
- Requirements Checklists as "Unit Tests for English" & Reviewer Ownership vs Agent Execution.
- AI Agent Prompt Directives: Verbatim operational prompt instructions for each artifact.

### Deliverable 2: `docs/templates/sdd/generic/constitution.md`
- Header: `# [PROJECT_NAME] Constitution`
- Sync Impact Report template comment at top (`<!-- Sync Impact Report: vX.Y.Z -> vA.B.C -->`).
- Strict Semantic Versioning line (`**Version**: [CONSTITUTION_VERSION] | **Ratified**: [DATE] | **Last Amended**: [DATE]`).
- Core Principles sections using RFC 2119 imperatives and explicit `Rationale:`.
- Architectural Invariants, Quality Gates & Verification, and Governance sections.
- Embedded `<!-- ACTION REQUIRED: ... -->` instruction comments for human architects and AI agents.

### Deliverable 3: `docs/templates/sdd/generic/spec.md`
- Header: `# Feature Specification: [FEATURE NAME]`
- Metadata grid (`Feature Branch`, `Created`, `Status`, `Input`).
- User Scenarios & Testing with P1 MVP prioritization, Independent Test definitions, and Gherkin Given-When-Then acceptance criteria with `Evidence Check:`.
- Edge Cases section.
- Functional Requirements (`FR-001`, `FR-002`) with RFC 2119 imperatives.
- Key Entities table/section.
- Measurable Success Criteria (`SC-001`, `SC-002`).
- Assumptions section.
- Ambiguity guard: Strict instruction capping `[NEEDS CLARIFICATION]` tags at max 3.
- What vs How firewall instruction comments.

### Deliverable 4: `docs/templates/sdd/generic/plan.md`
- Header: `# Implementation Plan: [FEATURE]`
- Technical Context grid (Language/Version, Dependencies, Storage, Testing, Target Platform, Project Type, Performance Goals, Constraints, Scale/Scope).
- Constitution Check gate with explicit verification checkboxes for every constitutional article.
- Phased Design Deliverables layout (`research.md`, `data-model.md`, `contracts/`, `quickstart.md`).
- Project Structure trees (Documentation vs Source Code).
- Complexity Tracking table.

### Deliverable 5: `docs/templates/sdd/generic/tasks.md`
- YAML frontmatter (`description: "Task list template for feature implementation"`).
- Strict task syntax definition: `- [ ] [TaskID] [P?] [Story?] Description with exact/file/path`.
- Phase 1: Setup, Phase 2: Foundational (Blocking Prerequisites), Phase 3: User Story 1 (P1 MVP) with Tests and Implementation subsections, Phase 4+: User Story 2..., Phase N: Polish, and Phase N+1: Append-Only Convergence.
- Explicit Dependencies & Execution Order, Parallel Opportunities, and MVP validation rules.

## Verification & Output
1. Run syntax / markdown checks.
2. Ensure every template has clear placeholder conventions (`[UPPERCASE_IDENTIFIER]`) and prompt engineering guidance.
3. Write your completion report to `c:\Users\DELL\gen ai\Assify\.agents\teamwork\worker_m1\handoff.md`.
4. Message orchestrator_2 when done.


## 2026-11-04T03:12:51Z
[Message from orchestrator_2]
You are worker_m1.
Your working directory is: c:\Users\DELL\gen ai\Assify\.agents\teamwork\worker_m1\
Read your dispatch instructions in: c:\Users\DELL\gen ai\Assify\.agents\teamwork\worker_m1\DISPATCH.md
Follow the instructions carefully.
MANDATORY: Read c:\Users\DELL\gen ai\Assify\.agents\teamwork\ORIGINAL_REQUEST.md before starting work.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Create the files assigned to you:
1. c:\Users\DELL\gen ai\Assify\docs\sdd_patterns_and_best_practices.md
2. c:\Users\DELL\gen ai\Assify\docs\templates\sdd\generic\constitution.md
3. c:\Users\DELL\gen ai\Assify\docs\templates\sdd\generic\spec.md
4. c:\Users\DELL\gen ai\Assify\docs\templates\sdd\generic\plan.md
5. c:\Users\DELL\gen ai\Assify\docs\templates\sdd\generic\tasks.md

Follow all structural conventions and schemas extracted in the survey reports.
Document your results and write your handoff to c:\Users\DELL\gen ai\Assify\.agents\teamwork\worker_m1\handoff.md.
When finished, send a message to orchestrator_2 (ID: 898607cd-2905-4a6e-af79-531d6b976d98).
