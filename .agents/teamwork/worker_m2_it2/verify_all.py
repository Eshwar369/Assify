import re
import sys
import sqlite3
import time

print("=== 1. CONSTITUTION ANTI-SLOP TELLS AUDIT ===")
with open('docs/templates/sdd/examples/constitution.md', 'r', encoding='utf-8') as f:
    const_text = f.read()

tells = re.findall(r'\d+\.\s+\*\*No\s+([^\*]+)\*', const_text)
print(f"Tells matching regex: {len(tells)}")
for i, tell in enumerate(tells, 1):
    print(f"  {i}. No {tell}")
assert len(tells) == 20, f"Expected exactly 20 tells, got {len(tells)}"
print("--> SUCCESS: Exactly 20 Anti-Slop tells verified.")

print("\n=== 2. PLAN DDL & PROVIDER REGISTRY AUDIT ===")
with open('docs/templates/sdd/examples/plan.md', 'r', encoding='utf-8') as f:
    plan_text = f.read()

expected_columns = [
    'created_at BIGINT NOT NULL',
    'updated_at BIGINT NOT NULL',
    'timestamp BIGINT NOT NULL',
    'computed_at BIGINT NOT NULL',
    'unboxed_at BIGINT NOT NULL'
]
for col in expected_columns:
    assert col in plan_text, f"Missing column definition: {col}"
    print(f"  Found: {col}")
assert 'timestamp INTEGER NOT NULL' not in plan_text, "Found forbidden timestamp INTEGER NOT NULL"
assert 'registerDatabaseProvider' in plan_text, "Missing registerDatabaseProvider"
assert 'getDatabaseProvider' in plan_text, "Missing getDatabaseProvider"
assert 'BIGINT prevents 32-bit integer overflow in PostgreSQL' in plan_text
print("--> SUCCESS: All 5 timestamp columns BIGINT NOT NULL, zero INTEGER timestamps, provider registry verified.")

print("\n=== 3. TASKS DECOUPLING & ACTIVE COUNT AUDIT ===")
with open('docs/templates/sdd/examples/tasks.md', 'r', encoding='utf-8') as f:
    tasks_text = f.read()

for line in tasks_text.splitlines():
    if 'T015' in line and 'chatStore.ts' in line:
        print('  T015:', line)
        assert 'T005' in line and 'T006' not in line
    if 'T023' in line and 'vaultStore.ts' in line:
        print('  T023:', line)
        assert 'T005' in line and 'T006' not in line

uncommented_tasks = re.sub(r'<!--.*?-->', '', tasks_text, flags=re.DOTALL)
active_tasks = re.findall(r'^- \[ \] (T\d+)', uncommented_tasks, flags=re.MULTILINE)
total_checkboxes = re.findall(r'^- \[ \]', tasks_text, flags=re.MULTILINE)
print(f"  Active Tasks Count: {len(active_tasks)}")
print(f"  Total File Checkboxes: {len(total_checkboxes)}")
assert len(active_tasks) == 39, f"Expected 39 active tasks, got {len(active_tasks)}"
assert len(total_checkboxes) == 39, f"Expected 39 checkboxes, got {len(total_checkboxes)}"
assert active_tasks[0] == 'T001'
assert active_tasks[-1] == 'T039'

mandated_items = [
    'mobile/src/app/(tabs)/index.tsx',
    'mobile/src/app/(tabs)/vault.tsx',
    'mobile/src/app/(tabs)/settings.tsx',
    'mobile/src/app/dossier/unboxing.tsx',
    'mobile/src/app/dossier/report.tsx',
    'mobile/src/components/ui/StatStrip.tsx',
    'mobile/src/components/ui/SegmentedControl.tsx',
    'mobile/src/components/ui/EditorialSection.tsx',
    'mobile/src/components/ui/ReceiptQuote.tsx',
    'mobile/src/components/ui/DeluluGauge.tsx',
    'mobile/src/components/ui/ParticipantModal.tsx',
    'mobile/src/services/parser/ChatParser.ts'
]
for item in mandated_items:
    assert item in uncommented_tasks, f"Missing mandated item: {item}"
    print(f"  Found mandated item: {item}")
print("--> SUCCESS: Decoupling confirmed, exactly 39 tasks (T001-T039), all 11 primitives/screens present.")

print("\n=== 4. SPEC EDGE CASES & PHONE SANITIZATION AUDIT ===")
with open('docs/templates/sdd/examples/spec.md', 'r', encoding='utf-8') as f:
    spec_text = f.read()

assert 'Terminal Turn Exclusion' in spec_text
assert 'Incremental / Differential Delta Ingestion' in spec_text
assert '+91 98765 43210' in spec_text
assert 'FR-008' in spec_text and 'terminal turn exclusion' in spec_text
assert 'FR-009' in spec_text and '+91 98765 43210' in spec_text
assert 'FR-011' in spec_text and 'incremental/differential delta ingestion' in spec_text
assert 'SC-002' in spec_text and '+91 98765 43210' in spec_text
assert 'SC-006' in spec_text and 'Incremental delta imports' in spec_text
print("--> SUCCESS: All spec edge cases, requirements, and success criteria verified.")

print("\n=== 5. EMPIRICAL RUNTIME CHECKS ===")
# SQLite BIGINT check
conn = sqlite3.connect(':memory:')
c = conn.cursor()
c.execute('CREATE TABLE msg (id TEXT PRIMARY KEY, ts BIGINT NOT NULL)')
now_ms = int(time.time() * 1000)
c.execute('INSERT INTO msg VALUES (?, ?)', ('m1', now_ms))
c.execute('SELECT ts, typeof(ts) FROM msg WHERE id = ?', ('m1',))
row = c.fetchone()
assert row[0] == now_ms
assert row[1] == 'integer'
print(f"  SQLite BIGINT insert & retrieval: ts={row[0]} (typeof: {row[1]}) -> PASS")

# Indian phone regex check
phone_regex = re.compile(r'(?:\+?91[\s.-]?)?(?:[6-9]\d{9}|[6-9]\d{4}[\s.-]?\d{5})\b')
phone_samples = [
    '+91 98765 43210',
    '+91 9876543210',
    '+91-98765-43210',
    '+919876543210',
    '98765 43210',
    '9876543210'
]
for p in phone_samples:
    m = phone_regex.search(p)
    assert m is not None, f"Failed on {p}"
    print(f"  Phone match {p}: \"{m.group(0)}\" -> PASS")

print("\n=============================================")
print("ALL 5 AUDIT PHASES PASSED WITH ZERO DEFECTS!")
print("=============================================")
