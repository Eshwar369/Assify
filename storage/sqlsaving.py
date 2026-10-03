import json
import sqlite3
import numpy as np
from config import DB_PATH

def connect_database(location: str):
    conn = sqlite3.connect(location)
    c = conn.cursor()
    c.execute("PRAGMA journal_mode=WAL;").fetchone()
    with open("storage/schema.sql") as f:
        c.executescript(f.read())
    return conn, c


def save_to_sql(msgs, conn, c):
    data_tuples = [
        (m.id, m.contact_name, m.platform, m.time_stamp.isoformat(), m.sender, m.content, m.media_type, m.media_path, m.embedding_id)
        for m in msgs
    ]
    sql = """
        INSERT OR IGNORE INTO messages (
            id,
            contact_name,
            platform,
            time_stamp,
            sender,
            content,
            media_type,
            media_path,
            embedding_id
        ) VALUES (?,?,?,?,?,?,?,?,?)
    """
    c.executemany(sql, data_tuples)
    conn.commit()


def save_blobs(blobs, conn, c):
    data_tuples = []
    for b in blobs:
        emb_bytes = getattr(b, "embedding", None)
        if isinstance(emb_bytes, (list, np.ndarray)):
            emb_bytes = np.array(emb_bytes, dtype=np.float32).tobytes()

        start_str = b.start_time.isoformat() if hasattr(b.start_time, "isoformat") else str(b.start_time)
        end_str = b.end_time.isoformat() if hasattr(b.end_time, "isoformat") else str(b.end_time)

        data_tuples.append((
            b.id,
            b.contact_name,
            b.platform,
            start_str,
            end_str,
            json.dumps(b.msg_ids),
            b.full_content,
            emb_bytes
        ))

    sql = """
        INSERT OR IGNORE INTO message_bursts (
            id,
            contact_name,
            platform,
            start_time,
            end_time,
            message_ids,
            content,
            embedding
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """
    c.executemany(sql, data_tuples)
    conn.commit()
