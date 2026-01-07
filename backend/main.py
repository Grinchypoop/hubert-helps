from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import json

from database import save_reading, get_readings_by_week, get_all_readings, get_reading_by_id, delete_reading
from pdf_processor import extract_text_from_pdf
from claude_service import analyze_reading

app = FastAPI(title="History Reading Analyzer")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok", "message": "History Reading Analyzer API"}


@app.post("/api/upload")
async def upload_reading(
    file: UploadFile = File(...),
    week: int = Query(..., ge=1, le=13, description="Week number (1-13)")
):
    """Upload a PDF reading, analyze it with Claude, and save to database."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    # Read PDF content
    pdf_bytes = await file.read()

    # Extract text from PDF
    try:
        text = extract_text_from_pdf(pdf_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract text from PDF: {str(e)}")

    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract any text from the PDF")

    # Analyze with Claude
    try:
        analysis = analyze_reading(text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze reading: {str(e)}")

    # Save to database
    reading_id = save_reading(week, file.filename, analysis)

    return {
        "id": reading_id,
        "week": week,
        "filename": file.filename,
        "analysis": analysis
    }


@app.get("/api/readings")
def list_readings(week: int = Query(None, ge=1, le=13)):
    """Get all readings, optionally filtered by week."""
    if week:
        readings = get_readings_by_week(week)
    else:
        readings = get_all_readings()

    # Parse JSON fields
    for reading in readings:
        reading["arguments"] = json.loads(reading["arguments"] or "[]")

    return {"readings": readings}


@app.get("/api/readings/{reading_id}")
def get_reading(reading_id: int):
    """Get a specific reading by ID."""
    reading = get_reading_by_id(reading_id)
    if not reading:
        raise HTTPException(status_code=404, detail="Reading not found")

    reading["arguments"] = json.loads(reading["arguments"] or "[]")

    return reading


@app.delete("/api/readings/{reading_id}")
def remove_reading(reading_id: int):
    """Delete a reading by ID."""
    if not delete_reading(reading_id):
        raise HTTPException(status_code=404, detail="Reading not found")
    return {"status": "deleted", "id": reading_id}
