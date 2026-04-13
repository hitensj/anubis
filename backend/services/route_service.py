import requests
import json
from config import OPENROUTESERVICE_API_KEY

def get_route(origin_coords, dest_coords):
    if not OPENROUTESERVICE_API_KEY or not origin_coords or not dest_coords:
        return None
        
    url = "https://api.openrouteservice.org/v2/directions/driving-car"
    headers = {
        'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
        'Authorization': OPENROUTESERVICE_API_KEY,
        'Content-Type': 'application/json; charset=utf-8'
    }
    
    # ORS takes [lon, lat] arrays
    body = {
        "coordinates": [
            [origin_coords["lon"], origin_coords["lat"]],
            [dest_coords["lon"], dest_coords["lat"]]
        ]
    }
    
    try:
        response = requests.post(url, headers=headers, json=body)
        data = response.json()
        
        if "routes" in data:
            route = data["routes"][0]
            summary = route["summary"]
            distance_km = int(summary["distance"] / 1000)
            duration_days = round(summary["duration"] / 3600 / 24, 1)
            
            return {
                "distance": distance_km,
                "days": duration_days
            }
        return None
    except Exception as e:
        print("ORS Error:", e)
        return None
