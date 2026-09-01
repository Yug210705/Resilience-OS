from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, Response
import json
import os

from app.services.orchestrator import run_recovery_pipeline, AuditLog

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
