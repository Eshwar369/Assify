from ingestion.whatsapp_parser import parse_whatsapp_file
from storage.sqlsaving import connect_database,save_to_sql
from memory.chroma_test import connect_vec_database
from memory.vector_store import VectorStore

'''
first pull the already written fuction from storage.sqlsaving
get the documetns from normalizer,that is whatsapp parser,
insert them into the sql and batch them and 
insert them into chromadb
'''

def pipline(location:str):
    msgs=parse_whatsapp_file(location,"Sleepless Zombiee","*")
    conn,c=connect_database("data/db/allmessages.db")
    save_to_sql(msgs,conn,c)
    vec_db=VectorStore("data/vec_db/vector_db.db")
    BATCH_SIZE = 200
    batch_docs = []
    batch_ids = []
    batch_metadatas = []
    seen_ids = set()

    print(f"Starting vectorDB ingestion for {len(msgs)} messages in batches of {BATCH_SIZE}...")

    for m in msgs:
        if not m.content or not m.content.strip():
            continue
        # Skip duplicate message IDs
        if m.id in seen_ids:
            continue
        seen_ids.add(m.id)

        clean_text = m.content.replace("\x00", "").strip()
        batch_docs.append(clean_text)
        batch_ids.append(m.id)
        batch_metadatas.append({
            "time_stamp": m.time_stamp.isoformat(),
            "sender": m.sender,
            "platform": m.platform,
            "media_type": m.media_type,
            "media_path": m.media_path or "",
        })

        if len(batch_ids) >= BATCH_SIZE:
            vec_db.add_embeddings(batch_ids,batch_docs)
            print(f"Pushed {len(seen_ids)} unique messages to Vec_db...", flush=True)
            batch_docs.clear()
            batch_ids.clear()
            batch_metadatas.clear()

    # Flush any remaining messages
    if batch_ids:
        vec_db.add_embeddings(batch_ids,batch_docs)

    print(f"Total unique messages now in vec_db collection: {len(seen_ids)}")
    print("Completed ingestion successfully!")






#  check last message inserted


if __name__ == "__main__":
    pipline("data/assify_data.txt")

