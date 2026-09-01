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

import { useState } from 'react';

export function ImpactOverviewTab({ disruptionData, setActiveTab }: { disruptionData: any, setActiveTab?: (tab: string) => void }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
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
        <div className={cn(
          "bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex-1 min-w-0 flex flex-col",
          isFullScreen ? "fixed inset-4 z-50 flex flex-col shadow-2xl" : ""
        )}>
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
              <button 
                onClick={() => setIsFullScreen(!isFullScreen)}
                className={cn(
                  "p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors",
                  isFullScreen ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 min-h-[400px] w-full rounded-lg overflow-hidden relative border border-slate-200 dark:border-slate-800">
             <SupplyChainGraph />
          </div>
        </div>
        
        {/* Full Screen Backdrop */}
        {isFullScreen && (
          <div 
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsFullScreen(false)} 
          />
        )}
        
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
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 flex flex-col justify-between relative overflow-hidden">
                {/* The decorative gradient bar on the side */}
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600"></div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-[11px] font-medium text-slate-500 mb-1">Affected Entity</div>
                    <div className="text-xl font-black flex items-center text-slate-900 dark:text-white">
                      {disruptionData?.disruption?.affected_entity_id || 'SUP-007'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-slate-500 mb-1">Region</div>
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
                
                <button 
                  onClick={() => setActiveTab && setActiveTab('Explanations')}
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-md flex items-center justify-center transition-colors shadow-sm text-sm"
                >
                  <FileText className="w-4 h-4 mr-2" /> View Explanation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Row - Full Width */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Inventory Coverage */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col group hover:shadow-md transition-shadow duration-300">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800/60">
            <h3 className="text-[15px] font-extrabold flex items-center mb-5 text-slate-900 dark:text-white">
              Inventory Coverage 
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ml-3 font-bold border border-blue-200 dark:border-blue-800/50">MAT-004</span>
              <Info className="w-4 h-4 text-slate-400 ml-auto cursor-help hover:text-slate-600 transition-colors" />
            </h3>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Time to Exhaustion</div>
                <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">3.0 <span className="text-lg font-bold text-slate-500 dark:text-slate-400">days</span></div>
              </div>
              <div className="flex space-x-6 text-right">
                <div>
                  <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">On Hand</div>
                  <div className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">1,240 <span className="text-[10px] font-medium text-slate-500">u</span></div>
                </div>
                <div>
                  <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Burn Rate</div>
                  <div className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">420 <span className="text-[10px] font-medium text-slate-500">u/d</span></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full relative h-[180px] p-4 bg-slate-50/50 dark:bg-[#0A0F1C]/30 rounded-b-xl">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={inventoryData} margin={{ top: 20, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.6} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} tickFormatter={(val) => `${val}d`} domain={[0, 8]} />
                
                <ReferenceArea x1="May 20" x2="May 29" fill="#ef4444" fillOpacity={0.15} />
                <ReferenceLine x="May 20" stroke="#ef4444" strokeDasharray="4 4" strokeWidth={2} />
                
                <Line type="monotone" dataKey="coverage" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#ffffff', stroke: '#3b82f6', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#3b82f6', stroke: '#ffffff', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="absolute top-4 right-10 bg-red-100 dark:bg-red-900/80 text-red-700 dark:text-red-200 border border-red-200 dark:border-red-700/50 text-[10px] font-bold px-2 py-1 rounded shadow-sm">
              Shortage Starts<br/><span className="text-red-900 dark:text-white font-black">May 20 (Day 3)</span>
            </div>
          </div>
        </div>

        {/* Card 2: Production Impact */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col group hover:shadow-md transition-shadow duration-300">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800/60">
            <h3 className="text-[15px] font-extrabold flex items-center text-slate-900 dark:text-white mb-1">
              Production Impact
              <Info className="w-4 h-4 text-slate-400 ml-auto cursor-help hover:text-slate-600 transition-colors" />
            </h3>
            <div className="text-[12px] font-semibold text-slate-500 flex items-center mb-6">
              <MapPin className="w-3 h-3 mr-1" /> PLANT-002
            </div>
            
            <div className="flex">
              <div className="flex-1 space-y-7">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Baseline Capacity</div>
                    <div className="font-black text-slate-900 dark:text-white text-sm">2,000 <span className="text-[10px] font-semibold text-slate-500">u/d</span></div>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden shadow-inner">
                    <div className="bg-blue-500 w-full h-full rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <div className="text-[11px] font-bold text-red-500 dark:text-red-400 uppercase tracking-wider flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1" /> Disrupted Capacity
                    </div>
                    <div className="font-black text-red-600 dark:text-red-400 text-sm">1,150 <span className="text-[10px] font-semibold text-red-400/70">u/d</span></div>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden shadow-inner flex">
                    <div className="bg-red-500 w-[57.5%] h-full rounded-l-full relative overflow-hidden">
                       <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-36 flex flex-col items-center justify-center relative pl-6 border-l border-slate-100 dark:border-slate-800/60 ml-6">
                <div className="w-20 h-20 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[{ value: 57.5, fill: '#3b82f6' }, { value: 42.5, fill: '#ef4444' }]}
                        innerRadius={28}
                        outerRadius={38}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        stroke="none"
                      >
                        {[{ value: 57.5, fill: '#e2e8f0' }, { value: 42.5, fill: '#ef4444' }].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} className={index === 1 ? "drop-shadow-sm" : ""} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center font-black text-slate-900 dark:text-white text-sm">
                    42.5%
                  </div>
                </div>
                <div className="text-[10px] font-bold text-red-500 uppercase tracking-wider mt-3 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded border border-red-100 dark:border-red-900/30">
                  Deficit
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 dark:bg-[#0A0F1C]/50 rounded-b-xl mt-auto">
            <Link href="#" className="text-blue-600 dark:text-blue-400 text-[13px] font-bold hover:text-blue-700 dark:hover:text-blue-300 flex items-center group">
              View comprehensive plant analysis <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
        
        {/* Card 3: Top Affected Orders */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow duration-300">
           <div className="p-6 pb-0 flex justify-between items-center mb-5">
             <h3 className="text-[15px] font-extrabold flex items-center text-slate-900 dark:text-white">
               Top Affected Orders <Info className="w-4 h-4 text-slate-400 ml-2 cursor-help hover:text-slate-600 transition-colors" />
             </h3>
             <button className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
               View All
             </button>
           </div>
           
           <div className="px-1 mb-2">
             <table className="w-full text-xs text-left">
               <thead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/50">
                 <tr>
                   <th className="py-2.5 pl-5 rounded-l-lg">Order ID</th>
                   <th className="py-2.5">Customer</th>
                   <th className="py-2.5 text-center">Delay</th>
                   <th className="py-2.5 pr-5 text-right rounded-r-lg">At Risk</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                 {[
                   { id: 'ORD-1042', customer: 'Enterprise A', delay: '4 days', rev: '₹4.5 L', critical: true },
                   { id: 'ORD-1044', customer: 'Retail Corp', delay: '5 days', rev: '₹3.2 L', critical: true },
                   { id: 'ORD-1043', customer: 'Enterprise B', delay: '3 days', rev: '₹2.1 L', critical: false },
                   { id: 'ORD-1045', customer: 'Global Ind.', delay: '4 days', rev: '₹1.8 L', critical: false },
                   { id: 'ORD-1046', customer: 'Tech Sol.', delay: '2 days', rev: '₹1.2 L', critical: false },
                 ].map((o, i) => (
                   <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors group/row cursor-pointer">
                     <td className="py-3 pl-5 font-bold text-slate-900 dark:text-slate-200">{o.id}</td>
                     <td className="py-3 font-semibold text-slate-600 dark:text-slate-400 truncate max-w-[90px]">{o.customer}</td>
                     <td className="py-3 text-center">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                          o.critical ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50" : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50"
                        )}>
                          {o.delay}
                        </span>
                     </td>
                     <td className="py-3 pr-5 font-black text-slate-900 dark:text-white text-right group-hover/row:text-blue-600 dark:group-hover/row:text-blue-400 transition-colors">{o.rev}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
           
           <div className="p-4 bg-slate-50 dark:bg-[#0A0F1C]/50 rounded-b-xl border-t border-slate-100 dark:border-slate-800/60 mt-auto">
             <Link href="#" className="text-blue-600 dark:text-blue-400 text-[13px] font-bold hover:text-blue-700 dark:hover:text-blue-300 flex items-center group">
               View all 124 affected orders <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
             </Link>
           </div>
        </div>
      </div>
      
    </div>
  );
}
