const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function fetchGraph() {
  const res = await fetch(`${API_URL}/api/supply-chain/graph`);
  if (!res.ok) throw new Error("Failed to fetch graph");
  return res.json();
}

export async function simulateDisruption(payload: any) {
  const res = await fetch(`${API_URL}/api/disruptions/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let errorDetail = "Unknown error";
    try {
      const errJson = await res.json();
      errorDetail = errJson.detail || JSON.stringify(errJson);
    } catch(e) {
      errorDetail = await res.text();
    }
    throw new Error(`Failed to simulate disruption: ${errorDetail}`);
  }
  return res.json();
}

export async function fetchVulnerabilities() {
  const res = await fetch(`${API_URL}/api/supply-chain/vulnerabilities`);
  if (!res.ok) throw new Error("Failed to fetch vulnerabilities");
  return res.json();
}

const AI_API_URL = process.env.NEXT_PUBLIC_AI_API_URL || 'http://127.0.0.1:8001';

// For the Disruption -> Recovery Options page
export async function fetchRecoveryOptions(materialId: string) {
  const res = await fetch(`${AI_API_URL}/api/recovery/options?material_id=${encodeURIComponent(materialId)}`);
  if (!res.ok) {
    let errorDetail = "Unknown error";
    try {
      const errJson = await res.json();
      errorDetail = errJson.detail || JSON.stringify(errJson);
    } catch(e) {
      errorDetail = await res.text();
    }
    throw new Error(`SAP or Engine Error: ${errorDetail}`);
  }
  return res.json();
}

// Create a persisted plan when clicking 'Audit Risk & Approve'
export async function createRecoveryPlan(disruptionId: string, materialId: string, optionId: string, scenarioId?: string) {
  const res = await fetch(`${AI_API_URL}/api/recovery/plans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ disruption_id: disruptionId, material_id: materialId, option_id: optionId, scenario_id: scenarioId }),
  });
  if (!res.ok) {
    let errorDetail = "Unknown error";
    try {
      const errJson = await res.json();
      errorDetail = errJson.detail || JSON.stringify(errJson);
    } catch(e) {
      errorDetail = await res.text();
    }
    throw new Error(`Failed to create plan: ${errorDetail}`);
  }
  return res.json();
}

export type RecoveryPlanStatus = 
  | 'PENDING_AUDIT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'COMPLETED'
  | 'REJECTED';

export interface RecoveryPlan {
  id: string;
  disruption_id: string;
  strategy: string;
  supplier_id: string;
  total_cost: number;
  max_delay_days: number;
  blended_risk: number;
  total_sla_exposure: number;
  final_score: number;
  status: RecoveryPlanStatus;
  created_at: string;
  details?: any;
}

export interface RecoveryPlanListResponse {
  items: RecoveryPlan[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
  total_active: number;
  total_pending_audit: number;
  total_pending_approval: number;
  total_completed: number;
  /** Sum of total_cost (recovery procurement cost) across all matching plans */
  aggregate_plan_cost: number;
  /** Sum of total_sla_exposure (SLA penalty risk) across all matching plans */
  aggregate_sla_exposure: number;
  /** Alias for aggregate_plan_cost; kept for backward compatibility */
  aggregate_exposure: number;
}

export interface FetchRecoveryPlansParams {
  limit?: number;
  offset?: number;
  search?: string;
  status?: string;
  disruption_id?: string;
}

// Fetch all persisted plans for the Workspace
export async function fetchPersistedRecoveryPlans(params?: FetchRecoveryPlansParams): Promise<RecoveryPlanListResponse> {
  const query = new URLSearchParams();
  if (params?.limit !== undefined) query.append('limit', params.limit.toString());
  if (params?.offset !== undefined) query.append('offset', params.offset.toString());
  if (params?.search) query.append('search', params.search);
  if (params?.status) query.append('status', params.status);
  if (params?.disruption_id) query.append('disruption_id', params.disruption_id);

  const res = await fetch(`${AI_API_URL}/api/recovery/plans?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch recovery plans");
  const data = await res.json();
  
  if (data && data.ranked_plans) {
    throw new Error("API Contract Mismatch: Received legacy candidate options instead of persisted Recovery Plans.");
  }
  
  // Basic validation that we received the expected wrapper object
  if (!data || typeof data.total !== 'number' || !Array.isArray(data.items)) {
    throw new Error("API Contract Mismatch: Expected a paginated RecoveryPlanListResponse.");
  }
  
  return data as RecoveryPlanListResponse;
}

// Fetch single recovery plan by ID
export async function fetchRecoveryPlan(planId: string): Promise<RecoveryPlan> {
  const res = await fetch(`${AI_API_URL}/api/recovery/plans/${encodeURIComponent(planId)}`);
  if (!res.ok) throw new Error("Failed to fetch recovery plan");
  return res.json();
}

// Update status
export async function updateRecoveryPlanStatus(planId: string, status: string) {
  const res = await fetch(`${AI_API_URL}/api/recovery/plans/${encodeURIComponent(planId)}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}
export async function runRecoveryPipeline(materialId: string) {
  const res = await fetch(`${AI_API_URL}/run-recovery?material_id=${encodeURIComponent(materialId)}`, {
    method: 'POST'
  });
  if (!res.ok) {
    let errorDetail = "Unknown error";
    try {
      const errJson = await res.json();
      errorDetail = errJson.detail || JSON.stringify(errJson);
    } catch(e) {
      errorDetail = await res.text();
    }
    throw new Error(`AI Pipeline Error: ${errorDetail}`);
  }
  return res.json();
}

export interface Scenario {
  id: string;
  name: string;
  disruption_id: string;
  strategy: string;
  supplier_id: string;
  total_cost: number;
  max_delay_days: number;
  blended_risk: number;
  total_sla_exposure: number;
  final_score: number;
  status: 'SIMULATING' | 'READY' | 'SELECTED' | 'ARCHIVED';
  created_at: string;
  updated_at: string;
  details?: Record<string, any>;
}

export interface ScenarioListResponse {
  items: Scenario[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
  total_active: number;
  total_simulating: number;
  total_ready: number;
  total_selected: number;
  aggregate_sla_exposure: number;
}

export interface FetchScenariosParams {
  limit?: number;
  offset?: number;
  status?: string;
  search?: string;
  disruption_id?: string;
}

export async function fetchScenarios(params: FetchScenariosParams = {}): Promise<ScenarioListResponse> {
  const qp = new URLSearchParams();
  if (params.limit !== undefined) qp.set('limit', String(params.limit));
  if (params.offset !== undefined) qp.set('offset', String(params.offset));
  if (params.status) qp.set('status', params.status);
  if (params.search) qp.set('search', params.search);
  if (params.disruption_id) qp.set('disruption_id', params.disruption_id);
  const qs = qp.toString();
  const res = await fetch(`${AI_API_URL}/api/scenarios${qs ? `?${qs}` : ''}`);
  if (!res.ok) {
    const detail = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(detail.detail || 'Failed to fetch scenarios');
  }
  return res.json();
}

export async function generateScenarios(disruptionId: string, materialId: string, force = false): Promise<Scenario[]> {
  const url = force
    ? `${AI_API_URL}/api/scenarios/generate?force=true`
    : `${AI_API_URL}/api/scenarios/generate`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ disruption_id: disruptionId, material_id: materialId }),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(detail.detail || 'Failed to generate scenarios');
  }
  return res.json();
}

export async function updateScenarioStatus(scenarioId: string, status: string): Promise<Scenario> {
  const res = await fetch(`${AI_API_URL}/api/scenarios/${scenarioId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update scenario status');
  return res.json();
}
