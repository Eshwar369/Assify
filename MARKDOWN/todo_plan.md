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
- [x] Function signature: `parse_whatsapp_file(file_path: str, contact_name: str, my_name: str) -> list[NormalizedMessage]`
- [x] Stream through the file line-by-line (`with open(...) as f:`).
- [x] Map raw sender names to `"me"` or `"them"`.
- [x] Parse date strings into real Python `datetime` objects.
- [x] Return a clean list of `NormalizedMessage` instances.
- [x] Tested on `data/assify_data.txt` and verified output.

---

## 🎯 Phase 2: SQLite Storage Layer 🗄️

- [x] **Task 2.1: Design Database Schema** (`storage/schema.sql`)
  - [x] Define `messages` table with primary key `id`, metadata columns, `time_stamp`, `media_type`, `embedding_id`.
  - [x] Create composite index on `(contact_name, time_stamp DESC)` for fast historical queries.
- [x] **Task 2.2: Batch Insertion with WAL Mode** (`storage/sqlsaving.py`)
  - [x] Enable SQLite WAL mode (`PRAGMA journal_mode=WAL`).
  - [x] Use parameterized queries (`INSERT OR IGNORE INTO messages ... (?, ?, ...)`).
  - [x] Perform high-speed bulk ingestion using `cursor.executemany()`.
- [x] **Task 2.3: Sanity Check & Exploration** (`storage/check.py`)
  - [x] Fetch tuples and inspect columns.
  - [x] Run time-filtered queries and keyword searches (`LIKE "%sorry%"`).
- [ ] **Task 2.4: Architecture Encapsulation (Clean Code)**
  - [ ] Understand why loose scripts (`sqlsaving.py`, `check.py`) should be organized into a reusable `DatabaseManager` class (`src/storage/database.py`).
  - [ ] Add helper queries to `DatabaseManager`:
    - `get_unembedded_messages(contact_name: str, limit: int)`
    - `update_embedding_id(message_id: str, embedding_id: str)`
    - `get_recent_messages(contact_name: str, limit: int)`

---

## 🧠 Phase 3: Vector Embeddings, ChromaDB & Time-Decay Memory Layer

This phase bridges the gap between simple keyword search and real AI memory. You will master the linear algebra, the vector database mechanics, and the time-decay algorithm.

### 📚 Part 3.1: Foundational Math & Concepts (What to Learn)
- [ ] **Core Concept: What is an Embedding?**
  - [ ] Mental model: Translating human semantic meaning into high-dimensional vector coordinates (e.g. 768 float values).
  - [ ] Understand Dense vs. Sparse representations (Why embeddings beat TF-IDF / BM25 for emotional context).
  - [ ] Tokenization basics & context window limits of embedding models (`nomic-embed-text`).
- [ ] **Vector Math from Scratch:**
  - [ ] Dot Product: Geometric intuition and algebraic calculation ($\vec{A} \cdot \vec{B} = \sum A_i B_i$).
  - [ ] Vector Magnitude (Euclidean / L2 Norm: $\|\vec{A}\| = \sqrt{\sum A_i^2}$).
  - [ ] Cosine Similarity formula: $\cos(\theta) = \frac{\vec{A} \cdot \vec{B}}{\|\vec{A}\| \|\vec{B}\|}$.
  - [ ] Why cosine similarity produces a value between -1 and 1 (or 0 and 1 for normalized embeddings).
  - [ ] Distance Metrics compared: Cosine Distance ($1 - \cos(\theta)$), Squared L2 Distance, Inner Product.

### 🧪 Part 3.2: Hands-on Vector Experiments in Python
- [ ] **Scratch Experiment 1: Cosine Similarity in pure Python / NumPy**
  - [ ] Create a scratch script or notebook (`notebooks/02_test_embeddings.ipynb` or `scratch/test_math.py`).
  - [ ] Implement `cosine_similarity(vec_a, vec_b)` using NumPy.
  - [ ] Verify that identical vectors yield `1.0`, orthogonal vectors yield `0.0`, and opposite vectors yield `-1.0`.
- [ ] **Scratch Experiment 2: Talking to Ollama's Embedding API**
  - [ ] Understand the Ollama REST API endpoint (`POST http://localhost:11434/api/embeddings` or `/api/embed`).
  - [ ] Send test payload with model `"nomic-embed-text"` and prompt `"I am so sorry"`.
  - [ ] Inspect the returned vector: verify its dimensionality (768 dims).
  - [ ] Compare similarity between:
    - `"I am so sorry"` vs `"Please forgive me, my apologies"` (expect high score ~0.8+)
    - `"I am so sorry"` vs `"Let's go eat pizza tomorrow"` (expect lower score)

### 🏛️ Part 3.3: ChromaDB Vector Database Deep-Dive
- [ ] **Vector Database Theory:**
  - [ ] Why can't we just store vectors in a Python list and loop over them? ($O(N \cdot D)$ brute-force vs. Approximate Nearest Neighbors / ANN).
  - [ ] High-level intuition of HNSW (Hierarchical Navigable Small World graphs).
