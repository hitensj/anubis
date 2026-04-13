from pydantic import BaseModel
from fastapi import APIRouter
from model.predict import run_prediction

router = APIRouter()

class PredictReq(BaseModel):
    origin: str
    destination: str
    cargo_type: str
    priority: str
    departure_date: str
    cargo_value_tier: str

@router.post("/predict")
def predict_endpoint(req: PredictReq):
    return run_prediction(req.dict())
