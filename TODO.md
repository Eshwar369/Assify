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
- [ ] `[P0]` 2-Stage Neuro-Symbolic Funnel in `backend/ingestion/preference_tagger.py`:
  - Stage 1: Broad multi-category trigger miner (food, movie, gift, place, dislike, nickname, inside_joke).
  - Stage 2: Context stitching with preceding message turns (pronoun & link resolution).
  - Stage 3: LLM Entity Extraction & Banter/Sarcasm Filter (`gpt-4o-mini`).
  - Stage 4: AI Date Idea & Gift Oracle synthesis.
- [ ] `[P1]` Integrate into `ingest_service.py` and run live test on 14,032 messages in `data/assify_data.txt`.


---

## 🎯 Active Sprint: Sprint 3 — The 17 Theatrical Acts & Profiler (Days 4–6)
- [ ] `[P0]` Pydantic models for all 17 Acts (`backend/profiler/acts_schemas.py`).
- [ ] `[P0]` The 4-Pass Synthesizer Engine with `gpt-4o-mini` (`backend/profiler/synthesizer.py`):
  - Pass 1: Global Relationship Diagnosis, Delulu Score, and Power Dynamic.
  - Pass 2: Acts 1–6 (The Surface & Rhythm: Vibe, Delay, Double Texts, Initiation).
  - Pass 3: Acts 7–12 (The Psychology & Power: Attachment styles, red/green flags, receipts).
  - Pass 4: Acts 13–17 (The Forecast & Final Verdict: Greatest Hits, Survival Odds, Roast).
- [ ] `[P1]` Populate `relationship_profiles`, `report_acts`, `evidence_locker`, and `greatest_hits` in SQLite.



