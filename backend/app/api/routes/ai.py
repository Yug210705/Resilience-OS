from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.core.database import get_db
from app.db.models import Scenario
from app.engines.impact_engine import calculate_impact
from app.engines.recovery_engine import generate_recovery_options
from app.ai.adapter import AIAdapter
from app.ai.provider import Member3AIProvider
from app.ai.contracts import AIRequestPayload, DisruptionInfo, ImpactInfo, EvaluatedOption
from app.ai.exceptions import AIIntegrationError, AIProviderUnavailableError

router = APIRouter()

# Note: In a production environment, the provider would be injected via FastAPI dependencies
ai_adapter = AIAdapter(provider=Member3AIProvider())

@router.post("/{scenario_id}/ai-recommendation")
def get_ai_recommendation(scenario_id: str = Path(...), db: Session = Depends(get_db)):
    """
    Generate AI recommendations for a disrupted scenario.
    This orchestrates the deterministic engines and forwards the feasible options to the AI boundary.
    """
    scenario = db.query(Scenario).filter(Scenario.scenario_id == scenario_id).first()
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")
        
    if not scenario.disruptions:
        raise HTTPException(status_code=400, detail="Scenario has no active disruptions")
        
    disruption = scenario.disruptions[0]
    
    # 1. Deterministic Impact
    impact_res = calculate_impact(scenario_id, db)
    
    # 2. Deterministic Recovery Options
    recovery_res = generate_recovery_options(scenario_id, db)
    feasible_options = recovery_res["options"]
    
    # 3. Construct AI Contract Payload
    options_payload = []
    for opt in feasible_options:
        options_payload.append(
            EvaluatedOption(
                action_type=opt["action_type"],
                details=opt["details"],
                estimated_cost=opt["estimated_cost"],
                mitigated_risk_value=opt["expected_revenue_protected"]
            )
        )
        
    request_payload = AIRequestPayload(
        scenario_id=scenario_id,
        disruption=DisruptionInfo(
            type=disruption.type,
            target_id=disruption.target_entity_id,
            target_type=disruption.target_entity_type
        ),
        impact=ImpactInfo(
            revenue_at_risk=impact_res["revenue_at_risk"],
            delayed_orders=impact_res["affected_orders"]
        ),
        evaluated_options=options_payload
    )
    
    # 4. Pass through AI Boundary
    try:
        ai_response = ai_adapter.get_recommendations(request_payload)
        return ai_response.model_dump()
    except AIProviderUnavailableError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except AIIntegrationError as e:
        raise HTTPException(status_code=422, detail=str(e))
