GLOBAL_CHOKEPOINTS = [
    {"id": "hormuz", "name": "Strait of Hormuz", "lat": 26.5667, "lng": 56.25, "risk_multiplier": 2.5, "keywords": ["hormuz", "iran", "persian gulf"]},
    {"id": "suez", "name": "Suez Canal", "lat": 30.4667, "lng": 32.35, "risk_multiplier": 2.2, "keywords": ["suez", "egypt", "red sea"]},
    {"id": "malacca", "name": "Strait of Malacca", "lat": 2.5, "lng": 101.5, "risk_multiplier": 1.8, "keywords": ["malacca", "singapore", "indonesia"]},
    {"id": "gibraltar", "name": "Strait of Gibraltar", "lat": 35.9333, "lng": -5.6833, "risk_multiplier": 1.5, "keywords": ["gibraltar", "morocco", "spain"]},
    {"id": "panama", "name": "Panama Canal", "lat": 9.08, "lng": -79.68, "risk_multiplier": 2.0, "keywords": ["panama", "canal"]},
    {"id": "bab-el-mandeb", "name": "Bab el-Mandeb", "lat": 12.5833, "lng": 43.4833, "risk_multiplier": 2.3, "keywords": ["bab el-mandeb", "yemen", "houthi", "red sea"]},
    {"id": "turkish-straits", "name": "Turkish Straits", "lat": 41.1333, "lng": 29.0667, "risk_multiplier": 1.6, "keywords": ["bosphorus", "dardanelles", "turkey", "ukraine", "black sea"]},
    {"id": "south-china-sea", "name": "South China Sea", "lat": 15.0, "lng": 115.0, "risk_multiplier": 1.9, "keywords": ["south china sea", "taiwan", "philippines"]},
]

MOCK_SHIPMENTS = [
    {
        "id": f"SHP-100{i}",
        "origin": origin,
        "destination": dest,
        "cargo_type": "Electronics",
        "priority": "Critical",
        "departure_date": "2026-05-01",
        "cargo_value_tier": "High",
        "risk_score": risk,
        "risk_category": cat,
        "route": [
            {"lat": plat1, "lng": plng1},
            {"lat": plat2, "lng": plng2}
        ]
    }
    for i, (origin, dest, risk, cat, plat1, plng1, plat2, plng2) in enumerate([
        ("Shanghai", "Rotterdam", 78, "HIGH", 31.2, 121.5, 51.9, 4.4),
        ("Shenzhen", "Los Angeles", 45, "MEDIUM", 22.5, 114.0, 34.0, -118.2),
        ("Mumbai", "Antwerp", 20, "LOW", 18.9, 72.8, 51.2, 4.4),
        ("Dubai", "New York", 85, "CRITICAL", 25.2, 55.2, 40.7, -74.0),
        ("Singapore", "Hamburg", 30, "LOW", 1.3, 103.8, 53.5, 10.0),
        ("Tokyo", "Sydney", 15, "LOW", 35.6, 139.6, -33.8, 151.2),
        ("Busan", "Seattle", 25, "LOW", 35.1, 129.0, 47.6, -122.3),
        ("Kaohsiung", "Manila", 90, "CRITICAL", 22.6, 120.3, 14.5, 120.9),
        ("Jebel Ali", "London", 72, "HIGH", 24.9, 55.0, 51.5, -0.1),
        ("Santos", "Miami", 40, "MEDIUM", -23.9, -46.3, 25.7, -80.1),
        ("Vancouver", "Tokyo", 18, "LOW", 49.2, -123.1, 35.6, 139.6),
        ("Houston", "Rotterdam", 35, "LOW", 29.7, -95.3, 51.9, 4.4),
        ("Colombo", "Durban", 45, "MEDIUM", 6.9, 79.8, -29.8, 31.0),
        ("Alexandria", "Marseille", 65, "HIGH", 31.2, 29.9, 43.2, 5.3),
        ("Melbourne", "Los Angeles", 20, "LOW", -37.8, 144.9, 34.0, -118.2)
    ])
]

# Simple in-memory "database"
db = {
    "shipments": {s["id"]: s for s in MOCK_SHIPMENTS},
    "alerts": []
}
