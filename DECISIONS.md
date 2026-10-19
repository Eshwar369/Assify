# ⚖️ ASSIFY — Architectural Decision Records (ADR)

> **Purpose:** Document every critical architectural choice, the trade-offs evaluated, and the rationale behind the chosen solution.

---

## 📑 Index of Decisions

- [ADR 001: Mobile Client Framework — React Native (Expo SDK 54) vs Flutter](#adr-001-mobile-client-framework--react-native-expo-sdk-54-vs-flutter)
- [ADR 002: Backend Framework — FastAPI vs Flask](#adr-002-backend-framework--fastapi-vs-flask)
- [ADR 003: Intelligence Strategy — OpenAI GPT-4o-mini vs Local SLM on Mobile](#adr-003-intelligence-strategy--openai-gpt-4o-mini-vs-local-slm-on-mobile)
- [ADR 004: Persistence Strategy — SQLite (Dev/Local) to Supabase (Production)](#adr-004-persistence-strategy--sqlite-devlocal-to-supabase-production)
- [ADR 005: Macro-Analytics Profiling vs Micro-Retrieval RAG](#adr-005-macro-analytics-profiling-vs-micro-retrieval-rag)

---

### ADR 001: Mobile Client Framework — React Native (Expo SDK 54) vs Flutter

#### Status: ACCEPTED
#### Context:
We need a cross-platform mobile app capable of running 60 FPS animations (circular Delulu Meter, swipeable cards), handling native audio recording, receiving WhatsApp file exports via the Android Share sheet, and compiling into production Play Store bundles (`.aab`).

#### Considered Options:
1. **React Native with Expo SDK 54 (TypeScript)**
2. **Flutter (Dart)**

#### Decision & Rationale:
We chose **React Native with Expo SDK 54**.
1. **Exact 1:1 Replicability with Delulu Check:** Delulu Check is built with Expo SDK 54 and React Native Reanimated. Every reverse-engineered route, component, and animation pattern can be directly translated.
2. **Zero-Setup Physical Device Testing:** Expo Go allows instant QR-code testing on a physical smartphone without needing Android Studio or an emulator on Day 1.
3. **1-Command Play Store Builds:** Expo Application Services (`eas build -p android`) compiles production release packages in the cloud.
4. **Market & Resume Value:** React Native + TypeScript is the single most widely used cross-platform framework in high-growth startups and tech placement evaluations.

---

### ADR 002: Backend Framework — FastAPI vs Flask

#### Status: ACCEPTED
#### Context:
The backend must handle multi-megabyte file uploads (15,000-message chat archives), compute mathematical chronemics, coordinate multi-stage LLM batch completions, and stream tokens to the mobile app in real-time.

#### Considered Options:
1. **FastAPI (Python 3.12)**
2. **Flask (Python 3.12)**

#### Decision & Rationale:
We chose **FastAPI**.
1. **Asynchronous Non-Blocking I/O:** Flask is synchronous and thread-blocking by default. Waiting for OpenAI API responses or multi-part uploads blocks worker threads. FastAPI natively supports `async def` and event loops, making streaming tokens and handling concurrent mobile clients seamless.
2. **Native Pydantic v2 Validation:** FastAPI automatically validates and serializes JSON payloads using Pydantic models. Malformed client requests fail fast before hitting database or LLM layers.
3. **Automatic OpenAPI / Swagger Documentation:** FastAPI automatically generates interactive documentation at `/docs`, enabling isolated testing of every mobile endpoint.

---

### ADR 003: Intelligence Strategy — OpenAI GPT-4o-mini vs Local SLM on Mobile

#### Status: ACCEPTED
#### Context:
To generate the 17 Theatrical Acts, the AI must process chat timelines spanning months, identify subtle psychological subtexts, and return strictly valid JSON schemas.

#### Considered Options:
1. **On-Device Local SLM (e.g. running 3B/8B model directly on phone)**
2. **Cloud OpenAI API (`gpt-4o-mini`) via Backend Server**

#### Decision & Rationale:
We chose **OpenAI `gpt-4o-mini` on the backend**.
1. **Mobile Thermal & Memory Limits:** Modern smartphones restrict foreground app memory to 2–3GB. Running an 8B model locally overheats the phone, burns 15% battery in minutes, and is frequently terminated by Android's OOM (Out Of Memory) killer.
2. **128k Token Context Window:** `gpt-4o-mini` can absorb extensive conversation milestones in a single prompt without context truncation.
3. **JSON Reliability & Cost:** `gpt-4o-mini` achieves near 100% adherence to structured JSON schemas and costs ~$0.01 per full relationship analysis.

---

### ADR 004: Persistence Strategy — SQLite (Dev/Local) to Supabase (Production)

#### Status: ACCEPTED
#### Context:
During local development, we need a lightweight database that runs on the user's laptop without Docker or cloud configuration. For production Play Store release, we need a multi-tenant cloud database with authentication.

#### Decision & Rationale:
We chose a **Two-Phase Architecture**:
1. **Development & Self-Hosted Phase:** Use **SQLite with WAL mode (`PRAGMA journal_mode=WAL;`)**. Zero setup, file-based, fast, and easily inspected.
2. **Production / Play Store Phase:** Migrate connection strings to **Supabase (PostgreSQL)**. Because our SQL schema avoids proprietary SQLite quirks, the DDL runs seamlessly on Postgres with minimal migration friction.

---

### ADR 005: Macro-Analytics Profiling vs Micro-Retrieval RAG

#### Status: ACCEPTED
#### Context:
The original Assify design attempted to answer all relationship questions by retrieving top-5 vector chunks via ChromaDB and feeding them to an LLM on every query.

#### The Problem:
Vector search answers: *"Find 3 messages similar to 'where are my keys'?"*  
Vector search **CANNOT** answer: *"Who holds the power in this relationship?"*, *"Calculate our Delulu score"*, or *"What are our top 3 red flags?"*. Global relationship intelligence requires holistic analysis across all 15,000 messages.

#### Decision & Rationale:
We pivoted from pure RAG to **Pre-computed Structured Profiling**:
1. At upload time, compute **0-LLM mathematical chronemics** (initiation ratio, median delay, double-texts).
2. Run a **4-pass LLM synthesizer** to generate the 17 Acts and store them in the `report_acts` table.
3. The mobile app and Doctor Delulu coach read from this **pre-computed relationship dossier**, ensuring instant loading and zero hallucination.

---

### ADR 006: Conversational Dynamics — Neuro-Symbolic Seam Pipeline vs Pure Math vs Pure LLM

#### Status: ACCEPTED
#### Context:
Accurately determining conversational initiation ratios, response latencies, and chasing behavior across 15,000+ personal WhatsApp messages.

#### The Problem:
- **Pure Math Failure:** Naive `gap > 4 hours = initiation` misclassifies routine "Good Morning" greetings as new initiations and misclassifies desperate follow-ups after being left on read as "initiating".
- **Pure LLM Failure:** Asking an LLM to count initiations across thousands of messages leads to catastrophic arithmetic hallucinations.

#### Decision & Rationale:
We adopted the **Neuro-Symbolic Seam Pipeline** ([`backend/analytics/CHRONEMICS_SPEC.md`](file:///c:/Users/DELL/gen%20ai/Assify/backend/analytics/CHRONEMICS_SPEC.md)):
1. **Symbolic Pass:** Python merges consecutive texts within 90s into single conversational turns, computes word counts, and isolates transition seams where silence $> 3.5\text{ hours}$.
2. **Neuro Pass:** A single micro-prompt classifies ~30 transition seams into `TRUE_INITIATION`, `CHASE_FOLLOWUP`, `DELAYED_ANSWER`, or `ROUTINE_RITUAL`.
3. **Grounded Synthesis:** Initiation is calculated only on verified `TRUE_INITIATION` events, eliminating both naive math errors and LLM hallucinations.

