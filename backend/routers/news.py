from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

@router.get("/news")
def get_news(region: str = ""):
    return [
        {"title": "Echoes of conflict in the region.", "source": "GDELT", "time": "2 hours ago", "severity": "HIGH"},
        {"title": f"Tensions near {region or 'the strait'} lead to rerouting.", "source": "NewsAPI", "time": "4 hours ago", "severity": "MEDIUM"}
    ]
