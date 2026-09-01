'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, ReferenceArea, ResponsiveContainer, Tooltip } from 'recharts';
import { Factory, TrendingDown, Package, Activity, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const prodData = [
  { day: 'Day 0\nMay 17', normal: 8560, disrupted: 4910, loss: 3650 },
  { day: 'Day 2\nMay 19', normal: 8560, disrupted: 4910, loss: 3650 },
  { day: 'Day 4\nMay 21', normal: 8560, disrupted: 4910, loss: 3650 },
  { day: 'Day 6\nMay 23', normal: 8560, disrupted: 4000, loss: 4560 },
  { day: 'Day 8\nMay 25', normal: 8560, disrupted: 3500, loss: 5060 },
  { day: 'Day 10\nMay 27', normal: 8560, disrupted: 3500, loss: 5060 },
];

export function ProductionTab({ disruptionData }: { disruptionData: any }) {
  return (
    <div className="flex flex-col xl:flex-row gap-6 h-full text-slate-900 dark:text-white pb-6">
      {/* Main Content */}
      <div className="flex-1 flex flex-col space-y-6 min-w-0">
        
        {/* Header Controls */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-extrabold tracking-tight">Production Overview</h2>
          <div className="flex items-center space-x-3 text-sm">
            <span className="text-slate-500 font-medium">View by:</span>
            <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200 dark:border-slate-700/50">
              <button className="px-5 py-1.5 bg-white dark:bg-[#1e293b] rounded shadow-sm font-bold text-blue-600 dark:text-blue-400 transition-all">Plant</button>
              <button className="px-5 py-1.5 rounded font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all">Product</button>
              <button className="px-5 py-1.5 rounded font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all">Category</button>
            </div>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="flex overflow-x-auto pb-2 gap-4 custom-scrollbar">
          <div className="flex-1 min-w-[200px] bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl mr-4 shrink-0">
              <Factory className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Normal Capacity</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white leading-none">8,560 <span className="text-[10px] font-semibold text-slate-500">u/d</span></div>
            </div>
          </div>
          
          <div className="flex-1 min-w-[200px] bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center">
            <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-xl mr-4 shrink-0">
              <Activity className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Disrupted Capacity</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white leading-none">4,910 <span className="text-[10px] font-semibold text-slate-500">u/d</span></div>
            </div>
          </div>
          
          <div className="flex-1 min-w-[200px] bg-white dark:bg-[#111827] border border-red-200 dark:border-red-900/50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-red-50/50 dark:bg-red-900/10"></div>
            <div className="bg-red-100 dark:bg-red-900/40 p-3 rounded-xl mr-4 shrink-0 relative z-10 border border-red-200 dark:border-red-800/50">
              <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="relative z-10">
              <div className="text-[11px] font-bold text-red-600/70 dark:text-red-400/80 uppercase tracking-wider mb-1">Production Loss</div>
              <div className="text-2xl font-black text-red-600 dark:text-red-400 leading-none">3,650 <span className="text-[10px] font-semibold text-red-500/70">u/d</span></div>
            </div>
          </div>
          
          <div className="flex-1 min-w-[180px] bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center">
            <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-xl mr-4 shrink-0">
              <AlertTriangle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Loss %</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white leading-none">42.7%</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row flex-1 gap-6 min-h-0">
          {/* Production Impact by Plant */}
          <div className="flex-1 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col min-w-0">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-[15px]">Production Impact by Plant</h3>
              <button className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline">Export Data</button>
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-5">Plant</th>
                    <th className="py-3 px-4 text-right">Normal<br/><span className="text-[9px] text-slate-400 lowercase">(u/d)</span></th>
                    <th className="py-3 px-4 text-right">Disrupted<br/><span className="text-[9px] text-slate-400 lowercase">(u/d)</span></th>
                    <th className="py-3 px-4 text-right">Loss<br/><span className="text-[9px] text-slate-400 lowercase">(u/d)</span></th>
                    <th className="py-3 px-4 text-right">Loss %</th>
                    <th className="py-3 px-4 text-center">Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {[
                    { id: 'PLANT-002', name: 'Jaipur, India', n: 2000, d: 1150, l: 850, p: 42.5, lvl: 'Critical' },
                    { id: 'PLANT-003', name: 'Pune, India', n: 1800, d: 1020, l: 780, p: 43.3, lvl: 'Critical' },
                    { id: 'PLANT-005', name: 'Chennai, India', n: 1600, d: 900, l: 700, p: 43.8, lvl: 'High' },
                    { id: 'PLANT-001', name: 'Noida, India', n: 1760, d: 1320, l: 440, p: 25.0, lvl: 'Medium' },
                    { id: 'PLANT-004', name: 'Bangalore, India', n: 1400, d: 1200, l: 200, p: 14.3, lvl: 'Low' },
                  ].map((r, i) => (
                    <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors cursor-pointer">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-3 border border-slate-200 dark:border-slate-700/50 shrink-0">
                            <Factory className="w-4 h-4 text-slate-500" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100">{r.id}</div>
                            <div className="text-[11px] font-medium text-slate-500 truncate max-w-[120px]">{r.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-slate-700 dark:text-slate-300">{r.n.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right font-medium text-slate-700 dark:text-slate-300">{r.d.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-red-600 dark:text-red-400 bg-red-50/30 dark:bg-red-900/10">{r.l.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white">{r.p}%</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={cn(
                          "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider",
                          r.lvl === 'Critical' ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50" :
                          r.lvl === 'High' ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50" :
                          r.lvl === 'Medium' ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50" :
                          "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50"
                        )}>{r.lvl}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800 text-center">
              <button className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline inline-flex items-center">
                Explore Detailed Plant View <TrendingDown className="w-3 h-3 ml-1" />
              </button>
            </div>
          </div>

          {/* Charts Column */}
          <div className="w-full xl:w-[400px] shrink-0 flex flex-col space-y-6">
            {/* Trend Chart */}
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm h-[320px] flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-[15px] leading-tight">Capacity Trend</h3>
                <div className="bg-slate-100 dark:bg-slate-800 text-[10px] px-2 py-1 rounded font-bold text-slate-500 uppercase tracking-wider">Next 10 Days</div>
              </div>
              <div className="flex space-x-4 text-[10px] font-bold mb-6 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center"><div className="w-2.5 h-2.5 rounded-sm bg-blue-500 mr-1.5"></div> Normal</div>
                <div className="flex items-center"><div className="w-2.5 h-2.5 rounded-sm bg-red-500 mr-1.5"></div> Disrupted</div>
              </div>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={prodData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" strokeOpacity={0.15} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} tickFormatter={(val) => `${val/1000}k`} />
                    <ReferenceLine x="Day 4\nMay 21" stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Shortage hits', position: 'insideTopLeft', fill: '#ef4444', fontSize: 10, fontWeight: 700 }} />
                    <Line type="monotone" dataKey="normal" stroke="#3b82f6" strokeWidth={3} dot={{ r: 0 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="disrupted" stroke="#ef4444" strokeWidth={3} dot={{ r: 0 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Loss by product */}
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex-1 flex flex-col min-h-0">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-[15px]">Loss by Product</h3>
                <button className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline">View All</button>
              </div>
              <div className="space-y-5 flex-1 overflow-y-auto custom-scrollbar pr-2">
                {[
                  { id: 'PRD-008', name: 'Smart Device X', loss: 1250, pct: 55.6, w: '100%' },
                  { id: 'PRD-003', name: 'Power Module', loss: 550, pct: 47.5, w: '60%' },
                  { id: 'PRD-010', name: 'Control Unit', loss: 720, pct: 45.0, w: '75%' },
                  { id: 'PRD-006', name: 'Sensor Hub', loss: 420, pct: 40.0, w: '45%' },
                  { id: 'PRD-001', name: 'Base Device', loss: 310, pct: 32.6, w: '35%' },
                ].map((p, i) => (
                  <div key={i} className="flex flex-col space-y-1.5">
                    <div className="flex justify-between items-end text-xs">
                      <div className="font-bold">{p.id} <span className="text-slate-500 font-medium ml-1">{p.name}</span></div>
                      <div className="font-bold text-red-600 dark:text-red-400">{p.loss.toLocaleString()} <span className="text-[9px] text-slate-500 font-medium ml-0.5">u/d</span></div>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-red-500 h-full rounded-full" style={{ width: p.w }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Sidebar */}
      <div className="w-full xl:w-[320px] shrink-0 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0f1522]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[13px] text-slate-500 uppercase tracking-wider">Focus Plant</h3>
          </div>
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">PLANT-002</h2>
            <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50 text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider">Critical</span>
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center"><Factory className="w-3.5 h-3.5 mr-1.5" /> Jaipur Manufacturing, IN</p>
        </div>
        
        <div className="p-5 flex-1 overflow-y-auto custom-scrollbar space-y-8">
          
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Capacity Status</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Normal</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">2,000 <span className="text-[10px] text-slate-500 font-medium">u/d</span></span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Disrupted</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">1,150 <span className="text-[10px] text-slate-500 font-medium">u/d</span></span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
                 <div className="bg-blue-600 w-[57.5%] h-full"></div>
              </div>
              
              <div className="flex justify-between items-end pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-red-600 dark:text-red-400">Total Loss</span>
                <div className="text-right">
                  <div className="font-black text-red-600 dark:text-red-400 text-lg leading-none">850 <span className="text-[10px] font-semibold">u/d</span></div>
                  <div className="text-[11px] font-bold text-red-500/70 mt-1">42.5% of capacity</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Constrained Materials</h4>
              <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">3 Items</span>
            </div>
            <div className="space-y-3">
              {[
                { id: 'MAT-004', name: 'Battery Cell', c: '3.0d', s: 'Day 3', color: 'bg-red-500' },
                { id: 'MAT-006', name: 'PCB Assembly', c: '5.2d', s: 'Day 5', color: 'bg-amber-500' },
                { id: 'MAT-009', name: 'Microcontroller', c: '7.8d', s: 'Day 7', color: 'bg-yellow-500' },
              ].map((m, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 flex flex-col space-y-2">
                  <div className="flex items-center text-xs font-bold">
                    <div className={`w-2 h-2 rounded-full ${m.color} mr-2`}></div>
                    <span className="text-slate-900 dark:text-white">{m.id}</span>
                    <span className="text-slate-500 ml-1.5 font-medium truncate">{m.name}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-semibold pl-4">
                    <span className="text-slate-500">Exhausts in: <span className="text-slate-900 dark:text-white">{m.c}</span></span>
                    <span className="text-slate-500">Shortage: <span className="text-red-500">{m.s}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0f1522] space-y-3">
          <button className="w-full bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold py-2.5 rounded-lg flex items-center justify-center transition-colors shadow-sm text-xs hover:bg-slate-50 dark:hover:bg-slate-800">
            <Activity className="w-3.5 h-3.5 mr-2 text-slate-400" /> View Dependency Path
          </button>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg flex items-center justify-center transition-colors shadow-sm text-xs">
            <TrendingDown className="w-3.5 h-3.5 mr-2 opacity-80" /> View Recovery Options
          </button>
        </div>
      </div>
    </div>
  );
}
