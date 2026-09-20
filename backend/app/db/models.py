import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

from sqlalchemy import Column, String, Integer, Float, DateTime, Enum as SQLEnum, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base
from domain.enums import EntityStatus, DisruptionType, DisruptionSeverity, OrderStatus, PlanStatus, ActionType

class Supplier(Base):
    __tablename__ = "res_suppliers"
    supplier_id = Column(String(255), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    status = Column(SQLEnum(EntityStatus), default=EntityStatus.ACTIVE)
    capacity = Column(Float, nullable=True)
    risk_level = Column(Float, nullable=True)
    reliability_score = Column(Float, nullable=True)

class Material(Base):
    __tablename__ = "res_materials"
    material_id = Column(String(255), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(255), nullable=True)
    unit = Column(String(255), nullable=False)
    criticality = Column(String(255), nullable=False)

class SupplierMaterial(Base):
    __tablename__ = "res_supplier_materials"
    id = Column(Integer, primary_key=True, autoincrement=True)
    supplier_id = Column(String(255), ForeignKey("res_suppliers.supplier_id"))
    material_id = Column(String(255), ForeignKey("res_materials.material_id"))
    lead_time_days = Column(Integer, nullable=False)
    cost = Column(Float, nullable=True)

class Plant(Base):
    __tablename__ = "res_plants"
    plant_id = Column(String(255), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    status = Column(SQLEnum(EntityStatus), default=EntityStatus.ACTIVE)
    daily_capacity = Column(Float, nullable=False)

class Product(Base):
    __tablename__ = "res_products"
    product_id = Column(String(255), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(255), nullable=True)
    unit = Column(String(255), nullable=False)
    priority_level = Column(Integer, nullable=False)

class PlantMaterial(Base):
    __tablename__ = "res_plant_materials"
    id = Column(Integer, primary_key=True, autoincrement=True)
    plant_id = Column(String(255), ForeignKey("res_plants.plant_id"))
    material_id = Column(String(255), ForeignKey("res_materials.material_id"))
    required_quantity = Column(Float, nullable=False, default=1.0)

class Inventory(Base):
    __tablename__ = "res_inventories"
    inventory_id = Column(String(255), primary_key=True, index=True)
    plant_id = Column(String(255), ForeignKey("res_plants.plant_id"), nullable=False)
    material_id = Column(String(255), ForeignKey("res_materials.material_id"), nullable=True)
    product_id = Column(String(255), ForeignKey("res_products.product_id"), nullable=True)
    available_quantity = Column(Float, nullable=False)
    safety_stock = Column(Float, nullable=False)

class Customer(Base):
    __tablename__ = "res_customers"
    customer_id = Column(String(255), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    priority_tier = Column(Integer, nullable=False)

class CustomerOrder(Base):
    __tablename__ = "res_customer_orders"
    order_id = Column(String(255), primary_key=True, index=True)
    customer_id = Column(String(255), ForeignKey("res_customers.customer_id"))
    product_id = Column(String(255), ForeignKey("res_products.product_id"))
    quantity = Column(Float, nullable=False)
    due_date = Column(DateTime, nullable=False)
    status = Column(SQLEnum(OrderStatus), default=OrderStatus.PENDING)
    revenue_value = Column(Float, nullable=False)

class Route(Base):
    __tablename__ = "res_routes"
    route_id = Column(String(255), primary_key=True, index=True)
    source_id = Column(String(255), nullable=False)
    target_id = Column(String(255), nullable=False)
    transport_mode = Column(String(255), nullable=False)
    transit_time_days = Column(Integer, nullable=False)
    cost = Column(Float, nullable=True)
    status = Column(SQLEnum(EntityStatus), default=EntityStatus.ACTIVE)

class Scenario(Base):
    __tablename__ = "res_scenarios"
    scenario_id = Column(String(255), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    status = Column(SQLEnum(EntityStatus), default=EntityStatus.ACTIVE)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    disruptions = relationship("Disruption", back_populates="scenario")
    recovery_plans = relationship("RecoveryPlan", back_populates="scenario")
    audit_records = relationship("AuditRecord", back_populates="scenario")

class Disruption(Base):
    __tablename__ = "res_disruptions"
    disruption_id = Column(String(255), primary_key=True, index=True)
    scenario_id = Column(String(255), ForeignKey("res_scenarios.scenario_id"))
    type = Column(SQLEnum(DisruptionType), nullable=False)
    severity = Column(SQLEnum(DisruptionSeverity), nullable=False)
    target_entity_id = Column(String(255), nullable=False)
    target_entity_type = Column(String(255), nullable=False)
    description = Column(String(255), nullable=False)
    start_time = Column(DateTime, nullable=False)
    estimated_duration_days = Column(Integer, nullable=True)
    status = Column(SQLEnum(EntityStatus), default=EntityStatus.ACTIVE)
    
    scenario = relationship("Scenario", back_populates="disruptions")

class RecoveryPlan(Base):
    __tablename__ = "res_recovery_plans"
    plan_id = Column(String(255), primary_key=True, index=True)
    scenario_id = Column(String(255), ForeignKey("res_scenarios.scenario_id"))
    description = Column(String(255), nullable=False)
    action_type = Column(SQLEnum(ActionType), nullable=False)
    action_details = Column(String(255), nullable=False) # JSON string
    estimated_cost = Column(Float, nullable=False)
    mitigated_risk_value = Column(Float, nullable=False)
    status = Column(SQLEnum(PlanStatus), default=PlanStatus.DRAFT)
    ai_reasoning = Column(String(255), nullable=True)
    
    scenario = relationship("Scenario", back_populates="recovery_plans")

class AuditRecord(Base):
    __tablename__ = "res_audit_records"
    audit_id = Column(String(255), primary_key=True, index=True)
    scenario_id = Column(String(255), ForeignKey("res_scenarios.scenario_id"))
    recovery_plan_id = Column(String(255), ForeignKey("res_recovery_plans.plan_id"))
    action = Column(String(255), nullable=False) # e.g. APPROVED, REJECTED
    timestamp = Column(DateTime, default=datetime.utcnow)
    details = Column(String(255), nullable=True) # JSON string with SAP transaction info, AI confidence, etc.
    
    scenario = relationship("Scenario", back_populates="audit_records")

