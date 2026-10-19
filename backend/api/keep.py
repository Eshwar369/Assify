import json
from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from backend.database.db import get_db_connection

router = APIRouter(prefix="/keep", tags=["The Keep"])


class KeepItemCreate(BaseModel):
    category: str = Field(description="'food' | 'movie' | 'gift' | 'place' | 'dislike' | 'nickname' | 'inside_joke' | 'date_idea'")
    item_name: str
    context_quote: Optional[str] = None
    target_person: str = "contact"
    status: str = "saved"


class KeepItemUpdate(BaseModel):
    status: Optional[str] = None  # 'saved' | 'completed' | 'watched' | 'bought'
    item_name: Optional[str] = None


@router.get("/{contact_id}", response_model=List[Dict[str, Any]])
def get_keep_items(
    contact_id: str,
    category: Optional[str] = Query(None, description="Filter by category")
):
    """
    Returns items from The Keep for a contact, optionally filtered by category.
    """
    conn = get_db_connection()
    try:
        if category:
            rows = conn.execute(
                """
                SELECT id, contact_id, category, item_name, context_quote, time_stamp,
                       status, target_person, ai_generated, metadata, created_at
                FROM preferences_vault
                WHERE contact_id = ? AND category = ?
                ORDER BY ai_generated DESC, created_at DESC;
                """,
                (contact_id, category.lower())
            ).fetchall()
        else:
            rows = conn.execute(
                """
                SELECT id, contact_id, category, item_name, context_quote, time_stamp,
                       status, target_person, ai_generated, metadata, created_at
                FROM preferences_vault
                WHERE contact_id = ?
                ORDER BY category ASC, ai_generated DESC, created_at DESC;
                """,
                (contact_id,)
            ).fetchall()

        items = []
        for r in rows:
            d = dict(r)
            if d.get("metadata"):
                try:
                    d["metadata"] = json.loads(d["metadata"])
                except Exception:
                    pass
            items.append(d)
        return items
    finally:
        conn.close()


@router.post("/{contact_id}/item", response_model=Dict[str, Any])
def add_keep_item(contact_id: str, payload: KeepItemCreate):
    """
    Manually add a memory, taste, gift idea, or date idea to The Keep.
    """
    conn = get_db_connection()
    try:
        with conn:
            cursor = conn.execute(
                """
                INSERT INTO preferences_vault (
                    contact_id, category, item_name, context_quote, status, target_person, ai_generated
                ) VALUES (?, ?, ?, ?, ?, ?, 0);
                """,
                (contact_id, payload.category.lower(), payload.item_name, payload.context_quote, payload.status, payload.target_person)
            )
            item_id = cursor.lastrowid

        return {
            "status": "success",
            "item_id": item_id,
            "message": f"Added '{payload.item_name}' to The Keep ({payload.category})."
        }
    finally:
        conn.close()


@router.patch("/{contact_id}/item/{item_id}", response_model=Dict[str, Any])
def update_keep_item(contact_id: str, item_id: int, payload: KeepItemUpdate):
    """
    Update the status (e.g. mark as 'watched', 'bought', or 'completed').
    """
    conn = get_db_connection()
    try:
        with conn:
            if payload.status:
                conn.execute(
                    "UPDATE preferences_vault SET status = ? WHERE id = ? AND contact_id = ?",
                    (payload.status, item_id, contact_id)
                )
            if payload.item_name:
                conn.execute(
                    "UPDATE preferences_vault SET item_name = ? WHERE id = ? AND contact_id = ?",
                    (payload.item_name, item_id, contact_id)
                )

        return {"status": "success", "message": f"Item {item_id} updated."}
    finally:
        conn.close()


@router.delete("/{contact_id}/item/{item_id}", response_model=Dict[str, Any])
def delete_keep_item(contact_id: str, item_id: int):
    """
    Delete an item from The Keep.
    """
    conn = get_db_connection()
    try:
        with conn:
            conn.execute("DELETE FROM preferences_vault WHERE id = ? AND contact_id = ?", (item_id, contact_id))
        return {"status": "success", "message": f"Item {item_id} deleted."}
    finally:
        conn.close()
