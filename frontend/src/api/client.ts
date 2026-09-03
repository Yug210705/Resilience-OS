import axios from 'axios';
import { GraphData, Scenario, Disruption, ImpactData, RecoveryData, SystemHealth, AIRecommendation, AuditRecord } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  getHealth: async (): Promise<SystemHealth> => {
    const response = await apiClient.get<SystemHealth>('/integrations/health');
    return response.data;
  },

  getGraph: async (): Promise<GraphData> => {
    const response = await apiClient.get<GraphData>('/network/graph');
    return response.data;
  },

  createScenario: async (scenarioId: string, name: string): Promise<Scenario> => {
    const response = await apiClient.post<Scenario>('/scenarios', {
      scenario_id: scenarioId,
      name,
    });
    return response.data;
  },

  createDisruption: async (
    scenarioId: string,
    disruptionId: string,
    targetEntityId: string,
    targetEntityType: string = 'Supplier'
  ): Promise<Disruption> => {
    const response = await apiClient.post<Disruption>(`/scenarios/${scenarioId}/disruptions`, {
      disruption_id: disruptionId,
      type: 'SUPPLIER_FAILURE',
      severity: 'CRITICAL',
      target_entity_id: targetEntityId,
      target_entity_type: targetEntityType,
      description: 'Triggered via Command Center',
      start_time: new Date().toISOString(),
    });
    return response.data;
  },

  getImpact: async (scenarioId: string): Promise<ImpactData> => {
    const response = await apiClient.get<ImpactData>(`/scenarios/${scenarioId}/impact`);
    return response.data;
  },

  getRecoveryOptions: async (scenarioId: string): Promise<RecoveryData> => {
    const response = await apiClient.get<RecoveryData>(`/scenarios/${scenarioId}/recovery-options`);
    return response.data;
  },

  getAIRecommendation: async (scenarioId: string): Promise<AIRecommendation> => {
    const response = await apiClient.post<AIRecommendation>(`/scenarios/${scenarioId}/ai-recommendation`);
    return response.data;
  },

  createRecoveryPlan: async (scenarioId: string, planData: any): Promise<{plan_id: string, status: string}> => {
    const response = await apiClient.post(`/scenarios/${scenarioId}/recovery-plans`, planData);
    return response.data;
  },

  approveRecoveryPlan: async (scenarioId: string, planId: string): Promise<{sap_execution: string}> => {
    const response = await apiClient.post(`/scenarios/${scenarioId}/recovery-plans/${planId}/approve`);
    return response.data;
  },

  rejectRecoveryPlan: async (scenarioId: string, planId: string): Promise<void> => {
    await apiClient.post(`/scenarios/${scenarioId}/recovery-plans/${planId}/reject`);
  },

  getAuditRecords: async (scenarioId: string): Promise<AuditRecord[]> => {
    const response = await apiClient.get<AuditRecord[]>(`/scenarios/${scenarioId}/audit`);
    return response.data;
  }
};
