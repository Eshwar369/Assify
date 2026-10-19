# ⏱️ Chronemics Engine Specification: The Neuro-Symbolic Seam Pipeline

> **Module:** `backend/analytics/chronemics.py`  
> **Purpose:** Measure objective interpersonal communication dynamics (initiation ratios, response latencies, chasing patterns, and conversational balance) without naive mathematical heuristics or LLM hallucinations.

---

## 1. The Core Engineering Challenge

Human messaging data contains psychological nuances that naive timestamp math fails to decode:
1. **The Good Morning / Night Loop:** A morning greeting after 8 hours of sleep is a conversational ritual, not a genuine "initiation" of a new topic.
2. **The "Left-on-Read" Chase:** If Person A texts at 2 PM, Person B ignores it, and Person A texts again at 8 PM asking *"Did you see my text?"*, Person A did not "initiate a new conversation"—they are following up after being ghosted.
3. **The Rapid-Fire Burst:** Sending 4 texts within 45 seconds is **one single thought**, not 4 separate double-texts.

Conversely, asking an LLM to count initiations across 15,000 raw messages causes **severe numerical hallucination**, because language models cannot accurately count or perform arithmetic over thousands of tokens.

---

## 2. The 3-Stage Neuro-Symbolic Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│ STAGE 1: Symbolic Pre-Processing (Pure Python / 0 LLM Tokens)          │
│ • Exact message & word counts.                                         │
│ • Conversational Burst Aggregation: Groups consecutive texts from the  │
│   same sender within < 90 seconds into 1 "Conversational Turn".        │
│ • Silence Seam Detection: Finds all intervals where silence > 3.5h.    │
│ • Extracts the "Seam Context": Last turn before silence + First turn   │
│   breaking silence.                                                    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ STAGE 2: Semantic Seam Classification (Targeted Micro-LLM Pass)        │
│ • Sends ONLY the candidate transition seams (~25-35 seams) to OpenAI   │
│   gpt-4o-mini in a single compact structured JSON prompt (~1k tokens). │
│ • Classifies each seam into:                                           │
│   1. TRUE_INITIATION: Someone breaks silence with a brand-new topic.   │
│   2. CHASE_FOLLOWUP: Someone follows up after being left on read.      │
│   3. DELAYED_ANSWER: Someone finally answers an old question late.     │
│   4. ROUTINE_RITUAL: Good morning / Good night greeting routine.      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ STAGE 3: Grounded Mathematical Synthesis                               │
│ • True Initiation %: Counted ONLY on verified TRUE_INITIATION seams.   │
│ • Chasing Index: Total CHASE_FOLLOWUP events per person.               │
│ • Median Response Latency: Computed on non-sleep intervals.            │
│ • Stores verified results into chronemics_stats table.                 │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Algorithmic Specifications

### 3.1 Conversational Burst Aggregation (Symbolic)
A **Turn** is formed by merging consecutive messages from the same sender if:
$$\Delta t = t_{i} - t_{i-1} \le 90 \text{ seconds}$$

```python
Turn:
  sender: 'user' | 'contact'
  start_time: ISO-8601
  end_time: ISO-8601
  content: "Merged text separated by newlines"
  message_count: int (e.g. 4)
  word_count: int (e.g. 28)
```

### 3.2 Candidate Seam Detection (Symbolic)
A **Candidate Seam** occurs whenever:
$$\text{Gap} = \text{Turn}_{k+1}.\text{start\_time} - \text{Turn}_{k}.\text{end\_time} \ge 3.5 \text{ hours}$$

```python
Seam:
  seam_id: int
  gap_hours: float (e.g. 6.4)
  prev_turn: { sender: 'user', content: 'Are we still meeting tonight?' }
  next_turn: { sender: 'user', content: 'Hello? Did you see this?' }
```

### 3.3 Semantic Seam Classifier Schema (Neuro)
The LLM prompt receives the candidate seams and returns valid JSON adhering to:

```json
{
  "classifications": [
    {
      "seam_id": 1,
      "type": "CHASE_FOLLOWUP",
      "actor": "user",
      "reason": "User followed up after being left on read for 6.4 hours."
    },
    {
      "seam_id": 2,
      "type": "TRUE_INITIATION",
      "actor": "contact",
      "reason": "Contact started an entirely new conversation about a podcast."
    },
    {
      "seam_id": 3,
      "type": "ROUTINE_RITUAL",
      "actor": "none",
      "reason": "Standard Good Morning exchange after overnight sleep."
    }
  ]
}
```

### 3.4 Metric Synthesis Formulas
1. **True Initiation Ratio:**
   $$\text{User True Initiation \%} = \frac{\sum \text{TRUE\_INITIATION}_{\text{user}}}{\sum \text{TRUE\_INITIATION}_{\text{all}}} \times 100$$
2. **Chasing Index:**
   $$\text{Chasing Index} = \sum \text{CHASE\_FOLLOWUP}_{\text{user}} \text{ vs } \sum \text{CHASE\_FOLLOWUP}_{\text{contact}}$$
3. **Median Response Latency ($\text{MRL}$):**
   $$\text{MRL} = \text{median}(\{ \Delta t \mid \text{Turn}_B \text{ directly follows } \text{Turn}_A \text{ and } \Delta t \le 7 \text{ hours} \})$$
   *(Filters out multi-day pauses and normal sleep to avoid skewed averages).*

---

## 4. Database Persistence Contract

The synthesized metrics write directly into the `chronemics_stats` table in [`backend/database/schema.sql`](file:///c:/Users/DELL/gen%20ai/Assify/backend/database/schema.sql):

```sql
INSERT INTO chronemics_stats (
    contact_id,
    total_messages,
    user_msg_count,
    contact_msg_count,
    user_initiation_pct,
    contact_initiation_pct,
    user_median_delay_m,
    contact_median_delay_m,
    user_double_texts,
    contact_double_texts,
    late_night_pct,
    longest_gap_hours
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
```
