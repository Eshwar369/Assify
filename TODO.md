# 📝 ASSIFY — Active Sprint Board (TODO.md)

> **Current Sprint:** Sprint 1 — Backend Scaffold & Schema 2.0 (Days 0–1)  
> **Status:** In Progress  
> **Target:** A fully initialized, clean `backend/` environment with Schema 2.0 and WAL SQLite connection verified.

---

## 🔥 Active Sprint Tasks

### 📍 Milestone 0: Workspace Scaffolding (Day 0)
- [x] `[P0]` **Create `backend/` subdirectories:**
  - `backend/database/`
  - `backend/ingestion/`
  - `backend/analytics/`
  - `backend/profiler/`
  - `backend/coach/`
  - `backend/ghost/`
  - `backend/api/`
- [x] `[P0]` **Create `backend/requirements.txt`:**
  - Added `fastapi>=0.115.0`, `uvicorn[standard]>=0.32.0`, `pydantic>=2.9.0`, `openai>=1.50.0`, `python-dotenv>=1.0.0`, `python-multipart>=0.0.12`.
- [x] `[P0]` **Verify dependencies installed in `.venv`:**
  - FastAPI, uvicorn, openai, and python-multipart installed and verified.

---

### 📍 Milestone 1: Database Foundation & Schema 2.0 (Day 1)
- [x] `[P0]` **Draft `backend/database/schema.sql` (Dynamic Contact Aliasing):**
  - Table 1: `contacts` (raw_name, display_name alias, user_name).
  - Table 2: `messages` (contact_id, time_stamp, sender role, raw_sender, content, media_path, media_meta).
  - Table 3: `chronemics_stats` (0-LLM initiation ratio, median delay, double-texts).
  - Table 4: `relationship_profiles` (delulu_score, power_ratio, attachment_styles).
  - Table 5: `report_acts` (act_number, act_name, payload_json).
  - Table 6: `evidence_locker` (quoted receipts, severity 1-5, commentary).
  - Table 7: `greatest_hits` (cringe, comedy, delusional quotes).
  - Table 8: `advisor_sessions` & `advisor_messages`.
  - Table 9: `relationship_diary` (monthly story chapters over time).
  - Table 10: `preferences_vault` (The Keep: gifts, movies, food, places).
- [x] `[P0]` **Build `backend/database/db.py`:**
  - `get_db_connection()` with WAL mode, foreign keys, and `sqlite3.Row` mapping.
  - `init_db()` to automatically execute DDL idempotently.
- [x] `[P1]` **Verify Database Creation:**
  - Schema executed on `backend/assify.db`; all 10 tables verified.

---

## ⏳ Sprint 2 — Chat Ingestion & Neuro-Symbolic Chronemics (Days 2–3)
- [x] `[P0]` Multi-line WhatsApp regex parser (`backend/ingestion/parser.py`) — Handles iOS & Android, multi-line continuations, system messages, media tagging, sender detection.
- [x] `[P0]` Neuro-Symbolic Chronemics architecture specification (`backend/analytics/CHRONEMICS_SPEC.md`).
- [x] `[P0]` Chronemics calculation engine (`backend/analytics/chronemics.py`) — Burst aggregation, silence seams, GPT-4o-mini seam classification, grounded metric synthesis.
- [x] `[P1]` End-to-end Chronemics live verification (`backend/analytics/run_analysis.py`) — Tested on 14,032 real messages with GPT-4o-mini.
- [x] `[P0]` Ingestion service & database persistence (`backend/ingestion/ingest_service.py`) — Single-transaction atomic write of contacts, messages, chronemics, and Keep items in 0.19s.

---

## 🏰 Sprint 2.5 — The Keep: Relationship Memory & Date Oracle Engine
- [x] `[P0]` Master Product Specification for The Keep (`THE_KEEP_SPEC.md`).
- [x] `[P0]` Database Schema 2.1 migration for `preferences_vault` (target_person, ai_generated, metadata).
- [x] `[P0]` 2-Stage Neuro-Symbolic Funnel in `backend/ingestion/preference_tagger.py`:
  - Stage 1: Broad multi-category trigger miner (food, movie, gift, place, dislike, nickname, inside_joke).
  - Stage 2: Context stitching with preceding message turns (pronoun & link resolution).
  - Stage 3: LLM Entity Extraction & Banter/Sarcasm Filter (`gpt-4o-mini`).
  - Stage 4: AI Date Idea & Gift Oracle synthesis.
