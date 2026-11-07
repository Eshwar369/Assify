# Dispatch: Milestone 2 Iteration 2 Worker (Remediation of Example Templates)

You are `worker_m2_it2` (teamwork_worker).
Working directory: `c:\Users\DELL\gen ai\Assify\.agents\teamwork\worker_m2_it2\`
Parent conversation ID: `898607cd-2905-4a6e-af79-531d6b976d98`
Original Request Path: `c:\Users\DELL\gen ai\Assify\.agents\teamwork\ORIGINAL_REQUEST.md`

## MANDATORY INTEGRITY WARNING
> DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Write Ownership
You have exclusive write ownership over the 4 concrete project reference example templates:
1. `docs/templates/sdd/examples/constitution.md`
2. `docs/templates/sdd/examples/spec.md`
3. `docs/templates/sdd/examples/plan.md`
4. `docs/templates/sdd/examples/tasks.md`
You MUST NOT write to any files in `docs/templates/sdd/generic/` or any other directory outside your working directory and the 4 target files above.

## Input Resources
You MUST read the following input handoff reports from the Iteration 2 Explorers and Challenger 2 before touching any files:
1. `c:\Users\DELL\gen ai\Assify\.agents\teamwork\ORIGINAL_REQUEST.md`
2. `c:\Users\DELL\gen ai\Assify\.agents\teamwork\challenger_m2_2\handoff.md` (Challenger rejection findings)
3. `c:\Users\DELL\gen ai\Assify\.agents\teamwork\explorer_m2_it2_1\handoff.md` (DDL BIGINT timestamps & BaseDatabaseProvider decoupling)
4. `c:\Users\DELL\gen ai\Assify\.agents\teamwork\explorer_m2_it2_2\handoff.md` (Complete 20 Anti-Slop tells for Article III)
5. `c:\Users\DELL\gen ai\Assify\.agents\teamwork\explorer_m2_it2_3\handoff.md` (Missing tasks, active count, terminal turn & delta edge cases, Indian phone regex)

## Objective & Required Edits

### 1. `docs/templates/sdd/examples/constitution.md`
- Replace Article III (lines 59–67) with the complete, canonical 20 Anti-Slop tells formatted exactly as specified in `explorer_m2_it2_2/handoff.md` (§4).
- Ensure each tell begins with `N. **No <Tell Name>:**` to strictly satisfy Challenger 2's regex `r'\d+\.\s+\*\*No\s+([^\*]+)\*'`.
- Verify all 20 tells match.

### 2. `docs/templates/sdd/examples/plan.md`
- In §2 Phase 1: Domain Data Model (`mobile/src/database/migrations/001_initial_schema.sql`), ensure all 5 millisecond epoch timestamp columns across all tables are declared `BIGINT NOT NULL`:
  * `contacts.created_at BIGINT NOT NULL`
  * `contacts.updated_at BIGINT NOT NULL`
  * `messages.timestamp BIGINT NOT NULL`
  * `chronemics_reports.computed_at BIGINT NOT NULL`
  * `dossiers.unboxed_at BIGINT NOT NULL`
- In §1 Constitution Check, update Article I evidence to note `BIGINT` prevents 32-bit PostgreSQL overflow in Supabase Phase 2.
- In §3 Phased Deliverables: Interface Contracts (`BaseDatabaseProvider.ts`), append the typed provider registry functions (`registerDatabaseProvider` and `getDatabaseProvider`) per `explorer_m2_it2_1/handoff.md` (§4 A.3).

### 3. `docs/templates/sdd/examples/tasks.md`
- Update task `T004` to specify `BIGINT` timestamps.
- Update task `T005` to include provider registry functions (`registerDatabaseProvider`, `getDatabaseProvider`).
- Decouple stores:
  * `T015` (`chatStore.ts`): MUST depend on `T005` (via `getDatabaseProvider()`), NOT concrete `T006`.
  * `T023` (`vaultStore.ts`): MUST depend on `T005` (via `getDatabaseProvider()`), NOT concrete `T006`.
- Update `T016`: Initialize and register `SQLiteDatabaseProvider` into registry at composition root.
- Update `T033` (now `T036`): Implement hard wipe via `BaseDatabaseProvider.wipeAllData()`.
- Add missing tasks in Phase 5 per `explorer_m2_it2_3/handoff.md`:
  * `T028 [P] [US3] Implement centralized tactile SegmentedControl pill switcher primitive with physics spring indicator in mobile/src/components/ui/SegmentedControl.tsx`
  * `T034 [US3] Implement full unlocked forensic dossier and story share screen route in mobile/src/app/dossier/report.tsx`
  * `T035 [US3] Implement saved contacts and historical dossier vault screen route with SegmentedControl filter in mobile/src/app/(tabs)/vault.tsx`
- Add incremental delta ingestion task in Phase 6:
  * `T037 Implement zero-delta import detection and incremental delta ingestion with change badges in mobile/src/services/parser/ChatParser.ts`
- Clean up Phase 7 (Append-Only Convergence): remove active checkbox syntax (`- [ ]`) from inside HTML comments so automated regex parsers (`^- \[ \]`) do not register false positives.
- Ensure total active tasks across Phases 1–6 is exactly **39 active tasks** (`T001` through `T039`).

### 4. `docs/templates/sdd/examples/spec.md`
- In Edge Cases (Four-Quadrant Matrix):
  * Add Edge Case 5: Terminal Turn Exclusion in Quadrant 1.
  * Add Edge Case 11: Incremental / Differential Delta Ingestion in Quadrant 3.
  * Update Edge Case 16: PII Masking with explicit support for Indian WhatsApp mobile numbers with 5-5 digit spacing (`+91 98765 43210`).
- In User Story 2: Append Acceptance Scenario 5 for terminal turn exclusion.
- In Functional Requirements: Update FR-008 and FR-009; add FR-011.
- In Success Criteria: Update SC-002; add SC-006.

## Verification Instructions
After modifying the 4 files, you MUST run automated verification scripts directly against the files:
1. Anti-Slop Tells Count: Python regex matching `r'\d+\.\s+\*\*No\s+([^\*]+)\*'` on `constitution.md` must return exactly 20.
2. DDL Schema Check: Check that all 5 timestamp columns in `plan.md` are `BIGINT NOT NULL` and `timestamp INTEGER NOT NULL` does not exist.
3. Provider Decoupling Check: Check that `tasks.md` lines for `T015` and `T023` contain `T005` and do NOT contain `T006`.
4. Task Checklist Integrity: Check that uncommented active tasks in `tasks.md` matching `^- \[ \] (T\d+)` count is exactly 39, and that `SegmentedControl.tsx`, `vault.tsx`, and `report.tsx` are present.
5. Spec Edge Cases: Check that `Terminal Turn Exclusion`, `Incremental / Differential Delta Ingestion`, and `+91 98765 43210` exist in `spec.md`.

Document all verification commands and verbatim outputs in your `handoff.md`.
When done, notify parent via `send_message`.


## 2026-11-04T07:30:09Z
You are worker_m2_it2 (teamwork_worker).
Working directory: c:\Users\DELL\gen ai\Assify\.agents\teamwork\worker_m2_it2\
Parent conversation ID: 898607cd-2905-4a6e-af79-531d6b976d98
Original Request Path: c:\Users\DELL\gen ai\Assify\.agents\teamwork\ORIGINAL_REQUEST.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Please read your dispatch instructions at:
c:\Users\DELL\gen ai\Assify\.agents\teamwork\worker_m2_it2\DISPATCH.md
and c:\Users\DELL\gen ai\Assify\.agents\teamwork\ORIGINAL_REQUEST.md.

Read the 3 Explorer handoff reports:
- c:\Users\DELL\gen ai\Assify\.agents\teamwork\explorer_m2_it2_1\handoff.md
- c:\Users\DELL\gen ai\Assify\.agents\teamwork\explorer_m2_it2_2\handoff.md
- c:\Users\DELL\gen ai\Assify\.agents\teamwork\explorer_m2_it2_3\handoff.md

Your task:
Apply the exact remediations to:
1. docs/templates/sdd/examples/constitution.md (enumerate all 20 Anti-Slop tells in Article III)
2. docs/templates/sdd/examples/plan.md (BIGINT timestamps in DDL, provider registry in BaseDatabaseProvider.ts, Article I evidence)
3. docs/templates/sdd/examples/tasks.md (decouple T015/T023 to T005, register at T016, add SegmentedControl.tsx, report.tsx, vault.tsx, ChatParser delta ingestion, clean Phase 7 comments, total 39 active tasks)
4. docs/templates/sdd/examples/spec.md (Terminal Turn Exclusion, Incremental Delta Ingestion, 5-5 spaced Indian phone regex, update FR-008, FR-009, SC-002, add FR-011, SC-006)

Run empirical verification scripts to confirm:
- Exactly 20 tells match in constitution.md
- All 5 timestamp columns are BIGINT NOT NULL in plan.md
- T015 and T023 depend on T005 and not T006 in tasks.md
- Exactly 39 active tasks in tasks.md with all mandated primitives & screens
- All spec edge cases and spaced phone regex present in spec.md

Write your findings, verification outputs, and summary to c:\Users\DELL\gen ai\Assify\.agents\teamwork\worker_m2_it2\handoff.md.
When done, notify parent (898607cd-2905-4a6e-af79-531d6b976d98) via send_message.
