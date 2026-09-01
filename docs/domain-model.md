# Domain Model

## Core Entities
- **Supplier**: Source of materials.
- **Material**: Raw inputs.
- **SupplierMaterial**: Many-to-many mapping between Supplier and Material.
- **Plant**: Manufacturing facility.
- **Product**: Finished goods.
- **Inventory**: Stock levels at specific plants (avoiding weak polymorphic references).
- **Customer**: Demand endpoint.
- **CustomerOrder**: Specific demand request with revenue value.
- **Route**: Transportation edges connecting nodes (Supplier->Plant, Plant->Customer).

## Resilience Entities
- **Disruption**: An event threatening the supply chain.
- **Scenario**: A counterfactual state containing disruptions.
- **RecoveryPlan**: A candidate response to a disruption.

## Graph Representation
The supply-chain graph is generated dynamically from the relational data, encompassing all business entities (Supplier, Material, Plant, Product, Inventory, Customer, CustomerOrder).

## Recovery Planning Responsibility
1. **Backend**: Generates mathematically/logically feasible recovery options.
2. **Deterministic Engine**: Calculates impact (cost, delay, risk) for each option.
3. **AI Layer**: Receives options, ranks them, and provides human-readable explanations/reasoning.
4. **Human**: Reviews and approves the final plan.
