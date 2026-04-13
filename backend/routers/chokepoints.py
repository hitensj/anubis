from fastapi import APIRouter
from mock_data import GLOBAL_CHOKEPOINTS
import random

router = APIRouter()

@router.get("/chokepoints")
def get_chokepoints():
    # simulate varying risks
    res = []
    for cp in GLOBAL_CHOKEPOINTS:
        res.append({
            **cp,
            "current_risk": random.randint(10, 90)
        })
    return res

@router.get("/cascade/{chokepoint_id}")
def simulate_cascade(chokepoint_id: str):
    return {
        "affected_shipments": random.randint(2, 8),
        "network_delay_hours": random.randint(100, 500),
        "cargo_value_risk": random.randint(1000000, 5000000),
        "severity": "MODERATE" if random.random() > 0.5 else "SEVERE"
    }
