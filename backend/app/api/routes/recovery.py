from fastapi import APIRouter, Depends, HTTPException, Path
from pydantic import BaseModel
from typing import Optional, Any
from sqlalchemy.orm import Session
import uuid
import json
from datetime import datetime

from app.core.database import get_db
from app.engines.recovery_engine import generate_recovery_options
from app.db.models import RecoveryPlan, AuditRecord, Scenario
from backend.domain.enums import PlanStatus, ActionType

from app.integrations.sap.adapter import Member3SAPAdapter
from app.integrations.sap.schemas import SAPRecoveryActionRequest

router = APIRouter()
sap_adapter = Member3SAPAdapter()

class CreateRecoveryPlanRequest(BaseModel):
    action_type: str
    details: dict
    estimated_cost: float
    mitigated_risk_value: float
    ai_reasoning: Optional[str] = None
    description: str = "Recovery Plan"

class AuditRecordResponse(BaseModel):
    audit_id: str
    scenario_id: str
    recovery_plan_id: str
    action: str
    timestamp: datetime
    details: Optional[str] = None

@router.get("/{scenario_id}/recovery-options")
def get_recovery_options(scenario_id: str, db: Session = Depends(get_db)):
    return generate_recovery_options(scenario_id, db)

@router.post("/{scenario_id}/recovery-plans")
def create_recovery_plan(
    request: CreateRecoveryPlanRequest,
    scenario_id: str = Path(...),
    db: Session = Depends(get_db)
):
    scenario = db.query(Scenario).filter(Scenario.scenario_id == scenario_id).first()
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")

    try:
        action_enum = ActionType(request.action_type)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid action_type")

    plan_id = f"PLAN-{uuid.uuid4()}"
    new_plan = RecoveryPlan(
        plan_id=plan_id,
        scenario_id=scenario_id,
        description=request.description,
        action_type=action_enum,
        action_details=json.dumps(request.details),
        estimated_cost=request.estimated_cost,
        mitigated_risk_value=request.mitigated_risk_value,
        status=PlanStatus.RECOMMENDED if request.ai_reasoning else PlanStatus.DRAFT,
        ai_reasoning=request.ai_reasoning
    )
    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)
    
    return {
        "plan_id": new_plan.plan_id,
        "status": new_plan.status,
        "message": "Recovery plan created successfully"
    }

@router.post("/{scenario_id}/recovery-plans/{plan_id}/approve")
def approve_recovery_plan(
    scenario_id: str = Path(...),
    plan_id: str = Path(...),
    db: Session = Depends(get_db)
):
    plan = db.query(RecoveryPlan).filter(
        RecoveryPlan.scenario_id == scenario_id,
        RecoveryPlan.plan_id == plan_id
    ).first()
    
    if not plan:
        raise HTTPException(status_code=404, detail="Recovery plan not found")
        
    if plan.status == PlanStatus.APPROVED:
        raise HTTPException(status_code=400, detail="Plan is already approved")
        
    # 1. Update state to APPROVED
    plan.status = PlanStatus.APPROVED
    
    # 2. Handoff to SAP Boundary
    sap_request = SAPRecoveryActionRequest(
        action_type=plan.action_type.value,
        details=json.loads(plan.action_details),
        approval_reference=plan.plan_id
    )
    
    sap_result_info = "SAP NOT_CONFIGURED"
    try:
        sap_response = sap_adapter.submit_recovery_action(sap_request)
        sap_result_info = f"SAP SUCCESS: {sap_response.message}"
    except NotImplementedError:
        # Expected behavior when real SAP is absent
        pass
    except Exception as e:
        # Some other failure from SAP
        sap_result_info = f"SAP ERROR: {str(e)}"
    
    # 3. Create Audit Record
    audit = AuditRecord(
        audit_id=f"AUD-{uuid.uuid4()}",
        scenario_id=scenario_id,
        recovery_plan_id=plan_id,
        action="APPROVED",
        details=json.dumps({
            "sap_execution": sap_result_info,
            "ai_reasoning": plan.ai_reasoning
        })
    )
    
    db.add(audit)
    db.commit()
    
    return {
        "message": "Plan approved and audited",
        "sap_execution": sap_result_info
    }

@router.post("/{scenario_id}/recovery-plans/{plan_id}/reject")
def reject_recovery_plan(
    scenario_id: str = Path(...),
    plan_id: str = Path(...),
    db: Session = Depends(get_db)
):
    plan = db.query(RecoveryPlan).filter(
        RecoveryPlan.scenario_id == scenario_id,
        RecoveryPlan.plan_id == plan_id
    ).first()
    
    if not plan:
        raise HTTPException(status_code=404, detail="Recovery plan not found")
        
    plan.status = PlanStatus.REJECTED
    
    audit = AuditRecord(
        audit_id=f"AUD-{uuid.uuid4()}",
        scenario_id=scenario_id,
        recovery_plan_id=plan_id,
        action="REJECTED",
        details=json.dumps({"reason": "User rejected plan"})
    )
    
    db.add(audit)
    db.commit()
    
    return {"message": "Plan rejected and audited"}

@router.get("/{scenario_id}/audit")
def get_scenario_audit(scenario_id: str = Path(...), db: Session = Depends(get_db)):
    audits = db.query(AuditRecord).filter(AuditRecord.scenario_id == scenario_id).order_by(AuditRecord.timestamp.desc()).all()
    
    return [
        {
            "audit_id": a.audit_id,
            "scenario_id": a.scenario_id,
            "recovery_plan_id": a.recovery_plan_id,
            "action": a.action,
            "timestamp": a.timestamp,
            "details": json.loads(a.details) if a.details else None
        }
        for a in audits
    ]
