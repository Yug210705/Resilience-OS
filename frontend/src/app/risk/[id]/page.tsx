'use client';
import { useSimulationStore } from '@/stores/useSimulationStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, use, Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, ShieldAlert, Sparkles, ArrowRight, ChevronRight, Activity, FileText } from 'lucide-react';

function PageContent({ id }: { id: string }) {
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
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#0A0F1C] overflow-y-auto overflow-x-hidden custom-scrollbar">
      <div className="max-w-[1000px] mx-auto w-full px-6 py-8">
        
        {/* Header Area */}
        <div className="mb-8">
          <div className="flex items-center text-[12px] font-bold text-slate-500 dark:text-slate-400 mb-3 tracking-wide uppercase">
            <Link href="/command-center" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Command Center</Link>
            <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-400 dark:text-slate-600" />
            <Link href={`/recovery/${id}`} className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Recovery Options</Link>
            <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-400 dark:text-slate-600" />
            <span className="text-slate-900 dark:text-white">AI Risk Audit</span>
          </div>
          
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-[28px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-none mb-3">
                AI Audit & Justification
              </h1>
              <div className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-400">
                <FileText className="w-4 h-4 mr-2 text-slate-400" />
                Policy evaluation for <span className="font-bold text-slate-900 dark:text-slate-200 mx-1">{planId}</span>: Activate <span className="font-bold text-slate-900 dark:text-slate-200 ml-1">{supplierId}</span>
              </div>
            </div>
          </div>
        </div>
        
        {isAuditing ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
              <div className="relative flex items-center justify-center w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50 rounded-full shadow-sm">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
            </div>
            <div className="text-slate-700 dark:text-slate-300 font-bold text-center">
              <div className="text-lg mb-1">AI Agent evaluating operational policies...</div>
              <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">
                Checking history <span className="mx-1">•</span> Validating lead times <span className="mx-1">•</span> Assessing compliance
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            
            {/* AI Reasoning */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl p-7 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 dark:opacity-20 transform translate-x-4 -translate-y-4">
                <Sparkles className="w-40 h-40 text-blue-600 dark:text-blue-400" />
              </div>
              
              <div className="flex items-center mb-5 relative z-10">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg mr-3">
                  <Sparkles className="w-5 h-5 text-blue-700 dark:text-blue-300" />
                </div>
                <h3 className="text-lg font-extrabold text-blue-950 dark:text-blue-100 tracking-tight">AI Executive Summary</h3>
              </div>
              
              <div className="relative z-10 text-[14px] leading-relaxed text-blue-900 dark:text-blue-200/80 space-y-4 font-medium max-w-3xl">
                <p>
                  Based on the critical disruption to <span className="font-bold text-blue-950 dark:text-white bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded">{activeDisruption.disruption.affected_entity_id}</span>, 
                  I have evaluated the recovery plan to activate <span className="font-bold text-blue-950 dark:text-white bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded">{supplierId}</span>.
                </p>
                <p>
                  This action is highly recommended. The supplier has confirmed capacity to cover <strong className="text-blue-700 dark:text-blue-300 font-extrabold text-[15px]">84%</strong> of the unfulfilled downstream orders, 
                  specifically safeguarding the high-priority enterprise tier. The <strong className="text-slate-800 dark:text-slate-200">4-day lead time</strong> is well within the acceptable 
                  tolerance before total plant shutdown.
                </p>
                <div className="bg-white/60 dark:bg-black/20 border border-blue-200 dark:border-blue-800/60 p-4 rounded-lg mt-6 shadow-sm inline-block">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">Conclusion</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">Proceed with immediate activation.</span>
                </div>
              </div>
            </div>
            
            {/* Policy Audit */}
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="px-6 py-5 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center">
                  <Activity className="w-5 h-5 text-slate-500 mr-2" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Deterministic Policy Audit</h3>
                </div>
                <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 px-3 py-1 rounded-full uppercase flex items-center shadow-sm tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5 mr-1.5" /> Human Review Required
                </span>
              </div>
              
              <div className="p-0">
                <ul className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  <li className="px-6 py-5 flex items-start transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/30">
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-full mr-4 border border-emerald-100 dark:border-emerald-900/30 shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-slate-900 dark:text-white mb-1">Supplier Qualification</p>
                      <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">{supplierId} is fully qualified and active in vendor master.</p>
                    </div>
                  </li>
                  <li className="px-6 py-5 flex items-start transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/30">
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-full mr-4 border border-emerald-100 dark:border-emerald-900/30 shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-slate-900 dark:text-white mb-1">Capacity Availability</p>
                      <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">Confirmed allocation of <strong className="text-slate-700 dark:text-slate-300">500 units/day</strong>.</p>
                    </div>
                  </li>
                  <li className="px-6 py-5 flex items-start bg-amber-50/50 dark:bg-amber-900/10 border-l-2 border-l-amber-500">
                    <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded-full mr-4 border border-amber-200 dark:border-amber-800/50 shrink-0">
                      <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-amber-900 dark:text-amber-100 mb-1">Cost Threshold Exceeded</p>
                      <p className="text-[13px] font-medium text-amber-800 dark:text-amber-300/80 leading-relaxed">
                        Unit cost increases by <strong className="text-amber-900 dark:text-amber-200">8.2%</strong>, violating automatic approval threshold (&lt;5%). <br/>
                        <span className="inline-block mt-1 bg-amber-200 dark:bg-amber-900/60 px-2 py-0.5 rounded text-amber-900 dark:text-amber-100 text-xs font-bold">Requires human sign-off.</span>
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-end pt-6">
              <Link 
                href={`/approvals/${id}?plan=${planId}&supplier=${supplierId}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-lg text-sm font-bold shadow-sm shadow-blue-500/20 flex items-center transition-all hover:pr-6 group"
              >
                Proceed to Approval <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
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
