from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
import structlog
from app.api.events import broadcast_event

logger = structlog.get_logger()
router = APIRouter()

class SapWebhookPayload(BaseModel):
    event_type: str
    material_id: str
    message: str
    severity: str = "HIGH"

@router.post("/trigger", summary="SAP Event Mesh Webhook Receiver")
async def receive_sap_webhook(payload: SapWebhookPayload):
    """
    Simulates receiving an inbound Event Mesh notification from SAP BTP.
    Broadcasts the event to all active SSE subscribers (Frontend dashboard).
    """
    logger.info("Received SAP Webhook Event", event_type=payload.event_type, material_id=payload.material_id)
    
    broadcast_event("SAP_DISRUPTION_EVENT", {
        "event_type": payload.event_type,
        "material_id": payload.material_id,
        "message": payload.message,
        "severity": payload.severity
    })
    
    return {"status": "SUCCESS", "message": "Broadcasted to Event Mesh listeners"}
