from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, Response, Depends
from sqlalchemy.orm import Session
import json
import os
from typing import List, Optional

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

from app.models.db_models import ScenarioRecord
from app.models.schemas import ScenarioResponse, ScenarioListResponse, GenerateScenariosRequest, UpdateScenarioStatusRequest

@app.post("/api/scenarios/generate", response_model=List[ScenarioResponse], summary="Generate Scenarios from Disruption")
async def api_generate_scenarios(req: GenerateScenariosRequest, force: bool = False, db: Session = Depends(get_db)):
    try:
        # IDEMPOTENCY GUARD: Check for existing active (READY/SIMULATING) scenarios for this disruption.
        # If they exist and force=False, return them rather than creating a duplicate batch.
        existing_active = db.query(ScenarioRecord).filter(
            ScenarioRecord.disruption_id == req.disruption_id,
            ScenarioRecord.status.in_(["READY", "SIMULATING"])
        ).all()

        if existing_active and not force:
            # Return the existing active batch — no new records created.
            return [
                ScenarioResponse(
                    id=s.id, name=s.name, disruption_id=s.disruption_id,
                    strategy=s.strategy, supplier_id=s.supplier_id,
                    total_cost=s.total_cost, max_delay_days=s.max_delay_days,
                    blended_risk=s.blended_risk, total_sla_exposure=s.total_sla_exposure,
                    final_score=s.final_score, status=s.status,
                    created_at=s.created_at, updated_at=s.updated_at, details=s.details
                ) for s in existing_active
            ]

        # If force=True, archive the previous active batch before generating a new one.
        if existing_active and force:
            for s in existing_active:
                if s.status in ("READY", "SIMULATING"):
                    s.status = "ARCHIVED"
            db.commit()

        # Generate fresh scenarios from the recovery engine.
        options_res = await get_recovery_plans(req.material_id)
        new_scenarios = []
        
        for i, option in enumerate(options_res.ranked_plans):
            suppliers_used = option.get("suppliers_used", [])
            supplier_id_str = ",".join(suppliers_used) if suppliers_used else "Unknown"
            
            if len(suppliers_used) > 1:
                name = f"Dual-Source Activation (V{i+1})"
                strategy = f"Activate {supplier_id_str}"
            elif option.get("max_delay_days", 0) > 7:
                name = f"Inventory Reallocation (V{i+1})"
                strategy = f"Reallocate to {supplier_id_str}"
            else:
                name = f"Alternate Supplier Shift (V{i+1})"
                strategy = f"Activate {supplier_id_str}"
                
            record = ScenarioRecord(
                name=name,
                disruption_id=req.disruption_id,
                strategy=strategy,
                supplier_id=supplier_id_str,
                total_cost=option.get("total_cost", 0),
                max_delay_days=option.get("max_delay_days", 0),
                blended_risk=option.get("blended_risk", 0),
                total_sla_exposure=option.get("total_sla_exposure", 0),
                final_score=option.get("final_score", 0),
                status="READY",
                details=option
            )
            db.add(record)
            new_scenarios.append(record)
            
        db.commit()
        for s in new_scenarios:
            db.refresh(s)
            
        return [
            ScenarioResponse(
                id=s.id, name=s.name, disruption_id=s.disruption_id,
                strategy=s.strategy, supplier_id=s.supplier_id,
                total_cost=s.total_cost, max_delay_days=s.max_delay_days,
                blended_risk=s.blended_risk, total_sla_exposure=s.total_sla_exposure,
                final_score=s.final_score, status=s.status,
                created_at=s.created_at, updated_at=s.updated_at, details=s.details
            ) for s in new_scenarios
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/scenarios", response_model=ScenarioListResponse, summary="List Scenarios (paginated)")
async def api_list_scenarios(
    limit: int = 50,
    offset: int = 0,
    status: Optional[str] = None,         # e.g. "READY" or "READY,SIMULATING"
    search: Optional[str] = None,          # searches id, name, strategy, disruption_id
    disruption_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    from sqlalchemy import func, or_

    # --- Build filtered base query (for count + current page) ---
    base_q = db.query(ScenarioRecord)

    if disruption_id:
        base_q = base_q.filter(ScenarioRecord.disruption_id == disruption_id)

    if status:
        status_list = [s.strip() for s in status.split(",") if s.strip()]
        base_q = base_q.filter(ScenarioRecord.status.in_(status_list))

    if search:
        term = f"%{search.lower()}%"
        base_q = base_q.filter(
            or_(
                func.lower(ScenarioRecord.id).like(term),
                func.lower(ScenarioRecord.name).like(term),
                func.lower(ScenarioRecord.strategy).like(term),
                func.lower(ScenarioRecord.disruption_id).like(term),
            )
        )

    total = base_q.count()

    page_rows = base_q.order_by(ScenarioRecord.created_at.desc()).offset(offset).limit(limit).all()

    # --- Server-side aggregate KPIs (over ALL records, unfiltered by page) ---
    all_q = db.query(ScenarioRecord)
    total_ready = all_q.filter(ScenarioRecord.status == "READY").count()
    total_simulating = all_q.filter(ScenarioRecord.status == "SIMULATING").count()
    total_selected = all_q.filter(ScenarioRecord.status == "SELECTED").count()
    total_active = total_ready + total_simulating

    # Aggregate SLA exposure for active scenarios via DB
    active_exposure_result = db.query(func.sum(ScenarioRecord.total_sla_exposure)).filter(
        ScenarioRecord.status.in_(["READY", "SIMULATING"])
    ).scalar()
    aggregate_sla_exposure = float(active_exposure_result or 0.0)

    items = [
        ScenarioResponse(
            id=s.id, name=s.name, disruption_id=s.disruption_id,
            strategy=s.strategy, supplier_id=s.supplier_id,
            total_cost=s.total_cost, max_delay_days=s.max_delay_days,
            blended_risk=s.blended_risk, total_sla_exposure=s.total_sla_exposure,
            final_score=s.final_score, status=s.status,
            created_at=s.created_at, updated_at=s.updated_at, details=s.details
        ) for s in page_rows
    ]

    return ScenarioListResponse(
        items=items,
        total=total,
        limit=limit,
        offset=offset,
        has_more=(offset + limit) < total,
        total_active=total_active,
        total_simulating=total_simulating,
        total_ready=total_ready,
        total_selected=total_selected,
        aggregate_sla_exposure=aggregate_sla_exposure,
    )


@app.get("/api/scenarios/{scenario_id}", response_model=ScenarioResponse, summary="Get Scenario")
async def api_get_scenario(scenario_id: str, db: Session = Depends(get_db)):
    s = db.query(ScenarioRecord).filter(ScenarioRecord.id == scenario_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return ScenarioResponse(
        id=s.id,
        name=s.name,
        disruption_id=s.disruption_id,
        strategy=s.strategy,
        supplier_id=s.supplier_id,
        total_cost=s.total_cost,
        max_delay_days=s.max_delay_days,
        blended_risk=s.blended_risk,
        total_sla_exposure=s.total_sla_exposure,
        final_score=s.final_score,
        status=s.status,
        created_at=s.created_at,
        updated_at=s.updated_at,
        details=s.details
    )

@app.put("/api/scenarios/{scenario_id}/status", response_model=ScenarioResponse)
async def api_update_scenario_status(scenario_id: str, req: UpdateScenarioStatusRequest, db: Session = Depends(get_db)):
    s = db.query(ScenarioRecord).filter(ScenarioRecord.id == scenario_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Scenario not found")
    
    s.status = req.status
    db.commit()
    db.refresh(s)
    
    return ScenarioResponse(
        id=s.id,
        name=s.name,
        disruption_id=s.disruption_id,
        strategy=s.strategy,
        supplier_id=s.supplier_id,
        total_cost=s.total_cost,
        max_delay_days=s.max_delay_days,
        blended_risk=s.blended_risk,
        total_sla_exposure=s.total_sla_exposure,
        final_score=s.final_score,
        status=s.status,
        created_at=s.created_at,
        updated_at=s.updated_at,
        details=s.details
    )
