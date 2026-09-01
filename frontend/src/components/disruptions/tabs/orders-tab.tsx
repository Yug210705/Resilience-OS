'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Package, AlertTriangle, TrendingDown, Clock, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

const customerImpactData = [
  { name: 'Global Retail Corp', value: 8.5, color: '#ef4444' },
  { name: 'TechStore EU', value: 4.2, color: '#f59e0b' },
  { name: 'MegaMart Asia', value: 3.1, color: '#10b981' },
  { name: 'ElectroWorld', value: 2.4, color: '#3b82f6' },
  { name: 'Direct-to-Consumer', value: 1.8, color: '#8b5cf6' },
];

export function OrdersTab({ disruptionData }: { disruptionData: any }) {
  return (
    <div className="flex flex-col gap-6 h-full text-slate-900 dark:text-white pb-6">
      
      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#111827] border border-red-200 dark:border-red-900/50 rounded-xl p-5 shadow-sm relative overflow-hidden flex items-center">
          <div className="absolute inset-0 bg-red-50/50 dark:bg-red-900/10"></div>
          <div className="bg-red-100 dark:bg-red-900/40 p-3 rounded-xl mr-4 shrink-0 relative z-10 border border-red-200 dark:border-red-800/50">
            <Package className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="relative z-10">
            <div className="text-[11px] font-bold text-red-600/70 dark:text-red-400/80 uppercase tracking-wider mb-1">Delayed Orders</div>
            <div className="text-2xl font-black text-red-600 dark:text-red-400 leading-none">142</div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex items-center">
          <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-xl mr-4 shrink-0">
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Avg. Delay</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white leading-none">18 <span className="text-[10px] font-semibold text-slate-500">days</span></div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex items-center">
          <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-xl mr-4 shrink-0">
            <TrendingDown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Revenue at Risk</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white leading-none">₹20.0 <span className="text-[10px] font-semibold text-slate-500">Cr</span></div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex items-center">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl mr-4 shrink-0">
            <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Affected Customers</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white leading-none">48</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row flex-1 gap-6 min-h-0">
        
        {/* Orders Table */}
        <div className="flex-1 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col min-w-0">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-[#0f1522]">
            <h3 className="font-bold text-[15px]">At-Risk Orders (Top Priority)</h3>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search orders..." className="w-48 pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] rounded text-xs font-semibold text-slate-600 dark:text-slate-300">
                <Filter className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-5">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Products</th>
                  <th className="py-3 px-4 text-right">Value (₹)</th>
                  <th className="py-3 px-4 text-center">Delay</th>
                  <th className="py-3 px-4 text-center">SLA Status</th>
                  <th className="py-3 px-4 text-center">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {[
                  { id: 'ORD-7742', cust: 'Global Retail Corp', prod: 'Smart Device X (1,200)', val: '8.5 Cr', delay: '22 days', sla: 'Breached', prio: 'P0' },
                  { id: 'ORD-7749', cust: 'Global Retail Corp', prod: 'Power Module (800)', val: '4.2 Cr', delay: '18 days', sla: 'At Risk', prio: 'P0' },
                  { id: 'ORD-7801', cust: 'TechStore EU', prod: 'Control Unit (500)', val: '3.1 Cr', delay: '15 days', sla: 'At Risk', prio: 'P1' },
                  { id: 'ORD-7815', cust: 'ElectroWorld', prod: 'Smart Device X (450)', val: '2.4 Cr', delay: '12 days', sla: 'Safe', prio: 'P2' },
                  { id: 'ORD-7822', cust: 'MegaMart Asia', prod: 'Sensor Hub (300)', val: '1.8 Cr', delay: '8 days', sla: 'Safe', prio: 'P3' },
                ].map((o, i) => (
                  <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors cursor-pointer">
                    <td className="py-4 px-5">
                      <div className="font-bold text-blue-600 dark:text-blue-400 hover:underline">{o.id}</div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">{o.cust}</td>
                    <td className="py-4 px-4 text-xs font-medium text-slate-600 dark:text-slate-400">{o.prod}</td>
                    <td className="py-4 px-4 text-right font-black text-slate-900 dark:text-white">{o.val}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded text-xs">+{o.delay}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={cn(
                        "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider",
                        o.sla === 'Breached' ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50" :
                        o.sla === 'At Risk' ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50" :
                        "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50"
                      )}>{o.sla}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                       <span className={cn(
                        "px-2 py-1 rounded text-[11px] font-black border",
                        o.prio === 'P0' ? "border-red-500 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20" :
                        o.prio === 'P1' ? "border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20" :
                        "border-slate-300 dark:border-slate-700 text-slate-500 bg-slate-50 dark:bg-slate-800"
                      )}>{o.prio}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart Column */}
        <div className="w-full xl:w-[400px] shrink-0 flex flex-col space-y-6">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex-1 flex flex-col min-h-[400px]">
            <h3 className="font-bold text-[15px] mb-6">Revenue at Risk by Customer</h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerImpactData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" strokeOpacity={0.15} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} tickFormatter={(val) => `₹${val}Cr`} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} width={120} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                    {customerImpactData.map((entry, index) => (
                      <Cell key={`customer-cell-${entry.name.replace(/\s+/g, '-')}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
