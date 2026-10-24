import io
import time
import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.database.db import init_db

@pytest.fixture(autouse=True)
def setup_db():
    init_db()

client = TestClient(app)

SAMPLE_CHAT = """
23/03/2026, 12:15 - Sarah: Hey, are you free to chat?
23/03/2026, 12:15 - *: Yes, always for you.
23/03/2026, 12:16 - Sarah: I crave pizza from Joe's Diner!
23/03/2026, 12:17 - *: Let's go this Saturday!
"""


def test_upload_invalid_file_extension():
    response = client.post(
        "/api/ingest/upload",
        files={"file": ("chat.pdf", io.BytesIO(b"fake pdf content"), "application/pdf")},
    )
    assert response.status_code == 400
    assert "supported" in response.json()["detail"].lower()


def test_status_endpoint_not_found():
    response = client.get("/api/status/task_nonexistent_9999")
    assert response.status_code == 404


def test_upload_and_async_polling_workflow():
    # 1. Upload chat file
    file_bytes = SAMPLE_CHAT.encode("utf-8")
    response = client.post(
        "/api/ingest/upload",
        files={"file": ("_chat_sample.txt", io.BytesIO(file_bytes), "text/plain")},
        data={"user_sender": "*", "contact_display_name": "Sarah", "run_profiler": False},
    )

    # Should return HTTP 202 Accepted
    assert response.status_code == 202
    data = response.json()
    assert "task_id" in data
    task_id = data["task_id"]
    assert data["status"] in ("queued", "in_progress")

    # 2. Poll /api/status/{task_id} until completed or timeout
    max_wait_seconds = 35
    start_time = time.time()
    task_result = None

    while time.time() - start_time < max_wait_seconds:
        status_resp = client.get(f"/api/status/{task_id}")
        assert status_resp.status_code == 200
        status_data = status_resp.json()
        assert "progress" in status_data
        assert "current_step" in status_data

        if status_data["status"] == "completed":
            task_result = status_data
            break
        elif status_data["status"] == "failed":
            pytest.fail(f"Task failed: {status_data.get('error')}")

        time.sleep(0.2)

    assert task_result is not None, "Task did not complete within timeout"
    assert task_result["status"] == "completed"
    assert task_result["progress"] == 100
    assert task_result["result"]["contact_id"] is not None
    assert task_result["result"]["total_messages"] >= 4
