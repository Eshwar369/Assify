import sqlite3
import numpy as np
import ollama
from memory.embed_math import cosine_sim, compute_hybrid_score
from config import VEC_DB_PATH, DB_PATH, EMBED_MODEL, HALF_LIFE_DAYS
from storage.sqlsaving import connect_database


class VectorStore:
    def __init__(self, path: str = VEC_DB_PATH):
        self.conn, self.cursor = connect_database(path)
        self.cursor.execute("PRAGMA journal_mode=WAL;")

    def search(self, query_text: str, k: int = 5):
        """
        Pure semantic search across dialogue bursts (message_bursts).
        No recency penalty is applied here.
        """
        res = ollama.embeddings(model=EMBED_MODEL, prompt=query_text)
        question_vector = res["embedding"]

        self.cursor.execute("""
            SELECT id, embedding, start_time, contact_name, content
            FROM message_bursts
        """)
        rows = self.cursor.fetchall()
        if not rows:
            return []

        sims = []
        for row in rows:
            if not row[1]:
                continue
            embedding = np.frombuffer(row[1], dtype=np.float32)
            similarity = float(cosine_sim(embedding, question_vector))
            sims.append({
                "id": row[0],
                "similarity": similarity,
                "final_score": similarity,
                "timestamp": row[2],
                "contact_name": row[3],
                "content": row[4]
            })

        sims.sort(key=lambda x: x["similarity"], reverse=True)
        return sims[:k]

    def timed_search(
        self,
        query_text: str,
        k: int = 5,
        half_life_days: float = HALF_LIFE_DAYS,
        use_decay: bool = False
    ):
        """
        Retrieval interface for copilot and analyst agents.
        
        Default (use_decay=False): Pure semantic search without time distortion.
        When use_decay=True: Uses bounded soft-floor decay (compute_hybrid_score)
        so historical ground-truth is never wiped out.
        """
        if not use_decay:
            return self.search(query_text=query_text, k=k)

        res = ollama.embeddings(model=EMBED_MODEL, prompt=query_text)
        question_vector = res["embedding"]

        self.cursor.execute("""
            SELECT id, embedding, start_time, contact_name, content
            FROM message_bursts
        """)
        rows = self.cursor.fetchall()
        if not rows:
            return []

        scored = []
        for row in rows:
            if not row[1]:
                continue
            emb = np.frombuffer(row[1], dtype=np.float32)
            sim = float(cosine_sim(emb, question_vector))
            time_str = row[2]

            decay_info = compute_hybrid_score(
                similarity=sim,
                timestamp_str=time_str,
                half_life_days=half_life_days,
                min_floor=0.5
            )

            scored.append({
                "id": row[0],
                "final_score": decay_info["final_score"],
                "similarity": sim,
                "time_factor": decay_info["recency_multiplier"],
                "days_ago": decay_info["days_ago"],
                "timestamp": time_str,
                "contact_name": row[3],
                "content": row[4]
            })

        scored.sort(key=lambda x: x["final_score"], reverse=True)
        return scored[:k]

    def context_window_messages(self, burst_id: str, window: int = 5):
        """
        Returns dialogue content for the given burst episode.
        """
        self.cursor.execute("SELECT content FROM message_bursts WHERE id = ?", (burst_id,))
        row = self.cursor.fetchone()
        if row:
            return [(burst_id, "", "", row[0])]
        return []

    def close(self):
        self.conn.close()


if __name__ == "__main__":
    import sys
    sys.stdout.reconfigure(encoding='utf-8')
    db = VectorStore(VEC_DB_PATH)
'''
    print("=" * 65)
    print("🔍 ASSIFY VECTOR STORE: SIDE-BY-SIDE RETRIEVAL TEST")
    print("=" * 65)

    test_query = "thank you"
    print(f"\nTest Target Query: \"{test_query}\"")

    print("\n--- [MODE 1] PURE SEMANTIC SEARCH (No Time Distortion) ---")
    pure_results = db.search(query_text=test_query, k=3)
    for i, r in enumerate(pure_results, 1):
        print(f"\n#{i} [{r['timestamp']}] ({r['contact_name']}) | Similarity: {r['similarity']:.4f}")
        print(f"Dialogue:\n{r['content'].strip()}")
        print("-" * 50)

    print("\n--- [MODE 2] BOUNDED SOFT-FLOOR DECAY (use_decay=True) ---")
    decay_results = db.timed_search(query_text=test_query, k=3, use_decay=True)
    for i, r in enumerate(decay_results, 1):
        print(f"\n#{i} [{r['timestamp']}] ({r['contact_name']}) | Final: {r['final_score']:.4f} (Sim: {r['similarity']:.4f} x FloorMultiplier: {r['time_factor']:.2f}, {r['days_ago']:.1f} days ago)")
        print(f"Dialogue:\n{r['content'].strip()}")
        print("-" * 50)
'''