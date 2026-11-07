import re

# Read original files
with open('docs/templates/sdd/generic/tasks.md', 'r', encoding='utf-8') as f:
    orig_tasks = f.read()

with open('docs/templates/sdd/generic/plan.md', 'r', encoding='utf-8') as f:
    orig_plan = f.read()

# --- REMEDIATION 1: Normalize Placeholders & Shield Task Flags in tasks.md ---
remediated_tasks = orig_tasks

# 1.1 Add syntax flag vs placeholder distinction to Format section
format_old = """- **`[Story]`**: User story identifier (`[US1]`, `[US2]`). **Mandatory in User Story phases; forbidden in Setup, Foundational, and Polish phases**.
- **`Description & File Path`**: Precise action description containing the exact relative filesystem path to create or modify."""

format_new = """- **`[Story]`**: User story identifier (`[US1]`, `[US2]`). **Mandatory in User Story phases; forbidden in Setup, Foundational, and Polish phases**.
- **`Description & File Path`**: Precise action description containing the exact relative filesystem path to create or modify.

> **Syntax Flags vs. Template Placeholders**:
> - Structural Flags (DO NOT SUBSTITUTE): `[P]` (parallel marker) and `[US1]`, `[US2]`, `[US3]` (user story markers) are functional execution metadata flags parsed by SDD tooling. They MUST NOT be substituted during template instantiation.
> - Template Placeholders (SUBSTITUTE): Identifiers enclosed in brackets matching uppercase conventions (e.g., `[PROJECT_ROOT]`, `[CONFIG_FILE]`, `[ENTITY_NAME]`, `[SERVICE_NAME]`, `[COMPONENT_NAME]`, `[SCREEN_NAME]`) MUST be replaced with feature-specific entity and path names."""

assert format_old in remediated_tasks, "Format block not found"
remediated_tasks = remediated_tasks.replace(format_old, format_new)

# 1.2 Normalize filename placeholders in tasks.md
replacements = [
    # Story 1
    ("tests/unit/test_[entity].ts", "tests/unit/test_[ENTITY_NAME].ts"),
    ("tests/contract/test_[service].ts", "tests/contract/test_[SERVICE_NAME].ts"),
    ("src/models/[entity].ts", "src/models/[ENTITY_NAME].ts"),
    ("src/services/[service].ts", "src/services/[SERVICE_NAME].ts"),
    ("src/components/ui/[Component].tsx", "src/components/ui/[COMPONENT_NAME].tsx"),
    ("src/routes/[Screen].tsx", "src/routes/[SCREEN_NAME].tsx"),
    # Story 2
    ("tests/contract/test_[service2].ts", "tests/contract/test_[SERVICE2_NAME].ts"),
    ("tests/integration/test_[journey2].ts", "tests/integration/test_[JOURNEY2_NAME].ts"),
    ("src/models/[entity2].ts", "src/models/[ENTITY2_NAME].ts"),
    ("src/services/[service2].ts", "src/services/[SERVICE2_NAME].ts"),
    ("src/components/[View].tsx", "src/components/[VIEW_NAME].tsx"),
    # Story 3
    ("tests/unit/test_[scenario3].ts", "tests/unit/test_[SCENARIO3_NAME].ts"),
    ("src/services/[enhancement].ts", "src/services/[ENHANCEMENT_NAME].ts"),
    # Polish & cross-cutting
    ("src/telemetry/[logger].ts", "src/telemetry/[LOGGER_NAME].ts"),
]

for old, new in replacements:
    assert old in remediated_tasks, f"Replacement target '{old}' not found"
    remediated_tasks = remediated_tasks.replace(old, new)

# --- REMEDIATION 2: Satisfy Invariant 1 for Task T026 in tasks.md ---
t026_old = "- [ ] T026 Execute production build and bundle size verification"
t026_new = "- [ ] T026 Execute production build and bundle size verification in `package.json`"
assert t026_old in remediated_tasks, "T026 old text not found"
remediated_tasks = remediated_tasks.replace(t026_old, t026_new)

# --- REMEDIATION 3: Fix Nested Brackets in plan.md & Relocate Convergence Section in tasks.md ---

# 3.1 Fix plan.md line 3
plan_line3_old = "**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [specs/[###-feature-name]/spec.md]  "
plan_line3_new = "**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: `specs/[###-feature-name]/spec.md`  "
assert plan_line3_old in orig_plan, "plan.md line 3 not found"
remediated_plan = orig_plan.replace(plan_line3_old, plan_line3_new)

# 3.2 Relocate Convergence Section in tasks.md
convergence_block = """---

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
-->"""

directives_and_guidance = """---

## Dependencies & Execution Order

### Phase Dependencies
- **Phase 1 (Setup)**: Starts immediately with zero prerequisites.
- **Phase 2 (Foundational)**: Depends on Phase 1 completion. **BLOCKS all user stories**.
- **Phase 3+ (User Stories)**: Depend on Phase 2 completion. Proceed in strict priority order (P1 MVP $\\rightarrow$ P2 $\\rightarrow$ P3).
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
- Add User Story 2 $\\rightarrow$ Validate independently $\\rightarrow$ Checkpoint.
- Add User Story 3 $\\rightarrow$ Validate independently $\\rightarrow$ Checkpoint.
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
```"""

# In remediated_tasks, currently convergence_block comes before directives_and_guidance
current_combined = convergence_block + "\n\n" + directives_and_guidance
assert current_combined in remediated_tasks, "Current combined block not found"

relocated_combined = directives_and_guidance + "\n\n" + convergence_block
remediated_tasks = remediated_tasks.replace(current_combined, relocated_combined)

print("=== REMEDIATION SIMULATION VALIDATION ===")

# 1. Challenger automated test suite on remediated text:
t026_match = re.search(r'-\s+\[\s*\]\s+T026\s+(.*)', remediated_tasks)
has_path = '`' in t026_match.group(1) if t026_match else False
print('VERIFY T026 Path:', 'PASS' if has_path else 'FAIL - Missing relative path')

# Lowercase placeholders in remediated tasks (filtering markdown checkboxes [x], [ ])
missed = [m for m in re.findall(r'\[([a-z0-9_]+)\]', remediated_tasks) if m not in ('x', ' ')]
print('VERIFY Lowercase Placeholders:', 'PASS' if not missed else f'FAIL - {len(missed)} lowercase placeholders found: {set(missed)}')

# Nested brackets in plan.md
nested = re.findall(r'\[[^\]\n]*\[[^\]\n]+\][^\]\n]*\]', remediated_plan)
print('VERIFY Nested Brackets:', 'PASS' if not nested else f'FAIL - Nested brackets found: {nested}')

# Check terminal position of Phase N+1 Convergence
terminal_match = remediated_tasks.rstrip().endswith("-->")
print('VERIFY Convergence Terminal Positioning:', 'PASS' if terminal_match else 'FAIL')
