# Handoff Report: DDL BIGINT Timestamp Remediation & Database Provider Decoupling

**Author**: `explorer_m2_it2_1`  
**Milestone**: Milestone 2 Iteration 2  
**Parent Orchestrator**: `orchestrator_2` (Conversation ID: `898607cd-2905-4a6e-af79-531d6b976d98`)  
**Target Deliverables Analyzed**:
- `docs/templates/sdd/examples/plan.md`
- `docs/templates/sdd/examples/tasks.md`
**Input Reference**: `challenger_m2_2/handoff.md` (Observations 1.3 & 1.4)

---

## 1. Observation

Direct empirical observations, commands, outputs, line numbers, and verbatim quotes across the target artifacts:

### 1.1 DDL Timestamp Column Definition & PostgreSQL 32-Bit Overflow
In `docs/templates/sdd/examples/plan.md` (§2 Phase 1: Domain Data Model):
- The DDL migration file `mobile/src/database/migrations/001_initial_schema.sql` defines 4 tables: `contacts`, `messages`, `chronemics_reports`, and `dossiers`.
- In the initial iteration, millisecond epoch timestamps were declared as `INTEGER NOT NULL`.
- Current Unix epoch in milliseconds is $\approx 1,793,777,000,000$ ($1.79 \times 10^{12}$).
- In PostgreSQL (Supabase Phase 2), `INTEGER` (or `INT`, `INT4`) is strictly a 4-byte signed integer with maximum value $2,147,483,647$ ($2.14 \times 10^9$).
- Empirical verification of overflow factor:
  ```python
  current_ms = 1793777035459
  pg_int_max = 2147483647
  assert current_ms > pg_int_max
  print(f"Overflow factor: {current_ms / pg_int_max:.1f}x")
  # Output: Overflow factor: 835.3x
  ```
- Attempting to insert current millisecond timestamps into a PostgreSQL `INTEGER` column produces a fatal error: `ERROR: value "1793777035459" is out of range for type integer`.
- In SQLite 3 (§3.1 Column Affinity Rules), rule 1 specifies: "If the declared type contains the string 'INT' then it is assigned INTEGER affinity." When declared as `BIGINT`, SQLite assigns `INTEGER` affinity and dynamically stores values using up to 8 bytes (signed up to $2^{63}-1 \approx 9.22 \times 10^{18}$).
- Python empirical verification of SQLite 3 `BIGINT` execution:
  ```python
  import sqlite3, time
  conn = sqlite3.connect(':memory:')
  cur = conn.cursor()
  cur.execute('CREATE TABLE test (id TEXT PRIMARY KEY, ts BIGINT NOT NULL)')
  ms = int(time.time() * 1000)
  cur.execute('INSERT INTO test VALUES (?, ?)', ('1', ms))
  cur.execute('SELECT ts, typeof(ts) FROM test')
  row = cur.fetchone()
  assert row[0] == ms
  assert row[1] == 'integer'
  ```
  Result: Succeeded with exit code 0 (`typeof(ts) == 'integer'`).
- In `docs/templates/sdd/examples/plan.md` lines 78–138, the DDL schema specifies:
  - `contacts.created_at` (line 86)
  - `contacts.updated_at` (line 87)
  - `messages.timestamp` (line 95)
  - `chronemics_reports.computed_at` (line 120)
  - `dossiers.unboxed_at` (line 135)
  These 5 columns represent Unix epoch in milliseconds.

### 1.2 Database Provider Store Coupling in Tasks
In `docs/templates/sdd/examples/tasks.md`:
- Line 41:
  ```markdown
  - [ ] T005 [P] Define `BaseDatabaseProvider` abstract contract and data transfer objects in `mobile/src/database/BaseDatabaseProvider.ts`
  ```
- Line 42:
  ```markdown
  - [ ] T006 Implement `SQLiteDatabaseProvider` with WAL mode and 5000ms busy timeout handling in `mobile/src/database/SQLiteDatabaseProvider.ts`
  ```
- Line 66 (User Story 1):
  ```markdown
  - [ ] T015 [US1] Implement ingestion state machine and active participant resolution state in `mobile/src/stores/chatStore.ts` (depends on T013, T006)
  ```
