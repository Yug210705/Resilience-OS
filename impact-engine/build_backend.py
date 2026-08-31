import os

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content.strip() + "\n")

# ==========================================
# CORE
# ==========================================
write_file("app/core/database.py", """
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./resilience.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
""")

# ==========================================
# MODELS
# ==========================================
write_file("app/models/__init__.py", """
from app.core.database import Base
from sqlalchemy import Column, String, Integer, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship

class Supplier(Base):
    __tablename__ = 'suppliers'
    id = Column(String, primary_key=True)
    name = Column(String)
    country = Column(String)
    region = Column(String)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    risk_score = Column(Float)
    reliability_score = Column(Float)
    primary_port_id = Column(String, ForeignKey('ports.id'))
    status = Column(String)
    materials = relationship("SupplierMaterial", back_populates="supplier")

class Material(Base):
    __tablename__ = 'materials'
    id = Column(String, primary_key=True)
    name = Column(String)
    category = Column(String)
    criticality = Column(String)
    safety_stock = Column(Integer)
    suppliers = relationship("SupplierMaterial", back_populates="material")

class SupplierMaterial(Base):
    __tablename__ = 'supplier_materials'
    supplier_id = Column(String, ForeignKey('suppliers.id'), primary_key=True)
    material_id = Column(String, ForeignKey('materials.id'), primary_key=True)
    capacity_per_day = Column(Integer)
    lead_time_days = Column(Integer)
    unit_cost = Column(Float)
    is_primary = Column(Boolean)
    supplier = relationship("Supplier", back_populates="materials")
    material = relationship("Material", back_populates="suppliers")

class Plant(Base):
    __tablename__ = 'plants'
    id = Column(String, primary_key=True)
    name = Column(String)
    city = Column(String)
    country = Column(String)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    daily_capacity = Column(Integer)
    status = Column(String)

class Product(Base):
    __tablename__ = 'products'
    id = Column(String, primary_key=True)
    name = Column(String)
    category = Column(String)
    unit_price = Column(Float)
    plant_id = Column(String, ForeignKey('plants.id'))
    daily_production_capacity = Column(Integer)
    criticality = Column(String)
    plant = relationship("Plant")
    materials = relationship("ProductMaterial", back_populates="product")

class ProductMaterial(Base):
    __tablename__ = 'product_materials'
    product_id = Column(String, ForeignKey('products.id'), primary_key=True)
    material_id = Column(String, ForeignKey('materials.id'), primary_key=True)
    quantity_required = Column(Integer)
    product = relationship("Product", back_populates="materials")
    material = relationship("Material")

class Order(Base):
    __tablename__ = 'orders'
    id = Column(String, primary_key=True)
    customer_id = Column(String)
    product_id = Column(String, ForeignKey('products.id'))
    quantity = Column(Integer)
    unit_price = Column(Float)
    order_value = Column(Float)
    order_date = Column(String)
    required_delivery_date = Column(String)
    priority = Column(String)
    status = Column(String)
    product = relationship("Product")

class Inventory(Base):
    __tablename__ = 'inventory'
    id = Column(String, primary_key=True)
    plant_id = Column(String, ForeignKey('plants.id'))
    material_id = Column(String, ForeignKey('materials.id'))
    on_hand_quantity = Column(Integer)
    reserved_quantity = Column(Integer)
    safety_stock = Column(Integer)

class Port(Base):
    __tablename__ = 'ports'
    id = Column(String, primary_key=True)
    name = Column(String)
    country = Column(String)
    region = Column(String)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    risk_score = Column(Float)

class TransportRoute(Base):
    __tablename__ = 'transport_routes'
    id = Column(String, primary_key=True)
    origin = Column(String)
    destination = Column(String)
    mode = Column(String)
    transit_time_days = Column(Integer)
    capacity_per_day = Column(Integer)
    risk_score = Column(Float)
    status = Column(String)
""")

# ==========================================
# SCHEMAS
# ==========================================
write_file("app/schemas/__init__.py", """
from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class DisruptionRequest(BaseModel):
    disruption_type: str = Field(..., description="supplier, material, plant, port, transport_route")
    affected_entity_id: str
    severity: float = Field(..., ge=0, le=1)
    duration_days: int = Field(..., gt=0)

class RecoveryContextShortage(BaseModel):
    material_id: str
    shortage_quantity: int
    shortage_per_day: float
    shortage_start_day: float
    duration_days: int
    current_supplier_capacity: int
    normal_demand_per_day: int
    single_source: bool
    alternative_supplier_ids: List[str]

class RecoveryContextSupplier(BaseModel):
    supplier_id: str
    material_id: str
    capacity_per_day: int
    lead_time_days: int
    unit_cost: float
    risk_score: float

class RecoveryContextOrder(BaseModel):
    order_id: str
    product_id: str
    shortfall_quantity: int
    revenue_at_risk: float

class RecoveryContext(BaseModel):
    material_shortages: List[RecoveryContextShortage]
    supplier_options: List[RecoveryContextSupplier]
    affected_orders: List[RecoveryContextOrder]

class AIContextSituation(BaseModel):
    disruption_type: str
    entity_id: str
    severity: float
    duration_days: int

class AIContextImpactSummary(BaseModel):
    affected_materials: int
    affected_plants: int
    affected_products: int
    affected_orders: int
    revenue_at_risk: float

class AIContext(BaseModel):
    situation: AIContextSituation
    impact_summary: AIContextImpactSummary
    critical_dependencies: List[str] = []
    inventory_exposure: List[str] = []
    production_exposure: List[str] = []
    revenue_exposure: List[str] = []

class DisruptionResponse(BaseModel):
    simulation_id: str
    disruption: dict
    summary: dict
    affected_suppliers: List[dict]
    affected_materials: List[dict]
    affected_plants: List[dict]
    affected_products: List[dict]
    affected_orders: List[dict]
    inventory_impact: List[dict]
    production_impact: List[dict]
    revenue_impact: List[dict]
    dependency_paths: List[dict]
    timeline: List[dict]
    risk_analysis: dict
    recovery_context: RecoveryContext
    ai_context: AIContext
""")

