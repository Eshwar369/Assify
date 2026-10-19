import os
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Dict, Any, Optional
from openai import OpenAI

from backend.ingestion.ingest_service import ingest_chat
from backend.profiler.synthesizer import ProfilerSynthesizer

router = APIRouter(prefix="/ingest", tags=["Ingestion & Analysis"])


@router.post("/upload", response_model=Dict[str, Any])
async def upload_and_analyze(
    file: UploadFile = File(..., description="WhatsApp export .txt file"),
    user_sender: Optional[str] = Form(None, description="Sender name of the user (e.g. '*' or 'Eshwar')"),
    contact_display_name: Optional[str] = Form(None, description="Custom alias for contact (e.g. 'Sarah')"),
    run_profiler: bool = Form(True, description="Whether to immediately run the 17-Act profiler"),
    vibe_mode: str = Form("unhinged", description="'unhinged' | 'therapy'"),
):
    """
    Primary Onboarding Endpoint:
    1. Ingests raw WhatsApp .txt export.
    2. Runs Neuro-Symbolic Chronemics & populates The Keep.
    3. (Optionally) Runs the 4-Pass Synthesizer to generate all 17 Acts and Delulu Score.
    """
    if not file.filename.endswith((".txt", ".text")):
        raise HTTPException(status_code=400, detail="Only .txt files from WhatsApp exports are supported.")

    content_bytes = await file.read()
    try:
        raw_text = content_bytes.decode("utf-8")
    except UnicodeDecodeError:
        raw_text = content_bytes.decode("latin-1", errors="replace")

    api_key = os.getenv("OPENAI_API_KEY")
    client = OpenAI(api_key=api_key) if api_key else None

    # Step 1: Ingestion & Chronemics & The Keep
    try:
        ingest_res = ingest_chat(
            raw_text=raw_text,
            user_sender=user_sender,
            contact_display_name=contact_display_name,
            openai_client=client,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")

    contact_id = ingest_res["contact"]["id"]
    display_name = ingest_res["contact"]["display_name"]
    dossier = None

    # Step 2: Full Profiler (17 Acts & Delulu Score)
    if run_profiler and client:
        try:
            synthesizer = ProfilerSynthesizer(openai_client=client, model="gpt-4o-mini")
            profiler_res = synthesizer.run_full_profiler(
                contact_id=contact_id,
                vibe_mode=vibe_mode,
            )
            dossier = profiler_res["dossier"]
        except Exception as e:
            print(f"[Warning] Profiler synthesis failed ({e}), continuing with basic ingestion.")

    return {
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