- [x] `[P1]` Integrate into `ingest_service.py` and run live test on 39,154 messages in `data/Chatty/19-10-2026/`.

---

## 🎭 Sprint 3 — The 17 Theatrical Acts & 4-Epoch Grounded Profiler (Days 4–6)
- [x] `[P0]` Pydantic models for all 17 Acts (`backend/profiler/acts_schemas.py`).
- [x] `[P0]` The 4-Epoch Relational Sampler & Grounding Matrix (`backend/profiler/synthesizer.py`):
  - Dynamic 4-epoch partitioning (Genesis, Crucible, Equilibrium, Present Reality with 75% recency weight).
  - Deterministic Statistical Grounding Matrix (hard volume, latency, and archetype bounds).
  - Cultural Pragmatics & Sociolinguistic Decorum Engine (Telugu/Hinglish banter, family privacy).
  - Debiased dynamic archetype generation (zero stereotyping).
- [x] `[P0]` The 4-Pass Synthesizer Engine with `gpt-4o-mini`:
  - Pass 1: Global Relationship Diagnosis, Delulu Score, and Power Dynamic.
  - Pass 2: Acts 1–6 (Opening, Delulu Meter, Behavioral Profiles, Hidden Dynamics, Power Plays, Breakdown).
  - Pass 3: Acts 7–12 (Chemistry Audit, Digital Rhythm, 4-Epoch Timeline, Red/Green Flags, Pop Culture).
  - Pass 4: Acts 13–17 (Simulations, Playbook, Greatest Hits, Awards, Final Verdict).
- [x] `[P1]` Populate `relationship_profiles` and `report_acts` (all 17 acts) in SQLite for 39,154 messages.
- [x] `[P1]` End-to-end live verification (`backend/profiler/run_profiler.py`) on full 39,154 message chat in 35s.

---

## ⚡ Sprint 4 — FastAPI Endpoints & Contract Serving (Days 7–8)
- [x] `[P0]` FastAPI application entry point (`backend/main.py`) with CORS for React Native Expo.
- [x] `[P0]` Report endpoints (`GET /api/report/{contact_id}`, `GET /api/report/{contact_id}/acts`).
- [x] `[P0]` Ingestion endpoint (`POST /api/ingest/upload`).
- [x] `[P1]` The Keep endpoints (`GET /api/keep/{contact_id}`, `POST /api/keep/{contact_id}/item`, `PATCH`, `DELETE`).
- [x] `[P1]` Evidence Locker endpoints (`GET /api/evidence/{contact_id}`, `GET /api/greatest-hits/{contact_id}`).
- [x] `[P0]` Contacts listing endpoint (`GET /api/contacts`).
- [x] `[P1]` Full API contract verification using `TestClient` (100% passed).

---

## 📱 Sprint 5 — React Native Mobile Client Architecture & Scaffolding (Days 9–11)
- [x] `[P0]` Mobile architecture specification (`mobile/MOBILE_SPEC.md`).
- [x] `[P0]` Initialize React Native Expo SDK project structure with TypeScript and Expo Router (`mobile/`).
- [x] `[P0]` Design system: Apple-grade minimalist luxury theme tokens with Citron Gold (`#FFD60A`), Electric Rose (`#FF375F`), and Deep Obsidian (`#08090E`).
- [x] `[P0]` 4-Pillar Bottom Tab Navigation:
  - Tab 1: **Profiler** (Master Dossier, Delulu Meter, Power Slider, Archetype cards, Launch CTA).
  - Tab 2: **The Keep** (8-Chamber memory vault, category filter chips, Date Oracle recommendations).
  - Tab 3: **Coach** (Doctor Assify tactical wingman chat UI with pre-loaded context).
  - Tab 4: **Timeline** (4-Epoch relational evolution story cards).
- [x] `[P1]` The 17-Act Theatrical Swiper Carousel (`acts-modal.tsx`):
  - TikTok/Stories-style full-screen vertical snap swiper.
  - 17-segment illuminated progress bar header.
  - Interactive cards for each Act (Receipts, Quotes, Pop Culture, Superlatives, Verdict).
  - 1-tap card sharing with haptic feedback.
- [x] `[P1]` Animated `DeluluMeter` SVG radial score gauge with glow and circus badge.
- [x] `[P1]` Bidirectional `PowerSlider` dual-tone balance widget.
- [x] `[P1]` Full production web and native bundle verification via Metro (0 errors, 100% clean type-check).

