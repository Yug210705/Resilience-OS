from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_determinism():
    payload = {
        "disruption_type": "supplier",
        "affected_entity_id": "SUP-007",
        "severity": 1.0,
        "duration_days": 10
    }
    r1 = client.post("/api/disruptions/simulate", json=payload).json()
    r2 = client.post("/api/disruptions/simulate", json=payload).json()
    
    r1.pop('simulation_id', None)
    r2.pop('simulation_id', None)
    
    assert r1 == r2, "Engine must be perfectly deterministic"
