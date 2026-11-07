# Assify Specification Mining & Architecture Survey Report

> **Document Type:** Specification Mining & Architectural Survey  
> **Author:** `spec_miner_survey_1` (Specification Miner Archetype)  
> **Parent Orchestrator:** `orchestrator_2` (ID: `898607cd-2905-4a6e-af79-531d6b976d98`)  
> **Status:** COMPLETE & VERIFIED  
> **Date:** 2026-11-04  
> **Target Downstream Use:** Foundation for Generic (`docs/templates/sdd/generic/`) and Project-Tailored (`docs/templates/sdd/examples/`) Spec-Driven Development (SDD) Core Artifact Templates  

---

## 1. Executive Summary & Specification Landscape

### 1.1 Objective & Scope
This survey investigates the authoritative specification sources, architectural rules, engineering blueprints, and Spec-Driven Development (SDD) tooling across the Assify workspace. Its mission is to discover and document all functional requirements, non-functional invariants, design tokens, mathematical algorithms, security boundaries, and SDD workflow conventions required to author production-grade, project-tailored SDD templates (`constitution.md`, `spec.md`, `plan.md`, `tasks.md`, `checklist.md`).

### 1.2 Surveyed Workspace Resources
The findings in this report are synthesized from direct probing of six authoritative workspace assets:

1. **`requirements/00_base_requirements/MAIN_APP_REQUIREMENTS.md`**  
   *Classification:* Baseline Truth (v2.0.0-PROD Purple Flower Clean Slate Edition). Approved and adversarially verified product specification defining the end-to-end user journey, core capabilities, acceptance criteria, and system boundaries.
2. **`ASSIFY_MASTER_BLUEPRINT.md`**  
   *Classification:* Master Engineering Blueprint (v2.0 Locked). Authoritative technical design document codifying competitor teardown insights (Delulu Check reverse-engineering), salvaged v1 domain IP, 8 non-negotiable engineering invariants, and a 6-phase clean-slate implementation sprint plan.
3. **`.specify/memory/constitution.md`**  
   *Classification:* Active Workspace Governance Document (v1.0.0). Ratified constitutional articles governing architectural integrity, component-first design, anti-slop enforcement, skill-first adherence, TDD, and privacy sanctuary.
4. **`docs/spec_kit_research_report.md`**  
   *Classification:* Industry Research & Technical Architecture Report. Exhaustive analysis of GitHub Spec Kit (`github/spec-kit`, `specify-cli`), Fowler/Böckeler 3-tier taxonomy, community sentiment, real-world case studies, 9 anti-patterns, and the canonical 8-stage SDD lifecycle funnel.
5. **`.specify/templates/` & `.specify/workflows/`**  
   *Classification:* Active Spec Kit Scaffolding. Reference templates (`checklist-template.md`, `constitution-template.md`, `plan-template.md`, `spec-template.md`, `tasks-template.md`) and workflow manifests.
6. **`.agents/skills/` (Speckit Skill Suite & Global Rules)**  
   *Classification:* Agent Operational Protocols. 9 Speckit skills (`speckit-specify`, `speckit-clarify`, `speckit-checklist`, `speckit-plan`, `speckit-tasks`, `speckit-analyze`, `speckit-implement`, `speckit-converge`, `speckit-constitution`) plus user global rules regarding component-first law and anti-slop enforcement (`native-slop.md`).

### 1.3 Critical Discrepancies & Version Alignment
During spec mining, a crucial discrepancy was identified between `.specify/memory/constitution.md` (v1.0.0) and the v2.0 master documents:
- **Leftover Palette in Constitution v1.0.0:** Line 49 of `.specify/memory/constitution.md` mentions *"Deep Obsidian and Midnight Plum theme palettes"*.
- **The v2.0 Absolute Invariant:** Both `MAIN_APP_REQUIREMENTS.md` (§6, Non-Goals: *"Dark Mode Theme (Strictly Light Apple)"*) and `ASSIFY_MASTER_BLUEPRINT.md` (Lead Architect Decisions & §1.4: *"100% Light Apple Design System (`#FFFFFF` canvas, zero dark-mode leftovers, zero white-on-white text bugs)"*) strictly eradicate dark-mode leftovers and mandate pure white canvas (`#FFFFFF`) with Apple grouped secondary backgrounds (`#F5F5F7`).
- **Survey Resolution:** The v2.0 Master Blueprint and Main Requirements take precedence as baseline truth. Project-tailored SDD templates must enshrine the Light Apple HIG Design System and explicitly prohibit dark mode to prevent "theme schizophrenia."

---

## 2. Exhaustive Architectural & Domain Extraction

### 2.1 The Core Product Vision & 10-Second Viral Loop
- **Product Mission:** Forensic chat intelligence engine diagnosing dating dynamics, situationships, and power imbalances directly from WhatsApp exports.
- **Emotional Wedge:** Resolves modern dating anxiety (*"Am I delusional, or are they losing interest?"*) by replacing subjective friend gossip with objective telemetry, a Delulu Meter (0–100%), and 9:16 Instagram/Snapchat Story receipt cards within **10 seconds**.
- **The Viral Pipeline:**
  1. *Native Ingestion (≤2s):* WhatsApp export via Android/iOS Share Sheet or in-app dropzone.
  2. *Telemetry & Sanitization (≤1s):* Regex parser + zero-trust PII redaction + 0-LLM chronemics formulas.
  3. *Single-Pass AI Synthesis (4–6s):* Single OpenAI GPT-4o-mini completion producing Master Dossier & 5 Theatrical Acts.
  4. *Theatrical Payoff (≤3s):* 60fps spring reveal: Scanner radar → Delulu Gauge → Savage Archetype.
  5. *Social Sharing (1-Tap):* High-resolution 9:16 Story Card generation via `react-native-view-shot` to OS Share Sheet.

---

### 2.2 Full Technology Stack Specification

