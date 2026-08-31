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
