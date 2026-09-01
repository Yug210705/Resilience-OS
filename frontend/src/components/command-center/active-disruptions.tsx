'use client';
import { useSimulationStore } from '@/stores/useSimulationStore';
import Link from 'next/link';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ActiveDisruptions() {
  const { activeDisruption } = useSimulationStore();

  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-[#111827]">
        <h3 className="font-bold text-slate-900 dark:text-white">Active Disruptions</h3>
        <button className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline">View all</button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-transparent custom-scrollbar">
        {activeDisruption && (
          <Link 
            href={`/disruptions/${activeDisruption.simulation_id}`}
            className="block bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-lg p-3 hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
            <div className="flex justify-between items-start ml-2">
              <div className="flex items-start flex-1 min-w-0 pr-2">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-3 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-[13px] leading-snug truncate" title={`${activeDisruption.disruption.affected_entity_id} ${activeDisruption.disruption.disruption_type}`}>
                    {activeDisruption.disruption.affected_entity_id} <span className="font-medium text-slate-600 dark:text-slate-400">{activeDisruption.disruption.disruption_type}</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                    {activeDisruption.disruption.severity * 100}% capacity loss • {activeDisruption.disruption.duration_days} days
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0 pl-1">
                <span className="text-[10px] font-bold bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 px-2 py-0.5 rounded shadow-sm border border-red-200 dark:border-red-800 uppercase">
                  Critical
                </span>
                <span className="text-[10px] font-medium text-slate-400 mt-2 whitespace-nowrap">14 min ago</span>
              </div>
            </div>
          </Link>
        )}

        <button 
          onClick={() => alert("This is a historical disruption record. To see the full interactive analysis view, please run a live simulation from the top right button.")}
          className="block w-full text-left bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-lg p-3 relative overflow-hidden opacity-90 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
          <div className="flex justify-between items-start ml-2">
            <div className="flex items-start flex-1 min-w-0 pr-2">
              <AlertTriangle className="w-5 h-5 text-amber-500 mr-3 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-[13px] leading-snug truncate" title="Port of Shanghai Closure">
                  Port of Shanghai <span className="font-medium text-slate-600 dark:text-slate-400">Closure</span>
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                  Port Closure • 7 days
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0 pl-1">
              <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded shadow-sm border border-amber-200 dark:border-amber-800 uppercase">
                High
              </span>
              <span className="text-[10px] font-medium text-slate-400 mt-2 whitespace-nowrap">2 hr ago</span>
            </div>
          </div>
        </button>

        <button 
          onClick={() => alert("This is a historical disruption record. To see the full interactive analysis view, please run a live simulation from the top right button.")}
          className="block w-full text-left bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-lg p-3 relative overflow-hidden opacity-80 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500"></div>
          <div className="flex justify-between items-start ml-2">
            <div className="flex items-start flex-1 min-w-0 pr-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-[13px] leading-snug truncate" title="MAT-004 Quality Issue">
                  MAT-004 <span className="font-medium text-slate-600 dark:text-slate-400">Quality Issue</span>
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                  Quality Deviation • 5 days
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0 pl-1">
              <span className="text-[10px] font-bold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded shadow-sm border border-yellow-200 dark:border-yellow-800 uppercase">
                Medium
              </span>
              <span className="text-[10px] font-medium text-slate-400 mt-2 whitespace-nowrap">5 hr ago</span>
            </div>
          </div>
        </button>

        {!activeDisruption && (
           <div className="text-center py-6">
             <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
             <p className="text-sm text-slate-500 font-medium">Run a simulation to see active critical disruptions.</p>
           </div>
        )}
      </div>
    </div>
  );
}
