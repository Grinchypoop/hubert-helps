import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def save_reading(week_number: int, filename: str, analysis: dict) -> int:
    data = {
        "week_number": week_number,
        "title": analysis.get("title", filename),
        "filename": filename,
        "author": analysis.get("author", ""),
        "thesis": analysis.get("thesis"),
        "key_terms": analysis.get("key_terms", []),
        "arguments": analysis.get("arguments", []),
        "historical_context": analysis.get("historical_context"),
        "historiography": analysis.get("historiography"),
        "significance": analysis.get("significance", "")
    }
    result = supabase.table("readings").insert(data).execute()
    return result.data[0]["id"]


def get_readings_by_week(week_number: int) -> list:
    result = supabase.table("readings").select("*").eq("week_number", week_number).order("created_at", desc=True).execute()
    return result.data


def get_all_readings() -> list:
    result = supabase.table("readings").select("*").order("week_number").order("created_at", desc=True).execute()
    return result.data


def get_reading_by_id(reading_id: int) -> dict | None:
    result = supabase.table("readings").select("*").eq("id", reading_id).execute()
    return result.data[0] if result.data else None


def delete_reading(reading_id: int) -> bool:
    result = supabase.table("readings").delete().eq("id", reading_id).execute()
    return len(result.data) > 0


def save_note(reading_id: int, argument_index: int, note_text: str) -> dict:
    data = {
        "reading_id": reading_id,
        "argument_index": argument_index,
        "note_text": note_text
    }
    # Try to update first, then insert if not exists
    existing = supabase.table("notes").select("id").eq("reading_id", reading_id).eq("argument_index", argument_index).execute()

    if existing.data:
        supabase.table("notes").update({"note_text": note_text}).eq("id", existing.data[0]["id"]).execute()
    else:
        supabase.table("notes").insert(data).execute()

    return {"reading_id": reading_id, "argument_index": argument_index, "note_text": note_text}


def get_notes_for_reading(reading_id: int) -> dict:
    result = supabase.table("notes").select("argument_index, note_text").eq("reading_id", reading_id).execute()
    return {row["argument_index"]: row["note_text"] for row in result.data}


def delete_note(reading_id: int, argument_index: int) -> bool:
    result = supabase.table("notes").delete().eq("reading_id", reading_id).eq("argument_index", argument_index).execute()
    return len(result.data) > 0
