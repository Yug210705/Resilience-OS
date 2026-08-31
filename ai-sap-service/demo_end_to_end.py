import asyncio
import argparse
import sys

# Windows CP1252 fix for rich
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.progress import Progress, SpinnerColumn, TextColumn
import orchestrator

console = Console()

async def main():
    parser = argparse.ArgumentParser(description="RESILIENCE OS - AI Supply Chain Orchestration")
    parser.add_argument("--inject-failure", choices=['sap', 'llm', 'guardrails'], 
                        help="Inject a specific failure to demonstrate resilience fallback")
    args = parser.parse_args()

    console.print(Panel.fit("[bold cyan]RESILIENCE OS AI ORCHESTRATION[/bold cyan]\n[white]Deterministic Recovery Pipeline (Demo Mode)[/white]", border_style="blue"))
    
    if args.inject_failure:
        console.print(f"[bold red]⚠️  INJECTING FAILURE MODE: {args.inject_failure.upper()} ⚠️[/bold red]")
    
    # Pre-warm the cache for SAP fallback demo
    if args.inject_failure == 'sap':
        orchestrator.sap_cache["MAT-12"] = await orchestrator.sap_adapter.get_supply_data("MAT-12")

    # Run the 6-step pipeline
    with Progress(SpinnerColumn('bouncingBar'), TextColumn("[progress.description]{task.description}"), console=console) as progress:
        task1 = progress.add_task("[yellow]Step 1: Detecting Shortage in SAP...", total=None)
        await asyncio.sleep(0.5)
        progress.update(task1, completed=100, description="[green]✓ Step 1: Shortage Detected")
        
        task2 = progress.add_task("[yellow]Step 2: Optimizing Recovery Plans (Deterministic)...", total=None)
        audit_log = await orchestrator.run_recovery_pipeline("MAT-12", inject_failure=args.inject_failure)
        progress.update(task2, completed=100, description="[green]✓ Step 2: Plans Optimized")
        
        task3 = progress.add_task("[yellow]Step 3: Generating Executive Explanation (LLM)...", total=None)
        await asyncio.sleep(0.5)
        progress.update(task3, completed=100, description="[green]✓ Step 3: Explanation Generated")
        
        task4 = progress.add_task("[yellow]Step 4: Validating Against Hallucinations...", total=None)
        if audit_log.agentic_retries > 0:
            progress.update(task4, completed=100, description="[cyan]↻ Step 4: Agentic Reflection (LLM caught & fixed hallucination)[/cyan]")
        elif audit_log.guardrail_stripped:
            progress.update(task4, completed=100, description="[red]⚠ Step 4: Guardrail Intercepted Hallucination[/red]")
        else:
            progress.update(task4, completed=100, description="[green]✓ Step 4: Numbers Validated[/green]")
            
        task5 = progress.add_task("[yellow]Step 5: Executing Purchase Order in SAP...", total=None)
        await asyncio.sleep(0.5)
        progress.update(task5, completed=100, description="[green]✓ Step 5: SAP Action Executed")
        
        task6 = progress.add_task("[yellow]Step 6: Writing Audit Trail...", total=None)
        progress.update(task6, completed=100, description=f"[green]✓ Step 6: Audit Log Saved")

    print()
    
    # Render Output Table
    table = Table(title="Ranked Recovery Plans (Deterministic)", header_style="bold magenta")
    table.add_column("Rank", style="dim", width=4)
    table.add_column("Plan ID")
    table.add_column("Suppliers")
    table.add_column("Cost")
    table.add_column("Delay")
    table.add_column("Risk")
    
    for i, p in enumerate(audit_log.ranked_plans):
        table.add_row(
            str(i+1), 
            p["id"], 
            ", ".join(p["suppliers_used"]),
            f"{p['total_cost']:,.0f}",
            f"{p['max_delay_days']}d",
            f"{p['blended_risk']:.2f}"
        )
    
    console.print(table)
    
    # Render Output Box
    summary_text = (
        f"[bold]Recommended Plan:[/bold] {audit_log.recommended_plan['id']}\n"
        f"[bold]SAP Transaction:[/bold] {audit_log.sap_action_result.get('transaction_id')}\n"
        f"[bold]Status:[/bold] {audit_log.sap_action_result.get('status')}\n\n"
        f"[bold]Executive Summary (Verified):[/bold]\n[white]{audit_log.llm_explanation}[/white]"
    )
    
    border_color = "red" if audit_log.guardrail_stripped else "green"
    console.print(Panel(summary_text, title="Final Action", border_style=border_color))
    console.print(f"[dim]Audit Trail: logs/{audit_log.run_id}.json[/dim]\n")

if __name__ == "__main__":
    asyncio.run(main())
