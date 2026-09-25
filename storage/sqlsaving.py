from sqlite3 import Cursor
import sqlite3 
from ingestion.whatsapp_parser import parse_whatsapp_file

conn= sqlite3.connect("storage/allmessages.db")
c=conn.cursor()
c.execute("PRAGMA journal_mode=WAL").fetchone()

sql ="""
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

with open("storage/schema.sql") as f:
    c.executescript(f.read())


    msgs=parse_whatsapp_file("data/assify_data.txt",'Sleepless Zombiee',"*")
    data_tuples = [
    (m.id, m.contact_name, m.platform, m.time_stamp.isoformat(), m.sender, m.content, m.media_type, m.media_path, m.embedding_id)
    for m in msgs
]
    c.executemany(sql,data_tuples)
    conn.commit()
