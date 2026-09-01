export interface NodeData {
  id: string;
  type: string;
  label: string;
  status: string;
  [key: string]: any;
}

export interface EdgeData {
  id: string;
  source: string;
  target: string;
  relationship_type: string;
  status: string;
}

export interface GraphData {
  nodes: NodeData[];
  edges: EdgeData[];
}

export interface Scenario {
  scenario_id: string;
  name: string;
}

export interface Disruption {
  disruption_id: string;
  type: string;
  severity: string;
  target_entity_id: string;
  target_entity_type: string;
  description: string;
  start_time: string;
}

export interface ImpactData {
  scenario_id: string;
  affected_entities: string[];
  affected_materials: string[];
  affected_plants: string[];
  affected_products: string[];
  affected_orders: string[];
  delayed_orders: number;
  revenue_at_risk: number;
  capacity_shortfall: number;
  inventory_risk: number;
}

export interface RecoveryOptionDetails {
  supplier_id: string;
  material_id: string;
}

export interface RecoveryOption {
  option_id: string;
  action_type: string;
  details: RecoveryOptionDetails;
  estimated_cost: number;
  expected_revenue_protected: number;
  feasible: boolean;
}

export interface RecoveryData {
  scenario_id: string;
  options: RecoveryOption[];
}
export interface IntegrationStatus {
  provider: string;
  status: string;
  connected: boolean;
  capabilities?: Record<string, boolean>;
}

export interface SystemHealth {
  connections: IntegrationStatus[];
}
export interface AIRecommendation {
  recommended_action: {
    action_type: string;
    details: RecoveryOptionDetails;
    estimated_cost: number;
    mitigated_risk_value: number;
  };
  reasoning: string;
  confidence_score: number;
  expected_impact: string;
}

export interface AuditRecord {
  audit_id: string;
  scenario_id: string;
  recovery_plan_id: string;
  action: string;
  timestamp: string;
  details?: any;
}
