from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class DisruptionInfo(BaseModel):
    type: str
    target_id: str
    target_type: str

class ImpactInfo(BaseModel):
    revenue_at_risk: float
    delayed_orders: List[str]

class EvaluatedOption(BaseModel):
    action_type: str
    details: Dict[str, Any]
    estimated_cost: float
    mitigated_risk_value: float

class AIRequestPayload(BaseModel):
    scenario_id: str
    disruption: DisruptionInfo
    impact: ImpactInfo
    evaluated_options: List[EvaluatedOption]

class AIRecommendationDetails(BaseModel):
    action_type: str
    details: Dict[str, Any]
    confidence_score: float = Field(ge=0.0, le=1.0)
    reasoning: str

class AIResponsePayload(BaseModel):
    recommendations: List[AIRecommendationDetails]