- Line 87 (User Story 2):
  ```markdown
  - [ ] T023 [US2] Integrate chronemics generation and persistence into vault storage store in `mobile/src/stores/vaultStore.ts` (depends on T021, T006)
  ```
- Line 119 (Polish Phase 6):
  ```markdown
  - [ ] T033 Implement 1-tap exhaustive hard wipe purging SQLite tables, `FileSystem.cacheDirectory`, and MMKV keys in `mobile/src/app/(tabs)/settings.tsx`
  ```
- `docs/templates/sdd/examples/constitution.md` Article I (lines 30–39) states verbatim:
  > "System business logic, telemetry engines, and API route controllers **MUST** access persisted data exclusively through the abstract `BaseDatabaseProvider` interface contract. Application code and route handlers **MUST NOT** execute direct SQL statements, bind raw database handles, or couple domain logic to engine-specific SQL dialects. The storage layer **MUST** be implemented as interchangeable provider adapters... Contributing engineers and autonomous agents **MUST NOT** apply localized screen-level workarounds or band-aids when a foundational model or provider contract requires refactoring."
- In `tasks.md`, `T015` and `T023` directly declare dependencies on `T006` (`SQLiteDatabaseProvider.ts`) rather than `T005` (`BaseDatabaseProvider.ts`). Furthermore, `tasks.md` lacks an explicit dependency-injection / provider-registry task linking the composition root to `SQLiteDatabaseProvider`, while leaving domain stores decoupled.

---

## 2. Logic Chain

1. **Step 1: Universal Database Contract Requires Cross-Engine Schema Parity**  
   From Observation 1.1: Constitution Article I mandates that SQLite (MVP local storage) and PostgreSQL / Supabase (Phase 2 cloud storage) share the same underlying schema migrations without requiring structural refactoring of domain models or DDL schemas.
2. **Step 2: 32-Bit Integer Overflow Breaks Cloud Migration**  
   From Observation 1.1: Millisecond timestamps ($\approx 1.79 \times 10^{12}$) exceed PostgreSQL 32-bit `INTEGER` maximum ($2.14 \times 10^9$) by 835x. Any database migration declaring `timestamp INTEGER NOT NULL` will execute successfully in SQLite (which automatically widens values under dynamic typing), but will fail catastrophically on PostgreSQL with `integer out of range`. Declaring all millisecond timestamps as `BIGINT NOT NULL` solves this across both databases simultaneously: PostgreSQL allocates an 8-byte signed integer, while SQLite assigns `INTEGER` affinity and serializes as an 8-byte integer.
3. **Step 3: Concrete Store Coupling Violates Dependency Inversion**  
   From Observation 1.2: `chatStore.ts` (T015) and `vaultStore.ts` (T023) depend directly on `T006` (`SQLiteDatabaseProvider.ts`). If an engineer or agent writes `import { SQLiteDatabaseProvider } from '@/database/SQLiteDatabaseProvider'` inside `chatStore.ts`, swapping the provider to `SupabaseDatabaseProvider` in Phase 2 requires modifying UI store code, violating Article I.
4. **Step 4: Clean Architecture Solution (Provider Registry / Inversion of Control)**  
   To decouple stores from concrete engines:
   - `BaseDatabaseProvider.ts` (T005) must expose a typed provider registry (`registerDatabaseProvider(provider: BaseDatabaseProvider)` and `getDatabaseProvider(): BaseDatabaseProvider`).
   - `chatStore.ts` (T015) and `vaultStore.ts` (T023) must depend only on `T005` (`BaseDatabaseProvider.ts`) and consume `getDatabaseProvider()`.
   - The concrete provider `SQLiteDatabaseProvider.ts` (T006) is instantiated and registered ONLY at the application composition root (`T016`, e.g. `mobile/src/app/(tabs)/index.tsx` or `_layout.tsx`).
   - Settings hard wipe (T033) calls `getDatabaseProvider().wipeAllData()`, removing direct references to SQLite.

---

## 3. Caveats

