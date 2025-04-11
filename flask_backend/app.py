from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from dotenv import load_dotenv
import os
import shutil
from werkzeug.utils import secure_filename

# Load environment variables
load_dotenv()

# Import blueprints and modules
from auth.routes import auth_bp
from upload_and_summary.landmark_detection import (
    detect_landmark_google_vision,
    predict_landmark_custom_model
)
from upload_and_summary.summary_generator import get_openai_summary, generate_audio_summary
from upload_and_summary.places import find_nearby_places
from upload_and_summary.map_generator import generate_leaflet_map_from_api_output

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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
    
    @app.route('/detect_landmark/', methods=['POST'])
    def detect_landmark():
        if 'image' not in request.files:
            return jsonify({"error": "No image provided"}), 400
        
        image = request.files['image']
        filename = secure_filename(image.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        image.save(file_path)

        vision_result = detect_landmark_google_vision(file_path)
        if vision_result:
            return jsonify(vision_result)

        predicted, lat, lng = predict_landmark_custom_model(file_path)
        return jsonify({"name": predicted, "lat": lat, "lng": lng})

    @app.route('/generate_summary/', methods=['POST'])
    def generate_summary():
        landmark = request.form.get('landmark')
        language = request.form.get('language', 'en')
        
        if not landmark:
            return jsonify({"error": "Landmark name is required"}), 400
            
        summary = get_openai_summary(landmark, language)
        audio_path = f"{UPLOAD_FOLDER}/summary_{landmark}_{language}.mp3"
        audio_file = generate_audio_summary(summary, language, save_path=audio_path)
        return jsonify({"summary": summary, "audio_file": audio_path})

    @app.route('/download_audio/')
    def download_audio():
        path = request.args.get('path')
        if not path:
            return jsonify({"error": "Path is required"}), 400
        return send_file(path)

    @app.route('/nearby_places/')
    def nearby_places():
        lat = float(request.args.get('lat'))
        lng = float(request.args.get('lng'))
        results = find_nearby_places(lat, lng)
        return jsonify(results)

    @app.route('/generate_map/')
    def generate_map():
        lat = float(request.args.get('lat'))
        lng = float(request.args.get('lng'))
        results = find_nearby_places(lat, lng)
        map_ = generate_leaflet_map_from_api_output(results)
        map_path = f"{UPLOAD_FOLDER}/leaflet_map.html"
        map_.save(map_path)
        return send_file(map_path)
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)