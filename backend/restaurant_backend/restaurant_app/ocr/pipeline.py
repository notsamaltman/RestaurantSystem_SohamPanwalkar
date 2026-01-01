import easyocr, os
from dotenv import load_dotenv
from typing import Callable, Optional
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

API_KEY = os.getenv("API_KEY")

def pipeline( path: str, ) -> str:
    reader = easyocr.Reader(['en'], gpu=False)
    ocrtext = reader.readtext(path, detail=0, paragraph=True)

    menu_text = "\n".join(ocrtext)

    prompt = ChatPromptTemplate.from_messages([
    (
            "system",
            """
    You are an expert restaurant menu parser.

    CRITICAL RULES (must follow exactly):
    - You MUST output JSON in the EXACT schema described below.
    - Do NOT add, remove, or rename any keys.
    - Do NOT include explanations, comments, or extra text.
    - Do NOT wrap JSON in markdown.
    - If extraction fails, still return valid JSON with empty arrays (never null).

    TARGET OUTPUT SCHEMA (EXACT):
    {{
    "menu": [
        {{
        "category": string,
        "dishes": [
            {{
            "name": string,
            "price": number | null,
            "description": string | null,
            "ai_suggested_description": string | null
            }}
        ]
        }}
    ]
    }}
            """
        ),
        (
            "human",
            """
    TASK:
    Extract all dishes from the menu text below and return them in the EXACT schema.

    STRICT INSTRUCTIONS:
    1. Every dish MUST belong to a category.
    - If the category is not explicitly stated, infer the most reasonable category name.
    2. NEVER invent dishes or prices.
    3. Prices must be numbers only (no currency symbols).
    4. If a dish description exists in the text:
    - Set "description" to that value
    - Set "ai_suggested_description" to null
    5. If a dish description does NOT exist:
    - Set "description" to null
    - Generate a short, realistic AI description and store it in "ai_suggested_description"
    6. NEVER put generated text into "description".
    7. NEVER return null for "menu" or "dishes" — use empty arrays instead.
    8. Return ONLY valid JSON. No markdown. No commentary.

    MENU TEXT:
    {menu_text}
            """
        )
    ])


    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=API_KEY,
        temperature=0.2  
    )

    messages = prompt.format_messages(menu_text=menu_text)

    response = llm.invoke(messages)
    return response.content
