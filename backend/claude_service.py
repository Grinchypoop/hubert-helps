import os
import json
from pathlib import Path
from dotenv import load_dotenv
from anthropic import Anthropic

# Load .env file from backend directory
load_dotenv(Path(__file__).parent / ".env")

client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

ANALYSIS_PROMPT = """You are an expert academic tutor helping undergraduate students deeply understand their readings. Your goal is to break down complex academic texts into clear, detailed, and memorable components.

Analyze the following academic text and provide a COMPREHENSIVE structured breakdown. Return your analysis as valid JSON with this exact structure:

{
  "title": "The title of the work (extract from text or infer from content)",
  "author": "Author name if mentioned",
  "thesis": "A detailed explanation of the main argument (4-6 sentences). Start with the core claim, then explain what the author is really arguing and why it matters. Write this as if explaining to a fellow student.",
  "key_terms": [
    {"term": "Important concept or term", "definition": "Clear definition in simple language with context from the reading"},
    {"term": "Another key term", "definition": "Its meaning and significance in this text"}
  ],
  "arguments": [
    {
      "argument": "First major supporting argument - state it clearly and explain what the author means (2-3 sentences)",
      "evidence": [
        {"text": "Direct quote or specific evidence from the text that supports this argument", "page": "p. 12", "explanation": "Brief explanation of why this evidence matters and how it supports the argument"},
        {"text": "Another piece of evidence - be specific", "page": "pp. 15-16", "explanation": "How this connects to the argument"}
      ]
    },
    {
      "argument": "Second major supporting argument with clear explanation",
      "evidence": [
        {"text": "Specific evidence", "page": "p. 23", "explanation": "Why this is significant"}
      ]
    }
  ],
  "historical_context": "Detailed background (4-6 sentences): What time period does this cover? What major events, social conditions, or political situations are relevant? What was happening in the world that makes this topic important? Help the student situate this reading in history.",
  "historiography": "Detailed analysis (4-6 sentences): What school of thought does the author belong to (social history, cultural history, Marxist, revisionist, postcolonial, gender history, etc.)? How does this work fit into broader academic debates? Does the author challenge or support previous scholarship? Who are they in conversation with?",
  "significance": "Why does this matter? (2-3 sentences): What is the 'so what?' of this reading? Why should students care about this argument? How does it change our understanding of the topic?"
}

IMPORTANT GUIDELINES:
- Write as if you're a knowledgeable peer explaining this to a fellow undergraduate
- Be DETAILED - undergraduate students need thorough explanations, not brief summaries
- Identify 5-7 main arguments that build the author's case
- For each argument, find 2-4 pieces of specific evidence with direct quotes when possible
- Always explain WHY evidence matters, don't just list it
- Include 4-6 key terms that students need to understand
- For page numbers: look for "p.", "pg", page breaks, or section numbers. If unclear, use "early section", "middle of text", "conclusion", etc.
- Make historical context rich - students need to understand the world the author is describing
- Be specific about historiography - name approaches and explain what they mean
- The significance section should help students see the bigger picture

Remember: Students will use this breakdown to study for exams and write essays. Make it useful!

TEXT TO ANALYZE:
"""


def analyze_reading(text: str) -> dict:
    """Send text to Claude for analysis and return structured breakdown."""
    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4000,
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
