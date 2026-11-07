# Implementation Plan: Offline WhatsApp Chat Import & 1-on-1 Forensics

**Branch**: `002-offline-whatsapp-forensics` | **Date**: 2026-11-04 | **Spec**: `docs/templates/sdd/examples/spec.md`  
**Input**: Feature specification from `docs/templates/sdd/examples/spec.md`  

---

## Summary

This plan implements the complete offline WhatsApp chat ingestion, identity resolution, deterministic 0-LLM chronemics computation, 5-Act unboxing presentation, and 9:16 story card export pipeline for Assify v2.0. The architecture is engineered around the **Component-First Law**, **Universal Database Provider Abstraction**, **Zero-Trust Client PII Scrubbing**, and the **100% Light Apple HIG Design System**. All parsing and timing math execute locally on device with zero cloud telemetry dependencies for the MVP.

---

## Technical Context

| Dimension | Specification & Version | Architectural Role & Rationale |
| :--- | :--- | :--- |
| **Runtime Environment** | Expo SDK 54 LTS (React Native 0.76+, React 18.3) | Production stability baseline; avoids canary SDK 58 instability. |
| **JavaScript Engine** | Hermes | Fast startup time, bytecode precompilation, low memory consumption. |
| **Language & Typing** | TypeScript 5.4+ (Strict Mode) | Full type safety; zero `any` types permitted. |
| **State Management** | Zustand v5 + React Native MMKV v3+ | Ultra-fast synchronous key-value caching and reactive non-blocking UI stores. |
| **Database Engine** | Expo SQLite (`expo-sqlite/next`) in WAL Mode | Write-Ahead Logging (WAL) with busy timeout (`5000ms`); zero cloud lock-in. |
| **View Capture** | `react-native-view-shot` | High-resolution 1080x1920 offscreen PNG capture for social exports. |
| **Social Sharing** | `expo-sharing` | Invokes native iOS / Android OS Share Sheets. |
| **Biometrics** | `expo-local-authentication` | FaceID, TouchID, Android BiometricPrompt, and Device PIN fallback. |
| **Testing Toolchain** | Jest 29+ & React Native Testing Library (RNTL) | TDD Red-Green-Refactor test runners for domain units and UI components. |
| **Target Platforms** | iOS 16.0+ & Android API 33+ (Android 13+) | Modern mobile OS baseline supporting native intent receivers. |
| **Project Type** | Mobile Application (Expo Bare Workflow with Native Plugins) | Native intent filters for direct WhatsApp Share Sheet receiver. |
| **Performance Goals** | Ingest 50k messages < 1.2s; 60 FPS spring animations; 0s zero-delta open | Sub-second turnaround to sustain the 10-second viral dopamine loop. |
| **Design Standard** | 100% Light Apple HIG (`#FFFFFF` canvas, `#F5F5F7` grouped background) | Eliminates theme schizophrenia and white-on-white visual regressions. |

---

## Constitution Check

*GATE: Verified prior to implementation. Must remain 100% compliant across all deliverables.*

- [x] **Article I: Architectural Integrity & Universal Database Provider**  
  - *Evidence*: Domain services access storage exclusively via abstract `BaseDatabaseProvider`. Concrete `SQLiteDatabaseProvider` implements local SQLite in WAL mode with a 5000ms busy timeout. All DDL millisecond timestamps are declared `BIGINT` to prevent 32-bit PostgreSQL overflow in Phase 2 while preserving SQLite integer affinity. Zero raw SQL queries exist in UI route components or stores.
- [x] **Article II: The Component-First Law (Zero Screen-Level Container Drift)**  
  - *Evidence*: All UI layout containers, stat rows, and cards are centralized in `mobile/src/components/ui/` (`StatStrip`, `SegmentedControl`, `EditorialSection`, `ReceiptQuote`, `DeluluGauge`). Screen routes under `mobile/src/app/(tabs)/*` import centralized primitives; zero local container styling blocks.
