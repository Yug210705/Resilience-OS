import os

def append_to_file(path, content):
    with open(path, 'a', encoding='utf-8') as f:
        f.write("\n" + content.strip() + "\n")

# 1. Update Schemas for Multi-Disruption
schemas_code = """
class MultiDisruptionRequest(BaseModel):
    name: str = "The Perfect Storm"
    disruptions: List[DisruptionRequest]
"""
append_to_file("app/schemas/__init__.py", schemas_code)

# 2. Update Impact Service for Multi-Disruption & Chaos Monkey
services_code = """
def simulate_multi_disruption(db: Session, reqs: list):
    G = build_supply_chain_graph(db)
    
    start_nodes = []
    for r in reqs:
        sn = f"{r.disruption_type}:{r.affected_entity_id}"
        if sn in G:
            start_nodes.append((sn, r))
            
    if not start_nodes:
        raise ValueError("No valid entities found in graph")
        
    impacted_nodes = set()
    for sn, _ in start_nodes:
        impacted_nodes.update(nx.descendants(G, sn))
        impacted_nodes.add(sn)
        
    affected_suppliers = [n.split(":")[1] for n in impacted_nodes if n.startswith("supplier:")]
    affected_materials = [n.split(":")[1] for n in impacted_nodes if n.startswith("material:")]
    affected_plants = [n.split(":")[1] for n in impacted_nodes if n.startswith("plant:")]
    affected_products = [n.split(":")[1] for n in impacted_nodes if n.startswith("product:")]
    affected_orders = [n.split(":")[1] for n in impacted_nodes if n.startswith("order:")]
    
    # We will do a simplified unified impact for the multi-vector attack
    revenue_at_risk = 0.0
    orders = db.query(Order).filter(Order.id.in_(affected_orders)).all() if affected_orders else []
    
    # Max severity across all attacks
    max_sev = max((r.severity for r in reqs), default=1.0)
    
    for o in orders:
        loss = o.order_value * max_sev
        revenue_at_risk += loss
        
    return {
        "scenario_name": "Multi-Vector Attack",
        "attack_vectors": len(reqs),
        "total_nodes_destroyed": len(impacted_nodes),
        "cascading_impact": {
            "affected_suppliers": len(affected_suppliers),
            "affected_plants": len(affected_plants),
            "affected_products": len(affected_products),
            "affected_orders": len(affected_orders),
            "doomsday_revenue_at_risk": revenue_at_risk
        }
    }

def run_chaos_monkey(db: Session):
    # 1. Use PageRank to find the 3 most systemically important nodes
    vuln = analyze_vulnerabilities(db)
    top_3 = vuln["top_systemic_risks"][:3]
    
    # 2. Construct a multi-vector attack
    reqs = []
    for node in top_3:
        # Pydantic schema expects (type, id, severity, duration)
        reqs.append(
            DisruptionRequest(
                disruption_type=node["type"],
                affected_entity_id=node["entity_id"].split(":")[1],
                severity=1.0,
                duration_days=30
            )
        )
        
    # 3. Simulate the unified catastrophe
    result = simulate_multi_disruption(db, reqs)
    result["scenario_name"] = "Chaos Monkey Doomsday Simulation"
    result["targeted_vulnerabilities"] = top_3
    return result
"""
append_to_file("app/services/impact_service.py", services_code)

# 3. Add Endpoints to Main
main_code = """
from app.schemas import MultiDisruptionRequest
from app.services.impact_service import simulate_multi_disruption, run_chaos_monkey

@app.post("/api/war-room/simulate-multi", summary="Simulate Simultaneous Multi-Vector Disruptions")
def war_room_simulate(req: MultiDisruptionRequest, db: Session = Depends(get_db)):
    return simulate_multi_disruption(db, req.disruptions)

@app.post("/api/war-room/chaos-monkey", summary="Unleash the Supply Chain Chaos Monkey")
def unleash_chaos_monkey(db: Session = Depends(get_db)):
    \"\"\"
    Uses Graph Theory (PageRank) to automatically identify the 3 most critical systemic 
    vulnerabilities in the enterprise, and then simultaneously destroys them (Severity 1.0) 
    to calculate the maximum potential Doomsday impact.
    \"\"\"
    return run_chaos_monkey(db)
"""
append_to_file("app/main.py", main_code)
