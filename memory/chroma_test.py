
from chromadb.utils.embedding_functions import OllamaEmbeddingFunction
import chromadb
from langchain_community.vectorstores.chroma import Chroma

def connect_vec_db(location: str, collection_name: str):
    client = chromadb.PersistentClient(location)
    collection = client.get_or_create_collection(
        collection_name,
        embedding_function=OllamaEmbeddingFunction(
            url="http://localhost:11434",
            model_name="nomic-embed-text:v1.5"
        ),
        metadata={"hnsw:space": "cosine"}
    )
    return client, collection
def connect_vec_database(
    collection_name: str,
    embedding_function: OllamaEmbeddingFunction,
    persist_directory: str,
    metadata: dict[str, str]
):
    db=Chroma.from_texts(
        collection_name=collection_name,
        embedding_function=embedding_function,
        persist_directory=persist_directory,
        collection_metadata=metadata
    )
    return db

if __name__ == "__main__":
    print("Testing fresh collection...")
    client, col = connect_vec_database("data/db/chromadb", "test_fresh")
    col.upsert(
        documents=["hello fresh", "world fresh"],
        ids=["probe_1", "probe_2"],
        metadatas=[{"sender": "me"}, {"sender": "them"}]
    )
    print(f"Fresh collection upsert succeeded! Count: {col.count()}")

