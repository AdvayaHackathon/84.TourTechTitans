from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, Request, Response, Header
from fastapi.responses import JSONResponse, FileResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Dict, Any, List
import os
import json
import requests
import shutil
from datetime import datetime, timedelta
from functools import wraps
import uuid
import jwt
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from supabase import create_client, Client
from dotenv import load_dotenv

# Import backend modules
from upload_and_summary.landmark_detection import (
    detect_landmark_google_vision,
    predict_landmark_custom_model
)
from upload_and_summary.summary_generator import get_openai_summary, generate_audio_summary
from upload_and_summary.places import find_nearby_places
from upload_and_summary.map_generator import generate_custom_leaflet_map_from_api_output

# Load environment variables
load_dotenv()

# Supabase client setup
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

# Create FastAPI app
app = FastAPI(title="Tourism App API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv('FRONTEND_URL', '*')],  # Fallback to allow all if not set
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup upload folder
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# OAuth helper functions
def get_google_provider_cfg():
    return requests.get(os.getenv("GOOGLE_DISCOVERY_URL")).json()

def get_google_auth_url(request: Request):
    # Get Google provider configuration
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]
    
    # Create the request URL - Correctly build the base URL from request components
    base_url = f"{request.url.scheme}://{request.url.netloc}"
    redirect_uri = f"{base_url}/auth/login/callback"
    
    # Build authorization URL
    request_uri = f"{authorization_endpoint}?response_type=code&client_id={os.getenv('GOOGLE_CLIENT_ID')}&redirect_uri={redirect_uri}&scope=openid%20email%20profile"
    
    return request_uri

def process_google_callback(request: Request):
    # Get auth code from Google
    code = request.query_params.get("code")
    
    # Get token endpoint
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]
    
    # Prepare token request
    token_url = token_endpoint
    # Fix base URL construction
    base_url = f"{request.url.scheme}://{request.url.netloc}"
    redirect_uri = f"{base_url}/auth/login/callback"
    
    data = {
        'code': code,
        'client_id': os.getenv('GOOGLE_CLIENT_ID'),
        'client_secret': os.getenv('GOOGLE_CLIENT_SECRET'),
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code'
    }
    
    # Exchange auth code for tokens
    token_response = requests.post(token_url, data=data)
    token_json = token_response.json()
    
    if 'id_token' not in token_json:
        return None, None
    
    # Get user info
    id_info = id_token.verify_oauth2_token(
        token_json['id_token'],
        google_requests.Request(),
        os.getenv('GOOGLE_CLIENT_ID')
    )
    
    if id_info.get('email_verified'):
        # Extract user info
        user_info = {
            'google_id': id_info['sub'],
            'email': id_info['email'],
            'display_name': id_info.get('name', ''),
            'profile_picture_url': id_info.get('picture', '')
        }
        
        # Create or update user in database
        user = create_or_update_user(user_info)
        
        # Create JWT token for frontend
        token = create_auth_token(user)
        
        return user, token
    else:
        return None, None

def create_or_update_user(user_info):
    # Check if user exists by email
    response = supabase.table('users').select('*').eq('email', user_info['email']).execute()
    
    if len(response.data) > 0:
        # Update existing user
        user_id = response.data[0]['user_id']
        update_data = {
            'display_name': user_info['display_name'],
            'profile_picture_url': user_info['profile_picture_url'],
            'last_login': 'now()'
        }
        
        supabase.table('users').update(update_data).eq('user_id', user_id).execute()
        return response.data[0]
    else:
        # Create new user
        new_user = {
            'user_id': str(uuid.uuid4()),
            'email': user_info['email'],
            'display_name': user_info['display_name'],
            'profile_picture_url': user_info['profile_picture_url'],
            'created_at': 'now()',
            'last_login': 'now()'
        }
        
        response = supabase.table('users').insert(new_user).execute()
        return response.data[0]

