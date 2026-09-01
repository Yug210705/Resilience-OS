'use client';
import dynamic from 'next/dynamic';
import { BarChart2, Users, Building2, LayoutDashboard, ListChecks, AlertTriangle, Info, Maximize, FileText, ArrowRight, Factory, LayoutGrid, Timer, MapPin } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, ReferenceArea, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const SupplyChainGraph = dynamic(
  () => import('@/components/disruptions/supply-chain-graph').then((mod) => mod.SupplyChainGraph),
  { ssr: false }
);

const inventoryData = [
  { day: 'May 17', coverage: 7.2 },
  { day: 'May 18', coverage: 5.8 },
  { day: 'May 19', coverage: 4.4 },
  { day: 'May 20', coverage: 3.0 },
  { day: 'May 23', coverage: 1.5 },
  { day: 'May 26', coverage: 0 },
  { day: 'May 29', coverage: 0 },
];

export function ImpactOverviewTab({ disruptionData }: { disruptionData: any }) {
  const summary = disruptionData?.summary || {};
  
  const kpis = [
    { label: 'Affected Suppliers', value: summary.affected_suppliers || 7, icon: Factory, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/30' },
    { label: 'Affected Materials', value: summary.affected_materials || 3, icon: Users, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/30' },
    { label: 'Affected Plants', value: summary.affected_plants || 4, icon: Building2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
    { label: 'Affected Products', value: summary.affected_products || 8, icon: LayoutGrid, color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800' },
    { label: 'Affected Orders', value: summary.affected_orders || 124, icon: ListChecks, color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800' },
    { label: 'Revenue at Risk', value: summary.revenue_at_risk ? `₹${(summary.revenue_at_risk / 10000000).toFixed(1)} Cr` : '₹18.5 Cr', icon: Timer, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/30' },
  ];

  return (
    <div className="flex flex-col space-y-6 text-slate-900 dark:text-slate-100">
      
      {/* Impact Summary Strip - Full Width */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Impact Summary</h3>
        <div className="flex overflow-x-auto pb-2 gap-4 custom-scrollbar">
          {kpis.map((kpi, i) => (
            <div key={i} className="flex-1 min-w-[180px] flex items-center p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm">
              <div className={cn("p-2.5 rounded-lg mr-4 shrink-0", kpi.bg)}>
                <kpi.icon className={cn("w-5 h-5", kpi.color)} />
              </div>
              <div>
                <div className="text-[20px] font-extrabold text-slate-900 dark:text-white leading-none mb-1 whitespace-nowrap">{kpi.value}</div>
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-tight">{kpi.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Middle Row: Graph and Details */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Dependency Graph */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex-1 min-w-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center text-sm font-bold text-slate-900 dark:text-white">
              Dependency Graph
              <Info className="w-4 h-4 text-slate-400 ml-2" />
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-[12px] font-semibold text-slate-700 dark:text-slate-300">
                <span className="text-slate-500 mr-1">Layout:</span> Hierarchical <span className="ml-2 text-slate-400 text-[10px]">▼</span>
              </div>
              <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-[12px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                Fit View
              </button>
              <button className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800">
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="h-[400px] rounded-lg overflow-hidden relative border border-slate-200 dark:border-slate-800">
             <SupplyChainGraph />
          </div>
        </div>
        
        {/* Right Sidebar: Impact Details */}
        <div className="w-full xl:w-[320px] shrink-0">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm h-full flex flex-col">
            <div className="flex items-center mb-6 text-slate-900 dark:text-white font-bold pb-4 border-b border-slate-200 dark:border-slate-800">
              <span className="text-sm">Impact Details</span>
              <Info className="w-4 h-4 text-slate-400 ml-2" />
            </div>
            
            <div className="space-y-5 flex-1">
              <div>
                <div className="text-[11px] font-medium text-slate-500 mb-1">Disruption Type</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">Supplier Capacity Disruption</div>
              </div>
              <div>
                <div className="text-[11px] font-medium text-slate-500 mb-1">Disrupted Entity</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">SUP-007 - Pacific Electronics</div>
              </div>
              <div>
                <div className="text-[11px] font-medium text-slate-500 mb-1">Severity</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">100%</div>
              </div>
              <div>
                <div className="text-[11px] font-medium text-slate-500 mb-1">Duration</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">10 Days</div>
              </div>
              <div>
                <div className="text-[11px] font-medium text-slate-500 mb-1">Affected Regions</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">Asia Pacific, India</div>
              </div>
              <div>
                <div className="text-[11px] font-medium text-slate-500 mb-1">Category</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">Electronics Components</div>
              </div>
              <div>
                <div className="text-[11px] font-medium text-slate-500 mb-1">Description</div>
                <div className="text-[13px] font-medium text-slate-900 dark:text-white leading-relaxed">
                  Complete capacity loss at supplier due to facility shutdown caused by port congestion and raw material unavailability.
                </div>
              </div>
            </div>
            
            <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-md flex items-center justify-center transition-colors shadow-sm text-sm">
              <FileText className="w-4 h-4 mr-2" /> View Explanation
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom Row - Full Width */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Inventory Coverage */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold flex items-center mb-4">
            Inventory Coverage <span className="text-slate-500 font-normal ml-1">(Material: MAT-004)</span> <Info className="w-4 h-4 text-slate-400 ml-2" />
          </h3>
          <div className="mb-4">
            <div className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">3.0 days remaining</div>
            <div className="flex space-x-8 text-sm">
              <div>
                <div className="text-slate-500 text-xs">Current Inventory</div>
                <div className="font-bold">1,240 units</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs">Daily Consumption</div>
                <div className="font-bold">420 units/day</div>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full relative h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={inventoryData} margin={{ top: 20, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={5} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(val) => `${val}d`} domain={[0, 8]} />
                
                <ReferenceArea x1="May 20" x2="May 29" fill="#fee2e2" fillOpacity={0.4} />
                <ReferenceLine x="May 20" stroke="#ef4444" strokeDasharray="3 3" />
                
                <Line type="monotone" dataKey="coverage" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="absolute top-2 right-12 text-red-500 text-[10px] font-bold text-center">
              Shortage starts<br/>May 20 (Day 3)
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4 text-[10px] font-semibold text-slate-500">
            <div className="flex items-center"><div className="w-2 h-2 bg-blue-500 transform rotate-45 mr-1.5"></div> Inventory Coverage (Days)</div>
            <div className="flex items-center"><div className="w-3 h-0.5 border-t-2 border-dashed border-red-500 mr-1.5"></div> Shortage Threshold</div>
          </div>
        </div>

        {/* Card 2: Production Impact */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold flex items-center mb-6">
              Production Impact <span className="text-slate-500 font-normal ml-1">[Plant: PLANT-002]</span> <Info className="w-4 h-4 text-slate-400 ml-2" />
            </h3>
            
            <div className="flex">
              <div className="flex-1 space-y-6">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Normal Capacity</div>
                  <div className="font-extrabold text-slate-900 dark:text-white mb-2">2,000 units/day</div>
                  <div className="w-full bg-blue-600 h-1.5 rounded-full"></div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Disrupted Capacity</div>
                  <div className="font-extrabold text-slate-900 dark:text-white mb-2">1,150 units/day</div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full flex overflow-hidden">
                    <div className="bg-red-500 w-[42.5%] h-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="w-32 flex flex-col items-center justify-center relative pl-4">
                <div className="w-24 h-24 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[{ value: 57.5, fill: '#e2e8f0' }, { value: 42.5, fill: '#ef4444' }]}
                        innerRadius={30}
                        outerRadius={40}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        stroke="none"
                      >
                        {[{ value: 57.5, fill: '#e2e8f0' }, { value: 42.5, fill: '#ef4444' }].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center font-extrabold text-slate-900 dark:text-white">
                    42.5%
                  </div>
                </div>
                <div className="text-[10px] font-semibold text-slate-500 mt-2">Production Loss</div>
              </div>
            </div>
          </div>
          
          <Link href="#" className="text-blue-600 text-xs font-bold hover:underline flex items-center mt-4">
            View Plant Impact Details <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>
        
        {/* Card 3: Top Affected Orders */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
           <div>
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-sm font-bold flex items-center">
                 Top Affected Orders <Info className="w-4 h-4 text-slate-400 ml-2" />
               </h3>
               <button className="text-blue-600 text-xs font-semibold hover:underline">View all orders</button>
             </div>
             <table className="w-full text-xs text-left mb-2">
               <thead className="text-[10px] text-slate-500 border-b border-slate-100 dark:border-slate-800">
                 <tr>
                   <th className="pb-2 font-medium">Order ID</th>
                   <th className="pb-2 font-medium">Customer</th>
                   <th className="pb-2 font-medium">Product</th>
                   <th className="pb-2 font-medium">Shortfall</th>
                   <th className="pb-2 font-medium">Delay</th>
                   <th className="pb-2 font-medium">Revenue at Risk</th>
                 </tr>
               </thead>
               <tbody className="space-y-1">
                 {[
                   { id: 'ORD-1042', customer: 'Enterprise A', product: 'PRD-008', shortfall: '300 units', delay: '4 days', rev: '₹4.5 L' },
                   { id: 'ORD-1043', customer: 'Enterprise B', product: 'PRD-003', shortfall: '150 units', delay: '3 days', rev: '₹2.1 L' },
                   { id: 'ORD-1044', customer: 'Retail Corp', product: 'PRD-010', shortfall: '200 units', delay: '5 days', rev: '₹3.2 L' },
                   { id: 'ORD-1045', customer: 'Global Industries', product: 'PRD-008', shortfall: '120 units', delay: '4 days', rev: '₹1.8 L' },
                   { id: 'ORD-1046', customer: 'Tech Solutions', product: 'PRD-003', shortfall: '100 units', delay: '2 days', rev: '₹1.2 L' },
                 ].map((o, i) => (
                   <tr key={i} className="text-slate-900 dark:text-slate-300">
                     <td className="py-2.5 font-medium">{o.id}</td>
                     <td className="py-2.5 text-slate-500">{o.customer}</td>
                     <td className="py-2.5 text-slate-500">{o.product}</td>
                     <td className="py-2.5">{o.shortfall}</td>
                     <td className="py-2.5 text-red-500 font-medium">{o.delay}</td>
                     <td className="py-2.5 font-semibold">{o.rev}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
           <Link href="#" className="text-blue-600 text-xs font-bold hover:underline flex items-center mt-2">
             View all 124 affected orders <ArrowRight className="w-3 h-3 ml-1" />
           </Link>
        </div>
      </div>
      
    </div>
  );
}
