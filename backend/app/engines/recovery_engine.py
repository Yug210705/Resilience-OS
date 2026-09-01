from sqlalchemy.orm import Session
from app.db import models

def generate_recovery_options(scenario_id: str, db: Session):
    disruptions = db.query(models.Disruption).filter_by(scenario_id=scenario_id).all()
    options = []
    
    for disruption in disruptions:
        if disruption.target_entity_type == "Supplier":
            supplier_id = disruption.target_entity_id
            
            # Find materials supplied by the disrupted supplier
            sup_mats = db.query(models.SupplierMaterial).filter_by(supplier_id=supplier_id).all()
            for sm in sup_mats:
                # Find alternative suppliers for this material
                alt_suppliers = db.query(models.SupplierMaterial).filter(
                    models.SupplierMaterial.material_id == sm.material_id,
                    models.SupplierMaterial.supplier_id != supplier_id
                ).all()
                
                for alt in alt_suppliers:
                    # Check if alt supplier is active
                    alt_sup_entity = db.query(models.Supplier).filter_by(supplier_id=alt.supplier_id).first()
                    if alt_sup_entity and alt_sup_entity.status == "ACTIVE":
                        options.append({
                            "option_id": f"OPT-{alt.supplier_id}-{sm.material_id}",
                            "action_type": "ALTERNATIVE_SUPPLIER",
                            "details": {
                                "supplier_id": alt.supplier_id,
                                "material_id": sm.material_id
                            },
                            "estimated_cost": alt.cost if alt.cost else 0.0,
                            "expected_revenue_protected": 1000000.0, # Mock revenue calculation for MVP
                            "feasible": True
                        })
    return {
        "scenario_id": scenario_id,
        "options": options
    }
