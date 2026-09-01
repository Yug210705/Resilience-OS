import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

from sqlalchemy import Column, String, Integer, Float, DateTime, Enum as SQLEnum, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base
from backend.domain.enums import EntityStatus, DisruptionType, DisruptionSeverity, OrderStatus, PlanStatus, ActionType

class Supplier(Base):
    __tablename__ = "suppliers"
    supplier_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    status = Column(SQLEnum(EntityStatus), default=EntityStatus.ACTIVE)
    capacity = Column(Float, nullable=True)
    risk_level = Column(Float, nullable=True)
    reliability_score = Column(Float, nullable=True)

class Material(Base):
    __tablename__ = "materials"
    material_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=True)
    unit = Column(String, nullable=False)
    criticality = Column(String, nullable=False)

class SupplierMaterial(Base):
    __tablename__ = "supplier_materials"
    id = Column(Integer, primary_key=True, autoincrement=True)
    supplier_id = Column(String, ForeignKey("suppliers.supplier_id"))
    material_id = Column(String, ForeignKey("materials.material_id"))
    lead_time_days = Column(Integer, nullable=False)
    cost = Column(Float, nullable=True)

class Plant(Base):
    __tablename__ = "plants"
    plant_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    status = Column(SQLEnum(EntityStatus), default=EntityStatus.ACTIVE)
    daily_capacity = Column(Float, nullable=False)

class Product(Base):
    __tablename__ = "products"
    product_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=True)
    unit = Column(String, nullable=False)
    priority_level = Column(Integer, nullable=False)

class PlantMaterial(Base):
    __tablename__ = "plant_materials"
    id = Column(Integer, primary_key=True, autoincrement=True)
    plant_id = Column(String, ForeignKey("plants.plant_id"))
    material_id = Column(String, ForeignKey("materials.material_id"))
    required_quantity = Column(Float, nullable=False, default=1.0)

class Inventory(Base):
    __tablename__ = "inventories"
    inventory_id = Column(String, primary_key=True, index=True)
    plant_id = Column(String, ForeignKey("plants.plant_id"), nullable=False)
    material_id = Column(String, ForeignKey("materials.material_id"), nullable=True)
    product_id = Column(String, ForeignKey("products.product_id"), nullable=True)
    available_quantity = Column(Float, nullable=False)
    safety_stock = Column(Float, nullable=False)

class Customer(Base):
    __tablename__ = "customers"
    customer_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    priority_tier = Column(Integer, nullable=False)

class CustomerOrder(Base):
    __tablename__ = "customer_orders"
    order_id = Column(String, primary_key=True, index=True)
    customer_id = Column(String, ForeignKey("customers.customer_id"))
    product_id = Column(String, ForeignKey("products.product_id"))
    quantity = Column(Float, nullable=False)
    due_date = Column(DateTime, nullable=False)
    status = Column(SQLEnum(OrderStatus), default=OrderStatus.PENDING)
    revenue_value = Column(Float, nullable=False)

class Route(Base):
    __tablename__ = "routes"
    route_id = Column(String, primary_key=True, index=True)
    source_id = Column(String, nullable=False)
    target_id = Column(String, nullable=False)
    transport_mode = Column(String, nullable=False)
    transit_time_days = Column(Integer, nullable=False)
    cost = Column(Float, nullable=True)
    status = Column(SQLEnum(EntityStatus), default=EntityStatus.ACTIVE)

class Scenario(Base):
    __tablename__ = "scenarios"
    scenario_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    status = Column(SQLEnum(EntityStatus), default=EntityStatus.ACTIVE)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    disruptions = relationship("Disruption", back_populates="scenario")
    recovery_plans = relationship("RecoveryPlan", back_populates="scenario")
    audit_records = relationship("AuditRecord", back_populates="scenario")

class Disruption(Base):
    __tablename__ = "disruptions"
    disruption_id = Column(String, primary_key=True, index=True)
    scenario_id = Column(String, ForeignKey("scenarios.scenario_id"))
    type = Column(SQLEnum(DisruptionType), nullable=False)
    severity = Column(SQLEnum(DisruptionSeverity), nullable=False)
    target_entity_id = Column(String, nullable=False)
    target_entity_type = Column(String, nullable=False)
    description = Column(String, nullable=False)
    start_time = Column(DateTime, nullable=False)
    estimated_duration_days = Column(Integer, nullable=True)
    status = Column(SQLEnum(EntityStatus), default=EntityStatus.ACTIVE)
    
    scenario = relationship("Scenario", back_populates="disruptions")

class RecoveryPlan(Base):
    __tablename__ = "recovery_plans"
    plan_id = Column(String, primary_key=True, index=True)
    scenario_id = Column(String, ForeignKey("scenarios.scenario_id"))
    description = Column(String, nullable=False)
    action_type = Column(SQLEnum(ActionType), nullable=False)
    action_details = Column(String, nullable=False) # JSON string
    estimated_cost = Column(Float, nullable=False)
    mitigated_risk_value = Column(Float, nullable=False)
    status = Column(SQLEnum(PlanStatus), default=PlanStatus.DRAFT)
    ai_reasoning = Column(String, nullable=True)
    
    scenario = relationship("Scenario", back_populates="recovery_plans")

class AuditRecord(Base):
    __tablename__ = "audit_records"
    audit_id = Column(String, primary_key=True, index=True)
    scenario_id = Column(String, ForeignKey("scenarios.scenario_id"))
    recovery_plan_id = Column(String, ForeignKey("recovery_plans.plan_id"))
    action = Column(String, nullable=False) # e.g. APPROVED, REJECTED
    timestamp = Column(DateTime, default=datetime.utcnow)
    details = Column(String, nullable=True) # JSON string with SAP transaction info, AI confidence, etc.
    
    scenario = relationship("Scenario", back_populates="audit_records")

