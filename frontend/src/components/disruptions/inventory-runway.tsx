'use client';
import { useSimulationStore } from '@/stores/useSimulationStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export function InventoryRunway() {
  const { activeDisruption } = useSimulationStore();
  if (!activeDisruption?.timeline) return null;

  // Filter timeline for the most critical material (first one)
  const matId = activeDisruption.recovery_context.material_shortages[0]?.material_id;
  const data = activeDisruption.timeline
    .filter((t: any) => t.material_id === matId)
    .map((t: any) => ({
      day: `Day ${t.day}`,
      inventory: t.inventory_eod,
      shortfall: t.shortfall_units,
      status: t.status
    }));

  if (data.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-slate-900">Inventory Runway ({matId})</h3>
        <p className="text-xs text-slate-500">Buffer depletion over time</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorInv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" />
            <Area type="monotone" dataKey="inventory" stroke="#2563eb" fillOpacity={1} fill="url(#colorInv)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
