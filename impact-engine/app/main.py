from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import Base, engine, get_db
from app.schemas import DisruptionRequest, DisruptionResponse
from app.services.impact_service import simulate_disruption, analyze_vulnerabilities

Base.metadata.create_all(bind=engine)

app = FastAPI(title="RESILIENCE OS - IMPACT ENGINE")

@app.post("/api/disruptions/simulate", response_model=DisruptionResponse, summary="Simulate Supply Chain Disruption (Deterministic)")
def simulate(req: DisruptionRequest, db: Session = Depends(get_db)):
    try:
        return simulate_disruption(db, req)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
        
@app.get("/api/supply-chain/graph", summary="Export Full Supply Chain Topology")
def get_graph(db: Session = Depends(get_db)):
    from app.graph.builder import build_supply_chain_graph
    G = build_supply_chain_graph(db)
    nodes = [{"id": n, **G.nodes[n]} for n in G.nodes()]
    edges = [{"source": u, "target": v, "type": G.edges[u,v].get('type')} for u,v in G.edges()]
    return {"nodes": nodes, "edges": edges}

@app.get("/api/supply-chain/vulnerabilities", summary="Run Graph Theory Bottleneck Analysis")
def get_vulnerabilities(db: Session = Depends(get_db)):
    return analyze_vulnerabilities(db)
