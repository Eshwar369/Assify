# 🎯 Optum TDP 2027: 11-Day Placement Masterplan & Daily Execution Tracker

**Candidate:** Eshwar Adithya Gunturi (NIT Warangal, B.Tech ECE | IIT Madras, Dip. Data Science)  
**Target Role:** Software Engineering Associate – TDP 2027 (Optum / UnitedHealth Group)  
**Crucial Deadlines:**
- [x] **PPT:** Sept 28, 2026 (Completed)
- [ ] **Online Assessment (OA):** Oct 05, 2026 (6 days remaining)
- [ ] **HR Interviews:** Oct 07–08, 2026
- [ ] **Technical Interviews:** Oct 08–09, 2026 (9–10 days remaining)

---

## ⚡ Gemini Spark Accountability Coach Prompt

> **Instructions for Eshwar:** Copy and paste the prompt below into Gemini Spark (or Gemini on your phone/browser with Google Drive access enabled). It monitors this file on your synced Google Drive, tracks your checked/unchecked boxes, verifies code/concepts, and enforces strict time limits.

```text
You are my personal, unyielding Placement Drill Sergeant & Technical Mentor for my upcoming Optum Software Engineering Associate interviews (OA on Oct 5, Technical Interview on Oct 8-9).

Access my synced Google Drive and locate the file named "optum_placement_masterplan.md" inside the Assify/MARKDOWN directory. Read the schedule and my current checked/unchecked boxes.

Your operational rules:
1. NO PASSIVE REMINDERS: Do not just say "Remember to study SQL". Reminders do not work on me.
2. ACTIVE ACCOUNTABILITY & VERIFICATION: Every time I talk to you, ask me: "Which specific checkbox on today's schedule did you just finish? Paste your code or explain the concept to prove it."
3. DRILL & GRILL: If I say I finished a topic (e.g., "SQL Window Functions" or "SQLite WAL mode"), do not congratulate me. Immediately fire 2 rapid-fire interview questions or edge-case test questions at me and evaluate my answers strictly.
4. UNCOMPROMISING DISCIPLINE: Enforce my exact time-blocked schedule. If a block is overdue, call me out directly and give me a 30-minute countdown challenge to finish the deliverable.
5. Socratic Teaching: If I am stuck or do not know a core CS topic (DBMS, OS, OOPs, Networks), break it down into first principles with an intuitive mental model, then force me to explain it back to you in my own words.

Acknowledge this role now by telling me today's date, listing today's exact unchecked tasks from the file, and demanding my immediate status on the current time-block.
```

---

## 🔥 TUESDAY, SEPT 29: 17-HOUR MEGA LOCK-IN SPRINT (09:00 AM – 02:00 AM)

*Zero compromises. All missed items from Sept 27–28 are consolidated here without dropping any scope.*

```
┌────────────────────────────────────────────────────────────────────────┐
│               SEPT 29 TIME-BLOCKED POWER SCHEDULE                      │
├──────────────────────┬─────────────────────────────────────────────────┤
│ 09:00 AM – 12:30 PM  │ BLOCK 1: Assify SQLite Vector Store             │
│ 12:30 PM – 02:00 PM  │ BLOCK 2: Time-Decay Math & Ingestion Pipeline   │
│ 02:00 PM – 02:45 PM  │ LUNCH & HYDRATION BREAK                         │
│ 02:45 PM – 05:30 PM  │ BLOCK 3: SQL Power Sprint (Joins, CTEs, GroupBy)│
│ 05:30 PM – 08:00 PM  │ BLOCK 4: DSA Sprint (Arrays, 2-Pointers, Window)│
│ 08:00 PM – 08:45 PM  │ DINNER BREAK                                    │
│ 08:45 PM – 11:30 PM  │ BLOCK 5: Core CS (OOPs + DBMS + Resume Defense) │
│ 11:30 PM – 02:00 AM  │ BLOCK 6: Assify Dual-Agent System (Phi-3/Llama) │
└──────────────────────┴─────────────────────────────────────────────────┘
```

