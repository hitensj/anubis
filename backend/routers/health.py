from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def get_health():
    return {
        "status": "operational",
        "services": {
            "openweathermap": "fallback",
            "gemini": "fallback",
            "gdelt": "ok",
            "newsapi": "fallback",
            "openrouteservice": "fallback",
            "firestore": "ok",
            "ml_model": "loaded"
        },
        "demo_mode": True,
        "model_accuracy": 0.86,
        "uptime_seconds": 3600
    }
