from httpcore import __name
import sqlite3 
from config import DB_PATH

def connect_database(location:str):
    conn= sqlite3.connect(location)
    c=conn.cursor()
    c.execute("PRAGMA journal_mode=WAL").fetchone()
    with open("storage/schema.sql") as f:
        c.executescript(f.read())
    return conn,c



def save_to_sql(msgs,conn,c):
    data_tuples = [
    (m.id, m.contact_name, m.platform, m.time_stamp.isoformat(), m.sender, m.content, m.media_type, m.media_path, m.embedding_id)
    for m in msgs
]
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
    c.executemany(sql,data_tuples)
    conn.commit()
    
    
    