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

## 📱 Active Sprint: Sprint 5 — React Native Mobile Client Architecture & Scaffolding (Days 9–11)
- [ ] `[P0]` Mobile architecture specification (`mobile/MOBILE_SPEC.md`).
- [ ] `[P0]` Initialize React Native Expo SDK 54 project structure (`mobile/`).
- [ ] `[P0]` Design system, dark-mode glassmorphic theme tokens, typography, and Lucide icons.
- [ ] `[P1]` The 17-Act Theatrical Swiper Carousel (TikTok/Stories style vertical swiper).
- [ ] `[P1]` The Delulu Meter animated radial gauge component.
- [ ] `[P1]` The Keep tab with category filter chips and Date Oracle cards.





