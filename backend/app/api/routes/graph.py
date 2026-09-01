from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.db import models

router = APIRouter()

@router.get("/graph")
def get_graph(db: Session = Depends(get_db)):
    nodes = []
    edges = []

    # Nodes
    for sup in db.query(models.Supplier).all():
        nodes.append({"id": sup.supplier_id, "type": "Supplier", "label": sup.name, "status": sup.status})
    for plt in db.query(models.Plant).all():
        nodes.append({"id": plt.plant_id, "type": "Plant", "label": plt.name, "status": plt.status})
    for cus in db.query(models.Customer).all():
        nodes.append({"id": cus.customer_id, "type": "Customer", "label": cus.name, "status": "ACTIVE"})

    # Edges from explicit Routes
    for rt in db.query(models.Route).all():
        edges.append({
            "id": rt.route_id, 
            "source": rt.source_id, 
            "target": rt.target_id, 
            "relationship_type": "TRANSPORT", 
            "status": rt.status
        })
    
    # Edges from Material flow (Supplier -> Plant implicit via SupplierMaterial/PlantMaterial)
    # Wait, for MVP, we'll just return what's in the route table to avoid duplicating edges
    # The route table already contains SUP-001 -> PLT-001 -> CUS-001
    
    return {"nodes": nodes, "edges": edges}
