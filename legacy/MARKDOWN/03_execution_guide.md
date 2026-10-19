# Execution Guide — How to Actually Build This

> This file answers: *"I sit down to code today. What exactly do I do?"*
> It covers folder structure, daily workflow, common mistakes, and how to demo this for placements.

---

## 1. Project Folder Structure

Set this up on Day 1 and never deviate from it.

```
relationship-os/
│
├── data/                          # ← NEVER commit this to Git
│   ├── exports/                   # Raw WhatsApp/Instagram exports go here
│   │   ├── whatsapp/
│   │   └── instagram/
│   ├── media/                     # Voice notes, screenshots
│   └── db/
│       ├── relationships.db       # SQLite database
│       └── chromadb/              # ChromaDB persistent storage
│
├── src/                           # All source code lives here
│   ├── __init__.py
│   │
│   ├── ingestion/                 # Phase 1 — Parsing
│   │   ├── __init__.py
│   │   ├── whatsapp_parser.py
│   │   ├── instagram_parser.py
│   │   ├── voice_pipeline.py      # Phase 5
│   │   ├── image_pipeline.py      # Phase 5
│   │   └── normalizer.py          # NormalizedMessage dataclass + builder
│   │
│   ├── storage/                   # Phase 2 & 3 — Databases
│   │   ├── __init__.py
│   │   ├── database.py            # SQLite DatabaseManager class
│   │   ├── schema.sql             # All CREATE TABLE statements
│   │   └── vector_store.py        # ChromaDB wrapper
│   │
│   ├── memory/                    # Phase 3 — RAG & retrieval
│   │   ├── __init__.py
│   │   ├── embedder.py            # Calls Ollama embeddings API
│   │   ├── retriever.py           # Time-weighted retrieval logic
│   │   └── diary.py               # Diary generation + compression
│   │
│   ├── agents/                    # Phase 4 — LLM agents
│   │   ├── __init__.py
│   │   ├── agent_a.py             # Fast reply agent
│   │   ├── agent_b.py             # Deep analysis agent
│   │   └── prompts.py             # All prompt templates in one place
│   │
│   ├── background/                # Phase 6 — Concurrency
│   │   ├── __init__.py
│   │   ├── worker.py              # Background thread + task queue
│   │   └── scheduler.py           # APScheduler setup
│   │
│   └── utils/
│       ├── __init__.py
│       ├── config.py              # Load config.yaml
│       └── logger.py              # Logging setup
│
├── tests/                         # Phase 8 — Unit tests
│   ├── test_whatsapp_parser.py
│   ├── test_instagram_parser.py
│   ├── test_retriever.py
│   ├── test_decay.py
│   └── fixtures/                  # Small sample exports for testing
│       ├── sample_whatsapp.txt
│       └── sample_instagram.json
│
├── notebooks/                     # Jupyter notebooks for exploration
│   └── 01_explore_data.ipynb      # Examine raw exports before writing parsers
│
├── app.py                         # CLI entry point (Phase 7)
├── config.yaml                    # User configuration
├── requirements.txt
├── .gitignore                     # MUST include: data/, *.db, chromadb/
└── README.md
```

---

## 2. `config.yaml` — Start With This

```yaml
models:
  fast_agent: phi3-mini          # Agent-A model
  deep_agent: llama3             # Agent-B model
  embeddings: nomic-embed-text   # Embedding model
  vision: moondream              # Image caption model
  whisper_size: base             # tiny | base | small | medium

memory:
  decay_lambda: 0.01             # Half-life ~70 days; increase to forget faster
  hot_window_days: 30            # Messages younger than this stay in ChromaDB
  diary_interval_days: 30        # How often Agent-B generates diary entries
  agent_a_top_k: 5               # How many chunks Agent-A retrieves
  agent_b_top_k: 20              # How many chunks Agent-B retrieves

paths:
  database: data/db/relationships.db
  chromadb: data/db/chromadb
  exports: data/exports
  media: data/media

agent_b:
  trigger_every_n_messages: 5    # Run Agent-B after every 5 new messages
```