def create_auth_token(user):
    payload = {
        'user_id': user['user_id'],
        'email': user['email'],
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    
    token = jwt.encode(payload, os.getenv('SECRET_KEY'), algorithm='HS256')
    return token

def verify_auth_token(token):
    try:
        payload = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
        return payload
    except:
        return None

# FastAPI Dependency for authentication
async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="Token is missing")
    
    token = authorization.split(' ')[1]
    data = verify_auth_token(token)
    
    if not data:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Get user from database
    response = supabase.table('users').select('*').eq('user_id', data['user_id']).execute()
    if len(response.data) == 0:
        raise HTTPException(status_code=401, detail="User not found")
    
    return response.data[0]

# Authentication routes
@app.get("/")
async def index():
    return {"message": "Tourism API is running"}

@app.get("/auth/login")
async def login(request: Request):
    """Redirect to Google OAuth login"""
    auth_url = get_google_auth_url(request)
    return RedirectResponse(auth_url)

@app.get("/auth/login/callback")
async def callback(request: Request):
    """Handle Google OAuth callback"""
    user, token = process_google_callback(request)
    
    if not user or not token:
        return RedirectResponse(f"{os.getenv('FRONTEND_URL')}/login?error=auth_failed")
    
    # Redirect to frontend with token
    return RedirectResponse(f"{os.getenv('FRONTEND_URL')}/auth/callback?token={token}")

@app.get("/auth/user")
async def get_user(current_user: Dict = Depends(get_current_user)):
    """Get current user info"""
    return current_user

@app.get("/auth/verify-token")
async def verify_token(current_user: Dict = Depends(get_current_user)):
    """Verify if token is valid"""
    return {'valid': True, 'user': current_user}