# ==========================================
# GRAPH BUILDER
# ==========================================
write_file("app/graph/builder.py", """
import networkx as nx
from sqlalchemy.orm import Session
from app.models import Supplier, Material, SupplierMaterial, Plant, Product, ProductMaterial, Order, Port, TransportRoute

def build_supply_chain_graph(db: Session) -> nx.DiGraph:
    G = nx.DiGraph()
    
    for s in db.query(Supplier).all():
        G.add_node(f"supplier:{s.id}", type="supplier", label=s.name, risk=s.risk_score)
        if s.primary_port_id:
            G.add_edge(f"supplier:{s.id}", f"port:{s.primary_port_id}", type="USES_PORT")
            
    for p in db.query(Port).all():
        G.add_node(f"port:{p.id}", type="port", label=p.name, risk=p.risk_score)
        
    for r in db.query(TransportRoute).all():
        G.add_node(f"route:{r.id}", type="route", label=f"{r.origin} to {r.destination}", risk=r.risk_score)
        if r.origin.startswith("PORT"):
            G.add_edge(f"port:{r.origin}", f"route:{r.id}", type="USES_ROUTE")
            
    for m in db.query(Material).all():
        G.add_node(f"material:{m.id}", type="material", label=m.name)
        
    for sm in db.query(SupplierMaterial).all():
        G.add_edge(f"supplier:{sm.supplier_id}", f"material:{sm.material_id}", type="SUPPLIES", capacity=sm.capacity_per_day)
        
    for p in db.query(Plant).all():
        G.add_node(f"plant:{p.id}", type="plant", label=p.name)
        
    for pr in db.query(Product).all():
        G.add_node(f"product:{pr.id}", type="product", label=pr.name)
        G.add_edge(f"plant:{pr.plant_id}", f"product:{pr.id}", type="PRODUCES")
        
    for pm in db.query(ProductMaterial).all():
        G.add_edge(f"material:{pm.material_id}", f"product:{pm.product_id}", type="CONSUMES", qty=pm.quantity_required)
        
    for o in db.query(Order).all():
        G.add_node(f"order:{o.id}", type="order", label=o.id, qty=o.quantity, val=o.order_value)
        G.add_edge(f"product:{o.product_id}", f"order:{o.id}", type="FULFILLS")
        
    return G
""")

# ==========================================
# SERVICES
# ==========================================
write_file("app/services/impact_service.py", """
from sqlalchemy.orm import Session
import networkx as nx
from app.graph.builder import build_supply_chain_graph
from app.models import Supplier, Material, SupplierMaterial, Plant, Product, ProductMaterial, Order, Inventory
import uuid

def analyze_vulnerabilities(db: Session):
    G = build_supply_chain_graph(db)
    bc = nx.betweenness_centrality(G)
    pr = nx.pagerank(G, alpha=0.85)
    nodes = []
    for n in G.nodes():
        node_data = G.nodes[n]
        if node_data.get("type") in ["supplier", "material", "port", "plant"]:
            nodes.append({
                "entity_id": n,
                "type": node_data.get("type"),
                "name": node_data.get("label", n),
                "bottleneck_score": round(bc.get(n, 0) * 100, 2),
                "systemic_importance_score": round(pr.get(n, 0) * 100, 2),
                "inherent_risk": node_data.get("risk", 0.0)
            })
    return {
        "analysis_type": "Network Topology Vulnerability",
        "top_bottlenecks": sorted(nodes, key=lambda x: x["bottleneck_score"], reverse=True)[:10],
        "top_systemic_risks": sorted(nodes, key=lambda x: x["systemic_importance_score"], reverse=True)[:10]
    }

def simulate_disruption(db: Session, req):
    G = build_supply_chain_graph(db)
    start_node = f"{req.disruption_type}:{req.affected_entity_id}"
    if start_node not in G:
        raise ValueError("Entity not found in graph")
        
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
    timeline = []
    
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
            
            # Generate Day-by-Day Timeline Cascade
            current_inv = avail_inv
            for day in range(1, req.duration_days + 1):
                production_status = "NORMAL"
                daily_loss = 0
                
                current_inv += disrupted_cap
                if current_inv >= demand:
                    current_inv -= demand
                else:
                    production_status = "HALTED"
                    daily_loss = demand - current_inv
                    current_inv = 0
                    
                timeline.append({
                    "day": day,
                    "material_id": mat_id,
                    "inventory_eod": current_inv,
                    "status": production_status,
                    "shortfall_units": int(daily_loss)
                })
            
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

    total_prod_loss = sum(t["shortfall_units"] for t in timeline)
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
        "timeline": timeline,
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
""")

