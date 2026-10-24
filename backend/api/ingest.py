import os
import time
import uuid
import threading
from concurrent.futures import ThreadPoolExecutor
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Response
from fastapi.responses import JSONResponse
from typing import Dict, Any, Optional
from openai import OpenAI

from backend.ingestion.parser import extract_text_from_file_bytes
from backend.ingestion.ingest_service import ingest_chat
from backend.profiler.synthesizer import ProfilerSynthesizer

from backend.database import task_repo

router = APIRouter(prefix="/ingest", tags=["Ingestion & Analysis"])

# Background Worker ThreadPool
_executor = ThreadPoolExecutor(max_workers=4)


def create_task(
    file_name: Optional[str] = None,
    file_size_bytes: Optional[int] = None,
    vibe_mode: str = "unhinged",
) -> str:
    task_id = f"task_{uuid.uuid4().hex[:12]}"
    task_repo.create_task(
        task_id=task_id,
        file_name=file_name,
        file_size_bytes=file_size_bytes,
        vibe_mode=vibe_mode,
    )
    return task_id


def update_task_progress(task_id: str, progress: int, current_step: str):
    task_repo.update_task_progress(task_id, progress, current_step)


def complete_task(task_id: str, result: Dict[str, Any], contact_id: Optional[str] = None):
    task_repo.complete_task(task_id, result, contact_id)


def fail_task(task_id: str, error_message: str):
    task_repo.fail_task(task_id, error_message)


def get_task(task_id: str) -> Optional[Dict[str, Any]]:
    return task_repo.get_task(task_id)


def _run_ingest_background_job(
    task_id: str,
    raw_text: str,
    user_sender: Optional[str],
    contact_display_name: Optional[str],
    run_profiler: bool,
    vibe_mode: str,
):
    try:
        api_key = os.getenv("OPENAI_API_KEY")
        client = OpenAI(api_key=api_key) if api_key else None

        # Stage 1: Parsing and scrubbing PII (10%)
        update_task_progress(task_id, 10, "Parsing chat transcript & sanitizing PII...")

        # Stage 2: Ingest & Mathematical Chronemics (30% - 55%)
        update_task_progress(task_id, 30, "Computing mathematical chronemics & silence seams...")
        
        # Runs the core ingestion pipeline (parser + chronemics + The Keep)
        ingest_res = ingest_chat(
            raw_text=raw_text,
            user_sender=user_sender,
            contact_display_name=contact_display_name,
            openai_client=client,
        )

        update_task_progress(task_id, 55, "The Keep entities & preferences extracted.")

        contact_id = ingest_res["contact"]["id"]
        display_name = ingest_res["contact"]["display_name"]
        dossier = None

        # Stage 3: Profiler Synthesis (85%)
        if run_profiler and client:
            update_task_progress(task_id, 80, "Synthesizing 17 Theatrical Acts & Delulu Score...")
            try:
                synthesizer = ProfilerSynthesizer(openai_client=client, model="gpt-4o-mini")
                profiler_res = synthesizer.run_full_profiler(
                    contact_id=contact_id,
                    vibe_mode=vibe_mode,
                )
                dossier = profiler_res["dossier"]
            except Exception as e:
                print(f"[Warning] Profiler synthesis failed ({e}), continuing with basic ingestion.")

        # Stage 4: Completed (100%)
        result_payload = {
            "status": "success",
            "contact_id": contact_id,
            "display_name": display_name,
            "total_messages": ingest_res["message_count"],
            "delulu_score": dossier["delulu_score"] if dossier else None,
            "status_label": dossier["status_label"] if dossier else None,
            "power_ratio_user": dossier["power_ratio_user"] if dossier else None,
            "power_ratio_contact": dossier["power_ratio_contact"] if dossier else None,
            "keep_items_found": ingest_res.get("preferences_found", 0),
            "timing": ingest_res["timing"],
        }
        complete_task(task_id, result_payload, contact_id)
    except Exception as e:
        fail_task(task_id, str(e))


@router.post("/upload", status_code=202)
async def upload_and_analyze(
    file: UploadFile = File(..., description="WhatsApp export .txt or .zip file"),
    user_sender: Optional[str] = Form(None, description="Sender name of the user (e.g. '*' or 'Eshwar')"),
    contact_display_name: Optional[str] = Form(None, description="Custom alias for contact (e.g. 'Sarah')"),
    run_profiler: bool = Form(True, description="Whether to run the 17-Act profiler"),
    vibe_mode: str = Form("unhinged", description="'unhinged' | 'therapy'"),
    wait: bool = Form(False, description="Whether to block until finished (not recommended for production)"),
):
    """
    Primary Ingestion Endpoint:
    - Accepts .txt or .zip WhatsApp exports.
    - Queues an asynchronous worker in a dedicated ThreadPool to prevent event-loop freezing.
    - Returns HTTP 202 Accepted immediately with a task_id for progress polling.
    """
    allowed_exts = (".txt", ".text", ".zip")
    if not any(file.filename.lower().endswith(ext) for ext in allowed_exts):
        raise HTTPException(status_code=400, detail="Only .txt and .zip exports from WhatsApp are supported.")

    content_bytes = await file.read()
    try:
        raw_text = extract_text_from_file_bytes(content_bytes, file.filename)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract chat content: {str(e)}")

    task_id = create_task(
        file_name=file.filename,
        file_size_bytes=len(content_bytes),
        vibe_mode=vibe_mode,
    )

    if wait:
        # Synchronous test/fallback path
        _run_ingest_background_job(
            task_id, raw_text, user_sender, contact_display_name, run_profiler, vibe_mode
        )
        task_data = get_task(task_id)
        if task_data and task_data["status"] == "completed":
            return task_data["result"]
        raise HTTPException(status_code=500, detail=task_data.get("error", "Ingestion failed"))

    # Asynchronous production path: submit to thread pool
    _executor.submit(
        _run_ingest_background_job,
        task_id,
        raw_text,
        user_sender,
        contact_display_name,
        run_profiler,
        vibe_mode,
    )

    return JSONResponse(
        status_code=202,
        content={
            "status": "queued",
            "task_id": task_id,
            "progress": 0,
            "current_step": "Chat export accepted and queued for processing.",
        },
    )


@router.get("/status/{task_id}")
def get_ingest_task_status(task_id: str):
    """
    Polls the progress of an active ingestion task.
    Returns status ('queued' | 'in_progress' | 'completed' | 'failed'), progress (0-100), and final result.
    """
    task = get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail=f"Task '{task_id}' not found.")
    return task
