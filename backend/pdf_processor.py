import pdfplumber
from io import BytesIO


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extract text content from a PDF file."""
    text_parts = []

    with pdfplumber.open(BytesIO(pdf_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)

    full_text = "\n\n".join(text_parts)

    # Limit text length to avoid token limits (roughly 100k chars ~ 25k tokens)
    max_chars = 100000
    if len(full_text) > max_chars:
        full_text = full_text[:max_chars] + "\n\n[Text truncated due to length...]"

    return full_text