---

## 3. `.gitignore` — Do This First

```
# Personal data — NEVER commit
data/
*.db
*.db-shm
*.db-wal

# Python
__pycache__/
*.pyc
.venv/
venv/
*.egg-info/

# Jupyter
.ipynb_checkpoints/
notebooks/*.ipynb

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/
```

---

## 4. `NormalizedMessage` — The Heart of the System

Write this in `src/ingestion/normalizer.py` first, before any parser.
Every pipeline produces this. Every agent consumes it.

```python
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
import uuid

@dataclass
class NormalizedMessage:
    contact_name: str
    platform: str          # "whatsapp" | "instagram" | "manual"
    timestamp: datetime
    sender: str            # "me" | "them"
    content: str
    media_type: str = "text"        # "text" | "voice" | "image"
    media_path: Optional[str] = None
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    embedding_id: Optional[str] = None

    def days_ago(self) -> float:
        """How many days old is this message?"""
        return (datetime.now() - self.timestamp).total_seconds() / 86400

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "contact_name": self.contact_name,
            "platform": self.platform,
            "timestamp": self.timestamp.isoformat(),
            "sender": self.sender,
            "content": self.content,
            "media_type": self.media_type,
            "media_path": self.media_path,
            "embedding_id": self.embedding_id,
        }
```

---

## 5. The Time-Decay Function — Core Algorithm

Write this in `src/memory/retriever.py`. Test it standalone before integrating.

```python
import math
from typing import List, Tuple

def time_decay(days_ago: float, lambda_val: float = 0.01) -> float:
    """
    Returns a score between 0 and 1.
    1.0 = today, ~0.5 = 70 days ago (with default lambda)
    """
    return math.exp(-lambda_val * days_ago)


def rerank_with_decay(
    results: List[dict],   # ChromaDB query results
    lambda_val: float = 0.01,
    top_k: int = 5
) -> List[dict]:
    """
    Re-rank ChromaDB results by: similarity_score × time_decay_score
    results: list of {id, content, similarity, timestamp_unix, ...}
    """
    import time
    now = time.time()

    for r in results:
        days_ago = (now - r["metadata"]["timestamp"]) / 86400
        decay = time_decay(days_ago, lambda_val)
        r["final_score"] = r["similarity"] * decay

    return sorted(results, key=lambda x: x["final_score"], reverse=True)[:top_k]
```

**Test it manually before integrating:**
```python
# Quick sanity check — run this in a Python shell
assert time_decay(0) == 1.0           # Today = perfect score
assert 0.49 < time_decay(70) < 0.51  # ~70 days = ~half score
assert time_decay(365) < 0.03        # 1 year ago = nearly forgotten
print("Decay function works correctly")
```

---

## 6. Daily Workflow

Follow this pattern every time you sit down to code:

```
1. Open 02_learning_path.md → identify which phase you're in
2. Read the "What to Learn" for TODAY's topic (just one row)
3. Spend 30–45 min on the concept (docs, tutorial, YouTube)
4. Spend remaining time building that piece for the project
5. Commit your work: git add . && git commit -m "Phase X.Y: description"
6. Write one sentence in a PROGRESS.md file about what you learned today
```

**The rule:** Never spend more than 45 minutes learning something without writing code that uses it.

---

## 7. Debugging Guide — Problems You WILL Hit

