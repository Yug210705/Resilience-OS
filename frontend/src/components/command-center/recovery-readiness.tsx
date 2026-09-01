'use client';
import { useSimulationStore } from '@/stores/useSimulationStore';

export function RecoveryReadiness() {
  const { activeDisruption } = useSimulationStore();
  
  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-4 flex flex-col h-[280px]">
      <h3 className="font-bold text-slate-900 dark:text-white mb-2">Recovery Readiness</h3>
      
      {activeDisruption ? (
        <div className="flex flex-col flex-1 justify-between">
          <div>
            <div className="mt-4 flex justify-between items-start">
              <div className="text-xl font-bold text-slate-900 dark:text-white">Plan A</div>
              <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-2 py-1 rounded">
                Recommended
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">91</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Recovery Score</div>
            
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
              <div className="bg-emerald-500 h-full w-[91%]"></div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60">
            <div className="text-sm font-bold text-slate-900 dark:text-white">4 days</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Est. recovery</div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 mb-2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
           <p className="text-[13px] text-slate-500 font-medium">Awaiting simulation data</p>
        </div>
      )}
    </div>
  );
}
