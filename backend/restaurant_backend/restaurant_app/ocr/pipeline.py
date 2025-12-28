import easyocr, os
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

API_KEY = os.getenv("API_KEY")

# OCR
reader = easyocr.Reader(['en'], gpu=False)
ocrtext = reader.readtext("menu.jpg", detail=0, paragraph=True)

print("RAW OCR OUTPUT:")
for line in ocrtext:
    print(line)

menu_text = "\n".join(ocrtext)

# Prompt
prompt = ChatPromptTemplate.from_messages([
    ("system",
     "You are an expert restaurant menu parser. "
     "Extract structured menu information from OCR text."),
    
    ("human",
     """
Extract all dishes from the menu below.

Rules:
- Return ONLY valid JSON
- Group dishes by category if present
- Each dish must have: name, price (number or null), description (if available)
- Do NOT hallucinate items

MENU TEXT:
{menu_text}
""")
])

# Gemini LLM (STABLE)
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=API_KEY,
    temperature=0
)

messages = prompt.format_messages(menu_text=menu_text)
response = llm.invoke(messages)

print("\nSTRUCTURED OUTPUT:")
print(response.content)
