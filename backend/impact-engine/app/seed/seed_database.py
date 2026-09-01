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

    # Transport Routes: Connect ports to plants
    modes = ["SEA", "AIR", "ROAD", "RAIL"]
    route_idx = 1
    for port in ports:
        # Each port connects to 2-3 plants
        dest_plants = random.sample(plants, min(random.randint(2, 3), len(plants)))
        for plant in dest_plants:
            db.add(TransportRoute(
                id=f"ROUTE-{route_idx:03d}",
                origin=port.id,
                destination=plant.id,
                mode=random.choice(modes),
                transit_time_days=random.randint(1, 14),
                capacity_per_day=random.randint(500, 5000),
                risk_score=random.uniform(5, 80),
                status="ACTIVE"
            ))
            route_idx += 1

    db.commit()
    
    # Print dataset stats
    from app.models import TransportRoute as TR
    print("=" * 50)
    print("RESILIENCE OS — DATASET SEEDED")
    print("=" * 50)
    print(f"  Suppliers:           {db.query(Supplier).count()}")
    print(f"  Materials:           {db.query(Material).count()}")
    print(f"  Plants:              {db.query(Plant).count()}")
    print(f"  Products:            {db.query(Product).count()}")
    print(f"  Orders:              {db.query(Order).count()}")
    print(f"  Ports:               {db.query(Port).count()}")
    print(f"  Transport Routes:    {db.query(TR).count()}")
    print(f"  Supplier-Material:   {db.query(SupplierMaterial).count()}")
    print(f"  Product-Material:    {db.query(ProductMaterial).count()}")
    print(f"  Inventory Records:   {db.query(Inventory).count()}")
    print(f"  Random Seed:         42 (deterministic)")
    print("=" * 50)

if __name__ == "__main__":
    seed()
