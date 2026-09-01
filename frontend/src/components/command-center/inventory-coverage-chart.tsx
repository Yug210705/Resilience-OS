'use client';
import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, ResponsiveContainer } from 'recharts';
import { useSimulationStore } from '@/stores/useSimulationStore';

export function InventoryCoverageChart() {
  const { activeDisruption } = useSimulationStore();
  
  const chartData = useMemo(() => {
    if (!activeDisruption || !activeDisruption.timeline) return [];
    
    const dayMap = new Map();
    const demandMap = new Map();
    
    if (activeDisruption.recovery_context?.material_shortages) {
      activeDisruption.recovery_context.material_shortages.forEach((m: any) => {
        demandMap.set(m.material_id, m.normal_demand_per_day || 1);
      });
    }

    activeDisruption.timeline.forEach((t: any) => {
      const dayStr = `Day ${t.day}`;
      if (!dayMap.has(dayStr)) {
        dayMap.set(dayStr, { totalCoverage: 0, count: 0 });
      }
      
      const demand = demandMap.get(t.material_id) || 100;
      const coverage = t.inventory_eod / demand;
      
      const current = dayMap.get(dayStr);
      current.totalCoverage += coverage;
      current.count += 1;
    });

    return Array.from(dayMap.entries()).map(([day, val]) => ({
      day,
      coverage: Number((val.totalCoverage / val.count).toFixed(1))
    })).sort((a, b) => {
       const dayA = parseInt(a.day.replace('Day ', ''));
       const dayB = parseInt(b.day.replace('Day ', ''));
       return dayA - dayB;
    });
  }, [activeDisruption]);

  const avgCoverage = chartData.length > 0 ? chartData[0].coverage.toFixed(1) : '0.0';

  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-4 flex flex-col h-[280px]">
      <h3 className="font-bold text-slate-900 dark:text-white mb-2">Inventory Coverage</h3>
      
      {activeDisruption && chartData.length > 0 ? (
        <>
          <div className="mb-4">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{avgCoverage} days</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Initial remaining coverage</div>
          </div>
          
          <div className="flex-1 min-h-[120px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={5} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(val) => `${val}d`} />
                <ReferenceLine y={2} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopRight', value: 'Shortage Threshold', fill: '#ef4444', fontSize: 10 }} />
                <Line type="monotone" dataKey="coverage" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 mb-2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
           <p className="text-[13px] text-slate-500 font-medium">Awaiting simulation data</p>
        </div>
      )}
    </div>
  );
}
