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

// Fetch all persisted plans for the Workspace
export async function fetchPersistedRecoveryPlans(): Promise<RecoveryPlan[]> {
  const res = await fetch(`${AI_API_URL}/api/recovery/plans`);
  if (!res.ok) throw new Error("Failed to fetch recovery plans");
  const data = await res.json();
  
  // Legacy payload check (Ghost process issue)
  if (data && data.ranked_plans) {
    throw new Error("API Contract Mismatch: Received legacy candidate options instead of persisted Recovery Plans.");
  }
  
  let plansArray: any[] = [];
  
  if (Array.isArray(data)) {
    plansArray = data;
  } else if (data && Array.isArray(data.plans)) {
    plansArray = data.plans;
  } else if (data && Array.isArray(data.data)) {
    plansArray = data.data;
  } else {
    throw new Error("API Contract Mismatch: Expected an array of Recovery Plans.");
  }
  
  // Validate that every element has the required fields
  for (const plan of plansArray) {
    if (!plan.id || !plan.status) {
      throw new Error(`API Contract Mismatch: Invalid Recovery Plan record missing 'id' or 'status'. Received: ${JSON.stringify(plan)}`);
    }
  }
  
  return plansArray as RecoveryPlan[];
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