- [x] **Article III: Anti-Slop Enforcement (The 20 Named Tells Elimination)**  
  - *Evidence*: Layout eliminates nested cards; rows are organized via `#F5F5F7` grouped background and 0.5px hairlines. Bottom views enforce dynamic safe area padding with `useSafeAreaInsets()`. Zero wireframe 1px borders, zero fake `setTimeout` mocks, and dark status bar styling enforced globally.
- [x] **Article IV: Design Token Locks (100% Light Apple HIG Edition)**  
  - *Evidence*: Color palette locked to canonical tokens: `#FFFFFF` pure white canvas, `#F5F5F7` secondary background, `#BF9B28` deluluGold accent, `#000000`/`#1D1D1F` text. Zero dark mode palettes ("Deep Obsidian" and "Midnight Plum" strictly excluded).
- [x] **Article V: Test-Driven Development (TDD) & Evidence Before Completion**  
  - *Evidence*: Test suites `test_chat_parser.test.ts` and `test_chronemics.test.ts` are scheduled in Phase 3 prior to functional code implementation. 100% branch test coverage required for chronemics math.
- [x] **Article VI: Biometric Sanctuary & Zero-Trust PII Sanitization**  
  - *Evidence*: Deterministic SHA-256 message hashing incorporates `sequence_index` to prevent same-minute collisions. Regex sanitizer replaces phone numbers, emails, and names with privacy tokens before any external transmission. Presentation layer rehydrates tokens to display names client-side. Settings view provides 1-tap hard wipe.

---

## Phased Design Deliverables

### 1. Phase 0: Research & Unknowns (`research.md`)

#### Decision 1: Streaming Line Lexer vs. In-Memory AST Parser
- **Decision**: Author a line-by-line regex streaming lexer with stateful multiline buffering.
- **Rationale**: WhatsApp text exports are sequential and line-oriented. A streaming regex lexer processes 50,000 lines in <850ms on mobile Hermes without allocating high-overhead AST nodes, keeping heap allocation under 18MB.
- **Alternatives Considered**: Full PEG/ANTLR parser grammar rejected due to 8x slower parse time on mobile JavaScript engines and unnecessary parser bundle overhead.

#### Decision 2: SQLite WAL Mode Configuration
- **Decision**: Configure `PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000; PRAGMA synchronous = NORMAL;`.
- **Rationale**: WAL mode allows concurrent read operations while background message persistence is executing, eliminating `SQLITE_BUSY` contention during large chat imports.
- **Alternatives Considered**: Default DELETE journal mode rejected because write locks freeze UI read queries during 10k+ message batch insertions.

#### Decision 3: View Capture Architecture
- **Decision**: Use `react-native-view-shot` with offscreen mounted view wrappers rendering at fixed 1080x1920 pixel resolution.
- **Rationale**: Capturing an offscreen 9:16 layout guarantees pixel-perfect Instagram/Snapchat export dimensions regardless of the host device's physical aspect ratio or screen density.
- **Alternatives Considered**: Server-side Puppeteer/Playwright rendering rejected to maintain 100% offline functionality and zero hosting infrastructure cost for social card generation.

---

### 2. Phase 1: Domain Data Model (`data-model.md`)

#### SQLite DDL Schema (`mobile/src/database/migrations/001_initial_schema.sql`):

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

#### Entity Lifecycle State Machine:
```text
[Raw File Selected] ──▶ PARSING ──▶ [Participant Boundary Check: N=2 & Volume >= 30]
                               │
                               ├── FAIL ──▶ ERROR_HALTED (HIG Alert)
                               └── PASS ──▶ AWAITING_IDENTITY_RESOLUTION
                                                  │
                                                  ▼ (User Taps Pill)
                                            COMPUTING_CHRONEMICS (0-LLM)
                                                  │
                                                  ▼
                                            READY_FOR_UNBOXING (Acts 1-5)
                                                  │
                                                  ▼
                                            UNBOXED_AND_VAULTED (Delta-Ready)
```

---

### 3. Phase 1: Interface Contracts (`contracts/`)

