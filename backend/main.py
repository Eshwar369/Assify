import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from contextlib import asynccontextmanager

# Add repository root to Python path
ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

from backend.database.db import init_db
from backend.database import task_repo
from backend.api import contacts, report, keep, evidence, ingest

# Load environment variables
load_dotenv(ROOT_DIR / ".env")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application Lifespan Context Manager:
    - Verifies and initializes SQLite schema idempotently on startup.
    - Runs self-healing recovery on any stale/abandoned background tasks.
    """
    init_db()
    recovered = task_repo.recover_stale_tasks(stale_threshold_seconds=600)
    if recovered > 0:
        print(f"[System] Self-healed {recovered} abandoned background task(s) from previous session.")
    yield


app = FastAPI(
    title="ASSIFY API",
    version="2.0.0",
    description="Relationship Intelligence, Neuro-Symbolic Chronemics, and The 17 Theatrical Acts API",
    lifespan=lifespan,
)

# Enable CORS for React Native Expo (supports localhost, LAN IP, and mobile devices)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers under /api
app.include_router(contacts.router, prefix="/api")
app.include_router(report.router, prefix="/api")
app.include_router(keep.router, prefix="/api")
app.include_router(evidence.router, prefix="/api")
app.include_router(ingest.router, prefix="/api")

# Architecture aliases matching ARCHITECTURE.md contract
app.add_api_route("/api/upload", ingest.upload_and_analyze, methods=["POST"], status_code=202, tags=["Ingestion & Analysis"])
app.add_api_route("/api/status/{task_id}", ingest.get_ingest_task_status, methods=["GET"], tags=["Ingestion & Analysis"])



@app.get("/")
@app.get("/health")
def healthcheck():
    return {
        "status": "healthy",
        "service": "ASSIFY Relationship Intelligence API",
        "version": "2.0.0",
        "database": "SQLite (WAL Mode)",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
