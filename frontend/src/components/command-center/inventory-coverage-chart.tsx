'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, ResponsiveContainer } from 'recharts';
import { useSimulationStore } from '@/stores/useSimulationStore';

const data = [
  { day: 'May 5', coverage: 7.2 },
  { day: 'May 8', coverage: 6.8 },
  { day: 'May 11', coverage: 5.5 },
  { day: 'May 14', coverage: 4.2 },
  { day: 'May 17', coverage: 3.0 },
  { day: 'May 20', coverage: 1.5 },
];

export function InventoryCoverageChart() {
  const { activeDisruption } = useSimulationStore();
  
  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-4 flex flex-col">
      <h3 className="font-bold text-slate-900 dark:text-white mb-2">Inventory Coverage</h3>
      <div className="mb-4">
        <div className="text-3xl font-extrabold text-slate-900 dark:text-white">3.0 days</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">Avg. remaining coverage</div>
      </div>
      
      <div className="flex-1 h-[120px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={5} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(val) => `${val}d`} />
            <ReferenceLine y={2} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopRight', value: 'Shortage Threshold', fill: '#ef4444', fontSize: 10 }} />
            <Line type="monotone" dataKey="coverage" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
