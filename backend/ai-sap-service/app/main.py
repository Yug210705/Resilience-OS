from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, Response, Depends
from sqlalchemy.orm import Session
import json
import os
from typing import List

from app.database import engine, Base, get_db
from app.models.db_models import RecoveryPlanRecord
from app.models.schemas import CreateRecoveryPlanRequest, RecoveryPlanResponse, UpdateStatusRequest
from app.services.orchestrator import run_recovery_pipeline, AuditLog, get_recovery_plans, RecoveryPlansResponse

# Initialize database
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="RESILIENCE OS API",
    description="Deterministic AI Supply Chain Orchestration Layer"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/recovery/options", response_model=RecoveryPlansResponse, summary="Get Recovery Options", description="Generates deterministic recovery options based on SAP supply data.")
async def api_get_recovery_options(material_id: str = "MAT-12"):
    try:
        return await get_recovery_plans(material_id)
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))

@app.post("/api/recovery/plans", response_model=RecoveryPlanResponse, summary="Create Recovery Plan")
async def api_create_recovery_plan(req: CreateRecoveryPlanRequest, db: Session = Depends(get_db)):
    try:
        # Generate plans on the fly to find the matching one to persist
        options_res = await get_recovery_plans(req.material_id)
        
        # Find the specific option the user chose (matching option_id)
        selected_option = next((p for p in options_res.ranked_plans if p.get("id") == req.option_id), None)
        
        if not selected_option:
            raise HTTPException(status_code=422, detail=f"Invalid recovery option: {req.option_id} not valid for material {req.material_id}")
            
        suppliers_used = selected_option.get("suppliers_used", [])
        supplier_id_str = ",".join(suppliers_used) if suppliers_used else "Unknown"
        
        # Create persistent record
        plan = RecoveryPlanRecord(
            disruption_id=req.disruption_id,
            strategy=f"Activate {supplier_id_str}",
            supplier_id=supplier_id_str,
            total_cost=selected_option["total_cost"],
            max_delay_days=selected_option["max_delay_days"],
            blended_risk=selected_option["blended_risk"],
            total_sla_exposure=selected_option.get("total_sla_exposure", 0.0),
            final_score=selected_option["final_score"],
            details=selected_option
        )
        
        db.add(plan)
        db.commit()
        db.refresh(plan)
        
        return RecoveryPlanResponse(
            id=plan.id,
            disruption_id=plan.disruption_id,
            strategy=plan.strategy,
            supplier_id=plan.supplier_id,
            total_cost=plan.total_cost,
            max_delay_days=plan.max_delay_days,
            blended_risk=plan.blended_risk,
            total_sla_exposure=plan.total_sla_exposure,
            final_score=plan.final_score,
            status=plan.status,
            created_at=plan.created_at,
            details=plan.details
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/recovery/plans", response_model=List[RecoveryPlanResponse], summary="List Persisted Recovery Plans")
async def api_list_recovery_plans(db: Session = Depends(get_db)):
    plans = db.query(RecoveryPlanRecord).order_by(RecoveryPlanRecord.created_at.desc()).all()
    return [
        RecoveryPlanResponse(
            id=p.id,
            disruption_id=p.disruption_id,
            strategy=p.strategy,
            supplier_id=p.supplier_id,
            total_cost=p.total_cost,
            max_delay_days=p.max_delay_days,
            blended_risk=p.blended_risk,
            total_sla_exposure=p.total_sla_exposure,
            final_score=p.final_score,
            status=p.status,
            created_at=p.created_at,
            details=p.details
        ) for p in plans
    ]

@app.get("/api/recovery/plans/{plan_id}", response_model=RecoveryPlanResponse, summary="Get Single Recovery Plan")
async def api_get_recovery_plan(plan_id: str, db: Session = Depends(get_db)):
    plan = db.query(RecoveryPlanRecord).filter(RecoveryPlanRecord.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Recovery Plan not found")
    return RecoveryPlanResponse(
        id=plan.id,
        disruption_id=plan.disruption_id,
        strategy=plan.strategy,
        supplier_id=plan.supplier_id,
        total_cost=plan.total_cost,
        max_delay_days=plan.max_delay_days,
        blended_risk=plan.blended_risk,
        total_sla_exposure=plan.total_sla_exposure,
        final_score=plan.final_score,
        status=plan.status,
        created_at=plan.created_at,
        details=plan.details
    )

@app.put("/api/recovery/plans/{plan_id}/status", response_model=RecoveryPlanResponse, summary="Update Plan Status")
async def api_update_plan_status(plan_id: str, req: UpdateStatusRequest, db: Session = Depends(get_db)):
    plan = db.query(RecoveryPlanRecord).filter(RecoveryPlanRecord.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Recovery Plan not found")
    plan.status = req.status
    db.commit()
    db.refresh(plan)
    return RecoveryPlanResponse(
        id=plan.id,
        disruption_id=plan.disruption_id,
        strategy=plan.strategy,
        supplier_id=plan.supplier_id,
        total_cost=plan.total_cost,
        max_delay_days=plan.max_delay_days,
        blended_risk=plan.blended_risk,
        total_sla_exposure=plan.total_sla_exposure,
        final_score=plan.final_score,
        status=plan.status,
        created_at=plan.created_at,
        details=plan.details
    )

@app.post("/run-recovery", response_model=AuditLog, summary="Run Full Recovery Pipeline", description="Executes the 6-step detect/optimize/explain/validate/act/audit pipeline.")
async def run_recovery(response: Response, material_id: str = "MAT-12"):
    import time
    start = time.time()
    audit_log = await run_recovery_pipeline(material_id)
    response.headers["X-Resilience-Latency-Ms"] = str(int((time.time() - start) * 1000))
    response.headers["X-Agentic-Retries"] = str(audit_log.agentic_retries)
    return audit_log

@app.get("/run-recovery/{run_id}", response_model=AuditLog, summary="Retrieve Audit Trail", description="Fetches the exact IO logged during a specific recovery pipeline execution.")
async def get_recovery_audit(run_id: str):
    log_path = f"logs/{run_id}.json"
    if not os.path.exists(log_path):
        raise HTTPException(status_code=404, detail="Audit log not found")
    
    with open(log_path, "r") as f:
        return json.load(f)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
