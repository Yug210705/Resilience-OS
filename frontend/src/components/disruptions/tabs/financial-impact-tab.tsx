'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IndianRupee, TrendingDown, ArrowUpRight, Activity, Wallet, FileText, Truck, Factory } from 'lucide-react';
import { cn } from '@/lib/utils';

const financialData = [
  { day: 'Day 0', loss: 0, mitigation: 0 },
  { day: 'Day 2', loss: 0, mitigation: 0.5 },
  { day: 'Day 4', loss: 2.1, mitigation: 1.2 },
  { day: 'Day 6', loss: 5.4, mitigation: 2.5 },
  { day: 'Day 8', loss: 12.0, mitigation: 4.8 },
  { day: 'Day 10', loss: 20.0, mitigation: 8.5 },
];

export function FinancialImpactTab({ disruptionData }: { disruptionData: any }) {
  return (
    <div className="flex flex-col gap-6 h-full text-slate-900 dark:text-white pb-6">
      
      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#111827] border border-red-200 dark:border-red-900/50 rounded-xl p-6 shadow-sm relative overflow-hidden flex items-center">
          <div className="absolute inset-0 bg-red-50/50 dark:bg-red-900/10"></div>
          <div className="bg-red-100 dark:bg-red-900/40 p-4 rounded-xl mr-5 shrink-0 relative z-10 border border-red-200 dark:border-red-800/50">
            <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="relative z-10">
            <div className="text-xs font-bold text-red-600/70 dark:text-red-400/80 uppercase tracking-wider mb-1">Total Revenue at Risk</div>
            <div className="text-3xl font-black text-red-600 dark:text-red-400 leading-none">₹20.0 <span className="text-sm font-semibold text-red-500/70">Cr</span></div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex items-center">
          <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-xl mr-5 shrink-0">
            <Wallet className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Est. Mitigation Cost</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white leading-none">₹8.5 <span className="text-sm font-semibold text-slate-500">Cr</span></div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex items-center">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl mr-5 shrink-0">
            <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Net Margin Impact</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white leading-none">-4.2%</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row flex-1 gap-6 min-h-0">
        
        {/* Chart Area */}
        <div className="flex-1 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col p-6 min-w-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg">Financial Projection (Next 10 Days)</h3>
              <p className="text-xs text-slate-500 font-medium">Cumulative revenue loss vs. mitigation spending</p>
            </div>
            <div className="flex space-x-4 text-xs font-bold bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center"><div className="w-3 h-3 rounded bg-red-500 mr-2"></div> Revenue Loss</div>
              <div className="flex items-center"><div className="w-3 h-3 rounded bg-amber-500 mr-2"></div> Mitigation Cost</div>
            </div>
          </div>
          
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <AreaChart data={financialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMitigation" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" strokeOpacity={0.15} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} tickFormatter={(val) => `₹${val}Cr`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorLoss)" />
                <Area type="monotone" dataKey="mitigation" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorMitigation)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown Sidebar */}
        <div className="w-full xl:w-[350px] shrink-0 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm h-full flex flex-col p-6 overflow-y-auto custom-scrollbar">
          <h3 className="font-bold text-[15px] mb-6">Financial Breakdown</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">Revenue Impact by Region</h4>
              <div className="space-y-4">
                {[
                  { region: 'APAC (Asia Pacific)', val: '12.5 Cr', pct: '62.5%' },
                  { region: 'EMEA (Europe, ME, Africa)', val: '5.2 Cr', pct: '26.0%' },
                  { region: 'AMER (Americas)', val: '2.3 Cr', pct: '11.5%' },
                ].map((r, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{r.region}</span>
                    <div className="text-right">
                      <div className="font-bold text-slate-900 dark:text-white">{r.val}</div>
                      <div className="text-[10px] text-slate-500 font-bold">{r.pct}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">Mitigation Costs (Estimated)</h4>
              <div className="space-y-4">
                <div className="flex items-center text-sm p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded mr-3">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 dark:text-white">Premium Freight</div>
                    <div className="text-[10px] text-slate-500 font-semibold">Air freight + expediting fees</div>
                  </div>
                  <div className="font-black text-amber-600 dark:text-amber-400">₹4.2 Cr</div>
                </div>
                
                <div className="flex items-center text-sm p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded mr-3">
                    <Factory className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 dark:text-white">Plant Overtime</div>
                    <div className="text-[10px] text-slate-500 font-semibold">Extra shifts to recover volume</div>
                  </div>
                  <div className="font-black text-indigo-600 dark:text-indigo-400">₹2.8 Cr</div>
                </div>
                
                <div className="flex items-center text-sm p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded mr-3">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 dark:text-white">SLA Penalties</div>
                    <div className="text-[10px] text-slate-500 font-semibold">Late delivery compensation</div>
                  </div>
                  <div className="font-black text-emerald-600 dark:text-emerald-400">₹1.5 Cr</div>
                </div>
              </div>
            </div>
            
          </div>
          
          <button 
            onClick={async () => {
              const { generateFinancialReport } = await import('@/lib/pdf-generator');
              generateFinancialReport('DIS-7901');
            }}
            className="w-full mt-auto bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 font-bold py-3 rounded-lg flex items-center justify-center transition-colors shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-sm"
          >
            Download Financial Report (PDF)
          </button>
        </div>
        
      </div>
    </div>
  );
}
