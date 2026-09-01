import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

import asyncio
import json
from typing import Dict, Any
from rich.console import Console
from rich.panel import Panel
from rich.text import Text
from rich import print as rprint
from rich.progress import Progress, SpinnerColumn, TextColumn

from app.models.schemas import DisruptionInput, ImpactInput, RecoveryPlanInput, CounterfactualInput
from app.services import orchestrator

console = Console()

async def run_flow():
    console.print(Panel.fit("[bold cyan]RESILIENCE OS AI ORCHESTRATION[/bold cyan]\n[white]Deterministic AI Pipeline End-to-End Test[/white]", border_style="blue"))
    
    # Sample Data
    disruption = DisruptionInput(type="port_closure", target="SUP-07", severity="critical", duration_days=10.0)
    impact = ImpactInput(affected_suppliers=17, affected_plants=3, affected_materials=12,
                         affected_orders=43, revenue_at_risk=3800000.0, critical_material="MAT-12",
                         inventory_days_remaining=1.8)
    
    plans = [
      RecoveryPlanInput(id="A", suppliers_used=["SUP-A", "SUP-B"], cost=2100000.0, delay_days=8.0, risk_score=0.31),
      RecoveryPlanInput(id="B", suppliers_used=["SUP-B", "SUP-C"], cost=1400000.0, delay_days=3.0, risk_score=0.14),
      RecoveryPlanInput(id="C", suppliers_used=["SUP-C"], cost=900000.0, delay_days=5.0, risk_score=0.22)
    ]

    async def execute_step(name, func, *args):
        with Progress(SpinnerColumn('bouncingBar'), TextColumn("[progress.description]{task.description}"), console=console) as progress:
            task = progress.add_task(f"[yellow]Running: {name}...", total=None)
            result = await func(*args)
            progress.update(task, completed=100, description=f"[green]✓ Completed: {name}")
        
        console.print(Panel(result.model_dump_json(indent=2), title=name, border_style="green"))
        return result
    
    d_res = await execute_step("Analyze Disruption", orchestrator.analyze_disruption, disruption)
    i_res = await execute_step("Explain Impact", orchestrator.explain_impact, impact)
    r_res = await execute_step("Recommend Recovery", orchestrator.recommend_recovery, plans)
    
    best_plan = next((p for p in plans if p.id == r_res.best_plan_id), plans[0])
    a_res = await execute_step(f"Audit Risk (Plan {best_plan.id})", orchestrator.audit_risk, best_plan, impact)
    
    remaining = [p for p in plans if "SUP-C" not in p.suppliers_used]
    c_res = await execute_step("Counterfactual (SUP-C Fails)", orchestrator.counterfactual_recovery, r_res.best_plan_id, "SUP-C", remaining)

    console.print("\n[bold green]Pipeline Test Completed Successfully! 🎉[/bold green]")

if __name__ == "__main__":
    asyncio.run(run_flow())
