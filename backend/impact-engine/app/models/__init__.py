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
