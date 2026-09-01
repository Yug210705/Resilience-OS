from app.db.models import Supplier, Material, Inventory, CustomerOrder
from .schemas import (
    SAPSupplierRecord,
    SAPMaterialRecord,
    SAPInventoryRecord,
    SAPCustomerOrderRecord
)

class SAPDomainMapper:
    """
    Anti-corruption layer responsible for translating SAP DTOs into 
    Resilience OS internal domain models, preventing external SDK 
    structures from leaking into the core application.
    """
    
    @staticmethod
    def map_supplier(sap_record: SAPSupplierRecord) -> Supplier:
        # Conceptual mapping - returns a domain object
        return Supplier(
            supplier_id=sap_record.sap_vendor_id,
            name=sap_record.name,
            region=sap_record.region,
            status="ACTIVE" if sap_record.status.upper() == "ACTIVE" else "INACTIVE"
        )
        
    @staticmethod
    def map_inventory(sap_record: SAPInventoryRecord) -> dict:
        # Returns a dict ready to insert/update the DB model
        return {
            "plant_id": sap_record.sap_plant_id,
            "material_id": sap_record.sap_material_id,
            "volume": sap_record.quantity,
            # Further unit conversion logic would reside here
        }
