import json
import os
import sys
from datetime import datetime

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app.core.database import SessionLocal, engine
from app.db import models

def load_seed_data(filepath="data/seed_data.json"):
    with open(filepath, "r") as f:
        data = json.load(f)
    return data

def seed_database():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        data = load_seed_data()

        for item in data.get("suppliers", []):
            if not db.query(models.Supplier).filter_by(supplier_id=item["supplier_id"]).first():
                db.add(models.Supplier(**item))
        db.flush()
                
        for item in data.get("materials", []):
            if not db.query(models.Material).filter_by(material_id=item["material_id"]).first():
                db.add(models.Material(**item))
        db.flush()
                
        for item in data.get("supplier_materials", []):
            if not db.query(models.SupplierMaterial).filter_by(supplier_id=item["supplier_id"], material_id=item["material_id"]).first():
                db.add(models.SupplierMaterial(**item))
        db.flush()
                
        for item in data.get("plants", []):
            if not db.query(models.Plant).filter_by(plant_id=item["plant_id"]).first():
                db.add(models.Plant(**item))
        db.flush()

        for item in data.get("products", []):
            if not db.query(models.Product).filter_by(product_id=item["product_id"]).first():
                db.add(models.Product(**item))
        db.flush()

        if not db.query(models.PlantMaterial).first():
            db.add(models.PlantMaterial(plant_id="PLT-001", material_id="MAT-001", required_quantity=1.0))
        db.flush()

        for item in data.get("inventories", []):
            if not db.query(models.Inventory).filter_by(inventory_id=item["inventory_id"]).first():
                db.add(models.Inventory(**item))
        db.flush()
                
        for item in data.get("customers", []):
            if not db.query(models.Customer).filter_by(customer_id=item["customer_id"]).first():
                db.add(models.Customer(**item))
        db.flush()

        for item in data.get("customer_orders", []):
            if not db.query(models.CustomerOrder).filter_by(order_id=item["order_id"]).first():
                item["due_date"] = datetime.fromisoformat(item["due_date"].replace("Z", "+00:00"))
                db.add(models.CustomerOrder(**item))
        db.flush()

        for item in data.get("routes", []):
            if not db.query(models.Route).filter_by(route_id=item["route_id"]).first():
                db.add(models.Route(**item))
        db.flush()
                
        db.commit()
        print("Database seeded successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
