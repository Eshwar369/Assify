# 🚀 Assify: The World-Class Builder Masterplan (0-to-Hosted Production Sprint)

**Builder:** Eshwar Adithya Gunturi (NIT Warangal, B.Tech ECE | IIT Madras, Dip. Data Science)  
**Target:** Architect, optimize, and deploy **Assify (Local Relationship Intelligence OS)** from zero to production-hosted live deployment.  
**Core Mindset:** Forget campus screening filters and resume algorithms. Corporate screening filters on arbitrary cutoffs; the real world bows to builders who can architect, optimize, and ship production-grade intelligent systems from first principles.

---

## 🏛️ Completed Foundation Milestones (Preserved Progress)

- [x] **PPT:** Sept 28, 2026 (Completed)
- [x] Open `memory/vector_store.py` and write the `VectorStore` class
- [x] Implement `CREATE TABLE IF NOT EXISTS embeddings (id TEXT PRIMARY KEY, embedding BLOB NOT NULL)`
- [x] Implement `add_embeddings()`: list comprehension with `np.array(vec, dtype=np.float32).tobytes()` + `executemany`
- [x] Implement `search()`: compute cosine similarities with query vector and return top-$K$
- [x] Run test queries: verify search returns real matching chat messages with zero native crashes
- [x] Wire vector store into `ingestion/pipeline.py`:
  - [x] Stream parsed WhatsApp messages
  - [x] Batch messages to Ollama `nomic-embed-text`
  - [x] Store 13,000+ vectors in unified `embeddings` table (Expanded to 28,371 messages in `30-09-2027.db`)
- [x] Implement query-time Exponential Recency Decay in `memory/vector_store.py`:
  $$\text{FinalScore} = \text{CosineSimilarity} \times e^{-\lambda \cdot \Delta t}$$
- [x] Run test queries: verify recent messages get higher recency multipliers ($e^{-\lambda \Delta t}$) and rank higher
- [x] Implement Small-to-Big Retrieval: `context_window_messages(message_id, window=5)` using SQLite sequential `rowid`
- [x] Solved Core SQL & Data Manipulation Foundations:
  - [x] LeetCode 181: *Employees Earning More Than Their Managers* (Self-Join vs Subquery)
  - [x] LeetCode 183: *Customers Who Never Order* (`LEFT JOIN ... WHERE order_id IS NULL`)
  - [x] LeetCode 176: *Second Highest Salary* (Handle `NULL` using `IFNULL` / `LIMIT 1 OFFSET 1`)

---

