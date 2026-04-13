from mock_data import db

class FirebaseClientMock:
    def get_shipments(self):
        return list(db["shipments"].values())
    
    def create_shipment(self, shipment_data):
        import uuid
        sid = f"SHP-{str(uuid.uuid4())[:8].upper()}"
        shipment_data["id"] = sid
        db["shipments"][sid] = shipment_data
        return shipment_data
        
    def update_route(self, shipment_id, route_idx):
        if shipment_id in db["shipments"]:
            db["shipments"][shipment_id]["selected_route"] = route_idx
            return db["shipments"][shipment_id]
        return None
        
    def get_alerts(self, limit=20):
        # mock generating alerts from shipments that are high/critical
        alerts = []
        for s in db["shipments"].values():
            if s.get("risk_category") in ["HIGH", "CRITICAL"]:
                alerts.append({
                    "timestamp": "2026-04-14T00:00:00Z",
                    "shipment_id": s["id"],
                    "route": f'{s["origin"]} -> {s["destination"]}',
                    "risk_score": s["risk_score"],
                    "risk_category": s["risk_category"],
                    "news_triggered": True,
                    "action_taken": "Pending"
                })
        return alerts[:limit]

    def remove_shipment(self, shipment_id):
        if shipment_id in db["shipments"]:
            del db["shipments"][shipment_id]
            return {"status": "success"}
        return {"status": "not_found"}

fb_client = FirebaseClientMock()
