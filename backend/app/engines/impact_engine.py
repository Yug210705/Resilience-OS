from sqlalchemy.orm import Session
from app.db import models

def calculate_impact(scenario_id: str, db: Session):
    disruptions = db.query(models.Disruption).filter_by(scenario_id=scenario_id).all()
    
    affected_entities = []
    affected_materials = set()
    affected_plants = set()
    affected_products = set()
    affected_orders = set()
    revenue_at_risk = 0.0

    for disruption in disruptions:
        affected_entities.append(disruption.target_entity_id)
        
        if disruption.target_entity_type == "Supplier":
            supplier_id = disruption.target_entity_id
            
            # Find materials supplied by this supplier
            sup_mats = db.query(models.SupplierMaterial).filter_by(supplier_id=supplier_id).all()
            for sm in sup_mats:
                affected_materials.add(sm.material_id)
                
                # Find plants requiring this material
                plant_mats = db.query(models.PlantMaterial).filter_by(material_id=sm.material_id).all()
                for pm in plant_mats:
                    affected_plants.add(pm.plant_id)
                    
                    # Find products at this plant (via inventory for MVP simplicity, or just assume it produces PRD-001)
                    # For the hero cascade, PLT-001 produces PRD-001
                    plant_invs = db.query(models.Inventory).filter_by(plant_id=pm.plant_id).filter(models.Inventory.product_id != None).all()
                    for inv in plant_invs:
                        affected_products.add(inv.product_id)
                        
                        # Find orders for these products
                        orders = db.query(models.CustomerOrder).filter_by(product_id=inv.product_id, status="PENDING").all()
                        for order in orders:
                            affected_orders.add(order.order_id)
                            revenue_at_risk += order.revenue_value

    return {
        "scenario_id": scenario_id,
        "affected_entities": affected_entities,
        "affected_materials": list(affected_materials),
        "affected_plants": list(affected_plants),
        "affected_products": list(affected_products),
        "affected_orders": list(affected_orders),
        "delayed_orders": len(affected_orders),
        "revenue_at_risk": revenue_at_risk,
        "capacity_shortfall": 0.0, # simplified for MVP
        "inventory_risk": 0.0 # simplified for MVP
    }