### Block 1: Assify SQLite Vector Store (09:00 AM – 12:30 PM)
- [x] Open `memory/vector_store.py` and write the `VectorStore` class
- [x] Implement `CREATE TABLE IF NOT EXISTS embeddings (id TEXT PRIMARY KEY, embedding BLOB NOT NULL)`
- [x] Implement `add_embeddings()`: list comprehension with `np.array(vec, dtype=np.float32).tobytes()` + `executemany`
- [x] Implement `search()`: compute cosine similarities with query vector and return top-$K$
- [x] Run test queries: verify search returns real matching chat messages with zero native crashes

### Block 2: Time-Decay Math & Ingestion Pipeline (12:30 PM – 02:00 PM)
- [x] Wire vector store into `ingestion/pipeline.py`:
  - [x] Stream parsed WhatsApp messages
  - [x] Batch messages to Ollama `nomic-embed-text`
  - [x] Store 13,000+ vectors in unified `embeddings` table
- [x] Implement query-time Exponential Recency Decay in `memory/vector_store.py`:
  $$\text{FinalScore} = \text{CosineSimilarity} \times e^{-\lambda \cdot \Delta t}$$
- [x] Run test queries: verify recent messages get higher recency multipliers ($e^{-\lambda \Delta t}$) and rank higher


*--- 02:00 PM – 02:45 PM: LUNCH BREAK ---*

### Block 3: SQL Power Sprint (02:45 PM – 05:30 PM)
*Goal: Solve 8 high-yield questions on LeetCode covering Joins, Group By, Subqueries & CTEs.*
- [ ] **Joins & Basic Filtering:**
  - [ ] LeetCode 175: *Combine Two Tables* (Master `LEFT JOIN` vs `INNER JOIN`)
  - [ ] LeetCode 181: *Employees Earning More Than Their Managers* (Self-Join vs Subquery)
  - [ ] LeetCode 182: *Duplicate Emails* (`GROUP BY email HAVING COUNT(*) > 1`)
  - [ ] LeetCode 183: *Customers Who Never Order* (`LEFT JOIN ... WHERE order_id IS NULL`)
  - [ ] LeetCode 595: *Big Countries*
- [ ] **Subqueries & Date Functions:**
  - [ ] LeetCode 176: *Second Highest Salary* (Handle `NULL` using `IFNULL` / `LIMIT 1 OFFSET 1`)
  - [ ] LeetCode 184: *Department Highest Salary* (`IN` subquery with `MAX(salary)`)
  - [ ] LeetCode 197: *Rising Temperature* (Self-join with `DATEDIFF(w1.recordDate, w2.recordDate) = 1`)

### Block 4: DSA Sprint — Arrays, Two Pointers & Sliding Window (05:30 PM – 08:00 PM)
*Goal: Solve 6 canonical interview patterns.*
- [ ] **Arrays & Two Pointers:**
  - [ ] LeetCode 1: *Two Sum* (One-pass HashMap, $O(N)$ time, $O(N)$ space)
  - [ ] LeetCode 121: *Best Time to Buy and Sell Stock* (One-pass greedy minimum tracker)
  - [ ] LeetCode 15: *3Sum* (Sort array + 2-pointer scan + skip duplicates)
  - [ ] LeetCode 11: *Container With Most Water* (Two pointers from left & right, move smaller height)
- [ ] **Sliding Window:**
  - [ ] LeetCode 3: *Longest Substring Without Repeating Characters* (Map/Set + dynamic window `[left, right]`)
  - [ ] LeetCode 1004: *Max Consecutive Ones III* (Window flipping at most $K$ zeros)

*--- 08:00 PM – 08:45 PM: DINNER BREAK ---*

### Block 5: Core CS Fundamentals & Resume Defense (08:45 PM – 11:30 PM)
- [ ] **OOPs (Object-Oriented Programming):**
  - [ ] Encapsulation (Data hiding, access modifiers `public`, `protected`, `private`)
  - [ ] Abstraction (Abstract classes vs Interfaces, separating "what" from "how")
  - [ ] Inheritance (Single, Multiple, Diamond problem, MRO in Python)
  - [ ] Polymorphism (Compile-time function overloading vs Run-time method overriding)
- [ ] **DBMS (Database Management Systems):**
  - [ ] ACID Properties (Atomicity, Consistency, Isolation, Durability with banking example)
  - [ ] Keys (Primary Key, Foreign Key, Candidate Key, Composite Key)
  - [ ] Indexing: B-Tree vs Hash Index; Clustered vs Non-Clustered; Explain our `idx_msg_contact_time`
