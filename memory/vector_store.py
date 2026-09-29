from sqlalchemy import true
import sqlite3
import numpy as np
import ollama
from memory.embed_math import cosine_sim


class VectorStore:
    def __init__(self, path):
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

    def add_embeddings(self,ids,msgs):
        embeddings=[np.array(embedding, dtype=np.float32).tobytes() for embedding in ollama.embed(model="nomic-embed-text:v1.5", input=msgs)["embeddings"]]
        self.cursor.executemany("INSERT OR IGNORE INTO embeddings (id, embedding) VALUES (?, ?)", zip(ids,embeddings))
        self.conn.commit()
    def search(self, query_embedding, k=5):
        question_vector=ollama.embeddings(model="nomic-embed-text:v1.5",prompt=query_embedding)["embedding"]
        self.cursor.execute("SELECT id, embedding FROM embeddings")
        rows=self.cursor.fetchall()
        sims=[]
        for row in rows:
            embedding=np.frombuffer(row[1],dtype=np.float32)
            similarity=cosine_sim(embedding,question_vector)
            sims.append((row[0],similarity))
        sims.sort(key=lambda x: x[1], reverse=True)
        return sims[:k]

    def close(self):
        self.conn.close()
