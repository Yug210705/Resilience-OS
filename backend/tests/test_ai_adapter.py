import pytest
from app.ai.adapter import AIAdapter
from app.ai.contracts import (
    AIRequestPayload, AIResponsePayload, AIRecommendationDetails, 
    DisruptionInfo, ImpactInfo, EvaluatedOption
)
from app.ai.provider import AIProvider
from app.ai.exceptions import AIProviderUnavailableError, AIHallucinationError
from app.core.config import settings

class FakeValidAIProvider(AIProvider):
    def evaluate_recovery(self, request: AIRequestPayload) -> AIResponsePayload:
        # Return exactly what was provided to simulate a valid response
        return AIResponsePayload(
            recommendations=[
                AIRecommendationDetails(
                    action_type="ALTERNATIVE_SUPPLIER",
                    details={"supplier_id": "SUP-002", "material_id": "MAT-001"},
                    confidence_score=0.95,
                    reasoning="Valid reasoning."
                )
            ]
        )

class FakeHallucinatingAIProvider(AIProvider):
    def evaluate_recovery(self, request: AIRequestPayload) -> AIResponsePayload:
        return AIResponsePayload(
            recommendations=[
                AIRecommendationDetails(
                    action_type="ALTERNATIVE_SUPPLIER",
                    details={"supplier_id": "SUP-999", "material_id": "MAT-001"},
                    confidence_score=0.99,
                    reasoning="I hallucinated this supplier."
                )
            ]
        )

def get_base_request() -> AIRequestPayload:
    return AIRequestPayload(
        scenario_id="TEST-1",
        disruption=DisruptionInfo(type="SUPPLIER_FAILURE", target_id="SUP-001", target_type="Supplier"),
        impact=ImpactInfo(revenue_at_risk=1000000.0, delayed_orders=["ORD-001"]),
        evaluated_options=[
            EvaluatedOption(
                action_type="ALTERNATIVE_SUPPLIER",
                details={"supplier_id": "SUP-002", "material_id": "MAT-001"},
                estimated_cost=18000.0,
                mitigated_risk_value=1000000.0
            )
        ]
    )

def test_ai_provider_not_configured():
    # Force settings off
    settings.AI_PROVIDER_ENABLED = False
    adapter = AIAdapter(provider=FakeValidAIProvider())
    with pytest.raises(AIProviderUnavailableError):
        adapter.get_recommendations(get_base_request())

def test_ai_provider_valid_response():
    settings.AI_PROVIDER_ENABLED = True
    adapter = AIAdapter(provider=FakeValidAIProvider())
    
    response = adapter.get_recommendations(get_base_request())
    assert len(response.recommendations) == 1
    assert response.recommendations[0].action_type == "ALTERNATIVE_SUPPLIER"
    assert response.recommendations[0].details["supplier_id"] == "SUP-002"

def test_ai_provider_hallucination_rejected():
    settings.AI_PROVIDER_ENABLED = True
    adapter = AIAdapter(provider=FakeHallucinatingAIProvider())
    
    with pytest.raises(AIHallucinationError):
        adapter.get_recommendations(get_base_request())
