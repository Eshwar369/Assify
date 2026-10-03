import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Data & DB Paths (supports either short or long names)
DATA_PATH = os.getenv("DATA_PATH") or os.getenv("WHATSAPP_DATA_PATH", "data/assify_data.txt")
DB_PATH = os.getenv("DB_PATH") or os.getenv("SQLITE_DB_PATH", "data/db/allmessages.db")
VEC_DB_PATH = os.getenv("VEC_DB_PATH") or os.getenv("VECTOR_DB_PATH", "data/vec_db/vector_db.db")

# Contacts
CONTACT = os.getenv("CONTACT") or os.getenv("DEFAULT_CONTACT_NAME", "Sleepless Zombiee")
USER = os.getenv("USER") or os.getenv("DEFAULT_USER_NAME", "*")

# Models
EMBED_MODEL = os.getenv("EMBED_MODEL") or os.getenv("OLLAMA_EMBED_MODEL", "nomic-embed-text:v1.5")
FAST_LLM = os.getenv("FAST_LLM") or os.getenv("OLLAMA_FAST_LLM", "phi3:mini")
ANALYST_LLM = os.getenv("ANALYST_LLM") or os.getenv("OLLAMA_ANALYSIS_LLM", "llama3:8b")

# Settings
BATCH_SIZE = int(os.getenv("BATCH_SIZE") or os.getenv("EMBEDDING_BATCH_SIZE", 100))
HALF_LIFE_DAYS = float(os.getenv("HALF_LIFE_DAYS") or os.getenv("TIME_DECAY_HALF_LIFE_DAYS", 30))
LLM_PROVIDER = os.getenv("LLM_PROVIDER","ollama")