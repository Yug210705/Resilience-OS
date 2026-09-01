# AI Data Contract

## Input to AI Layer (JSON)
The AI receives deterministic evaluation of recovery options to rank and explain them.

```json
{
  "scenario_id": "SCEN-001",
  "disruption": {
    "type": "SUPPLIER_FAILURE",
    "target_id": "SUP-001",
    "target_type": "Supplier"
  },
  "impact": {
    "revenue_at_risk": 1000000.0,
    "delayed_orders": ["ORD-001"]
  },
  "evaluated_options": [
    {
      "action_type": "ALTERNATIVE_SUPPLIER",
      "details": { "supplier_id": "SUP-002", "material_id": "MAT-001" },
      "estimated_cost": 18000.0,
      "mitigated_risk_value": 1000000.0
    }
  ]
}
```

## Output from AI Layer (JSON)
The AI returns the ranked list with reasoning.

```json
{
  "recommendations": [
    {
      "action_type": "ALTERNATIVE_SUPPLIER",
      "details": { "supplier_id": "SUP-002", "material_id": "MAT-001" },
      "confidence_score": 0.95,
      "reasoning": "Supplier SUP-002 in Mexico avoids the Taiwan disruption zone and has sufficient capacity, successfully saving the $1M revenue order."
    }
  ]
}
```
