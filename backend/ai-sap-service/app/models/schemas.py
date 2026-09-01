from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from datetime import datetime

class DisruptionInput(BaseModel):
    type: str
    target: str
    severity: str
    duration_days: float

class DisruptionAnalysis(BaseModel):
    analysis_summary: str
    severity_level: str
    estimated_resolution_days: float

class ImpactInput(BaseModel):
    affected_suppliers: int
    affected_plants: int
    affected_materials: int
    affected_orders: int
    revenue_at_risk: float
    critical_material: str
    inventory_days_remaining: float

class ImpactExplanation(BaseModel):
    impact_narrative: str
    critical_warnings: List[str]

class RecoveryPlanInput(BaseModel):
    id: str
    suppliers_used: List[str]
    cost: float
    delay_days: float
    risk_score: float

class RecoveryRecommendation(BaseModel):
    recommendation: str
    best_plan_id: str

class RiskAudit(BaseModel):
    risk_summary: str
    is_approved: bool

class CounterfactualInput(BaseModel):
    original_plan_id: str
    failed_supplier: str
    remaining_plans: List[RecoveryPlanInput]

class CreateRecoveryPlanRequest(BaseModel):
    disruption_id: str
    material_id: str
    option_id: str

class RecoveryPlanResponse(BaseModel):
    id: str
    disruption_id: str
    strategy: str
    supplier_id: str
    total_cost: float
    max_delay_days: float
    blended_risk: float
    total_sla_exposure: float
    final_score: float
    orders_recovered_pct: Optional[float] = None
    status: str
    created_at: datetime
    details: Optional[Dict[str, Any]] = None

class UpdateStatusRequest(BaseModel):
    status: str