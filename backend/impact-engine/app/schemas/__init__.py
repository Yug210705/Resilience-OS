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

class MultiDisruptionRequest(BaseModel):
    name: str = "The Perfect Storm"
    disruptions: List[DisruptionRequest]
