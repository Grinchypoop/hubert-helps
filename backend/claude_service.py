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
  "supporting_arguments": [
    "First key supporting argument",
    "Second key supporting argument",
    "Third key supporting argument"
  ],
  "evidence": [
    "Key piece of evidence or source cited",
    "Another important piece of evidence",
    "Additional evidence supporting the thesis"
  ],
  "historical_context": "The historical period, events, and context that the text addresses (2-3 sentences)",
  "historiography": "The historiographical school of thought or approach the author takes (e.g., social history, Marxist, revisionist, cultural history, etc.) and how it relates to other scholarship in the field"
}

Guidelines:
- Be concise but comprehensive
- Focus on what would help a student understand and remember the key points
- For supporting_arguments, identify 3-5 main points that support the thesis
- For evidence, note specific sources, examples, or data the author uses
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
