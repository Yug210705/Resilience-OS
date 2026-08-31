from pydantic import BaseModel, Field
from typing import List, Optional

class Supplier(BaseModel):
    id: str = Field(..., description="Supplier unique identifier")
    capacity: int = Field(..., description="Available capacity in units")
    unit_cost: float = Field(..., description="Cost per unit in local currency")
    lead_time_days: float = Field(..., description="Expected delivery delay in days")
    risk_score: float = Field(..., description="Historical supplier risk score (0.0 to 1.0)")

class Order(BaseModel):
    id: str = Field(..., description="Affected customer order ID")
    revenue_at_risk: float = Field(..., description="Total revenue tied to this order")
    sla_penalty: float = Field(..., description="Financial penalty if SLA is breached")

class ShortageData(BaseModel):
    material_id: str = Field(..., description="ID of the material facing shortage")
    shortage_quantity: int = Field(..., description="Total unit shortfall")
    existing_inventory: int = Field(..., description="Currently available inventory units")
    suppliers: List[Supplier] = Field(..., description="Available alternative suppliers")
    affected_orders: List[Order] = Field(..., description="Customer orders at risk")

class RecoveryPlan(BaseModel):
    id: str = Field(..., description="Unique plan identifier")
    suppliers_used: List[str] = Field(..., description="List of supplier IDs used in this plan")
    total_cost: float = Field(..., description="Total cost of executing the plan")
    max_delay_days: float = Field(..., description="Maximum lead time among chosen suppliers")
    blended_risk: float = Field(..., description="Average risk score of chosen suppliers")
    total_sla_exposure: float = Field(..., description="Total remaining SLA penalty risk")
    final_score: float = Field(0.0, description="Computed combinatorial score (lower is better)")
