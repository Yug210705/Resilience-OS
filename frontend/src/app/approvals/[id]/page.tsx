'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Check, X, FileCode2, ArrowRight, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { fetchRecoveryPlan, updateRecoveryPlanStatus } from '@/services/api';

function PageContent({ id }: { id: string }) {
  const router = useRouter();
  
  const [plan, setPlan] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    fetchRecoveryPlan(id)
      .then(p => {
        setPlan(p);
      })
      .catch(err => setError(err.message));
  }, [id]);

  const handleApprove = async () => {
    if (updating || approved) return;
    setUpdating(true);
    setError(null);
    try {
      await updateRecoveryPlanStatus(id, 'APPROVED');
      setApproved(true);
      setTimeout(() => {
        router.push(`/recovery-plans`);
      }, 1000);
    } catch (err: any) {
      setError(err.message);
      setUpdating(false);
    }
  };

  const handleReject = async () => {
    if (updating || approved) return;
    setUpdating(true);
    setError(null);
    try {
      await updateRecoveryPlanStatus(id, 'REJECTED');
      router.push(`/recovery-plans`);
    } catch (err: any) {
      setError(err.message);
      setUpdating(false);
    }
  };

  if (error) {
    return (
      <div className="p-12 text-center text-red-600 bg-red-50 border border-red-200 rounded-xl mt-12 max-w-4xl mx-auto flex items-center justify-center">
        <AlertCircle className="w-5 h-5 mr-3" />
        {error}
      </div>
    );
  }

  if (!plan) return <div className="p-12 text-center text-slate-500">Loading plan...</div>;

  const sapPayload = {
    action: "CHANGE_SUPPLIER",
    material_id: plan.details?.material_id || "UNKNOWN",
    plan_id: plan.id,
    strategy: plan.strategy,
    new_supplier: plan.supplier_id,
    timestamp: new Date().toISOString()
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 py-8">
      <div className="flex justify-between items-end border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-sm text-slate-500 mb-2 font-medium">
            <Link href="/recovery-plans" className="hover:text-slate-900 transition-colors">Recovery Plans</Link>
            <span>/</span>
            <span className="font-semibold text-slate-900">{id}</span>
            <span>/</span>
            <span className="font-semibold text-slate-900">Action Approval</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pending Human Approval</h1>
          <p className="text-slate-500 mt-1">Review the SAP action payload and authorize execution</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-4">Action Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Operation</span>
                <span className="font-semibold text-slate-900">{plan.strategy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Supplier</span>
                <span className="font-semibold text-slate-900">{plan.supplier_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Plan Cost</span>
                <span className="font-semibold text-slate-900 font-mono">{formatCurrency(plan.total_cost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Max Delay</span>
                <span className="font-semibold text-slate-900">{plan.max_delay_days} days</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-100">
                <span className="text-slate-500">Requested By</span>
                <span className="text-slate-900">AI Recovery Agent</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={handleReject}
              disabled={updating || approved}
              className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-lg shadow-sm flex justify-center items-center disabled:opacity-50"
            >
              <X className="w-5 h-5 mr-2 text-red-500" /> Reject
            </button>
            <button 
              onClick={handleApprove}
              disabled={updating || approved}
              className={`flex-1 font-semibold py-3 rounded-lg shadow-sm flex justify-center items-center transition-all ${approved ? 'bg-emerald-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              {approved ? (
                <><Check className="w-5 h-5 mr-2" /> Approved</>
              ) : updating ? (
                'Approving...'
              ) : (
                <><Check className="w-5 h-5 mr-2" /> Approve Plan</>
              )}
            </button>
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-3 border-b border-slate-800 bg-slate-950 flex items-center">
            <FileCode2 className="w-4 h-4 text-slate-400 mr-2" />
            <span className="text-sm font-medium text-slate-300">SAP BAPI Payload Preview</span>
          </div>
          <div className="p-5 overflow-auto flex-1 text-sm text-green-400 font-mono">
            <pre>{JSON.stringify(sapPayload, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

import { use } from 'react';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
      <PageContent id={id} />
    </Suspense>
  );
}
