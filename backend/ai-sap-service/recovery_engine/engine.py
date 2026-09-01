from .models import ShortageData, RecoveryPlan
import itertools

def generate_plans(data: ShortageData) -> list[RecoveryPlan]:
    """
    Deterministic combinatorial generator.
    Generates all single-supplier and valid dual-supplier split plans.
    """
    plans = []
    
    # 1. Single Supplier Plans
    for i, s in enumerate(data.suppliers):
        if s.capacity >= data.shortage_quantity:
            cost = s.unit_cost * data.shortage_quantity
            # If delay > 5 days, assume some SLA penalty hits
            sla = sum(o.sla_penalty for o in data.affected_orders) if s.lead_time_days > 5 else 0.0
            plans.append(RecoveryPlan(
                id=f"PLAN-{s.id}",
                suppliers_used=[s.id],
                total_cost=cost,
                max_delay_days=s.lead_time_days,
                blended_risk=s.risk_score,
                total_sla_exposure=sla
            ))
            
    # 2. Dual Supplier Plans (50/50 split)
    for s1, s2 in itertools.combinations(data.suppliers, 2):
        if (s1.capacity + s2.capacity) >= data.shortage_quantity:
            qty1 = data.shortage_quantity // 2
            qty2 = data.shortage_quantity - qty1
            cost = (s1.unit_cost * qty1) + (s2.unit_cost * qty2)
            delay = max(s1.lead_time_days, s2.lead_time_days)
            risk = (s1.risk_score + s2.risk_score) / 2.0
            sla = sum(o.sla_penalty for o in data.affected_orders) if delay > 5 else 0.0
            plans.append(RecoveryPlan(
                id=f"PLAN-{s1.id}-{s2.id}",
                suppliers_used=[s1.id, s2.id],
                total_cost=cost,
                max_delay_days=delay,
                blended_risk=risk,
                total_sla_exposure=sla
            ))
            
    return plans

def score_plans(plans: list[RecoveryPlan], w_cost=1.0, w_delay=50000.0, w_risk=100000.0, w_sla=1.0) -> list[RecoveryPlan]:
    """
    Pure math scoring function. Lower score is better.
    """
    for p in plans:
        p.final_score = (p.total_cost * w_cost) + (p.max_delay_days * w_delay) + (p.blended_risk * w_risk) + (p.total_sla_exposure * w_sla)
        
    # Sort deterministically by score, then id to break ties reliably
    return sorted(plans, key=lambda x: (x.final_score, x.id))
