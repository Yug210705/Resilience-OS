from fastapi import FastAPI, HTTPException, Response
import json
import os

from orchestrator import run_recovery_pipeline, AuditLog

app = FastAPI(
    title="RESILIENCE OS API",
    description="Deterministic AI Supply Chain Orchestration Layer"
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

from orchestrator import evaluate_recovery_plan, execute_sap_action
from recovery_engine.models import RecoveryPlan

@app.post("/evaluate-options", summary="Evaluate a recovery option via AI")
async def evaluate_options(plan: RecoveryPlan):
    # Pass dict since evaluate_recovery_plan expects plan_dict
    explanation_text, guardrail_stripped, retries = await evaluate_recovery_plan(
        plan.model_dump(), run_id="manual_eval"
    )
    return {
        "recommendation": explanation_text,
        "guardrail_stripped": guardrail_stripped,
        "agentic_retries": retries
    }

@app.post("/execute-action", summary="Execute a SAP action manually")
async def execute_action(plan: RecoveryPlan):
    result = await execute_sap_action(plan.model_dump())
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
