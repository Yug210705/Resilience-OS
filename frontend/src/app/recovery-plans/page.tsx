'use client';

import { useSimulationStore } from '@/stores/useSimulationStore';
import { fetchRecoveryPlans } from '@/services/api';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, TrendingDown, Clock, PackageCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function RecoveryPlansPage() {
  const { activeDisruption } = useSimulationStore();
  const [plans, setPlans] = useState<any[]>([]);
  const [revenueProtected, setRevenueProtected] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const materialId = activeDisruption?.recovery_context?.material_shortages?.[0]?.material_id;

  useEffect(() => {
    if (!materialId) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    
    async function loadPlans() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchRecoveryPlans(materialId!);
        if (isMounted) {
          setPlans(data.ranked_plans || []);
          setRevenueProtected(data.total_revenue_at_risk || 0);
          if (data.ranked_plans?.length > 0) {
            setSelectedPlanId(data.ranked_plans[0].id);
          }
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch recovery plans');
          setLoading(false);
        }
      }
    }

    loadPlans();

    return () => {
      isMounted = false;
    };
  }, [materialId]);

  if (!activeDisruption || !materialId) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] max-w-4xl mx-auto space-y-6">
        <div className="bg-slate-100 p-6 rounded-full">
          <PackageCheck className="w-12 h-12 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No Disruption Selected</h2>
        <p className="text-slate-500 text-center max-w-lg">
          To generate recovery plans, you must first select a disruption or run a simulation from the Command Center.
        </p>
        <Link href="/command-center" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm transition-colors">
          Go to Command Center
        </Link>
      </div>
    );
  }

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Recovery Plans</h1>
          <p className="text-slate-500 mt-1">Evaluate and manage recovery strategies based on deterministic engine scoring</p>
        </div>
      </div>

      {/* Disruption Context */}
      <div className="bg-slate-900 rounded-xl p-5 shadow-sm text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-slate-400 font-semibold mb-2 md:mb-0">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          Disruption Context
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm flex-1 md:ml-8">
          <div>
            <div className="text-slate-500 mb-1">Disruption ID</div>
            <div className="font-semibold font-mono">{activeDisruption.simulation_id}</div>
          </div>
          <div>
            <div className="text-slate-500 mb-1">Affected Node</div>
            <div className="font-semibold flex items-center">
              {activeDisruption.disruption.affected_entity_id}
              <span className="ml-2 text-[10px] uppercase font-bold bg-slate-800 text-blue-400 px-2 py-0.5 rounded">
                {activeDisruption.disruption.disruption_type}
              </span>
            </div>
          </div>
          <div>
            <div className="text-slate-500 mb-1">Material Affected</div>
            <div className="font-semibold">{materialId}</div>
          </div>
          <div>
            <div className="text-slate-500 mb-1">Impact Severity</div>
            <div className="font-semibold text-red-400">{activeDisruption.disruption.severity === 1 ? 'Severe (1.0)' : `Partial (${activeDisruption.disruption.severity})`}</div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="py-24 flex flex-col items-center justify-center space-y-4">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          <div className="text-slate-600 font-medium">Fetching SAP supply data and optimizing scenarios...</div>
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h3 className="text-lg font-bold text-red-900">Recovery Engine Unavailable</h3>
          <p className="text-red-700 max-w-lg mx-auto">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-white border border-red-200 text-red-700 hover:bg-red-50 font-semibold py-2 px-6 rounded-lg shadow-sm"
          >
            Retry Connection
          </button>
        </div>
      )}

      {!loading && !error && plans.length > 0 && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
              <div className="text-slate-500 font-semibold mb-2">Total Scenarios Generated</div>
              <div className="text-4xl font-extrabold text-slate-900">{plans.length}</div>
              <div className="text-xs text-slate-500 mt-2">Deterministic optimization complete</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
              <div className="text-slate-500 font-semibold mb-2">Recommended Strategy</div>
              <div className="text-2xl font-extrabold text-blue-600 truncate">{plans[0].id}</div>
              <div className="text-xs text-emerald-600 font-bold mt-2 flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Best balanced score
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
              <div className="text-slate-500 font-semibold mb-2">Revenue Protected</div>
              <div className="text-3xl font-extrabold text-emerald-600">{formatCurrency(revenueProtected)}</div>
              <div className="text-xs text-slate-500 mt-2">Downstream orders rescued</div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Scenarios Table */}
            <div className="lg:w-2/3 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h3 className="font-bold text-slate-900">Generated Recovery Plans</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-white text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Scenario</th>
                      <th className="px-6 py-4 font-semibold">Suppliers Used</th>
                      <th className="px-6 py-4 font-semibold text-right">Recovery Time</th>
                      <th className="px-6 py-4 font-semibold text-right">Est. Cost</th>
                      <th className="px-6 py-4 font-semibold text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {plans.map((plan, idx) => {
                      const isRecommended = idx === 0;
                      const isSelected = plan.id === selectedPlanId;
                      return (
                        <tr 
                          key={plan.id} 
                          onClick={() => setSelectedPlanId(plan.id)}
                          className={`cursor-pointer transition-colors hover:bg-blue-50/50 ${isSelected ? 'bg-blue-50' : 'bg-white'}`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <span className={`font-semibold ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>{plan.id}</span>
                              {isRecommended && (
                                <span className="ml-3 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase">Recommended</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-700">
                            {plan.suppliers_used.join(' + ')}
                          </td>
                          <td className="px-6 py-4 text-right font-medium">
                            {plan.max_delay_days} days
                          </td>
                          <td className="px-6 py-4 text-right text-slate-900 font-mono">
                            {formatCurrency(plan.total_cost)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs ${isRecommended ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                              {Math.round(plan.final_score / 10000)}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selected Plan Details */}
            {selectedPlan && (
              <div className="lg:w-1/3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm flex flex-col">
                <div className="px-6 py-4 border-b border-slate-200 bg-white rounded-t-xl flex justify-between items-center">
                  <h3 className="font-bold text-slate-900">Scenario Details</h3>
                  {plans[0].id === selectedPlan.id && (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded uppercase flex items-center">
                      <ShieldCheck className="w-3 h-3 mr-1" /> Recommended
                    </span>
                  )}
                </div>
                <div className="p-6 space-y-6 flex-1">
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2">Strategy Overview</div>
                    <div className="font-semibold text-slate-900">Activate Alternate Suppliers</div>
                    <p className="text-sm text-slate-600 mt-1">
                      Routing supply to {selectedPlan.suppliers_used.join(' and ')} to fulfill the shortage quantity.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2">Calculated Impact (Deterministic)</div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                      <div className="flex items-center text-slate-600 text-sm"><Clock className="w-4 h-4 mr-2"/> Max Recovery Time</div>
                      <div className="font-semibold text-slate-900">{selectedPlan.max_delay_days} days</div>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                      <div className="flex items-center text-slate-600 text-sm"><TrendingDown className="w-4 h-4 mr-2"/> Total Plan Cost</div>
                      <div className="font-semibold text-slate-900 font-mono">{formatCurrency(selectedPlan.total_cost)}</div>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                      <div className="flex items-center text-slate-600 text-sm"><AlertCircle className="w-4 h-4 mr-2"/> SLA Exposure</div>
                      <div className="font-semibold text-red-600 font-mono">{formatCurrency(selectedPlan.total_sla_exposure)}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-slate-600 text-sm">Blended Risk Score</div>
                      <div className="font-semibold text-slate-900">{selectedPlan.blended_risk.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white border-t border-slate-200 rounded-b-xl">
                  {/* Future integration for Risk Audit */}
                  <Link 
                    href={`/risk/${activeDisruption.simulation_id}?plan=${selectedPlan.id}&supplier=${selectedPlan.suppliers_used[0]}`}
                    className="w-full flex justify-center items-center py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition-colors"
                  >
                    Generate AI Risk Audit
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {!loading && !error && plans.length === 0 && (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="text-slate-500">No alternate recovery plans found for this material shortage.</p>
        </div>
      )}

    </div>
  );
}
