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

    print("\nRAW OCR OUTPUT:")
    for line in ocrtext:
        print(line)

    menu_text = "\n".join(ocrtext)

    prompt = ChatPromptTemplate.from_messages([
        ("system",
        """
        You are an expert restaurant menu parser.

        Your job:
        1. Extract dishes exactly as they appear.
        2. NEVER invent dishes or prices.
        3. If a dish description exists in text → keep it.
        4. If a description does NOT exist → generate a short, realistic
           AI-based suggestion and store it separately.

        Output strict JSON only.
        """),

        ("human",
        """
        Extract all dishes from the menu below.

        Rules:
        - Return ONLY valid JSON
        - Group dishes by category if present
        - Each dish must have:
            - name (string)
            - price (number or null)
            - description (string or null)
            - ai_suggested_description (string or null)
        - If description exists → ai_suggested_description MUST be null
        - Do NOT hallucinate dishes or prices

        MENU TEXT:
        {menu_text}
        """)
    ])

    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=API_KEY,
        temperature=0.2  
    )

    messages = prompt.format_messages(menu_text=menu_text)

    response = llm.invoke(messages)
    return response.content
