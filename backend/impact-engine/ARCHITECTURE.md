# Resilience OS - Impact Engine Architecture

This document explains the mathematical and technical architecture of the **Deterministic Impact Engine (Member 2)**. 

The Impact Engine is the "brain" behind the supply chain physics. It does not use LLMs or stochastic guesswork; it relies entirely on Graph Theory, deterministic Bill of Materials (BOM) constraints, and inventory runways to calculate the exact downstream consequences of any physical disruption.

---

## 1. Graph Topology (NetworkX)

The supply chain is represented as a directed graph (`nx.DiGraph`). 

### Node Types
- `Supplier`: The origin of raw materials/components.
- `Port`: Logistics hubs where suppliers ship goods.
- `Route`: Transportation paths between ports and plants.
- `Material`: Physical components or raw materials.
- `Plant`: Manufacturing facilities.
- `Product`: Finished goods produced at plants.
- `Order`: Customer demands for finished goods.

### Edge Types (Dependency Flow)
- `[Supplier] --(USES_PORT)--> [Port]`
- `[Port] --(USES_ROUTE)--> [Route]`
- `[Route] --(DELIVERS_TO)--> [Plant]`
- `[Supplier] --(SUPPLIES)--> [Material]`
- `[Material] --(CONSUMED_AT)--> [Plant]`
- `[Plant] --(PRODUCES)--> [Product]`
- `[Material] --(CONSUMES)--> [Product]` *(BOM Dependency)*
- `[Product] --(FULFILLS)--> [Order]`

When a disruption occurs at *any* node (e.g., a Port), the engine uses `nx.descendants(G, start_node)` to traverse all directed edges and identify every downstream entity that relies on that node.

---

## 2. Disruption Propagation Math

When a disruption is triggered, the engine calculates the exact impact using the following deterministic steps:

### A. Capacity Loss Calculation
If a supplier is disrupted with a `severity` of `0.8`, it loses 80% of its daily capacity.
```python
disrupted_capacity = normal_capacity * severity
remaining_capacity = normal_capacity - disrupted_capacity
```

### B. Demand vs. Capacity (The Shortage)
The total daily demand for a material is calculated by checking the BOM of all products that consume it, multiplied by the daily production rate of those products.
```python
if total_remaining_capacity < total_daily_demand:
    daily_shortfall = total_daily_demand - total_remaining_capacity
```

### C. Inventory Runway (Buffer)
Supply chains don't break instantly; they rely on safety stock. The engine checks the on-hand inventory at the affected plants.
```python
runway_days = available_inventory / total_daily_demand
```
If a disruption lasts 10 days, but the runway is 12 days, the production is **not halted**, but the risk score increases due to buffer depletion.

### D. Revenue At Risk
For every customer order downstream of a halted product, the revenue at risk is calculated:
```python
revenue_lost = order_quantity * unit_price * severity
```

---

## 3. Advanced Graph Theory Algorithms

To move beyond reactive simulation, the engine uses advanced mathematical algorithms to proactively audit the supply chain.

### Betweenness Centrality (Bottlenecks)
Calculates the shortest paths between all pairs of nodes in the supply chain graph. Nodes that act as bridges (e.g., a single port connecting multiple critical suppliers to multiple plants) receive a high Betweenness Centrality score. These are **Systemic Bottlenecks**.

### PageRank (Systemic Importance)
Adapted from Google's search algorithm, PageRank assigns a probability to each node. If a node is relied upon by many highly-important downstream products, its PageRank increases. This identifies the **Most Critical Assets** in the enterprise.

---

## 4. The "Chaos Monkey" Doomsday Simulator

Inspired by Netflix's Chaos Engineering, the Impact Engine features an automated stress-testing endpoint.

**Workflow:**
1. Calls the PageRank algorithm to find the 3 most systemically important nodes in the graph.
2. Constructs a `MultiDisruptionRequest` targeting all 3 nodes simultaneously with a severity of 1.0 (complete destruction) for 30 days.
3. Merges the impacted sub-graphs and calculates the combined combinatorial disaster.
4. Outputs a "Doomsday Scenario" report detailing the maximum theoretical financial exposure of the enterprise.

---

## 5. Timeline Cascade Simulation

Instead of just outputting the final financial loss, the engine generates a day-by-day `timeline` array. 

It simulates the flow of time (Day 1 to Day N):
- **Day 1-3:** `status: NORMAL` (Living off inventory buffers)
- **Day 4:** `status: HALTED` (Inventory reaches 0, daily shortfalls begin)
- **Day N:** Accumulates total production units lost.

This timeline is broadcasted in real-time via WebSockets (`/ws/disruptions/stream`), allowing the frontend to visually animate the cascading failure across the map as time progresses.
