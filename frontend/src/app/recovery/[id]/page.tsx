'use client';

import { useSimulationStore } from '@/stores/useSimulationStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ShieldCheck, TrendingDown, Clock, PackageCheck, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { fetchRecoveryOptions, createRecoveryPlan } from '@/services/api';

export interface RecoveryOption {
  id: string;
  suppliers_used: string[];
  total_cost: number;
  max_delay_days: number;
  blended_risk: number;
  total_sla_exposure: number;
  final_score: number;
}

export default function RecoveryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { activeDisruption } = useSimulationStore();
  const router = useRouter();

  const [options, setOptions] = useState<RecoveryOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [creatingId, setCreatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeDisruption) {
      router.push('/command-center');
      return;
    }

    const materialId = activeDisruption.recovery_context?.material_shortages?.[0]?.material_id || 'MAT-12';

    fetchRecoveryOptions(materialId)
      .then((res) => {
        // Validate API Contract
        if (res && Array.isArray(res.ranked_plans)) {
          setOptions(res.ranked_plans);
        } else {
          throw new Error('API Contract Mismatch: Expected ranked_plans in response.');
        }
        setLoadingOptions(false);
      })
      .catch((err) => {
        setError(err.message || 'Recovery optimization service is unavailable.');
        setLoadingOptions(false);
      });
  }, [activeDisruption, router]);

  const handleCreatePlan = async (optionId: string) => {
    if (creatingId) return;
    setCreatingId(optionId);
    setError(null);
    
    try {
      const materialId = activeDisruption?.recovery_context?.material_shortages?.[0]?.material_id || 'MAT-12';
      const plan = await createRecoveryPlan(id, materialId, optionId);
      router.push(`/risk/${plan.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create recovery plan.');
      setCreatingId(null);
    }
  };

  if (!activeDisruption) return null;


  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end border-b border-slate-200 pb-4 mt-6">
        <div>
          <div className="flex items-center space-x-2 text-sm text-slate-500 mb-2">
            <Link href="/command-center" className="hover:text-slate-900 transition-colors">Command Center</Link>
            <span>/</span>
            <Link href={`/disruptions/${id}`} className="hover:text-slate-900 transition-colors">{id}</Link>
            <span>/</span>
            <span className="font-semibold text-slate-900">Recovery Options</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Recovery Optimization</h1>
          <p className="text-slate-500 mt-1">Evaluating alternative supply sources and allocation strategies.</p>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
      
      {loadingOptions ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3].map((skeleton) => (
            <div key={skeleton} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm animate-pulse flex flex-col h-full">
              <div className="h-6 bg-slate-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-slate-100 rounded w-1/3 mb-8"></div>
              <div className="space-y-4 flex-1">
                <div className="h-4 bg-slate-100 rounded w-full"></div>
                <div className="h-4 bg-slate-100 rounded w-full"></div>
                <div className="h-4 bg-slate-100 rounded w-full"></div>
              </div>
              <div className="h-10 bg-slate-200 rounded w-full mt-8"></div>
            </div>
          ))}
        </div>
      ) : options.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {options.map((plan: RecoveryOption, i: number) => {
            const isRecommended = i === 0; // Backend returns ranked list; first is recommended
            const supplierStr = plan.suppliers_used?.join(', ') || 'Unknown';
            const isCreating = creatingId === plan.id;
            
            return (
              <div key={plan.id} className={`bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col h-full ${isRecommended ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200'}`}>
                {isRecommended && (
                  <div className="bg-blue-500 text-white text-xs font-bold uppercase tracking-wider text-center py-2 flex justify-center items-center">
                    <ShieldCheck className="w-4 h-4 mr-1.5" /> Recommended Plan
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-slate-900 truncate" title={`Activate ${supplierStr}`}>Activate {supplierStr}</h3>
                  <p className="text-sm text-slate-500 mb-6 line-clamp-2">Shift allocation to {supplierStr}</p>
                  
                  <div className="space-y-4 flex-1">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <div className="flex items-center text-slate-600"><Clock className="w-4 h-4 mr-2"/> Recovery Time</div>
                      <div className="font-semibold text-slate-900">{plan.max_delay_days} days</div>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <div className="flex items-center text-slate-600"><TrendingDown className="w-4 h-4 mr-2"/> Total Cost</div>
                      <div className="font-semibold text-red-600">{formatCurrency(plan.total_cost)}</div>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <div className="flex items-center text-slate-600"><AlertCircle className="w-4 h-4 mr-2"/> SLA Exposure</div>
                      <div className="font-semibold text-amber-600">{formatCurrency(plan.total_sla_exposure || 0)}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-slate-600">Blended Risk</div>
                      <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${plan.blended_risk < 0.2 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{plan.blended_risk.toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <button 
                      onClick={() => handleCreatePlan(plan.id)}
                      disabled={creatingId !== null}
                      className={`w-full flex justify-center items-center py-3 rounded-lg font-semibold text-sm transition-colors shadow-sm disabled:opacity-50 ${isRecommended ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'}`}
                    >
                      {isCreating ? (
                        <>Creating Plan... <Clock className="w-4 h-4 ml-2 animate-spin" /></>
                      ) : (
                        <>Audit Risk & Approve <ArrowRight className="w-4 h-4 ml-2" /></>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-xl shadow-sm mt-8">
          <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <PackageCheck className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No Viable Recovery Options</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">No viable recovery options were identified for this disruption context.</p>
        </div>
      )}
    </div>
  );
}
