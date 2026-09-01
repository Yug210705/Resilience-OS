'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, ReferenceArea, ResponsiveContainer, Tooltip } from 'recharts';
import { Package, TrendingDown, Clock, ShieldAlert, Calendar, AlertTriangle, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const inventoryData = [
  { day: 'May 17 (Day 0)', coverage: 6.8 },
  { day: 'May 18 (Day 1)', coverage: 5.5 },
  { day: 'May 19 (Day 2)', coverage: 4.2 },
  { day: 'May 20 (Day 3)', coverage: 3.0 },
  { day: 'May 21 (Day 4)', coverage: 1.8 },
  { day: 'May 22 (Day 5)', coverage: 0.5 },
  { day: 'May 23 (Day 6)', coverage: 0 },
  { day: 'May 24 (Day 7)', coverage: 0 },
  { day: 'May 25 (Day 8)', coverage: 0 },
  { day: 'May 26 (Day 9)', coverage: 0 },
  { day: 'May 27 (Day 10)', coverage: 0 },
];

export function InventoryTab({ disruptionData }: { disruptionData: any }) {
  return (
    <div className="flex gap-6 h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col space-y-6">
        
        {/* Header Controls */}
        <div className="flex justify-between items-center bg-white dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center space-x-4 px-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Select Material</span>
            <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900 dark:text-white outline-none">
              <option>MAT-004 - Battery Cell</option>
              <option>MAT-006 - PCB Assembly</option>
              <option>MAT-009 - Microcontroller</option>
            </select>
          </div>
        </div>

        <div className="flex flex-1 gap-6">
          {/* KPI Sidebar */}
          <div className="w-[280px] bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Inventory Coverage</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg mr-4"><Package className="w-5 h-5" /></div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Current Inventory</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">1,240 units</div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg mr-4"><Activity className="w-5 h-5" /></div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Daily Consumption</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">420 units/day</div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg mr-4"><Clock className="w-5 h-5" /></div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Inventory Coverage</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">3.0 days</div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg mr-4"><ShieldAlert className="w-5 h-5" /></div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Safety Stock</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">600 units</div>
                </div>
              </div>
              <div className="flex items-start bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/50">
                <div className="p-2 bg-white dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg mr-4 shadow-sm"><Calendar className="w-5 h-5" /></div>
                <div>
                  <div className="text-[11px] font-bold text-red-500 uppercase">Shortage Starts</div>
                  <div className="text-sm font-bold text-red-700 dark:text-red-400">May 20, 2025 (Day 3)</div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg mr-4"><TrendingDown className="w-5 h-5" /></div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Disruption Duration</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">10 days</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Chart */}
          <div className="flex-1 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white">Inventory Coverage Over Time (Days)</h3>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button className="px-4 py-1.5 bg-white dark:bg-blue-600 rounded-md text-sm font-bold text-slate-900 dark:text-white shadow-sm">Days</button>
                <button className="px-4 py-1.5 rounded-md text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Quantity</button>
              </div>
            </div>
            
            <div className="flex-1 w-full relative min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={inventoryData} margin={{ top: 20, right: 30, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `${val}d`} domain={[0, 8]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <ReferenceArea x1="May 20 (Day 3)" x2="May 27 (Day 10)" fill="#fee2e2" fillOpacity={0.5} />
                  
                  {/* Annotations */}
                  <ReferenceLine y={2.5} stroke="#f59e0b" strokeDasharray="3 3" />
                  <ReferenceLine x="May 20 (Day 3)" stroke="#ef4444" strokeDasharray="3 3" />
                  
                  <Line type="monotone" dataKey="coverage" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
              
              {/* Custom Legends/Labels for the Chart */}
              <div className="absolute top-4 right-10 flex space-x-6 text-[10px] font-bold">
                <div className="flex items-center"><div className="w-3 h-0.5 bg-blue-600 mr-2"></div> Inventory Coverage (days)</div>
                <div className="flex items-center"><div className="w-3 h-0.5 bg-amber-500 mr-2 border-t border-dashed"></div> Safety Stock Threshold</div>
                <div className="flex items-center"><div className="w-3 h-0.5 bg-red-500 mr-2 border-t border-dashed"></div> Shortage Start</div>
              </div>
              <div className="absolute top-[40%] right-[10%] text-red-500 font-bold text-sm bg-white/80 dark:bg-[#111827]/80 px-2 py-1 rounded">
                Shortage Period
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs font-semibold rounded-lg flex items-start border border-blue-100 dark:border-blue-900/50">
              <Info className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
              Inventory will be exhausted in 3.0 days. Production will be constrained unless mitigation is applied.
            </div>
          </div>
        </div>
        
        {/* Bottom Tables */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Inventory by Plant</h3>
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] font-bold text-slate-400 uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="pb-3">Plant</th>
                  <th className="pb-3 text-right">On Hand (units)</th>
                  <th className="pb-3 text-right">Daily Consumption</th>
                  <th className="pb-3 text-right">Coverage (days)</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  { plant: 'PLANT-002', onHand: 800, cons: 250, cov: 3.2, status: 'At Risk', statusColor: 'bg-amber-100 text-amber-700' },
                  { plant: 'PLANT-003', onHand: 300, cons: 100, cov: 3.0, status: 'At Risk', statusColor: 'bg-amber-100 text-amber-700' },
                  { plant: 'PLANT-005', onHand: 140, cons: 70, cov: 2.0, status: 'Critical', statusColor: 'bg-red-100 text-red-700' },
                ].map((r, i) => (
                  <tr key={i} className="text-slate-900 dark:text-slate-300">
                    <td className="py-3 font-semibold">{r.plant}</td>
                    <td className="py-3 text-right">{r.onHand}</td>
                    <td className="py-3 text-right">{r.cons}</td>
                    <td className="py-3 text-right">{r.cov}</td>
                    <td className="py-3 text-right"><span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", r.statusColor)}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="mt-2 text-blue-600 text-xs font-bold hover:underline">View all plant inventory →</button>
          </div>
          
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Supplier Contribution</h3>
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] font-bold text-slate-400 uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="pb-3">Supplier</th>
                  <th className="pb-3 text-right">Capacity (units/day)</th>
                  <th className="pb-3 text-right">Lead Time</th>
                  <th className="pb-3 text-right">Risk Score</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  { sup: 'SUP-007 (Disrupted)', cap: 0, lead: '12 days', risk: 82, status: 'Disrupted', statusColor: 'bg-red-100 text-red-700' },
                  { sup: 'SUP-011', cap: 500, lead: '4 days', risk: 35, status: 'Available', statusColor: 'bg-emerald-100 text-emerald-700' },
                  { sup: 'SUP-015', cap: 300, lead: '5 days', risk: 42, status: 'Available', statusColor: 'bg-emerald-100 text-emerald-700' },
                ].map((r, i) => (
                  <tr key={i} className="text-slate-900 dark:text-slate-300">
                    <td className="py-3 font-semibold">{r.sup}</td>
                    <td className="py-3 text-right">{r.cap}</td>
                    <td className="py-3 text-right">{r.lead}</td>
                    <td className="py-3 text-right">{r.risk}</td>
                    <td className="py-3 text-right"><span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", r.statusColor)}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="mt-2 text-blue-600 text-xs font-bold hover:underline">View all suppliers →</button>
          </div>
        </div>
      </div>
      
      {/* Right Sidebar */}
      <div className="w-[320px] shrink-0 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm h-full flex flex-col">
        <div className="flex justify-between items-start mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
          <h3 className="font-bold text-slate-900 dark:text-white">Material Details</h3>
          <button className="text-slate-400 hover:text-slate-600">-</button>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">MAT-004</h2>
            <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Critical</span>
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Battery Cell</p>
          <p className="text-xs text-slate-500 mt-1">Electronics Components</p>
        </div>
        
        <div className="space-y-4 mb-6">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Overview</h4>
          <div className="flex justify-between text-sm"><span className="text-slate-500">Unit of Measure</span><span className="font-semibold text-slate-900 dark:text-white">Units</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-500">Unit Cost</span><span className="font-semibold text-slate-900 dark:text-white">₹125.00</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-500">Typical Lead Time</span><span className="font-semibold text-slate-900 dark:text-white">6 days</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-500">Criticality</span><span className="font-semibold text-slate-900 dark:text-white">High</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-500">Single Source</span><span className="font-semibold text-slate-900 dark:text-white">Yes</span></div>
        </div>
        
        <div className="space-y-4 mb-6">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Impacted By</h4>
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30 flex items-start">
            <AlertTriangle className="w-4 h-4 text-red-500 mr-2 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">SUP-007 <span className="text-slate-600 dark:text-slate-400 font-medium">Capacity Disruption</span></div>
              <div className="text-xs text-slate-500 mt-0.5">100% capacity loss for 10 days</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 mb-6 flex-1">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Used In (Products)</h4>
          <div className="space-y-2">
            {[
              { id: 'PRD-008', name: 'Smart Device X', tag: 'High Impact', color: 'text-red-600 bg-red-100' },
              { id: 'PRD-003', name: 'Power Module', tag: 'High Impact', color: 'text-red-600 bg-red-100' },
              { id: 'PRD-010', name: 'Control Unit', tag: 'Medium Impact', color: 'text-amber-700 bg-amber-100' },
            ].map(p => (
              <div key={p.id} className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-900 dark:text-white">{p.id}</span>
                <span className="text-slate-500 truncate w-24">{p.name}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${p.color}`}>{p.tag}</span>
              </div>
            ))}
          </div>
          <button className="text-blue-600 text-xs font-bold hover:underline mt-2">+5 more products</button>
        </div>
        
        <div className="space-y-3 mt-auto">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Actions</h4>
          <button className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2 rounded-lg flex items-center justify-center transition-colors shadow-sm text-sm">
            <Activity className="w-4 h-4 mr-2" /> View Dependency Path
          </button>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center transition-colors shadow-sm text-sm">
            Explore Alternatives
          </button>
        </div>
      </div>
    </div>
  );
}

// Add a quick Info icon for the notification bar
function Info(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  );
}
