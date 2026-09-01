from abc import ABC, abstractmethod
from typing import Optional, List
from .schemas import (
    SAPSupplierRecord,
    SAPMaterialRecord,
    SAPInventoryRecord,
    SAPCustomerOrderRecord,
    SAPRecoveryActionRequest,
    SAPActionResult
)

class SAPIntegrationPort(ABC):
    """
    Abstract interface defining what the core application requires from SAP.
    Member 3 will provide a concrete implementation (RealSAPAdapter) that implements this port.
    """
    
    @abstractmethod
    def get_status(self) -> dict:
        """Return the health and capabilities of the SAP connection."""
        pass
        
    @abstractmethod
    def get_supplier(self, vendor_id: str) -> Optional[SAPSupplierRecord]:
        pass

    @abstractmethod
    def get_material(self, material_id: str) -> Optional[SAPMaterialRecord]:
        pass

    @abstractmethod
    def get_inventory(self, plant_id: str, material_id: str) -> Optional[SAPInventoryRecord]:
        pass

    @abstractmethod
    def get_customer_order(self, order_id: str) -> Optional[SAPCustomerOrderRecord]:
        pass

    @abstractmethod
    def submit_recovery_action(self, request: SAPRecoveryActionRequest) -> SAPActionResult:
        """
        Submits an approved action (e.g., PO creation, route change) to SAP.
        """
        pass
