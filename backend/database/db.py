import sqlite3
from pathlib import Path
from typing import Optional

DEFAULT_DB_PATH = Path(__file__).resolve().parent.parent / "assify.db"
DEFAULT_SCHEMA_PATH = Path(__file__).resolve().parent / "schema.sql"


def get_db_connection(db_path: Optional[Path | str] = None) -> sqlite3.Connection:
    """
    Establishes a high-concurrency SQLite connection in WAL mode.
    - journal_mode=WAL: Allows non-blocking concurrent reads while a write is occurring.
    - foreign_keys=ON: Enforces cascading deletes and relational integrity.
    - row_factory=sqlite3.Row: Enables clean dict-like attribute access on returned rows.
    """
    path = Path(db_path) if db_path else DEFAULT_DB_PATH
    conn = sqlite3.connect(path, timeout=30.0, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode = WAL;")
    conn.execute("PRAGMA foreign_keys = ON;")
    conn.execute("PRAGMA synchronous = NORMAL;")
    return conn


def init_db(
    db_path: Optional[Path | str] = None,
    schema_path: Optional[Path | str] = None
) -> None:
    """
    Executes Schema 2.0 DDL to initialize all production tables.
    Idempotent operation (uses CREATE TABLE IF NOT EXISTS).
    """
    schema_file = Path(schema_path) if schema_path else DEFAULT_SCHEMA_PATH
    if not schema_file.exists():
        raise FileNotFoundError(f"Schema file not found at: {schema_file}")

    with open(schema_file, "r", encoding="utf-8") as f:
        schema_sql = f.read()

    conn = get_db_connection(db_path)
    try:
        conn.executescript(schema_sql)
        conn.commit()
    finally:
        conn.close()


if __name__ == "__main__":
    print(f"Initializing Assify Schema 2.0 at {DEFAULT_DB_PATH}...")
    init_db()
    print("Database successfully initialized!")
