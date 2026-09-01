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
    <div className="flex gap-6 h-full text-slate-900 dark:text-white">
      {/* Main Content */}
      <div className="flex-1 flex flex-col space-y-6">
        
        {/* Header Controls */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold">Production Overview</h2>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-slate-500">View by:</span>
            <div className="flex bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg">
              <button className="px-4 py-1 bg-white dark:bg-blue-600 rounded-md shadow-sm font-semibold text-blue-600 dark:text-white">Plant</button>
              <button className="px-4 py-1 rounded-md font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Product</button>
              <button className="px-4 py-1 rounded-md font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Category</button>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg mr-4">
              <Factory className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Total Normal Capacity</div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">8,560</div>
              <div className="text-[10px] text-slate-500">units/day</div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center">
            <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-lg mr-4">
              <Activity className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Total Disrupted Capacity</div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">4,910</div>
              <div className="text-[10px] text-slate-500">units/day</div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center">
            <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-lg mr-4">
              <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Total Production Loss</div>
              <div className="text-xl font-extrabold text-red-600 dark:text-red-500">3,650</div>
              <div className="text-[10px] text-slate-500">units/day</div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center">
            <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg mr-4">
              <AlertTriangle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Production Loss %</div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">42.7%</div>
              <div className="text-[10px] text-slate-500">of total capacity</div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center">
            <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-lg mr-4">
              <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Affected Products</div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">8</div>
              <div className="text-[10px] text-slate-500">products</div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 gap-6">
          {/* Production Impact by Plant */}
          <div className="flex-1 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm overflow-hidden flex flex-col">
            <h3 className="font-bold mb-4">Production Impact by Plant</h3>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] font-bold text-slate-400 uppercase border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="pb-3">Plant</th>
                    <th className="pb-3 text-right">Normal Capacity<br/><span className="font-normal">(units/day)</span></th>
                    <th className="pb-3 text-right">Disrupted Capacity<br/><span className="font-normal">(units/day)</span></th>
                    <th className="pb-3 text-right">Loss<br/><span className="font-normal">(units/day)</span></th>
                    <th className="pb-3 text-right">Loss %</th>
                    <th className="pb-3 text-center">Impact Level</th>
                    <th className="pb-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    { id: 'PLANT-002', name: 'Jaipur, India', n: 2000, d: 1150, l: 850, p: 42.5, lvl: 'Critical', stat: 'Severely Affected' },
                    { id: 'PLANT-003', name: 'Pune, India', n: 1800, d: 1020, l: 780, p: 43.3, lvl: 'Critical', stat: 'Severely Affected' },
                    { id: 'PLANT-005', name: 'Chennai, India', n: 1600, d: 900, l: 700, p: 43.8, lvl: 'High', stat: 'At Risk' },
                    { id: 'PLANT-001', name: 'Noida, India', n: 1760, d: 1320, l: 440, p: 25.0, lvl: 'Medium', stat: 'Moderately Affected' },
                    { id: 'PLANT-004', name: 'Bangalore, India', n: 1400, d: 1200, l: 200, p: 14.3, lvl: 'Low', stat: 'Minor Impact' },
                  ].map((r, i) => (
                    <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer">
                      <td className="py-4">
                        <div className="flex items-center">
                          <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded mr-3">
                            <Factory className="w-4 h-4 text-slate-500" />
                          </div>
                          <div>
                            <div className="font-bold">{r.id}</div>
                            <div className="text-xs text-slate-500">{r.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-right">{r.n}</td>
                      <td className="py-4 text-right">{r.d}</td>
                      <td className="py-4 text-right text-red-500 font-medium">{r.l}</td>
                      <td className="py-4 text-right font-medium">{r.p}%</td>
                      <td className="py-4 text-center">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                          r.lvl === 'Critical' ? "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800" :
                          r.lvl === 'High' ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800" :
                          r.lvl === 'Medium' ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800" :
                          "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                        )}>{r.lvl}</span>
                      </td>
                      <td className="py-4 text-center text-xs font-semibold text-slate-600 dark:text-slate-400">{r.stat}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/20 font-bold">
                    <td className="py-4 px-2">Total</td>
                    <td className="py-4 text-right">8,560</td>
                    <td className="py-4 text-right">4,910</td>
                    <td className="py-4 text-right text-red-500">3,650</td>
                    <td className="py-4 text-right">42.7%</td>
                    <td className="py-4 text-center">-</td>
                    <td className="py-4 text-center">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button className="mt-4 text-blue-600 text-xs font-bold hover:underline self-start">View by Product →</button>
          </div>

          <div className="w-[450px] flex flex-col space-y-6">
            {/* Chart */}
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm h-[300px] flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-sm">Production Capacity Trend (All Plants)</h3>
                <div className="bg-slate-100 dark:bg-slate-800 text-[10px] px-2 py-1 rounded font-semibold text-slate-500">Next 10 Days v</div>
              </div>
              <div className="flex justify-center space-x-4 text-[10px] font-bold mb-4">
                <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div> Normal Capacity</div>
                <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div> Disrupted Capacity</div>
                <div className="flex items-center"><div className="w-4 h-0.5 bg-slate-400 mr-2 border-t border-dashed"></div> Capacity Loss</div>
              </div>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={prodData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={5} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(val) => `${val/1000}K`} />
                    <ReferenceLine x="Day 4\nMay 21" stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Shortage starts', position: 'insideTopRight', fill: '#ef4444', fontSize: 10 }} />
                    <Line type="monotone" dataKey="normal" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} />
                    <Line type="monotone" dataKey="disrupted" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: '#ef4444' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Loss by product */}
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-sm">Production Loss by Product</h3>
                <button className="text-blue-600 text-xs font-bold hover:underline">View all products →</button>
              </div>
              <div className="space-y-5 flex-1">
                {[
                  { id: 'PRD-008', name: 'Smart Device X', loss: 1250, pct: 55.6, w: '90%' },
                  { id: 'PRD-003', name: 'Power Module', loss: 550, pct: 47.5, w: '60%' },
                  { id: 'PRD-010', name: 'Control Unit', loss: 720, pct: 45.0, w: '70%' },
                  { id: 'PRD-006', name: 'Sensor Hub', loss: 420, pct: 40.0, w: '50%' },
                  { id: 'PRD-001', name: 'Base Device', loss: 310, pct: 32.6, w: '40%' },
                ].map((p, i) => (
                  <div key={i} className="flex items-center text-xs">
                    <div className="w-16 font-bold">{p.id}</div>
                    <div className="w-24 text-slate-500 truncate mr-4">{p.name}</div>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mr-4">
                      <div className="bg-red-500 h-full rounded-full" style={{ width: p.w }}></div>
                    </div>
                    <div className="w-24 text-right font-semibold">
                      {p.loss} <span className="text-slate-500 font-normal">units</span> ({p.pct}%)
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-2 mt-4 px-12">
                <span>0</span>
                <span>500</span>
                <span>1K</span>
                <span>1.5K</span>
              </div>
              <div className="text-center text-[10px] text-slate-400 mt-1">Production Loss (units/day)</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Sidebar */}
      <div className="w-[320px] shrink-0 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm h-full flex flex-col">
        <div className="flex justify-between items-start mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
          <h3 className="font-bold text-slate-900 dark:text-white">Plant Details</h3>
          <button className="text-slate-400 hover:text-slate-600">x</button>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-extrabold">PLANT-002</h2>
            <span className="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Critical</span>
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Jaipur Manufacturing</p>
        </div>
        
        <div className="space-y-4 mb-8">
          <h4 className="text-xs font-bold border-b border-slate-200 dark:border-slate-800 pb-2">Capacity</h4>
          <div className="flex justify-between text-sm"><span className="text-slate-500">Normal Capacity</span><span className="font-semibold">2,000 units/day</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-500">Disrupted Capacity</span><span className="font-semibold">1,150 units/day</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-500">Production Loss</span><span className="font-semibold text-red-500">850 units/day</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-500">Loss Percentage</span><span className="font-bold text-red-500">42.5%</span></div>
        </div>
        
        <div className="space-y-4 mb-8">
          <h4 className="text-xs font-bold border-b border-slate-200 dark:border-slate-800 pb-2">Constrained Materials</h4>
          <table className="w-full text-xs text-left">
            <thead className="text-[10px] text-slate-400">
              <tr>
                <th className="pb-2 font-normal">Material</th>
                <th className="pb-2 font-normal text-right">Coverage</th>
                <th className="pb-2 font-normal text-right">Shortage Start</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              <tr>
                <td className="py-1 font-semibold flex items-center"><div className="w-1.5 h-4 bg-red-500 mr-2"></div> MAT-004 Battery Cell</td>
                <td className="py-1 text-right text-red-500">3.0 days</td>
                <td className="py-1 text-right">Day 3</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold flex items-center"><div className="w-1.5 h-4 bg-amber-500 mr-2"></div> MAT-006 PCB Assembly</td>
                <td className="py-1 text-right text-amber-500">5.2 days</td>
                <td className="py-1 text-right">Day 5</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold flex items-center"><div className="w-1.5 h-4 bg-yellow-500 mr-2"></div> MAT-009 Microcontroller</td>
                <td className="py-1 text-right text-yellow-600 dark:text-yellow-500">7.8 days</td>
                <td className="py-1 text-right">Day 7</td>
              </tr>
            </tbody>
          </table>
          <button className="text-blue-600 text-xs font-bold hover:underline w-full text-center mt-2">View Material Details →</button>
        </div>
        
        <div className="space-y-4 mb-6 flex-1">
          <h4 className="text-xs font-bold border-b border-slate-200 dark:border-slate-800 pb-2">Affected Products</h4>
          <div className="space-y-3">
            {[
              { id: 'PRD-008', name: 'Smart Device X', pct: '55.6%' },
              { id: 'PRD-003', name: 'Power Module', pct: '47.5%' },
              { id: 'PRD-010', name: 'Control Unit', pct: '45.0%' },
            ].map(p => (
              <div key={p.id} className="flex justify-between items-center text-sm">
                <span className="font-semibold">{p.id}</span>
                <span className="text-slate-500 truncate w-24">{p.name}</span>
                <span className={`text-xs font-bold text-red-500`}>{p.pct}</span>
              </div>
            ))}
          </div>
          <button className="text-blue-600 text-xs font-bold hover:underline mt-2">View all products →</button>
        </div>
        
        <div className="space-y-3 mt-auto">
          <button className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2 rounded-lg flex items-center justify-center transition-colors shadow-sm text-sm">
            <Activity className="w-4 h-4 mr-2" /> View Dependency Path
          </button>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center transition-colors shadow-sm text-sm">
            <TrendingDown className="w-4 h-4 mr-2" /> View Recovery Options
          </button>
        </div>
      </div>
    </div>
  );
}
