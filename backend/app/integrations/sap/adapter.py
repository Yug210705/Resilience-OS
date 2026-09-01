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