#### 1. Universal Database Provider (`mobile/src/database/BaseDatabaseProvider.ts`)
```typescript
export interface ContactDTO {
  id: string;
  participantA: string;
  participantB: string;
  userHandle: string;
  partnerHandle: string;
  createdAt: number;
  updatedAt: number;
}

export interface MessageDTO {
  id: string;
  contactId: string;
  sequenceIndex: number;
  timestamp: number;
  senderHandle: string;
  senderRole: 'USER' | 'PARTNER';
  rawBody: string;
  cleanedBody: string;
  hasMedia: boolean;
}

export interface ChronemicsReportDTO {
  id: string;
  contactId: string;
  totalMessages: number;
  userMessages: number;
  partnerMessages: number;
  userInitiatedRatio: number;
  partnerInitiatedRatio: number;
  userMedianResponseSec: number;
  partnerMedianResponseSec: number;
  userChasingDoubleTexts: number;
  partnerChasingDoubleTexts: number;
  lateNightVolumeRatio: number;
  computedAt: number;
}

export interface DossierDTO {
  id: string;
  contactId: string;
  deluluScore: number;
  circusTier: 'GROUND_REALITY' | 'CIRCUS_APPRENTICE' | 'HEAD_CLOWN';
  act1Json: string;
  act2Json: string;
  act3Json: string;
  act4Json: string;
  act5Json: string;
  unboxedAt: number;
}

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

#### 2. Chat Parser Interface (`mobile/src/services/parser/types.ts`)
```typescript
export interface ParsedRawLine {
  sequenceIndex: number;
  timestampMs: number;
  senderHandle: string;
  messageText: string;
  isSystemNotice: boolean;
  hasMedia: boolean;
}

export interface ParseResult {
  contactId: string;
  participants: [string, string];
  validMessages: ParsedRawLine[];
  filteredNoticeCount: number;
  isGroupChat: boolean;
  isSelfChat: boolean;
  hasMinimumVolume: boolean;
}

export interface IChatParser {
  parseTextStream(rawContent: string): ParseResult;
  parseZipArchive(zipBuffer: ArrayBuffer): Promise<ParseResult>;
}
```

#### 3. Chronemics Engine Interface (`mobile/src/services/chronemics/types.ts`)
```typescript
export interface TurnCluster {
  senderRole: 'USER' | 'PARTNER';
  startTimestamp: number;
  endTimestamp: number;
  messageCount: number;
}

export interface IChronemicsEngine {
  clusterTurns(messages: MessageDTO[], windowSeconds?: number): TurnCluster[];
  computeSilenceSeams(turns: TurnCluster[], seamHours?: number): number[];
  computeMedianLatency(turns: TurnCluster[], role: 'USER' | 'PARTNER'): number;
  countChasingDoubleTexts(turns: TurnCluster[], role: 'USER' | 'PARTNER'): number;
  computeLateNightRatio(messages: MessageDTO[]): number;
  generateReport(contactId: string, messages: MessageDTO[]): ChronemicsReportDTO;
}
```

---

### 4. Phase 1: Validation Runbook (`quickstart.md`)

```bash
# 1. Typecheck and lint validation
npm run typecheck
npm run lint

# 2. Run unit tests for parser and chronemics
npx jest mobile/tests/unit/test_chat_parser.test.ts --verbose
npx jest mobile/tests/unit/test_chronemics.test.ts --verbose

# 3. Run component tests for centralized primitives and unboxing
npx jest mobile/tests/components/ui/test_delulu_gauge.test.ts
npx jest mobile/tests/components/ui/test_stat_strip.test.ts