---

## 🎨 Sprint 5.5 — Apple Design & Delulu Benchmark Complete Frontend Redesign
- [x] `[P0]` **Design Audit & Planning**: Grounded in `apple-design` skill (Apple HIG 5 Lenses) and Delulu APK reverse-engineered blueprint (`delulu/06_MOBILE_APP_ARCHITECTURE_AND_UI_BLUEPRINT.md`).
- [x] `[P0]` **Design System Tokens Upgrade** (`theme.ts`): Refined OLED Midnight `#07080C` canvas, WCAG AAA contrast hierarchy, sub-pixel gleam borders, and SF Pro typographic scale.
- [x] `[P0]` **Core Visual Components Upgrade**:
  - `DeluluMeter.tsx`: Reanimated cubic-spring progress sweep, ambient glow aura, and dynamic tier badges ('Romantic Clownery', 'Terminal Delulu').
  - `PowerSlider.tsx`: Tactical parity badge, forensic leverage commentary note, and bidirectional gradient track.
  - `GlassCard.tsx`: Frosted glassmorphism container with subtle rim lighting.
  - `WhatsAppDropzone.tsx`: Sleek chat dropzone with Vibe calibration toggle (🧠 Therapy vs 🔥 Unhinged).
- [x] `[P0]` **Screen 1 Redesign** (`index.tsx`): Integrated WhatsApp Dropzone, active contact switcher sheet, hero dossier, dynamic archetypes, and 2x2 stats grid.
- [x] `[P0]` **Screen 2 Redesign** (`acts-modal.tsx`): 17-tick story progress header, tailored card designs (RPG stats, Red Flag receipts, Pop culture delusion gap, Trophy awards, Courtroom verdict), and native share sheet.
- [x] `[P0]` **Screen 3 Redesign** (`keep.tsx`): Luxury memory vault, AI Date Oracle recommendation card with 1-tap share, category counter chips, and quote context bubbles.
- [x] `[P0]` **Screen 4 Redesign** (`coach.tsx`): Tactical wingman messenger with Therapy vs Unhinged mode toggle, Ghost Writer 3-reply triad (Rizz, Calm, Roast), and contextual relationship advice.
- [x] `[P0]` **Screen 5 Redesign** (`timeline.tsx`): Vertical connected glowing node spine with 75% recency weight indicator and historical chat milestones.
- [x] `[P0]` **Dock & Navigation Polish** (`(tabs)/_layout.tsx`): Elevated docked frosted bar with active icon glow; 100% clean compilation verified (`npx tsc --noEmit` exited code 0).

---

