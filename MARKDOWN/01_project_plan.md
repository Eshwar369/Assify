# RelationshipOS — Architecture & Project Plan

> **Privacy-first, fully local AI system for personal relationship intelligence**
> Stack: Python · LangChain · Ollama · ChromaDB · Whisper · SQLite

---

## 1. Project Overview

RelationshipOS is a local application that ingests your personal communication data (WhatsApp exports, Instagram DMs, voice notes, screenshots) and gives you two things:

- **Fast, real-time reply suggestions** based on recent conversation context
- **Deep relationship insights** — sentiment trends, emotional patterns, relationship health scores — processed quietly in the background

All inference happens on-device. No data leaves your machine.

---

## 2. System Architecture — Three Core Layers

```
┌─────────────────────────────────────────────────────────────┐
│                      INGESTION LAYER                        │
│  WhatsApp TXT  │  Instagram JSON  │  Voice (.ogg/.mp3)  │  │
│  Screenshots   │  → Parsers       │  → Whisper STT      │  │
│                │                  │  → Vision Model     │  │
└────────────────────────┬────────────────────────────────────┘
                         │ Normalized Message Objects
┌────────────────────────▼────────────────────────────────────┐
│                      STORAGE LAYER                          │
│                                                             │
│  SQLite (raw + metadata)  │  ChromaDB (vector embeddings)  │
│  Diary Store (summaries)  │  Time-decay index              │
└────────────────────────┬────────────────────────────────────┘
                         │ Retrieval via Time-Weighted RAG
┌────────────────────────▼────────────────────────────────────┐
│                      AGENT LAYER                            │
│                                                             │
│  Agent-A (Fast)           │  Agent-B (Deep)                │
│  • phi3-mini / mistral    │  • llama3 / mixtral            │
│  • Real-time replies      │  • Sentiment analysis          │
│  • <2s response target    │  • Relationship state          │
│  • Reads last 20 msgs     │  • Runs async/scheduled        │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Feature 1 — Time-Weighted Memory (RAG System)

### 3.1 How It Works

Standard RAG retrieves chunks by semantic similarity alone. This fails for relationship data because a message from 2 years ago saying *"I love you"* is semantically similar to one from yesterday — but contextually irrelevant.

Time-weighting solves this by multiplying the similarity score by a **recency decay factor**.

**Decay formula:**

```
final_score = cosine_similarity × e^(−λ × days_since_sent)
```

- `λ` (lambda) controls how fast old memories fade. Start with `0.01` (half-life ≈ 70 days).
- Recent messages score high even with moderate semantic similarity.
- Old messages only surface if their semantic similarity is overwhelmingly strong.

### 3.2 The Diary System (Long-Term Compression)

Every conversation's raw messages cannot all stay in the vector store forever — this causes context window overflow and retrieval noise. The **Diary** compresses old data.

**Two-tier memory model:**

| Tier | Contents | Storage | Lifespan |
|------|----------|---------|----------|
| **Hot Memory** | Last 30 days of raw messages | ChromaDB + SQLite | Rolling window |
| **Diary** | Monthly summaries per contact | SQLite (text) | Permanent |

**Diary generation (runs monthly, per contact):**

Agent-B reads all messages from the past month → produces a structured summary:
```
Month: June 2025 | Contact: Alice
- Emotional tone: Warm, occasional friction around work stress
- Key events: Trip to Goa planned, argument on June 14 about money
- Sentiment trajectory: Started tense (6/1–6/10), improved after June 14 apology
- Relationship health score: 72/100
```

This summary is stored as text in SQLite and also embedded into ChromaDB as a single vector. During retrieval, diary entries compete with raw messages — so context from 6 months ago can surface if it's strongly relevant, without flooding the context window.

### 3.3 Identified Bottlenecks

| Bottleneck | Cause | Solution |
|------------|-------|----------|
| **Stale embeddings** | You embed once at ingestion; decay changes daily but embeddings don't | Store `timestamp` in metadata; apply decay at query time, not embed time |
| **Cold start on new contacts** | No history → no diary → poor suggestions | Treat the first 10 messages as "hot" regardless of age; skip time-decay for new contacts |
| **Diary generation latency** | Summarizing 1000 messages blocks the UI | Run Agent-B in a background thread/process; diary is never in the critical path |
| **Embedding model drift** | If you switch embedding models later, old and new vectors are incompatible | Store raw text permanently in SQLite; re-embed is always possible |
| **Retrieval window too large** | Fetching top-50 chunks slows Agent-A below 2s | Agent-A fetches top-5 only; Agent-B fetches top-20 |
| **Flat chromadb performance** | ChromaDB slows after ~500k vectors | Partition collections by contact name; each contact gets its own ChromaDB collection |

---

## 4. Feature 2 — Multi-Agent Processing

### 4.1 Agent-A: The Fast Responder

**Goal:** Suggest 2–3 reply options in under 2 seconds.

- **Model:** `phi3-mini` (via Ollama) — small, fast, good at instruction following
- **Context window used:** Last 10–20 messages only (no diary, no deep retrieval)
- **Trigger:** Fires immediately when user opens a conversation or pastes new message
- **Output:** 3 reply options ranked by tone (casual / warm / assertive)

**Agent-A prompt structure:**
```
[SYSTEM] You are a helpful reply assistant. Be concise.
[CONTEXT] Last 15 messages between User and {contact_name}
[TASK] Suggest 3 short reply options for the last message.
```

### 4.2 Agent-B: The Deep Analyst

**Goal:** Continuously maintain a relationship state model.

- **Model:** `llama3` or `mistral` (via Ollama) — slower, more capable
- **Trigger:** Runs in background thread; fires after every 5 new messages, or on-demand
- **Tasks:**
  1. Sentiment scoring per message (positive / negative / neutral + intensity)
  2. Relationship health score update (0–100)
  3. Pattern detection ("This contact tends to go cold after arguments")
  4. Monthly diary entry generation

**Agent-B output stored to SQLite:**
```
- sentiment_log: per-message sentiment scores
- relationship_state: current health score, dominant emotion, last updated
- patterns: detected recurring behaviors
```

### 4.3 Inter-Agent Communication

Agents do not call each other directly. They share state through the database:

```
Agent-A reads:  ChromaDB (recent vectors) + SQLite (last N raw messages)
Agent-B reads:  ChromaDB (all vectors) + SQLite (full history)
Agent-B writes: SQLite (diary, sentiment_log, relationship_state, patterns)
Agent-A reads:  SQLite (relationship_state) → uses as soft context hint
```

---

## 5. Feature 3 — Multi-Modal Ingestion Pipelines

### 5.1 Voice Notes (Whisper)

```
Input: .ogg / .mp3 / .m4a file
       ↓
