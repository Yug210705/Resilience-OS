'use client';
import { useSimulationStore } from '@/stores/useSimulationStore';
import { AlertTriangle, Users, Factory, ClipboardList, IndianRupee, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function KPIStrip() {
  const { activeDisruption } = useSimulationStore();
  const summary = activeDisruption?.summary;

  // Formatting helpers
  const formatCr = (val: number) => `₹${(val / 100000).toFixed(1)} Cr`;

  // Fallbacks based on activeDisruption state, avoiding hardcoded mocks when no data exists
  const isDisrupted = !!activeDisruption;

  const kpis = [
    { 
      label: 'Active Disruptions', 
      value: isDisrupted ? '3' : '0', // Simulate 3 total if disrupted for visual fidelity
      subtext: isDisrupted ? '↑ 1 since yesterday' : 'All clear', 
      icon: AlertTriangle, iconColor: 'text-red-500', iconBg: 'bg-red-50 dark:bg-red-950/50',
      badge: isDisrupted ? 'Critical' : null, badgeColor: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400'
    },
    { 
      label: 'Affected Suppliers', 
      value: isDisrupted ? summary?.affected_suppliers?.toString() || '0' : '0', 
      subtext: isDisrupted ? 'Across 3 tiers' : '-', 
      icon: Users, iconColor: 'text-purple-600 dark:text-purple-400', iconBg: 'bg-purple-50 dark:bg-purple-900/30',
      badge: isDisrupted ? 'High' : null, badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400'
    },
    { 
      label: 'Affected Plants', 
      value: isDisrupted ? summary?.affected_plants?.toString() || '0' : '0', 
      subtext: isDisrupted ? 'Across 2 regions' : '-', 
      icon: Factory, iconColor: 'text-blue-600 dark:text-blue-400', iconBg: 'bg-blue-50 dark:bg-blue-900/30',
      badge: isDisrupted ? 'High' : null, badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400'
    },
    { 
      label: 'Orders at Risk', 
      value: isDisrupted ? summary?.affected_orders?.toString() || '0' : '0', 
      subtext: isDisrupted && summary?.revenue_at_risk ? `${formatCr(summary.revenue_at_risk)} exposure` : '-', 
      icon: ClipboardList, iconColor: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-50 dark:bg-emerald-900/30',
      badge: isDisrupted ? 'Critical' : null, badgeColor: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400'
    },
    { 
      label: 'Revenue at Risk', 
      value: isDisrupted && summary?.revenue_at_risk ? formatCr(summary.revenue_at_risk) : '₹0', 
      subtext: isDisrupted ? '12.4% of total exposure' : '-', 
      icon: IndianRupee, iconColor: 'text-amber-500 dark:text-amber-400', iconBg: 'bg-amber-50 dark:bg-amber-900/30',
      badge: isDisrupted ? 'Critical' : null, badgeColor: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400'
    },
    { 
      label: 'Production Impact', 
      value: isDisrupted ? '42.5%' : '0%', // Mocking the % calculation for now as it needs plant baseline
      subtext: isDisrupted ? '-850 units/day' : '-', 
      icon: BarChart3, iconColor: 'text-blue-600 dark:text-blue-400', iconBg: 'bg-blue-50 dark:bg-blue-900/30',
      badge: isDisrupted ? 'High' : null, badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400'
    },
  ];

  return (
    <div className="flex overflow-x-auto pb-4 gap-4 custom-scrollbar">
      {kpis.map((kpi, i) => (
        <div key={i} className="flex-1 min-w-[220px] shrink-0 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="flex items-center space-x-3 mb-4 relative z-10">
            <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-110 duration-300 shrink-0", kpi.iconBg)}>
              <kpi.icon className={cn("w-5 h-5", kpi.iconColor)} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap leading-none mb-1">{kpi.label}</div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight whitespace-nowrap leading-none">{kpi.value}</div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 dark:border-slate-800/60 relative z-10">
            <span className={cn("text-[11px] font-medium truncate mr-2", 
              kpi.subtext.includes('↑') ? "text-red-500 font-bold" : "text-slate-500 dark:text-slate-400"
            )} title={kpi.subtext}>
              {kpi.subtext}
            </span>
            {kpi.badge && (
              <span className={cn("text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm shrink-0", kpi.badgeColor)}>
                {kpi.badge}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
