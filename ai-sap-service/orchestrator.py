"""
orchestrator.py - The Deterministic Orchestration Pipeline
Ensures strict separation between deterministic business logic and LLM narrative generation.
Provides graceful degradation for SAP outages and LLM API failures.
"""

import os
import json
import asyncio
from datetime import datetime
import structlog
from pydantic import BaseModel
from typing import Dict, Any, List

from openai import AsyncOpenAI
from dotenv import load_dotenv

from sap_adapter import MockSAPAdapter, RealSAPAdapter
from recovery_engine.models import ShortageData, RecoveryPlan
from recovery_engine.engine import generate_plans, score_plans
from guardrails import validate_numbers

load_dotenv()
logger = structlog.get_logger()

# Global LLM Client setup
api_key = os.environ.get("OPENROUTER_API_KEY", "dummy_key")
client = AsyncOpenAI(base_url="https://openrouter.ai/api/v1", api_key=api_key)
MODEL_NAME = "google/gemma-4-31b-it:free"

# SAP Cache for resilience
sap_cache: Dict[str, dict] = {}
sap_adapter = MockSAPAdapter()

class AuditLog(BaseModel):
    run_id: str
    timestamp: str
    material_id: str
    sap_input_data: dict
    ranked_plans: List[dict]
    recommended_plan: dict
    llm_explanation: str
    guardrail_stripped: bool
    agentic_retries: int = 0
    sap_action_result: dict

async def evaluate_recovery_plan(plan_dict: dict, run_id: str, inject_failure: str = None):
    logger.info("Evaluating plan (Agentic Loop)", plan_id=plan_dict.get("id", "unknown"))
    explanation_text = ""
    llm_failed = False
    guardrail_stripped = False
    agentic_retries = 0
    
    sys_prompt = """You are an executive summary generator.
Given ONLY these exact numbers, write a 2-sentence executive summary.
STRICT RULES:
1. Do not introduce, round, or calculate any number not explicitly given in the input JSON.
2. Do not invent facts (e.g. do not guess the shipping method, country, or reasons for delay).
3. Do not use adjectives like 'significant' or 'huge'. Be robotic and factual.
Return ONLY plain text, no markdown, no json."""

    max_attempts = 2
    for attempt in range(max_attempts):
        try:
            if inject_failure == "llm":
                raise Exception("Injected LLM Failure")
                
            response = await asyncio.wait_for(client.chat.completions.create(
                model=MODEL_NAME,
                messages=[
                    {"role": "system", "content": sys_prompt},
                    {"role": "user", "content": f"Input Data:\n{json.dumps(plan_dict)}"}
                ],
                max_tokens=150
            ), timeout=10.0)
            
            raw_explanation = response.choices[0].message.content.strip()
            
            if inject_failure == "guardrails" and attempt == 0:
                raw_explanation = f"This plan costs {plan_dict.get('total_cost')}, takes {plan_dict.get('max_delay_days')} days, and saves 999999999 by switching suppliers."

            # Run Guardrails immediately
            validated_text, untraceable = validate_numbers(raw_explanation, plan_dict, request_id=run_id)
            
            if not untraceable:
                # Perfect run, no hallucinations
                explanation_text = validated_text
                break
            
            # Hallucination caught!
            logger.warning("Agentic Reflection triggered", hallucinations=untraceable, attempt=attempt+1)
            guardrail_stripped = True
            
            if attempt < max_attempts - 1:
                # Agentic Reflection: scold the LLM and retry
                agentic_retries += 1
                sys_prompt += f"\n\nERROR ON PREVIOUS ATTEMPT: You hallucinanted these numbers: {untraceable}. DO NOT calculate savings. ONLY use numbers from the JSON."
            else:
                # ZERO TOLERANCE: If even a single hallucination survives retries, nuke the entire LLM output
                logger.warning("ZERO TOLERANCE: Hallucinations persisted after retries. Discarding LLM output completely.")
                llm_failed = True
                    
        except Exception as e:
            logger.warning("LLM call failed", error=str(e))
            llm_failed = True
            break
            
    if llm_failed:
        # 100% Deterministic Fallback Template
        explanation_text = (f"Plan {plan_dict.get('id')} is recommended. "
                            f"It utilizes suppliers {', '.join(plan_dict.get('suppliers_used', []))} with a total cost of {plan_dict.get('total_cost')}. "
                            f"The maximum delay is {plan_dict.get('max_delay_days')} days and total SLA exposure is {plan_dict.get('total_sla_exposure')}.")
                            
    return explanation_text, guardrail_stripped, agentic_retries

