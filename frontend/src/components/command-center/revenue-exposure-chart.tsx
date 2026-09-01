'use client';
import { useSimulationStore } from '@/stores/useSimulationStore';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'PRD-008', value: 8.6, color: '#ef4444' }, // 37%
  { name: 'PRD-003', value: 4.2, color: '#f59e0b' }, // 23%
  { name: 'PRD-010', value: 3.1, color: '#10b981' }, // 17%
  { name: 'Others', value: 2.4, color: '#94a3b8' },  // 23%
];

export function RevenueExposureChart() {
  const { activeDisruption } = useSimulationStore();
  
  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-4 flex flex-col h-[280px]">
      <h3 className="font-bold text-slate-900 dark:text-white mb-2">Revenue Exposure</h3>
      
      {activeDisruption ? (
        <>
          <div className="mb-2">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">₹18.5 Cr</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">At risk</div>
          </div>
          
          <div className="flex-1 flex items-center mt-2">
            <div className="w-24 h-24 shrink-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    innerRadius={25}
                    outerRadius={45}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`revenue-cell-${entry.name.replace(/\s+/g, '-')}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="ml-4 flex-1 space-y-2">
              {data.map((item, idx) => (
                <div key={idx} className="flex items-center text-[10px]">
                  <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="font-bold text-slate-900 dark:text-slate-200 w-14">{item.name}</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    ₹{item.value} Cr ({Math.round((item.value / 18.3) * 100)}%)
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
