import sqlite3
import numpy as np
import ollama
from memory.embed_math import cosine_sim
from config import VEC_DB_PATH, DB_PATH, EMBED_MODEL


class VectorStore:
    def __init__(self, path: str = VEC_DB_PATH):
        self.conn = sqlite3.connect(path)
        self.cursor = self.conn.cursor()
        self.cursor.execute("PRAGMA journal_mode=WAL;")
        self.create_table()

    def create_table(self):
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS embeddings (
                id text PRIMARY KEY,
                embedding BLOB NOT NULL
                );
        """)
        self.conn.commit()

    def add_embeddings(self, ids, msgs):
        embeddings = [np.array(embedding, dtype=np.float32).tobytes() for embedding in ollama.embed(model=EMBED_MODEL, input=msgs)["embeddings"]]
        self.cursor.executemany("INSERT OR IGNORE INTO embeddings (id, embedding) VALUES (?, ?)", zip(ids, embeddings))
        self.conn.commit()

    def search(self, query_embedding, k=5):
        question_vector = ollama.embeddings(model=EMBED_MODEL, prompt=query_embedding)["embedding"]
        self.cursor.execute("SELECT id, embedding FROM embeddings")
        rows = self.cursor.fetchall()
        sims = []
        for row in rows:
            embedding = np.frombuffer(row[1], dtype=np.float32)
            similarity = cosine_sim(embedding, question_vector)
            sims.append((row[0], similarity))
        sims.sort(key=lambda x: x[1], reverse=True)
        return sims[:k]

    def close(self):
        self.conn.close()

if __name__ == "__main__":
    import sys
    sys.stdout.reconfigure(encoding='utf-8')
    db = VectorStore(VEC_DB_PATH)

    result = db.search(query_embedding="thank you soo much", k=6)
    print('result:')
    conn = sqlite3.connect(DB_PATH)

    c=conn.cursor()
    for id,score in result:
        c.execute("""
                SELECT * FROM messages
                WHERE id=?
                """,(id,))

        msg=c.fetchone()

        print("ID:", id,"   :",msg)

        print("Score:", score)
        print("\n")

