// Force recompile to clear Turbopack cache 4
'use client';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, ReferenceArea, ResponsiveContainer, Tooltip } from 'recharts';
import { Factory, TrendingDown, Package, Activity, AlertTriangle, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

const prodData = [
  { day: 'Day 0\nMay 17', normal: 8560, disrupted: 4910, loss: 3650 },
  { day: 'Day 2\nMay 19', normal: 8560, disrupted: 4910, loss: 3650 },
  { day: 'Day 4\nMay 21', normal: 8560, disrupted: 4910, loss: 3650 },
  { day: 'Day 6\nMay 23', normal: 8560, disrupted: 4000, loss: 4560 },
  { day: 'Day 8\nMay 25', normal: 8560, disrupted: 3500, loss: 5060 },
  { day: 'Day 10\nMay 27', normal: 8560, disrupted: 3500, loss: 5060 },
];

const plantData = [
  { id: 'PLANT-002', name: 'Jaipur, India', n: 2000, d: 1150, l: 850, p: 42.5, lvl: 'Critical' },
  { id: 'PLANT-003', name: 'Pune, India', n: 1800, d: 1020, l: 780, p: 43.3, lvl: 'Critical' },
  { id: 'PLANT-005', name: 'Chennai, India', n: 1600, d: 900, l: 700, p: 43.8, lvl: 'High' },
  { id: 'PLANT-001', name: 'Noida, India', n: 1760, d: 1320, l: 440, p: 25.0, lvl: 'Medium' },
  { id: 'PLANT-008', name: 'Hyderabad, India', n: 1200, d: 850, l: 350, p: 29.2, lvl: 'Medium' },
  { id: 'PLANT-004', name: 'Bangalore, India', n: 1400, d: 1200, l: 200, p: 14.3, lvl: 'Low' },
  { id: 'PLANT-009', name: 'Ahmedabad, India', n: 950, d: 750, l: 200, p: 21.1, lvl: 'Low' },
  { id: 'PLANT-007', name: 'Mumbai, India', n: 2200, d: 2070, l: 130, p: 5.9, lvl: 'Low' },
];

const productData = [
  { id: 'PRD-008', name: 'Smart Device X', n: 2500, d: 1250, l: 1250, p: 50.0, lvl: 'Critical' },
  { id: 'PRD-010', name: 'Control Unit', n: 1800, d: 1080, l: 720, p: 40.0, lvl: 'High' },
  { id: 'PRD-003', name: 'Power Module', n: 1500, d: 950, l: 550, p: 36.7, lvl: 'High' },
  { id: 'PRD-006', name: 'Sensor Hub', n: 1200, d: 780, l: 420, p: 35.0, lvl: 'Medium' },
  { id: 'PRD-001', name: 'Base Device', n: 1560, d: 1250, l: 310, p: 19.9, lvl: 'Medium' },
  { id: 'PRD-015', name: 'Logic Board', n: 1000, d: 800, l: 200, p: 20.0, lvl: 'Low' },
  { id: 'PRD-021', name: 'Display Unit', n: 1200, d: 1100, l: 100, p: 8.3, lvl: 'Low' },
  { id: 'PRD-004', name: 'Wireless Chip', n: 2000, d: 1900, l: 100, p: 5.0, lvl: 'Low' },
];

const categoryData = [
  { id: 'CAT-01', name: 'Electronics', n: 3000, d: 1400, l: 1600, p: 53.3, lvl: 'Critical' },
  { id: 'CAT-02', name: 'Modules', n: 2000, d: 1050, l: 950, p: 47.5, lvl: 'Critical' },
  { id: 'CAT-03', name: 'Sensors', n: 1500, d: 900, l: 600, p: 40.0, lvl: 'High' },
  { id: 'CAT-04', name: 'Peripherals', n: 2060, d: 1560, l: 500, p: 24.3, lvl: 'Medium' },
];

export function ProductionTab({ disruptionData }: { disruptionData: any }) {
  const [viewBy, setViewBy] = useState('Plant');
  
  const activeBtn = "px-5 py-1.5 bg-white dark:bg-[#1e293b] rounded shadow-sm font-bold text-blue-600 dark:text-blue-400 transition-all";
  const inactiveBtn = "px-5 py-1.5 rounded font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all";

  const tableData = viewBy === 'Plant' ? plantData : (viewBy === 'Product' ? productData : categoryData);
  const focusItem = tableData[0];
  const Icon = viewBy === 'Plant' ? Factory : (viewBy === 'Product' ? Package : Layers);
  const focusSubtitle = viewBy === 'Plant' ? 'Manufacturing, IN' : (viewBy === 'Product' ? 'Product Line' : 'Category Group');

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
              <button onClick={() => setViewBy('Plant')} className={viewBy === 'Plant' ? activeBtn : inactiveBtn}>Plant</button>
              <button onClick={() => setViewBy('Product')} className={viewBy === 'Product' ? activeBtn : inactiveBtn}>Product</button>
              <button onClick={() => setViewBy('Category')} className={viewBy === 'Category' ? activeBtn : inactiveBtn}>Category</button>
            </div>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="flex w-full gap-1.5 sm:gap-2 xl:gap-4">
          <div className="flex-1 min-w-0 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 sm:p-2 xl:p-4 shadow-sm hover:shadow-md transition-shadow flex items-center">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-1.5 xl:p-2.5 rounded-lg xl:rounded-xl mr-1.5 xl:mr-3 shrink-0 hidden md:block">
              <Factory className="w-3.5 h-3.5 xl:w-5 xl:h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0 w-full text-center md:text-left">
              <div className="text-[7.5px] sm:text-[8px] lg:text-[9px] xl:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 leading-[1.1]">Normal Cap.</div>
              <div className="text-xs sm:text-sm lg:text-base xl:text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight whitespace-nowrap">8,560 <span className="text-[6.5px] sm:text-[7px] lg:text-[8px] xl:text-[9px] font-semibold text-slate-500">u/d</span></div>
            </div>
          </div>
          
          <div className="flex-1 min-w-0 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 sm:p-2 xl:p-4 shadow-sm hover:shadow-md transition-shadow flex items-center">
            <div className="bg-amber-50 dark:bg-amber-900/30 p-1.5 xl:p-2.5 rounded-lg xl:rounded-xl mr-1.5 xl:mr-3 shrink-0 hidden md:block">
              <Activity className="w-3.5 h-3.5 xl:w-5 xl:h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="min-w-0 w-full text-center md:text-left">
              <div className="text-[7.5px] sm:text-[8px] lg:text-[9px] xl:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 leading-[1.1]">Disrupted</div>
              <div className="text-xs sm:text-sm lg:text-base xl:text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight whitespace-nowrap">4,910 <span className="text-[6.5px] sm:text-[7px] lg:text-[8px] xl:text-[9px] font-semibold text-slate-500">u/d</span></div>
            </div>
          </div>
          
          <div className="flex-1 min-w-0 bg-white dark:bg-[#111827] border border-red-200 dark:border-red-900/50 rounded-xl p-1.5 sm:p-2 xl:p-4 shadow-sm hover:shadow-md transition-shadow flex items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-red-50/50 dark:bg-red-900/10"></div>
            <div className="bg-red-100 dark:bg-red-900/40 p-1.5 xl:p-2.5 rounded-lg xl:rounded-xl mr-1.5 xl:mr-3 shrink-0 relative z-10 border border-red-200 dark:border-red-800/50 hidden md:block">
              <TrendingDown className="w-3.5 h-3.5 xl:w-5 xl:h-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="relative z-10 min-w-0 w-full text-center md:text-left">
              <div className="text-[7.5px] sm:text-[8px] lg:text-[9px] xl:text-[10px] font-bold text-red-600/70 dark:text-red-400/80 uppercase tracking-wider mb-0.5 leading-[1.1]">Prod. Loss</div>
              <div className="text-xs sm:text-sm lg:text-base xl:text-xl font-black text-red-600 dark:text-red-400 leading-none tracking-tight whitespace-nowrap">3,650 <span className="text-[6.5px] sm:text-[7px] lg:text-[8px] xl:text-[9px] font-semibold text-red-500/70">u/d</span></div>
            </div>
          </div>
          
          <div className="flex-1 min-w-0 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 sm:p-2 xl:p-4 shadow-sm hover:shadow-md transition-shadow flex items-center">
            <div className="bg-purple-50 dark:bg-purple-900/30 p-1.5 xl:p-2.5 rounded-lg xl:rounded-xl mr-1.5 xl:mr-3 shrink-0 hidden md:block">
              <AlertTriangle className="w-3.5 h-3.5 xl:w-5 xl:h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="min-w-0 w-full text-center md:text-left">
              <div className="text-[7.5px] sm:text-[8px] lg:text-[9px] xl:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 leading-[1.1]">Loss %</div>
              <div className="text-xs sm:text-sm lg:text-base xl:text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight whitespace-nowrap">42.7%</div>
            </div>
          </div>
          
          <div className="flex-1 min-w-0 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 sm:p-2 xl:p-4 shadow-sm hover:shadow-md transition-shadow flex items-center">
            <div className="bg-emerald-50 dark:bg-emerald-900/30 p-1.5 xl:p-2.5 rounded-lg xl:rounded-xl mr-1.5 xl:mr-3 shrink-0 hidden md:block">
              <Package className="w-3.5 h-3.5 xl:w-5 xl:h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0 w-full text-center md:text-left">
              <div className="text-[7.5px] sm:text-[8px] lg:text-[9px] xl:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 leading-[1.1]">Affected</div>
              <div className="text-xs sm:text-sm lg:text-base xl:text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight whitespace-nowrap">8</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row flex-1 gap-6 min-h-0">
          {/* Production Impact by Plant/Product/Category */}
          <div className="flex-1 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col min-w-0">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-[15px]">Production Impact by {viewBy}</h3>
              <button className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline">Export Data</button>
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-2">{viewBy}</th>
                    <th className="py-3 px-2 text-right">Disrupted<br/><span className="text-[9px] text-slate-400 lowercase">(u/d)</span></th>
                    <th className="py-3 px-2 text-right">Loss<br/><span className="text-[9px] text-slate-400 lowercase">(u/d)</span></th>
                    <th className="py-3 px-2 text-right">Loss %</th>
                    <th className="py-3 px-2 text-center">Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {tableData.map((r, i) => (
                    <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors cursor-pointer">
                      <td className="py-2.5 px-2">
                        <div className="flex items-center">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-2.5 border border-slate-200 dark:border-slate-700/50 shrink-0">
                            <Icon className="w-3.5 h-3.5 text-slate-500" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100 text-[13px]">{r.id}</div>
                            <div className="text-[10px] font-medium text-slate-500 truncate max-w-[100px]">{r.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-right font-medium text-slate-700 dark:text-slate-300">{r.d.toLocaleString()}</td>
                      <td className="py-2.5 px-2 text-right font-bold text-red-600 dark:text-red-400 bg-red-50/30 dark:bg-red-900/10">{r.l.toLocaleString()}</td>
                      <td className="py-2.5 px-2 text-right font-bold text-slate-900 dark:text-white">{r.p}%</td>
                      <td className="py-2.5 px-2 text-center">
                        <span className={cn(
                          "px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider",
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
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
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
            <h3 className="font-bold text-[13px] text-slate-500 uppercase tracking-wider">Focus {viewBy}</h3>
          </div>
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{focusItem.id}</h2>
            <span className={cn(
              "text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider border",
              focusItem.lvl === 'Critical' ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50" :
              focusItem.lvl === 'High' ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50" :
              focusItem.lvl === 'Medium' ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50" :
              "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50"
            )}>{focusItem.lvl}</span>
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center"><Icon className="w-3.5 h-3.5 mr-1.5" /> {focusItem.name} {focusSubtitle}</p>
        </div>
        
        <div className="p-5 flex-1 overflow-y-auto custom-scrollbar space-y-8">
          
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Capacity Status</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Normal</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{focusItem.n.toLocaleString()} <span className="text-[10px] text-slate-500 font-medium">u/d</span></span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Disrupted</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{focusItem.d.toLocaleString()} <span className="text-[10px] text-slate-500 font-medium">u/d</span></span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
                 <div className="bg-blue-600 h-full" style={{ width: `${(focusItem.d / focusItem.n) * 100}%` }}></div>
              </div>
              
              <div className="flex justify-between items-end pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-red-600 dark:text-red-400">Total Loss</span>
                <div className="text-right">
                  <div className="font-black text-red-600 dark:text-red-400 text-lg leading-none">{focusItem.l.toLocaleString()} <span className="text-[10px] font-semibold">u/d</span></div>
                  <div className="text-[11px] font-bold text-red-500/70 mt-1">{focusItem.p}% of capacity</div>
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
