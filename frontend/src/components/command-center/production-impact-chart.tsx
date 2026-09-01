'use client';
import { useSimulationStore } from '@/stores/useSimulationStore';

export function ProductionImpactChart() {
  const { activeDisruption } = useSimulationStore();
  
  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-4 flex flex-col h-[280px]">
      <h3 className="font-bold text-slate-900 dark:text-white mb-2">Production Impact</h3>
      
      {activeDisruption ? (
        <>
          <div className="mb-4">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">42.5%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Production loss</div>
          </div>
          
          <div className="flex-1 flex flex-col justify-end space-y-5 pb-2">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">2,000 <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">units/day</span></span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Normal</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-slate-300 dark:bg-slate-600 h-full w-full"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">1,150 <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">units/day</span></span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Impacted</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
                <div className="bg-blue-600 h-full w-[57.5%]"></div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 mb-2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
           <p className="text-[13px] text-slate-500 font-medium">Awaiting simulation data</p>
        </div>
      )}
    </div>
  );
}
