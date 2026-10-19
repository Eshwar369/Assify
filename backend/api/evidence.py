from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, List, Optional
from backend.database.db import get_db_connection

router = APIRouter(tags=["Evidence & Greatest Hits"])


@router.get("/evidence/{contact_id}", response_model=List[Dict[str, Any]])
def get_evidence_locker(
    contact_id: str,
    flag_type: Optional[str] = Query(None, description="'red_flag' | 'green_flag'")
):
    """
    Returns receipts and quoted evidence from the Evidence Locker.
    """
    conn = get_db_connection()
    try:
        if flag_type:
            rows = conn.execute(
                """
                SELECT id, contact_id, flag_type, severity, category, quote, sender, time_stamp, ai_commentary
                FROM evidence_locker
                WHERE contact_id = ? AND flag_type = ?
                ORDER BY severity DESC;
                """,
                (contact_id, flag_type)
            ).fetchall()
        else:
            rows = conn.execute(
                """
                SELECT id, contact_id, flag_type, severity, category, quote, sender, time_stamp, ai_commentary
                FROM evidence_locker
                WHERE contact_id = ?
                ORDER BY severity DESC;
                """,
                (contact_id,)
            ).fetchall()

        return [dict(r) for r in rows]
    finally:
        conn.close()


@router.get("/greatest-hits/{contact_id}", response_model=List[Dict[str, Any]])
def get_greatest_hits(contact_id: str):
    """
    Returns iconic cringe, delusional, and comeback quotes for Act 15.
    """
    conn = get_db_connection()
    try:
        rows = conn.execute(
            """
            SELECT id, contact_id, category, quote, sender, time_stamp, why_legendary
            FROM greatest_hits
            WHERE contact_id = ?
            ORDER BY id ASC;
            """,
            (contact_id,)
        ).fetchall()

        return [dict(r) for r in rows]
    finally:
        conn.close()
