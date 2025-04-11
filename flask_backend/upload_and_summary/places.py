import os
import requests
from utils import haversine_distance

ICON_MAP = {
    "restaurant": "red",
    "lodging": "green",
    "cafe": "red",
    "tourist_attraction": "purple",
    "hotel": "green",
    "bank": "blue",
    "atm": "blue"
}

TYPES = list(ICON_MAP.keys())

def find_nearby_places(lat, lng, radius=3000):
    api_key = os.getenv("GOOGLE_PLACES_API_KEY")
    base_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"

    results = []
    for place_type in TYPES:
        params = {
            "location": f"{lat},{lng}",
            "radius": radius,
            "type": place_type,
            "key": api_key
        }
        response = requests.get(base_url, params=params)
        data = response.json()

        for place in data.get("results", []):
            lat2 = place["geometry"]["location"]["lat"]
            lng2 = place["geometry"]["location"]["lng"]
            results.append({
                "name": place.get("name"),
                "type": place_type,
                "lat": lat2,
                "lng": lng2,
                "rating": place.get("rating"),
                "price_level": place.get("price_level"),
                "address": place.get("vicinity"),
                "distance_km": round(haversine_distance(lat, lng, lat2, lng2), 2),
                "route_url": (
                    f"https://www.google.com/maps/dir/?api=1"
                    f"&origin={lat},{lng}&destination={lat2},{lng2}&travelmode=transit"
                ),
                "marker_color": ICON_MAP.get(place_type, "gray")
            })
    return {
        "landmark_location": {"lat": lat, "lng": lng},
        "nearby_places": results
    } 