# 4. Run end-to-end SQLite integration test
npx jest mobile/tests/integration/test_sqlite_provider.test.ts
```

---

## Project Structure

```text
mobile/
├── src/
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── index.tsx                 # Home canvas & dropzone screen
│   │   │   ├── vault.tsx                 # Saved contacts & past dossiers screen
│   │   │   └── settings.tsx              # Biometric lock & 1-tap hard wipe screen
│   │   └── dossier/
│   │       ├── unboxing.tsx              # 5-Act paged theatrical reveal screen
│   │       └── report.tsx                # Full unlocked dossier & story share screen
│   ├── components/
│   │   └── ui/
│   │       ├── StatStrip.tsx             # Metric row with hairlines & semantic colors
│   │       ├── SegmentedControl.tsx      # Tactile Apple pill switcher with spring
│   │       ├── EditorialSection.tsx      # Grouped header, subtitle & inset container
│   │       ├── ReceiptQuote.tsx          # Verifiable quote bubble with sender badge
│   │       ├── DeluluGauge.tsx           # Reanimated physics needle & circus badge
│   │       └── ParticipantModal.tsx      # 1-Tap "Which one are you?" modal
│   ├── database/
│   │   ├── BaseDatabaseProvider.ts       # Universal abstract database provider
│   │   ├── SQLiteDatabaseProvider.ts     # Expo SQLite WAL implementation
│   │   └── migrations/
│   │       └── 001_initial_schema.sql    # DDL schema for tables & indexes
│   ├── services/
│   │   ├── parser/
│   │   │   ├── ChatParser.ts             # Multi-format WhatsApp regex lexer
│   │   │   ├── HashUtils.ts              # Deterministic SHA-256 message & contact hash
│   │   │   └── types.ts                  # Parser contracts & DTOs
│   │   ├── chronemics/
│   │   │   ├── ChronemicsEngine.ts       # 0-LLM turn clustering & sleep clamping
│   │   │   └── types.ts                  # Timing contracts & turn structures
│   │   ├── sanitizer/
│   │   │   ├── PiiSanitizer.ts           # Pre-flight regex PII masking engine
│   │   │   └── QuoteRehydrator.ts        # Client-side quote token replacement
│   │   └── share/
│   │       └── StoryExporter.ts          # Offscreen 9:16 view capture to OS Share
│   ├── stores/
│   │   ├── chatStore.ts                  # Active ingestion & participant state
│   │   ├── vaultStore.ts                 # Local dossier cache & history
│   │   └── settingsStore.ts              # MMKV biometric and wipe preferences
│   └── theme/
│       └── tokens.ts                     # Light Apple HIG tokens & spacing scale
└── tests/
    ├── unit/
    │   ├── test_chat_parser.test.ts      # Multi-format timestamp & boundary tests
    │   ├── test_chronemics.test.ts       # 90s clustering, seams & sleep clamp tests
    │   ├── test_pii_sanitizer.test.ts    # Phone, email, UPI & name masking tests
    │   └── test_hash_utils.test.ts       # Collision-free SHA-256 sequence tests
    ├── components/
    │   └── ui/
    │       ├── test_delulu_gauge.test.ts # Reanimated needle angle & tier badge tests
    │       └── test_stat_strip.test.ts   # Hairline divider & text contrast tests
    └── integration/
        └── test_sqlite_provider.test.ts  # WAL concurrency & cascade deletion tests
```

---

## Complexity Tracking

| Constitutional Clause | Proposed Exception | Technical Necessity | Simpler Alternative Rejected Because |
| :--- | :--- | :--- | :--- |
| **None** | *No constitutional exceptions requested.* | Full adherence to Articles I through VI achieved. | All requirements cleanly implemented using standard SQLite WAL provider, centralized UI primitives, and Light Apple HIG tokens. |

---

## AI Coding Agent Directives for Architectural Planning

```markdown
1. CONSTITUTION CHECK GATE: All 6 Articles MUST remain verified and green.
2. UNIVERSAL DATABASE PROVIDER: Domain logic MUST NOT query SQLite directly. All storage
   access routes through BaseDatabaseProvider.
3. COMPONENT-FIRST DISCIPLINE: Screens in `app/(tabs)/*` MUST NOT author bespoke card styling.
   All cards, strips, and gauges are imported from `mobile/src/components/ui/`.
4. CONCRETE FILE PATHS ONLY: Every module and test MUST be mapped to an exact, non-placeholder
   path in the repository structure.
```
