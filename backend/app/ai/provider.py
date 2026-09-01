from abc import ABC, abstractmethod
from .contracts import AIRequestPayload, AIResponsePayload

class AIProvider(ABC):
    """
    Stable internal interface for AI recommendations.
    Member 4 will implement a concrete version of this provider.
    """
    
    @abstractmethod
    def evaluate_recovery(self, request: AIRequestPayload) -> AIResponsePayload:
        pass
import httpx
from .exceptions import AIProviderUnavailableError

class Member3AIProvider(AIProvider):
    def __init__(self, base_url="http://127.0.0.1:8002"):
        self.base_url = base_url

    def evaluate_recovery(self, request: AIRequestPayload) -> AIResponsePayload:
        recommendations = []
        for opt in request.evaluated_options:
            # Map EvaluatedOption to Member 3's RecoveryPlan
            payload = {
                "id": opt.action_type,  # Just string map
                "suppliers_used": [opt.details.get("supplier_id", "UNKNOWN")] if "supplier_id" in opt.details else [],
                "total_cost": opt.estimated_cost,
                "max_delay_days": opt.details.get("delay_days", 0),
                "blended_risk": 0.5,
                "total_sla_exposure": request.impact.revenue_at_risk,
                "final_score": 0.0
            }
            try:
                # Call Member 3's evaluate endpoint
                response = httpx.post(f"{self.base_url}/evaluate-options", json=payload, timeout=15.0)
                response.raise_for_status()
                data = response.json()
                
                recommendations.append({
                    "action_type": opt.action_type,
                    "details": opt.details,
                    "confidence_score": 0.9 if not data.get("guardrail_stripped") else 0.5,
                    "reasoning": data.get("recommendation", "No reasoning provided.")
                })
            except Exception as e:
                raise AIProviderUnavailableError(f"Failed to call Member 3 AI service: {str(e)}")
                
        return AIResponsePayload(recommendations=recommendations)
