# 🏛️ ASSIFY MASTER BLUEPRINT (v2.0)
## Clean-Slate Architectural Specification & Domain IP Preservation Manual

> **Document Classification:** Master Engineering Blueprint & Rebuild Specification  
> **Target Version:** ASSIFY v2.0 (Clean-Slate Rebuild)  
> **Status:** APPROVED & LOCKED  
> **Lead Architect / Founder Decisions:**  
> • **Core Viral Loop First:** 10-Second Ingest $\rightarrow$ Chronemics $\rightarrow$ Delulu Score + 5-Act Theatrical Unboxing + 9:16 Story Cards.  
> • **Extensibility-First Architecture:** Clean modular extension points for Phase 2 (The Keep, Doctor Delulu Coach, Ghost Writer, Fever Timeline) without refactoring core code.  
> • **Universal Database Provider Abstraction:** Abstract provider interface decoupling domain logic from the underlying engine (SQLite WAL local $\leftrightarrow$ Supabase PostgreSQL cloud).  
> • **Native OS Share Target:** Direct WhatsApp export receiver via Android Intent Filters.  
> • **Mobile Runtime:** Downgrade to production-stable **Expo SDK 54 LTS** (React Native 0.76+).  
> • **Design Standard:** 100% Light Apple Design System (`#FFFFFF` canvas, zero dark-mode leftovers, zero white-on-white text bugs).  
> • **State & Persistence:** Zustand + MMKV for high-performance, non-blocking local state.

---

