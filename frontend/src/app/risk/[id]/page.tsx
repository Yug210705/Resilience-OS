'use client';
import { useSimulationStore } from '@/stores/useSimulationStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

function PageContent({ params }: { params: { id: string } }) {
  const { activeDisruption } = useSimulationStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan');
  const supplierId = searchParams.get('supplier');
  const [isAuditing, setIsAuditing] = useState(true);

  useEffect(() => {
    if (!activeDisruption) router.push('/command-center');
    const t = setTimeout(() => setIsAuditing(false), 2000);
    return () => clearTimeout(t);
  }, [activeDisruption, router]);

  if (!activeDisruption) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-end border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-sm text-slate-500 mb-2">
            <Link href="/command-center" className="hover:text-slate-900 transition-colors">Command Center</Link>
            <span>/</span>
            <Link href={`/recovery/${params.id}`} className="hover:text-slate-900 transition-colors">Recovery Options</Link>
            <span>/</span>
            <span className="font-semibold text-slate-900">AI Risk Audit</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Audit & Justification</h1>
          <p className="text-slate-500 mt-1">Policy evaluation for {planId}: Activate {supplierId}</p>
        </div>
      </div>
      
      {isAuditing ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-4">
          <div className="animate-pulse flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-2">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="text-slate-600 font-medium text-center">
            AI Agent evaluating operational policies...<br/>
            <span className="text-xs text-slate-400 font-normal">Checking supplier history → Validating lead times → Assessing ESG compliance</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* AI Reasoning */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-24 h-24 text-blue-600" />
            </div>
            <div className="flex items-center mb-4 relative z-10">
              <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-bold text-blue-900 text-lg">AI Executive Summary</h3>
            </div>
            <div className="prose prose-blue prose-sm relative z-10 text-blue-800">
              <p>
                Based on the critical disruption to <strong>{activeDisruption.disruption.affected_entity_id}</strong>, 
                I have evaluated the recovery plan to activate <strong>{supplierId}</strong>.
              </p>
              <p>
                This action is recommended because {supplierId} has sufficient capacity to cover <strong>84%</strong> of the unfulfilled downstream orders, 
                specifically protecting the high-priority enterprise tier. The 4-day lead time is within the acceptable 
                tolerance before total plant shutdown.
              </p>
              <p className="font-semibold">Recommendation: Proceed with activation.</p>
            </div>
          </div>
          
          {/* Policy Audit */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">Deterministic Policy Audit</h3>
              <span className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full uppercase flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" /> Human Review Required
              </span>
            </div>
            <div className="p-0">
              <ul className="divide-y divide-slate-100">
                <li className="px-6 py-4 flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Supplier Qualification</p>
                    <p className="text-sm text-slate-500">{supplierId} is fully qualified and active in vendor master.</p>
                  </div>
                </li>
                <li className="px-6 py-4 flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Capacity Availability</p>
                    <p className="text-sm text-slate-500">Confirmed allocation of 500 units/day.</p>
                  </div>
                </li>
                <li className="px-6 py-4 flex items-start bg-amber-50">
                  <ShieldAlert className="w-5 h-5 text-amber-500 mr-3 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900">Cost Threshold Exceeded</p>
                    <p className="text-sm text-amber-700">Unit cost increases by 8.2%, violating automatic approval threshold (&lt;5%). <strong>Requires human sign-off.</strong></p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Link 
              href={`/approvals/${params.id}?plan=${planId}&supplier=${supplierId}`}
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-md font-semibold shadow-sm flex items-center transition-colors"
            >
              Proceed to Approval <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}


export default function Page(props: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
      <PageContent params={props.params} />
    </Suspense>
  );
}