1. **Scope Boundaries**: This report specifically resolves DDL timestamp definitions in `plan.md` and database provider dependency decoupling in `tasks.md`. Other defects identified by `challenger_m2_2` (Anti-Slop 20 tells in `constitution.md`, missing UI primitive tasks, and chronemics edge cases) are handled by peer agents `explorer_m2_it2_2` and `explorer_m2_it2_3`.
2. **JavaScript Number Precision**: In JavaScript/TypeScript, the IEEE-754 double precision float safely represents integers up to `Number.MAX_SAFE_INTEGER` = $9,007,199,254,740,991$ ($9 \times 10^{15}$). Since current epoch in milliseconds is $\approx 1.79 \times 10^{12}$, TypeScript DTO properties (`timestamp: number`) remain typed as `number` with zero precision loss. The `BIGINT` constraint applies to the SQL DDL layer.
3. **Sequence Index**: `sequence_index INTEGER NOT NULL` is an in-chat message counter (typically 0 to 100,000) and does not represent a timestamp. It safely remains `INTEGER` in both SQLite and PostgreSQL.

---

## 4. Conclusion & Exact Remediation Strategy for Worker

The Worker MUST apply the following exact modifications to `docs/templates/sdd/examples/plan.md` and `docs/templates/sdd/examples/tasks.md`.

### Remediation A: `docs/templates/sdd/examples/plan.md`

#### A.1 DDL Schema (`mobile/src/database/migrations/001_initial_schema.sql`)
Verify and ensure lines 78–138 explicitly use `BIGINT NOT NULL` for all 5 millisecond epoch timestamp columns across all tables:

```sql
-- Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY NOT NULL, -- SHA-256(sorted([participant_a, participant_b]))
  participant_a TEXT NOT NULL,
  participant_b TEXT NOT NULL,
  user_handle TEXT NOT NULL,
  partner_handle TEXT NOT NULL,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY NOT NULL, -- SHA-256(contact_id + ts_iso + seq_idx + sender + cleaned_text)
  contact_id TEXT NOT NULL,
  sequence_index INTEGER NOT NULL,
  timestamp BIGINT NOT NULL, -- Unix epoch in milliseconds (BIGINT prevents 32-bit integer overflow in PostgreSQL)
  sender_handle TEXT NOT NULL,
  sender_role TEXT NOT NULL CHECK(sender_role IN ('USER', 'PARTNER')),
  raw_body TEXT NOT NULL,
  cleaned_body TEXT NOT NULL,
  has_media INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_messages_contact_ts ON messages(contact_id, timestamp ASC);

-- Chronemics Telemetry Table
CREATE TABLE IF NOT EXISTS chronemics_reports (
  id TEXT PRIMARY KEY NOT NULL,
  contact_id TEXT NOT NULL UNIQUE,
  total_messages INTEGER NOT NULL,
  user_messages INTEGER NOT NULL,
  partner_messages INTEGER NOT NULL,
  user_initiated_ratio REAL NOT NULL,
  partner_initiated_ratio REAL NOT NULL,
  user_median_response_sec REAL NOT NULL,
  partner_median_response_sec REAL NOT NULL,
  user_chasing_double_texts INTEGER NOT NULL,
  partner_chasing_double_texts INTEGER NOT NULL,
  late_night_volume_ratio REAL NOT NULL,
  computed_at BIGINT NOT NULL,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);

-- Forensic Dossiers Table
CREATE TABLE IF NOT EXISTS dossiers (
  id TEXT PRIMARY KEY NOT NULL,
  contact_id TEXT NOT NULL UNIQUE,
  delulu_score INTEGER NOT NULL CHECK(delulu_score BETWEEN 0 AND 100),
  circus_tier TEXT NOT NULL CHECK(circus_tier IN ('GROUND_REALITY', 'CIRCUS_APPRENTICE', 'HEAD_CLOWN')),
  act1_json TEXT NOT NULL,
  act2_json TEXT NOT NULL,
  act3_json TEXT NOT NULL,
  act4_json TEXT NOT NULL,
  act5_json TEXT NOT NULL,
  unboxed_at BIGINT NOT NULL,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);
```

#### A.2 Constitution Check Evidence Reinforcement (lines 38–39)
**Target Line 39**:
```markdown
- [x] **Article I: Architectural Integrity & Universal Database Provider**  
  - *Evidence*: Domain services access storage exclusively via abstract `BaseDatabaseProvider`. Concrete `SQLiteDatabaseProvider` implements local SQLite in WAL mode with a 5000ms busy timeout. All DDL millisecond timestamps are declared `BIGINT` to prevent 32-bit PostgreSQL overflow in Phase 2 while preserving SQLite integer affinity. Zero raw SQL queries exist in UI route components or stores.
```

