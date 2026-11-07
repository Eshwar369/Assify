import os
import re

dir_path = r'docs/templates/sdd/examples'
files = ['constitution.md', 'spec.md', 'plan.md', 'tasks.md']

print('--- CHECK 1: File Existence & Sizes ---')
for f in files:
    p = os.path.join(dir_path, f)
    if os.path.exists(p):
        with open(p, 'r', encoding='utf-8') as fh:
            lines = fh.readlines()
        print(f'{f}: {os.path.getsize(p)} bytes, {len(lines)} lines')
    else:
        print(f'MISSING: {f}')

print('\n--- CHECK 2: Regex Placeholder Leaks ---')
pattern = re.compile(r'\[(?!(?:P|US\d+|USER|PARTNER|PHONE_REDACTED|EMAIL_REDACTED|ACCOUNT_REDACTED|x| )\b)([A-Z0-9_]{3,})\]')
for f in files:
    p = os.path.join(dir_path, f)
    with open(p, 'r', encoding='utf-8') as fh:
        content = fh.read()
    matches = pattern.findall(content)
    print(f'{f}: {len(matches)} placeholder leaks: {matches}')

print('\n--- CHECK 3: Tasks formatting & IDs ---')
tasks_file = os.path.join(dir_path, 'tasks.md')
with open(tasks_file, 'r', encoding='utf-8') as fh:
    lines = fh.readlines()

tasks = [l.strip() for l in lines if l.strip().startswith('- [ ]')]
print(f'Active Task count: {len(tasks)}')

task_id_pattern = re.compile(r'^- \[ \] (T\d{3})\b')
paths_in_tasks = []
for t in tasks:
    m = task_id_pattern.match(t)
    has_backtick = '`' in t
    has_mobile = 'mobile/' in t
    # extract path inside backticks
    b_matches = re.findall(r'`([^`]+)`', t)
    for bm in b_matches:
        paths_in_tasks.append(bm)
    if not m or not has_backtick or not has_mobile:
        print(f'Malformed task line: {t}')

print(f'Extracted {len(paths_in_tasks)} backtick paths across tasks.')
print('First 5 tasks:', tasks[:5])
print('Last 5 tasks:', tasks[-5:])

print('\n--- CHECK 4: Terminal Convergence Section ---')
convergence_found = False
for idx, l in enumerate(lines):
    if '## Phase 7: Append-Only Convergence' in l:
        convergence_found = True
        print(f'Phase 7 found at line {idx+1}')
        # verify no other ## headers after this
        subsequent_headers = [sub_l for sub_l in lines[idx+1:] if sub_l.strip().startswith('## ')]
        print(f'Subsequent H2 headers after Phase 7: {subsequent_headers}')

print('\n--- CHECK 5: Traceability between Spec, Plan, and Tasks ---')
with open(os.path.join(dir_path, 'spec.md'), 'r', encoding='utf-8') as fh:
    spec_content = fh.read()
with open(os.path.join(dir_path, 'plan.md'), 'r', encoding='utf-8') as fh:
    plan_content = fh.read()

# Check user stories
spec_stories = re.findall(r'### User Story (\d+)', spec_content)
print(f'Spec User Stories: {spec_stories}')

# Check requirements in spec
reqs = re.findall(r'FR-\d{3}', spec_content)
print(f'FR count in spec: {len(reqs)} (Unique: {len(set(reqs))})')

# Check task mapping to stories
story_tasks = {'US1': [], 'US2': [], 'US3': []}
for t in tasks:
    for s in story_tasks:
        if f'[{s}]' in t:
            story_tasks[s].append(t)
for s, st in story_tasks.items():
    print(f'Tasks mapped to {s}: {len(st)}')

print('\n--- CHECK 6: Primitives & Tokens in Constitution and Plan ---')
with open(os.path.join(dir_path, 'constitution.md'), 'r', encoding='utf-8') as fh:
    const_content = fh.read()

primitives = ['StatStrip', 'SegmentedControl', 'EditorialSection', 'ReceiptQuote', 'DeluluGauge']
for prim in primitives:
    in_const = prim in const_content
    in_plan = prim in plan_content
    in_tasks = any(prim in t for t in tasks)
    print(f'Primitive {prim}: const={in_const}, plan={in_plan}, tasks={in_tasks}')

tokens = ['#FFFFFF', '#F5F5F7', '#BF9B28', '#000000', '#1D1D1F', '#86868B', '#D2D2D7']
for tok in tokens:
    in_const = tok in const_content
    in_plan = tok in plan_content
    print(f'Token {tok}: const={in_const}, plan={in_plan}')
