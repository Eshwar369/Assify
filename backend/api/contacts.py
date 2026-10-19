from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from backend.database.db import get_db_connection

router = APIRouter(prefix="/contacts", tags=["Contacts"])


@router.get("", response_model=List[Dict[str, Any]])
def list_contacts():
    """
    Returns all analyzed contacts with their Delulu Score, Status Label,
    total messages, and Keep items count.
    """
    conn = get_db_connection()
    try:
        query = """
        SELECT 
            c.id,
            c.display_name,
            c.raw_name,
            c.user_name,
            c.created_at,
            rp.delulu_score,
            rp.status_label,
            rp.power_ratio_user,
            rp.power_ratio_contact,
            rp.overall_diagnosis,
            cs.total_messages,
            cs.user_initiation_pct,
            cs.contact_initiation_pct,
            cs.late_night_pct,
            (SELECT COUNT(*) FROM preferences_vault pv WHERE pv.contact_id = c.id) as keep_items_count
        FROM contacts c
        LEFT JOIN relationship_profiles rp ON rp.contact_id = c.id
        LEFT JOIN chronemics_stats cs ON cs.contact_id = c.id
        ORDER BY c.created_at DESC;
        """
        rows = conn.execute(query).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


@router.get("/{contact_id}", response_model=Dict[str, Any])
def get_contact(contact_id: str):
    """
    Returns details for a specific contact.
    """
    conn = get_db_connection()
    try:
        row = conn.execute("SELECT * FROM contacts WHERE id = ?", (contact_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail=f"Contact '{contact_id}' not found.")
        return dict(row)
    finally:
        conn.close()
