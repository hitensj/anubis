import requests
from config import OPENWEATHERMAP_API_KEY

def geocode_city(city_name):
    if not OPENWEATHERMAP_API_KEY:
        return None
        
    url = f"http://api.openweathermap.org/geo/1.0/direct?q={city_name}&limit=1&appid={OPENWEATHERMAP_API_KEY}"
    try:
        res = requests.get(url).json()
        if len(res) > 0:
            return {"lat": res[0]["lat"], "lon": res[0]["lon"]}
        return None
    except:
        return None

def get_weather_severity(lat, lon):
    if not OPENWEATHERMAP_API_KEY:
        return 5
        
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHERMAP_API_KEY}"
    try:
        res = requests.get(url).json()
        wind_speed = res.get("wind", {}).get("speed", 0)  # m/s
        weather_id = res.get("weather", [{}])[0].get("id", 800)
        
        # Calculate roughly 0-10 severity based on wind and thunderstorms (codes 2xx)
        score = 2
        if wind_speed > 15: score += 4
        elif wind_speed > 10: score += 2
        
        if 200 <= weather_id < 300: score += 5  # Thunderstorm
        if 500 <= weather_id < 600: score += 3  # Rain
        if 600 <= weather_id < 700: score += 4  # Snow
        
        return min(score, 10)
    except:
        return 5