| Problem | Likely Cause | Fix |
|---------|-------------|-----|
| WhatsApp parser misses messages | Multi-line messages (regex only catches first line) | Accumulate lines until the next timestamp is found |
| ChromaDB errors on re-add | Same ID already exists in collection | Check `collection.get(ids=[id])` before adding |
| Ollama times out | Model not loaded yet, or VRAM full | `ollama ps` to see loaded models; `ollama rm` to free space |
| SQLite "database is locked" | Two threads writing simultaneously | Enable WAL mode: `PRAGMA journal_mode=WAL` |
| Embeddings are slow (>1 min for 1k msgs) | Sending one message at a time | Batch 50 messages per API call |
| Unicode errors parsing WhatsApp | File is UTF-16 not UTF-8 | `open(path, encoding='utf-16')` or detect with `chardet` |
| Whisper crashes on `.ogg` | needs `.wav` format | Convert with `ffmpeg` first |
| Agent-A response is >5 seconds | Model too large, or context too long | Switch to `phi3-mini`; reduce retrieved chunks to 3 |
| ChromaDB collection not found | Collection name has spaces or special chars | Normalize: `contact_alice_doe` not `contact_Alice Doe!` |

---

## 8. How to Demo This for Placements

### What to Show (in this order)

1. **The folder structure** on screen — shows you can architect a real system
2. **Run ingestion**: `python app.py ingest --file exports/sample.txt --contact Alice`
   → Show messages appearing in SQLite with `sqlite3` browser or `rich` table output
3. **Run Agent-A**: `python app.py suggest --contact Alice`
   → Show 3 reply suggestions appear in ~2 seconds
4. **Show the decay working**: Query for "Alice was upset" and show it returns recent relevant messages, not old ones
5. **Show Agent-B analysis**: Show a `relationship_state` row with health score, sentiment, patterns
6. **Voice note**: Drop a `.ogg`, run the voice pipeline, show transcript in DB

### What to Say

> *"This is a privacy-first RAG system with time-weighted retrieval. The novel part is that I implemented exponential decay at query time rather than embed time — which means old memories fade naturally without needing to re-embed the entire corpus daily. I built a dual-agent architecture where a lightweight phi3-mini handles real-time suggestions and a heavier llama3 runs asynchronous deep analysis. Everything runs locally — no API keys, no data leaves the machine."*

### Questions You'll Get & How to Answer

**Q: Why not just use ChatGPT or an existing app?**
A: *"Privacy. All inferences happen on-device via Ollama. The vector DB and SQLite are local files. This was a deliberate architectural choice — personal communication data is sensitive."*

**Q: How does the time-weighting work?**
A: *"I apply exponential decay at retrieval time. Each candidate chunk gets multiplied by e^(−λ × days). So a semantically similar but 6-month-old message competes at a heavy discount against a less similar but recent one."*

**Q: What would you do differently if scaling this to production?**
A: *"Replace SQLite with PostgreSQL and ChromaDB with Pinecone or Weaviate. Replace the threading model with Celery workers. Add a proper API layer (FastAPI) between the agents and the frontend. The current architecture was optimized for local-first privacy, not horizontal scaling."*

---

## 9. Milestone Commits (Use These as Git Tags)

```bash
git tag v0.1 -m "Parsers complete: WhatsApp + Instagram"
git tag v0.2 -m "Storage complete: SQLite + ChromaDB"
git tag v0.3 -m "RAG complete: time-weighted retrieval working"
git tag v0.4 -m "Agents complete: Agent-A + Agent-B running"
git tag v0.5 -m "Multimodal: voice + image pipelines"
git tag v0.6 -m "Background processing: Agent-B async"
git tag v1.0 -m "CLI complete + tests passing + README done"
```

These tags make it easy to show interviewers exactly where you are and how the project evolved.

---

## 10. If You Get Stuck

In order of what to try:

1. **Re-read the error message slowly.** The answer is almost always in line 1 of the traceback.
2. **Print the intermediate data.** Add `print(type(x), x)` before the line that fails.
3. **Isolate the problem.** Write a 10-line script that ONLY tests the failing thing.
4. **Search the exact error.** Paste the last line of the traceback into Google verbatim.
5. **Check the library docs.** Not tutorials — the official API docs. Function signatures matter.
6. **Ask Claude** with: your code, the exact error, what you expected vs what happened.

> **Never copy-paste code you don't understand.** If you use any AI-generated code, read every line and be able to explain what it does. You'll be asked in interviews.
