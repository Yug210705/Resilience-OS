import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { GraphData, AIRecommendation } from '../../api/types';
import { Play, Activity, ShieldAlert, ShieldCheck, Cpu, Check, X, Server, ArrowRight, RotateCcw } from 'lucide-react';

interface ScenarioPanelProps {
  graphData: GraphData;
  onScenarioCreated: (scenarioId: string | null) => void;
  activeScenarioId: string | null;
}

export default function ScenarioPanel({ graphData, onScenarioCreated, activeScenarioId }: ScenarioPanelProps) {
  const queryClient = useQueryClient();
  const suppliers = graphData.nodes.filter(n => n.type === 'Supplier');
  const [targetId, setTargetId] = useState(suppliers.length > 0 ? suppliers[0].id : '');
  const [aiRec, setAiRec] = useState<AIRecommendation | null>(null);
  const [sapResult, setSapResult] = useState<string | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Mutations
  const createScenarioMut = useMutation({
    mutationFn: () => api.createScenario(`SCEN-${Date.now()}`, 'Simulated Scenario'),
    onSuccess: (data) => onScenarioCreated(data.scenario_id),
  });

  const createDisruptionMut = useMutation({
    mutationFn: (scenarioId: string) => api.createDisruption(scenarioId, `DIS-${Date.now()}`, targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['impact', activeScenarioId] });
      queryClient.invalidateQueries({ queryKey: ['recovery', activeScenarioId] });
    },
  });

  const { data: recoveryData, isLoading: isLoadingRecovery } = useQuery({
    queryKey: ['recovery', activeScenarioId],
    queryFn: () => activeScenarioId ? api.getRecoveryOptions(activeScenarioId) : null,
    enabled: !!activeScenarioId,
  });

  const handleSimulate = async () => {
    try {
      setAiRec(null);
      setSapResult(null);
      setApprovalStatus('PENDING');
      const scenario = await createScenarioMut.mutateAsync();
      await createDisruptionMut.mutateAsync(scenario.scenario_id);
    } catch (error) {
      console.error('Simulation failed', error);
    }
  };

  const handleGetAiRec = async () => {
    if (!activeScenarioId) return;
    setIsAiLoading(true);
    try {
      const rec = await api.getAIRecommendation(activeScenarioId);
      setAiRec(rec);
    } catch (e: any) {
      alert(e.response?.data?.detail || "AI Provider Unavailable");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!activeScenarioId || !aiRec) return;
    try {
      const plan = await api.createRecoveryPlan(activeScenarioId, {
        action_type: aiRec.recommended_action.action_type,
        details: aiRec.recommended_action.details,
        estimated_cost: aiRec.recommended_action.estimated_cost,
        mitigated_risk_value: aiRec.recommended_action.mitigated_risk_value,
        ai_reasoning: aiRec.reasoning
      });
      const res = await api.approveRecoveryPlan(activeScenarioId, plan.plan_id);
      setApprovalStatus('APPROVED');
      setSapResult(res.sap_execution);
    } catch (e: any) {
      alert("Approval failed: " + (e.response?.data?.detail || e.message));
    }
  };

  const handleReject = async () => {
    if (!activeScenarioId || !aiRec) return;
    try {
      const plan = await api.createRecoveryPlan(activeScenarioId, {
        action_type: aiRec.recommended_action.action_type,
        details: aiRec.recommended_action.details,
        estimated_cost: aiRec.recommended_action.estimated_cost,
        mitigated_risk_value: aiRec.recommended_action.mitigated_risk_value,
        ai_reasoning: aiRec.reasoning
      });
      await api.rejectRecoveryPlan(activeScenarioId, plan.plan_id);
      setApprovalStatus('REJECTED');
    } catch (e: any) {
      alert("Rejection failed: " + (e.response?.data?.detail || e.message));
    }
  };

  const handleReset = () => {
    setAiRec(null);
    setSapResult(null);
    setApprovalStatus('PENDING');
    onScenarioCreated(null);
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-[-8px_0_30px_rgba(0,0,0,0.03)] z-10 overflow-y-auto font-sans">
      
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur z-20 border-b border-slate-200 px-6 py-5">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wide">
          <Activity className="w-4 h-4 text-blue-600" />
          Scenario Simulator
        </h2>
        <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-wider font-medium">Evaluate Supply Chain Counterfactuals</p>
      </div>

      <div className="p-6">
        {!activeScenarioId ? (
          <div className="flex flex-col gap-5">
            {/* Empty State */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 text-center flex flex-col items-center">
              <ShieldCheck className="w-8 h-8 text-emerald-500 mb-2" />
              <h3 className="text-sm font-bold text-slate-700">No Active Disruptions</h3>
              <p className="text-xs text-slate-500 mt-1">Configure a scenario below to assess network resilience.</p>
            </div>

            {/* Creation Form */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Simulation Parameters</h3>
              
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5 tracking-wide">Target Entity</label>
                  <select 
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded py-2 px-3 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.label} ({s.id})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5 tracking-wide">Event Type</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded py-2 px-3 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                    <option>Supplier Failure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5 tracking-wide">Severity</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded py-2 px-3 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                    <option>CRITICAL</option>
                  </select>
                </div>

                <button 
                  onClick={handleSimulate}
                  disabled={createScenarioMut.isPending || createDisruptionMut.isPending}
                  className="mt-2 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {createScenarioMut.isPending || createDisruptionMut.isPending ? (
                    <span className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"/> EXECUTING...</span>
                  ) : (
                    <><Play className="w-3.5 h-3.5" /> SIMULATE IMPACT</>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col gap-5 pb-6">
            
            {/* Active Disruption Banner */}
            <div className="bg-red-50/80 border border-red-200 p-4 rounded-lg flex items-start gap-3 shadow-sm">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <h3 className="text-xs font-bold text-red-900 uppercase tracking-wide">Disruption Active</h3>
                <p className="text-sm font-medium text-red-800 mt-0.5">{targetId} • Supplier Failure</p>
                <div className="inline-flex mt-2 items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                  SEVERITY: CRITICAL
                </div>
              </div>
            </div>

            {/* Recovery Options Section */}
            <div>
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Deterministic Feasibility
              </h3>
              
              {isLoadingRecovery ? (
                <div className="text-xs font-medium text-slate-500 flex items-center gap-2 p-4 border border-slate-100 rounded bg-slate-50">
                  <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"/>
                  Evaluating network alternatives...
                </div>
              ) : recoveryData?.options.length === 0 ? (
                <div className="text-xs font-medium text-slate-500 p-4 border border-slate-200 rounded bg-slate-50 italic">
                  No feasible recovery options found in current network parameters.
                </div>
              ) : (
                <div className="space-y-3">
                  {recoveryData?.options.map(opt => (
                    <div key={opt.option_id} className="border border-slate-200 bg-white rounded-lg p-4 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-colors">
                      <div className="absolute top-0 right-0 bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-1 rounded-bl-lg border-b border-l border-slate-200">
                        FEASIBLE
                      </div>
                      <h4 className="font-bold text-slate-800 text-xs tracking-wide">Alternative Supplier</h4>
                      <p className="text-blue-600 text-sm font-semibold mt-0.5">{opt.details.supplier_id}</p>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                        <div>
                          <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Protected</span>
                          <span className="text-sm font-semibold text-emerald-600">${opt.expected_revenue_protected.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Est. Cost</span>
                          <span className="text-sm font-semibold text-slate-700">${opt.estimated_cost.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {!aiRec && (
                    <button 
                      onClick={handleGetAiRec}
                      disabled={isAiLoading}
                      className="w-full mt-2 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 font-bold py-2.5 px-3 rounded text-[11px] tracking-wider uppercase transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isAiLoading ? (
                         <span className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"/> ANALYZING CONSTRAINTS...</span>
                      ) : (
                        <><Cpu className="w-3.5 h-3.5" /> REQUEST AI RECOMMENDATION</>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* AI Recommendation & Approval */}
            {aiRec && approvalStatus === 'PENDING' && (
              <div className="border border-blue-200 bg-blue-50/30 rounded-lg p-5 shadow-sm">
                 <div className="flex items-center justify-between mb-3 border-b border-blue-100 pb-2">
                   <h3 className="font-bold text-blue-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                     <Cpu className="w-3.5 h-3.5" /> AI Recommendation
                   </h3>
                   <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-blue-200">
                     AWAITING REVIEW
                   </span>
                 </div>
                 
                 <p className="text-sm font-medium text-slate-700 mb-4 leading-relaxed">{aiRec.reasoning}</p>
                 
                 <div className="bg-white p-3 rounded border border-blue-100 mb-5 shadow-sm">
                   <p className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-1">Recommended Action</p>
                   <p className="text-sm font-semibold text-slate-800">{aiRec.recommended_action.action_type}</p>
                   <p className="text-xs font-medium text-blue-600 mt-1">Target: {aiRec.recommended_action.details.supplier_id}</p>
                 </div>
                 
                 <div className="flex gap-3">
                   <button onClick={handleReject} className="flex-1 py-2 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 rounded text-[11px] font-bold tracking-wider transition-colors flex justify-center items-center gap-1.5 shadow-sm">
                     <X className="w-3.5 h-3.5"/> REJECT
                   </button>
                   <button onClick={handleApprove} className="flex-1 py-2 border border-emerald-600 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold tracking-wider transition-colors flex justify-center items-center gap-1.5 shadow-sm">
                     <Check className="w-3.5 h-3.5"/> APPROVE & EXECUTE
                   </button>
                 </div>
              </div>
            )}

            {/* Approved / SAP Status */}
            {approvalStatus === 'APPROVED' && (
               <div className="border border-emerald-200 bg-emerald-50/50 rounded-lg p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 border-b border-emerald-100 pb-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold text-emerald-900 text-[11px] uppercase tracking-wider">Action Approved</h3>
                  </div>
                  
                  <div className="bg-white p-4 rounded border border-emerald-100 shadow-sm">
                    <p className="font-bold text-[10px] text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <Server className="w-3 h-3 text-slate-400"/> SAP Execution Status
                    </p>
                    <div className="flex items-start gap-2">
                      <ArrowRight className="w-3 h-3 text-emerald-500 mt-0.5" />
                      <p className="text-slate-700 font-mono text-[11px] leading-relaxed break-all">
                        {sapResult || 'Pending transmission...'}
                      </p>
                    </div>
                  </div>
               </div>
            )}

            {/* Rejected Status */}
            {approvalStatus === 'REJECTED' && (
               <div className="border border-red-200 bg-red-50/50 rounded-lg p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <X className="w-4 h-4 text-red-600" />
                    <h3 className="font-bold text-red-900 text-[11px] uppercase tracking-wider">Action Rejected</h3>
                  </div>
                  <p className="text-xs font-medium text-red-700 mt-1">The recovery plan was rejected by the operator. Audit record has been secured.</p>
               </div>
            )}

            <button 
              onClick={handleReset}
              className="mt-4 w-full bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold tracking-wider py-2.5 px-4 rounded text-[11px] uppercase transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Scenario
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
