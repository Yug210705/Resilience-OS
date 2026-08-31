import hashlib
import json

def get_hash(input_data: dict) -> str:
    return hashlib.md5(json.dumps(input_data, sort_keys=True).encode()).hexdigest()

_FALLBACK_DATA = {
    "analyze_disruption": {
        "analysis_summary": "Critical port closure at SUP-07 detected. Expected duration is 10 days.",
        "severity_level": "critical",
        "estimated_resolution_days": 10
    },
    "explain_impact": {
        "impact_narrative": "The closure affects 17 suppliers and puts 3800000 of revenue at risk. MAT-12 inventory will run out in 1.8 days.",
        "critical_warnings": ["Revenue at risk: 3800000", "MAT-12 critical shortage in 1.8 days"]
    },
    "recommend_recovery": {
        "recommendation": "Plan B is the optimal path. It balances cost at 1400000 and reduces delay to 3 days with a risk score of 0.14.",
        "best_plan_id": "B"
    },
    "audit_risk": {
        "risk_summary": "Plan B introduces 0.14 risk, which is acceptable given the 3800000 revenue at risk.",
        "is_approved": True
    },
    "counterfactual_recovery": {
        "recommendation": "With SUP-C failing, Plan B is no longer viable. We must pivot to Plan A. Cost increases to 2100000 and delay to 8 days, but it is the only remaining viable option to protect the 3800000 revenue.",
        "best_plan_id": "A"
    }
}

def get_cached(function_name: str, input_data: dict) -> dict:
    return _FALLBACK_DATA.get(function_name, {})
