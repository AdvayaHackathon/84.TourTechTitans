import os
import openai
from gtts import gTTS
from config import OPENAI_API_KEY

openai.api_key = OPENAI_API_KEY

# Generate summary via OpenAI Chat
def get_openai_summary(landmark, language='en'):
    spoken_language = {
        "en":"English",
        "hi":"Hindi",
        "kn":"Kannada",
        "ta":"Tamil",
        "te":"Telugu"
    }

    prompt = f"You are a multilingual tour guide. Write a short, informative, and engaging historical and cultural summary about the landmark called '{landmark}' in {spoken_language[language]}. Ensure the full summary fits within 750 words and is complete."
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a travel guide AI."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=750,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"OpenAI error: {e}"

# Generate TTS audio using gTTS
def generate_audio_summary(text, language="en", save_path="output_audio.mp3"):
    try:
        tts = gTTS(text=text, lang=language)
        tts.save(save_path)
        return save_path
    except Exception as e:
        return f"TTS generation error: {e}" 