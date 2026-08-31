import asyncio
import random
from rich.console import Console

import orchestrator

console = Console()

async def chaos_run(iteration: int):
    console.print(f"\n[bold magenta]--- Chaos Run {iteration}/15 ---[/bold magenta]")
    
    # Randomly pick a failure mode
    failure_mode = random.choice([None, 'sap', 'llm', 'guardrails'])
    if failure_mode:
        console.print(f"[bold yellow]Injecting Failure: {failure_mode.upper()}[/bold yellow]")
    else:
        console.print(f"[bold green]Normal Run (No Failure)[/bold green]")

    try:
        audit_log = await orchestrator.run_recovery_pipeline("MAT-12", inject_failure=failure_mode)
        
        # Verify the fallback behaviors
        if failure_mode == 'llm' or failure_mode == 'guardrails':
            assert audit_log.guardrail_stripped or audit_log.llm_explanation.startswith("Plan "), "Fallback explanation was not used!"
            
        console.print("[green]Success: Pipeline completed and degraded gracefully if needed.[/green]")
    except Exception as e:
        console.print(f"[bold red]FAILED: Pipeline threw unhandled exception: {e}[/bold red]")
        raise e

async def main():
    # Pre-warm cache for SAP
    orchestrator.sap_cache["MAT-12"] = await orchestrator.sap_adapter.get_supply_data("MAT-12")
    
    for i in range(1, 16):
        await chaos_run(i)
        
    console.print("\n[bold green]Chaos testing complete. 15/15 runs survived.[/bold green]")

if __name__ == "__main__":
    import sys
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    asyncio.run(main())
