# SAP Data Boundary

## Inbound (From SAP to Resilience OS)
- **Master Data**: Suppliers, Materials, Plants, Customers mapped to internal domain entities.
- **Transactional Data**: Current Inventory levels, active Customer Orders, pending Purchase Orders.

## Outbound (From Resilience OS to SAP)
- **Auditable Actions**: When a human approves an AI-recommended recovery plan (e.g., switch to Alternative Supplier), Resilience OS dispatches a payload to SAP S/4HANA to create/modify a Purchase Order.

Example Output Payload:
```json
{
  "event": "RECOVERY_PLAN_APPROVED",
  "plan_id": "PLAN-001",
  "sap_action": "CREATE_PO",
  "payload": {
    "supplier_id": "SUP-002",
    "material_id": "MAT-001",
    "quantity": 100
  },
  "audit_trail": {
    "approved_by": "user@example.com",
    "ai_reasoning": "Supplier SUP-002 avoids the disrupted Taiwan zone."
  }
}
```
