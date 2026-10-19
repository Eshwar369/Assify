# 🏛️ ASSIFY — System Architecture & Technical Specifications

> **Product:** ASSIFY (AI-Powered Relationship Intelligence OS)  
> **Target Experience:** Delulu Check Replication with Offline/Self-Hosted Control + Play Store Readiness  
> **Status:** Active Development (Day 0)

---

## 1. High-Level System Architecture

ASSIFY operates on a **Decoupled Client-Server Architecture**:

```
┌────────────────────────────────────────────────────────┐
│                   MOBILE CLIENT                        │
│            React Native (Expo SDK 54)                  │
│                                                        │
│  • Expo Router (File-based navigation)                 │
│  • React Native Reanimated 3 (60 FPS Native Gauges)    │
│  • WhatsApp Intent Receiver (Direct Share Target)      │
│  • God Mode Audio Recorder (expo-av)                   │
└───────────────────────────┬────────────────────────────┘
                            │
               REST / JSON & Token Streaming
       (Local Wi-Fi [Dev] ➜ HTTPS / Cloud [Production])
                            │
┌───────────────────────────▼────────────────────────────┐
│                  BACKEND SERVER                        │
│              Python 3.12+ / FastAPI                    │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Ingestion & Normalization Layer                  │  │
│  │ (WhatsApp .txt/.zip & Instagram JSON Parsers)    │  │
│  └────────────────────────┬─────────────────────────┘  │
│                           │                            │
│  ┌────────────────────────▼─────────────────────────┐  │
│  │ Mathematical Chronemics Telemetry Engine         │  │
│  │ (0-LLM Deterministic Stats: Latency, Initiation) │  │
│  └────────────────────────┬─────────────────────────┘  │
│                           │                            │
│  ┌────────────────────────▼─────────────────────────┐  │
│  │ Multi-Stage LLM Intelligence Engine              │  │
│  │ • 17-Act Theatrical Profiler (gpt-4o-mini)       │  │
│  │ • Doctor Delulu Relationship Coach               │  │
│  │ • Ghost Writer (3-Option Reply Triad)            │  │
│  └────────────────────────┬─────────────────────────┘  │
│                           │                            │
│  ┌────────────────────────▼─────────────────────────┐  │
│  │ Data & Persistence Layer                         │  │
│  │ • SQLite (WAL mode) for Dev & Self-Hosted        │  │
│  │ • Supabase (PostgreSQL) for Play Store Release   │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure

```
Assify/
├── backend/                   # FastAPI Backend
│   ├── database/              # Schema, migrations, DB connection
│   │   ├── schema.sql         # Source of truth SQL DDL
│   │   └── db.py              # SQLite / PostgreSQL connection manager
│   ├── ingestion/             # File parsing & normalization
│   │   ├── parser.py          # WhatsApp regex parser
│   │   └── normalizer.py      # Pydantic message schemas
│   ├── analytics/             # Zero-LLM math analytics
│   │   └── chronemics.py      # Latency, initiation ratio, bursts
│   ├── profiler/              # OpenAI report synthesizer
│   │   ├── acts_schemas.py    # Pydantic models for the 17 Acts
│   │   ├── prompts.py         # System & few-shot prompt templates
│   │   └── synthesizer.py     # Batch LLM execution pipeline
│   ├── coach/                 # Doctor Delulu chat engine
│   │   └── coach_service.py   # Dossier injection & streaming
│   ├── ghost/                 # Ghost Writer reply composer
│   │   └── reply_service.py   # 3-Option triad generator
│   ├── api/                   # FastAPI route handlers
│   │   ├── routes_upload.py   # File upload & status polling
│   │   ├── routes_report.py   # Fetch 17 Acts & stats
│   │   ├── routes_coach.py    # Doctor Delulu chat endpoints
│   │   └── routes_ghost.py    # Ghost writer endpoints
│   ├── config.py              # App settings & env loading
│   ├── main.py                # FastAPI entrypoint
│   └── requirements.txt       # Python dependencies
│
├── mobile/                    # React Native Expo App (SDK 54)
│   ├── app/                   # Expo Router screens
│   │   ├── (tabs)/            # Bottom tab bar navigator
│   │   │   ├── index.tsx      # Screen 1: Import Hub
│   │   │   ├── ghost.tsx      # Screen 4: Ghost Writer Pad
│   │   │   └── settings.tsx   # Settings & connections
│   │   ├── report/            # Screen 2: Theatrical Report
│   │   │   └── [id].tsx       # Delulu Meter, 17 Acts, Evidence Locker
│   │   ├── coach/             # Screen 3: Doctor Delulu Chatroom
│   │   │   └── [contact].tsx  # Streaming messenger interface
│   │   └── _layout.tsx        # Root layout, theme provider
│   ├── components/            # Reusable UI components
│   │   ├── DeluluMeter.tsx    # Reanimated circular SVG gauge
│   │   ├── PowerBar.tsx       # Dynamic split progress bar
│   │   ├── CharacterCard.tsx  # RPG stat card
│   │   └── ReceiptCard.tsx    # Swipeable evidence receipt
│   ├── theme/                 # Dark Cyber-Romance colors & fonts
│   │   └── colors.ts
│   ├── services/              # API client & fetch wrappers
│   ├── package.json
│   └── app.json               # Expo config (with WhatsApp Intent filter)
│
├── delulu/                    # Reverse-engineered APK artifacts & docs
├── legacy/                    # Archived past experiments
├── AGENTS.md                  # Collaboration protocol & rules
├── ARCHITECTURE.md            # This document
├── ROADMAP.md                 # Product milestones
├── TODO.md                    # Active sprint board
├── DECISIONS.md               # Architectural Decision Records (ADRs)
└── IDEAS.md                   # Feature backlog & growth ideas
```

---

## 3. Database Specification: Schema 2.0

```sql
-- 1. Raw Normalized Messages
CREATE TABLE IF NOT EXISTS messages (
    id              TEXT PRIMARY KEY,
    contact_name    TEXT NOT NULL,
    platform        TEXT NOT NULL DEFAULT 'whatsapp',
    time_stamp      DATETIME NOT NULL,
    sender          TEXT NOT NULL,         -- 'user' | 'contact'
    content         TEXT NOT NULL,
    media_type      TEXT DEFAULT 'text',   -- 'text' | 'voice' | 'image' | 'system'
    is_deleted      BOOLEAN DEFAULT 0,
    is_question     BOOLEAN DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_msg_contact_time ON messages(contact_name, time_stamp DESC);

-- 2. Mathematical Chronemics Telemetry (0 LLM cost)
CREATE TABLE IF NOT EXISTS chronemics_stats (
    contact_name            TEXT PRIMARY KEY,
    total_messages          INTEGER NOT NULL,
    user_msg_count          INTEGER NOT NULL,
    contact_msg_count       INTEGER NOT NULL,
    user_initiation_pct     REAL NOT NULL,
    contact_initiation_pct  REAL NOT NULL,
    user_median_delay_m     REAL NOT NULL,
    contact_median_delay_m  REAL NOT NULL,
    user_double_texts       INTEGER NOT NULL,
    contact_double_texts    INTEGER NOT NULL,
    late_night_pct          REAL NOT NULL,
    longest_gap_hours       REAL NOT NULL,
    calculated_at           DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. High-Level Relationship Profile
CREATE TABLE IF NOT EXISTS relationship_profiles (
    contact_name             TEXT PRIMARY KEY,
    status_label             TEXT NOT NULL,
    delulu_score             INTEGER NOT NULL,
    power_ratio_user         INTEGER NOT NULL,
    power_ratio_contact      INTEGER NOT NULL,
    user_attachment_style    TEXT NOT NULL,
    contact_attachment_style TEXT NOT NULL,
    chemistry_score          INTEGER NOT NULL,
    survival_probability     INTEGER NOT NULL,
    overall_diagnosis        TEXT NOT NULL,
    vibe_mode                TEXT DEFAULT 'unhinged',
    analyzed_at              DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. The 17 Theatrical Acts (JSON Payload per Act)
CREATE TABLE IF NOT EXISTS report_acts (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_name TEXT NOT NULL,
    act_number   INTEGER NOT NULL,
    act_name     TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(contact_name, act_number)
);

-- 5. Evidence Locker Receipts
CREATE TABLE IF NOT EXISTS evidence_locker (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_name  TEXT NOT NULL,
    flag_type     TEXT NOT NULL,        -- 'red_flag' | 'green_flag' | 'power_play'
    severity      INTEGER DEFAULT 3,    -- 1 to 5
    category      TEXT NOT NULL,
    quote         TEXT NOT NULL,
    time_stamp    DATETIME,
    ai_commentary TEXT NOT NULL
);

-- 6. Greatest Hits
CREATE TABLE IF NOT EXISTS greatest_hits (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_name  TEXT NOT NULL,
    category      TEXT NOT NULL,        -- 'cringe' | 'comedy' | 'delusional' | 'comeback'
    quote         TEXT NOT NULL,
    sender        TEXT NOT NULL,
    time_stamp    DATETIME,
    why_legendary TEXT NOT NULL
);

-- 7. Doctor Delulu Coaching Sessions & Messages
CREATE TABLE IF NOT EXISTS coaching_sessions (
    id           TEXT PRIMARY KEY,
    contact_name TEXT NOT NULL,
    started_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    title        TEXT
);

CREATE TABLE IF NOT EXISTS coaching_messages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    role       TEXT NOT NULL,           -- 'user' | 'assistant'
    content    TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(session_id) REFERENCES coaching_sessions(id) ON DELETE CASCADE
);
```

---

## 4. API Surface Contract

| Method | Endpoint | Input Payload | Output Payload | Description |
|---|---|---|---|---|
| `POST` | `/api/upload` | `multipart/form-data` (file, contact, vibe) | `{ task_id, status }` | Ingests chat and spawns analysis |
| `GET` | `/api/status/{task_id}` | Path param `task_id` | `{ progress, current_step, is_done }` | Polling for analysis progress |
| `GET` | `/api/contacts` | None | `[ { contact_name, delulu_score, status } ]` | List analyzed contacts |
| `GET` | `/api/report/{contact}` | Path param `contact` | `{ profile, chronemics, acts: [...] }` | Full report data for mobile UI |
| `POST` | `/api/coach/chat` | `{ contact, message, session_id }` | SSE Stream / JSON tokens | Multi-turn chat with Doctor Delulu |
| `POST` | `/api/ghost/reply` | `{ contact, vibe, last_messages: [...] }`| `{ replies: [Option A, B, C] }` | 3-Option Triad reply generator |
| `POST` | `/api/ghost/voice` | `multipart/form-data` (audio file) | `{ transcript, polished_reply }` | God Mode speech-to-intent reply |