[faster-whisper local model]  ← runs entirely offline
       ↓
Transcript text + speaker diarization (optional)
       ↓
Treated identically to a text message with media_type = "voice"
```

**Key decision:** Use `faster-whisper` (CTranslate2 backend), not the original OpenAI Whisper. It's 4× faster and uses less VRAM.

### 5.2 Screenshots / Images (Vision Model)

```
Input: .jpg / .png screenshot
       ↓
[LLaVA or moondream via Ollama]
       ↓
Caption / OCR text extraction
       ↓
Stored with media_type = "image", original path retained
```

**Key decision:** Use `moondream` for speed (lightweight vision model), `LLaVA` for accuracy. Let user configure.

### 5.3 Pipeline Normalization

All ingestion paths produce a **NormalizedMessage** object:

```python
{
  "id": "uuid",
  "contact_name": "Alice",
  "platform": "whatsapp",          # whatsapp | instagram | manual
  "timestamp": "2025-06-14T10:32:00",
  "sender": "me",                   # me | them
  "content": "Transcribed or raw text",
  "media_type": "text",             # text | voice | image
  "original_media_path": None,      # path to original file if applicable
  "embedding": None                 # filled after embed step
}
```

---

## 6. Database Schema

### 6.1 SQLite — `relationships.db`

**Table: `messages`**
```sql
CREATE TABLE messages (
    id              TEXT PRIMARY KEY,       -- UUID
    contact_name    TEXT NOT NULL,
    platform        TEXT NOT NULL,          -- whatsapp | instagram | manual
    timestamp       DATETIME NOT NULL,
    sender          TEXT NOT NULL,          -- me | them
    content         TEXT NOT NULL,          -- raw or transcribed text
    media_type      TEXT DEFAULT 'text',    -- text | voice | image
    media_path      TEXT,                   -- local path to original file
    embedding_id    TEXT,                   -- ChromaDB document ID (foreign ref)
    ingested_at     DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_messages_contact_time ON messages(contact_name, timestamp DESC);
```

**Table: `diary_entries`**
```sql
CREATE TABLE diary_entries (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_name    TEXT NOT NULL,
    period_start    DATE NOT NULL,
    period_end      DATE NOT NULL,
    summary_text    TEXT NOT NULL,          -- Agent-B generated summary
    health_score    INTEGER,                -- 0-100
    embedding_id    TEXT,                   -- ChromaDB ID for this summary
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Table: `relationship_state`**
```sql
CREATE TABLE relationship_state (
    contact_name        TEXT PRIMARY KEY,
    health_score        INTEGER,            -- 0-100, updated by Agent-B
    dominant_sentiment  TEXT,              -- positive | negative | neutral
    last_interaction    DATETIME,
    interaction_count   INTEGER DEFAULT 0,
    notes               TEXT,              -- Agent-B pattern notes (JSON string)
    last_updated        DATETIME
);
```

**Table: `sentiment_log`**
```sql
CREATE TABLE sentiment_log (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id      TEXT NOT NULL,          -- FK → messages.id
    contact_name    TEXT NOT NULL,
    sentiment       TEXT NOT NULL,          -- positive | negative | neutral
    score           REAL NOT NULL,          -- -1.0 to 1.0
    analyzed_at     DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_sentiment_contact ON sentiment_log(contact_name, analyzed_at DESC);
```

**Table: `ingestion_log`**
```sql
CREATE TABLE ingestion_log (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    file_path       TEXT NOT NULL,
    platform        TEXT NOT NULL,
    status          TEXT NOT NULL,          -- success | failed | partial
    messages_count  INTEGER DEFAULT 0,
    error_text      TEXT,
    processed_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 6.2 ChromaDB — Vector Collections

```
Collection naming convention: contact_{normalized_name}
Example: contact_alice, contact_john_doe

Each document in ChromaDB has:
  - id:        Same UUID as SQLite messages.id
  - embedding: Generated by local embedding model (nomic-embed-text)
  - metadata:  {
      "contact_name": "Alice",
      "timestamp": 1718358720,     ← Unix timestamp (for decay math)
      "sender": "me",
      "media_type": "text",
      "is_diary": false
    }
```

**Why one collection per contact?** ChromaDB's `where` filter is slow on large collections. Partitioning by contact keeps each collection small and query-fast.

---

## 7. Critical Architecture Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Embedding model | `nomic-embed-text` via Ollama | Fast, local, 768-dim, good for conversational text |
| Vector DB | ChromaDB (persistent) | Pure Python, local-first, no server needed |
| Decay applied at | Query time | Decay is a function of current date; applying at embed time would require re-embedding daily |
| Agent communication | Shared SQLite | Simple, no message queues, no race conditions if you use WAL mode |
| Ollama concurrency | Sequential queue | Ollama on a single GPU cannot run two models simultaneously; queue requests |
| WhatsApp parser | Custom (regex-based) | WhatsApp export format is undocumented and changes; own parser = full control |

---

## 8. What This Project Is NOT

- Not a cloud service (no API keys needed at runtime)
- Not a real-time chat client (it reads exports, not live messages)
- Not a therapy tool (relationship health scores are pattern indicators, not clinical assessments)
