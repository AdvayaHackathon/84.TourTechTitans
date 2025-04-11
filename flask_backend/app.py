from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Import blueprints
from auth.routes import auth_bp

def create_app():
    app = Flask(__name__)
    app.secret_key = os.getenv('SECRET_KEY')
    
    # Enable CORS for Next.js frontend
    CORS(app, resources={r"/*": {"origins": os.getenv('FRONTEND_URL')}}, supports_credentials=True)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    
    @app.route('/')
    def index():
        return jsonify({"message": "Tourism API is running"})
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)