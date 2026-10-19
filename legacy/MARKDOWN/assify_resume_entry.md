# ASSIFY — Resume Entry

> **Use whichever format fits your resume layout. All three versions say the same thing at different levels of detail.**

---

## Option 1: Compact (3 bullet points — for tight resumes)

### ASSIFY — Local Relationship Intelligence OS
**Python · SQLite · ChromaDB · Ollama · LangChain · faster-whisper**

- Engineered a privacy-first, fully offline AI system that ingests multi-modal personal communication data (WhatsApp exports, voice notes, screenshots) and provides real-time reply suggestions and deep relationship analytics using a dual-agent architecture powered by local LLMs (phi3-mini, llama3) via Ollama.
- Designed and implemented a **Time-Weighted RAG pipeline** with exponential recency decay (λ-configurable half-life) applied at query-time over ChromaDB vector embeddings, ensuring contextually relevant retrieval where recent interactions outweigh semantically similar but outdated messages.
- Built a two-tier memory system — **hot memory** (rolling 30-day raw messages in ChromaDB) and **compressed diary** (monthly LLM-generated summaries per contact stored in SQLite) — reducing context window overflow while preserving long-term relationship history.

---

## Option 2: Detailed (5-6 bullet points — recommended for freshers / project-heavy resumes)

### ASSIFY — Local Relationship Intelligence OS
**Python · SQLite (WAL) · ChromaDB · Ollama · LangChain · faster-whisper · nomic-embed-text**

- Built a **fully local, privacy-preserving AI system** that ingests multi-modal communication data (WhatsApp text exports, voice notes via faster-whisper STT, screenshots via vision models) through a unified normalization pipeline, producing structured `MessageObject` instances with deterministic SHA-256 IDs for deduplication.
- Implemented a **custom regex-based WhatsApp parser** handling multi-line message continuation, system message filtering, and sender identity resolution — processing 10,000+ messages into a normalized schema with sub-second ingestion via SQLite WAL mode and `executemany()` batch operations.
- Designed a **Time-Weighted Retrieval-Augmented Generation (RAG) system** using ChromaDB with per-contact collection partitioning and `nomic-embed-text` (768-dim) embeddings, applying exponential recency decay ($\text{score} = \text{cosine\_sim} \times e^{-\lambda \cdot \Delta t}$) at query-time to prioritize recent conversational context.
- Architected a **dual-agent system** — Agent-A (phi3-mini, <2s response SLA) for real-time reply generation from the last 15–20 messages, and Agent-B (llama3, async background processing) for sentiment scoring, relationship health tracking (0–100), pattern detection, and monthly diary entry generation.
- Engineered a **two-tier memory architecture**: a rolling hot memory window (30 days of raw vectors in ChromaDB) and a compressed cold layer (monthly LLM-generated diary summaries embedded as single vectors), enabling long-term context retrieval without context window exhaustion.
- Implemented inter-agent state sharing through **SQLite as a shared coordination layer** (WAL mode for concurrent read/write safety), with Agent-B writing sentiment logs, relationship state, and detected patterns that Agent-A consumes as soft contextual hints during reply generation.

---

## Option 3: One-Liner (for space-constrained resumes)

**ASSIFY** — Privacy-first local AI system for relationship intelligence using time-weighted RAG, dual-agent LLM architecture (Ollama), multi-modal ingestion (WhatsApp, voice, images), and a two-tier memory model over SQLite + ChromaDB. *(Python, LangChain, faster-whisper)*

---

## 🎯 Tech Stack Tag Line (for "Technologies Used" sections)

`Python` · `SQLite (WAL mode)` · `ChromaDB` · `Ollama` · `LangChain` · `faster-whisper` · `nomic-embed-text` · `phi3-mini` · `llama3` · `Regex` · `Dataclasses`

---

## ⚠️ Interview Defense Checklist

> **Every term in the resume above is a potential interview question. You MUST be able to explain these before your interview:**

### Concepts You Must Know Cold:
| # | Topic | Key Question They Might Ask |
|---|-------|-----------------------------|
| 1 | **Time-Weighted RAG** | *"Why not just use vanilla semantic search? Walk me through the math."* |
| 2 | **Exponential Decay** | *"What's λ? What happens if you set it to 0.1 vs 0.001? What's the half-life formula?"* |
| 3 | **Query-Time vs Embed-Time Decay** | *"Why apply decay at query time? What breaks if you bake it into embeddings?"* |
| 4 | **ChromaDB Partitioning** | *"Why one collection per contact instead of one big collection with filters?"* |
| 5 | **WAL Mode** | *"What is SQLite WAL? Why did you need it? What's the alternative and why is it worse?"* |
| 6 | **Cosine Similarity** | *"Write the formula. Why cosine over L2 for text embeddings?"* |
| 7 | **HNSW** | *"How does ChromaDB find nearest neighbors without brute-force? What's ANN?"* |
| 8 | **nomic-embed-text** | *"Why this model? What's the dimensionality? How does it compare to OpenAI's?"* |
| 9 | **Dual Agent Architecture** | *"Why two agents instead of one? How do they communicate?"* |
| 10 | **faster-whisper** | *"Why not OpenAI's original Whisper? What backend does it use? (CTranslate2)"* |
| 11 | **SHA-256 for IDs** | *"Why deterministic hashing instead of UUID? What's the advantage for deduplication?"* |
| 12 | **Diary Compression** | *"What problem does the diary solve? How does a summary compete with raw messages during retrieval?"* |
| 13 | **Batch Ingestion** | *"Explain executemany vs execute in a loop. Why INSERT OR IGNORE?"* |
| 14 | **Two-Tier Memory** | *"What's hot vs cold memory? When does data move between tiers?"* |

### Tricky Follow-Ups to Prepare For:
- *"What happens on a cold start with a new contact who has no history?"*
- *"How do you handle embedding model drift if you switch from nomic to a different model?"*
- *"What's the bottleneck if ChromaDB grows to 500k vectors?"*
- *"Why SQLite for inter-agent communication instead of Redis or a message queue?"*
- *"If Agent-B takes 30 seconds to analyze, does it block Agent-A?"*
