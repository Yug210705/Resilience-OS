# SAP Integration Guide
**For Member 3 (SAP Implementation Lead)**

This document details the SAP Integration Boundary (Chapter 5) built for Resilience OS. The core application logic is strictly isolated from SAP SDKs or specific vendor implementations.

## What Already Exists
1. **SAP Port (`backend/app/integrations/sap/port.py`)**: Defines `SAPIntegrationPort`, the abstract interface detailing required read and write operations (`get_supplier`, `get_inventory`, `submit_recovery_action`, etc.).
2. **SAP DTOs (`backend/app/integrations/sap/schemas.py`)**: Strongly-typed Pydantic contracts for outbound SAP data and inbound SAP responses, protecting the core domain.
3. **SAP Mapper (`backend/app/integrations/sap/mapper.py`)**: The anti-corruption layer for translating SAP DTOs into internal Postgres-compatible `models`.
4. **SAP Configuration (`backend/app/core/config.py`)**: Contains environment toggles (e.g. `SAP_ENABLED`, `SAP_BASE_URL`).
5. **SAP Status Endpoint (`GET /api/v1/integrations/sap/status`)**: Reports configuration health to the frontend.
6. **Recovery Action Contract (`SAPRecoveryActionRequest`)**: Defined in schemas, mapping an approved action into a structured system-agnostic format ready for SAP submission.

## What Member 3 Must Implement
1. **Real SAP Adapter**: Create `RealSAPAdapter` inheriting from `SAPIntegrationPort`. It should handle authentication and payload serialization for BTP / S/4HANA.
2. **Real Authentication**: Use OAuth or client credentials via the `.env` variables provided.
3. **Real BTP/S4 Integration**: Integrate the relevant SAP APIs via `requests` or an official SDK inside `RealSAPAdapter`.
4. **Real Master-Data & Inventory Retrieval**: Implement `get_supplier()`, `get_inventory()`, etc., fetching data from SAP.
5. **Real Approved-Action Execution**: Implement `submit_recovery_action()` to dispatch the validated decision (e.g. create a Purchase Order) to SAP.
6. **Real Connectivity Verification**: Update `get_status()` in your real adapter to return `"connected": True` only after a successful ping.

## What Member 3 MUST NOT Modify Unnecessarily
- Deterministic Pipelines: **Impact Engine**, **Recovery Engine**, **Scenario Engine**
- Frontend Architecture (React Components/Flow)
- AI Contracts (Member 4's responsibility)
- Core Domain Entities (`backend/app/db/models.py`)

## To Activate Your Integration:
1. Replace `PlaceholderSAPAdapter` with your `RealSAPAdapter` in `backend/app/api/routes/integrations.py`.
2. Toggle `SAP_ENABLED=true` inside `.env`.
3. Provide your BTP/S4 credentials inside `.env` securely. Never commit them!
