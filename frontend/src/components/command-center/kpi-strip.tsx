'use client';
import { useSimulationStore } from '@/stores/useSimulationStore';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Users, Factory, ClipboardList, IndianRupee, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function KPIStrip() {
  const { activeDisruption } = useSimulationStore();
  const router = useRouter();
  const summary = activeDisruption?.summary;

  // Formatting helpers
  const formatCr = (val: number) => `₹${(val / 100000).toFixed(1)} Cr`;

  // Fallbacks based on activeDisruption state, avoiding hardcoded mocks when no data exists
  const isDisrupted = !!activeDisruption;

  const kpis = [
    { 
      label: 'Active Disruptions', 
      value: isDisrupted ? '1' : '0', 
      subtext: isDisrupted ? '↑ 1 since yesterday' : 'All clear', 
      icon: AlertTriangle, iconColor: 'text-red-500', iconBg: 'bg-red-50 dark:bg-red-950/50',
      badge: isDisrupted ? 'Critical' : null, badgeColor: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400',
      onClick: () => {
        if (activeDisruption?.simulation_id) {
          router.push(`/disruptions/${activeDisruption.simulation_id}`);
        }
      }
    },
    { 
      label: 'Affected Suppliers', 
      value: isDisrupted ? summary?.affected_suppliers?.toString() || '0' : '0', 
      subtext: isDisrupted ? 'Across supply base' : '-', 
      icon: Users, iconColor: 'text-purple-600 dark:text-purple-400', iconBg: 'bg-purple-50 dark:bg-purple-900/30',
      badge: isDisrupted ? 'High' : null, badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400'
    },
    { 
      label: 'Affected Plants', 
      value: isDisrupted ? summary?.affected_plants?.toString() || '0' : '0', 
      subtext: isDisrupted ? 'Impacted by shortages' : '-', 
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
      subtext: isDisrupted ? 'Based on bill of materials' : '-', 
      icon: IndianRupee, iconColor: 'text-amber-500 dark:text-amber-400', iconBg: 'bg-amber-50 dark:bg-amber-900/30',
      badge: isDisrupted ? 'Critical' : null, badgeColor: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400'
    },
    { 
      label: 'Production Impact', 
      value: isDisrupted && summary?.overall_impact_score ? `${summary.overall_impact_score}%` : '0%',
      subtext: isDisrupted ? 'Severity Score' : '-', 
      icon: BarChart3, iconColor: 'text-blue-600 dark:text-blue-400', iconBg: 'bg-blue-50 dark:bg-blue-900/30',
      badge: isDisrupted ? 'High' : null, badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400'
    },
  ];

  return (
    <div className="flex overflow-x-auto pb-4 gap-4 custom-scrollbar">
      {kpis.map((kpi, i) => (
        <div 
          key={i} 
          onClick={kpi.onClick}
          className={cn(
            "flex-1 min-w-[220px] shrink-0 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm transition-all flex flex-col justify-between group relative overflow-hidden",
            kpi.onClick ? "cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-blue-400 dark:hover:border-blue-600" : "hover:shadow-md"
          )}
        >
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
