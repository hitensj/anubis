from fastapi import APIRouter

router = APIRouter()

@router.get("/analytics")
def get_analytics():
    return {
        "disruptions_by_level": [
            {"name": "LOW", "value": 45},
            {"name": "MEDIUM", "value": 30},
            {"name": "HIGH", "value": 15},
            {"name": "CRITICAL", "value": 10}
        ],
        "events_over_time": [
            {"date": "10 Apr", "events": 2},
            {"date": "11 Apr", "events": 5},
            {"date": "12 Apr", "events": 3},
            {"date": "13 Apr", "events": 8},
            {"date": "14 Apr", "events": 4}
        ]
    }
