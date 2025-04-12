from fastapi import APIRouter
from pydantic import BaseModel
from openai import OpenAI
from gtts import gTTS
import os
import uuid
from config import OPENAI_API_KEY

# Setup
router = APIRouter()
openai = OpenAI(api_key=OPENAI_API_KEY)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# 🔁 Temporary memory (in-memory chat history)
chat_log = []

# Request schema
class AskRequest(BaseModel):
    prompt: str
    language: str  # e.g. 'en', 'hi', 'kn'

@router.post("/api/ask")
async def ask(request: AskRequest):
    prompt = request.prompt
    language = request.language

    try:
        # 🧠 Build context-aware conversation history
        messages = [{"role": "system", "content": "You are a helpful multilingual tour guide."}]

        # Add current user input
        if chat_log != []:
            messages.append({"role": "user", "content": f"{prompt} Use the following for context: Previous prompt={chat_log[0]["prompt"]} Your response to the previous prompt={chat_log[0]["response"]} in language={chat_log[0]["language"]}"})
        else:
            messages.append({"role": "user", "content": f"{prompt}, answer this in {language} language"})

        # 🎯 Call OpenAI with full context
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=500,
            temperature=0.7
        )
        text = response.choices[0].message.content.strip()

        # 🔊 Generate TTS audio using gTTS
        filename = f"{uuid.uuid4().hex}_{language}.mp3"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        tts = gTTS(text=text, lang=language)
        tts.save(filepath)

        # 📝 Store in memory
        chat_log.append({
            "prompt": prompt,
            "response": text,
            "language": language
        })

        return {
            "text": text,
            "audio_url": f"/download_audio/?path={filepath}"
        }

    except Exception as e:
        return {
            "text": f"Error: {str(e)}",
            "audio_url": None
        }

# 🧪 Optional: View in-memory history
@router.get("/api/history")
async def get_memory_history():
    return chat_log
