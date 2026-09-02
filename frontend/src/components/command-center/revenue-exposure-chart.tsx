'use client';
import { useMemo } from 'react';
import { useSimulationStore } from '@/stores/useSimulationStore';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export function RevenueExposureChart() {
  const { activeDisruption } = useSimulationStore();
  
  const chartData = useMemo(() => {
    if (!activeDisruption || !activeDisruption.revenue_impact) return [];
    
    const productMap = new Map();
    activeDisruption.revenue_impact.forEach((o: any) => {
      const pid = o.product_id || 'Unknown';
      if (!productMap.has(pid)) productMap.set(pid, 0);
      productMap.set(pid, productMap.get(pid) + (o.revenue_at_risk || 0));
    });

    const colors = ['#ef4444', '#f59e0b', '#10b981', '#94a3b8', '#8b5cf6'];
    
    const sorted = Array.from(productMap.entries())
      .map(([name, val]) => ({
        name,
        value: Number((val / 100000).toFixed(1)),
      }))
      .sort((a, b) => b.value - a.value);

    let finalData = sorted;
    if (sorted.length > 4) {
      const top3 = sorted.slice(0, 3);
      const others = sorted.slice(3).reduce((acc, curr) => acc + curr.value, 0);
      top3.push({ name: 'Others', value: Number(others.toFixed(1)) });
      finalData = top3;
    }
    
    return finalData.map((item, i) => ({ ...item, color: colors[i % colors.length] }));
  }, [activeDisruption]);

  const totalCr = activeDisruption?.summary?.revenue_at_risk 
    ? (activeDisruption.summary.revenue_at_risk / 100000).toFixed(1)
    : '0.0';

  const numericTotal = parseFloat(totalCr) || 1;

  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-4 flex flex-col h-[280px]">
      <h3 className="font-bold text-slate-900 dark:text-white mb-2">Revenue Exposure</h3>
      
      {activeDisruption && chartData.length > 0 ? (
        <>
          <div className="mb-2">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">₹{totalCr} Cr</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">At risk</div>
          </div>
          
          <div className="flex-1 flex items-center mt-2">
            <div className="w-24 h-24 shrink-0 relative">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={25}
                    outerRadius={45}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`revenue-cell-${index}-${entry.name.replace(/\s+/g, '-')}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="ml-4 flex-1 space-y-2">
              {chartData.map((item, idx) => (
                <div key={idx} className="flex items-center text-[10px]">
                  <div className="w-2 h-2 rounded-full mr-2 shrink-0" style={{ backgroundColor: item.color }}></div>
                  <span className="font-bold text-slate-900 dark:text-slate-200 w-14 truncate" title={item.name}>{item.name}</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    ₹{item.value.toFixed(1)} Cr ({Math.round((item.value / numericTotal) * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 mb-2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
           <p className="text-[13px] text-slate-500 font-medium">Awaiting simulation data</p>
        </div>
      )}
    </div>
  );
}
