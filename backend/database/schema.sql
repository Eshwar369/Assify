-- ==============================================================================
-- ASSIFY SCHEMA 2.0 (Relational SQLite DDL in WAL Mode)
-- Dynamic Contact Aliasing, Theatrical Acts, Diary Engine & The Keep
-- ==============================================================================

-- 1. Contact Registry & Identity Mapping
CREATE TABLE IF NOT EXISTS contacts (
    id              TEXT PRIMARY KEY,              -- UUID or slug (e.g., 'sarah_8f2a')
    raw_name        TEXT NOT NULL,                 -- Raw sender string in WhatsApp (e.g., 'Sleepless Zombiee' or '+91 98765 43210')
    display_name    TEXT NOT NULL,                 -- User-customized alias (e.g., 'Sarah')
    user_name       TEXT NOT NULL,                 -- User's own sender name in the chat (e.g., 'Eshwar')
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Normalized Message Log (Source of Truth)
CREATE TABLE IF NOT EXISTS messages (
    id              TEXT PRIMARY KEY,              -- Deterministic hash or UUID
    contact_id      TEXT NOT NULL,                 -- Foreign key to contacts(id)
    time_stamp      DATETIME NOT NULL,             -- ISO-8601 UTC timestamp
    sender          TEXT NOT NULL,                 -- Standardized role: 'user' | 'contact'
    raw_sender      TEXT NOT NULL,                 -- Original raw sender from export file
    content         TEXT NOT NULL,                 -- Cleaned message body
    media_type      TEXT DEFAULT 'text',           -- 'text' | 'voice' | 'image' | 'system'
    media_path      TEXT,                          -- Local file path to audio/image if applicable
    media_meta      TEXT,                          -- JSON metadata (duration_seconds, ocr_text, etc.)
    is_deleted      BOOLEAN DEFAULT 0,             -- Flag for deleted messages
    is_question     BOOLEAN DEFAULT 0,             -- Flag for question sentences
    FOREIGN KEY(contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_msg_contact_time ON messages(contact_id, time_stamp DESC);

-- 3. Mathematical Chronemics Telemetry (0-LLM Deterministic Metrics)
CREATE TABLE IF NOT EXISTS chronemics_stats (
    contact_id              TEXT PRIMARY KEY,
    total_messages          INTEGER NOT NULL,
    user_msg_count          INTEGER NOT NULL,
    contact_msg_count       INTEGER NOT NULL,
    user_initiation_pct     REAL NOT NULL,         -- % of sessions started after >4h silence by user
    contact_initiation_pct  REAL NOT NULL,         -- % started by contact
    user_median_delay_m     REAL NOT NULL,         -- Median response latency in minutes
    contact_median_delay_m  REAL NOT NULL,
    user_double_texts       INTEGER NOT NULL,      -- Burst counts without reply
    contact_double_texts    INTEGER NOT NULL,
    late_night_pct          REAL NOT NULL,         -- Messages exchanged between 11 PM - 4 AM
    longest_gap_hours       REAL NOT NULL,         -- Longest silent gap between interactions
    calculated_at           DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);

-- 4. High-Level Relationship Profile (The Delulu & Power Dashboard)
CREATE TABLE IF NOT EXISTS relationship_profiles (
    contact_id              TEXT PRIMARY KEY,
    status_label            TEXT NOT NULL,         -- e.g. 'Situationship with Asymmetric Investment'
    delulu_score            INTEGER NOT NULL,      -- 0 to 100
    power_ratio_user        INTEGER NOT NULL,      -- e.g. 32 (User 32%)
    power_ratio_contact     INTEGER NOT NULL,      -- e.g. 68 (Contact 68%)
    user_attachment_style   TEXT NOT NULL,         -- e.g. 'Anxious-Preoccupied'
    contact_attachment_style TEXT NOT NULL,        -- e.g. 'Dismissive-Avoidant'
    chemistry_score         INTEGER NOT NULL,      -- 0 to 100
    survival_probability    INTEGER NOT NULL,      -- 0 to 100
    overall_diagnosis       TEXT NOT NULL,         -- 1-2 sentence brutal summary
    vibe_mode               TEXT DEFAULT 'unhinged', -- 'therapy' | 'unhinged'
    analyzed_at             DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);

-- 5. The 17 Theatrical Acts (JSON Payload per Act)
CREATE TABLE IF NOT EXISTS report_acts (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_id      TEXT NOT NULL,
    act_number      INTEGER NOT NULL,              -- 1 to 16
    act_name        TEXT NOT NULL,                 -- e.g. 'Opening', 'DeluluMeter', 'PowerPlays'
    payload_json    TEXT NOT NULL,                 -- Structured JSON adhering to Act schema
    generated_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(contact_id, act_number),
    FOREIGN KEY(contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);

-- 6. Evidence Locker (Quoted Receipts with Commentary)
CREATE TABLE IF NOT EXISTS evidence_locker (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_id      TEXT NOT NULL,
    flag_type       TEXT NOT NULL,                 -- 'red_flag' | 'green_flag' | 'power_play'
    severity        INTEGER DEFAULT 3,             -- 1 (mild) to 5 (severe)
    category        TEXT NOT NULL,                 -- 'Breadcrumbing', 'Ghosting', 'Gaslighting'
    quote           TEXT NOT NULL,                 -- Exact message string cited
    sender          TEXT DEFAULT 'contact',        -- 'user' | 'contact'
    time_stamp      DATETIME,                      -- When it was sent
    ai_commentary   TEXT NOT NULL,                 -- Forensic breakdown
    FOREIGN KEY(contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);

-- 7. Greatest Hits (Iconic Quotes)
CREATE TABLE IF NOT EXISTS greatest_hits (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_id      TEXT NOT NULL,
    category        TEXT NOT NULL,                 -- 'cringe' | 'comedy' | 'delusional' | 'comeback'
    quote           TEXT NOT NULL,                 -- Quote text
    sender          TEXT NOT NULL,                 -- 'user' | 'contact'
    time_stamp      DATETIME,
    why_legendary   TEXT NOT NULL,
    FOREIGN KEY(contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);

-- 8. Relationship Advisor Sessions & Messages
CREATE TABLE IF NOT EXISTS advisor_sessions (
    id              TEXT PRIMARY KEY,              -- UUID
    contact_id      TEXT NOT NULL,
    started_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    title           TEXT,
    FOREIGN KEY(contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS advisor_messages (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id      TEXT NOT NULL,
    role            TEXT NOT NULL,                 -- 'user' | 'assistant'
    content         TEXT NOT NULL,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(session_id) REFERENCES advisor_sessions(id) ON DELETE CASCADE
);

-- 9. Relationship Diary (Story Chapters over Time)
CREATE TABLE IF NOT EXISTS relationship_diary (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_id      TEXT NOT NULL,
    period_start    DATE NOT NULL,                 -- Start of this chapter (e.g. 2026-08-01)
    period_end      DATE NOT NULL,                 -- End of this chapter (e.g. 2026-08-31)
    chapter_number  INTEGER NOT NULL,              -- Chapter 1, 2, etc.
    title           TEXT NOT NULL,                 -- e.g. "The Late-Night Shift & First Conflict"
    story_text      TEXT NOT NULL,                 -- AI-narrated story of this period
    mood_score      INTEGER NOT NULL,              -- 0 (Hostile) to 100 (Deep Connection)
    key_events      TEXT NOT NULL,                 -- JSON array of key events: ["Met at cafe", "Apologized on Friday"]
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_diary_contact ON relationship_diary(contact_id, period_start DESC);

-- 10. The Keep (Preferences, Gift Ideas, Nicknames & Memory Vault)
CREATE TABLE IF NOT EXISTS preferences_vault (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_id      TEXT NOT NULL,
    category        TEXT NOT NULL,                 -- 'gift' | 'movie' | 'food' | 'place' | 'dislike' | 'nickname' | 'inside_joke' | 'date_idea'
    item_name       TEXT NOT NULL,                 -- e.g. "Lilies", "Inception", "Zombiee"
    context_quote   TEXT,                          -- Exact message quote
    time_stamp      DATETIME,                      -- When it was mentioned
    status          TEXT DEFAULT 'saved',          -- 'saved' | 'completed' | 'bought' | 'watched'
    target_person   TEXT DEFAULT 'contact',        -- 'contact' | 'user' | 'both'
    ai_generated    BOOLEAN DEFAULT 0,             -- 1 if synthesized date idea / gift idea, 0 if mined
    metadata        TEXT,                          -- Extra JSON attributes
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_pref_contact_cat ON preferences_vault(contact_id, category);

