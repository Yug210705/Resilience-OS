from sqlalchemy.orm import Session
import networkx as nx
from app.graph.builder import build_supply_chain_graph
from app.models import Supplier, Material, SupplierMaterial, Plant, Product, ProductMaterial, Order, Inventory
import uuid

def simulate_disruption(db: Session, req):
    G = build_supply_chain_graph(db)
    
    start_node = f"{req.disruption_type}:{req.affected_entity_id}"
    if start_node not in G:
        raise ValueError("Entity not found in graph")
        
    # Find all downstream reachable nodes
    impacted_nodes = nx.descendants(G, start_node)
    impacted_nodes.add(start_node)
    
    affected_suppliers = [n.split(":")[1] for n in impacted_nodes if n.startswith("supplier:")]
    affected_materials = [n.split(":")[1] for n in impacted_nodes if n.startswith("material:")]
    affected_plants = [n.split(":")[1] for n in impacted_nodes if n.startswith("plant:")]
    affected_products = [n.split(":")[1] for n in impacted_nodes if n.startswith("product:")]
    affected_orders = [n.split(":")[1] for n in impacted_nodes if n.startswith("order:")]
    
    material_shortages = []
    supplier_options = []
    revenue_at_risk = 0.0
    order_impacts = []
    dependency_paths = []
    
    for o_id in affected_orders:
        o_node = f"order:{o_id}"
        try:
            path = nx.shortest_path(G, start_node, o_node)
            path_objs = [{"type": n.split(":")[0], "id": n.split(":")[1]} for n in path]
            dependency_paths.append({"target_entity_id": o_id, "path": path_objs})
        except:
            pass

    for mat_id in affected_materials:
        normal_cap = 0
        disrupted_cap = 0
        sms = db.query(SupplierMaterial).filter_by(material_id=mat_id).all()
        alt_sups = []
        for sm in sms:
            if sm.supplier_id in affected_suppliers:
                disrupted_cap += sm.capacity_per_day * req.severity
                normal_cap += sm.capacity_per_day
            else:
                normal_cap += sm.capacity_per_day
                disrupted_cap += sm.capacity_per_day
                alt_sups.append(sm.supplier_id)
                supplier_options.append({
                    "supplier_id": sm.supplier_id,
                    "material_id": mat_id,
                    "capacity_per_day": sm.capacity_per_day,
                    "lead_time_days": sm.lead_time_days,
                    "unit_cost": sm.unit_cost,
                    "risk_score": 50.0
                })
        
        demand = 0
        for pm in db.query(ProductMaterial).filter_by(material_id=mat_id).all():
            prod = db.query(Product).filter_by(id=pm.product_id).first()
            if prod:
                demand += prod.daily_production_capacity * pm.quantity_required
                
        if disrupted_cap < demand:
            shortfall_per_day = demand - disrupted_cap
            inv = db.query(Inventory).filter_by(material_id=mat_id).first()
            avail_inv = max(inv.on_hand_quantity - inv.reserved_quantity, 0) if inv else 0
            runway_days = avail_inv / demand if demand > 0 else 0
            
            material_shortages.append({
                "material_id": mat_id,
                "shortage_quantity": int(shortfall_per_day * req.duration_days),
                "shortage_per_day": shortfall_per_day,
                "shortage_start_day": runway_days,
                "duration_days": req.duration_days,
                "current_supplier_capacity": int(disrupted_cap),
                "normal_demand_per_day": demand,
                "single_source": len(sms) == 1,
                "alternative_supplier_ids": alt_sups
            })

    total_prod_loss = 0
    orders = db.query(Order).filter(Order.id.in_(affected_orders)).all() if affected_orders else []
    for o in orders:
        loss = o.order_value * req.severity
        revenue_at_risk += loss
        order_impacts.append({
            "order_id": o.id,
            "product_id": o.product_id,
            "shortfall_quantity": int(o.quantity * req.severity),
            "revenue_at_risk": loss
        })
        
    overall_score = min((req.severity * 40) + (len(affected_orders) * 2) + (revenue_at_risk / 100000), 100.0)
    impact_level = "CRITICAL" if overall_score >= 75 else "HIGH" if overall_score >= 50 else "MEDIUM" if overall_score >= 25 else "LOW"

    return {
        "simulation_id": f"SIM-{uuid.uuid4().hex[:6].upper()}",
        "disruption": req.model_dump(),
        "summary": {
            "affected_suppliers": len(affected_suppliers),
            "affected_materials": len(affected_materials),
            "affected_plants": len(affected_plants),
            "affected_products": len(affected_products),
            "affected_orders": len(affected_orders),
            "production_loss_units": total_prod_loss,
            "revenue_at_risk": revenue_at_risk,
            "overall_impact_score": round(overall_score, 1),
            "impact_level": impact_level
        },
        "affected_suppliers": [{"id": x} for x in affected_suppliers],
        "affected_materials": [{"id": x} for x in affected_materials],
        "affected_plants": [{"id": x} for x in affected_plants],
        "affected_products": [{"id": x} for x in affected_products],
        "affected_orders": order_impacts,
        "inventory_impact": [],
        "production_impact": [],
        "revenue_impact": order_impacts,
        "dependency_paths": dependency_paths,
        "timeline": [],
        "risk_analysis": {},
        "recovery_context": {
            "material_shortages": material_shortages,
            "supplier_options": supplier_options,
            "affected_orders": [{"order_id": o["order_id"], "product_id": o["product_id"], "shortfall_quantity": o["shortfall_quantity"], "revenue_at_risk": o["revenue_at_risk"]} for o in order_impacts]
        },
        "ai_context": {
            "situation": {
                "disruption_type": req.disruption_type,
                "entity_id": req.affected_entity_id,
                "severity": req.severity,
                "duration_days": req.duration_days
            },
            "impact_summary": {
                "affected_materials": len(affected_materials),
                "affected_plants": len(affected_plants),
                "affected_products": len(affected_products),
                "affected_orders": len(affected_orders),
                "revenue_at_risk": revenue_at_risk
            },
            "critical_dependencies": [],
            "inventory_exposure": [],
            "production_exposure": [],
            "revenue_exposure": []
        }
    }
