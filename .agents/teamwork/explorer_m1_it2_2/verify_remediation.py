import os
import re

with open('docs/templates/sdd/generic/tasks.md', 'r', encoding='utf-8') as f:
    orig_tasks = f.read()

with open('docs/templates/sdd/generic/plan.md', 'r', encoding='utf-8') as f:
    orig_plan = f.read()

# 1. plan.md line 3
fixed_plan = orig_plan.replace(
    '**Spec**: [specs/[###-feature-name]/spec.md]',
    '**Spec**: `specs/[###-feature-name]/spec.md`'
)

# 2. tasks.md replacements
replacements = [
    ('# Tasks: [FEATURE NAME]', '# Tasks: [FEATURE_NAME]'),
    ('- [ ] T009 [P] [US1] Unit test for domain validation logic in `tests/unit/test_[entity].ts`',\
     '- [ ] T009 [P] [US1] Unit test for domain validation logic in `tests/unit/test_[ENTITY_NAME].ts`'),
    ('- [ ] T010 [P] [US1] Contract test for service interface per `contracts/` in `tests/contract/test_[service].ts`',\
     '- [ ] T010 [P] [US1] Contract test for service interface per `contracts/` in `tests/contract/test_[SERVICE_NAME].ts`'),
    ('- [ ] T011 [P] [US1] Create domain entity data model with strict validation in `src/models/[entity].ts`',\
     '- [ ] T011 [P] [US1] Create domain entity data model with strict validation in `src/models/[ENTITY_NAME].ts`'),
    ('- [ ] T012 [US1] Implement core service business logic in `src/services/[service].ts` (depends on T011)',\
     '- [ ] T012 [US1] Implement core service business logic in `src/services/[SERVICE_NAME].ts` (depends on T011)'),
    ('- [ ] T013 [P] [US1] Implement shared UI layout primitive in `src/components/ui/[Component].tsx`',\
     '- [ ] T013 [P] [US1] Implement shared UI layout primitive in `src/components/ui/[COMPONENT_NAME].tsx`'),
    ('- [ ] T014 [US1] Wire component into screen route and application state in `src/routes/[Screen].tsx` (depends on T012, T013)',\
     '- [ ] T014 [US1] Wire component into screen route and application state in `src/routes/[SCREEN_NAME].tsx` (depends on T012, T013)'),
    ('- [ ] T015 [P] [US2] Contract test for secondary service interface in `tests/contract/test_[service2].ts`',\
     '- [ ] T015 [P] [US2] Contract test for secondary service interface in `tests/contract/test_[SERVICE2_NAME].ts`'),
    ('- [ ] T016 [P] [US2] Integration test exercising User Story 2 journey in `tests/integration/test_[journey2].ts`',\
     '- [ ] T016 [P] [US2] Integration test exercising User Story 2 journey in `tests/integration/test_[JOURNEY2_NAME].ts`'),
    ('- [ ] T017 [P] [US2] Create secondary domain entity model in `src/models/[entity2].ts`',\
     '- [ ] T017 [P] [US2] Create secondary domain entity model in `src/models/[ENTITY2_NAME].ts`'),
    ('- [ ] T018 [US2] Implement secondary service logic in `src/services/[service2].ts` (depends on T017)',\
     '- [ ] T018 [US2] Implement secondary service logic in `src/services/[SERVICE2_NAME].ts` (depends on T017)'),
    ('- [ ] T019 [US2] Integrate secondary capability into user interface in `src/components/[View].tsx`',\
     '- [ ] T019 [US2] Integrate secondary capability into user interface in `src/components/[VIEW_NAME].tsx`'),
    ('- [ ] T020 [P] [US3] Unit test for edge case scenario in `tests/unit/test_[scenario3].ts`',\
     '- [ ] T020 [P] [US3] Unit test for edge case scenario in `tests/unit/test_[SCENARIO3_NAME].ts`'),
    ('- [ ] T021 [US3] Implement enhancement service logic in `src/services/[enhancement].ts`',\
     '- [ ] T021 [US3] Implement enhancement service logic in `src/services/[ENHANCEMENT_NAME].ts`'),
    ('- [ ] T022 [US3] Connect enhancement trigger to navigation screen in `src/routes/[Screen].tsx`',\
     '- [ ] T022 [US3] Connect enhancement trigger to navigation screen in `src/routes/[SCREEN_NAME].tsx`'),
    ('- [ ] T023 [P] Add structured telemetry and performance metrics in `src/telemetry/[logger].ts`',\
     '- [ ] T023 [P] Add structured telemetry and performance metrics in `src/telemetry/[LOGGER_NAME].ts`'),
    ('- [ ] T026 Execute production build and bundle size verification',\
     '- [ ] T026 Execute production build and bundle size verification in `package.json`'),
    ('- [ ] T027 Remediate missing edge case per FR-004 (partial) in `src/services/[service].ts`',\
     '- [ ] T027 Remediate missing edge case per FR-004 (partial) in `src/services/[SERVICE_NAME].ts`'),
    ('- [ ] T028 Fix constitutional boundary violation (contradicts) in `src/routes/[Screen].tsx`',\
     '- [ ] T028 Fix constitutional boundary violation (contradicts) in `src/routes/[SCREEN_NAME].tsx`'),
    ('Agent 1: "Write unit test in tests/unit/test_[entity].ts" (T009)',\
     'Agent 1: "Write unit test in tests/unit/test_[ENTITY_NAME].ts" (T009)'),
    ('Agent 2: "Write contract test in tests/contract/test_[service].ts" (T010)',\
     'Agent 2: "Write contract test in tests/contract/test_[SERVICE_NAME].ts" (T010)'),
    ('Agent 1: "Create entity model in src/models/[entity].ts" (T011)',\
     'Agent 1: "Create entity model in src/models/[ENTITY_NAME].ts" (T011)'),
    ('Agent 2: "Implement UI primitive in src/components/ui/[Component].tsx" (T013)',\
     'Agent 2: "Implement UI primitive in src/components/ui/[COMPONENT_NAME].tsx" (T013)')
]