# ==========================================
# MAIN & ROUTES
# ==========================================
write_file("app/main.py", """
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

""")

# ==========================================
# SEEDER
# ==========================================
write_file("app/seed/seed_database.py", """
import random
from app.core.database import SessionLocal, Base, engine
from app.models import Supplier, Material, SupplierMaterial, Plant, Product, ProductMaterial, Order, Inventory, Port, TransportRoute

def seed():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    random.seed(42)
    
    # Ports
    ports = []
    for i in range(1, 11):
        p = Port(id=f"PORT-{i:03d}", name=f"Port {i}", country="Global", region="Region", lat=random.uniform(-90, 90), lng=random.uniform(-180, 180), risk_score=random.uniform(10, 90))
        db.add(p)
        ports.append(p)
    
    # Suppliers
    suppliers = []
    for i in range(1, 26):
        s = Supplier(id=f"SUP-{i:03d}", name=f"Supplier {i}", country="Country", region="Region", lat=random.uniform(-90, 90), lng=random.uniform(-180, 180), risk_score=random.uniform(10, 90), reliability_score=random.uniform(50, 100), primary_port_id=ports[i%10].id, status="ACTIVE")
        db.add(s)
        suppliers.append(s)
        
    # Materials
    mats = []
    for i in range(1, 16):
        m = Material(id=f"MAT-{i:03d}", name=f"Material {i}", category="Component", criticality="HIGH", safety_stock=1000)
        db.add(m)
        mats.append(m)
        
    # SupplierMaterial
    for m in mats:
        # 30% single source
        count = 1 if random.random() < 0.3 else random.randint(2, 4)
        chosen = random.sample(suppliers, count)
        for idx, s in enumerate(chosen):
            db.add(SupplierMaterial(supplier_id=s.id, material_id=m.id, capacity_per_day=random.randint(100, 1000), lead_time_days=random.randint(2, 14), unit_cost=random.uniform(5.0, 500.0), is_primary=(idx==0)))

    # Plants
    plants = []
    for i in range(1, 6):
        p = Plant(id=f"PLANT-{i:03d}", name=f"Plant {i}", city="City", country="Country", lat=random.uniform(-90, 90), lng=random.uniform(-180, 180), daily_capacity=random.randint(1000, 5000), status="ACTIVE")
        db.add(p)
        plants.append(p)
        
    # Products & BOM
    prods = []
    for i in range(1, 13):
        pr = Product(id=f"PR-{i:03d}", name=f"Product {i}", category="Finished Good", unit_price=random.uniform(100, 2000), plant_id=random.choice(plants).id, daily_production_capacity=random.randint(100, 500), criticality="HIGH")
        db.add(pr)
        prods.append(pr)
        # BOM
        for m in random.sample(mats, random.randint(2, 5)):
            db.add(ProductMaterial(product_id=pr.id, material_id=m.id, quantity_required=random.randint(1, 5)))
            
    # Orders
    for i in range(1, 65):
        pr = random.choice(prods)
        qty = random.randint(10, 1000)
        db.add(Order(id=f"ORD-{i:04d}", customer_id=f"CUST-{random.randint(1,20)}", product_id=pr.id, quantity=qty, unit_price=pr.unit_price, order_value=qty * pr.unit_price, order_date="2026-08-01", required_delivery_date="2026-08-15", priority="HIGH", status="PENDING"))
        
    # Inventory
    for p in plants:
        for m in mats:
            db.add(Inventory(id=f"INV-{p.id}-{m.id}", plant_id=p.id, material_id=m.id, on_hand_quantity=random.randint(1000, 10000), reserved_quantity=random.randint(0, 500), safety_stock=500))

    db.commit()
    print("Database seeded deterministically with 42 seed.")

if __name__ == "__main__":
    seed()
""")

# ==========================================
# TESTS
# ==========================================
write_file("tests/test_determinism.py", """
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_determinism():
    payload = {
        "disruption_type": "supplier",
        "affected_entity_id": "SUP-007",
        "severity": 1.0,
        "duration_days": 10
    }
    r1 = client.post("/api/disruptions/simulate", json=payload).json()
    r2 = client.post("/api/disruptions/simulate", json=payload).json()
    
    r1.pop('simulation_id', None)
    r2.pop('simulation_id', None)
    
    assert r1 == r2, "Engine must be perfectly deterministic"
""")

write_file("tests/test_graph.py", """
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_graph():
    r = client.get("/api/supply-chain/graph")
    assert r.status_code == 200
    data = r.json()
    assert "nodes" in data
    assert "edges" in data
    assert len(data["nodes"]) > 0
""")
