# 📱 ASSIFY — Delulu Mobile Replication Masterplan (Day 0 to Day 14)

> **Branch:** `reverse-engineering-app`  
> **Mission:** Build a production-grade, viral relationship intelligence mobile app replicating the exact UX/UI of Delulu Check (React Native Expo 54) backed by a modern FastAPI + OpenAI backend, starting from Day 0 with complete pedagogical mastery.  
> **Rule of Engagement:** You write the code. I provide specifications, mental models, edge-case challenges, and code reviews.

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   YOUR MOBILE PHONE                    │
│                                                        │
│   React Native (Expo SDK 54 + TypeScript + Reanimated) │
│   • Screen 1: The Import Hub (WhatsApp Share Target)   │
│   • Screen 2: The Theatrical Report Card (17 Acts)     │
│   • Screen 3: Doctor Delulu AI Coach Chatroom          │
│   • Screen 4: Ghost Writer (3-Option Triad + Voice)    │
└───────────────────────────┬────────────────────────────┘
                            │
               REST API & Streaming JSON
       (Local Wi-Fi / Tailscale ➜ Cloud URL later)
                            │
┌───────────────────────────▼────────────────────────────┐
│              BACKEND SERVER (FastAPI + Python)         │
│                                                        │
│   • Ingestion Parser (WhatsApp .txt/.zip & Instagram)  │
│   • Mathematical Chronemics Engine (0-LLM math stats)  │
│   • 17-Act Theatrical Profiler (OpenAI gpt-4o-mini)    │
│   • Doctor Delulu Coach Engine (Dossier Context)       │
│   • Ghost Writer Real-Time Reply Generator             │
│   • SQLite Database (WAL mode)                         │
└────────────────────────────────────────────────────────┘
```

---

## 🗓️ 14-Day Step-by-Step Execution Roadmap

### 📦 Phase 1: Workspace Organization & Day 0 Setup (Days 0–1)
- [ ] **Day 0: Project Restructuring**
  - Scaffold `backend/` and `mobile/` workspaces.
  - Setup Python virtual environment with `fastapi`, `uvicorn`, `pydantic`, `openai`, `python-dotenv`.
  - Setup `.env` with `OPENAI_API_KEY`.
- [ ] **Day 1: SQLite Schema 2.0 & Data Layer**
  - Create `backend/database/schema.sql` (defining `messages`, `chronemics_stats`, `relationship_profiles`, `report_acts`, `evidence_locker`, `greatest_hits`, `coaching_sessions`).
  - Create database connection manager in `backend/database/db.py` with WAL mode enabled.

---

### ⚙️ Phase 2: Ingestion & Chronemics Telemetry (Days 2–3)
- [ ] **Day 2: Production Chat Parser (`backend/ingestion/parser.py`)**
  - Parse multi-line WhatsApp `.txt` exports with regex.
  - Extract sender attribution, timestamps, and media tags.
  - Identify system messages (deleted messages, missed calls, encryption notices).
- [ ] **Day 3: Mathematical Chronemics Engine (`backend/analytics/chronemics.py`)**
  - Compute Initiation Ratio (% conversations started after $> 4\text{h}$ of silence).
  - Compute Median Response Latency ($\Delta t$) for You vs Her.
  - Detect Double/Triple-text burst frequency and Late-Night messaging ratio.
  - Store calculations into `chronemics_stats` table.

---

### 🧠 Phase 3: The 17 Theatrical Acts & GPT-4o-mini Profiler (Days 4–6)
- [ ] **Day 4: Milestone Timeline Extractor & Pass 1 (Metric Foundation)**
  - Algorithm to extract top 40 dramatic dialogue moments.
  - Generate **Act 1 Opening** (Diagnosis, Power balance) + **Act 2 Delulu Meter** (Score 0–100, Survival odds) + **Act 4 Character Stats** (RPG traits).
- [ ] **Day 5: Pass 2 (Psychological Audit) & Pass 3 (Evidence Receipts)**
  - Generate **Act 3 Behavioral Profiles** (Attachment styles, triggers) + **Act 5 Power Plays** + **Act 7 Flirting Forensics**.
  - Generate **Act 10 Red Flags & Evidence Locker** (Citing exact chat quotes) + **Act 15 Greatest Hits** (Cringe, comedy, delusional quotes).
- [ ] **Day 6: Pass 4 (Strategy & Social Layer)**
  - Generate **Act 12 Pop Culture Receipts** + **Act 14 Strategy Handbook** (Dos & Don'ts, Calibrated responses) + **Act 16 Awards Ceremony**.

---

### 🔌 Phase 4: FastAPI REST Service & Local Server (Days 7–8)
- [ ] **Day 7: Core Analysis Endpoints**
  - `POST /api/upload`: Multipart file upload for chat export.
  - `GET /api/status/{task_id}`: Analysis progress polling.
  - `GET /api/contacts`: List all analyzed contacts with Delulu score badges.
  - `GET /api/report/{contact}`: Full 17-Act JSON payload for mobile rendering.
- [ ] **Day 8: Real-Time Coach & Ghost Writer Endpoints**
  - `POST /api/coach/chat`: Multi-turn streaming chat grounded in the pre-computed dossier.
  - `POST /api/ghost/reply`: Fast 3-Option Triad reply generator.

---

### 📱 Phase 5: React Native Expo Mobile App Setup (Days 9–10)
- [ ] **Day 9: Expo SDK 54 Initialization & Cyber-Romance Theme**
  - Initialize `mobile/` with Expo TypeScript template.
  - Install `react-native-reanimated`, `expo-router`, `lucide-react-native`, `expo-haptics`.
  - Configure color palette tokens (Pitch Black `#0A0A0E`, Neon Pink `#FF2E93`, Violet `#8B5CF6`).
- [ ] **Day 10: Screen 1 — The Import Hub & WhatsApp Share Target**
  - Build the upload screen with file picker.
  - Android Intent filter for direct WhatsApp share sheet export.
  - Animated radar scanning modal with progressive witty status updates.

---

### 🎨 Phase 6: Mobile Report Card & Gauges (Days 11–12)
- [ ] **Day 11: The Delulu Meter & Power Balance Bar**
  - 60 FPS circular gauge with animated needle using Reanimated and SVG.
  - Dual-colored power balance slider.
  - Character RPG stat cards with animated progress fills.
- [ ] **Day 12: Evidence Locker & Greatest Hits Cards**
  - Swipeable receipt cards citing exact red flags with severity badges.
  - Pop Culture receipts carousel.
  - Strategy Handbook interactive Dos & Don'ts checklist.

---

### 💬 Phase 7: Doctor Delulu & Ghost Writer Mobile UI (Days 13–14)
- [ ] **Day 13: Doctor Delulu Coaching Chatroom**
  - Messenger interface with glowing aura avatar.
  - Quick action prompt pills.
  - Streaming markdown message bubbles.
- [ ] **Day 14: Ghost Writer & God Mode Voice Pad**
  - Calibrated reply cards with 1-tap copy & haptic feedback.
  - Hold-to-talk microphone button for voice intent.
  - End-to-end integration test from WhatsApp export to full mobile report on your phone!
