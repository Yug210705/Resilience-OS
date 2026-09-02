import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_master_data():
    response = client.get("/api/v1/suppliers")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["supplier_id"] == "SUP-001"

def test_hero_cascade():
    # 1. Create a Scenario
    import uuid; scen_id = f"SCEN-{uuid.uuid4()}"
    response = client.post("/api/v1/scenarios", json={"scenario_id": scen_id, "name": "Hero Cascade Scenario"})
    assert response.status_code == 200
    
    # 2. Add Disruption on SUP-001
    disrupt_data = {
        "disruption_id": f"DIS-{uuid.uuid4()}",
        "type": "SUPPLIER_FAILURE",
        "severity": "CRITICAL",
        "target_entity_id": "SUP-001",
        "target_entity_type": "Supplier",
        "description": "Supplier failure due to weather",
        "start_time": "2026-08-31T00:00:00Z"
    }
    response = client.post(f"/api/v1/scenarios/{scen_id}/disruptions", json=disrupt_data)
    assert response.status_code == 200
    
    # 3. Check baseline Supplier is still ACTIVE
    response = client.get("/api/v1/suppliers/SUP-001")
    assert response.status_code == 200
    assert response.json()["status"] == "ACTIVE"
    
    # 4. Calculate Impact
    response = client.get(f"/api/v1/scenarios/{scen_id}/impact")
    assert response.status_code == 200
    impact = response.json()
    assert "MAT-001" in impact["affected_materials"]
    assert "PLT-001" in impact["affected_plants"]
    assert "PRD-001" in impact["affected_products"]
    assert "ORD-001" in impact["affected_orders"]
    assert impact["revenue_at_risk"] >= 1000000.0
    
    # 5. Generate Recovery Options
    response = client.get(f"/api/v1/scenarios/{scen_id}/recovery-options")
    assert response.status_code == 200
    options = response.json()["options"]
    assert len(options) >= 1
    # Should recommend SUP-002 as alternative
    assert options[0]["action_type"] == "ALTERNATIVE_SUPPLIER"
    assert options[0]["details"]["supplier_id"] == "SUP-002"
