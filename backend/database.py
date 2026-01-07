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
            thesis TEXT,
            arguments TEXT,
            historical_context TEXT,
            historiography TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


def save_reading(week_number: int, filename: str, analysis: dict) -> int:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO readings (
            week_number, title, filename, thesis,
            arguments, historical_context, historiography
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        week_number,
        analysis.get("title", filename),
        filename,
        analysis.get("thesis"),
        json.dumps(analysis.get("arguments", [])),
        analysis.get("historical_context"),
        analysis.get("historiography")
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


# Initialize database on module import
init_db()
