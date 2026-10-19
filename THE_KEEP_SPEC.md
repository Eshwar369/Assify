# 🏰 THE KEEP — Relationship Memory, Taste Vault & Date Oracle (SPEC.md)

> **Mission:** Transform Assify from a one-time viral roast app into an indispensable, long-term personal relationship operating system.  
> **Core Concept:** A living, auto-curated intelligence vault that extracts and organizes everything your partner has ever loved, craved, wished for, disliked, or joked about across years of conversations.

---

## 💎 The 8 Memory Chambers of The Keep

### 1. 🏷️ Nicknames & Pet Names Encyclopedia (`category = 'nickname'`)
- **What it tracks:** Every endearing, hilarious, or absurd pet name used between both people.
- **Examples:** *"Zombiee"*, *"Babu"*, *"Dumdum"*, *"Pookie"*, *"Idiot"*, *"Captain"*.
- **Telemetry:**
  - Who coined the nickname?
  - First occurrence date & original message receipt.
  - Frequency & tone (affectionate vs teasing).

---

### 2. 🍕 The Taste & Craving Vault (`category = 'food'`)
- **What it tracks:** Favorite comfort foods, regional cravings, go-to drinks, midnight snacks, and dietary restrictions.
- **Examples:**
  - *"Craving that ellipai kaaram neyyi n annam"* (late-night comfort food).
  - *"Iced matcha latte with oat milk"* (drink order).
  - *"Never order cilantro / mushrooms"* (strict preference).
- **Utility:** Eliminates the classic *"What do you want to eat? I don't know, anything"* relationship loop.

---

### 3. 🎬 The Watchlist & Soundstage (`category = 'movie'`)
- **What it tracks:** Movies, anime, TV series, documentaries, and YouTube channels either person mentioned wanting to watch.
- **Receipt Resolution:** Resolves pronouns using conversation context:
  - *Person A: [Sends trailer for Severance]*
  - *Person B: "Omg we have to binge this over the weekend!"*
  - **The Keep stores:** `Severance (TV Series)` with link and receipt.
- **Interactive Check:** Status toggles between `'saved'` and `'watched'`.

---

### 4. 🎁 The Wishlist & Gift Oracle (`category = 'gift'`)
- **What it tracks:** Explicit wishlists and subtle, dropped hints for birthdays, anniversaries, and surprises.
- **Explicit Cues:** *"Saving up for that Sony noise-cancelling headset"*, *"Need an oversized fleece hoodie for winter"*.
- **Implicit Cues:** *"I love white lilies"*, *"That vanilla musk scent from Zara is so good"*.
- **🔮 The AI Gift Oracle:** Synthesizes their tastes to recommend 3 creative, high-thoughtfulness gifts with reasoning.

---

### 5. 📍 Date Ideas & Travel Bucket List (`category = 'place'`)
- **What it tracks:** Cafes, viewpoints, weekend getaways, and activities mentioned in chat.
- **Examples:**
  - *"Let's go to that pottery workshop in Jubilee Hills"*
  - *"We have to watch the sunrise at Durgam Cheruvu"*
  - *"Road trip to Pondicherry someday"*
- **🎡 The AI Date Architect:** Synthesizes their favorite food + a place/activity into 3 bespoke date blueprints ready to execute.

---

### 6. 🚫 Pet Peeves, Allergies & The Danger Zone (`category = 'dislike'`)
- **What it tracks:** Things that trigger annoyance, discomfort, or genuine conflict.
- **Pragmatic Filtering:** Explicitly distinguishes **sarcastic banter** (*"I hate u Eshwar"* $\rightarrow$ ignored) from **genuine pet peeves** (*"I hate people taking screenshots during video calls"* $\rightarrow$ saved!).
- **Utility:** Acts as a relationship safety shield.

---

### 7. 🎭 Inside Jokes & Sacred Lore (`category = 'inside_joke'`)
- **What it tracks:** The private language that only the two of you understand.
- **Examples:** Recurring mispronounced words, absurd autocorrect accidents that became permanent memes, running gags from specific dates.

---

### 8. 📅 Milestone Lore & Anniversaries (`category = 'milestone'`)
- **What it tracks:** Key relational calendar dates mentioned or celebrated in chat.
- **Examples:** Day they met, first trip together, big reconciliations, birthdays.

---

## ⚙️ The Industrial Architecture: 3-Stage Semantic Funnel

```text
 ┌─────────────────────────────────────────────────────────────┐
 │ STAGE 1: Broad Semantic Mining (Python, < 0.05s)            │
 │ • Scans all messages for 8 category keyword stems           │
 │ • Filters out 1-3 word replies to isolate substance         │
 │ • Reduces 14,000+ messages down to ~60-100 candidate turns  │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ STAGE 2: Context Stitching & Anaphora Resolution            │
 │ • Pairs each candidate with the PREVIOUS message turn       │
 │ • Ensures pronouns ('this', 'them', links) have context     │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ STAGE 3: Neuro Entity Extractor & Banter Filter (GPT-4o-mini)│
 │ • Classifies genuine tastes vs playful banter               │
 │ • Outputs clean, normalized entity names                    │
 │ • Generates 3 AI Date Blueprints & 3 Gift Ideas             │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ STAGE 4: SQLite Persistence (`preferences_vault`)           │
 └─────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema 2.1 (`preferences_vault`)

```sql
CREATE TABLE IF NOT EXISTS preferences_vault (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_id      TEXT NOT NULL,
    category        TEXT NOT NULL,    -- 'food' | 'movie' | 'gift' | 'place' | 'dislike' | 'nickname' | 'inside_joke' | 'date_idea'
    item_name       TEXT NOT NULL,    -- Clean normalized title (e.g. 'Ellipai Kaaram Neyyi', 'Severance', 'Zombiee')
    context_quote   TEXT,             -- Exact conversational receipt
    time_stamp      DATETIME,         -- When it occurred
    status          TEXT DEFAULT 'saved', -- 'saved' | 'completed' | 'watched' | 'bought'
    target_person   TEXT DEFAULT 'contact', -- 'contact' | 'user' | 'both'
    ai_generated    BOOLEAN DEFAULT 0, -- 1 if generated by Date/Gift Oracle, 0 if mined from chat
    metadata        TEXT,             -- Extra JSON (e.g. date blueprint details, why recommended)
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);
```
