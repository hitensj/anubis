import random
import uuid
from services.weather_service import geocode_city, get_weather_severity
from services.news_service import get_news
from services.route_service import get_route
from services.gemini_service import get_oracle_judgment
from config import DEMO_MODE

def run_prediction(req: dict):
    origin = req.get('origin', "Unknown")
    dest = req.get('destination', "Unknown")
    
    # 1. Geocoding & Weather
    origin_coords = None
    dest_coords = None
    weather_score = random.randint(0, 10) if DEMO_MODE else 2
    
    if not DEMO_MODE:
        origin_coords = geocode_city(origin)
        dest_coords = geocode_city(dest)
        
        o_weather = get_weather_severity(origin_coords['lat'], origin_coords['lon']) if origin_coords else 2
        d_weather = get_weather_severity(dest_coords['lat'], dest_coords['lon']) if dest_coords else 2
        weather_score = max(o_weather, d_weather)
    else:
        origin_coords = {"lat": 20, "lon": 70}
        dest_coords = {"lat": 50, "lon": 5}
        
    # 2. News API
    news_articles = []
    news_score = random.randint(0, 10) if DEMO_MODE else 1
    if not DEMO_MODE:
        news_articles = get_news([origin, dest, "shipping disruption"])
        if news_articles:
            high_sev = [a for a in news_articles if a["severity"] == "HIGH"]
            news_score = 4 + len(high_sev) * 3
            news_score = min(news_score, 10)

    # 3. Compile Score
    factors = {
        "weather": weather_score,
        "congestion": random.randint(2, 6),
        "geopolitical": random.randint(1, 4),
        "news": news_score,
        "historical": random.randint(0, 3)
    }
    
    risk = sum(factors.values()) * 2 
    risk = min(risk + random.randint(0,10), 100) # add a bit of noise
    
    cat = "LOW"
    if risk > 30: cat = "MEDIUM"
    if risk > 60: cat = "HIGH"
    if risk > 80: cat = "CRITICAL"

    # 4. OpenRouteService calculation
    alt_routes = []
    if not DEMO_MODE and origin_coords and dest_coords:
        route_data = get_route(origin_coords, dest_coords)
        if route_data:
            alt_routes.append({
                "id": "live_route_1", 
                "name": f"Optimal Driving Route ({origin} to {dest})",
                "risk_reduction": 15,
                "dist": route_data["distance"],
                "days": route_data["days"],
                "recommended": True
            })
    
    # Fallback to dummy data
    if not alt_routes:
        alt_routes = [
            {"id": "alt_1", "name": f"{origin} -> Alternate Sea Route -> {dest}", "risk_reduction": 20, "dist": 14000, "days": 35, "recommended": True},
            {"id": "alt_2", "name": f"{origin} -> Land Bridge -> {dest}", "risk_reduction": 10, "dist": 9000, "days": 21, "recommended": False}
        ]

    # 5. Gemini Integration
    if DEMO_MODE:
        msg = f"The stars align. Risk is {cat}. [DEMO MODE]"
        if cat == "HIGH": msg = f"Dark waters lie ahead. Tensions cast a long shadow. [DEMO MODE]"
    else:
        msg = get_oracle_judgment(origin, dest, req.get('cargo_type'), cat, factors, news_articles)

    return {
        "prediction_id": str(uuid.uuid4()),
        "risk_score": risk,
        "risk_category": cat,
        "contributing_factors": factors,
        "oracle_judgment": msg,
        "news_articles": news_articles,
        "cascade_impact": {"affected_shipments": random.randint(1, 10), "severity": "MODERATE" if risk < 80 else "SEVERE"},
        "alternate_routes": alt_routes
    }
