from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.db import models

router = APIRouter()

@router.get("/suppliers")
def get_suppliers(db: Session = Depends(get_db)):
    return db.query(models.Supplier).all()

@router.get("/materials")
def get_materials(db: Session = Depends(get_db)):
    return db.query(models.Material).all()

@router.get("/plants")
def get_plants(db: Session = Depends(get_db)):
    return db.query(models.Plant).all()

@router.get("/products")
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()

@router.get("/customers")
def get_customers(db: Session = Depends(get_db)):
    return db.query(models.Customer).all()

@router.get("/orders")
def get_orders(db: Session = Depends(get_db)):
    return db.query(models.CustomerOrder).all()

@router.get("/routes")
def get_routes(db: Session = Depends(get_db)):
    return db.query(models.Route).all()

@router.get("/suppliers/{supplier_id}")
def get_supplier(supplier_id: str, db: Session = Depends(get_db)):
    sup = db.query(models.Supplier).filter(models.Supplier.supplier_id == supplier_id).first()
    if not sup: raise HTTPException(status_code=404, detail="Supplier not found")
    return sup
