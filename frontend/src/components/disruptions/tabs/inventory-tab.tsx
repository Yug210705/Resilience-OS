import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, ReferenceArea, ResponsiveContainer, Tooltip } from 'recharts';
import { Package, TrendingDown, Clock, ShieldAlert, Calendar, AlertTriangle, Activity, ChevronDown, Check, Layers, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const materialsData: Record<string, any> = {
  'MAT-004': {
    id: 'MAT-004',
    name: 'Battery Cell',
    category: 'Electronics Components',
    criticality: 'Critical',
    criticalityColor: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50',
    currentInventory: '1,240',
    dailyConsumption: 420,
    inventoryCoverage: 3.0,
    safetyStock: 600,
    shortageStart: 'May 20, 2025 (Day 3)',
    disruptionDuration: '10 days',
    exhaustionMsg: 'Inventory will be exhausted in 3.0 days. Production will be constrained unless mitigation is applied.',
    chartData: [
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
    ],
    plants: [
      { plant: 'PLANT-002', onHand: 800, cons: 250, cov: 3.2, status: 'At Risk', statusColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
      { plant: 'PLANT-003', onHand: 300, cons: 100, cov: 3.0, status: 'At Risk', statusColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
      { plant: 'PLANT-005', onHand: 140, cons: 70, cov: 2.0, status: 'Critical', statusColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    ],
    suppliers: [
      { sup: 'SUP-007 (Disrupted)', cap: 0, lead: '12 days', risk: 82, status: 'Disrupted', statusColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
      { sup: 'SUP-011', cap: 500, lead: '4 days', risk: 35, status: 'Available', statusColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
      { sup: 'SUP-015', cap: 300, lead: '5 days', risk: 42, status: 'Available', statusColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    ],
    details: {
      uom: 'Units',
      cost: '₹125.00',
      leadTime: '6 days',
      singleSource: 'Yes'
    },
    products: [
      { id: 'PRD-008', name: 'Smart Device X', tag: 'High Impact', color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400' },
      { id: 'PRD-003', name: 'Power Module', tag: 'High Impact', color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400' },
      { id: 'PRD-010', name: 'Control Unit', tag: 'Medium Impact', color: 'text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400' },
    ]
  },
  'MAT-006': {
    id: 'MAT-006',
    name: 'PCB Assembly',
    category: 'Electronics Components',
    criticality: 'Medium',
    criticalityColor: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50',
    currentInventory: '8,500',
    dailyConsumption: 1200,
    inventoryCoverage: 7.1,
    safetyStock: 3000,
    shortageStart: 'May 24, 2025 (Day 7)',
    disruptionDuration: '10 days',
    exhaustionMsg: 'Inventory will be exhausted in 7.1 days. Monitor supplier recovery closely.',
    chartData: [
      { day: 'May 17 (Day 0)', coverage: 8.5 },
      { day: 'May 18 (Day 1)', coverage: 7.5 },
      { day: 'May 19 (Day 2)', coverage: 6.5 },
      { day: 'May 20 (Day 3)', coverage: 5.5 },
      { day: 'May 21 (Day 4)', coverage: 4.5 },
      { day: 'May 22 (Day 5)', coverage: 3.5 },
      { day: 'May 23 (Day 6)', coverage: 2.5 },
      { day: 'May 24 (Day 7)', coverage: 1.5 },
      { day: 'May 25 (Day 8)', coverage: 0.5 },
      { day: 'May 26 (Day 9)', coverage: 0 },
      { day: 'May 27 (Day 10)', coverage: 0 },
    ],
    plants: [
      { plant: 'PLANT-001', onHand: 4500, cons: 600, cov: 7.5, status: 'Stable', statusColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
      { plant: 'PLANT-002', onHand: 4000, cons: 600, cov: 6.7, status: 'Monitor', statusColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    ],
    suppliers: [
      { sup: 'SUP-007 (Disrupted)', cap: 0, lead: '14 days', risk: 82, status: 'Disrupted', statusColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
      { sup: 'SUP-022', cap: 1500, lead: '7 days', risk: 25, status: 'Available', statusColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    ],
    details: {
      uom: 'Units',
      cost: '₹450.00',
      leadTime: '14 days',
      singleSource: 'No'
    },
    products: [
      { id: 'PRD-008', name: 'Smart Device X', tag: 'High Impact', color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400' },
      { id: 'PRD-012', name: 'Sensor Array', tag: 'Medium Impact', color: 'text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400' },
    ]
  },
  'MAT-009': {
    id: 'MAT-009',
    name: 'Microcontroller',
    category: 'Semiconductors',
    criticality: 'High',
    criticalityColor: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50',
    currentInventory: '450',
    dailyConsumption: 250,
    inventoryCoverage: 1.8,
    safetyStock: 1000,
    shortageStart: 'May 18, 2025 (Day 1)',
    disruptionDuration: '10 days',
    exhaustionMsg: 'CRITICAL: Inventory will be exhausted in 1.8 days. Immediate production halt imminent.',
    chartData: [
      { day: 'May 17 (Day 0)', coverage: 2.8 },
      { day: 'May 18 (Day 1)', coverage: 1.8 },
      { day: 'May 19 (Day 2)', coverage: 0.8 },
      { day: 'May 20 (Day 3)', coverage: 0 },
      { day: 'May 21 (Day 4)', coverage: 0 },
      { day: 'May 22 (Day 5)', coverage: 0 },
      { day: 'May 23 (Day 6)', coverage: 0 },
      { day: 'May 24 (Day 7)', coverage: 0 },
      { day: 'May 25 (Day 8)', coverage: 0 },
      { day: 'May 26 (Day 9)', coverage: 0 },
      { day: 'May 27 (Day 10)', coverage: 0 },
    ],
    plants: [
      { plant: 'PLANT-002', onHand: 300, cons: 200, cov: 1.5, status: 'Critical', statusColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
      { plant: 'PLANT-005', onHand: 150, cons: 50, cov: 3.0, status: 'At Risk', statusColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    ],
    suppliers: [
      { sup: 'SUP-007 (Disrupted)', cap: 0, lead: '30 days', risk: 82, status: 'Disrupted', statusColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
      { sup: 'SUP-045', cap: 100, lead: '45 days', risk: 60, status: 'Constrained', statusColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    ],
    details: {
      uom: 'Units',
      cost: '₹1,250.00',
      leadTime: '30 days',
      singleSource: 'Yes'
    },
    products: [
      { id: 'PRD-008', name: 'Smart Device X', tag: 'High Impact', color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400' },
      { id: 'PRD-015', name: 'Premium Display', tag: 'High Impact', color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400' },
      { id: 'PRD-022', name: 'Core Processor', tag: 'High Impact', color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400' },
    ]
  }
};

export function InventoryTab({ disruptionData, setActiveTab }: { disruptionData: any, setActiveTab?: (tab: string) => void }) {
  const [selectedMat, setSelectedMat] = useState('MAT-004');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const activeData = materialsData[selectedMat];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col space-y-6 min-w-0">
        
        {/* Header Controls */}
        <div className="flex justify-between items-center bg-white dark:bg-[#111827] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative z-20">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
              <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Target Material</span>
            
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-between w-[260px] bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-indigo-900/40 hover:border-indigo-300 dark:hover:border-indigo-700 rounded-lg px-4 py-2 text-sm font-black text-indigo-900 dark:text-indigo-100 outline-none transition-all shadow-sm"
              >
                <span className="truncate">{activeData.id} - {activeData.name}</span>
                <ChevronDown className={cn("w-4 h-4 text-indigo-500 transition-transform duration-200", dropdownOpen && "rotate-180")} />
              </button>
              
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="py-1">
                    {Object.values(materialsData).map((mat: any) => (
                      <button
                        key={mat.id}
                        onClick={() => {
                          setSelectedMat(mat.id);
                          setDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors",
                          selectedMat === mat.id ? "bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300"
                        )}
                      >
                        <div>
                          <div className="font-bold text-sm">{mat.id}</div>
                          <div className="text-xs font-semibold opacity-70">{mat.name}</div>
                        </div>
                        {selectedMat === mat.id && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 gap-6">
          {/* KPI Sidebar */}
          <div className="w-full lg:w-[280px] bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Inventory Coverage</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg mr-4"><Package className="w-5 h-5" /></div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Current Inventory</div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">{activeData.currentInventory} <span className="text-xs font-semibold text-slate-500">units</span></div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg mr-4"><Activity className="w-5 h-5" /></div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Daily Consumption</div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">{activeData.dailyConsumption} <span className="text-xs font-semibold text-slate-500">units/day</span></div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg mr-4"><Clock className="w-5 h-5" /></div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Inventory Coverage</div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">{activeData.inventoryCoverage} <span className="text-xs font-semibold text-slate-500">days</span></div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg mr-4"><ShieldAlert className="w-5 h-5" /></div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Safety Stock</div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">{activeData.safetyStock} <span className="text-xs font-semibold text-slate-500">units</span></div>
                </div>
              </div>
              <div className="flex items-start bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/50">
                <div className="p-2 bg-white dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg mr-4 shadow-sm"><Calendar className="w-5 h-5" /></div>
                <div>
                  <div className="text-[11px] font-bold text-red-500 uppercase">Shortage Starts</div>
                  <div className="text-sm font-black text-red-700 dark:text-red-400">{activeData.shortageStart}</div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg mr-4"><TrendingDown className="w-5 h-5" /></div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Disruption Duration</div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">{activeData.disruptionDuration}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Chart */}
          <div className="flex-1 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col z-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white">Inventory Coverage Over Time (Days)</h3>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button className="px-4 py-1.5 bg-white dark:bg-blue-600 rounded-md text-sm font-bold text-slate-900 dark:text-white shadow-sm">Days</button>
                <button className="px-4 py-1.5 rounded-md text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Quantity</button>
              </div>
            </div>
            
            {/* Custom Legends/Labels for the Chart */}
            <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-2 text-[10px] font-bold mb-4 px-4 w-full">
              <div className="flex items-center"><div className="w-3 h-0.5 bg-blue-600 mr-2"></div> Inventory Coverage (days)</div>
              <div className="flex items-center"><div className="w-3 h-0.5 bg-amber-500 mr-2 border-t border-dashed"></div> Safety Stock Threshold</div>
              <div className="flex items-center"><div className="w-3 h-0.5 bg-red-500 mr-2 border-t border-dashed"></div> Shortage Start</div>
            </div>

            <div className="flex-1 w-full relative min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeData.chartData} margin={{ top: 10, right: 30, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `${val}d`} domain={[0, 'dataMax + 1']} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <ReferenceArea x1={activeData.shortageStart.split(' ')[0] + " (Day " + activeData.shortageStart.split('Day ')[1]} x2="May 27 (Day 10)" fill="#fee2e2" fillOpacity={0.5} />
                  
                  {/* Annotations */}
                  <ReferenceLine y={activeData.safetyStock / activeData.dailyConsumption} stroke="#f59e0b" strokeDasharray="3 3" />
                  <ReferenceLine x={activeData.shortageStart.split(' ')[0] + " (Day " + activeData.shortageStart.split('Day ')[1]} stroke="#ef4444" strokeDasharray="3 3" />
                  
                  <Line type="monotone" dataKey="coverage" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className={cn("mt-4 p-3 text-xs font-semibold rounded-lg flex items-start border", 
              activeData.criticality === 'Critical' || activeData.criticality === 'High' ? "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-900/50" : "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/50")}>
              <Info className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
              {activeData.exhaustionMsg}
            </div>
          </div>
        </div>
        
        {/* Bottom Tables */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm overflow-x-auto">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Inventory by Plant</h3>
            <table className="w-full text-sm text-left min-w-[500px]">
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
                {activeData.plants.map((r: any, i: number) => (
                  <tr key={i} className="text-slate-900 dark:text-slate-300">
                    <td className="py-3 font-semibold">{r.plant}</td>
                    <td className="py-3 text-right">{r.onHand}</td>
                    <td className="py-3 text-right">{r.cons}</td>
                    <td className="py-3 text-right font-bold text-slate-900 dark:text-white">{r.cov}</td>
                    <td className="py-3 text-right"><span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase border", r.statusColor)}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="mt-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:underline">View all plant inventory →</button>
          </div>
          
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm overflow-x-auto">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Supplier Contribution</h3>
            <table className="w-full text-sm text-left min-w-[500px]">
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
                {activeData.suppliers.map((r: any, i: number) => (
                  <tr key={i} className="text-slate-900 dark:text-slate-300">
                    <td className="py-3 font-semibold">{r.sup}</td>
                    <td className="py-3 text-right">{r.cap}</td>
                    <td className="py-3 text-right">{r.lead}</td>
                    <td className="py-3 text-right">{r.risk}</td>
                    <td className="py-3 text-right"><span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase border", r.statusColor)}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="mt-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:underline">View all suppliers →</button>
          </div>
        </div>
      </div>
      
      {/* Right Sidebar */}
      <div className="w-full xl:w-[320px] shrink-0 bg-slate-50 dark:bg-[#111827]/50 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm h-full flex flex-col">
        <div className="flex justify-between items-start mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
          <h3 className="font-bold text-slate-900 dark:text-white">Material Details</h3>
          <button className="text-slate-400 hover:text-slate-600 transition-colors">-</button>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{activeData.id}</h2>
            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded uppercase border", activeData.criticalityColor)}>{activeData.criticality}</span>
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{activeData.name}</p>
          <p className="text-xs font-medium text-slate-500 mt-1">{activeData.category}</p>
        </div>
        
        <div className="space-y-4 mb-6">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Overview</h4>
          <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Unit of Measure</span><span className="font-bold text-slate-900 dark:text-white">{activeData.details.uom}</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Unit Cost</span><span className="font-bold text-slate-900 dark:text-white">{activeData.details.cost}</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Typical Lead Time</span><span className="font-bold text-slate-900 dark:text-white">{activeData.details.leadTime}</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Criticality</span><span className="font-bold text-slate-900 dark:text-white">{activeData.criticality}</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Single Source</span><span className="font-bold text-slate-900 dark:text-white">{activeData.details.singleSource}</span></div>
        </div>
        
        <div className="space-y-4 mb-6">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Impacted By</h4>
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30 flex items-start shadow-sm">
            <AlertTriangle className="w-4 h-4 text-red-500 mr-2 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">SUP-007 <span className="text-slate-600 dark:text-slate-400 font-medium">Capacity Disruption</span></div>
              <div className="text-xs font-medium text-slate-500 mt-1">100% capacity loss for 10 days</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 mb-6 flex-1">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Used In (Products)</h4>
          <div className="space-y-2.5">
            {activeData.products.map((p: any) => (
              <div key={p.id} className="flex justify-between items-center text-sm group">
                <span className="font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{p.id}</span>
                <span className="text-slate-500 font-medium truncate w-24 ml-2">{p.name}</span>
                <span className={cn(`text-[10px] font-bold px-1.5 py-0.5 rounded border ml-auto`, p.color)}>{p.tag}</span>
              </div>
            ))}
          </div>
          <button className="text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:underline mt-3">+{Math.floor(Math.random() * 10) + 2} more products</button>
        </div>
        
        <div className="space-y-3 mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => setActiveTab && setActiveTab('Dependency Graph')}
            className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 font-bold py-2 rounded-lg flex items-center justify-center transition-all shadow-sm text-sm"
          >
            <Activity className="w-4 h-4 mr-2" /> View Dependency Path
          </button>
          <button 
            onClick={() => router.push(`/recovery/${disruptionData.simulation_id}`)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg flex items-center justify-center transition-all shadow-sm text-sm"
          >
            Explore Alternatives
          </button>
        </div>
      </div>
    </div>
  );
}



