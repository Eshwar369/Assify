CREATE TABLE IF NOT EXISTS messages(
    id text PRIMARY KEY,
    contact_name text,
    platform text,
    time_stamp timestamp,
    sender text,
    content text,
    media_type text,
    media_path text,
    embedding_id text
);
CREATE INDEX IF NOT EXISTS idx_msg_contact_time
ON messages(contact_name,time_stamp DESC);

CREATE TABLE IF NOT EXISTS message_bursts (
    id TEXT PRIMARY KEY,
    contact_name TEXT,
    platform TEXT,
    start_time TEXT,
    end_time TEXT,
    message_ids TEXT,   -- Serialized JSON list of IDs!
    content TEXT,
    embedding BLOB
);
