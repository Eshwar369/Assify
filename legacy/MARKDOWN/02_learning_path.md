# Learning Path — RelationshipOS
### From Zero to Shipping · Placement-Ready Skills Included

> **Philosophy:** Learn each concept by immediately applying it to the project. No isolated tutorials. Every skill you pick up goes straight into the codebase.
>
> **Total estimated time:** ~160–200 hours (8–10 weeks at 20 hrs/week)

---

## Phase 0 — Environment & Foundations
**Duration: ~8 hours**
*Do this before writing a single line of project code. A bad setup wastes days.*

| # | Topic | What to Learn | Hours |
|---|-------|---------------|-------|
| 0.1 | Python Environment | `pyenv`, `venv`, `pip`, project structure, `requirements.txt` | 1h |
| 0.2 | Git Basics | `init`, `add`, `commit`, `branch`, `.gitignore` (ignore your data files!) | 1h |
| 0.3 | Ollama Setup | Install Ollama, pull `phi3-mini`, `llama3`, `nomic-embed-text`, `moondream`. Understand what a model server is. | 2h |
| 0.4 | Python Fundamentals Review | If shaky: dataclasses, type hints, f-strings, list comprehensions, `pathlib`, `datetime` | 2h |
| 0.5 | Reading JSON & Text Files | `json.loads`, reading `.txt` files, encoding issues (UTF-8 vs UTF-16 in WhatsApp exports) | 1h |
| 0.6 | Understand the Project | Read `01_project_plan.md` fully. Sketch the folder structure on paper. | 1h |

**Checkpoint:** You can run `ollama run phi3-mini "hello"` and get a response. Your project folder exists with a `venv` and a `.gitignore`.

---

## Phase 1 — Data Ingestion & Parsing
**Duration: ~20 hours**
*This is unglamorous but critical. The quality of everything downstream depends on this.*

| # | Topic | What to Learn | Hours |
|---|-------|---------------|-------|
| 1.1 | Regex in Python | `re.compile`, groups, `re.findall`, `re.search` — specifically for parsing WhatsApp date/time/sender patterns | 3h |
| 1.2 | WhatsApp Export Format | Manually examine a real `.txt` export. Identify the line pattern: `[DD/MM/YYYY, HH:MM:SS] Name: message`. Handle multi-line messages (continuation lines have no timestamp). | 2h |
| 1.3 | Instagram Export Format | Examine Instagram's JSON structure (`messages/inbox/{contact}/message_1.json`). Learn how to navigate nested JSON with Python. | 2h |
| 1.4 | Python Dataclasses | `@dataclass`, `field()`, `asdict()` — use these to define your `NormalizedMessage` object | 1h |
| 1.5 | `uuid` module | Generate unique IDs for every message (`uuid4()`). Understand why stable IDs matter for deduplication. | 0.5h |
| 1.6 | `datetime` module | Parse timestamp strings, convert to Unix timestamps, timezone awareness (`datetime.fromisoformat`, `.timestamp()`) | 2h |
| 1.7 | File & Folder traversal | `pathlib.Path`, `glob`, `os.walk` — scan a folder of exports and feed them to your parsers | 1h |
| 1.8 | Build WhatsApp Parser | Write and test your own parser. Handle: media omitted messages, system messages ("Alice joined"), multi-line messages | 4h |
| 1.9 | Build Instagram Parser | Write parser for JSON format. Extract sender, content, timestamp, and reaction data. | 3h |
| 1.10 | Deduplication Logic | Hash (content + timestamp + contact) to detect duplicate imports. Use Python's `hashlib`. | 1.5h |

**Checkpoint:** Given a real WhatsApp export `.txt`, your parser produces a clean list of `NormalizedMessage` objects with no duplicates.

---

## Phase 2 — SQLite & Persistent Storage
**Duration: ~15 hours**
*You'll use SQLite for the rest of your career. Worth learning properly.*