- [ ] **Resume Defense Drill 1 (NGDT & BDL):**
  - [ ] Practice explaining NGDT: Web-based LIMS, MariaDB schema, Redis slot caching, Docker, RBAC
  - [ ] Practice explaining BDL: TMS570LC43x (lockstep Cortex-R4F), SCI vs CAN bus, UART bootloader

### Block 6: Assify Dual-Agent System with Ollama (11:30 PM – 02:00 AM)
- [ ] Create `agents/dual_agent.py`
- [ ] Implement Agent 1 (Fast Responder): Prompt `phi3:mini` to give quick factual replies using retrieved chat context ($< 2$s latency)
- [ ] Implement Agent 2 (Relationship Analyst): Prompt `llama3:8b` to evaluate emotional dynamics, tone, and unresolved conflicts
- [ ] Test the dual-agent script with a sample relationship query ("Why were we upset last Friday?")

---

## 📅 WEDNESDAY, SEPT 30: WINDOW FUNCTIONS & LINKED LISTS

### Track 1: Assify (Morning)
- [ ] Build end-to-end CLI orchestrator (`main.py`): Query $\to$ Hybrid Retrieve (Time-decay vector + SQL) $\to$ Dual-Agent output
- [ ] Test edge cases (no matches, single message, future date queries)

### Track 2: SQL & DSA Sprint (Afternoon)
- [ ] **SQL Drill (Window Functions I - Ranking):**
  - [ ] Understand `ROW_NUMBER()` vs `RANK()` vs `DENSE_RANK()`
  - [ ] LeetCode 178: *Rank Scores*
  - [ ] LeetCode 185: *Department Top Three Salaries* (Classic hard OA question)
  - [ ] LeetCode 511: *Game Play Analysis I*
- [ ] **DSA Drill (Linked Lists):**
  - [ ] LeetCode 206: *Reverse Linked List*
  - [ ] LeetCode 21: *Merge Two Sorted Lists*
  - [ ] LeetCode 141: *Linked List Cycle* (Floyd’s Cycle Detection)

