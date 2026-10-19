# 🗺️ Actionable Roadmap & Milestones: Building Assify from Scratch

> **Pedagogical Standard:** Designed for deep mastery and independent implementation  
> **Rule of Engagement:** No blind copy-paste; every module is built step-by-step from specifications  
> **End Goal:** A fully functional, local-first relationship intelligence OS combining Delulu Check's virality and deep analysis with 100% offline privacy.

---

## Roadmap Overview

```
Phase 1: Foundation & Telemetry ──► Phase 2: Multi-Pass Profiler ──► Phase 3: Fast Copilot & Ghost Writer
                                                                               │
Phase 6: Multi-Modal & Packaging ◄── Phase 5: Visual Dashboard ◄── Phase 4: Doctor Delulu Coach
```

---

## 🎯 Milestone 1: Schema 2.0 & The Mathematical Chronemics Engine

**Theoretical Mental Model:**  
Before any AI model is invoked, relationships leave clear mathematical footprints in communication timestamps. Initiation percentages, median reply latencies, and message length imbalances are objective ground truths. Deriving these first provides deterministic anchors for subsequent LLM reasoning.

### Concrete Tasks:
- [ ] **Task 1.1: Database Schema 2.0 Migration**
  - Implement the tables specified in `04_TECHNICAL_BLUEPRINT_FOR_ASSIFY_LOCAL_APP.md`:
    - `messages` (with `is_deleted`, `is_question`, `media_type`)
    - `chronemics_stats`
    - `relationship_profiles`
    - `report_acts`
    - `evidence_locker`
    - `greatest_hits`
    - `coaching_sessions` & `coaching_messages`
  - Ensure WAL mode (`PRAGMA journal_mode=WAL;`) is active for high-concurrency read/write.
- [ ] **Task 1.2: Mathematical Chronemics Engine (`ingestion/chronemics.py`)**
  - Input: List of normalized message objects from SQLite.
  - Computations:
    - Identify conversation session breaks (inactivity gaps $> 4\text{ hours}$).
    - Count who sends the first message of each new session $\rightarrow$ compute **Initiation Ratio** ($U\% / C\%$).
    - Compute **Median Response Latency** in minutes for both parties (excluding overnight gaps $> 8\text{ hours}$).
    - Count **Double/Triple Texts** (consecutive bursts before a partner reply).
    - Measure **Character Count / Paragraph Asymmetry** (total characters sent by You vs Her).
  - Output: Write row into `chronemics_stats`.

---

## 🎯 Milestone 2: Offline 4-Pass Profiler & The 17 Acts

**Theoretical Mental Model:**  
Small local language models (`llama3.1:8b`, `phi3:mini`) fail when asked to generate 15 pages of complex analysis in a single prompt. By decomposing the report generation into 4 focused passes—each provided with math stats and key dialogue milestones—we achieve production-grade psychological depth with zero JSON parsing failures.

### Concrete Tasks:
- [ ] **Task 2.1: Key Milestone Extractor (`agents/milestone_extractor.py`)**
  - Write an algorithm to pick the 40 most significant dialogue bursts from the chat:
    - Bursts following long silence gaps ($> 24\text{ hours}$).
    - Bursts containing high emotion markers (apologies, confrontations, late-night hours).
    - Bursts with high message density.
- [ ] **Task 2.2: Pass 1 — The Metric Foundation (Acts 1, 2, 4)**
  - Construct prompt feeding chronemics stats + milestones to `llama3.1:8b`.
  - Extract:
    - **Act 1 Opening:** Diagnosis, Power ratio, Relationship status, Character archetypes.
    - **Act 2 Delulu Meter:** Delulu score (0–100), Circus level, 5 sub-dimensions, Survival odds.
    - **Act 4 Character Stats:** RPG stats for both people (Patience, Simp Factor, Defensiveness).
  - Validate JSON schema and store in `relationship_profiles` and `report_acts`.
- [ ] **Task 2.3: Pass 2 — Psychological Audit (Acts 3, 5, 6, 7)**
  - Extract:
    - **Act 3 Behavioral Profiles:** Attachment styles, core insecurities, blindspots.
    - **Act 5 Power Plays:** Concrete control dynamics, vulnerability reactions.
    - **Act 6 Communication Breakdown:** Linguistic clashes, danger topics.
    - **Act 7 Flirting Forensics:** Chemistry score, flirt receptivity, missed signals.
  - Validate JSON and save to `report_acts`.
- [ ] **Task 2.4: Pass 3 — Receipts & Forensic Evidence (Acts 9, 10, 15)**
  - Extract:
    - **Act 9 Timeline of Decay:** 4 distinct chronological relationship phases.
    - **Act 10 Red Flags & Evidence Locker:** 3–5 real chat quotes with severity levels.
    - **Act 15 Greatest Hits:** 4 memorable quotes (cringe, comedy, delusional, comeback).
  - Populate `evidence_locker`, `greatest_hits`, and `report_acts`.
- [ ] **Task 2.5: Pass 4 — Strategic Future & Social Layer (Acts 12, 13, 14, 16)**
  - Extract:
    - **Act 12 Pop Culture Receipts:** Comparable film/celebrity dynamics.
    - **Act 13 Simulation Engine:** "What if" scenario prediction.
    - **Act 14 Strategy Handbook:** Top 3 rules, dos and don'ts, calibrated responses.
    - **Act 16 Awards Ceremony:** 12 fun superlatives awarded to both people.
  - Save to `report_acts`.

