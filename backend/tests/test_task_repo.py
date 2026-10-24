import os
import time
import pytest
import sqlite3
from pathlib import Path

from backend.database.db import get_db_connection, init_db
from backend.database import task_repo


@pytest.fixture(autouse=True)
def setup_test_db(tmp_path):
    """Sets up an isolated, temporary SQLite database for task repository testing."""
    test_db = tmp_path / "test_tasks.db"
    init_db(test_db)
    # Monkey-patch default connection to use test_db
    original_get_db_conn = task_repo.get_db_connection
    task_repo.get_db_connection = lambda: get_db_connection(test_db)
    yield test_db
    task_repo.get_db_connection = original_get_db_conn


def test_create_and_get_task():
    task_id = "test_task_001"
    created = task_repo.create_task(
        task_id=task_id,
        file_name="chat_export.txt",
        file_size_bytes=10240,
        vibe_mode="unhinged",
    )

    assert created["task_id"] == task_id
    assert created["status"] == "queued"
    assert created["progress"] == 0
    assert "queued" in created["current_step"].lower()
    assert created["file_name"] == "chat_export.txt"
    assert created["file_size_bytes"] == 10240
    assert created["vibe_mode"] == "unhinged"
    assert created["error"] is None
    assert created["result"] is None

    # Fetch from repository
    fetched = task_repo.get_task(task_id)
    assert fetched is not None
    assert fetched["task_id"] == task_id
    assert fetched["status"] == "queued"


def test_update_task_progress():
    task_id = "test_task_002"
    task_repo.create_task(task_id=task_id, file_name="sample.txt")

    task_repo.update_task_progress(
        task_id=task_id,
        progress=45,
        current_step="Computing silence seams and chronemics...",
    )

    updated = task_repo.get_task(task_id)
    assert updated["status"] == "in_progress"
    assert updated["progress"] == 45
    assert updated["current_step"] == "Computing silence seams and chronemics..."


def test_complete_task(setup_test_db):
    test_db = setup_test_db
    conn = get_db_connection(test_db)
    conn.execute(
        "INSERT INTO contacts (id, raw_name, display_name, user_name) VALUES ('contact_sarah_123', 'Sarah', 'Sarah', 'User')"
    )
    conn.commit()
    conn.close()

    task_id = "test_task_003"
    task_repo.create_task(task_id=task_id, file_name="export.zip")

    result_payload = {
        "status": "success",
        "contact_id": "contact_sarah_123",
        "delulu_score": 82,
        "total_messages": 14032,
    }

    task_repo.complete_task(
        task_id=task_id,
        result=result_payload,
        contact_id="contact_sarah_123",
    )

    completed = task_repo.get_task(task_id)
    assert completed["status"] == "completed"
    assert completed["progress"] == 100
    assert completed["current_step"] == "Analysis complete"
    assert completed["result"] == result_payload
    assert completed["contact_id"] == "contact_sarah_123"
    assert completed["completed_at"] is not None


def test_fail_task():
    task_id = "test_task_004"
    task_repo.create_task(task_id=task_id, file_name="corrupt.zip")

    task_repo.fail_task(task_id=task_id, error_message="Corrupted ZIP archive: EOF reached")

    failed = task_repo.get_task(task_id)
    assert failed["status"] == "failed"
    assert failed["error"] == "Corrupted ZIP archive: EOF reached"
    assert "Corrupted ZIP archive" in failed["current_step"]


def test_persistence_across_distinct_connections(setup_test_db):
    test_db = setup_test_db
    task_id = "test_task_persist"
    
    # 1. Create on connection 1
    task_repo.create_task(task_id=task_id, file_name="persistent.txt")
    task_repo.update_task_progress(task_id, 30, "Step 1 done")

    # 2. Query directly using an entirely independent raw connection
    raw_conn = sqlite3.connect(test_db)
    raw_conn.row_factory = sqlite3.Row
    row = raw_conn.execute("SELECT * FROM ingestion_tasks WHERE task_id = ?", (task_id,)).fetchone()
    raw_conn.close()

    assert row is not None
    assert row["task_id"] == task_id
    assert row["status"] == "in_progress"
    assert row["progress"] == 30
    assert row["current_step"] == "Step 1 done"


def test_recover_stale_tasks(setup_test_db):
    test_db = setup_test_db
    # Create an in_progress task and artificially set updated_at to 30 minutes in the past
    task_id = "stale_task_999"
    task_repo.create_task(task_id=task_id, file_name="stale.txt")
    task_repo.update_task_progress(task_id, 50, "Crashed halfway")

    conn = get_db_connection(test_db)
    # 1800 seconds in the past
    conn.execute(
        "UPDATE ingestion_tasks SET updated_at = datetime('now', '-30 minutes') WHERE task_id = ?",
        (task_id,)
    )
    conn.commit()
    conn.close()

    # Create a fresh active task
    active_id = "active_task_001"
    task_repo.create_task(task_id=active_id, file_name="active.txt")

    # Run recovery with 10-minute timeout
    recovered_count = task_repo.recover_stale_tasks(stale_threshold_seconds=600)
    assert recovered_count >= 1

    # Stale task should now be failed
    stale_task = task_repo.get_task(task_id)
    assert stale_task["status"] == "failed"
    assert "abandoned" in stale_task["error"].lower()

    # Active fresh task should NOT be touched
    active_task = task_repo.get_task(active_id)
    assert active_task["status"] == "queued"