| # | Topic | What to Learn | Hours |
|---|-------|---------------|-------|
| 2.1 | SQL Fundamentals | `CREATE TABLE`, `INSERT`, `SELECT`, `WHERE`, `ORDER BY`, `JOIN`, `INDEX` | 4h |
| 2.2 | Python `sqlite3` module | `connect()`, `cursor()`, `execute()`, `executemany()`, `commit()`, context managers | 2h |
| 2.3 | WAL Mode | What Write-Ahead Logging is, why it prevents locking when Agent-A and Agent-B both access the DB | 0.5h |
| 2.4 | Schema Design | Create all 5 tables from the schema in `01_project_plan.md`. Write the `CREATE TABLE` statements yourself. | 2h |
| 2.5 | Batch Inserts | `executemany()` — insert 10,000 messages efficiently instead of one by one | 1h |
| 2.6 | Query Patterns | Write the 5 queries you'll use most: get last N messages, get messages by contact+date range, get relationship state | 2h |
| 2.7 | Database Manager Class | Wrap all DB operations in a `DatabaseManager` class. Learn why this is better than raw `sqlite3` calls everywhere. | 3h |

**Checkpoint:** You can ingest 5,000 parsed messages into SQLite and query them back correctly. The DB has all 5 tables. WAL mode is on.

---

## Phase 3 — Embeddings & Vector Database
**Duration: ~20 hours**
*This is where AI starts. Understand what embeddings ARE before using them.*

| # | Topic | What to Learn | Hours |
|---|-------|---------------|-------|
| 3.1 | What are Embeddings? | Conceptual understanding: text → fixed-length number vector. Similar meaning = similar vectors. Watch 3Blue1Brown's neural network series if needed. | 3h |
| 3.2 | Cosine Similarity | The math: `cos(θ) = A·B / (|A||B|)`. Implement it manually in numpy first. Then trust ChromaDB to do it. | 1.5h |
| 3.3 | `numpy` Basics | Arrays, dot product, vector math — you'll use this for the decay formula | 2h |
| 3.4 | Calling Ollama Embeddings API | `POST /api/embeddings` with `nomic-embed-text`. Parse the response. Generate embeddings for 10 test messages. | 2h |
| 3.5 | ChromaDB Fundamentals | Install ChromaDB (persistent mode). Understand: client, collection, `add()`, `query()`, metadata filtering | 3h |
| 3.6 | ChromaDB Metadata | Store `timestamp`, `contact_name`, `sender`, `is_diary` in metadata. Query with `where={"contact_name": "Alice"}` | 2h |
| 3.7 | Time-Decay Math | Implement `e^(−λ × days)` in Python. Test with dummy data: score should be 1.0 for today, ~0.5 for 70 days ago. | 2h |
| 3.8 | Time-Weighted Retrieval | Write the retrieval function: query ChromaDB → get top-20 results → re-rank by `similarity × decay` → return top-5 | 3h |
| 3.9 | Batch Embedding Pipeline | Embed 5,000 messages efficiently using batches of 50. Track which messages have been embedded (use `embedding_id` in SQLite). | 1.5h |

**Checkpoint:** Given a query "Alice seems upset recently", your retrieval function returns the 5 most relevant AND recent messages, not just semantically similar old ones.

---

## Phase 4 — Ollama & LangChain Integration
**Duration: ~20 hours**
*LangChain is a toolkit. Understand it, don't worship it. You'll use ~20% of it.*

| # | Topic | What to Learn | Hours |
|---|-------|---------------|-------|
| 4.1 | How LLMs Work (Conceptually) | Tokens, context window, temperature, system prompts vs user prompts. No math needed. | 2h |
| 4.2 | Ollama Python Client | `ollama.chat()`, `ollama.generate()`, streaming responses, model options (temperature, top_p) | 2h |
| 4.3 | Prompt Engineering | System prompts, few-shot examples, structured output (ask the model to return JSON). Practice with 10 relationship-specific prompts. | 3h |
| 4.4 | LangChain Core Concepts | `ChatOllama`, `ChatPromptTemplate`, `StrOutputParser`, `RunnableSequence`. Understand the pipe (`|`) syntax. | 3h |
| 4.5 | LangChain with ChromaDB | `Chroma` vectorstore wrapper, `as_retriever()`, `RetrievalQA` chain. Understand when to use LangChain's wrappers vs calling ChromaDB directly. | 3h |
| 4.6 | Build Agent-A | Prompt + model + retrieval chain. Input: last 10 messages. Output: 3 reply options. Measure latency. | 4h |
| 4.7 | Build Agent-B | Longer prompt, deeper context. Input: 30 days of messages. Output: structured JSON with health_score, sentiment, patterns. | 3h |

