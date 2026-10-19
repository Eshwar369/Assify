# 📝 ASSIFY — Active Sprint Board (TODO.md)

> **Current Sprint:** Sprint 1 — Backend Scaffold & Schema 2.0 (Days 0–1)  
> **Status:** In Progress  
> **Target:** A fully initialized, clean `backend/` environment with Schema 2.0 and WAL SQLite connection verified.

---

## 🔥 Active Sprint Tasks

### 📍 Milestone 0: Workspace Scaffolding (Day 0)
- [ ] `[P0]` **Create `backend/` subdirectories:**
  - `backend/database/`
  - `backend/ingestion/`
  - `backend/analytics/`
  - `backend/profiler/`
  - `backend/coach/`
  - `backend/ghost/`
  - `backend/api/`
- [ ] `[P0]` **Create `backend/requirements.txt`:**
  - Add `fastapi>=0.115.0`, `uvicorn[standard]>=0.32.0`, `pydantic>=2.9.0`, `openai>=1.50.0`, `python-dotenv>=1.0.0`, `python-multipart>=0.0.12`.
- [ ] `[P0]` **Verify `.env` configuration:**
  - Ensure `OPENAI_API_KEY` is present and non-empty.

---

### 📍 Milestone 1: Database Foundation & Schema 2.0 (Day 1)
- [ ] `[P0]` **Draft `backend/database/schema.sql`:**
  - Table 1: `messages` (id, contact_name, time_stamp, sender, content, media_type, is_deleted, is_question).
  - Table 2: `chronemics_stats` (contact_name, total_messages, user_initiation_pct, contact_initiation_pct, user_median_delay_m, contact_median_delay_m, user_double_texts, contact_double_texts, late_night_pct, longest_gap_hours).
  - Table 3: `relationship_profiles` (contact_name, status_label, delulu_score, power_ratio_user, power_ratio_contact, user_attachment_style, contact_attachment_style, chemistry_score, survival_probability, overall_diagnosis).
  - Table 4: `report_acts` (id, contact_name, act_number, act_name, payload_json, generated_at).
  - Table 5: `evidence_locker` (id, contact_name, flag_type, severity, category, quote, time_stamp, ai_commentary).
  - Table 6: `greatest_hits` (id, contact_name, category, quote, sender, time_stamp, why_legendary).
  - Table 7: `coaching_sessions` & `coaching_messages`.
- [ ] `[P0]` **Build `backend/database/db.py`:**
  - Function `get_db_connection(db_path)` enabling `PRAGMA journal_mode=WAL;` and `sqlite3.Row` dictionary mapping.
  - Function `init_db(db_path, schema_path)` to automatically run `schema.sql`.
- [ ] `[P1]` **Write Sanity Verification Script (`backend/database/test_db.py`):**
  - Verify that running `init_db()` creates all 7 tables with zero errors.

---

## ⏳ Upcoming Sprint: Sprint 2 — Chat Ingestion & Chronemics Math (Days 2–3)
- [ ] `[P0]` Multi-line WhatsApp regex parser (`backend/ingestion/parser.py`).
- [ ] `[P0]` Mathematical Chronemics calculation engine (`backend/analytics/chronemics.py`).
- [ ] `[P1]` Populate `messages` and `chronemics_stats` from sample chat export.
