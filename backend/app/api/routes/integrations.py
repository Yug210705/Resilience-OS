from fastapi import APIRouter
from app.integrations.sap.adapter import PlaceholderSAPAdapter
from app.core.config import settings

router = APIRouter()

# Instantiate the port. In production, this would be injected 
# via FastAPI dependency injection based on configuration.
sap_adapter = PlaceholderSAPAdapter()

@router.get("/sap/status")
def get_sap_integration_status():
    """
    Returns the current configuration and connection health of the SAP adapter.
    """
    return sap_adapter.get_status()

@router.get("/health")
def get_all_integrations_health():
    """
    Returns a unified health check of all configured enterprise connections.
    """
    return {
        "connections": [
            sap_adapter.get_status(),
            {
                "provider": "AI",
                "status": "CONFIGURED" if settings.AI_PROVIDER_ENABLED else "NOT_CONFIGURED",
                "connected": settings.AI_PROVIDER_ENABLED # Future real provider would have a deeper check
            }
        ]
    }
