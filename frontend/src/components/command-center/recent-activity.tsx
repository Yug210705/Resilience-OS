'use client';
import { useSimulationStore } from '@/stores/useSimulationStore';
import { AlertTriangle, CheckCircle, Info, User, PackageOpen, Play } from 'lucide-react';

export function RecentActivity() {
  const { activeDisruption } = useSimulationStore();
  
  const activities = [
    { title: 'Simulation completed for SUP-007 disruption', time: '2 min ago', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
    { title: 'Recovery plan generated', subtitle: 'Plan A recommended', time: '8 min ago', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Risk assessment updated', subtitle: 'Risk score: 82 (High)', time: '15 min ago', icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Approval requested', subtitle: 'Change supplier for MAT-004', time: '25 min ago', icon: User, color: 'text-amber-500', bg: 'bg-amber-50' },
    { title: 'SAP action queued', subtitle: 'PO update for MAT-004', time: '32 min ago', icon: PackageOpen, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm h-full flex flex-col">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <h3 className="font-bold text-slate-900 dark:text-white">Recent Activity</h3>
        <button className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline">View all</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
        {activeDisruption ? (
          activities.map((a, i) => (
            <div key={i} className="flex relative">
              {i !== activities.length - 1 && <div className="absolute top-8 left-3.5 w-px h-full bg-slate-100 dark:bg-slate-800"></div>}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${a.bg} dark:bg-slate-800 shadow-sm border border-white dark:border-slate-700`}>
                <a.icon className={`w-3.5 h-3.5 ${a.color}`} />
              </div>
              <div className="ml-3 flex-1 min-w-0 pt-0.5">
                <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 truncate" title={a.title}>{a.title}</p>
                {a.subtitle && <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate" title={a.subtitle}>{a.subtitle}</p>}
              </div>
              <div className="text-[10px] font-medium text-slate-400 shrink-0 ml-2 pt-1">{a.time}</div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-8 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3 border border-slate-100 dark:border-slate-700">
              <Info className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-500">No recent activity.</p>
            <p className="text-[11px] text-slate-400 mt-1">Run a simulation to generate logs.</p>
          </div>
        )}
      </div>
    </div>
  );
}