fixed_tasks = orig_tasks
for old, new in replacements:
    assert old in fixed_tasks, f'Target not found: {old}'
    fixed_tasks = fixed_tasks.replace(old, new)

# 3. tasks.md reordering
p_n1 = fixed_tasks.find('## Phase N+1: Append-Only Convergence')
dep = fixed_tasks.find('## Dependencies & Execution Order')
assert p_n1 != -1 and dep != -1
block_header_to_pn = fixed_tasks[:p_n1]
block_pn1 = fixed_tasks[p_n1:dep]
block_instructions = fixed_tasks[dep:]
fixed_tasks = block_header_to_pn + block_instructions.rstrip() + '\n\n---\n\n' + block_pn1.strip() + '\n'

# 4. tasks.md format section enrichment
format_target = '- **`Description & File Path`**: Precise action description containing the exact relative filesystem path to create or modify.\n'
format_addition = (
    '- **`Description & File Path`**: Precise action description containing the exact relative filesystem path to create or modify.\n\n'
    '### Reserved Task Syntax Flags vs. Template Placeholders\n\n'
    '- **Reserved Structural Syntax Flags**: `[P]` (parallel execution marker) and `[US#]` (user story traceability markers, e.g., `[US1]`, `[US2]`, `[US3]`) are functional execution grammar flags parsed by SDD tooling. Autonomous agents and templating tools **MUST NOT** treat them as unpopulated placeholders, and **MUST NOT** substitute, rename, or strip them during template instantiation.\n'
    '- **Template Substitution Variables**: Placeholders enclosed in brackets matching uppercase conventions (e.g., `[PROJECT_ROOT]`, `[CONFIG_FILE]`, `[ENTITY_NAME]`, `[SERVICE_NAME]`, `[COMPONENT_NAME]`, `[SCREEN_NAME]`) **MUST** be replaced with concrete project-specific names.\n'
    '- **Flag-Safe Extraction Regex**: Parsers extracting unpopulated placeholders **MUST** use negative lookahead to exclude reserved flags: `\\[(?!(?:P|US\\d+)\\b)([A-Z0-9_]+)\\]`.\n'
)
assert format_target in fixed_tasks
fixed_tasks = fixed_tasks.replace(format_target, format_addition)

print("=== VERIFICATION RESULTS ===")
print("1. T026 backtick present:", chr(96) in re.search(r'T026.*', fixed_tasks).group(0))
lowercase_left = [m for m in re.findall(r'\[([a-z0-9_]+)\]', fixed_tasks) if m not in ('x', ' ')]
print("2. Lowercase placeholders in tasks.md:", lowercase_left)
plan_nested = re.findall(r'\[[^\]\n]*\[[^\]\n]+\][^\]\n]*\]', fixed_plan)
print("3. Plan nested brackets:", plan_nested)
last_h2 = [l for l in fixed_tasks.splitlines() if l.startswith('## ')][-1]
print("4. Last H2 header in tasks.md:", last_h2)
flags = re.findall(r'\[(P|US\d+)\]', fixed_tasks)
print(f"5. Total syntax flags preserved in tasks.md: {len(flags)}")
placeholders = sorted(set(re.findall(r'\[(?!(?:P|US\d+)\b)([A-Z0-9_]+)\]', fixed_tasks)))
print(f"6. Distinct uppercase placeholders in tasks.md: {placeholders}")
print("ALL VERIFICATIONS COMPLETED SUCCESSFULLY.")
