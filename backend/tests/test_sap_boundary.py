import pytest
from app.integrations.sap.adapter import PlaceholderSAPAdapter
from app.integrations.sap.schemas import SAPRecoveryActionRequest
from app.core.config import settings
from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

def test_sap_placeholder_adapter_raises_not_configured():
    adapter = PlaceholderSAPAdapter()
    
    with pytest.raises(NotImplementedError, match="not yet configured"):
        adapter.get_supplier("VEND-123")
        
    with pytest.raises(NotImplementedError, match="not yet configured"):
        adapter.submit_recovery_action(
            SAPRecoveryActionRequest(
                action_type="PO_CREATE", 
                details={}, 
                approval_reference="REF-1"
            )
        )

def test_sap_status_reflects_configuration():
    # Force settings
    settings.SAP_ENABLED = False
    adapter = PlaceholderSAPAdapter()
    status = adapter.get_status()
    
    assert status["provider"] == "SAP"
    assert status["status"] == "NOT_CONFIGURED"
    assert status["connected"] is False

def test_integrations_health_endpoint():
    response = client.get("/api/v1/integrations/health")
    assert response.status_code == 200
    data = response.json()
    assert "connections" in data
    
    providers = [conn["provider"] for conn in data["connections"]]
    assert "SAP" in providers
    assert "AI" in providers
