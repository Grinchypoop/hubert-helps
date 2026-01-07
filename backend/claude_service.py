import os
import json
from pathlib import Path
from dotenv import load_dotenv
from anthropic import Anthropic

# Load .env file from backend directory
load_dotenv(Path(__file__).parent / ".env")

client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

ANALYSIS_PROMPT = """You are an expert academic assistant helping history students understand their readings.

Analyze the following academic text and provide a structured breakdown. Return your analysis as valid JSON with this exact structure:

{
  "title": "The title of the work (extract from text or infer from content)",
  "thesis": "The main argument or central claim of the text in 2-3 sentences",
  "arguments": [
    {
      "argument": "First key supporting argument",
      "evidence": [
        {"text": "Specific evidence supporting this argument", "page": "p. 12"},
        {"text": "Another piece of evidence", "page": "pp. 15-16"}
      ]
    },
    {
      "argument": "Second key supporting argument",
      "evidence": [
        {"text": "Evidence for this argument", "page": "p. 23"}
      ]
    }
  ],
  "historical_context": "The historical period, events, and context that the text addresses (2-3 sentences)",
  "historiography": "The historiographical school of thought or approach the author takes (e.g., social history, Marxist, revisionist, cultural history, etc.) and how it relates to other scholarship in the field"
}

Guidelines:
- Be concise but comprehensive
- Focus on what would help a student understand and remember the key points
- Identify 3-5 main arguments that support the thesis
- For each argument, find 1-3 specific pieces of evidence from the text
- IMPORTANT: Include page numbers for each piece of evidence (look for page markers like "p.", "pg", page breaks, or numbered sections in the text)
- If page numbers aren't clear, use approximate locations like "early in text", "middle section", "conclusion"
- If the text doesn't clearly fit academic history writing, do your best to extract the main ideas

TEXT TO ANALYZE:
"""


def analyze_reading(text: str) -> dict:
    """Send text to Claude for analysis and return structured breakdown."""
    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2000,
        messages=[
            {
                "role": "user",
                "content": ANALYSIS_PROMPT + text
            }
        ]
    )

    response_text = message.content[0].text

    # Extract JSON from response (handle potential markdown code blocks)
    if "```json" in response_text:
        response_text = response_text.split("```json")[1].split("```")[0]
    elif "```" in response_text:
        response_text = response_text.split("```")[1].split("```")[0]

    try:
        analysis = json.loads(response_text.strip())
    except json.JSONDecodeError:
        # Fallback if JSON parsing fails
        analysis = {
            "title": "Unable to parse",
            "thesis": response_text[:500],
            "supporting_arguments": [],
            "evidence": [],
            "historical_context": "",
            "historiography": ""
        }

    return analysis