- [ ] **ChromaDB Mechanics:**
  - [ ] Difference between Ephemeral (in-memory) vs. Persistent Client (`chromadb.PersistentClient(path=...)`).
  - [ ] Anatomy of a Collection: `name`, `metadata={"hnsw:space": "cosine"}`.
  - [ ] The 4 core components stored per record:
    - `ids`: list[str] (unique UUIDs)
    - `embeddings`: list[list[float]] (optional if using built-in embedding function, but we pass precomputed Ollama vectors)
    - `documents`: list[str] (the raw text)
    - `metadatas`: list[dict] (e.g. `timestamp`, `sender`, `contact_name`)
  - [ ] Multi-tenant / Contact Partitioning: Why ASSIFY uses a separate collection per contact (e.g. `col_contact_sleepless_zombiee`).

### ⏳ Part 3.4: The Time-Decay Algorithm (The Heart of ASSIFY)
- [ ] **The Theory:**
  - [ ] Why pure semantic search fails for relationships (a 2-year-old fight vs. yesterday's fight).
  - [ ] The Exponential Decay Formula:
    $$\text{Decay}(\Delta t) = e^{-\lambda \cdot \Delta t}$$
    $$\text{Final Score} = \text{Cosine Similarity} \times \text{Decay}(\Delta t)$$
  - [ ] Calculating Half-life: $t_{1/2} = \frac{\ln(2)}{\lambda}$.
    - If $\lambda = 0.01$: half-life is $\approx 69.3$ days.
    - If $\lambda = 0.05$: half-life is $\approx 13.8$ days.
- [ ] **Critical Architectural Decision:**
  - [ ] *Why do we apply time-decay at query-time rather than embedding-time?*
    (Because time passes every day; if decay were baked into the stored vector, vectors would have to be recalculated daily!).
- [ ] **Implementation & Testing:**
  - [ ] Write `time_decay(days_ago: float, lambda_val: float) -> float`.
  - [ ] Write unit tests / sanity checks to verify:
    - `days_ago = 0` $\rightarrow 1.0$
    - `days_ago = 70` $\rightarrow \approx 0.5$
    - `days_ago = 365` $\rightarrow < 0.03$

### 🔨 Part 3.5: Build the Production Memory Modules
- [ ] **Module 1: Ollama Embedder** (`src/memory/embedder.py`)
  - [ ] Class `OllamaEmbedder`:
    - Handles single text embedding: `embed_text(text: str) -> list[float]`
    - Handles batch text embedding: `embed_batch(texts: list[str]) -> list[list[float]]`
    - Handles timeouts and connection errors gracefully.
- [ ] **Module 2: ChromaDB Vector Store Wrapper** (`src/storage/vector_store.py`)
  - [ ] Class `RelationshipVectorStore`:
    - Initializes persistent ChromaDB at `data/db/chromadb/`.
    - Gets or creates collection per contact with cosine distance space.
    - Method `add_messages(messages: list[NormalizedMessage], embeddings: list[list[float]])`.
    - Prevents duplicate insertion using message IDs.
- [ ] **Module 3: Time-Weighted Retriever** (`src/memory/retriever.py`)
  - [ ] Function `retrieve_context(query: str, contact_name: str, top_k: int = 5, fetch_k: int = 20, lambda_val: float = 0.01)`:
    1. Embeds the query using `OllamaEmbedder`.
    2. Queries ChromaDB for top `fetch_k` candidate messages.
    3. Calculates `days_ago` for each candidate from its metadata timestamp.
    4. Computes `final_score = similarity * exp(-lambda * days_ago)`.
    5. Re-sorts candidates by `final_score` and returns top `top_k`.
- [ ] **Module 4: Batch Ingestion Pipeline (SQLite $\rightarrow$ ChromaDB)**
  - [ ] Write a script/function that streams messages from SQLite in chunks (e.g. 50 at a time).
  - [ ] Embeds each chunk with Ollama.
  - [ ] Inserts into ChromaDB with rich metadata (`timestamp_unix`, `sender`, `contact_name`).
  - [ ] Updates SQLite `embedding_id` so subsequent runs only process new messages.

---

## 🎓 Placement & Mastery Checkpoint (Questions You Must Be Able to Answer)
1. *Why is Cosine Similarity preferred over Euclidean (L2) distance for text embeddings?*
2. *What is an Approximate Nearest Neighbor (ANN) index and how does HNSW differ from exact brute-force search?*
3. *Why does ASSIFY separate permanent storage in SQLite from semantic indexing in ChromaDB?*
4. *How does the half-life parameter $\lambda$ affect memory retrieval, and what happens to retrieval if a query matches an old event with 100% semantic similarity?*

---

## 🗺️ Upcoming Roadmap (Preview)

- [ ] **Phase 4: Multi-Agent System with Ollama & LangChain** (`src/agents/`)
  - Agent-A (Fast real-time reply generator: < 2s response)
  - Agent-B (Deep relationship analyzer & monthly summarizer)
- [ ] **Phase 5: Voice & Multimodal Extensions** (`faster-whisper`, image processing)
- [ ] **Phase 6: Background Processing & Concurrency** (threading, WAL synchronization)
- [ ] **Phase 7: Full Application UI / CLI**

