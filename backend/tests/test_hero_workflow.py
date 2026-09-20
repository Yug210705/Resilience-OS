import pytest
import uuid
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings
from app.db.models import RecoveryPlan, AuditRecord, Scenario
from domain.enums import PlanStatus

client = TestClient(app)

def test_hero_scenario_full_workflow():
    # 1. Ensure DB isolated via unique scenario ID
    scenario_id = f"SCEN-TEST-{uuid.uuid4()}"
    disruption_id = f"DIS-{uuid.uuid4()}"
    
    # Create scenario
    resp = client.post("/api/v1/scenarios", json={"scenario_id": scenario_id, "name": "Hero Test"})
    assert resp.status_code == 200
    
    # 2. Trigger disruption
    resp = client.post(f"/api/v1/scenarios/{scenario_id}/disruptions", json={
        "disruption_id": disruption_id,
        "type": "SUPPLIER_FAILURE",
        "severity": "CRITICAL",
        "target_entity_id": "SUP-001",
        "target_entity_type": "Supplier",
        "description": "Test failure",
        "start_time": "2026-08-31T00:00:00Z"
    })
    assert resp.status_code == 200
    
    # 3. Calculate Impact
    resp = client.get(f"/api/v1/scenarios/{scenario_id}/impact")
    assert resp.status_code == 200
    impact = resp.json()
    assert impact["revenue_at_risk"] > 0
    assert "SUP-001" in impact["affected_entities"]
    
    # 4. Deterministic Feasible Options
    resp = client.get(f"/api/v1/scenarios/{scenario_id}/recovery-options")
    assert resp.status_code == 200
    options = resp.json()["options"]
    assert len(options) > 0
    
    # 5. Assume AI disabled for this test, check 503
    settings.AI_PROVIDER_ENABLED = False
    resp = client.post(f"/api/v1/scenarios/{scenario_id}/ai-recommendation")
    assert resp.status_code == 503
    
    # 6. Create Recovery Plan Manually (simulating AI or User choice)
    chosen_opt = options[0]
    resp = client.post(f"/api/v1/scenarios/{scenario_id}/recovery-plans", json={
        "action_type": chosen_opt["action_type"],
        "details": chosen_opt["details"],
        "estimated_cost": chosen_opt["estimated_cost"],
        "mitigated_risk_value": chosen_opt["expected_revenue_protected"],
        "ai_reasoning": "Manually verified because AI was offline"
    })
    assert resp.status_code == 200
    plan_id = resp.json()["plan_id"]
    
    # 7. Approve Recovery Plan
    settings.SAP_ENABLED = False # Ensure we don't hallucinate SAP
    resp = client.post(f"/api/v1/scenarios/{scenario_id}/recovery-plans/{plan_id}/approve")
    assert resp.status_code == 200
    assert "SAP NOT_CONFIGURED" in resp.json()["sap_execution"]
    
    # 8. Check Audit
    resp = client.get(f"/api/v1/scenarios/{scenario_id}/audit")
    assert resp.status_code == 200
    audits = resp.json()
    assert len(audits) == 1
    assert audits[0]["action"] == "APPROVED"
    assert audits[0]["recovery_plan_id"] == plan_id

def test_recovery_rejection():
    scenario_id = f"SCEN-TEST-{uuid.uuid4()}"
    client.post("/api/v1/scenarios", json={"scenario_id": scenario_id, "name": "Rejection Test"})
    
    resp = client.post(f"/api/v1/scenarios/{scenario_id}/recovery-plans", json={
        "action_type": "ALTERNATIVE_SUPPLIER",
        "details": {"supplier_id": "SUP-002"},
        "estimated_cost": 50000,
        "mitigated_risk_value": 1000000
    })
    plan_id = resp.json()["plan_id"]
    
    resp = client.post(f"/api/v1/scenarios/{scenario_id}/recovery-plans/{plan_id}/reject")
    assert resp.status_code == 200
    
    resp = client.get(f"/api/v1/scenarios/{scenario_id}/audit")
    audits = resp.json()
    assert audits[0]["action"] == "REJECTED"
