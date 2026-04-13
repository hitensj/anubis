from fastapi import APIRouter
from firebase_client import fb_client

router = APIRouter()

@router.get("/alerts")
def get_alerts(limit: int = 20):
    return fb_client.get_alerts(limit)