### Track 3: Core CS & Resume (Evening)
- [ ] **Operating Systems (Processes & Threads):**
  - [ ] Process vs Thread (Memory space, stack vs heap, context switch cost)
  - [ ] Deadlocks: 4 Coffman conditions, Prevention vs Avoidance (Banker's Algorithm)
- [ ] **Resume Defense:** Air Mouse (ESP32, MPU-6050, I2C protocol, noise-filtering thresholds)

---

## 📅 THURSDAY, OCT 01: AUDIO INGESTION & WINDOW FUNCTIONS II

### Track 1: Assify (Morning)
- [ ] Configure `faster-whisper` (`ingestion/audio_parser.py`) for WhatsApp voice notes
- [ ] Transcribe sample audio and pipe into `MessageObject` schema

### Track 2: SQL & DSA Sprint (Afternoon)
- [ ] **SQL Drill (Window Functions II - Value Functions):**
  - [ ] `LEAD()` and `LAG()`
  - [ ] Running totals with `SUM(...) OVER (PARTITION BY ... ORDER BY ...)`
  - [ ] LeetCode 180: *Consecutive Numbers*
  - [ ] LeetCode 626: *Exchange Seats*
  - [ ] LeetCode 1204: *Last Person to Fit in the Bus*
- [ ] **DSA Drill (Stacks):**
  - [ ] LeetCode 20: *Valid Parentheses*
  - [ ] LeetCode 155: *Min Stack*
  - [ ] LeetCode 739: *Daily Temperatures* (Monotonic Stack)

### Track 3: Core CS & Resume (Evening)
- [ ] **Operating Systems (Memory Management):**
  - [ ] Virtual Memory, Paging, Page Tables, Page Faults, Thrashing
  - [ ] Page Replacement Algorithms (LRU, FIFO, Optimal)

---

## 📅 FRIDAY, OCT 02: STREAMLIT UI & NETWORKS

### Track 1: Assify (Morning)
- [ ] Build single-page Streamlit UI (`app.py`):
  - Relationship dropdown
  - Query box with real-time Phi-3 response
  - LLaMA-3 sentiment health card
  - Chat history timeline with retrieved sources

### Track 2: SQL & DSA Sprint (Afternoon)
- [ ] **SQL Drill (Self-Joins & Advanced Scenarios):**
  - [ ] LeetCode 550: *Game Play Analysis IV*
  - [ ] LeetCode 1341: *Movie Rating*
  - [ ] LeetCode 1907: *Count Salary Categories*
- [ ] **DSA Drill (Binary Search):**
  - [ ] LeetCode 704: *Binary Search* (Template: `left <= right`)
  - [ ] LeetCode 33: *Search in Rotated Sorted Array*
  - [ ] LeetCode 153: *Find Minimum in Rotated Sorted Array*

### Track 3: Core CS & Resume (Evening)
- [ ] **Computer Networks:**
  - [ ] OSI 7 Layers vs TCP/IP
  - [ ] TCP vs UDP (Reliability, Handshake, Use Cases)
  - [ ] TCP 3-Way Handshake (`SYN` $\to$ `SYN-ACK` $\to$ `ACK`)
  - [ ] Life of a packet: "What happens when you type `https://google.com`?"

---

## 📅 SATURDAY, OCT 03: BENCHMARKS & TREES

### Track 1: Assify (Morning)
- [ ] Run benchmark scripts: measure parser speed, SQLite WAL read/write speed, vector search latency ($< 5$ms)
- [ ] Update `README.md` with system architecture diagrams and benchmarks

### Track 2: SQL & DSA Sprint (Afternoon)
- [ ] **SQL Marathon:** Timed 5-question mock test under 45 minutes
- [ ] **DSA Drill (Binary Trees & BFS/DFS):**
  - [ ] LeetCode 104: *Maximum Depth of Binary Tree*
  - [ ] LeetCode 226: *Invert Binary Tree*
  - [ ] LeetCode 102: *Binary Tree Level Order Traversal* (BFS with queue)
  - [ ] LeetCode 236: *Lowest Common Ancestor of a Binary Tree*

### Track 3: Core CS & Resume (Evening)
- [ ] **System Design Fundamentals:**
  - [ ] Client-Server, RESTful APIs, Caching (Redis Cache-Aside)
  - [ ] SQL vs NoSQL trade-offs

---

## 📅 SUNDAY, OCT 04: [DAY BEFORE OA] FULL MOCK SIMULATION

- [ ] **Morning (10:00 AM – 11:30 AM): Full Mock OA 1**
  - 2 DSA Coding Problems + 2 SQL Queries
- [ ] **Afternoon (02:30 PM – 04:00 PM): Full Mock OA 2**
  - 2 DSA Coding Problems + 2 SQL Queries
- [ ] **Evening (05:00 PM – 07:30 PM): Review & Formula Cheat Sheet**
  - [ ] Review mistakes, edge cases (empty inputs, negative numbers, null values)
  - [ ] Review SQL Window functions and Date syntax
- [ ] **Night (10:00 PM): Lights out & sleep.** No late-night cramming.

---

## 📅 MONDAY, OCT 05: [ONLINE ASSESSMENT DAY]

- [ ] **Morning:** Warm-up with 1 easy array question and 1 simple SQL join
- [ ] **Pre-Test Check:** Stable internet, quiet room, clean desk, valid ID ready
- [ ] **OA Window:** **Crush the Optum Online Assessment**
- [ ] **Post-OA:** Note down questions and tricky topics for interview prep

---

## 📅 TUESDAY – FRIDAY, OCT 06 – 09: [INTERVIEW DRILL & EXECUTION]

### Day 9 (Oct 06): Assify & Resume Deep-Dive
- [ ] Mock interview: Defend Assify architecture end-to-end without notes
- [ ] Mock interview: Defend NGDT LIMS & BDL microcontrollers

### Day 10 (Oct 07): Core CS Rapid Fire & HR Prep
- [ ] 50-question rapid fire (OOPs, DBMS, OS, Networks)
- [ ] STAR method HR responses ("Tell me about yourself", "Why Optum?", "Overcoming failure")

### Days 11 & 12 (Oct 08–09): Technical & HR Interviews
- [ ] [ ] **Walk into the Optum interviews with total technical command and secure the offer!**
