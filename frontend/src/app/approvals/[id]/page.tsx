'use client';
import { useSimulationStore } from '@/stores/useSimulationStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, use, Suspense } from 'react';
import Link from 'next/link';
import { Check, X, FileCode2, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

function PageContent({ id }: { id: string }) {
  const { activeDisruption } = useSimulationStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan');
  const supplierId = searchParams.get('supplier');
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (!activeDisruption) router.push('/command-center');
  }, [activeDisruption, router]);

  if (!activeDisruption) return null;

  const sapPayload = {
    action: "CHANGE_SUPPLIER",
    material_id: activeDisruption.recovery_context.material_shortages[0]?.material_id,
    old_supplier: activeDisruption.disruption.affected_entity_id,
    new_supplier: supplierId,
    quantity: 2500,
    timestamp: new Date().toISOString()
  };

  const handleApprove = () => {
    setApproved(true);
    setTimeout(() => {
      router.push(`/sap-actions?sim=${id}`);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-end border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-sm text-slate-500 mb-2">
            <Link href="/command-center" className="hover:text-slate-900 transition-colors">Command Center</Link>
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
                <span className="font-semibold text-slate-900">Activate Alternate Supplier</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Entity</span>
                <span className="font-semibold text-slate-900">{supplierId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Revenue Protected</span>
                <span className="font-semibold text-emerald-600">{formatCurrency(activeDisruption.summary.revenue_at_risk * 0.84)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-100">
                <span className="text-slate-500">Requested By</span>
                <span className="text-slate-900">AI Recovery Agent</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button 
              disabled={approved}
              className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-lg shadow-sm flex justify-center items-center disabled:opacity-50"
            >
              <X className="w-5 h-5 mr-2 text-red-500" /> Reject
            </button>
            <button 
              onClick={handleApprove}
              disabled={approved}
              className={`flex-1 font-semibold py-3 rounded-lg shadow-sm flex justify-center items-center transition-all ${approved ? 'bg-emerald-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              {approved ? (
                <><Check className="w-5 h-5 mr-2" /> Approved</>
              ) : (
                <><Check className="w-5 h-5 mr-2" /> Approve & Execute</>
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


export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
      <PageContent id={id} />
    </Suspense>
  );
}