| Subsystem | Technology Choice | Version / Standard | Architectural Role & Rationale |
| :--- | :--- | :--- | :--- |
| **Mobile Runtime** | React Native / Expo | **Expo SDK 54 LTS** (RN 0.76+, React 18.3) | Production stability; avoids canary SDK 58 / RN 0.88 instability identified in v1 teardown. |
| **JS Engine** | Hermes | Bundled with Expo SDK 54 | Fast startup, low memory footprint (~13MB APK target). |
| **State Management** | Zustand | v4 / v5 | Lean, reactive, non-blocking client state stores. |
| **Fast Local Storage** | React Native MMKV | v3+ | Ultra-fast synchronous key-value persistence for settings, session flags, and biometric state. |
| **Animations** | React Native Reanimated | Reanimated 3 | Fluid 60fps physics spring animations for the Delulu gauge needle and paged card transitions. |
| **Iconography** | Lucide React Native | Latest LTS | Crisp Apple-style line icons. |
| **View Capture** | `react-native-view-shot` | Latest LTS | Offscreen/onscreen 9:16 story card rendering to high-res PNG. |
| **Social Sharing** | `expo-sharing` | Latest LTS | Invokes native iOS / Android OS Share Sheets for image export. |
| **Biometrics** | `expo-local-authentication` | Latest LTS | FaceID, TouchID, Android BiometricPrompt, and Device PIN fallback. |
| **Document Ingestion** | `expo-document-picker` | Latest LTS | In-app file dropzone for `.txt` and `.zip` chat exports. |
| **Native Share Target** | Android Intent Filter / iOS Extension | MIME `text/plain`, `application/zip` | Configured in `app.json` (`android.intent.action.SEND`) for direct export from WhatsApp. |
| **Backend Framework** | Python / FastAPI | Python 3.12+, FastAPI async | Lightweight asynchronous API service and secure LLM gateway. |
| **Data Validation** | Pydantic v2 | Pydantic v2 & Pydantic Settings | Strictly-typed request and response contracts (prohibiting loose `dict` returns). |
| **Database Abstraction**| Universal Database Provider | `BaseDatabaseProvider` | Decouples domain logic from SQL dialects. |
| **MVP Storage Engine**| SQLite (WAL Mode) | `SQLiteDatabaseProvider` | Embedded write-ahead logging (WAL) mode with busy timeout handling; 0 cloud lock-in. |
| **Phase 2 Cloud Storage**| Supabase PostgreSQL | `SupabaseDatabaseProvider` | Drop-in cloud provider conforming to `BaseDatabaseProvider` interface without domain rewrites. |
| **AI Evaluation Engine** | OpenAI API | GPT-4o-mini | Single-pass structured JSON schema completion with zero data retention / zero training flags. |

---

### 2.3 Canonical Design System Tokens (Light Apple HIG Edition)

Assify v2.0 enforces a strict Light Apple Design System. Dark mode is an explicit non-goal for MVP:

```
Canvas Base: #FFFFFF (Pure White)
Grouped Canvas: #F5F5F7 (Secondary Table/Section Background)
Interactive Card: #FFFFFF (Elevated Card Lift)
Modal Container: #FAFAFC (Bottom Sheet / Modal Background)
```

#### Detailed Token Reference Table:
| Token Category | Token Name | Hex / CSS Value | Semantic Role |
| :--- | :--- | :--- | :--- |
| **Surfaces** | `background` | `#FFFFFF` | Master screen background |
| | `secondaryBackground` | `#F5F5F7` | Apple grouped list & inset section background |
| | `card` | `#FFFFFF` | Card surface elevation |
| | `modalBackground` | `#FAFAFC` | Modals and bottom sheets |
| **Typography** | `textPrimary` | `#000000` | Display headers, bold numbers, high contrast |
| | `textSecondary` | `#1D1D1F` | Body text, diagnostic descriptions |
| | `textTertiary` | `#86868B` | Sub-labels, timestamps, metadata |
| | `textDisabled` | `#D2D2D7` | Disabled button text |
| **Diagnostics** | `deluluGold` | `#BF9B28` | Primary Assify signature gold accent |
| | `deluluGoldMuted` | `#FBF7EA` | Gold badge, chip, and pill backgrounds |
| | `systemGreen` | `#34C759` | Low delusion / healthy conversational balance (0–35%) |
| | `systemOrange` | `#FF9500` | Moderate delusion / friction apprentice tier (36–69%) |
| | `systemRed` | `#FF3B30` | Severe delusion / toxic red flag head clown (70–100%) |
| **Dividers** | `hairline` | `rgba(0, 0, 0, 0.08)` | 0.5px Apple hairline separators |
| | `subtleBorder` | `rgba(0, 0, 0, 0.04)` | Micro-framing for cards |
| **Spacing Scale** | `xs`, `sm`, `md`, `lg` | `4px`, `8px`, `12px`, `16px` | Micro-spacing, inner card padding |
| | `xl`, `xxl`, `hero` | `20px`, `24px`, `32px` | Screen margins, section dividers, hero offsets |
| **Radii** | `sm`, `md`, `lg`, `xl`, `full` | `8px`, `12px`, `16px`, `20px`, `9999px` | Rounded cards, inputs, dialogs, pill tags |
| **Elevation** | `subtle` | `offset: (0, 1), opacity: 0.04, radius: 3` | Soft surface separation |
| | `card` | `offset: (0, 4), opacity: 0.06, radius: 12` | Floating card lift |

---

### 2.4 Component-First Law & Anti-Slop Rules

#### 2.4.1 The Component-First Law
- **Mandate:** **Components import tokens; screens import components.**
- **Zero Screen-Level Container Drift:** Screens (e.g. routes in `app/(tabs)/*` or `app/dossier/*`) are **STRICTLY FORBIDDEN** from declaring bespoke container cards, metric boxes, shadow frames, or segmented controls in local `StyleSheet.create` blocks.
- **Centralized Primitives:** All structural UI elements must be authored in `mobile/src/components/ui/`:
  - `StatStrip`: Metric display row with hairline dividers and semantic colors.
  - `SegmentedControl`: Apple-style tactile pill switcher with spring indicator.
  - `EditorialSection`: Grouped section header, subtitle, and inset content container.
  - `ReceiptQuote`: Verifiable quoted snippet container with sender badge and timestamp.
  - `DeluluGauge`: Physics-spring needle gauge with circular arc and circus tier badge.