## 🏛️ Sprint 5.6 — Centralized Component-Driven Architecture (Apple Light Edition)
- [x] `[P0]` **Codify Component-First Law & Skill-First Protocol** in `GEMINI.md` and `AGENTS.md`.
- [x] `[P0]` **Extract 5 Centralized Layout Primitives** in `mobile/src/components/ui/`:
  - `ScreenContainer.tsx`: SafeArea, 480px centered desktop canvas, `TabBarContext` auto-hiding scroll hook, and uniform padding.
  - `SegmentedControl.tsx`: Unified `#F5F5F7` track with full-pill radius, floating `#FFFFFF` active indicator, and haptics.
  - `StatStrip.tsx`: Borderless multi-column metric row separated by vertical sub-pixel hairlines (`StyleSheet.hairlineWidth`), eliminating "cards-inside-cards" (Anti-Slop Tell #7).
  - `EditorialSection.tsx`: Standardized section uppercase header, subtitle, optional divider, and uniform 32px breathing room.
  - `ReceiptQuote.tsx`: Borderless quote with left gold/rose 2.5px accent line, verified chat seal, and timestamps.
- [x] `[P0]` **Refactor All 4 Tab Screens to Centralized Primitives**:
  - `index.tsx` (Radar): Refactored to `<ScreenContainer>`, `<SegmentedControl>`, `<LightDeluluGauge>`, `<StatStrip>` (4 chronemics metrics), `<ReceiptQuote>`, and `<EditorialSection>`.
  - `timeline.tsx` (Fever Chart): Refactored to `<ScreenContainer>`, `<SegmentedControl>`, `<StatStrip>` (3 epoch metrics), `<ReceiptQuote>`, and `<EditorialSection>`.
  - `coach.tsx` (Tactics): Refactored to `<SegmentedControl>` for Doctor Delulu vs Ghost Writer, and `<ReceiptQuote>` for the reply triad.
  - `keep.tsx` (The Keep): Refactored to `<ScreenContainer>`, `<ReceiptQuote>`, and `<EditorialSection>`.
  - `_layout.tsx`: Wrapped tabs in `<TabBarProvider>` with auto-hide floating dock and concise labels.
- [x] `[P0]` **Build & Typecheck Verification**: `npx tsc --noEmit` passing with 0 errors across entire workspace.
- [x] `[P0]` **Git Checkpoint Committed**: `f3e8a09` feat(ui): implement centralized layout primitives and refactor tab screens.

---

## 🛡️ Sprint 5.7 — Eliminate the "Truman Show": Real Ingestion, Async Polling & PII-Safe Pipeline
- [x] `[P0]` **Pre-LLM PII Sanitization Engine** (`backend/ingestion/sanitizer.py`):
  - Strips phone numbers (international, US, and Indian 10-digit formats).
  - Strips email addresses.
  - Strips 16-digit card numbers and UPI handles (`@oksbi`, `@paytm`, `@okhdfcbank`, etc.).
  - Deterministically maps participant names to tokens (`[USER]`, `[PARTNER]`).
  - Integrated into `sample_representative_messages` in `backend/profiler/synthesizer.py` across all 4 LLM passes.
- [x] `[P0]` **Parser Hardening** (`backend/ingestion/parser.py`):
  - Replaced process-salted `hash()` with deterministic MD5 8-character hex message IDs (Bug 6.1).
  - Added full support for 24-hour seconds timestamps (`%d/%m/%y, %H:%M:%S`, `%d/%m/%Y, %H:%M:%S`, `%Y-%m-%d, %H:%M:%S`) preventing timestamp sorting corruption (Bug 6.2).
- [x] `[P0]` **Asynchronous Background Job & Status Polling Pipeline** (`backend/api/ingest.py`, `backend/main.py`):
  - Converted `POST /api/ingest/upload` (and alias `POST /api/upload`) to return HTTP 202 Accepted immediately.
  - Offloaded long-running analysis to a dedicated `ThreadPoolExecutor` worker, eliminating FastAPI event-loop blocking (Flaw 3.1).
  - Implemented real polling endpoint `GET /api/status/{task_id}` and `GET /api/ingest/status/{task_id}` returning progress stages (10%, 30%, 55%, 80%, 100%).
- [x] `[P0]` **Mobile Client Dynamic Networking & Ingestion Client** (`mobile/src/services/api.ts`):
  - Replaced hardcoded `10.0.2.2` with dynamic packager host resolution (`Constants.expoConfig?.hostUri` / `EXPO_PUBLIC_API_URL`).
  - Implemented `uploadChatArchive()` with real multipart `FormData` upload.
  - Implemented `pollTaskStatus()` with structured status typing.
- [x] `[P0]` **Native Document Picker & Reanimated Progress Tracker** (`mobile/src/components/WhatsAppDropzone.tsx`, `index.tsx`):
  - Installed and wired `expo-document-picker` for real `.txt` and `.zip` file picking, eliminating the hardcoded `_chat_sleepless_zombiee.txt`.
  - Replaced fake 1,200ms `setTimeout` in `index.tsx` with real background upload and polling loop.
  - Built an animated UI-thread progress bar using React Native Reanimated (`animate-expo` compliance).
  - Eliminated Native Slop Tell #1 (Web `<Modal>`).
- [x] `[P0]` **Automated Test Coverage (100% Pass Rate)**:
  - 13 backend unit and API tests in `backend/tests/` verifying parser, PII sanitizer, and async polling via FastAPI `TestClient`.
  - Mobile TypeScript build passing with 0 errors via `npx tsc --noEmit`.

---

## 🚀 Sprint 6 — End-to-End Integration, Sound/Haptics & Polish (Days 12–14)
- [ ] `[P0]` Connect live WhatsApp file export sharing via native Android intent / Share Sheet.
- [ ] `[P0]` Real-time streaming token animation for Doctor Assify Coach responses.
- [ ] `[P1]` Sound effects (subtle pop on card swipe, celebratory fanfare on Act 16 awards).
- [ ] `[P1]` EAS build profile configuration (`eas.json`) for Android Play Store (`.aab`) bundle.