async def execute_sap_action(plan_dict: dict):
    logger.info("Execute SAP Action", plan_id=plan_dict.get("id", "unknown"))
    return await sap_adapter.create_recovery_action(plan_dict)

async def run_recovery_pipeline(material_id: str, inject_failure: str = None) -> AuditLog:
    """
    Runs the 6-step Resilience OS pipeline.
    inject_failure can be 'sap', 'llm', or 'guardrails' for chaos testing.
    """
    run_id = f"run_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"
    
    # ---------------------------------------------------------
    # STEP 1: DETECT
    # ---------------------------------------------------------
    logger.info("Step 1: Detect shortage", material_id=material_id)
    raw_sap_data = None
    
    try:
        if inject_failure == "sap":
            raise Exception("Injected SAP Timeout")
        raw_sap_data = await asyncio.wait_for(sap_adapter.get_supply_data(material_id), timeout=3.0)
        sap_cache[material_id] = raw_sap_data
    except Exception as e:
        logger.warning("SAP unreachable, falling back to cached last-known-good shortage data", error=str(e))
        raw_sap_data = sap_cache.get(material_id)
        if not raw_sap_data:
            raise RuntimeError("SAP unreachable and no cached data available.")

    # ---------------------------------------------------------
    # STEP 2: OPTIMIZE (Deterministic Layer)
    # ---------------------------------------------------------
    logger.info("Step 2: Optimize plans", material_id=material_id)
    shortage_data = ShortageData(**raw_sap_data)
    plans = generate_plans(shortage_data)
    ranked_plans = score_plans(plans)
    best_plan = ranked_plans[0]
    plan_dict = best_plan.model_dump()

    # ---------------------------------------------------------
    # STEP 3 & 4: EXPLAIN & VALIDATE (Agentic Reflection Loop)
    # ---------------------------------------------------------
    logger.info("Step 3: Explain recommendation (Agentic Loop)", plan_id=best_plan.id)
    explanation_text, guardrail_stripped, agentic_retries = await evaluate_recovery_plan(plan_dict, run_id, inject_failure)

    # ---------------------------------------------------------
    # STEP 5: ACT
    # ---------------------------------------------------------
    logger.info("Step 5: Execute SAP Action", plan_id=best_plan.id)
    action_result = await execute_sap_action(plan_dict)
    
    # ---------------------------------------------------------
    # STEP 6: AUDIT TRAIL
    # ---------------------------------------------------------
    logger.info("Step 6: Write Audit Trail", run_id=run_id)
    
    audit_log = AuditLog(
        run_id=run_id,
        timestamp=datetime.utcnow().isoformat(),
        material_id=material_id,
        sap_input_data=raw_sap_data,
        ranked_plans=[p.model_dump() for p in ranked_plans],
        recommended_plan=plan_dict,
        llm_explanation=explanation_text,
        guardrail_stripped=guardrail_stripped,
        agentic_retries=agentic_retries,
        sap_action_result=action_result
    )
    
    os.makedirs("logs", exist_ok=True)
    log_path = f"logs/{run_id}.json"
    with open(log_path, "w") as f:
        f.write(audit_log.model_dump_json(indent=2))
        
    logger.info("Audit log written", path=log_path)
    return audit_log
