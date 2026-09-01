import sys
import os
import json
from sqlalchemy import text, inspect
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.main import app
from app.core.database import engine

def run_checks():
    report = {}

    # 1. DB Connectivity
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version();")).scalar()
            report["db_version"] = result
            report["db_connected"] = True
    except Exception as e:
        report["db_connected"] = False
        report["db_error"] = str(e)

    # 2. Schema Verification
    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        report["tables"] = tables
    except Exception as e:
        report["tables_error"] = str(e)

    # 3. API Checks
    client = TestClient(app)
    
    # Health
    r_health = client.get("/health")
    report["api_health"] = r_health.status_code == 200

    # Master Data
    r_sup = client.get("/api/v1/suppliers")
    report["api_suppliers_count"] = len(r_sup.json()) if r_sup.status_code == 200 else -1

    # Graph
    r_graph = client.get("/api/v1/network/graph")
    if r_graph.status_code == 200:
        data = r_graph.json()
        report["graph_nodes_count"] = len(data.get("nodes", []))
        report["graph_edges_count"] = len(data.get("edges", []))
    else:
        report["graph_status"] = r_graph.status_code

    # Scenarios & Disruptions & Impact & Recovery
    scen_id = "SCEN-VERIFY-1"
    r_scen = client.post("/api/v1/scenarios", json={"scenario_id": scen_id, "name": "Verification Scenario"})
    report["scenario_created"] = r_scen.status_code == 200
    
    disrupt_data = {
        "disruption_id": "DIS-VERIFY-1",
        "type": "SUPPLIER_FAILURE",
        "severity": "CRITICAL",
        "target_entity_id": "SUP-001",
        "target_entity_type": "Supplier",
        "description": "Black-box verification",
        "start_time": "2026-08-31T00:00:00Z"
    }
    r_dis = client.post(f"/api/v1/scenarios/{scen_id}/disruptions", json=disrupt_data)
    report["disruption_created"] = r_dis.status_code == 200

    # Impact
    r_impact = client.get(f"/api/v1/scenarios/{scen_id}/impact")
    if r_impact.status_code == 200:
        report["impact_data"] = r_impact.json()
    else:
        report["impact_status"] = r_impact.status_code

    # Recovery
    r_rec = client.get(f"/api/v1/scenarios/{scen_id}/recovery-options")
    if r_rec.status_code == 200:
        report["recovery_data"] = r_rec.json()
    
    # Isolation
    r_sup_check = client.get("/api/v1/suppliers/SUP-001")
    if r_sup_check.status_code == 200:
        report["sup_baseline_status"] = r_sup_check.json().get("status")

    print(json.dumps(report, indent=2))

if __name__ == "__main__":
    run_checks()
