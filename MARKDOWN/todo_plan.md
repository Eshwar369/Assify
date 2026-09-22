# 🚀 ASSIFY — Hands-On Execution TODO Plan

Welcome to your active learning workspace! You are building **ASSIFY** from the ground up.
The rule of engagement: **You write the code, I guide your thinking, challenge edge cases, and mentor your architectural decisions.**

---

## 🎯 Current Milestone: Phase 1 — Data Ingestion & Normalization

Before jumping to LangChain or vector DBs, you need clean, structured data objects. If the parser is broken, downstream models produce garbage.

### Task 1.1: Inspect the Raw WhatsApp Data 🔍
- [ ] Open `data/assify_data.txt`.
- [ ] Inspect 20–30 lines and identify:
  - [ ] Exact timestamp format (e.g. `[12/04/23, 18:30:15]` vs `12/04/23, 6:30 pm - `).
  - [ ] Separator between timestamp and sender.
  - [ ] Separator between sender and message text.
  - [ ] What system messages look like (e.g. *"Messages and calls are end-to-end encrypted"*).
  - [ ] What omitted media lines look like (e.g. `<Media omitted>` or `image omitted`).
  - [ ] How multi-line messages behave (messages with Enter/newlines).

---

### Task 1.2: Set Up Proper Project Structure 📁
Organize your workspace as defined in [03_execution_guide.md](file:///c:/Users/DELL/gen%20ai/Assify/MARKDOWN/03_execution_guide.md):
- [x] Create folder `src/ingestion/`
- [x] Create folder `src/storage/`
- [x] Create folder `src/memory/`
- [x] Create folder `src/agents/`
- [x] Create folder `src/utils/`
- [x] Add empty `__init__.py` in each of these folders.
- [x] Update `.gitignore` to ensure `data/`, `*.db`, and vector stores are ignored.

---

### Task 1.3: Define `NormalizedMessage` Dataclass 🧱
File: `src/ingestion/normalizer.py`
- [ ] Understand why Python `@dataclass` is better than raw dictionaries.
- [ ] Implement fields:
  - `id`: Unique identifier (`uuid.uuid4()`)
  - `contact_name`: string
  - `platform`: string ("whatsapp", "instagram", etc.)
  - `timestamp`: `datetime` object
  - `sender`: string ("me" or "them")
  - `content`: string
  - `media_type`: string ("text", "voice", "image")
  - `media_path`: Optional string
  - `embedding_id`: Optional string
- [ ] Add helper methods:
  - `days_ago() -> float`: calculates age in days from current time.
  - `to_dict() -> dict`: serializes dataclass for DB / Chroma insertion.

---

### Task 1.4: Design and Test the Regex Pattern 🧪
File: `src/ingestion/whatsapp_parser.py` (or test in a quick scratch file / notebook)
- [ ] Write a regular expression using `re.compile(...)` that extracts:
  - Date string
  - Time string
  - Sender name
  - Message body
- [ ] Verify handling of:
  - Normal message lines
  - System notices (filter them out)
  - Multi-line continuation logic: If a line doesn't start with a timestamp, it belongs to the previous message's `content`!

---

### Task 1.5: Build the Full WhatsApp Parser Function ⚙️
- [ ] Function signature: `parse_whatsapp(file_path: str, contact_name: str, my_name: str) -> list[NormalizedMessage]`
- [ ] Stream through the file line-by-line (`with open(...) as f:`).
- [ ] Map raw sender names to `"me"` or `"them"`.
- [ ] Parse date strings into real Python `datetime` objects.
- [ ] Return a clean list of `NormalizedMessage` instances.
- [ ] Test on `data/assify_data.txt` and print out the first 5 parsed objects.

---

## 🗺️ Upcoming Roadmap (Preview)

- [ ] **Phase 2: SQLite Storage Layer** (`src/storage/database.py`)
  - Table schemas: `messages`, `diary_entries`, `relationship_state`, `sentiment_log`
  - Write batch insertion with `executemany`
  - Enable SQLite WAL mode
- [ ] **Phase 3: Vector Embeddings & Time-Decay Math** (`src/memory/`)
  - Run Ollama local embedding model (`nomic-embed-text`)
  - Integrate ChromaDB collection partitioned per contact
  - Implement time-decay re-ranking: `similarity * e^(-lambda * days)`
- [ ] **Phase 4: Multi-Agent System with Ollama** (`src/agents/`)
  - Agent-A (Fast real-time reply generator)
  - Agent-B (Deep relationship analyzer & monthly summarizer)
- [ ] **Phase 5: Voice & Multimodal Extensions**
- [ ] **Phase 6: CLI & Testing**

---

### 👉 Immediate Next Action:
Work on **Task 1.1** and **Task 1.2**. Once you check the raw text format in `data/assify_data.txt`, share what patterns you noticed or ask questions about how to structure the parser!
