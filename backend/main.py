import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Add repository root to Python path
ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

from backend.database.db import init_db
from backend.api import contacts, report, keep, evidence, ingest

# Load environment variables
load_dotenv(ROOT_DIR / ".env")

app = FastAPI(
    title="ASSIFY API",
    version="2.0.0",
    description="Relationship Intelligence, Neuro-Symbolic Chronemics, and The 17 Theatrical Acts API",
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


@app.on_event("startup")
def on_startup():
    """Ensure database schema is verified and initialized on startup."""
    init_db()


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