## ⚡ The World-Class 7-Day Velocity Sprint (Oct 03 – Oct 09, 2026)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                   7-DAY SPRINT TO LIVE PRODUCTION HOSTING                        │
├─────────┬──────────────┬─────────────────────────────────────────────────────────┤
│ DAY 1   │ Sat, Oct 03  │ Dual-Agent Engine (Fast Copilot + Deep EQ Analyst)      │
│ DAY 2   │ Sun, Oct 04  │ Memory Intelligence & Knowledge Graph (Promises, Gifts) │
│ DAY 3   │ Mon, Oct 05  │ Multi-Modal Audio Pipeline (faster-whisper local ASR)   │
│ DAY 4   │ Tue, Oct 06  │ Production Backend (FastAPI Async, Streaming SSE, WAL)  │
│ DAY 5   │ Wed, Oct 07  │ Modern Premium UI (Streamlit / Dark Mode Web App)       │
│ DAY 6   │ Thu, Oct 08  │ Profiling, Latency Benchmarks (<2s E2E) & Stress Tests  │
│ DAY 7   │ Fri, Oct 09  │ Docker Containerization & Live Cloud Hosting Deployment │
└─────────┴──────────────┴─────────────────────────────────────────────────────────┘
```

---

### 📅 DAY 1: SATURDAY, OCT 03 — DUAL-AGENT INTELLIGENCE ENGINE

*Goal: Transform Assify from a raw retrieval engine into an interactive, multi-tier reasoning system with sub-second copilot responses and structured emotional analytics.*

#### Block 1.0: Pluggable LLM Provider Adapter (`agents/llm_provider.py`)
> 📊 **Difficulty:** `🟡 Medium-Easy` | ⏱️ **Senior Dev Benchmark:** `30 – 45 mins` | 🎯 **Your Target Time:** `1h 15m – 1h 45m`
- [x] Implement Unified LLM Interface (Strategy Pattern / Adapter):
  - [x] Support `LLM_PROVIDER="ollama"` (100% private local) and `LLM_PROVIDER="cloud"` (Groq/OpenAI/Gemini for ultra-low latency)
  - [x] Standardized contract: `chat_completion(messages: list[dict], model: str, json_mode: bool = False) -> str`
  - [x] Configuration toggle in `config.py`: swap between **Local Privacy Mode** and **Turbo Cloud Mode** via single env flag with zero agent code changes.

#### Block 1.1: Fast Copilot Agent (`agents/Fast_agent.py`)
> 📊 **Difficulty:** `🟡 Medium` | ⏱️ **Senior Dev Benchmark:** `45 – 60 mins` | 🎯 **Your Target Time:** `1h 45m – 2h 30m`
- [x] Connect `FastChatAgent.fast_reply()` with Small-to-Big Context Window retrieval:
  - [x] Accept user query string and optional contact filter
  - [x] Execute `self.vector_store.timed_search(query, top_k=3, half_life_days=30)`
  - [x] Expand each hit using `self.vector_store.context_window_messages(hit_id, window=3)`
  - [x] Construct grounding context block with chronological formatting (`[Timestamp] Sender: Content`)
- [x] Implement robust multi-turn conversational history management:
  - [x] System prompt: concise, empathetic, factually grounded, relationship copilot
  - [x] Rolling window pruning to prevent context overflow while preserving system instructions
- [x] Live verification: Interactive CLI loop in `agents/Fast_agent.py` answering relationship queries with sub-2s latency.

#### Block 1.1b: Conversational Burst Aggregator & Semantic Chunking (`ingestion/burst_aggregator.py`)
> 📊 **Difficulty:** `🟡 Medium` | ⏱️ **Senior Dev Benchmark:** `45 – 60 mins` | 🎯 **Your Target Time:** `1h 30m – 2h 00m`
- [x] Implement Natural Dialogue Speaker-Turn Segmentation:
  - [x] Group consecutive rapid-fire fragments from the same sender into a single coherent thought
  - [x] Dynamic split conditions: Speaker transition OR conversation inactivity gap ($\Delta t > 10\text{ mins}$) OR token ceiling
  - [x] Maintain atomic messages in SQLite while indexing rich semantic burst passages into `embeddings`
- [x] Re-index vector store: compress 28,000+ noisy atomic vectors into ~5,000 dense semantic thought bursts.

#### Block 1.2: Deep EQ Relationship Analyst (`agents/analyst_agent.py`)
> 📊 **Difficulty:** `🟠 Medium-Hard` | ⏱️ **Senior Dev Benchmark:** `45 – 60 mins` | 🎯 **Your Target Time:** `2h 00m – 2h 45m`
- [ ] Design specification for the Relationship Analyst agent using `translategemma:4b` (or `llama3:8b`):
  - [ ] Strict JSON output schema: `{"sentiment_score": float (-1.0 to 1.0), "emotional_tone": str, "conflict_risk": str ("low"|"medium"|"high"), "core_theme": str, "actionable_advice": str}`
  - [ ] Prompt engineering for unbiased, deep relational psychology analysis
- [ ] Implement `AnalystAgent.analyze_thread()`:
  - [ ] Input: Full context window of a conflict or significant event
  - [ ] Output: Validated Pydantic schema / parsed JSON object with fallback parsing
- [ ] Live verification: Test on historical arguments and verify sentiment scoring accuracy.

---

### 📅 DAY 2: SUNDAY, OCT 04 — MEMORY INTELLIGENCE & KNOWLEDGE GRAPH

*Goal: Extract high-value relationship entities (promises, unfulfilled commitments, gift ideas, milestones) into dedicated queryable SQLite tables.*

#### Block 2.1: Entity Schema & Extraction Pipeline (`memory/entity_extractor.py`)
> 📊 **Difficulty:** `🟠 Medium-Hard` | ⏱️ **Senior Dev Benchmark:** `1h 15m – 1h 30m` | 🎯 **Your Target Time:** `2h 30m – 3h 15m`
- [ ] Create SQLite schema for relationship intelligence:
  - `CREATE TABLE IF NOT EXISTS commitments (id TEXT PRIMARY KEY, contact TEXT, promise_by TEXT, commitment TEXT, timestamp TEXT, status TEXT)`
  - `CREATE TABLE IF NOT EXISTS gift_ideas (id TEXT PRIMARY KEY, contact TEXT, item TEXT, context TEXT, timestamp TEXT)`
  - `CREATE TABLE IF NOT EXISTS sentiment_timeline (id TEXT PRIMARY KEY, contact TEXT, date TEXT, average_score REAL, key_conflict TEXT)`
- [ ] Implement zero-shot entity extraction via LLM with structured output:
  - [ ] Batch scan important chat threads
  - [ ] Extract commitments: "I'll call you tomorrow", "Let's plan Goa next month", "I'll send the notes"
  - [ ] Extract preferences & wishlists: "I love this book", "Need a new mechanical keyboard"
- [ ] Wire extracted entities into SQLite database with indexed lookups.

#### Block 2.2: Memory Query Interface (`memory/relationship_graph.py`)
> 📊 **Difficulty:** `🟡 Medium-Easy` | ⏱️ **Senior Dev Benchmark:** `30 – 45 mins` | 🎯 **Your Target Time:** `1h 15m – 1h 45m`
- [ ] Build fast query functions:
  - `get_open_commitments(contact: str) -> list[dict]`
  - `get_gift_ideas(contact: str) -> list[dict]`
  - `get_sentiment_trend(contact: str, days: int) -> list[dict]`
- [ ] Test verification: Run query "What did I promise to do last month?" and get instant SQL-backed results.

---

### 📅 DAY 3: MONDAY, OCT 05 — MULTI-MODAL AUDIO INGESTION PIPELINE

*Goal: Unlock voice notes — the most emotional and high-context medium in modern messaging — with local, zero-leak speech-to-text.*

#### Block 3.1: Local Whisper Integration (`ingestion/audio_parser.py`)
> 📊 **Difficulty:** `🟡 Medium` | ⏱️ **Senior Dev Benchmark:** `45 – 60 mins` | 🎯 **Your Target Time:** `1h 45m – 2h 15m`
- [ ] Set up `faster-whisper` (CTranslate2 backend) for ultra-fast local inference on CPU/GPU
- [ ] Implement audio format normalization:
  - [ ] Convert WhatsApp `.opus` / `.ogg` / `.m4a` to standard 16kHz WAV using `ffmpeg` or `pydub`
  - [ ] Implement voice activity detection (VAD) filter to strip long silences
- [ ] Transcribe audio with timestamp alignment and speaker metadata

#### Block 3.2: Multi-Modal Ingestion Integration
> 📊 **Difficulty:** `🟡 Medium` | ⏱️ **Senior Dev Benchmark:** `45 mins` | 🎯 **Your Target Time:** `1h 30m – 2h 00m`
- [ ] Bridge transcribed voice notes into `MessageObject` schema:
  - [ ] Mark `message_type = 'audio'` with transcription text in `content`
  - [ ] Generate 768-D embeddings via Ollama `nomic-embed-text`
  - [ ] Insert into unified SQLite database (`messages` + `embeddings`)
- [ ] Test verification: Query a spoken inside joke or audio note and verify successful retrieval.

---

### 📅 DAY 4: TUESDAY, OCT 06 — PRODUCTION BACKEND ARCHITECTURE

*Goal: Build a high-throughput, async, production-grade REST & SSE backend using FastAPI.*

#### Block 4.1: FastAPI Core & Concurrency Architecture (`server/main.py`)
> 📊 **Difficulty:** `🟠 Medium-Hard` | ⏱️ **Senior Dev Benchmark:** `1h 00m – 1h 30m` | 🎯 **Your Target Time:** `2h 30m – 3h 30m`
- [ ] Initialize FastAPI application with CORS middleware, lifespan events, and dependency injection
- [ ] Implement SQLite WAL-mode connection pooling:
  - [ ] Read-only connections for fast concurrent retrieval
  - [ ] Dedicated write lock handling for ingestions
- [ ] Define API Endpoints:
  - `POST /api/chat/fast`: Streaming Server-Sent Events (SSE) token generation
  - `POST /api/chat/analyze`: Deep EQ analysis payload
  - `GET /api/commitments`: Query pending promises
  - `GET /api/timeline`: Query emotional trajectory over time
  - `POST /api/ingest/upload`: Upload new chat export or audio files

#### Block 4.2: Streaming & Health Diagnostics
> 📊 **Difficulty:** `🟡 Medium` | ⏱️ **Senior Dev Benchmark:** `45 – 60 mins` | 🎯 **Your Target Time:** `1h 45m – 2h 30m`
- [ ] Implement token-by-token streaming response generator using Ollama's streaming API
- [ ] Implement health check `/health` with model readiness and DB integrity checks
- [ ] Automated integration test suite (`tests/test_api.py`) verifying 200 OK across all endpoints.

---

### 📅 DAY 5: WEDNESDAY, OCT 07 — MODERN PREMIUM UI

*Goal: Craft a stunning, responsive, dark-mode user interface with fluid interactions and rich data visualizations.*

#### Block 5.1: Real-time Relationship OS Dashboard
> 📊 **Difficulty:** `🟠 Medium-Hard` | ⏱️ **Senior Dev Benchmark:** `1h 30m – 2h 00m` | 🎯 **Your Target Time:** `3h 00m – 4h 00m`
- [ ] Build premium UI (Streamlit or Vite/React + Tailwind):
  - [ ] **Chat Terminal**: Real-time token streaming with source grounding citations (shows exact message context retrieved)
  - [ ] **Relationship Radar**: Emotional sentiment score gauge (-1.0 to +1.0) with status indicators
  - [ ] **Commitments Tracker**: Interactive checklist of promises made / pending
  - [ ] **Gift & Interest Vault**: Tagged list of preferences detected across conversations
  - [ ] **Interactive Timeline**: Visual timeline of chat history with sentiment peaks and valleys

#### Block 5.2: Aesthetic & Interaction Polish
> 📊 **Difficulty:** `🟡 Medium` | ⏱️ **Senior Dev Benchmark:** `45 – 60 mins` | 🎯 **Your Target Time:** `1h 30m – 2h 15m`
- [ ] Design styling: Deep obsidian dark mode, glassmorphism cards, glowing status badges, curated typography
- [ ] Zero layout shifts, smooth animations, and mobile-responsive viewport.

---

### 📅 DAY 6: THURSDAY, OCT 08 — PROFILING, LATENCY BENCHMARKS & HARDENING

*Goal: Profile every layer of the architecture, drive end-to-end latency below 2 seconds, and harden against edge cases.*

#### Block 6.1: Benchmarking Suite (`benchmarks/latency_audit.py`)
> 📊 **Difficulty:** `🟡 Medium` | ⏱️ **Senior Dev Benchmark:** `45 – 60 mins` | 🎯 **Your Target Time:** `1h 30m – 2h 15m`
- [ ] Write automated latency benchmarks measuring:
  - [ ] Vector similarity calculation latency over 28,000+ items (< 5ms target)
  - [ ] Context window SQLite sequential lookup latency (< 1ms target)
  - [ ] Time-to-first-token (TTFT) for Fast Copilot (< 800ms target)
  - [ ] Full deep analysis latency (< 3.5s target)
- [ ] Document benchmarks with percentiles (p50, p95, p99) and memory footprint.

#### Block 6.2: System Hardening & Edge Cases
> 📊 **Difficulty:** `🟡 Medium-Easy` | ⏱️ **Senior Dev Benchmark:** `45 mins` | 🎯 **Your Target Time:** `1h 30m – 2h 00m`
- [ ] Handle empty search queries, foreign characters, emojis, and massive prompt injections
- [ ] Implement cache layer (LRU cache for frequent embedding queries)
- [ ] Full codebase linting and type annotations (`mypy` / `ruff`).

---

### 📅 DAY 7: FRIDAY, OCT 09 — DOCKERIZATION & LIVE PRODUCTION HOSTING

*Goal: Package Assify into a zero-dependency container and deploy to a live public host.*

#### Block 7.1: Production Dockerfile & Compose (`Dockerfile`, `docker-compose.yml`)
> 📊 **Difficulty:** `🟠 Medium-Hard` | ⏱️ **Senior Dev Benchmark:** `45 – 60 mins` | 🎯 **Your Target Time:** `1h 45m – 2h 30m`
- [ ] Write optimized multi-stage `Dockerfile`:
  - Python 3.12 slim base
  - Pre-install dependencies, ffmpeg, and SQLite3
  - Non-root user security execution
- [ ] Configure `docker-compose.yml` for unified orchestration:
  - App service (FastAPI + UI)
  - Ollama service with volume mount for model weights
  - Shared volume for SQLite database storage

#### Block 7.2: Live Cloud Deployment
> 📊 **Difficulty:** `🟠 Medium-Hard` | ⏱️ **Senior Dev Benchmark:** `1h 00m – 1h 30m` | 🎯 **Your Target Time:** `2h 00m – 3h 00m`
- [ ] Deploy to cloud platform (Hugging Face Spaces / Railway / Render / VPS)
- [ ] Configure environment variables, volume persistence, and SSL certificates
- [ ] Verify live public URL: Open browser, run live chat query, and verify instant streaming response.
- [ ] Publish open-source GitHub repository with architecture diagram, live demo link, and comprehensive documentation.

---

## 🥋 The Master-Student Code of Conduct

1. **First-Principles Only**: No blindly copy-pasting black-box libraries. Every data structure, math formula, and query must be understood down to the memory level.
2. **Speed Through Focus**: High speed comes from eliminating distractions and writing clean, minimal, modular code—not from rushing sloppy hacks.
3. **Shipped is Better Than Perfected**: We write code, test it, benchmark it, and commit it. At the end of 7 days, the world gets to see and interact with Assify.
