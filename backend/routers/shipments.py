from fastapi import APIRouter
from firebase_client import fb_client

router = APIRouter()

@router.get("/shipments")
def get_shipments():
    return fb_client.get_shipments()

@router.post("/shipments")
def create_shipment(shipment: dict):
    return fb_client.create_shipment(shipment)

@router.patch("/shipments/{id}/route")
def update_shipment_route(id: str, payload: dict):
    return fb_client.update_route(id, payload.get("selected_route"))

@router.delete("/shipments/{id}")
def delete_shipment(id: str):
    return fb_client.remove_shipment(id)