#### A.3 BaseDatabaseProvider Contract & Registry (lines 214–233)
Append the typed provider registry functions to the `BaseDatabaseProvider.ts` contract block in Section 3:
```typescript
export abstract class BaseDatabaseProvider {
  abstract initialize(): Promise<void>;
  abstract close(): Promise<void>;
  abstract wipeAllData(): Promise<void>;

  abstract saveContact(contact: ContactDTO): Promise<void>;
  abstract getContact(contactId: string): Promise<ContactDTO | null>;
  abstract deleteContact(contactId: string): Promise<void>;

  abstract insertMessages(messages: MessageDTO[]): Promise<number>; // returns count inserted
  abstract getMessagesByContact(contactId: string, limit?: number, offset?: number): Promise<MessageDTO[]>;
  abstract getMessageCount(contactId: string): Promise<number>;

  abstract saveChronemics(report: ChronemicsReportDTO): Promise<void>;
  abstract getChronemics(contactId: string): Promise<ChronemicsReportDTO | null>;

  abstract saveDossier(dossier: DossierDTO): Promise<void>;
  abstract getDossier(contactId: string): Promise<DossierDTO | null>;
}

// Universal Provider Registry & Injection Accessor
let currentDatabaseProvider: BaseDatabaseProvider | null = null;

export function registerDatabaseProvider(provider: BaseDatabaseProvider): void {
  currentDatabaseProvider = provider;
}

export function getDatabaseProvider(): BaseDatabaseProvider {
  if (!currentDatabaseProvider) {
    throw new Error('DatabaseProvider has not been registered. Call registerDatabaseProvider() during app bootstrap.');
  }
  return currentDatabaseProvider;
}
```

---

### Remediation B: `docs/templates/sdd/examples/tasks.md`

#### B.1 Task T004 (line 40)
**Before**:
```markdown
- [ ] T004 Author initial database DDL schema migration defining contacts, messages, chronemics, and dossiers tables in `mobile/src/database/migrations/001_initial_schema.sql`
```
**After**:
```markdown
- [ ] T004 Author initial database DDL schema migration defining contacts, messages, chronemics, and dossiers tables with `BIGINT` millisecond epoch timestamps (preventing 32-bit PostgreSQL overflow in Phase 2) in `mobile/src/database/migrations/001_initial_schema.sql`
```

#### B.2 Task T005 (line 41)
**Before**:
```markdown
- [ ] T005 [P] Define `BaseDatabaseProvider` abstract contract and data transfer objects in `mobile/src/database/BaseDatabaseProvider.ts`
```
**After**:
```markdown
- [ ] T005 [P] Define `BaseDatabaseProvider` abstract contract, DTOs, and provider registry functions (`registerDatabaseProvider`, `getDatabaseProvider`) in `mobile/src/database/BaseDatabaseProvider.ts`
```

#### B.3 Task T006 (line 42)
**Before**:
```markdown
- [ ] T006 Implement `SQLiteDatabaseProvider` with WAL mode and 5000ms busy timeout handling in `mobile/src/database/SQLiteDatabaseProvider.ts`
```
**After**:
```markdown
- [ ] T006 Implement `SQLiteDatabaseProvider` conforming to `BaseDatabaseProvider` with WAL mode and 5000ms busy timeout handling in `mobile/src/database/SQLiteDatabaseProvider.ts` (depends on T004, T005)
```

#### B.4 Task T015 (line 66) — Decouple chatStore from T006
**Before**:
```markdown
- [ ] T015 [US1] Implement ingestion state machine and active participant resolution state in `mobile/src/stores/chatStore.ts` (depends on T013, T006)
```
**After**:
```markdown
- [ ] T015 [US1] Implement ingestion state machine and active participant resolution state in `mobile/src/stores/chatStore.ts` consuming abstract `BaseDatabaseProvider` via `getDatabaseProvider()` (depends on T013, T005)
```

#### B.5 Task T016 (line 67) — Register Concrete Provider at Composition Root
**Before**:
```markdown
- [ ] T016 [US1] Wire file picker dropzone and participant modal into home screen route in `mobile/src/app/(tabs)/index.tsx` (depends on T014, T015)
```
**After**:
```markdown
- [ ] T016 [US1] Initialize `SQLiteDatabaseProvider`, register into `BaseDatabaseProvider` registry, and wire file picker dropzone and participant modal into home screen route in `mobile/src/app/(tabs)/index.tsx` (depends on T006, T014, T015)
```