## 📑 Master Table of Contents
1. [Core Product Vision & Verified Identity](#1-core-product-vision--verified-identity)
2. [Competitor Benchmark: Delulu Check Production Teardown](#2-competitor-benchmark-delulu-check-production-teardown)
3. [True Forensic State of the v1 Codebase](#3-true-forensic-state-of-the-v1-codebase)
4. [Salvaged Domain IP (Mathematics, Algorithms & Schemas)](#4-salvaged-domain-ip-mathematics-algorithms--schemas)
5. ["Never Repeat" Engineering & Security Invariants](#5-never-repeat-engineering--security-invariants)
6. [Clean-Slate v2.0 Vertical-Slice Roadmap](#6-clean-slate-v20-vertical-slice-roadmap)

---

# 1. Core Product Vision & Verified Identity

### 1.1 Target Persona & Psychological Wedge
- **Target User:** Gen Z & Millennials (18–32) navigating modern dating, "talking stages," situationships, asymmetric emotional investments, and ambiguous text messaging dynamics.
- **The Core Problem:** Text conversations are the primary medium of modern romantic intimacy, yet users experience high anxiety interpreting response latency, double-texts, short replies, and tone shifts. Users chronically consult friends for sanity checks (*"Am I crazy, or is she losing interest?"*).
- **The Assify Wedge:** Deliver an objective, brutal, and hilarious AI forensic analysis that gives users immediate psychological validation, an unvarnished diagnosis of who holds conversational power, and high-status, shareable "receipts" to flex on social media.

---

### 1.2 The 10-Second Viral Dopamine Loop
The entire architecture of Assify v2.0 is laser-focused on maximizing the speed and delight of the primary viral loop:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          THE 10-SECOND VIRAL DOPAMINE LOOP                             │
└────────────────────────────────────────────────────────────────────────────────────────┘
       │
       ▼ [1. Native Ingestion - 2 Seconds]
  User exports WhatsApp chat via OS Share Sheet ──▶ ASSIFY Native Android/iOS Target
       │
       ▼ [2. Telemetry & Sanitization - 1 Second]
  Deterministic Regex Parser + Zero-Trust PII Masking + 0-LLM Chronemics Math
       │
       ▼ [3. Fast Profiler Synthesis - 4 to 6 Seconds]
  Single-Pass OpenAI GPT-4o-mini call generating Master Dossier + 5 Theatrical Acts
       │
       ▼ [4. Theatrical Payoff - 3 Seconds]
  Fluid 60fps Unboxing: Scanner ──▶ Delulu Gauge (0-100%) ──▶ Savage Archetype
       │
       ▼ [5. Social Sharing & Acquisition - 1 Tap]
  1-Tap 9:16 Story Card generation (react-native-view-shot) ──▶ Instagram / Snapchat Stories
```

---

### 1.3 Confirmed Feature Matrix: P0 Core vs. Phase 2 Backlog

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        FEATURE ALLOCATION & EXTENSION MATRIX                           │
├────────────────────────────────────────────┬───────────────────────────────────────────┤
│ 🟢 P0 CORE (v2.0 MVP Vertical Slice)       │ ⚪ PHASE 2 BACKLOG (Clean Extension Points)│
├────────────────────────────────────────────┼───────────────────────────────────────────┤
│ • OS Native Share Target (WhatsApp Intent) │ • The Keep (8-Chamber Memory & Taste Vault│
│ • WhatsApp Multi-Format Parser (20 types)  │ • Date & Gift Oracle Recommendations      │
│ • Zero-Trust PII Sanitization Gate         │ • Doctor Delulu 24/7 AI Coach (Real SSE)  │
│ • 0-LLM Neuro-Symbolic Chronemics Engine   │ • Ghost Writer Reply Triad (Contextual)   │
│ • Universal Database Provider Interface    │ • Longitudinal Fever Timeline (Bezier)    │
│ • SQLite WAL Mode Provider Implementation  │ • Relationship Diary Chapter Generator    │
│ • Async Background Task Queue & Polling    │ • Supabase PostgreSQL Cloud Provider Sync │
│ • 5-Act Theatrical Unboxing Reveal         │ • iMessage & Telegram Chat Parsers        │
│ • High-Res 9:16 Story Card Exporter        │ • Audio Voice Note Ingestion (Whisper)    │
│ • Light Apple Design System Primitives     │ • In-App Purchases & Monetization Gate    │
└────────────────────────────────────────────┴───────────────────────────────────────────┘
```

---

### 1.4 Canonical Design System Tokens (Light Apple HIG Edition)

ASSIFY v2.0 eliminates theme schizophrenia by strictly committing to the **Light Apple HIG Design System**:

| Token Category | Token Name | Value / Specification | Role & Usage |
| :--- | :--- | :--- | :--- |
| **Canvases & Surfaces** | `background` | `#FFFFFF` | Pure white master canvas (Zero dark mode) |
| | `secondaryBackground` | `#F5F5F7` | Apple grouped table / section background |
| | `card` | `#FFFFFF` | Elevated interactive cards |
| | `modalBackground` | `#FAFAFC` | Bottom sheet & modal container |
| **Text Hierarchy** | `textPrimary` | `#000000` | Display titles and high-emphasis figures |
| | `textSecondary` | `#1D1D1F` | Primary body copy and descriptions |
| | `textTertiary` | `#86868B` | Metadata, timestamps, and sub-labels |
| | `textDisabled` | `#D2D2D7` | Deactivated controls |
| **Diagnostic Accents** | `deluluGold` | `#BF9B28` | Primary Assify signature champagne gold |
| | `deluluGoldMuted` | `#FBF7EA` | Gold badge and pill backgrounds |
| | `systemGreen` | `#34C759` | Low delusion / healthy balance (0–35%) |
| | `systemOrange` | `#FF9500` | Moderate delusion / friction (36–69%) |
| | `systemRed` | `#FF3B30` | Severe delusion / toxic red flag (70–100%) |
| **Hairlines & Borders** | `hairline` | `rgba(0, 0, 0, 0.08)` | Standard Apple 0.5px hairline divider |
| | `subtleBorder` | `rgba(0, 0, 0, 0.04)` | Ultra-soft component framing |
| **Spacing Scale** | `xs`, `sm`, `md`, `lg` | `4px`, `8px`, `12px`, `16px` | Micro-spacing & inner card padding |
| | `xl`, `xxl`, `hero` | `20px`, `24px`, `32px` | Screen margins & hero section offsets |
| **Corner Radius** | `sm`, `md`, `lg`, `xl`, `full`| `8px`, `12px`, `16px`, `20px`, `9999px` | Apple rounded corners & pill badges |
| **Elevation & Shadow** | `subtle` | `offset: (0, 1), opacity: 0.04, radius: 3` | Soft surface separation |
| | `card` | `offset: (0, 4), opacity: 0.06, radius: 12` | Interactive floating card lift |

---

# 2. Competitor Benchmark: Delulu Check Production Teardown

Based on the forensic reverse-engineering of Delulu Check (`com.dirtcube.deluluapp_2.1.1.xapk`, build 96) conducted on October 19, 2026:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                   DELULU CHECK BENCHMARK VS ASSIFY COMPARISON                          │
├─────────────────────┬─────────────────────────────────┬────────────────────────────────┤
│ Dimension           │ Delulu Check (Production APK)   │ Assify v1 Defect ➔ v2 Solution │
├─────────────────────┼─────────────────────────────────┼────────────────────────────────┤
│ Ingestion Flow      │ Native OS Share Sheet receiver  │ v1: In-app picker only.        │
│                     │ via Android Intent Filter.      │ v2: Android Intent + Picker.   │
├─────────────────────┼─────────────────────────────────┼────────────────────────────────┤
│ End-to-End Latency  │ 5 to 8 seconds.                 │ v1: 45s (4 sequential passes). │
│                     │ 0-LLM math + 1 parallel pass.   │ v2: 5-8s (0-LLM math + 1 pass).│
├─────────────────────┼─────────────────────────────────┼────────────────────────────────┤
│ Architecture        │ Next.js API on Vercel +         │ v1: SQLite WAL, raw SQL routes.│
│                     │ Supabase PostgreSQL cloud.      │ v2: Universal Provider Abstr.  │
├─────────────────────┼─────────────────────────────────┼────────────────────────────────┤
│ Client Runtime      │ React Native + Expo SDK 54      │ v1: Canary SDK 58 / RN 0.88.   │
│                     │ (Hermes JS bundle: 13 MB).      │ v2: Stable Expo SDK 54 LTS.    │
├─────────────────────┼─────────────────────────────────┼────────────────────────────────┤
│ Virality Engine     │ 9:16 Instagram Story card PNG   │ v1: Plain text Share.share.    │
│                     │ via react-native-view-shot.     │ v2: react-native-view-shot.    │
├─────────────────────┼─────────────────────────────────┼────────────────────────────────┤
│ PII Privacy         │ Transmits chat to cloud API;    │ v1: Sanitizer leaked in 2 paths│
│                     │ claims privacy in marketing.    │ v2: Strict LLM Adapter PII Gate│
├─────────────────────┼─────────────────────────────────┼────────────────────────────────┤
│ Monetization Gate   │ Paywall immediately after       │ v1: No paywall.                │
│                     │ Act 2 (Delulu Gauge reveal).    │ v2: 100% Free viral loop.      │
└─────────────────────┴─────────────────────────────────┴────────────────────────────────┘
```

---

# 3. True Forensic State of the v1 Codebase

### 3.1 Forensic Discoveries & Technical Insights from v1 Prototype
The v1 prototype proved several critical engineering hypotheses and highlighted severe traps:
1. **The Ingestion & Normalization Discovery:**
   - Raw WhatsApp exports vary wildly between iOS and Android (bracketed vs dash-separated timestamps, 12h AM/PM vs 24h military time, with or without seconds).
   - Ingestion requires stripping invisible Unicode directional and space formatting marks (`\u200e`, `\u202f`, BOM) before any regex or splitting can operate reliably.
   - Message identity must be strictly deterministic and content-addressable (e.g. SHA-256 of timestamp + sender + content). Salted hashing (`hash()`) or line-number dependencies cause cache invalidation and database duplicate bugs.
2. **The PII Security Discovery:**
   - Real chat exports contain sensitive personal data: mobile numbers (international, US, Indian), financial accounts (UPI VPAs, payment links), personal email addresses, and full participant names.
   - A client/edge-ready regex scrubber is mandatory as an architectural boundary before any text reaches an LLM. Any analytical path that bypasses this scrubber creates an immediate GDPR and App Store rejection violation.
3. **The Chronemics Mathematical Discovery:**
   - Human texting dynamics are neuro-symbolic, not pure math and not pure LLM.
   - Naive timestamp subtraction creates severe illusions: 4 texts sent in 45 seconds are **one single thought (burst)**, not 4 separate double-texts.
   - Overnight sleep gaps (>7 hours) must be filtered out when calculating Median Response Latency (MRL); otherwise, normal sleep is misclassified as being "left on read".
   - Silence seams (>3.5 hours) represent natural conversational session boundaries.
4. **The Concurrency & Background Task Discovery:**
   - Running LLM completions directly inside an HTTP request handler freezes the API event loop for 40+ seconds.
   - High-throughput ingestion requires an asynchronous task queue backed by non-blocking persistent storage (SQLite WAL mode with busy timeout handling) and an idempotent startup recovery sweeper for crashed jobs.
5. **The Component-First UI Discovery:**
   - Allowing screens to invent local card styling and shadows leads directly to container drift, dock collisions, and theme schizophrenia.
   - Layout primitives (`StatStrip`, `SegmentedControl`, `ReceiptQuote`, `EditorialSection`) must be centralized so visual updates propagate globally.
6. **The Memory Decay Discovery:**
   - Standard exponential recency decay aggressively wipes out old memories. A bounded soft-floor decay ($\min=0.5$) ensures core foundational facts (birthdays, allergies, first date) remain retrievable regardless of elapsed time.

---

### 3.2 Anti-Patterns & Failure Modes to Never Repeat
1. **The "Truman Show" Client-Side Mock Trap:**
   - Faking unbuilt features with client-side timers (`setTimeout`) creates an illusion of completion while hiding architectural gaps. Unbuilt features must be hidden until true backend services exist.
2. **API Contract Degradation (`Dict[str, Any]`):**
   - Returning loose, untyped dictionaries from API routes degrades client type safety and OpenAPI specifications. Every endpoint must declare a strict Pydantic v2 schema.
3. **Direct SQL Coupling in Route Handlers:**
   - Embedding raw SQL queries inside route files tightly couples the application to a single dialect (SQLite) and makes cloud migration to Supabase nearly impossible.
4. **Theme Schizophrenia & Invisible Text:**
   - Mixing dark-mode cards with light-mode backgrounds results in white-on-white text regressions. The design system must be 100% unified.
5. **Secrets in Git:**
   - Production API credentials must never be committed to git repositories.

---

### 3.3 Target v2 Technology Standards
- **Mobile Client:** Expo SDK 54 LTS, React Native 0.76+, React 18.3, Reanimated 3, Lucide Icons, Zustand, React Native MMKV, `react-native-view-shot`, `expo-sharing`.
- **Backend API:** Python 3.12+, FastAPI, Uvicorn, Pydantic v2, Pydantic Settings, OpenAI API, SQLite (WAL mode).

---

# 4. Verified Core Specifications & Conceptual Contracts

### 4.1 Ingestion & Message Integrity Specification
- **Unicode Normalization:** System must normalize incoming raw text streams by stripping invisible LTR/RTL marks, Byte Order Marks (BOM), and converting narrow/non-breaking spaces to standard whitespace prior to parsing.
- **Multi-Format Parsing Capability:** Ingestion must recognize both Android (`ts - Sender: Msg`) and iOS (`[ts] Sender: Msg`) formats, supporting 12-hour AM/PM and 24-hour military timestamps with or without seconds across standard date separators (`/`, `-`, `.`).
- **Deterministic Identity Invariant:** Every message must receive a unique, content-addressable ID derived from a cryptographic hash of its immutable signature (contact ID + ISO timestamp + raw sender + cleaned content). Message IDs must never depend on mutable line numbers or runtime process salts.

---

### 4.2 Zero-Trust PII Redaction Specification
- **Redaction Boundary:** No raw conversational text may be transmitted to external cloud LLM providers without passing through a pre-flight PII redaction engine.
- **Redaction Targets:**
  * Phone numbers: Indian mobile formats (+91), US standard/formatted, and international E.164 patterns $\rightarrow$ `[PHONE_REDACTED]`.
  * Email addresses $\rightarrow$ `[EMAIL_REDACTED]`.
  * Financial identifiers: Credit/debit card 16-digit patterns and Indian UPI Virtual Payment Addresses (VPAs) $\rightarrow$ `[ACCOUNT_REDACTED]`.
  * Names: Full and partial names of the user and contact must be substituted with semantic tokens `[USER]` and `[PARTNER]` using whole-word boundaries.

---

### 4.3 Mathematical Chronemics Specification
All metrics must be computed deterministically without LLMs to eliminate numerical hallucinations:
1. **Conversational Turn Clustering:** Group consecutive messages from the same participant into a single turn if the inter-message interval $\Delta t \le 90\text{ seconds}$.
2. **Silence Seam Detection:** Flag an interaction gap as a session boundary if the silence interval between turns $\ge 3.5\text{ hours}$.
3. **True Initiation Ratio:** Ratio of conversations started with a genuine topic change by the user vs. the contact, excluding routine daily greetings ("gm", "gn") and follow-up chases.
4. **Median Response Latency (MRL):** Median response time computed on alternating conversational turns, clamping rapid replies to 30 seconds and filtering out overnight sleep gaps ($> 7\text{ hours}$).
5. **True Double-Text Count:** Count instances where a participant sends an additional conversational turn after an unanswered silence delay ($\ge 30\text{ minutes}$).
6. **Late-Night Ratio:** Percentage of total volume exchanged between 11:00 PM and 4:00 AM.

---

### 4.4 Bounded Soft-Floor Memory Decay Specification
For semantic memory retrieval, time-decay weighting must follow a half-life exponential curve bounded by a non-zero floor ($\min=0.5$), ensuring foundational historical context is never penalized by more than 50% relative to recent messages.

---

### 4.5 Cultural Pragmatics & Sociolinguistic Grounding
System prompts must instruct AI evaluators on regional conversational nuances:
- South Asian / Telugu / Hinglish banter (*Pulihora*, *Chi po ra*, *Babu entra*) must be decoded as playful flirtation or intimate comfort, never as hostility or toxicity.
- Late-night communication pauses attributable to family proximity must not be scored as emotional evasion.
- Caring inquiries regarding health, surgery, meals, or rest must be scored as high emotional investment.

---

### 4.6 The 5 Refined Acts for MVP Theatrical Unboxing
Theatrical unboxing is structured into 5 concise, high-impact beats:
1. **Act 1: The Forensic Intake & Surface Reality:** Participant archetypes, relationship status classification, and brutal executive diagnosis.
2. **Act 2: The Delulu Meter & Delusion Index:** Delulu Score (0–100%), circus classification level, and primary psychological delusion driver.
3. **Act 3: Conversational Power & Asymmetry Dynamics:** Leverage distribution (User % vs Contact %), chasing status, and chronemics telemetry.
4. **Act 4: The Red & Green Flags Locker:** Verifiable quoted receipts of primary behavioral red flags (severity 1–5) and genuine green flags.
5. **Act 5: Greatest Hits & The Final Ruling:** Satirical superlative awards, memorable cringe quote receipts, 3-month survival odds (%), and definitive verdict.

---

### 4.7 Universal Database Provider Architecture
Application business logic and API endpoints must remain strictly decoupled from the storage engine via an abstract provider contract (`BaseDatabaseProvider`):
- **Contract Boundary:** Encapsulates all persistence operations behind an abstract interface. Domain models never touch SQL, tables, or connection handles directly.
- **Provider Capabilities:**
  * Contact identity management and deduplication.
  * Bulk immutable message persistence with content-hash deduplication.
  * Chronemics analytical metric storage and historical retrieval.
  * Theatrical unboxing dossier persistence (Acts 1 through 5).
  * Asynchronous ingestion task lifecycle tracking (creation, progress updates, completion, failure).
- **Target Implementations:**
  * **Phase 1 MVP:** Local `SQLiteDatabaseProvider` operating in Write-Ahead Logging (WAL) mode with busy timeout handling.
  * **Phase 2 Cloud:** Cloud `SupabaseDatabaseProvider` (PostgreSQL) conforming to the exact same contract, switchable via environment configuration with zero changes to domain logic or route handlers.

---

# 5. "Never Repeat" Engineering & Security Invariants

These 8 non-negotiable invariants directly eradicate every critical vulnerability, race condition, and anti-pattern identified in v1:

### Invariant 1: The Zero-Trust LLM PII Gate (Law 7)
- **The Defect in v1:** Subsystems sent raw conversational snippets directly to LLMs without scrubbing phone numbers, emails, or personal names.
- **The Invariant in v2:** No outbound HTTP request to any external LLM provider may be constructed without routing input text through the zero-trust PII sanitization boundary. Remote LLM client adapters must enforce PII redaction as an unbypassable gate.

### Invariant 2: Universal Database Provider Isolation (Law 1)
- **The Defect in v1:** Raw `SELECT` and `INSERT` SQL strings were scattered across API route files, coupling the application to SQLite syntax and blocking cloud database portability.
- **The Invariant in v2:** Direct database connections and raw SQL in route handlers are **strictly prohibited**. All data operations must call methods on the injected database provider interface.

### Invariant 3: Strongly-Typed API Contracts (Law 5)
- **The Defect in v1:** Route handlers returned untyped dictionaries and lacked response schemas, degrading OpenAPI documentation and client contract safety.
- **The Invariant in v2:** Every endpoint must declare an explicit, strictly-typed request and response schema. Untyped dictionary returns are prohibited.

### Invariant 4: Asynchronous Non-Blocking Event Loop (Law 4)
- **The Defect in v1:** Parsing large chat archives and unzipping payloads synchronously froze the server event loop, causing connection timeouts.
- **The Invariant in v2:** CPU-bound decompression and heavy parsing operations must run on asynchronous worker threads. The server event loop must never block for $>10\text{ms}$.

### Invariant 5: The Component-First Law (Zero Screen-Level Container Drift)
- **The Defect in v1:** Client screens created hundreds of lines of bespoke card styles, creating visual inconsistencies and layout collisions.
- **The Invariant in v2:** Screens MUST NOT declare custom card containers, shadow boxes, or metric strips in local styles. Screens import centralized primitives from the UI component library. Primitives consume tokens from the design system.

### Invariant 6: Light Apple Contrast & Status Bar Invariant
- **The Defect in v1:** White icons rendered over pure white backgrounds, and leftover dark-mode styles produced invisible white text on white cards.
- **The Invariant in v2:** Dark status bar styling is enforced globally. Text color over card surfaces must consume semantic tokens. Hardcoded white text over white cards is strictly banned.

### Invariant 7: Zero "Truman Show" Client Mocks
- **The Defect in v1:** Features were faked with arbitrary `setTimeout` timers and silent error fallbacks displaying hardcoded sample data.
- **The Invariant in v2:** Never deploy fake `setTimeout` mocks or silent error fallbacks. If an API call fails, display an explicit error banner with a retry action. If a feature backend is unbuilt, do not render the interface element.

### Invariant 8: Zero Plaintext Secrets in Repository
- **The Defect in v1:** Unredacted API keys were committed to git.
- **The Invariant in v2:** Secret configuration files must remain strictly ignored by version control. Production and development keys must be loaded via system environment variables. Only template files with placeholders may be committed.

---

# 6. Clean-Slate v2.0 Vertical-Slice Roadmap

This 6-phase plan outlines the exact step-by-step procedure to rebuild Assify v2 from scratch on a clean git branch:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        ASSIFY v2.0 VERTICAL-SLICE SPRINT PLAN                          │
├─────────┬───────────────────────────────┬──────────────────────────────────────────────┤
│ Phase   │ Focus Area                    │ Concrete Deliverable                         │
├─────────┼───────────────────────────────┼──────────────────────────────────────────────┤
│ Phase 0 │ Clean Branch & Repo Pruning   │ Purge 317MB APKs, isolate developer skills,  │
│         │                               │ create clean `v2-rebuild` branch.            │
├─────────┼───────────────────────────────┼──────────────────────────────────────────────┤
│ Phase 1 │ Database Provider & Core Math │ Implement `BaseDatabaseProvider`, SQLite WAL │
│         │                               │ provider, parser, PII sanitizer & chronemics.│
├─────────┼───────────────────────────────┼──────────────────────────────────────────────┤
│ Phase 2 │ Fast 5-Act Synthesizer & API  │ FastAPI lifespan, task queue, 5-Act schemas, │
│         │                               │ single-pass GPT-4o-mini prompt, REST routes. │
├─────────┼───────────────────────────────┼──────────────────────────────────────────────┤
│ Phase 3 │ Mobile Shell (Expo SDK 54)    │ Downgrade to SDK 54, Zustand+MMKV store,     │
│         │                               │ Light Apple layout primitives & Dropzone.    │
├─────────┼───────────────────────────────┼──────────────────────────────────────────────┤
│ Phase 4 │ 5-Beat Theatrical Unboxing &  │ 60fps spring reveal, Delulu gauge, and       │
│         │ 9:16 Story Exporter           │ 1-tap view-shot high-resolution PNG export.  │
├─────────┼───────────────────────────────┼──────────────────────────────────────────────┤
│ Phase 5 │ Native Android WhatsApp Share │ Configure Android Intent Filter in app.json  │
│         │ Target Integration            │ for direct WhatsApp export receiver.         │
├─────────┼───────────────────────────────┼──────────────────────────────────────────────┤
│ Phase 6 │ End-to-End Verification &     │ 10-second upload-to-story test, zero slop    │
│         │ Phase 2 Extension Hooks       │ audit, and clean plug-and-play interfaces.   │
└─────────┴───────────────────────────────┴──────────────────────────────────────────────┘
```

---

### Phase 0: Clean Branch & Workspace Pruning
1. Create and switch to the clean orphan branch:
   ```bash
   git checkout --orphan assify-V2-
   ```
2. Purge all legacy code directories, binaries, and previous experiment scratchpads from the working tree.
3. Retain solely `ASSIFY_MASTER_BLUEPRINT.md` as the high-level lessons-learned and architectural compass.
4. Stage and commit:
   ```bash
   git commit -m "feat: initialize assify - purple flower version (clean slate)"
   ```

---

### Phase 1: Base Requirements & Specification Phase
1. Establish base requirements directory: `requirements/00_base_requirements/`.
2. Author exhaustive, unambiguous requirements (`MAIN_APP_REQUIREMENTS.md`) covering core emotional proposition, user journey, capabilities, and system boundaries.
3. Conduct adversarial checker reviews to eliminate ambiguity, hidden assumptions, and legacy v1 baggage prior to any design or coding.

---

### Phase 2: Database Provider Abstraction & Core Telemetry
1. **Universal Database Provider:**
   - Define abstract database provider contract decoupling business logic from storage engines.
   - Implement clean SQLite WAL mode provider with concurrency safeguards.
2. **Deterministic Ingestion & Sanitizer:**
   - Build multi-format chat archive ingestion pipeline based on strict specifications.
   - Build zero-trust PII sanitization boundary scrubbing personal identifiers prior to external transmission.
3. **Chronemics Telemetry Engine:**
   - Implement deterministic non-LLM chronemics formulas (turn clustering, silence seams, latency clamping).

---

### Phase 3: Lean 5-Act LLM Profiler & Async API
1. Define typed API schemas for the 5-Act Theatrical Unboxing.
2. Implement single-pass LLM synthesizer with cultural pragmatics and grounding matrices. Target total processing latency $<6\text{s}$.
3. Implement asynchronous background task queue with polling and crash recovery.

---

### Phase 4: Mobile Client Scaffolding (Expo SDK 54 LTS)
1. Initialize clean Expo SDK 54 LTS project with React Native 0.76+ and Reanimated 3.
2. Configure Zustand + MMKV local state store.
3. Implement Light Apple HIG design primitives (`StatStrip`, `SegmentedControl`, `ReceiptQuote`, `EditorialSection`).
4. Wire chat dropzone and native Android Intent receiver for WhatsApp share sheet ingestion.

---

### Phase 5: 5-Beat Theatrical Unboxing & 9:16 Story Exporter
1. Build the 5-Beat unboxing sequence: The Scanner, Delulu Gauge reveal, Leverage analysis, Red/Green Flags locker, and Final Ruling.
2. Build 1-tap 9:16 Story Card generation and native social sharing.

---

### Phase 6: End-to-End Verification & Extension Readiness
1. Benchmark full ingestion-to-story turnaround to guarantee $<10\text{ seconds}$.
2. Verify clean extension points for Phase 2 capabilities (The Keep, Doctor Delulu Coach, Supabase cloud sync) with zero core refactoring.
2. **Clean Extension Point Audit:**
   - Verify that adding `The Keep` (Phase 2), `Doctor Delulu Coach` (Phase 2), or `Supabase Cloud Sync` (Phase 2) requires **zero changes** to the core v2.0 ingestion, chronemics, or unboxing pipelines.
3. **Commit Master Milestone:**
   - Lock clean vertical slice as `v2.0-MVP`.

---

*This document serves as the permanent, authoritative blueprint for building ASSIFY v2.0.*

