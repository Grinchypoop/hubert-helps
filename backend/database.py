import sqlite3
import json
from datetime import datetime
from pathlib import Path

DB_PATH = Path(__file__).parent / "readings.db"


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS readings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            week_number INTEGER NOT NULL,
            title TEXT NOT NULL,
            filename TEXT NOT NULL,
            author TEXT,
            thesis TEXT,
            key_terms TEXT,
            arguments TEXT,
            historical_context TEXT,
            historiography TEXT,
            significance TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            reading_id INTEGER NOT NULL,
            argument_index INTEGER NOT NULL,
            note_text TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (reading_id) REFERENCES readings(id) ON DELETE CASCADE,
            UNIQUE(reading_id, argument_index)
        )
    """)
    conn.commit()
    conn.close()


def save_reading(week_number: int, filename: str, analysis: dict) -> int:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO readings (
            week_number, title, filename, author, thesis,
            key_terms, arguments, historical_context, historiography, significance
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        week_number,
        analysis.get("title", filename),
        filename,
        analysis.get("author", ""),
        analysis.get("thesis"),
        json.dumps(analysis.get("key_terms", [])),
        json.dumps(analysis.get("arguments", [])),
        analysis.get("historical_context"),
        analysis.get("historiography"),
        analysis.get("significance", "")
    ))
    conn.commit()
    reading_id = cursor.lastrowid
    conn.close()
    return reading_id


def get_readings_by_week(week_number: int) -> list:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM readings WHERE week_number = ? ORDER BY created_at DESC",
        (week_number,)
    )
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


def get_all_readings() -> list:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM readings ORDER BY week_number, created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


def get_reading_by_id(reading_id: int) -> dict | None:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM readings WHERE id = ?", (reading_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None


def delete_reading(reading_id: int) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM readings WHERE id = ?", (reading_id,))
    conn.commit()
    deleted = cursor.rowcount > 0
    conn.close()
    return deleted


def save_note(reading_id: int, argument_index: int, note_text: str) -> dict:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO notes (reading_id, argument_index, note_text)
        VALUES (?, ?, ?)
        ON CONFLICT(reading_id, argument_index) DO UPDATE SET
            note_text = excluded.note_text,
            updated_at = CURRENT_TIMESTAMP
    """, (reading_id, argument_index, note_text))
    conn.commit()
    conn.close()
    return {"reading_id": reading_id, "argument_index": argument_index, "note_text": note_text}


def get_notes_for_reading(reading_id: int) -> dict:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT argument_index, note_text FROM notes WHERE reading_id = ?",
        (reading_id,)
    )
    rows = cursor.fetchall()
    conn.close()
    return {row["argument_index"]: row["note_text"] for row in rows}


def delete_note(reading_id: int, argument_index: int) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM notes WHERE reading_id = ? AND argument_index = ?",
        (reading_id, argument_index)
    )
    conn.commit()
    deleted = cursor.rowcount > 0
    conn.close()
    return deleted


# Initialize database on module import
init_db()
