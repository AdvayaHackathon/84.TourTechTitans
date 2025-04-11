import os
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from torchvision import datasets
from torchvision.models import resnet50
from PIL import Image
from google.cloud import vision
from PIL.ExifTags import TAGS, GPSTAGS
from typing import Optional, Tuple

# Vision API detection
def detect_landmark_google_vision(image_path: str) -> Optional[Tuple[str, Tuple[float, float]]]:
    try:
        client = vision.ImageAnnotatorClient()
        with open(image_path, "rb") as img_file:
            content = img_file.read()
        image = vision.Image(content=content)

        response = client.landmark_detection(image=image)
        landmarks = response.landmark_annotations

        if landmarks:
            landmark = landmarks[0]
            name = landmark.description
            lat_lng = (landmark.locations[0].lat_lng.latitude,
                       landmark.locations[0].lat_lng.longitude)
            return name, lat_lng
    except Exception as e:
        print("Vision API error:", e)
    return None

# CNN fallback prediction
class SimpleCNN(nn.Module):
    def __init__(self, n_classes):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
            nn.Conv2d(64, 128, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128 * 28 * 28, 512),
            nn.ReLU(),
            nn.Dropout(0.5),                  
            nn.Linear(512, 256),              
            nn.ReLU(),
            nn.Dropout(0.3),                  
            nn.Linear(256, 24)         
        )

    def forward(self, x):
        x = self.features(x)
        return self.classifier(x)

# CNN inference
def predict_landmark_custom_model(image_path, model_path="final_detector.pt", class_dir="Tourist-thang/dataset/images/train"):
    CLASS_NAMES = sorted(os.listdir(class_dir))
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    class_mapping = {
        "Ajanta Caves":("Ajanta Caves", 20.5513, 75.7069),
        "alai_darwaza":("Alai Darwaza", 28.5242, 77.1857),
        "alai_minar":("Alai Minar", 28.5258, 77.1853),
        "basilica_of_bom_jesus":("Basilica Of Bom Jesus", 15.5008, 73.9115),
        "Charar-E- Sharif":("Charar-i-Sharief", 33.8629, 74.7663),
        "charminar":("Charminar", 17.3616, 78.4747),
        "Chhota_Imambara":("Chota Imambada", 26.8745, 80.9045),
        "Ellora Caves":("Ellora Caves", 20.0268, 75.1771),
        "Fatehpur Sikri":("Fatehpur Sikri", 27.0945, 77.6679),
        "Gateway of India":("Gateway of India", 18.9220, 72.8347),
        "golden temple":("Golden Temple", 31.6200, 74.8765),
        "hawa mahal pics":("Hawa Mahal", 26.9240, 75.8267),
        "Humayun_s Tomb":("Humayun's Tomb", 28.5933, 77.2507),
        "India gate pics":("India Gate", 28.6129, 77.2295),
        "iron_pillar":("Iron Pillar", 28.5247, 77.1850),
        "jamali_kamali_tomb":("Jamali Kamali Mosque and Tomb", 28.5196, 77.1871),
        "Khajuraho":("Khajuraho", 24.8318, 79.9199),
        "lotus_temple":("Lotus Temple", 28.5535, 77.2588),
        "mysore_palace":("Mysore Palace", 12.3052, 76.6552),
        "qutub_minar":("Qutub Minar", 28.5245, 77.1855),
        "Sun Temple Konark":("Sun Temple Konark", 19.8876, 86.0945),
        "tajmahal":("Taj Mahal", 27.1751, 78.0421),
        "tanjavur temple":("Brihadisvara Temple", 11.2062, 79.4488),
        "victoria memorial":("Victoria Memorial", 22.5448, 88.3426)
    }

    model = SimpleCNN(len(CLASS_NAMES)).to(device)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()

    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406],
                             [0.229, 0.224, 0.225])
    ])

    image = Image.open(image_path).convert("RGB")
    image_tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(image_tensor)
        pred_idx = torch.argmax(output, dim=1).item()
        predicted_class = class_mapping[CLASS_NAMES[pred_idx]]
        
    return predicted_class 