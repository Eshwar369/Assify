# Dispatch: Milestone 1 Iteration 2 Worker (Apply Generic SDD Template Remediations)

You are worker_m1_it2.
Working directory: c:\Users\DELL\gen ai\Assify\.agents\teamwork\worker_m1_it2\
Parent orchestrator: orchestrator_2 (Conversation ID: 898607cd-2905-4a6e-af79-531d6b976d98)
Original Request Path: c:\Users\DELL\gen ai\Assify\.agents\teamwork\ORIGINAL_REQUEST.md

## Scope & Write Ownership
You exclusively own and MUST modify the following 2 files:
1. `c:\Users\DELL\gen ai\Assify\docs\templates\sdd\generic\plan.md`
2. `c:\Users\DELL\gen ai\Assify\docs\templates\sdd\generic\tasks.md`

DO NOT modify files outside your ownership.

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Input Resources
- Explorer 2 Remediation Handoff: `c:\Users\DELL\gen ai\Assify\.agents\teamwork\explorer_m1_it2_2\handoff.md`
- Full Unified Patch: `c:\Users\DELL\gen ai\Assify\.agents\teamwork\explorer_m1_it2_2\remediation_full.patch`
- Verification Script: `c:\Users\DELL\gen ai\Assify\.agents\teamwork\explorer_m1_it2_2\verify_remediation.py`
- Challenger 2 Report: `c:\Users\DELL\gen ai\Assify\.agents\teamwork\challenger_m1_2\handoff.md`

## Required Edits
Apply the exact remediations specified in `explorer_m1_it2_2\handoff.md`:
1. In `docs/templates/sdd/generic/plan.md`:
   - Line 3: Replace `**Spec**: [specs/[###-feature-name]/spec.md]` with `**Spec**: `specs/[###-feature-name]/spec.md``.
2. In `docs/templates/sdd/generic/tasks.md`:
   - Line 5: Standardize title to `# Tasks: [FEATURE_NAME]`.
   - Lines 35–37: Add `### Reserved Task Syntax Flags vs. Template Placeholders` documenting `[P]` and `[US#]` as protected syntax flags, and `\[(?!(?:P|US\d+)\b)([A-Z0-9_]+)\]` as safe extraction regex.
   - Tasks T009–T023: Standardize all lowercase/TitleCase placeholders to uppercase format (`[ENTITY_NAME]`, `[SERVICE_NAME]`, `[COMPONENT_NAME]`, `[SCREEN_NAME]`, `[SERVICE2_NAME]`, `[JOURNEY2_NAME]`, `[ENTITY2_NAME]`, `[VIEW_NAME]`, `[SCENARIO3_NAME]`, `[ENHANCEMENT_NAME]`, `[LOGGER_NAME]`).
   - Task T026: Add `in `package.json`` to satisfy Invariant 1.
   - Reordering: Relocate `## Dependencies & Execution Order`, `## Parallel Execution Example: User Story 1`, `## Implementation Strategy & MVP Delivery`, and `## AI Coding Agent Directives for Implementation` ABOVE `## Phase N+1: Append-Only Convergence`.
   - Update placeholders in Parallel Example and Convergence examples to uppercase format.
   - Ensure `## Phase N+1: Append-Only Convergence` is the terminal section of `tasks.md`.

## Verification & Output
1. Run the Python verification script:
   `python .agents/teamwork/explorer_m1_it2_2/verify_remediation.py`
   Ensure all 6 assertions pass with 100% success.
2. Write your handoff report to `c:\Users\DELL\gen ai\Assify\.agents\teamwork\worker_m1_it2\handoff.md`.
3. Send a message to orchestrator_2 when done.


## 2026-11-04T03:52:37Z
[Message] timestamp=2026-11-04T03:52:37Z sender=898607cd-2905-4a6e-af79-531d6b976d98 priority=MESSAGE_PRIORITY_HIGH content=You are worker_m1_it2.
Your working directory is: c:\Users\DELL\gen ai\Assify\.agents\teamwork\worker_m1_it2\
Read your dispatch instructions in: c:\Users\DELL\gen ai\Assify\.agents\teamwork\worker_m1_it2\DISPATCH.md
Follow the instructions carefully.
MANDATORY: Read c:\Users\DELL\gen ai\Assify\.agents\teamwork\ORIGINAL_REQUEST.md before starting work.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Apply the exact remediations to:
1. c:\Users\DELL\gen ai\Assify\docs\templates\sdd\generic\plan.md
2. c:\Users\DELL\gen ai\Assify\docs\templates\sdd\generic\tasks.md

Run the verification test:
python .agents/teamwork/explorer_m1_it2_2/verify_remediation.py

Write your handoff report to c:\Users\DELL\gen ai\Assify\.agents\teamwork\worker_m1_it2\handoff.md.
When finished, send a message to orchestrator_2 (ID: 898607cd-2905-4a6e-af79-531d6b976d98).
