# 🗺️ ASSIFY — Product Roadmap & Milestone Tracking

> **Mission:** Build a viral, production-ready mobile relationship intelligence OS (Delulu Check replica)  
> **Status:** Phase 1 (Active)

---

## 📍 Phase Overview

| Phase | Milestone Name | Status | Target Deliverable |
|---|---|---|---|
| **Phase 1** | **Backend Scaffold & Database 2.0** | 🟡 In Progress | Clean `backend/` scaffold, `schema.sql`, DB connection |
| **Phase 2** | **Ingestion & Chronemics Telemetry** | ⚪ Upcoming | WhatsApp parser, 0-LLM initiation & latency math |
| **Phase 3** | **17-Act Theatrical Profiler** | ⚪ Upcoming | OpenAI `gpt-4o-mini` multi-act synthesis pipeline |
| **Phase 4** | **FastAPI REST Service** | ⚪ Upcoming | Local REST API + Swagger documentation |
| **Phase 5** | **Expo SDK 54 Mobile Shell** | ⚪ Upcoming | React Native app on physical phone with dark theme |
| **Phase 6** | **Theatrical Report & Animated Gauge** | ⚪ Upcoming | 60 FPS circular Delulu Meter, power bar, stat cards |
| **Phase 7** | **Doctor Delulu & Ghost Writer UI** | ⚪ Upcoming | AI coach chatroom, 3-Option reply triad, voice intent |
| **Phase 8** | **Production & Play Store Release** | ⚪ Upcoming | EAS build (`.aab`), Supabase migration, store launch |

---

## 🎯 Detailed Phase Specifications

### Phase 1: Backend Scaffold & Database 2.0 (Day 0 – 1)
- [ ] Initialize `backend/` directory structure.
- [ ] Setup `backend/requirements.txt` (`fastapi`, `uvicorn`, `pydantic`, `openai`, `python-dotenv`).
- [ ] Implement `backend/database/schema.sql` (Schema 2.0 with all 7 tables).
- [ ] Implement `backend/database/db.py` connection manager with SQLite WAL mode.
- [ ] Verify database initialization and migrations.

### Phase 2: Ingestion & Chronemics Telemetry (Day 2 – 3)
- [ ] Build robust multi-line WhatsApp `.txt` regex parser in `backend/ingestion/parser.py`.
- [ ] Normalize sender attribution (`'user'` vs `'contact'`) and flag system/deleted messages.
- [ ] Build `backend/analytics/chronemics.py` to calculate:
  - Initiation ratio (% of conversations started by You vs Her).
  - Median response latency ($\Delta t$) for both parties.
  - Double/triple text counts, late-night chat percentages, ghosting gaps.
- [ ] Write computed statistics into `chronemics_stats` table.

### Phase 3: The 17 Theatrical Acts & OpenAI Profiler (Day 4 – 6)
- [ ] Define Pydantic models for all 17 Acts in `backend/profiler/acts_schemas.py`.
- [ ] Build Milestone Dialogue Extractor to select top 40 dramatic dialogue exchanges.
- [ ] Implement the 4-Pass Synthesizer with `gpt-4o-mini`:
  - **Pass 1 (Metric Foundation):** Act 1 Opening, Act 2 Delulu Meter, Act 4 Character Stats.
  - **Pass 2 (Psychological Audit):** Act 3 Behavioral Profiles, Act 5 Power Plays, Act 7 Flirting Forensics.
  - **Pass 3 (Receipts & Evidence):** Act 9 Timeline of Decay, Act 10 Red Flags, Act 15 Greatest Hits.
  - **Pass 4 (Strategy & Social):** Act 12 Pop Culture, Act 13 Simulation, Act 14 Strategy, Act 16 Awards.
- [ ] Save outputs to `report_acts`, `relationship_profiles`, and `evidence_locker`.

### Phase 4: FastAPI REST Service (Day 7 – 8)
- [ ] Implement `POST /api/upload` (multipart WhatsApp file ingestion).
- [ ] Implement `GET /api/status/{task_id}` for mobile polling.
- [ ] Implement `GET /api/contacts` and `GET /api/report/{contact}`.
- [ ] Implement `POST /api/coach/chat` (streaming Doctor Delulu completions with dossier injection).
- [ ] Implement `POST /api/ghost/reply` (sub-second 3-option calibrated reply triad).

### Phase 5: Expo SDK 54 Mobile Shell (Day 9 – 10)
- [ ] Scaffold React Native Expo SDK 54 TypeScript project in `mobile/`.
- [ ] Setup Expo Router file-based navigation (`app/(tabs)/`).
- [ ] Implement dark Cyber-Romance design system (`#0A0A0E`, Neon Pink `#FF2E93`, Violet `#8B5CF6`).
- [ ] Build Screen 1: Import Hub with file picker and Vibe toggle (Therapy vs Unhinged).
- [ ] Configure Android Intent Filter for direct WhatsApp share sheet export.

### Phase 6: Theatrical Report & Animated Gauge (Day 11 – 12)
- [ ] Build `DeluluMeter.tsx` using `react-native-reanimated` (60 FPS circular SVG gauge with spinning needle).
- [ ] Build `PowerBar.tsx` (dynamic split progress slider showing power imbalance).
- [ ] Build `CharacterCard.tsx` (RPG stat bars for Patience, Simp Factor, Defensiveness).
- [ ] Build `ReceiptCard.tsx` (swipeable evidence receipts with severity pills).
- [ ] Build Strategy Handbook interactive checklist (Dos & Don'ts).

### Phase 7: Doctor Delulu & Ghost Writer UI (Day 13 – 14)
- [ ] Build `coach/[contact].tsx` messenger interface with pulsing avatar aura and dynamic suggestion pills.
- [ ] Connect streaming responses from FastAPI backend.
- [ ] Build `ghost.tsx` reply composer with 1-tap copy and haptics.
- [ ] Integrate `expo-av` for God Mode hold-to-talk microphone.

### Phase 8: Production Release & Play Store Deployment
- [ ] Connect SQLite data access layer to Supabase (PostgreSQL).
- [ ] Configure `app.json` with Play Store app icons, splash screens, and package name (`com.assify.os`).
- [ ] Build release `.aab` with EAS Build (`eas build -p android`).
- [ ] Deploy FastAPI backend to Railway/Render.