**Checkpoint:** Agent-A returns 3 reply suggestions in under 3 seconds. Agent-B produces a structured JSON analysis of a test conversation.

---

## Phase 5 — Multi-Modal Processing
**Duration: ~18 hours**
*Voice and image processing are separate pipelines that plug into Phase 1.*

| # | Topic | What to Learn | Hours |
|---|-------|---------------|-------|
| 5.1 | Audio Fundamentals | What sample rate, bitrate, and audio codec mean. Why WhatsApp uses `.ogg` (Opus codec). | 1h |
| 5.2 | `faster-whisper` Library | Install, load model (`base` or `small`), transcribe a file, get segments with timestamps | 3h |
| 5.3 | Audio Format Conversion | Use `ffmpeg` (via `subprocess`) to convert `.ogg` → `.wav` before feeding to Whisper | 1.5h |
| 5.4 | Build Voice Pipeline | End-to-end: `.ogg` file → transcription text → `NormalizedMessage` object → into SQLite + ChromaDB | 3h |
| 5.5 | Image Processing Basics | PIL/Pillow: open image, resize, convert to base64 (required for vision model API calls) | 1.5h |
| 5.6 | Vision Model via Ollama | `ollama.chat()` with `moondream` or `llava`. Pass image as base64. Get caption/OCR output. | 2h |
| 5.7 | Build Image Pipeline | Screenshot → vision model → extracted text → `NormalizedMessage` → storage | 3h |
| 5.8 | Pipeline Orchestration | Single `IngestManager` class that routes files by extension to the right pipeline | 3h |

**Checkpoint:** Drop a WhatsApp voice note (`.ogg`) and a screenshot into a folder. The system transcribes/OCRs both and stores them alongside text messages.

---

## Phase 6 — Background Processing & Concurrency
**Duration: ~15 hours**
*Agent-B cannot block the UI. This phase teaches you to run things in parallel.*

| # | Topic | What to Learn | Hours |
|---|-------|---------------|-------|
| 6.1 | Python Threading | `threading.Thread`, `daemon=True`, `Lock` for shared resource access, why you need it | 3h |
| 6.2 | Python `queue` Module | `Queue`, `put()`, `get()`, `task_done()` — build a task queue for Agent-B jobs | 2h |
| 6.3 | SQLite WAL + Threading | How SQLite WAL mode prevents read/write conflicts when Agent-A and Agent-B run simultaneously | 1h |
| 6.4 | Background Diary Generator | Schedule Agent-B to summarize the past month for a contact, write to `diary_entries`, embed the summary | 4h |
| 6.5 | Task Scheduler | Use `schedule` library (or `APScheduler`) to trigger Agent-B every night and after every 5 new messages | 2h |
| 6.6 | Graceful Shutdown | Handle `KeyboardInterrupt`, flush the queue, close DB connections cleanly | 1h |
| 6.7 | Logging | Python `logging` module — log ingestion counts, agent runs, errors to a rotating log file | 2h |

**Checkpoint:** You can ingest new messages while Agent-B runs in the background. The UI (even if just a terminal) stays responsive. Diary entries appear in SQLite after Agent-B runs.

---

## Phase 7 — CLI Interface (Your First "UI")
**Duration: ~10 hours**
*Build a terminal UI first. Fast to build, easy to test, looks good in demos.*

