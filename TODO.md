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

## ⏳ Active Sprint: Sprint 2 — Chat Ingestion & Neuro-Symbolic Chronemics (Days 2–3)
- [x] `[P0]` Multi-line WhatsApp regex parser (`backend/ingestion/parser.py`) — Handles iOS & Android, multi-line continuations, system messages, media tagging, sender detection.
- [x] `[P0]` Neuro-Symbolic Chronemics architecture specification (`backend/analytics/CHRONEMICS_SPEC.md`).
- [x] `[P0]` Chronemics calculation engine (`backend/analytics/chronemics.py`) — Burst aggregation, silence seams, GPT-4o-mini seam classification, grounded metric synthesis.
- [x] `[P1]` End-to-end Chronemics live verification (`backend/analytics/run_analysis.py`) — Tested on 14,032 real messages with GPT-4o-mini.
- [ ] `[P0]` Ingestion service & database persistence (`backend/ingestion/ingest_service.py`).
- [ ] `[P2]` Preference & Gift extractor rule-tagger for The Keep (`backend/ingestion/preference_tagger.py`).