#### 2.4.2 Anti-Slop Enforcement (The 20 Named Tells / `native-slop.md`)
1. **No "Everything's a Card":** Do not wrap every row in its own card or nest cards inside cards. Group rows via grouped table backgrounds (`#F5F5F7`) and 0.5px hairlines.
2. **No Floating Pill Collisions:** Tab bars and bottom bars must never collide with or obscure content. Enforce `useSafeAreaInsets()` on all bottom views.
3. **No Wireframe Borders:** Avoid repetitive 1px gray borders around elements. Rely on background contrast and intentional whitespace.
4. **No White-on-White Regressions:** Enforce dark status bar icons and semantic text tokens globally.
5. **No Auditory Intrusions:** Zero unexpected sound effects, background music, or chimes. Haptics only.
6. **No "Truman Show" Client Mocks:** Faking unbuilt features with `setTimeout` or hardcoded fallback data is strictly prohibited. Unbuilt features must not be rendered; errors must present an explicit retry banner.

---

### 2.5 Ingestion, Zero-Trust PII Sanitization & Chronemics Math

#### 2.5.1 Ingestion & Normalization
- **Multi-Format Support:** Ingests plain text (`.txt`) and zipped (`.zip`) WhatsApp archives in memory without writing temporary files to unmanaged disk locations.
- **Unicode Scrubbing:** Strips invisible Unicode direction marks (`\u200e`, `\u200f`), Byte Order Marks (BOM), and normalizes non-breaking spaces (`\u202f`, `\u00a0`) to standard whitespace.
- **Timestamp Parsing:** Supports both Android (`ts - Sender: Msg`) and iOS (`[ts] Sender: Msg`) formats, 12h AM/PM and 24h military time, with or without seconds across `/`, `-`, `.` date separators.
- **Deterministic Message Hashing:**
  $$\text{Message ID} = \text{SHA-256}(\text{contact\_id} + \text{timestamp\_iso} + \text{sequence\_index} + \text{sender} + \text{cleaned\_text})$$
  Inclusion of source file `sequence_index` prevents collisions on same-minute messages from the same sender.
- **Stable Contact ID:**
  $$\text{Contact ID} = \text{SHA-256}(\text{alphabetically\_sorted}([participant\_a, participant\_b]))$$
- **Validation Gates:**
  - Strict 1-on-1 check: Exactly $N = 2$ human participants required. Reject self-chats ($N < 2$) and group chats ($N > 2$).
  - Minimum volume check: Minimum 30 conversational messages required.
  - Noise filter: Filters encryption notices, `<Media omitted>`, missed calls, deleted message stubs.

#### 2.5.2 Zero-Trust PII Sanitization Gate
- **Pre-Flight Boundary:** No conversational text may leave the device or backend service without passing through the regex sanitization boundary.
- **Redaction Mappings:**
  - Indian Mobile (+91), US formatted, and International E.164 numbers $\rightarrow$ `[PHONE_REDACTED]`.
  - Email addresses $\rightarrow$ `[EMAIL_REDACTED]`.
  - Financial accounts (16-digit cards, Indian UPI VPAs `user@upi`) $\rightarrow$ `[ACCOUNT_REDACTED]`.
  - Names: Participant names replaced with semantic tokens `[USER]` and `[PARTNER]` using whole-word boundaries.
- **Client-Side Quote Rehydration Layer:** Tokens `[USER]` and `[PARTNER]` are internal to sanitization. The mobile presentation layer rehydrates them back to actual human display names when rendering unboxing cards and 9:16 export stories.

#### 2.5.3 Deterministic Chronemics Telemetry (0-LLM Math)
1. **Turn Clustering:** Messages from the same participant separated by $\le 90\text{ seconds}$ are merged into a single Conversational Turn. Turn start is anchored to message 1; turn end is anchored to message $N$.
2. **Silence Seam Detection:** Interaction gaps between alternating turns $\ge 3.5\text{ hours}$ mark conversational session boundaries.
3. **Median Response Latency (MRL) with Sleep Clamping:**
   - Measured from previous turn end to current turn start.
   - Rapid replies under 30 seconds clamped to 30s.
   - Overnight sleep gaps: Any gap between 11:00 PM and 8:00 AM local time exceeding 4 hours (or $>7\text{h}$ per blueprint) is excluded from MRL calculation.
   - Terminal turn exclusion: The final unanswered turn of a chat is excluded from alternating latency medians.
4. **Follow-up Turns vs. Chasing Double-Texts:**
   - Consecutive turns by the same participant after $>90\text{s}$ without an intervening reply = Follow-up turn.
   - Any follow-up turn sent after an unanswered silence delay $\ge 30\text{ minutes}$ is strictly classified as a **Chasing Double-Text**.
5. **Late-Night Volume Ratio:** Percentage of total message volume exchanged between 11:00 PM and 4:00 AM local time.

---

### 2.6 The 5-Act Theatrical Unboxing Sequence

Theatrical unboxing presents a paged, story-style interface with fluid 60fps spring transitions (tap right or swipe to advance):

```
┌────────────────────────────────────────────────────────────────────────┐
│                   THE 5-ACT THEATRICAL UNBOXING BEATS                  │
├───────┬───────────────────────────────┬────────────────────────────────┤
│ Act   │ Title                         │ Content & Visual Components    │
├───────┼───────────────────────────────┼────────────────────────────────┤
│ Act 1 │ Forensic Intake & Reality     │ Archetypes, Relationship phase,│
│       │                               │ Brutal 2-sentence diagnosis.   │
├───────┼───────────────────────────────┼────────────────────────────────┤
│ Act 2 │ Delulu Meter & Circus Tier    │ Physics spring gauge (0-100%), │
│       │                               │ Circus tier badge, Delusion    │
│       │                               │ psychological driver.          │
├───────┼───────────────────────────────┼────────────────────────────────┤
│ Act 3 │ Power Split & Asymmetry       │ Leverage bar (User % vs Ptr %),│
│       │                               │ Chasing diagnosis, Chronemics  │
│       │                               │ (MRL, Double-texts, Late-night)│
├───────┼───────────────────────────────┼────────────────────────────────┤
│ Act 4 │ Red & Green Flags Locker      │ Verifiable quotes from chat,   │
│       │                               │ Severity 1-5 badges, Green     │
│       │                               │ flags of vulnerability/care.   │
├───────┼───────────────────────────────┼────────────────────────────────┤
│ Act 5 │ Greatest Hits & Final Ruling  │ Satirical superlatives, Cringe │
│       │                               │ quotes, 3-Mo survival odds (%),│
│       │                               │ Final Verdict: Stay/Run/Confront│
└───────┴───────────────────────────────┴────────────────────────────────┘
```

