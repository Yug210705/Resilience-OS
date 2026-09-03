from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import Base, engine, get_db
from app.schemas import DisruptionRequest, DisruptionResponse
from app.services.impact_service import simulate_disruption, analyze_vulnerabilities

try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: create_all failed (expected if db is managed by other service): {e}")

app = FastAPI(title="RESILIENCE OS - IMPACT ENGINE")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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

@app.get("/api/supply-chain/geojson", summary="Export GeoJSON map for 3D Globe")
def get_geojson(db: Session = Depends(get_db)):
    from app.models import Supplier, Plant, Port
    features = []
    
    def add_feature(entity, type_name, color):
        if entity.lat is not None and entity.lng is not None:
            features.append({
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [entity.lng, entity.lat]},
                "properties": {
                    "id": entity.id,
                    "name": entity.name,
                    "type": type_name,
                    "color": color,
                    "risk": getattr(entity, "risk_score", 0)
                }
            })
            
    for s in db.query(Supplier).all(): add_feature(s, "supplier", "#ff9900")
    for p in db.query(Plant).all(): add_feature(p, "plant", "#00ccff")
    for po in db.query(Port).all(): add_feature(po, "port", "#ff00ff")
    
    return {"type": "FeatureCollection", "features": features}

from fastapi import WebSocket, WebSocketDisconnect
import asyncio

@app.websocket("/ws/disruptions/stream")
async def stream_disruption(websocket: WebSocket, db: Session = Depends(get_db)):
    await websocket.accept()
    try:
        data = await websocket.receive_json()
        req = DisruptionRequest(**data)
        result = simulate_disruption(db, req)
        
        await websocket.send_json({"event": "INITIAL_SHOCK", "node": f"{req.disruption_type}:{req.affected_entity_id}"})
        await asyncio.sleep(1.0)
        
        for shortage in result["recovery_context"]["material_shortages"]:
            await websocket.send_json({
                "event": "MATERIAL_IMPACTED", 
                "material": shortage["material_id"],
                "runway_days": shortage["shortage_start_day"]
            })
            await asyncio.sleep(0.5)
            
        for t in result["timeline"]:
            if t["status"] == "HALTED":
                await websocket.send_json({
                    "event": "PRODUCTION_HALTED",
                    "day": t["day"],
                    "material": t["material_id"]
                })
                await asyncio.sleep(0.3)
                
        for o in result["revenue_impact"]:
            await websocket.send_json({
                "event": "ORDER_AT_RISK",
                "order": o["order_id"],
                "value": o["revenue_at_risk"]
            })
            await asyncio.sleep(0.1)
            
        await websocket.send_json({"event": "SIMULATION_COMPLETE", "summary": result["summary"]})
    except Exception as e:
        await websocket.send_json({"error": str(e)})
    finally:
        await websocket.close()

from app.schemas import MultiDisruptionRequest
from app.services.impact_service import simulate_multi_disruption, run_chaos_monkey

@app.post("/api/war-room/simulate-multi", summary="Simulate Simultaneous Multi-Vector Disruptions")
def war_room_simulate(req: MultiDisruptionRequest, db: Session = Depends(get_db)):
    return simulate_multi_disruption(db, req.disruptions)

@app.post("/api/war-room/chaos-monkey", summary="Unleash the Supply Chain Chaos Monkey")
def unleash_chaos_monkey(db: Session = Depends(get_db)):
    """
    Uses Graph Theory (PageRank) to automatically identify the 3 most critical systemic 
    vulnerabilities in the enterprise, and then simultaneously destroys them (Severity 1.0) 
    to calculate the maximum potential Doomsday impact.
    """
    return run_chaos_monkey(db)
