# RESILIENCE OS — IMPACT ENGINE (Member 2)

The **Deterministic Impact Engine** is the supply-chain intelligence core of Resilience OS. 

This engine is responsible for maintaining the graph topology of the entire supply chain and, given a disruption at any node (supplier, material, port, plant, route), accurately propagating that disruption through the network to calculate the deterministic downstream impact on production, inventory, customer orders, and revenue.

## Core Principles
1. **Deterministic Execution**: The simulation relies solely on database state, graph traversal, and mathematical models (BOM calculations, capacity gaps). No LLMs or stochastic models are used in this layer. The exact same disruption request will *always* produce the exact same impact calculation.
2. **Modular Architecture**: This is structured as a Modular Monolith with clean separation between FastAPI routes, Pydantic DTO schemas, SQLAlchemy ORM models, and Business Logic Services.
3. **Integration Contracts**: The engine does not exist in a vacuum. It outputs explicitly designed JSON contracts (`recovery_context` for Member 3's Optimizer, and `ai_context` for Member 4's AI Agents) so they can consume the intelligence without querying the database themselves.

## Dataset
This engine contains a deterministic seeder (`seed_database.py`) that generates an enterprise-grade synthetic supply chain dataset:
- 25 Suppliers, 15 Materials, 5 Plants, 12 Products, 60+ Customer Orders, 10 Ports.
- Relational mapping between Suppliers ↔ Materials (some single-source, some multi-source).
- Product BOMs (Bills of Materials) to define production constraints.
- Inventory levels.

## Running the Engine

**1. Install dependencies:**
```bash
pip install -r requirements.txt
```

**2. Seed the deterministic dataset:**
```bash
set PYTHONPATH=.
python app/seed/seed_database.py
```

**3. Run the tests (including Determinism validation):**
```bash
set PYTHONPATH=.
python -m pytest tests/
```

**4. Start the FastAPI Server:**
```bash
uvicorn app.main:app --reload
```
Navigate to `http://127.0.0.1:8000/docs` to see the OpenAPI Swagger documentation.

## Demo Scenarios
You can test the `/api/disruptions/simulate` endpoint with various payloads:

**Catastrophic Supplier Failure:**
```json
{
  "disruption_type": "supplier",
  "affected_entity_id": "SUP-007",
  "severity": 1.0,
  "duration_days": 10
}
```

**Partial Material Disruption:**
```json
{
  "disruption_type": "material",
  "affected_entity_id": "MAT-004",
  "severity": 0.5,
  "duration_days": 5
}
```

## Contracts Exposed
- **Member 1 (Frontend)**: GET `/api/supply-chain/graph` provides the full NetworkX topology for UI rendering.
- **Member 3 (Optimizer)**: The `recovery_context` in the simulation response isolates exactly which materials are short, by how much, and what alternative suppliers exist.
- **Member 4 (AI/SAP)**: The `ai_context` provides a pre-calculated executive summary of the impact (revenue lost, orders affected) for LLM consumption.
