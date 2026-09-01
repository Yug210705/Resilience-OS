'use client';
import { useSimulationStore } from '@/stores/useSimulationStore';
import { formatCurrency } from '@/lib/utils';
import { AlertTriangle, Factory, PackageOpen, ShoppingCart, IndianRupee } from 'lucide-react';

export function KPIStrip() {
  const { activeDisruption } = useSimulationStore();
  const summary = activeDisruption?.summary;

  const kpis = [
    { label: 'Active Disruptions', value: activeDisruption ? '01' : '00', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Affected Suppliers', value: summary?.affected_suppliers?.toString().padStart(2, '0') || '00', icon: PackageOpen, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Affected Plants', value: summary?.affected_plants?.toString().padStart(2, '0') || '00', icon: Factory, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Orders Risk', value: summary?.affected_orders?.toString() || '0', icon: ShoppingCart, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Revenue Risk', value: summary?.revenue_at_risk ? formatCurrency(summary.revenue_at_risk) : '₹0', icon: IndianRupee, color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {kpis.map((kpi, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">{kpi.label}</span>
            <div className={`p-1.5 rounded-md ${kpi.bg}`}>
              <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
            </div>
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">{kpi.value}</span>
        </div>
      ))}
    </div>
  );
}
