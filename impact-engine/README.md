# RESILIENCE OS — IMPACT ENGINE (Member 2)

The **Deterministic Impact Engine** is the supply-chain intelligence core of Resilience OS. 

This engine is responsible for maintaining the geospatial graph topology of the entire supply chain and, given a disruption at any node (supplier, material, port, plant, route), accurately propagating that disruption through the network to calculate the deterministic downstream impact on production, inventory, customer orders, and revenue.

## 🚀 Hackathon "God-Tier" Features

We didn't just build a CRUD app. This engine utilizes advanced mathematics to proactively secure the supply chain:

1. **Supply Chain Chaos Monkey (`POST /api/war-room/chaos-monkey`)**: Automatically runs PageRank algorithms to identify the 3 most critical systemic vulnerabilities in the global supply chain, destroys them simultaneously in a Multi-Vector Attack, and calculates the exact Doomsday financial exposure.
2. **Real-Time Websocket Cascade (`WS /ws/disruptions/stream`)**: Streams the day-by-day cascading failure of a disruption (e.g., *Day 1: Shock -> Day 4: Inventory Depleted -> Day 5: Production Halted*) so the UI can animate a "virus-like" spread across the map.
3. **Graph Theory Bottleneck Analysis (`GET /api/supply-chain/vulnerabilities`)**: Calculates Betweenness Centrality to proactively identify hidden choke points in the logistics network.
4. **GeoJSON 3D Globe Export (`GET /api/supply-chain/geojson`)**: Natively exports the entire supply chain as a standard GeoJSON FeatureCollection for instant 3D rendering in Cesium or Mapbox.

## 📚 Documentation
- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Deep dive into the Graph Theory mathematics, Bill of Materials (BOM) propagation, and the Chaos Monkey engine.
- **[API_CONTRACTS.md](./API_CONTRACTS.md)**: Detailed JSON schema definitions showing exactly how Member 1 (Frontend), Member 3 (Optimizer), and Member 4 (AI/SAP) integrate seamlessly with this engine.

## Core Principles
1. **Deterministic Execution**: The simulation relies solely on database state, graph traversal, and mathematical models (BOM calculations, capacity gaps). No LLMs or stochastic models are used in this layer. 
2. **Modular Architecture**: This is structured as a Modular Monolith with clean separation between FastAPI routes, Pydantic DTO schemas, SQLAlchemy ORM models, and Business Logic Services.

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
*(This generates 25 Suppliers, 15 Materials, 5 Plants, 12 Products, 64 Orders, 10 Ports, and 26 Transport Routes).*

**3. Run the test suite:**
```bash
set PYTHONPATH=.
python -m pytest tests/
```

**4. Start the FastAPI Server:**
```bash
uvicorn app.main:app --reload
```
Navigate to `http://127.0.0.1:8000/docs` to see the OpenAPI Swagger documentation.
