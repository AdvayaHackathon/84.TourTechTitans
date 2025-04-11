from flask import Blueprint, redirect, jsonify, request
import os
from .oauth import get_google_auth_url, process_google_callback, token_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login')
def login():
    """Redirect to Google OAuth login"""
    auth_url = get_google_auth_url()
    return redirect(auth_url)

@auth_bp.route('/login/callback')
def callback():
    """Handle Google OAuth callback"""
    user, token = process_google_callback()
    
    if not user or not token:
        return redirect(f"{os.getenv('FRONTEND_URL')}/login?error=auth_failed")
    
    # Redirect to frontend with token
    return redirect(f"{os.getenv('FRONTEND_URL')}/auth/callback?token={token}")

@auth_bp.route('/user')
@token_required
def get_user(current_user):
    """Get current user info"""
    return jsonify(current_user)

@auth_bp.route('/verify-token')
@token_required
def verify_token(current_user):
    """Verify if token is valid"""
    return jsonify({'valid': True, 'user': current_user})