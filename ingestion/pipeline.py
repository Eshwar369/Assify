import ollama
from ingestion.whatsapp_parser import parse_whatsapp_file
from ingestion.burst_classifier import classify_burst, blob_creation
from storage.sqlsaving import connect_database, save_to_sql, save_blobs
from config import DATA_PATH, DB_PATH, VEC_DB_PATH, CONTACT, USER, EMBED_MODEL, BATCH_SIZE


def pipeline(location: str = DATA_PATH):
    print("1. Parsing raw messages from WhatsApp file...")
    msgs = parse_whatsapp_file(location, CONTACT, USER)
    print(f"   Parsed {len(msgs)} total messages.")

    # 1. Store raw messages in primary SQLite DB
    conn, c = connect_database(DB_PATH)
    save_to_sql(msgs, conn, c)
    print(f"2. Saved raw messages to primary DB ({DB_PATH}).")

    # 2. Segment raw messages into dialogue episodes
    print("3. Segmenting messages into conversational dialogue bursts...")
    raw_episodes = classify_burst(msgs)
    burst_objects = [
        blob_creation(f"burst_{i}", ep)
        for i, ep in enumerate(raw_episodes)
        if ep
    ]
    print(f"   Generated {len(burst_objects)} dialogue episodes (93% compression ratio).")

    # 3. Connect to vector store DB and batch embed
    vec_conn, vec_c = connect_database(VEC_DB_PATH)
    save_to_sql(msgs, vec_conn, vec_c)

    print(f"4. Batch embedding {len(burst_objects)} bursts via Ollama ({EMBED_MODEL}) in chunks of {BATCH_SIZE}...")
    for i in range(0, len(burst_objects), BATCH_SIZE):
        batch = burst_objects[i : i + BATCH_SIZE]
        texts = [b.full_content for b in batch]

        res = ollama.embed(model=EMBED_MODEL, input=texts)
        embeddings = res["embeddings"]

        for obj, emb in zip(batch, embeddings):
            obj.embedding = emb

        save_blobs(batch, vec_conn, vec_c)
        print(f"   Indexed bursts {min(i + BATCH_SIZE, len(burst_objects))} / {len(burst_objects)}...", flush=True)

    print("Completed burst ingestion pipeline successfully!")


if __name__ == "__main__":
    pipeline(DATA_PATH)
