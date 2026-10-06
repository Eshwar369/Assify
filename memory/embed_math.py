import numpy as np 
import ollama

def cosine_sim(v1,v2) -> float:
    v1 = np.array(v1)
    v2 = np.array(v2)
    dot= np.dot(v1,v2)
    norm1= np.linalg.norm(v1)
    norm2= np.linalg.norm(v2)
    if norm1==0 or norm2==0:
        return 0
    return dot/(norm1*norm2)

def get_real_embeddings(sentence):
    #gets the embedding of the words using ollama nomic-embed-text:v1.5
    return ollama.embeddings(model="nomic-embed-text:v1.5", prompt=sentence)

def cosine_sim_text(text1, text2):
    return cosine_sim(get_real_embeddings(text1)["embedding"], get_real_embeddings(text2)["embedding"])

import math
from datetime import datetime

def compute_hybrid_score(
    similarity: float,
    timestamp_str: str,
    half_life_days: float = 30.0,
    min_floor: float = 0.5
) -> dict:
    """
    Robust Bounded Recency Scoring (avoids the exponential cliff problem).
    
    Instead of collapsing to 0 for historical chats, this ensures a minimum 
    semantic retention floor (default 50%).
    Multiplier = min_floor + (1 - min_floor) * exp(-lambda * delta_t)
    FinalScore = similarity * Multiplier
    """
    try:
        msg_dt = datetime.fromisoformat(timestamp_str.replace(" ", "T"))
        days_ago = max(0.0, (datetime.now() - msg_dt).total_seconds() / 86400.0)
    except Exception:
        days_ago = 0.0

    decay_lambda = 0.693 / max(half_life_days, 1.0)
    raw_decay = math.exp(-decay_lambda * days_ago)
    
    # Soft floor ensures historical ground-truth is never wiped out:
    recency_multiplier = min_floor + (1.0 - min_floor) * raw_decay
    final_score = similarity * recency_multiplier

    return {
        "final_score": float(final_score),
        "similarity": float(similarity),
        "recency_multiplier": float(recency_multiplier),
        "days_ago": float(days_ago)
    }


if __name__ == "__main__":
    test_sim = 0.90
    print("Old message (180 days ago):", compute_hybrid_score(test_sim, "2024-01-01T00:00:00"))
    print("Recent message (1 day ago):", compute_hybrid_score(test_sim, datetime.now().isoformat()))
