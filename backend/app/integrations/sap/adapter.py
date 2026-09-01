from typing import Optional, List
from .port import SAPIntegrationPort
from .schemas import (
    SAPSupplierRecord,
    SAPMaterialRecord,
    SAPInventoryRecord,
    SAPCustomerOrderRecord,
    SAPRecoveryActionRequest,
    SAPActionResult
)
from app.core.config import settings

class PlaceholderSAPAdapter(SAPIntegrationPort):
    """
    Default placeholder adapter that enforces the boundary but strictly reports SAP as NOT_CONFIGURED.
    Prevents hallucinating fake enterprise data before Member 3 implements the real connection.
    """
    
    def get_status(self) -> dict:
        is_configured = settings.SAP_ENABLED
        return {
            "provider": "SAP",
            "status": "CONFIGURED" if is_configured else "NOT_CONFIGURED",
            "connected": False, # Never report true until real verification
            "capabilities": {
                "master_data_read": False,
                "inventory_read": False,
                "order_read": False,
                "recovery_action_write": False
            }
        }
        
    def _raise_not_configured(self):
        raise NotImplementedError("SAP integration is not yet configured or connected. Please implement the real adapter.")

    def get_supplier(self, vendor_id: str) -> Optional[SAPSupplierRecord]:
        self._raise_not_configured()

    def get_material(self, material_id: str) -> Optional[SAPMaterialRecord]:
        self._raise_not_configured()

    def get_inventory(self, plant_id: str, material_id: str) -> Optional[SAPInventoryRecord]:
        self._raise_not_configured()

    def get_customer_order(self, order_id: str) -> Optional[SAPCustomerOrderRecord]:
        self._raise_not_configured()

    def submit_recovery_action(self, request: SAPRecoveryActionRequest) -> SAPActionResult:
        self._raise_not_configured()

import httpx
class Member3SAPAdapter(SAPIntegrationPort):
    def __init__(self, base_url="http://127.0.0.1:8002"):
        self.base_url = base_url

    def get_status(self) -> dict:
        is_configured = settings.SAP_ENABLED
        try:
            # We assume it's running
            httpx.get(f"{self.base_url}/docs", timeout=2.0)
            connected = True
        except:
            connected = False
            
        return {
            "provider": "SAP",
            "status": "CONFIGURED" if is_configured else "NOT_CONFIGURED",
            "connected": connected,
            "capabilities": {
                "master_data_read": False,
                "inventory_read": False,
                "order_read": False,
                "recovery_action_write": connected
            }
        }
        
    def get_supplier(self, vendor_id: str) -> Optional[SAPSupplierRecord]:
        return None

    def get_material(self, material_id: str) -> Optional[SAPMaterialRecord]:
        return None

    def get_inventory(self, plant_id: str, material_id: str) -> Optional[SAPInventoryRecord]:
        return None

    def get_customer_order(self, order_id: str) -> Optional[SAPCustomerOrderRecord]:
        return None

    def submit_recovery_action(self, request: SAPRecoveryActionRequest) -> SAPActionResult:
        if not settings.SAP_ENABLED:
            raise NotImplementedError("SAP integration is not yet configured or connected. Please implement the real adapter.")
            
        payload = {
            "id": request.action_type,
            "suppliers_used": [request.details.get("supplier_id", "UNKNOWN")] if "supplier_id" in request.details else [],
            "total_cost": request.details.get("estimated_cost", 0.0),
            "max_delay_days": request.details.get("delay_days", 0),
            "blended_risk": 0.5,
            "total_sla_exposure": 0.0,
            "final_score": 0.0
        }
        try:
            response = httpx.post(f"{self.base_url}/execute-action", json=payload, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            return SAPActionResult(
                success=True,
                sap_transaction_id=data.get("transaction_id", "TXN-UNKNOWN"),
                message="Action executed successfully via Member 3 service."
            )
        except Exception as e:
            return SAPActionResult(
                success=False,
                message=f"SAP action failed: {str(e)}"
            )
