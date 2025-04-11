import os
import json
import requests
from flask import current_app, request, redirect, url_for
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import jwt
from datetime import datetime, timedelta
from functools import wraps

# Supabase client setup
from supabase import create_client, Client

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

def get_google_provider_cfg():
    return requests.get(os.getenv("GOOGLE_DISCOVERY_URL")).json()

def get_google_auth_url():
    # Get Google provider configuration
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]
    
    # Create the request URL
    redirect_uri = f"{request.base_url}/callback"
    
    # Build authorization URL
    request_uri = f"{authorization_endpoint}?response_type=code&client_id={os.getenv('GOOGLE_CLIENT_ID')}&redirect_uri={redirect_uri}&scope=openid%20email%20profile"
    
    return request_uri

def process_google_callback():
    # Get auth code from Google
    code = request.args.get("code")
    
    # Get token endpoint
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]
    
    # Prepare token request
    token_url = token_endpoint
    data = {
        'code': code,
        'client_id': os.getenv('GOOGLE_CLIENT_ID'),
        'client_secret': os.getenv('GOOGLE_CLIENT_SECRET'),
        'redirect_uri': f"{request.base_url.split('?')[0]}",
        'grant_type': 'authorization_code'
    }
    
    # Exchange auth code for tokens
    token_response = requests.post(token_url, data=data)
    token_json = token_response.json()
    
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
    import uuid
    
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

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check for token in Authorization header
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        
        if not token:
            return {'message': 'Token is missing'}, 401
        
        # Verify token
        data = verify_auth_token(token)
        if not data:
            return {'message': 'Invalid token'}, 401
        
        # Get user from database
        response = supabase.table('users').select('*').eq('user_id', data['user_id']).execute()
        if len(response.data) == 0:
            return {'message': 'User not found'}, 401
        
        current_user = response.data[0]
        
        return f(current_user, *args, **kwargs)
    
    return decorated