# AI Integration Guide

## 1. AI Integration Architecture
The AI integration acts as a strict boundary between the deterministic engines (Impact and Recovery) and Member 4's future LLM implementation.
The sequence is:
`Deterministic Options -> AIAdapter -> AIProvider -> LLM -> AIAdapter Validation -> API Response`

## 2. AI Provider Interface
The core integration point is the abstract `AIProvider` class located in `backend/app/ai/provider.py`. Member 4 must subclass this and implement the `evaluate_recovery(self, request: AIRequestPayload) -> AIResponsePayload` method.

## 3. Contract Source of Truth
The single source of truth for payloads is `docs/ai-data-contract.md`. 
The `backend/app/ai/contracts.py` file maps exactly to this JSON schema using Pydantic.

## 4. Expected Integration Point for Member 4
1. Pull the repository.
2. Create a concrete class implementing `AIProvider`.
3. In `backend/app/api/routes/ai.py` (or through an injection container), instantiate `AIAdapter` with the concrete provider:
   `ai_adapter = AIAdapter(provider=MyConcreteAIProvider())`
4. Set `AI_PROVIDER_ENABLED=true` in `.env`.

## 5. Configuration Requirements
- `AI_PROVIDER_ENABLED`: Boolean toggle in `.env`.
- No credentials or API keys are hardcoded. Member 4 should add their specific keys (e.g., `OPENAI_API_KEY`) to `.env`.

## 6. Failure Behavior
The API explicitly handles failures via standard HTTP codes rather than returning fake data:
- `503 Service Unavailable`: AI Provider disabled, unconfigured, or timing out (`AIProviderUnavailableError`).
- `422 Unprocessable Entity`: Validation failure or AI Hallucination detected (`AIIntegrationError`).

## 7. Security / Validation Rules (Hallucination Protection)
The `AIAdapter` compares the recommended actions returned by the AI against the pre-calculated feasible options provided by the deterministic Recovery Engine. If the AI recommends a supplier/action that was not deemed feasible, the adapter rejects the entire response with an `AIHallucinationError`. The AI is strictly an evaluator, not an inventor.

## 8. Connecting the Real AI
- Implement the provider.
- Connect the adapter.
- Pass the payload securely.
- Ensure the frontend endpoint `/api/v1/scenarios/{scenario_id}/ai-recommendation` is mapped in the React client when Chapter 4 UI components are built.

## 9. Intentionally NOT Implemented
- The concrete AI agent/LLM (Owned by Member 4).
- The Chapter 4 React components for the AI response (Owned by Frontend team in a future iteration).
- SAP Integration execution.
