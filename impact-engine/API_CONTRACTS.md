# Integration API Contracts

This document defines the strict JSON interfaces exposed by the Impact Engine (Member 2) for consumption by the Frontend, the Recovery Optimizer (Member 3), and the AI Agent Layer (Member 4).

## 1. Member 1 (Frontend UI) Contracts

### `GET /api/supply-chain/graph`
Returns the raw NetworkX topology for rendering in React Flow or D3.js.
```json
{
  "nodes": [
    {"id": "supplier:SUP-007", "type": "supplier", "label": "TechCorp", "risk": 45.2}
  ],
  "edges": [
    {"source": "supplier:SUP-007", "target": "material:MAT-004", "type": "SUPPLIES", "capacity": 1000}
  ]
}
```

### `GET /api/supply-chain/geojson`
Returns standard GeoJSON for 3D Globe mapping (Mapbox/Cesium).
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {"type": "Point", "coordinates": [72.8777, 19.0760]},
      "properties": {"id": "PORT-001", "name": "Mumbai Port", "type": "port", "color": "#ff00ff"}
    }
  ]
}
```

### `WS /ws/disruptions/stream`
A WebSocket connection that streams the disruption cascade in real-time for UI animation.
```json
// t=0s
{"event": "INITIAL_SHOCK", "node": "supplier:SUP-007"}
// t=1s
{"event": "MATERIAL_IMPACTED", "material": "MAT-004", "runway_days": 3.8}
// t=1.5s
{"event": "PRODUCTION_HALTED", "day": 4, "material": "MAT-004"}
// t=2s
{"event": "ORDER_AT_RISK", "order": "ORD-1042", "value": 450000.0}
```

---

## 2. Member 3 (Optimizer) Contract

Member 3 requires structured numerical data to calculate recovery plans (e.g., shifting capacity to alternative suppliers). The Impact Engine provides this directly in the `recovery_context` block of the simulation response, avoiding the need for Member 3 to query the database.

```json
"recovery_context": {
  "material_shortages": [
    {
      "material_id": "MAT-004",
      "shortage_quantity": 4200,
      "shortage_per_day": 420.0,
      "shortage_start_day": 3.8,
      "duration_days": 10,
      "current_supplier_capacity": 0,
      "normal_demand_per_day": 420,
      "single_source": false,
      "alternative_supplier_ids": ["SUP-011", "SUP-019"]
    }
  ],
  "supplier_options": [
    {
      "supplier_id": "SUP-011",
      "material_id": "MAT-004",
      "capacity_per_day": 500,
      "lead_time_days": 4,
      "unit_cost": 110.5,
      "risk_score": 18.0
    }
  ],
  "affected_orders": [
    {
      "order_id": "ORD-1042",
      "product_id": "PR-008",
      "shortfall_quantity": 300,
      "revenue_at_risk": 450000.0
    }
  ]
}
```

---

## 3. Member 4 (AI / SAP) Contract

Member 4 relies on LLMs to generate human-readable executive summaries and draft SAP actions. The Impact Engine provides an `ai_context` block containing a pre-calculated executive summary.

```json
"ai_context": {
  "situation": {
    "disruption_type": "supplier",
    "entity_id": "SUP-007",
    "severity": 1.0,
    "duration_days": 10
  },
  "impact_summary": {
    "affected_materials": 3,
    "affected_plants": 2,
    "affected_products": 5,
    "affected_orders": 17,
    "revenue_at_risk": 1850000.0
  }
}
```
