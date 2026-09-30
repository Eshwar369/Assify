import sqlite3
import numpy as np
import ollama
import math
from datetime import datetime
from memory.embed_math import cosine_sim
from config import VEC_DB_PATH, DB_PATH, EMBED_MODEL, HALF_LIFE_DAYS


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

    def timed_search(self, query_text: str, k: int = 5, half_life_days: float = HALF_LIFE_DAYS):
        """
        Time-weighted RAG search:
        FinalScore = CosineSimilarity * exp(-lambda * delta_t)
        """
        question_vector = ollama.embeddings(model=EMBED_MODEL, prompt=query_text)["embedding"]
        self.cursor.execute("""
            SELECT e.id, e.embedding, m.time_stamp, m.sender, m.content
            FROM embeddings e
            JOIN messages m ON e.id = m.id
        """)
        rows = self.cursor.fetchall()
        if not rows:
            return []

        now_dt = datetime.now()
        decay_lambda = 0.693 / half_life_days

        scored = []
        for row in rows:
            msg_id = row[0]
            emb = np.frombuffer(row[1], dtype=np.float32)
            time_str = row[2]
            sender = row[3]
            content = row[4]

            sim = cosine_sim(emb, question_vector)
            try:
                msg_dt = datetime.fromisoformat(time_str.replace(" ", "T"))
                days_ago = max(0.0, (now_dt - msg_dt).total_seconds() / 86400.0)
            except Exception:
                days_ago = 0.0

            time_factor = math.exp(-decay_lambda * days_ago)
            final_score = sim * time_factor
            scored.append({
                "id": msg_id,
                "final_score": final_score,
                "similarity": sim,
                "time_factor": time_factor,
                "timestamp": time_str,
                "sender": sender,
                "content": content
            })

        scored.sort(key=lambda x: x["final_score"], reverse=True)
        return scored[:k]

    def close(self):
        self.conn.close()

if __name__ == "__main__":
    import sys
    sys.stdout.reconfigure(encoding='utf-8')
    db = VectorStore(VEC_DB_PATH)

    print("--- Testing Time-Weighted Search (Decay Enabled) ---")
    query = "thank you soo much"
    results = db.timed_search(query_text=query, k=5, half_life_days=30)
    for r in results:
        print(f"[{r['timestamp']}] ({r['sender']}): {r['content']}")
        print(f"   Final: {r['final_score']:.4f} | Sim: {r['similarity']:.4f} | Recency: {r['time_factor']:.4f}\n")