- **Delulu Circus Tiers:**
  - 0–35%: *Ground Reality (Emotionally Sane)* $\rightarrow$ `systemGreen` (`#34C759`)
  - 36–69%: *Circus Apprentice (Moderate Delusion)* $\rightarrow$ `systemOrange` (`#FF9500`)
  - 70–100%: *Head Clown (Terminal Delusion)* $\rightarrow$ `systemRed` (`#FF3B30`)
- **Cultural Pragmatics Grounding:** LLM evaluators are explicitly instructed that South Asian / Hinglish / Telugu banter (*Pulihora*, *Chi po ra*, *Babu entra*, teasing sarcasm) represents playful intimacy, never hostility or toxic abuse.
- **Social Receipts Export:** 1-tap generation of high-resolution 9:16 Story Cards (Master Verdict Card and Individual Act Cards) rendered via `react-native-view-shot` directly to native OS Share Sheets.

---

### 2.7 Security, Privacy & Operational Guardrails
- **Privacy Sanctuary:** All parsed messages, contacts, and dossiers reside in local application storage (SQLite WAL mode on user's device/local server).
- **Exhaustive 1-Tap Hard Wipe:** A single button in settings executes:
  1. Truncation and deletion of all database tables.
  2. Recursive deletion of all rendered story cards and cached files in `FileSystem.cacheDirectory`.
  3. Purging of all persisted user preferences and session keys in MMKV storage.
  Guarantees a 0-byte residual user footprint.
- **Biometric Gate:** Optional FaceID/PIN/TouchID gate guards both direct application entry AND incoming OS Share Sheet processing.
- **Zero-Delta Optimization:** If an imported chat file contains 0 new messages relative to the local database, Assify skips all LLM calls, shows a toast (*"Chat is already up to date"*), and opens the existing dossier in 0 seconds (0 API tokens burned).
- **Offline Resilience:** Browsing historical dossiers, viewing contacts, biometric auth, and exporting story cards function 100% offline. Network connectivity is required exclusively for AI synthesis of *new* chats.

---

### 2.8 The 8-Stage Spec-Driven Development (SDD) Workflow Lifecycle

From `docs/spec_kit_research_report.md` and `.agents/skills/speckit-*`:

```
STAGE 0: CONSTITUTION (.specify/memory/constitution.md)
  │ Codifies non-negotiable architectural mandates, tech stack, and gates.
  ▼
STAGE 1: SPECIFY (/speckit-specify -> specs/<feature>/spec.md)
  │ Authors user stories, functional requirements (FR), success criteria (SC).
  ▼
STAGE 2: CLARIFY (/speckit-clarify)
  │ Interactive scan of 10 ambiguity dimensions; max 5 targeted questions.
  ▼
STAGE 3: CHECKLIST (/speckit-checklist -> checklists/*.md)
  │ Generates requirements quality tests ("unit tests for English").
  ▼
STAGE 4: PLAN (/speckit-plan -> plan.md, contracts/, data-model.md)
  │ Phase 0 research, Phase 1 design, evaluates Constitution Check gate.
  ▼
STAGE 5: TASKS (/speckit-tasks -> tasks.md)
  │ Decomposes into dependency graph: - [ ] T### [P] [US#] path/to/file.
  ▼
STAGE 6: ANALYZE (/speckit-analyze)
  │ Read-only cross-artifact consistency audit (Spec vs Plan vs Tasks).
  ▼
STAGE 7: IMPLEMENT (/speckit-implement)
  │ Verifies checklist gate, executes tasks phase-by-phase, marks [X].
  ▼
STAGE 8: CONVERGE (/speckit-converge)
  │ Audits code vs spec; appends Phase N: Convergence tasks if gaps exist.
```

#### Core SDD Rules & Invariants:
1. **The "What vs. How" Firewall:** `spec.md` specifies WHAT users need and WHY in technology-agnostic English. It strictly forbids implementation details (no React hooks, SQL tables, HTTP endpoints). `plan.md` specifies HOW.
2. **Requirements Checklists as "Unit Tests for English":** Checklists test the quality of requirements *before* code is written, NOT the behavior of the code. Custom domain checklists are owned exclusively by human reviewers; an AI must never mark them `[x]` autonomously. `/speckit-implement` halts if checklists contain unchecked items.
3. **The Append-Only Convergence Loop:** When gaps or discrepancies are discovered post-implementation, `/speckit-converge` never alters or renumbers existing tasks. It appends `## Phase N: Convergence` with new tasks `T###` at the bottom of `tasks.md`.
4. **Single-Task Micro-Context Execution Pattern:** Never load the whole repo or all tasks at once. Ingest only 1–3 related tasks plus the relevant contract schema to maintain 100% attention fidelity.
5. **The "<50 LOC" Exemption Rule:** Bypass the full SDD ceremony for minor bug fixes or cosmetic tweaks under 50 lines of code.

---

## 3. Specification Miner Tables

### 3.1 Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Ingestion | WhatsApp Native Share Receiver | Android Intent Filter / iOS Share Extension receiving exported chats directly from WhatsApp. | Shared `.txt` or `.zip` stream via OS Share Sheet | File URI passed into app ingestion pipeline | Clean error dialog if file payload is invalid or unreadable | `MAIN_APP_REQUIREMENTS.md` §3.1, `ASSIFY_MASTER_BLUEPRINT.md` §1.3 |
| 2 | Ingestion | In-App File Dropzone | Canvas dropzone allowing manual selection of `.txt` or `.zip` chat exports via document picker. | User file selection via `expo-document-picker` | File URI passed into parser | User-facing alert if selected file is not plain text or zip archive | `MAIN_APP_REQUIREMENTS.md` §3.1 |
| 3 | Ingestion | Unicode Normalization Engine | Strips LTR (`\u200e`), RTL (`\u200f`), BOM marks, and normalizes non-breaking spaces before tokenization. | Raw chat file string stream | Cleaned UTF-8 string buffer | Tolerates malformed unicode gracefully by replacing unmappable chars | `MAIN_APP_REQUIREMENTS.md` §4.1.2, `ASSIFY_MASTER_BLUEPRINT.md` §4.1 |
| 4 | Ingestion | Multi-Format WhatsApp Parser | Supports Android (`ts - Sender: Msg`) and iOS (`[ts] Sender: Msg`), 12h/24h, with/without seconds. | Cleaned chat string lines | Stream of raw message tokens (timestamp, sender, raw_body) | Skips unrecognized lines without aborting entire file parse | `MAIN_APP_REQUIREMENTS.md` §4.1.1, `ASSIFY_MASTER_BLUEPRINT.md` §4.1 |
| 5 | Validation | 1-on-1 Participant Boundary Gate | Enforces exactly $N=2$ distinct human conversational participants in the chat. | Extracted participant list | Boolean pass / fail | Rejects $N<2$ (self-chat) and $N>2$ (group chat) with Apple HIG dialogs | `MAIN_APP_REQUIREMENTS.md` §3.1 |
| 6 | Validation | Minimum Message Volume Gate | Enforces minimum 30 conversational messages for diagnostic reliability. | Validated message count | Boolean pass / fail | Rejects $<30$ messages with alert: *"Need at least 30 messages to uncover the truth"* | `MAIN_APP_REQUIREMENTS.md` §3.1 |
| 7 | Identity | 1-Tap Participant Resolution Modal | Prompts *"Which one are you?"* with two interactive pill buttons for user vs partner identification. | 2 extracted participant handles | Mapping of `[USER]` and `[PARTNER]` tokens | Non-blocking modal halts analysis until user selects identity | `MAIN_APP_REQUIREMENTS.md` §3.2 |
| 8 | Identity | Deterministic Message Hasher | Content-addressable hash: `SHA-256(contact_id + timestamp + sequence_index + sender + cleaned_text)`. | Message attributes + line sequence index | Unique 64-char hex Message ID | Collision-free even on identical same-minute bursts | `MAIN_APP_REQUIREMENTS.md` §4.1.3, `ASSIFY_MASTER_BLUEPRINT.md` §4.1 |
| 9 | Identity | Stable Contact ID Computation | Deterministic identifier: `SHA-256(sorted([participant_a, participant_b]))`. | Two participant names | 64-char hex Contact ID | Consistent across different chat export orientations | `MAIN_APP_REQUIREMENTS.md` §3.2 |
| 10 | Security | Zero-Trust PII Sanitizer | Client/edge regex boundary scrubbing phone numbers, emails, financial VPAs, and participant names. | Raw message text | Redacted text (`[PHONE_REDACTED]`, `[USER]`, etc.) | Outbound network guard fails closed if sanitizer raises error | `MAIN_APP_REQUIREMENTS.md` §4.2, `ASSIFY_MASTER_BLUEPRINT.md` §4.2 |
| 11 | Telemetry | Conversational Turn Clustering | Merges consecutive messages from the same sender separated by $\le 90\text{s}$ into a single turn. | Timestamped message sequence | List of discrete Conversational Turns | Handles isolated single-message turns without errors | `MAIN_APP_REQUIREMENTS.md` §4.3.1, `ASSIFY_MASTER_BLUEPRINT.md` §4.3 |
| 12 | Telemetry | Silence Seam Detector | Flags interaction gaps between alternating turns $\ge 3.5\text{ hours}$ as conversational session boundaries. | Turn intervals | Session boundary markers | Handles multi-day or multi-week gaps without integer overflow | `MAIN_APP_REQUIREMENTS.md` §4.3.2, `ASSIFY_MASTER_BLUEPRINT.md` §4.3 |
| 13 | Telemetry | Median Response Latency (MRL) | Computes median response time on alternating turns, clamping $<30\text{s}$ to 30s. | Alternating turn timestamps | Median latency in seconds/minutes | Returns 0 or null if no alternating turns exist | `MAIN_APP_REQUIREMENTS.md` §4.3.3, `ASSIFY_MASTER_BLUEPRINT.md` §4.3 |
| 14 | Telemetry | Overnight Sleep Clamping Engine | Excludes gaps spanning 11:00 PM to 8:00 AM local time exceeding 4h (or $>7\text{h}$) from MRL calculations. | Timestamps + local timezone | Filtered turn latency list | Preserves daylight gaps while discarding sleep intervals | `MAIN_APP_REQUIREMENTS.md` §4.3.3, `ASSIFY_MASTER_BLUEPRINT.md` §4.3 |
| 15 | Telemetry | Terminal Turn Exclusion | Excludes the final unanswered turn of a conversation from latency medians. | Full turn list | Bounded latency dataset | Avoids skewing median with indefinitely open final turns | `MAIN_APP_REQUIREMENTS.md` §4.3.3 |
| 16 | Telemetry | Chasing Double-Text Classifier | Identifies follow-up turns sent after an unanswered silence delay $\ge 30\text{ minutes}$. | Consecutive turns from same sender | Count of Chasing Double-Texts | Rapid bursts within 90s evaluate to exactly 0 double-texts | `MAIN_APP_REQUIREMENTS.md` §4.3.4, `ASSIFY_MASTER_BLUEPRINT.md` §4.3 |
| 17 | Telemetry | Late-Night Volume Ratio | Measures percentage of total message volume exchanged between 11:00 PM and 4:00 AM. | All message timestamps | Percentage float (0.0% to 100.0%) | Evaluates to 0.0% if total volume is 0 | `MAIN_APP_REQUIREMENTS.md` §4.3.5, `ASSIFY_MASTER_BLUEPRINT.md` §4.3 |
| 18 | Optimization | Zero-Delta Ingestion Bypass | Checks if imported chat contains 0 new messages; if so, skips LLM and opens cached dossier instantly. | Message content hashes vs database | 0s instant dossier reveal + toast | Displays toast: *"Chat is already up to date"*, burns 0 tokens | `MAIN_APP_REQUIREMENTS.md` §3.6 |
| 19 | Optimization | Differential Delta Ingestion | Ingests only new messages ($N_{new} > 0$), computes lifetime telemetry, and generates delta change badges. | New messages + past dossier | Updated dossier with delta badges (`+12% delulu`) | Graceful fallback to full synthesis if prior dossier corrupted | `MAIN_APP_REQUIREMENTS.md` §3.6 |
| 20 | AI Synthesis | Single-Pass 5-Act LLM Profiler | Single GPT-4o-mini structured completion generating Archetypes, Delulu score, Power split, Flags, Verdict. | Sanitized messages + chronemics metrics | Strictly-typed Pydantic/JSON 5-Act Dossier | Fallback to retry card if LLM call exceeds 15s or drops | `MAIN_APP_REQUIREMENTS.md` §4.4.1, `ASSIFY_MASTER_BLUEPRINT.md` §4.6 |
| 21 | AI Synthesis | Cultural Pragmatics Grounding | Grounds LLM evaluator in South Asian / Hinglish / Telugu colloquialisms (*Pulihora*, *Chi po ra*). | System prompt grounding matrix | Culturally contextualized diagnostic scores | Prevents playful flirtatious banter from being scored as toxic | `MAIN_APP_REQUIREMENTS.md` §4.4.2, `ASSIFY_MASTER_BLUEPRINT.md` §4.5 |
| 22 | AI Synthesis | Verifiable Quoted Receipts | Ensures every flagged behavior or cringe quote includes an exact verbatim snippet from chat. | Sanitized message archive | Quoted string snippets | LLM instructed to extract verbatim; hallucinated quotes barred | `MAIN_APP_REQUIREMENTS.md` §4.4.3 |
| 23 | UI Presentation| Theatrical Telemetry Scanner | 4-6s animated radar sweep on white canvas with micro-ticks and Apple HIG haptics. | Loading state signal | Visual radar sweep + status copy | Extends sweep if $>6\text{s}$; shows retry card if $>15\text{s}$ | `MAIN_APP_REQUIREMENTS.md` §3.3 |
| 24 | UI Presentation| 5-Act Paged Theatrical Unboxing | 60fps spring transitions across 5 narrative acts (Forensic intake, Delulu gauge, Power, Flags, Superlatives). | 5-Act Dossier payload | Paged interactive card flow | Navigation allows swipe and tap; retains unboxed state | `MAIN_APP_REQUIREMENTS.md` §3.4, `ASSIFY_MASTER_BLUEPRINT.md` §4.6 |
| 25 | UI Presentation| Delulu Meter Physics Gauge | Animated needle gauge from 0 to target score (0-100%) with circus tier classification and haptic lock-in. | Delulu score integer | Reanimated spring physics gauge | Needle clamps smoothly within [0, 100] bounds | `MAIN_APP_REQUIREMENTS.md` §3.4, `ASSIFY_MASTER_BLUEPRINT.md` §4.6 |
| 26 | UI Presentation| Client-Side Quote Rehydrator | Replaces internal tokens `[USER]` and `[PARTNER]` with human display names before rendering and export. | Sanitized quote string + display names | Rehydrated quote string | Leaves unmapped tokens intact if display name is missing | `MAIN_APP_REQUIREMENTS.md` §3.5, §4.2.3 |
| 27 | UI Presentation| High-Res 9:16 Story Card Exporter | Captures Master Verdict Card and Act Cards as 9:16 PNGs via `react-native-view-shot` to OS Share Sheet. | Component render tree ref | PNG image file in cache directory | Displays error alert if view-shot capture fails | `MAIN_APP_REQUIREMENTS.md` §3.5, `ASSIFY_MASTER_BLUEPRINT.md` §1.3 |
| 28 | UI Architecture| Component-First Layout Primitives | Shared primitives (`StatStrip`, `SegmentedControl`, `EditorialSection`, `ReceiptQuote`) consuming tokens. | Design tokens and props | Standardized UI components | Prevents local StyleSheet container drift across screens | User Global Rules, `constitution.md` Art II |
| 29 | UI Architecture| Anti-Slop Layout Enforcement | Prohibits 20 mobile anti-patterns (no cards-in-cards, no pill collisions, no wireframe borders, light mode). | Screen JSX trees | Polished native HIG interface | Linter/Review catches card-wrapping violations | User Global Rules, `constitution.md` Art III |
| 30 | Storage | Universal Database Provider Contract| `BaseDatabaseProvider` interface defining contacts, messages, chronemics, and dossier operations. | Method invocation with Pydantic DTOs | Typed domain entities | Dispatches typed DatabaseError exceptions | `MAIN_APP_REQUIREMENTS.md` §4.5.2, `ASSIFY_MASTER_BLUEPRINT.md` §4.7 |
| 31 | Storage | SQLite WAL Mode Provider | Local implementation of `BaseDatabaseProvider` in SQLite with WAL mode and busy timeout handling. | SQL statements managed internally | Persisted rows in `.sqlite` file | Handles SQLITE_BUSY with retry backoff | `MAIN_APP_REQUIREMENTS.md` §4.5.3, `ASSIFY_MASTER_BLUEPRINT.md` §4.7 |
| 32 | Storage | Supabase PostgreSQL Cloud Provider | Phase 2 drop-in implementation of `BaseDatabaseProvider` for cloud synchronization. | Same DTO inputs | Remote cloud persistence | Network retry and offline queuing | `MAIN_APP_REQUIREMENTS.md` §4.5.4, `ASSIFY_MASTER_BLUEPRINT.md` §4.7 |
| 33 | Security | Exhaustive 1-Tap Hard Wipe | Truncates all DB tables, deletes cache image files, and clears MMKV storage with zero residue. | User confirmation tap | Guaranteed 0-byte user footprint | Transactional DB rollback if wipe encounters partial failure | `MAIN_APP_REQUIREMENTS.md` §5.1.2 |
| 34 | Security | Per-Contact Swipe Deletion | Deletes all records, messages, chronemics, and dossiers for a specific contact with one action. | Contact ID | Cascading deletion of contact entities | Leaves other contact dossiers completely unaffected | `MAIN_APP_REQUIREMENTS.md` §5.1.3 |
| 35 | Security | Biometric Access Lock Gate | FaceID / TouchID / Android BiometricPrompt guarding app launch and incoming OS Share Sheet intents. | Biometric prompt or device PIN | Access token / session unlock | Prompts retry or fallback to device PIN on failed scan | `MAIN_APP_REQUIREMENTS.md` §5.2 |
| 36 | Security | Offline Vault Access | Browsing past contacts, viewing 5-Act dossiers, biometric auth, and story export function 100% offline. | Local storage queries | Instant UI rendering (0s latency) | Network banner displayed only when user attempts new chat import | `MAIN_APP_REQUIREMENTS.md` §5.3 |
| 37 | Sensory | Subtle Apple HIG Haptics | Tactile pulses limited to selection taps, telemetry ticks, and Delulu gauge lock-in; 0 audio. | Event triggers | Native haptic engine tick | Silently ignored on devices lacking haptic actuators | `MAIN_APP_REQUIREMENTS.md` §5.4 |
| 38 | SDD System | Project Constitution Engine | Supreme legal contract in `.specify/memory/constitution.md` with RFC 2119 invariants and Sync Impact Reports. | Principle definitions + version | Ratified markdown constitution | Analysis halts if plan violates MUST/MUST NOT directives | `constitution.md`, `spec_kit_research_report.md` §2.3.1 |
| 39 | SDD System | Feature Specification Engine | Authors technology-agnostic `spec.md` with prioritized user stories (P1, P2), FR-###, SC-###, and max 3 tags. | User natural language feature description | Validated `spec.md` and `checklists/requirements.md` | Halts if no clear user scenarios can be determined | `speckit-specify/SKILL.md`, `spec_kit_research_report.md` §2.3.2 |
| 40 | SDD System | Ambiguity Clarification Engine | Interactive 10-dimension scan asking up to 5 prioritized questions to resolve upstream ambiguity. | Active `spec.md` | Appended `## Clarifications` section | Warns user of rework risk if clarification is skipped | `speckit-clarify/SKILL.md`, `spec_kit_research_report.md` §2.3.2 |
| 41 | SDD System | Requirements Quality Checklist | Generates "Unit Tests for English" assessing completeness, clarity, and measurability before coding. | Active spec context + domain focus | `checklists/*.md` review artifacts | `/speckit-implement` halts if checklists contain unchecked items | `speckit-checklist/SKILL.md`, `spec_kit_research_report.md` §2.3.6 |
| 42 | SDD System | Technical Implementation Plan Engine| Translates `spec.md` into concrete architecture (`plan.md`, `data-model.md`, `contracts/`, `quickstart.md`). | `spec.md` + `constitution.md` | Technical plan and Phase 1 design artifacts | Aborts with ERROR if Constitution Check gate fails | `speckit-plan/SKILL.md`, `spec_kit_research_report.md` §2.3.3 |
| 43 | SDD System | Dependency-Ordered Task Decomposition| Generates executable `tasks.md` with strict grammar (`- [ ] T### [P] [US#] path/to/file`). | Design artifacts (`plan.md`, `data-model.md`, etc.) | Actionable backlog organized by user story phases | Rejects vague tasks lacking file paths or task IDs | `speckit-tasks/SKILL.md`, `spec_kit_research_report.md` §2.3.4 |
| 44 | SDD System | Cross-Artifact Consistency Analysis | Read-only semantic audit checking duplication, ambiguity, underspecification, and constitution alignment. | `spec.md`, `plan.md`, `tasks.md`, `constitution.md` | Severity-classified analysis report | Read-only; highlights CRITICAL errors for human review | `speckit-analyze/SKILL.md`, `spec_kit_research_report.md` §4.4 |
| 45 | SDD System | Phased Implementation Engine | Executes tasks in isolated steps, verifies checklist gates, creates ignore files, and marks tasks `[X]`. | `tasks.md` + interface contracts | Implemented source files + verified test suites | Halts if tests fail or if checklists have unchecked items | `speckit-implement/SKILL.md`, `spec_kit_research_report.md` §4.1 |
| 46 | SDD System | Append-Only Convergence Audit | Compares codebase against spec/plan/tasks; appends `## Phase N: Convergence` tasks if gaps exist. | Present codebase + specification artifacts | Appended tasks in `tasks.md` | Byte-for-byte unchanged if codebase matches spec completely | `speckit-converge/SKILL.md`, `spec_kit_research_report.md` §4.1 |
| 47 | SDD System | Extension Lifecycle Hook Dispatcher | Event-driven hook execution in `.specify/extensions.yml` before and after lifecycle commands. | Command event triggers | Executed automated scripts/commands | Mandatory hooks (`optional: false`) halt execution until successful | `speckit-*/SKILL.md`, `spec_kit_research_report.md` §4.5 |

---

### 3.2 Edge Cases

| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Participant Validation | WhatsApp export containing only 1 person (self-chat / notes to self). | Ingestion halts immediately with Apple HIG modal: *"Assify needs a 2-person conversation to analyze relationship dynamics."* Zero processing or tokens burned. |
| 2 | Participant Validation | WhatsApp export containing 3+ participants (group chat). | Ingestion halts immediately with modal: *"Assify is built for 1-on-1 situationships. Please export a direct personal chat."* |
| 3 | Message Volume Gate | WhatsApp export containing 28 valid messages (<30 threshold). | Ingestion halts with error banner: *"Need at least 30 messages to uncover the truth."* |
| 4 | Unicode Normalization | Export containing invisible LTR (`\u200e`) and RTL (`\u200f`) marks on every timestamp line. | Parser strips invisible marks before regex matching; parsing succeeds with 100% regex match rate. |
| 5 | Message Hashing | 4 rapid messages sent within the same minute from the same participant. | Distinct hashes generated for all 4 messages because `sequence_index` (source line offset) is included in the SHA-256 payload. Zero DB row collisions. |
| 6 | Zero-Delta Ingestion | User re-exports and uploads an identical, unchanged chat archive. | Ingestion engine detects 0 new message hashes, displays Apple HIG toast: *"Chat is already up to date"*, and opens cached dossier immediately (0s latency, 0 LLM API calls). |
| 7 | Incremental Delta | User uploads chat archive with 45 new messages after 2 weeks. | Skips already-persisted messages via content hash; ingests 45 new messages; computes lifetime chronemics + incremental delta badges (`Delulu +14%`, `Latency slowed by 18m`). |
| 8 | Sleep Gap Clamping | User sends text at 11:30 PM; partner replies at 8:15 AM (8h 45m overnight gap). | Sleep clamping engine recognizes gap spanning 11 PM to 8 AM $>4\text{h}$ and excludes the gap from Median Response Latency calculation. |
| 9 | Terminal Turn | Partner leaves final text of conversation unanswered for 3 days. | Terminal turn exclusion flags the unanswered final message as a terminal turn and omits it from alternating response latency medians. |
| 10 | Chasing Double-Text | User sends 3 messages in 45 seconds, then 1 message 45 minutes later without a partner reply. | First 3 messages merge into Turn 1 (0 double texts); message sent at 45m creates Turn 2 classified strictly as 1 Chasing Double-Text ($\ge 30\text{m}$ gap). |
| 11 | PII Sanitization | Chat message containing an Indian UPI ID (`partner@okhdfcbank`) and mobile (`+91 98765 43210`). | Sanitizer masks to `[ACCOUNT_REDACTED]` and `[PHONE_REDACTED]`. Zero raw PII transmitted to external LLM. |
| 12 | Quote Rehydration | AI returns quote: `[USER]: Why didn't you reply? [PARTNER]: I was asleep`. | Client-side rehydration layer replaces tokens with real names: `"Rohan: Why didn't you reply? Priya: I was asleep"` prior to rendering and story capture. |
| 13 | Network Drop during AI Synthesis | Internet connection drops or LLM API times out after 15 seconds. | Theatrical scanner radar stops; displays Apple HIG card: *"Analysis taking longer than expected"* with a **"Retry Synthesis"** button. Ingested messages remain cached locally; tapping Retry does not require re-uploading file. |
| 14 | Offline Mode | Device in Airplane Mode; user opens app to view existing dossiers. | App unlocks via FaceID/PIN offline, loads dossiers from local SQLite WAL database in 0 seconds, and exports story cards to photo library with zero network calls. |
| 15 | Hard Wipe | User triggers "Wipe All Data" in settings. | Truncates all database tables, purges all cached PNGs in `FileSystem.cacheDirectory`, clears MMKV preferences, and resets app to pristine 0-byte state. |
| 16 | SDD Checklist Gate | User triggers `/speckit-implement` while `checklists/security.md` has 2 unchecked items (`- [ ]`). | Implementation halts immediately with prompt: *"Some checklists have unchecked items. Do you want to proceed anyway? (yes/no)"*, preventing unauthorized bypass of human gates. |
| 17 | SDD Convergence Audit | Codebase implements all functional requirements but omits one error state specified in `spec.md`. | `/speckit-converge` leaves existing tasks unchanged and appends `## Phase N: Convergence` with new task `T038` to `tasks.md`. |
| 18 | SDD Constitution Violation | Proposed technical plan introduces direct SQLite database queries inside a frontend screen route. | `/speckit-analyze` and `/speckit-plan` Constitution Check gate flag a CRITICAL violation against Constitution Article II (Component-First) & Invariant 2 (Provider Isolation); execution aborts. |

---

## 4. Synthesis & Recommendations for Downstream Template Authors

To enable `orchestrator_2` and downstream agents to author pristine, reusable Generic templates (`docs/templates/sdd/generic/`) and project-tailored Reference templates (`docs/templates/sdd/examples/`), the following architectural conventions must be observed:

### 4.1 Structural Conventions for Generic Templates (`docs/templates/sdd/generic/`)
1. **Separation of What vs. How:**
   - `spec.md` generic template must contain explicit prompt-engineering rules prohibiting language/framework names, enforcing measurable success criteria (`SC-###`), user scenarios (`P1`, `P2`), and bounding clarifications to max 3 tags.
   - `plan.md` generic template must include Phase 0 Research (`research.md`), Phase 1 Design (`data-model.md`, `contracts/`, `quickstart.md`), and the Constitution Check gate.
   - `tasks.md` generic template must enforce strict task grammar: `- [ ] [TaskID] [P?] [Story?] Description with exact/file/path`, grouped by user stories for independent MVP delivery.
   - `constitution.md` generic template must mandate RFC 2119 keywords (**MUST**, **MUST NOT**), semantic versioning, and Sync Impact Reports.
   - `checklist.md` generic template must enshrine "Unit Tests for English" and human-reviewer ownership rules.

### 4.2 Structural Conventions for Project-Tailored Reference Templates (`docs/templates/sdd/examples/`)
1. **Concrete Assify Constitution (`docs/templates/sdd/examples/constitution.md`):**
   - Must enshrine the 6 Core Principles:
     - *Article I: Architectural Integrity & Model Primacy* (Zero shortcuts, model evolution over localized patches).
     - *Article II: Component-First Law* (Zero screen-level container drift; components import tokens, screens import components).
     - *Article III: Anti-Slop Enforcement* (Eradicate the 20 native tells; 100% Light Apple HIG `#FFFFFF` canvas, zero dark mode).
     - *Article IV: Mandatory Skill-First Protocol* (Strict adherence to `.agents/skills/`).
     - *Article V: TDD & Evidence Before Completion* (Failing tests first, verification output before claims).
     - *Article VI: Privacy-First Local Forensics & Biometric Sanctuary* (Local SQLite WAL, zero PII leakage, FaceID gate, 1-tap hard wipe).
2. **Concrete Feature Specification (`docs/templates/sdd/examples/spec.md`):**
   - Feature: *WhatsApp Chat Ingestion & 10-Second Telemetry Audit*.
   - User Stories: P1 Instant Share-Sheet Audit (MVP), P2 Longitudinal Delta Re-Analysis, P3 Privacy Sanctuary & Hard Wipe.
   - Measurable SC: 10-second turnaround, 100% participant boundary enforcement, 0 unmasked PII leakage.
3. **Concrete Implementation Plan (`docs/templates/sdd/examples/plan.md`):**
   - Tech Stack: Expo SDK 54 LTS, React Native 0.76+, Zustand + MMKV, Reanimated 3, FastAPI Python 3.12, Universal Database Provider (`SQLiteDatabaseProvider` WAL mode MVP), OpenAI GPT-4o-mini single-pass profiler.
   - Constitution Check: Formally verifies all 6 constitutional articles with pass markers.
   - File Layout: `mobile/src/components/ui/`, `mobile/app/(tabs)/`, `server/api/`, `server/core/telemetry/`.
4. **Concrete Task Ledger (`docs/templates/sdd/examples/tasks.md`):**
   - Dependency-ordered phases: Phase 1 Setup, Phase 2 Foundational (Universal Database Provider + Sanitizer + Chronemics math), Phase 3 User Story 1 (P1 MVP Ingestion & 5-Act Unboxing), Phase 4 User Story 2 (P2 Delta Audit), Phase 5 Polish & Verification.
   - Every task must include sequential Task IDs (`T001`... `T035`), parallel markers `[P]`, story tags `[US1]`, and exact relative file paths.

---
*End of Survey Report.*
