from pydantic import BaseModel
from typing import Optional, List

class SAPSupplierRecord(BaseModel):
    sap_vendor_id: str
    name: str
    region: str
    status: str

class SAPMaterialRecord(BaseModel):
    sap_material_id: str
    description: str
    category: str
    is_active: bool

class SAPInventoryRecord(BaseModel):
    sap_material_id: str
    sap_plant_id: str
    quantity: float
    unit: str

class SAPCustomerOrderRecord(BaseModel):
    sap_order_id: str
    sap_customer_id: str
    sap_product_id: str
    quantity: int
    status: str
    revenue_value: float

class SAPRecoveryActionRequest(BaseModel):
    """
    Outbound request payload to execute an approved recovery action in SAP.
    """
    action_type: str
    source_system: str = "RESILIENCE_OS"
    details: dict
    approval_reference: str

class SAPActionResult(BaseModel):
    """
    Response from SAP after an action is attempted.
    """
    success: bool
    sap_transaction_id: Optional[str] = None
    message: str
