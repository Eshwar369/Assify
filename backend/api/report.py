import json
from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from backend.database.db import get_db_connection

router = APIRouter(prefix="/report", tags=["Report"])


@router.get("/{contact_id}", response_model=Dict[str, Any])
def get_relationship_dossier(contact_id: str):
    """
    Returns the Master Dossier (Relationship Profile) and Chronemics Telemetry
    for the Delulu Dashboard.
    """
    conn = get_db_connection()
    try:
        contact = conn.execute("SELECT * FROM contacts WHERE id = ?", (contact_id,)).fetchone()
        if not contact:
            raise HTTPException(status_code=404, detail=f"Contact '{contact_id}' not found.")

        profile = conn.execute("SELECT * FROM relationship_profiles WHERE contact_id = ?", (contact_id,)).fetchone()
        stats = conn.execute("SELECT * FROM chronemics_stats WHERE contact_id = ?", (contact_id,)).fetchone()
        acts_count = conn.execute("SELECT COUNT(*) FROM report_acts WHERE contact_id = ?", (contact_id,)).fetchone()[0]

        return {
            "contact": dict(contact),
            "profile": dict(profile) if profile else None,
            "chronemics": dict(stats) if stats else None,
            "total_acts_available": acts_count,
        }
    finally:
        conn.close()


@router.get("/{contact_id}/acts", response_model=List[Dict[str, Any]])
def get_all_acts(contact_id: str):
    """
    Returns all 17 Theatrical Acts ordered sequentially from Act 1 to Act 17.
    """
    conn = get_db_connection()
    try:
        rows = conn.execute(
            "SELECT act_number, act_name, payload_json, generated_at FROM report_acts WHERE contact_id = ? ORDER BY act_number ASC",
            (contact_id,)
        ).fetchall()

        if not rows:
            raise HTTPException(status_code=404, detail=f"No report acts found for contact '{contact_id}'. Run profiler first.")

        acts = []
        for r in rows:
            act_dict = {
                "act_number": r["act_number"],
                "act_name": r["act_name"],
                "generated_at": r["generated_at"],
                "content": json.loads(r["payload_json"]),
            }
            acts.append(act_dict)

        return acts
    finally:
        conn.close()


@router.get("/{contact_id}/acts/{act_number}", response_model=Dict[str, Any])
def get_single_act(contact_id: str, act_number: int):
    """
    Returns a single Act by act_number (1 to 17).
    """
    conn = get_db_connection()
    try:
        row = conn.execute(
            "SELECT act_number, act_name, payload_json, generated_at FROM report_acts WHERE contact_id = ? AND act_number = ?",
            (contact_id, act_number)
        ).fetchone()

        if not row:
            raise HTTPException(status_code=404, detail=f"Act {act_number} not found for contact '{contact_id}'.")

        return {
            "act_number": row["act_number"],
            "act_name": row["act_name"],
            "generated_at": row["generated_at"],
            "content": json.loads(row["payload_json"]),
        }
    finally:
        conn.close()
