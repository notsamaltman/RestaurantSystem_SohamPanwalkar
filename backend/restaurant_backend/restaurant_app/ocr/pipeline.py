import easyocr, os
from dotenv import load_dotenv
from typing import Callable, Optional
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

API_KEY = os.getenv("API_KEY")

def pipeline(
    path: str,
    progress: Optional[Callable[[int, str], None]] = None
) -> str:

    def report(pct: int, msg: str):
        if progress:
            progress(pct, msg)
        else:
            print(f"[{pct}%] {msg}")

    # ---- STEP 1: OCR ----
    report(10, "Initializing OCR engine")
    reader = easyocr.Reader(['en'], gpu=False)

    report(20, "Reading image and extracting text")
    ocrtext = reader.readtext(path, detail=0, paragraph=True)

    report(30, "OCR completed")

    print("\nRAW OCR OUTPUT:")
    for line in ocrtext:
        print(line)

    menu_text = "\n".join(ocrtext)

    # ---- STEP 2: Prompt ----
    report(40, "Preparing AI prompt")

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

    # ---- STEP 3: LLM ----
    report(50, "Sending menu text to LLM")

    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=API_KEY,
        temperature=0.2  # slight creativity ONLY for suggestions
    )

    messages = prompt.format_messages(menu_text=menu_text)

    response = llm.invoke(messages)

    report(90, "LLM response received")
    report(100, "Pipeline completed")

    return response.content
