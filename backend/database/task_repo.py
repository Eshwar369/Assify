import json
import sqlite3
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone

from backend.database.db import get_db_connection


def _row_to_dict(row: sqlite3.Row) -> Dict[str, Any]:
    """Converts a SQLite task row into a clean dictionary with parsed JSON result."""
    result = None
    if row["result_json"]:
        try:
            result = json.loads(row["result_json"])
        except Exception:
            result = None

    return {
        "task_id": row["task_id"],
        "status": row["status"],
        "progress": row["progress"],
        "current_step": row["current_step"],
        "error": row["error"],
        "result": result,
        "file_name": row["file_name"],
        "file_size_bytes": row["file_size_bytes"],
        "contact_id": row["contact_id"],
        "vibe_mode": row["vibe_mode"],
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
        "completed_at": row["completed_at"],
    }


def create_task(
    task_id: str,
    file_name: Optional[str] = None,
    file_size_bytes: Optional[int] = None,
    vibe_mode: str = "unhinged",
) -> Dict[str, Any]:
    """
    Persists a newly created ingestion task in the database with status 'queued'.
    Thread-safe and process-safe under SQLite WAL mode.
    """
    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    current_step = "Task queued for processing"

    conn = get_db_connection()
    try:
        conn.execute(
            """
            INSERT INTO ingestion_tasks (
                task_id, status, progress, current_step,
                error, result_json, file_name, file_size_bytes,
                vibe_mode, created_at, updated_at
            ) VALUES (?, 'queued', 0, ?, NULL, NULL, ?, ?, ?, ?, ?)
            """,
            (
                task_id,
                current_step,
                file_name,
                file_size_bytes,
                vibe_mode,
                now_iso,
                now_iso,
            ),
        )
        conn.commit()
    finally:
        conn.close()

    return {
        "task_id": task_id,
        "status": "queued",
        "progress": 0,
        "current_step": current_step,
        "error": None,
        "result": None,
        "file_name": file_name,
        "file_size_bytes": file_size_bytes,
        "contact_id": None,
        "vibe_mode": vibe_mode,
        "created_at": now_iso,
        "updated_at": now_iso,
        "completed_at": None,
    }


def update_task_progress(task_id: str, progress: int, current_step: str) -> None:
    """
    Atomically updates the progress and current step of an active task.
    Transitions task status to 'in_progress'.
    """
    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    clamped_progress = max(0, min(100, int(progress)))

    conn = get_db_connection()
    try:
        conn.execute(
            """
            UPDATE ingestion_tasks
            SET status = 'in_progress',
                progress = ?,
                current_step = ?,
                updated_at = ?
            WHERE task_id = ?
            """,
            (clamped_progress, current_step, now_iso, task_id),
        )
        conn.commit()
    finally:
        conn.close()


def complete_task(
    task_id: str,
    result: Dict[str, Any],
    contact_id: Optional[str] = None,
) -> None:
    """
    Marks a task as 'completed' (100%), serializes the result dictionary,
    and records the completion timestamp.
    Safely validates contact_id against contacts table to uphold foreign key integrity.
    """
    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    result_json = json.dumps(result, ensure_ascii=False)

    conn = get_db_connection()
    try:
        valid_contact_id = None
        if contact_id:
            exists = conn.execute("SELECT 1 FROM contacts WHERE id = ?", (contact_id,)).fetchone()
            if exists:
                valid_contact_id = contact_id

        conn.execute(
            """
            UPDATE ingestion_tasks
            SET status = 'completed',
                progress = 100,
                current_step = 'Analysis complete',
                result_json = ?,
                contact_id = COALESCE(?, contact_id),
                updated_at = ?,
                completed_at = ?
            WHERE task_id = ?
            """,
            (result_json, valid_contact_id, now_iso, now_iso, task_id),
        )
        conn.commit()
    finally:
        conn.close()


def fail_task(task_id: str, error_message: str) -> None:
    """
    Marks a task as 'failed' and records the specific error message.
    """
    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    current_step = f"Failed: {error_message}"

    conn = get_db_connection()
    try:
        conn.execute(
            """
            UPDATE ingestion_tasks
            SET status = 'failed',
                error = ?,
                current_step = ?,
                updated_at = ?
            WHERE task_id = ?
            """,
            (error_message, current_step, now_iso, task_id),
        )
        conn.commit()
    finally:
        conn.close()


def get_task(task_id: str) -> Optional[Dict[str, Any]]:
    """
    Retrieves a task by task_id from SQLite.
    Returns None if no matching task exists.
    """
    conn = get_db_connection()
    try:
        row = conn.execute(
            "SELECT * FROM ingestion_tasks WHERE task_id = ?",
            (task_id,),
        ).fetchone()
        if not row:
            return None
        return _row_to_dict(row)
    finally:
        conn.close()


def recover_stale_tasks(stale_threshold_seconds: int = 600) -> int:
    """
    Self-healing recovery routine:
    Finds any task abandoned in 'queued' or 'in_progress' whose last update
    exceeds stale_threshold_seconds (e.g. server crash, restart, or power outage)
    and transitions it to 'failed'.
    Returns the number of recovered tasks.
    """
    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    conn = get_db_connection()
    try:
        cursor = conn.execute(
            """
            UPDATE ingestion_tasks
            SET status = 'failed',
                error = 'Task abandoned due to server restart or timeout',
                current_step = 'Failed: Task abandoned due to server restart',
                updated_at = ?
            WHERE status IN ('queued', 'in_progress')
              AND datetime(updated_at, '+' || ? || ' seconds') <= datetime('now')
            """,
            (now_iso, stale_threshold_seconds),
        )
        recovered_count = cursor.rowcount
        conn.commit()
        return recovered_count
    finally:
        conn.close()
