from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from .enums import EntityStatus, DisruptionType, DisruptionSeverity, OrderStatus, PlanStatus, ActionType

class Supplier(BaseModel):
    supplier_id: str
    name: str
    location: str
    status: EntityStatus = EntityStatus.ACTIVE
    capacity: Optional[float] = None
    risk_level: Optional[float] = None
    reliability_score: Optional[float] = None

class Material(BaseModel):
    material_id: str
    name: str
    category: Optional[str] = None
    unit: str
    criticality: str

class SupplierMaterial(BaseModel):
    supplier_id: str
    material_id: str
    lead_time_days: int
    cost: Optional[float] = None

class Plant(BaseModel):
    plant_id: str
    name: str
    location: str
    status: EntityStatus = EntityStatus.ACTIVE
    daily_capacity: float

class Product(BaseModel):
    product_id: str
    name: str
    category: Optional[str] = None
    unit: str
    priority_level: int

class PlantMaterial(BaseModel):
    plant_id: str
    material_id: str
    required_quantity: float # per unit of product or per day (simplified for MVP)

class Inventory(BaseModel):
    inventory_id: str
    plant_id: str # Strong relational reference
    material_id: Optional[str] = None
    product_id: Optional[str] = None
    available_quantity: float
    safety_stock: float

class Customer(BaseModel):
    customer_id: str
    name: str
    location: str
    priority_tier: int

class CustomerOrder(BaseModel):
    order_id: str
    customer_id: str
    product_id: str
    quantity: float
    due_date: datetime
    status: OrderStatus = OrderStatus.PENDING
    revenue_value: float

class Route(BaseModel):
    route_id: str
    source_id: str
    target_id: str
    transport_mode: str
    transit_time_days: int
    cost: Optional[float] = None
    status: EntityStatus = EntityStatus.ACTIVE

class Disruption(BaseModel):
    disruption_id: str
    scenario_id: str
    type: DisruptionType
    severity: DisruptionSeverity
    target_entity_id: str
    target_entity_type: str
    description: str
    start_time: datetime
    estimated_duration_days: Optional[int] = None
    status: EntityStatus = EntityStatus.ACTIVE

class Scenario(BaseModel):
    scenario_id: str
    name: str
    status: EntityStatus = EntityStatus.ACTIVE
    created_at: datetime = Field(default_factory=datetime.utcnow)

class RecoveryPlan(BaseModel):
    plan_id: str
    scenario_id: str
    description: str
    action_type: ActionType
    action_details: Dict[str, Any]
    estimated_cost: float
    mitigated_risk_value: float
    status: PlanStatus = PlanStatus.DRAFT
    ai_reasoning: Optional[str] = None