#### B.6 Task T023 (line 87) — Decouple vaultStore from T006
**Before**:
```markdown
- [ ] T023 [US2] Integrate chronemics generation and persistence into vault storage store in `mobile/src/stores/vaultStore.ts` (depends on T021, T006)
```
**After**:
```markdown
- [ ] T023 [US2] Integrate chronemics generation and persistence into vault storage store in `mobile/src/stores/vaultStore.ts` consuming abstract `BaseDatabaseProvider` via `getDatabaseProvider()` (depends on T021, T005)
```

#### B.7 Task T033 (line 119) — Decouple Hard Wipe from Direct SQLite Coupling
**Before**:
```markdown
- [ ] T033 Implement 1-tap exhaustive hard wipe purging SQLite tables, `FileSystem.cacheDirectory`, and MMKV keys in `mobile/src/app/(tabs)/settings.tsx`
```
**After**:
```markdown
- [ ] T033 Implement 1-tap exhaustive hard wipe purging persisted tables via `BaseDatabaseProvider.wipeAllData()`, `FileSystem.cacheDirectory`, and MMKV keys in `mobile/src/app/(tabs)/settings.tsx` (depends on T005, T008)
```

---

## 5. Verification Method

To independently verify the recommendations and their implementation:

1. **Verify DDL Timestamp Column Types in `plan.md`**:
   ```bash
   python -c "
   with open('docs/templates/sdd/examples/plan.md', 'r', encoding='utf-8') as f:
       content = f.read()
   expected = [
       'created_at BIGINT NOT NULL',
       'updated_at BIGINT NOT NULL',
       'timestamp BIGINT NOT NULL',
       'computed_at BIGINT NOT NULL',
       'unboxed_at BIGINT NOT NULL'
   ]
   for col in expected:
       assert col in content, f'Missing expected BIGINT column definition: {col}'
   assert 'timestamp INTEGER NOT NULL' not in content, 'Found invalid 32-bit timestamp INTEGER'
   print('VERIFICATION SUCCESS: All 5 timestamp columns in plan.md are strictly BIGINT.')
   "
   ```

2. **Verify SQLite 64-Bit Compatibility with BIGINT**:
   ```bash
   python -c "
   import sqlite3, time
   conn = sqlite3.connect(':memory:')
   cur = conn.cursor()
   cur.execute('''
     CREATE TABLE test_messages (
       id TEXT PRIMARY KEY,
       timestamp BIGINT NOT NULL
     )
   ''')
   now_ms = int(time.time() * 1000)
   cur.execute('INSERT INTO test_messages VALUES (?, ?)', ('msg_1', now_ms))
   cur.execute('SELECT timestamp, typeof(timestamp) FROM test_messages WHERE id = ?', ('msg_1',))
   val, col_type = cur.fetchone()
   assert val == now_ms
   assert col_type == 'integer'
   print(f'VERIFICATION SUCCESS: SQLite stores {val} ({col_type}) with 64-bit precision.')
   "
   ```

3. **Verify Store Decoupling in `tasks.md`**:
   ```bash
   python -c "
   with open('docs/templates/sdd/examples/tasks.md', 'r', encoding='utf-8') as f:
       content = f.read()
   # T015 and T023 must depend on T005, NOT T006
   for line in content.splitlines():
       if 'T015' in line and 'chatStore.ts' in line:
           assert 'T005' in line, f'T015 must depend on T005: {line}'
           assert 'T006' not in line, f'T015 must NOT depend on T006: {line}'
       if 'T023' in line and 'vaultStore.ts' in line:
           assert 'T005' in line, f'T023 must depend on T005: {line}'
           assert 'T006' not in line, f'T023 must NOT depend on T006: {line}'
   print('VERIFICATION SUCCESS: Stores in tasks.md are strictly decoupled from concrete SQLite provider.')
   "
   ```

4. **Invalidation Conditions**:
   - If `tasks.md` retains `(depends on ..., T006)` for `chatStore.ts` or `vaultStore.ts`.
   - If any DDL column storing millisecond epoch timestamps is declared as 32-bit `INTEGER`.