---

## 🎯 Milestone 3: Real-Time Fast Copilot & Ghost Writer

**Theoretical Mental Model:**  
When you are actively texting someone, you need a reply recommendation in under 1 second. You cannot afford vector search or deep reasoning. By pulling the last 5 messages directly from SQLite and conditioning on the pre-computed partner profile, you generate hyper-relevant replies instantly.

### Concrete Tasks:
- [ ] **Task 3.1: Wire `Router.py` to `FastChatAgent`**
  - Implement the routing branch in `agents/Fast_agent.py`:
    - If user asks for reply help or casual query $\rightarrow$ Route directly to **Recent Message Context** (bypass vector DB).
    - If user asks historical/factual question $\rightarrow$ Route to **Vector Search**.
- [ ] **Task 3.2: Sub-Second In-Memory Embedding Cache (`FastVectorIndex`)**
  - Refactor `memory/vector_store.py` to cache normalized vectors into a 2D NumPy array on startup.
  - Replace row-by-row iteration with single `np.dot` matrix-vector multiplication.
- [ ] **Task 3.3: Ghost Writer 3-Option Triad (`agents/ghost_writer.py`)**
  - Given the last 3 incoming messages + partner attachment style, generate:
    1. *Option A (The De-escalator):* High empathy & emotional grounding.
    2. *Option B (The Playful / Rizz):* Witty banter and charm.
    3. *Option C (The Clean Anchor):* Clear, respectful personal boundaries.

---

## 🎯 Milestone 4: Doctor Delulu Offline Relationship Coach

**Theoretical Mental Model:**  
A conversational relationship coach is only as good as its persistent memory. By seeding the coach with the pre-computed relationship dossier from SQLite, it acts as an empathetic, deeply knowledgeable advisor who never contradicts past facts.

### Concrete Tasks:
- [ ] **Task 4.1: Coaching Session Management (`agents/coach.py`)**
  - Create, list, and resume multi-turn coaching sessions tied to specific contacts.
  - Store conversation history in `coaching_sessions` and `coaching_messages`.
- [ ] **Task 4.2: Dynamic Dossier Injection**
  - On starting a coaching session, automatically compile the 800-token relationship dossier from `relationship_profiles`, `chronemics_stats`, and `evidence_locker`.
  - Prefix the system prompt with this dossier so the local model has instant, complete context.
- [ ] **Task 4.3: Streaming Terminal / Web Chat Interface**
  - Enable token streaming via Ollama's streaming API for instantaneous conversational feel.

---

## 🎯 Milestone 5: The Visual Theatrical Report Dashboard

**Theoretical Mental Model:**  
Text printouts fail to communicate emotional magnitude. Gamified gauges, stat cards, and quote receipts transform dry data into compelling, self-reflective insights.

### Concrete Tasks:
- [ ] **Task 5.1: Markdown / HTML Report Renderer (`dashboard/report_generator.py`)**
  - Build a script that queries `report_acts` for a contact and renders a polished, standalone HTML file or rich terminal output.
  - Components:
    - **The Delulu Gauge:** Visual percentage meter with circus tier.
    - **Power Balance Bar:** Visual slider showing $U\% / C\%$.
    - **Character Cards:** RPG stat displays.
    - **Evidence Locker Cards:** Quoted receipts with colored severity badges.
    - **Strategy Dos & Don'ts:** Clean comparative tables.
- [ ] **Task 5.2: Streamlit / Local Web UI (Optional Frontend Layer)**
  - A clean, dark-mode local web interface running on `localhost:8501`.
  - Tabs:
    - 📊 *Relationship Report Card (The 17 Acts)*
    - 💬 *Doctor Delulu Chatroom*
    - ⚡ *Ghost Writer Quick Reply Pad*

---

## 🎯 Milestone 6: Multi-Modal Ingestion & Voice Notes

**Theoretical Mental Model:**  
Modern communication extends far beyond text. Voice notes carry paralinguistic emotion (pauses, tone, speed), and screenshots contain unexported DMs. Bringing these on-device completes the intelligence loop.

### Concrete Tasks:
- [ ] **Task 6.1: Local Voice Note Transcription (`ingestion/voice_transcriber.py`)**
  - Integrate `faster-whisper` (`base` or `small` model).
  - Automatically detect `.ogg`, `.mp3`, or `.m4a` files in WhatsApp export folders.
  - Transcribe audio locally and insert into `messages` with `media_type='voice'`.
- [ ] **Task 6.2: God Mode Voice Intent for Ghost Writer**
  - Record user voice input from mic.
  - Transcribe raw user thought via Whisper $\rightarrow$ Feed into Ghost Writer vibe engine $\rightarrow$ Generate ready-to-send text.

---

## Verification & Mastery Criteria

To ensure genuine engineering mastery, each milestone should be validated against the following benchmarks:
1. **Performance:** Chronemics calculation runs in $< 500\text{ms}$ for 10,000 messages.
2. **Robustness:** 4-pass profiler achieves $100\%$ valid JSON generation across 5 different test exports.
3. **Latency:** Fast Copilot generates reply suggestions in $< 1.5\text{ seconds}$ on local hardware.
4. **Air-Gap Integrity:** Zero network requests made outside `localhost:11434` (Ollama).
