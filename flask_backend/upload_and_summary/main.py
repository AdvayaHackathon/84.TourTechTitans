from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil

from landmark_detection import predict_landmark_custom_model
from summary_generator import get_openai_summary, generate_audio_summary
from places import find_nearby_places
from map_generator import generate_custom_leaflet_map_from_api_output
from ask import router as ask_router

app = FastAPI()

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with ["http://localhost:3000"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ask_router)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.post("/detect_landmark/")
async def detect_landmark(image: UploadFile):
    file_path = os.path.join(UPLOAD_FOLDER, image.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    predicted, lat, lng = predict_landmark_custom_model(file_path)
    return {"name": predicted, "lat": lat, "lng": lng}

@app.post("/generate_summary/")
async def generate_summary(landmark: str = Form(...), language: str = Form("en")):
    summary = get_openai_summary(landmark, language)
    audio_path = f"{UPLOAD_FOLDER}/summary_{landmark}_{language}.mp3"
    audio_file = generate_audio_summary(summary, language, save_path=audio_path)
    return {"summary": summary, "audio_file": audio_path}

@app.get("/download_audio/")
async def download_audio(path: str):
    return FileResponse(path)

@app.get("/nearby_places/")
async def nearby_places(lat: float, lng: float):
    results = find_nearby_places(lat, lng)
    return results

@app.get("/generate_map/")
async def generate_map(lat: float, lng: float):
    results = find_nearby_places(lat, lng)
    map_ = generate_leaflet_map_from_api_output(results)
    map_path = f"{UPLOAD_FOLDER}/leaflet_map.html"
    map_.save(map_path)
    return FileResponse(map_path) 