| # | Topic | What to Learn | Hours |
|---|-------|---------------|-------|
| 7.1 | `argparse` Module | Build a CLI with subcommands: `ingest`, `analyze`, `suggest`, `diary` | 2h |
| 7.2 | `rich` Library | Colored terminal output, tables, progress bars — makes your CLI look professional | 2h |
| 7.3 | Interactive Prompt Loop | `input()` loop for conversation mode: paste a message, get reply suggestions, repeat | 2h |
| 7.4 | Config File | `config.ini` or `config.yaml` for user settings (model names, decay lambda, contact aliases) | 2h |
| 7.5 | Demo Script | Write a `demo.py` that ingests sample data, runs analysis, and shows results — for placement demos | 2h |

**Checkpoint:** `python app.py ingest --file exports/whatsapp.txt --contact Alice` works. `python app.py suggest --contact Alice` returns reply options.

---

## Phase 8 — Testing, Hardening & Documentation
**Duration: ~14 hours**
*This is what separates a portfolio project from a toy. Recruiters notice this.*

| # | Topic | What to Learn | Hours |
|---|-------|---------------|-------|
| 8.1 | `pytest` Basics | `test_*.py` files, `assert`, fixtures, `tmp_path` for temp DB files | 3h |
| 8.2 | Unit Tests | Test each parser, the decay function, the deduplication logic, the `NormalizedMessage` builder | 4h |
| 8.3 | Edge Case Hardening | Empty exports, corrupt files, messages with only emoji, Unicode edge cases, zero-message contacts | 2h |
| 8.4 | `README.md` | Architecture diagram (ASCII is fine), setup instructions, example outputs, your design decisions | 3h |
| 8.5 | Code Cleanup | Type hints everywhere, docstrings on public functions, remove debug prints, consistent naming | 2h |

**Checkpoint:** `pytest` passes on all unit tests. A stranger can clone your repo and run it in 10 minutes following only the README.

---

## Summary Timeline

```
Week 1:   Phase 0 + Phase 1    (Foundations + Parsing)          ~28h
Week 2:   Phase 2              (SQLite)                         ~15h
Week 3:   Phase 3              (Embeddings + ChromaDB)          ~20h
Week 4:   Phase 4              (Ollama + LangChain + Agents)    ~20h
Week 5:   Phase 5              (Voice + Image Pipelines)        ~18h
Week 6:   Phase 6              (Background Processing)          ~15h
Week 7:   Phase 7              (CLI Interface)                  ~10h
Week 8:   Phase 8              (Testing + Documentation)        ~14h
────────────────────────────────────────────────────────────────
Total:                                                   ~140h base
                                               + ~20–30h debugging
```

---

## Key Resources (All Free)

| Topic | Resource |
|-------|----------|
| Python | [docs.python.org/3/tutorial](https://docs.python.org/3/tutorial) — official tutorial, read it |
| SQL | [sqlitetutorial.net](https://sqlitetutorial.net) |
| ChromaDB | [docs.trychroma.com](https://docs.trychroma.com) |
| LangChain | [python.langchain.com/docs](https://python.langchain.com/docs) |
| Ollama | [ollama.com/library](https://ollama.com/library) |
| Whisper | [github.com/SYSTRAN/faster-whisper](https://github.com/SYSTRAN/faster-whisper) |
| Regex | [regexr.com](https://regexr.com) — live testing |
| Embeddings | "Embeddings: What they are and why they matter" — Simon Willison's blog |

---

## Placement-Relevant Skills You'll Have After This Project

This project teaches you concepts that come up in data/ML/backend engineering interviews:

- **RAG systems** — asked in every AI-adjacent role
- **Vector databases** — ChromaDB, Pinecone, Weaviate are all the same concept
- **SQL schema design** — normalization, indexing, query optimization
- **Async/concurrent Python** — threading, queues, background workers
- **Data pipeline design** — ingestion → normalization → storage → retrieval
- **Multi-modal AI** — Whisper + vision models + LLMs in one system
- **Prompt engineering** — structured outputs, chain-of-thought
- **Local LLM deployment** — Ollama, model selection, latency tradeoffs
