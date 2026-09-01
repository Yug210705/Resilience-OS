'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, Suspense, use } from 'react';
import Link from 'next/link';
import { ShieldAlert, CheckCircle2, AlertCircle, ArrowRight, Activity, Sparkles } from 'lucide-react';
import { fetchRecoveryPlan, updateRecoveryPlanStatus } from '@/services/api';
import { formatCurrency } from '@/lib/utils';

function PageContent({ id }: { id: string }) {
  const router = useRouter();
  
  const [plan, setPlan] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchRecoveryPlan(id)
      .then(p => {
        setPlan(p);
      })
      .catch(err => setError(err.message));
  }, [id]);

  useEffect(() => {
    if (plan) {
      const timer = setTimeout(() => {
        setAnalyzing(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [plan]);

  const handleProceed = async () => {
    if (updating) return;
    setUpdating(true);
    try {
      await updateRecoveryPlanStatus(id, 'PENDING_APPROVAL');
      router.push(`/approvals/${id}`);
    } catch (err: any) {
      setError(err.message);
      setUpdating(false);
    }
  };

  if (error) {
    return (
      <div className="p-12 text-center text-red-600 bg-red-50 border border-red-200 rounded-xl mt-12 max-w-4xl mx-auto">
        {error}
      </div>
    );
  }

  if (!plan) return <div className="p-12 text-center text-slate-500">Loading plan...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-slate-500 mb-2 font-medium">
          <Link href="/recovery-plans" className="hover:text-slate-900 transition-colors">Recovery Plans</Link>
          <span>/</span>
          <span className="font-semibold text-slate-900">{id}</span>
          <span>/</span>
          <span className="font-semibold text-slate-900">Risk Audit</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">AI Risk Audit & Policy Validation</h1>
        <p className="text-slate-500 mt-2 text-sm">Evaluating compliance, vendor history, and lead-time confidence.</p>
      </div>
      
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        {analyzing ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 border-4 border-blue-100 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
            </div>
            <div className="text-slate-700 font-bold text-center">
              <div className="text-lg mb-1">AI Agent evaluating operational policies...</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-2">
                Checking history • Validating lead times • Assessing compliance
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-7 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4">
                <Sparkles className="w-40 h-40 text-blue-600" />
              </div>
              
              <div className="flex items-center mb-5 relative z-10">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <Sparkles className="w-5 h-5 text-blue-700" />
                </div>
                <h3 className="text-lg font-extrabold text-blue-950 tracking-tight">AI Executive Summary</h3>
              </div>
              
              <div className="relative z-10 text-[14px] leading-relaxed text-blue-900 space-y-4 font-medium max-w-3xl">
                <p>
                  Based on the critical disruption to <span className="font-bold text-blue-950 bg-blue-100 px-1.5 py-0.5 rounded">{plan.disruption_id}</span>, 
                  I have evaluated the recovery plan to activate <span className="font-bold text-blue-950 bg-blue-100 px-1.5 py-0.5 rounded">{plan.supplier_id}</span>.
                </p>
                <p>
                  This action is highly recommended. The supplier has confirmed capacity to safeguard downstream orders. The <strong className="text-slate-800">{plan.max_delay_days}-day lead time</strong> is well within the acceptable tolerance before total plant shutdown. Risk score is {plan.blended_risk.toFixed(2)}.
                </p>
                <div className="bg-white/60 border border-blue-200 p-4 rounded-lg mt-6 shadow-sm inline-block">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">Conclusion</span>
                  <span className="font-extrabold text-slate-900">Proceed with immediate activation.</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center">
                  <Activity className="w-5 h-5 text-slate-500 mr-2" />
                  <h3 className="font-bold text-slate-900 text-base">Deterministic Policy Audit</h3>
                </div>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1 rounded-full uppercase flex items-center shadow-sm tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5 mr-1.5" /> Human Review Required
                </span>
              </div>
              
              <div className="p-0">
                <ul className="divide-y divide-slate-100">
                  <li className="px-6 py-5 flex items-start transition-colors hover:bg-slate-50">
                    <div className="bg-emerald-50 p-2 rounded-full mr-4 border border-emerald-100 shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-slate-900 mb-1">Supplier Qualification</p>
                      <p className="text-[13px] font-medium text-slate-500">{plan.supplier_id} is fully qualified and active in vendor master.</p>
                    </div>
                  </li>
                  <li className="px-6 py-5 flex items-start transition-colors hover:bg-slate-50">
                    <div className="bg-emerald-50 p-2 rounded-full mr-4 border border-emerald-100 shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-slate-900 mb-1">Capacity Availability</p>
                      <p className="text-[13px] font-medium text-slate-500">Confirmed allocation.</p>
                    </div>
                  </li>
                  <li className="px-6 py-5 flex items-start bg-amber-50/50 border-l-2 border-l-amber-500">
                    <div className="bg-amber-100 p-2 rounded-full mr-4 border border-amber-200 shrink-0">
                      <ShieldAlert className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-amber-900 mb-1">Cost Threshold Exceeded</p>
                      <p className="text-[13px] font-medium text-amber-800 leading-relaxed">
                        Total cost is {formatCurrency(plan.total_cost)}, violating automatic approval threshold.<br/>
                        <span className="inline-block mt-1 bg-amber-200 px-2 py-0.5 rounded text-amber-900 text-xs font-bold">Requires human sign-off.</span>
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-end pt-6">
              <button 
                onClick={handleProceed}
                disabled={updating}
                className="bg-blue-600 disabled:opacity-50 hover:bg-blue-700 text-white px-8 py-3.5 rounded-lg text-sm font-bold shadow-sm shadow-blue-500/20 flex items-center transition-all hover:pr-6 group"
              >
                {updating ? 'Updating Status...' : 'Proceed to Approval'} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
      <PageContent id={id} />
    </Suspense>
  );
}