# Backend functionality routes
@app.post("/detect_landmark/")
async def detect_landmark(image: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_FOLDER, image.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    vision_result = detect_landmark_google_vision(file_path)
    if vision_result:
        return vision_result

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
    map_ = generate_custom_leaflet_map_from_api_output(results)
    map_path = f"{UPLOAD_FOLDER}/leaflet_map.html"
    map_.save(map_path)
    return FileResponse(map_path)

# Trips endpoints
@app.post("/trips")
async def create_trip(request: Request, current_user: Dict = Depends(get_current_user)):
    """Create a new trip for the user"""
    try:
        # Parse the request body
        try:
            body = await request.json()
        except Exception as e:
            print(f"Failed to parse request body: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Invalid request body: {str(e)}")
        
        # Validate required fields
        required_fields = ["lat", "lng", "description", "place_name"]
        missing_fields = [field for field in required_fields if field not in body]
        if missing_fields:
            raise HTTPException(status_code=400, detail=f"Missing required fields: {', '.join(missing_fields)}")
        
        # Create trip in database
        new_trip = {
            "trip_id": str(uuid.uuid4()),
            "user_id": current_user["user_id"],
            "lat": body["lat"],
            "lng": body["lng"],
            "description": body["description"],
            "place_name": body["place_name"],
            "start_date": body.get("start_date", datetime.now().isoformat()),
            "end_date": body.get("end_date"),
            "created_at": "now()"
        }
        
        # Explicitly log the data for debugging
        print(f"Creating trip with data: {new_trip}")
        
        try:
            response = supabase.table('trips').insert(new_trip).execute()
            if not response.data or len(response.data) == 0:
                print(f"Supabase error: {response}")
                raise HTTPException(status_code=500, detail="Failed to create trip in database")
        except Exception as db_error:
            print(f"Database error: {str(db_error)}")
            raise HTTPException(status_code=500, detail=f"Database error: {str(db_error)}")
            
        return response.data[0]
    except HTTPException:
        # Re-raise HTTP exceptions to preserve status codes
        raise
    except Exception as e:
        print(f"Error creating trip: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@app.get("/trips")
async def get_user_trips(current_user: Dict = Depends(get_current_user)):
    """Get all trips for the current user"""
    try:
        # Log user info for debugging
        print(f"Fetching trips for user: {current_user['user_id']}")
        
        response = supabase.table('trips').select('*').eq('user_id', current_user["user_id"]).order('created_at', desc=True).execute()
        print(f"Found {len(response.data)} trips")
        return response.data
    except Exception as e:
        print(f"Error fetching trips: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/trips/{trip_id}")
async def get_trip_details(trip_id: str, current_user: Dict = Depends(get_current_user)):
    """Get details of a specific trip"""
    try:
        # Verify the trip belongs to the user
        response = supabase.table('trips').select('*').eq('trip_id', trip_id).eq('user_id', current_user["user_id"]).execute()
        if len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Trip not found or does not belong to user")
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/trips/{trip_id}")
async def update_trip(trip_id: str, request: Request, current_user: Dict = Depends(get_current_user)):
    """Update a trip"""
    try:
        # Verify the trip belongs to the user
        trip_response = supabase.table('trips').select('*').eq('trip_id', trip_id).eq('user_id', current_user["user_id"]).execute()
        if len(trip_response.data) == 0:
            raise HTTPException(status_code=404, detail="Trip not found or does not belong to user")
        
        # Parse the request body
        body = await request.json()
        
        # Prepare update data
        update_data = {}
        allowed_fields = ["description", "start_date", "end_date", "place_name"]
        for field in allowed_fields:
            if field in body:
                update_data[field] = body[field]
                
        if not update_data:
            return trip_response.data[0]  # No updates to make
            
        # Add updated_at timestamp
        update_data["updated_at"] = "now()"
        
        # Update the trip
        response = supabase.table('trips').update(update_data).eq('trip_id', trip_id).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/trips/{trip_id}")
async def delete_trip(trip_id: str, current_user: Dict = Depends(get_current_user)):
    """Delete a trip"""
    try:
        # Verify the trip belongs to the user
        trip_response = supabase.table('trips').select('*').eq('trip_id', trip_id).eq('user_id', current_user["user_id"]).execute()
        if len(trip_response.data) == 0:
            raise HTTPException(status_code=404, detail="Trip not found or does not belong to user")
        
        # Delete the trip
        supabase.table('trips').delete().eq('trip_id', trip_id).execute()
        
        return {"message": "Trip deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/trips/{trip_id}/complete")
async def complete_trip(trip_id: str, current_user: Dict = Depends(get_current_user)):
    """Mark a trip as completed by moving it to journeys table"""
    try:
        # Verify the trip belongs to the user
        trip_response = supabase.table('trips').select('*').eq('trip_id', trip_id).eq('user_id', current_user["user_id"]).execute()
        if len(trip_response.data) == 0:
            raise HTTPException(status_code=404, detail="Trip not found or does not belong to user")
        
        trip_data = trip_response.data[0]
        
        # Create a new journey record
        journey_data = {
            "journey_id": str(uuid.uuid4()),
            "user_id": current_user["user_id"],
            "lat": trip_data["lat"],
            "lng": trip_data["lng"],
            "description": trip_data["description"],
            "place_name": trip_data["place_name"],
            "start_date": trip_data["start_date"],
            "end_date": trip_data["end_date"],
            "created_at": "now()"
        }
        
        # Insert into journeys table
        journey_response = supabase.table('journeys').insert(journey_data).execute()
        if not journey_response.data or len(journey_response.data) == 0:
            raise HTTPException(status_code=500, detail="Failed to create journey record")
            
        # Delete the trip from trips table
        supabase.table('trips').delete().eq('trip_id', trip_id).execute()
        
        return {"message": "Trip marked as completed and moved to journeys", "journey_id": journey_data["journey_id"]}
    except Exception as e:
        print(f"Error completing trip: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/journeys/history")
async def get_journey_history(current_user: Dict = Depends(get_current_user)):
    """Get all completed journeys for the current user"""
    try:
        # Log user info for debugging
        print(f"Fetching journey history for user: {current_user['user_id']}")
        
        response = supabase.table('journeys').select('*').eq('user_id', current_user["user_id"]).order('created_at', desc=True).execute()
        print(f"Found {len(response.data)} journeys")
        return response.data
    except Exception as e:
        print(f"Error fetching journey history: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Run the application  
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True) 