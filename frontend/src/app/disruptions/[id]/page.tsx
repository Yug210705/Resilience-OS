'use client';
import { useSimulationStore } from '@/stores/useSimulationStore';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Share2, Sparkles, ChevronRight, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImpactOverviewTab } from '@/components/disruptions/tabs/impact-overview-tab';
import { InventoryTab } from '@/components/disruptions/tabs/inventory-tab';
import { ProductionTab } from '@/components/disruptions/tabs/production-tab';

const TABS = [
  'Impact Overview', 'Dependency Graph', 'Affected Entities', 
  'Inventory', 'Production', 'Orders', 'Financial Impact', 'Explanations'
];

export default function ImpactAnalysisPage() {
  const params = useParams();
  const id = params?.id as string;
  const { activeDisruption } = useSimulationStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Impact Overview');

  useEffect(() => {
    // We disable this redirect for the sake of UI development 
    // so we can see the layout even if store is cleared on reload
    // if (!activeDisruption) {
    //   router.push('/command-center');
    // }
  }, [activeDisruption, router]);

  // Use a fallback object if no activeDisruption so UI doesn't break during dev
  const data = activeDisruption || {
    simulation_id: 'SIM-2025-05-17-001',
    disruption: { disruption_type: 'Supplier Capacity Disruption', affected_entity_id: 'SUP-007', severity: 1.0, duration_days: 10 },
    summary: { affected_suppliers: 7, affected_materials: 3, affected_plants: 4, affected_products: 8, affected_orders: 124, revenue_at_risk: 185000000 }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#0A0F1C] overflow-y-auto overflow-x-hidden custom-scrollbar">
      <div className="max-w-[1600px] mx-auto w-full">
        {/* Header Area */}
        <div className="px-6 pt-4 shrink-0">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <div className="flex items-center text-[12px] font-bold text-slate-500 dark:text-slate-400 mb-3 tracking-wide uppercase">
                <span className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer transition-colors">Disruptions</span>
                <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-400 dark:text-slate-600" />
                <span className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer transition-colors">Analysis</span>
                <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-400 dark:text-slate-600" />
                <span className="text-slate-900 dark:text-white">{data.disruption.affected_entity_id}</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
                Disruption Impact Analysis
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-4 py-2 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[13px] font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
                <Share2 className="w-4 h-4 mr-2 text-slate-500" /> Share
              </button>
              <button className="flex items-center px-4 py-2 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[13px] font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
                <Download className="w-4 h-4 mr-2 text-slate-500" /> Export
              </button>
              <Link 
                href={`/recovery/${data.simulation_id}`}
                className="flex items-center px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-bold transition-all shadow-sm shadow-blue-500/20"
              >
                <Sparkles className="w-4 h-4 mr-2" /> Create Recovery Plan
              </Link>
            </div>
          </div>
          
          {/* Top Summary Box */}
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex items-stretch overflow-hidden mb-2">
            <div className="flex items-center p-5 flex-1">
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl mr-5 border border-red-100 dark:border-red-900/30 shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <h2 className="text-[18px] font-extrabold text-slate-900 dark:text-white uppercase tracking-tight leading-none">
                    {data.disruption.affected_entity_id}
                  </h2>
                  <span className="font-semibold text-slate-500 dark:text-slate-400 capitalize text-[14px]">
                    {data.disruption.disruption_type}
                  </span>
                </div>
                <div className="flex items-center mt-2 space-x-3 text-[13px]">
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm border border-red-200 dark:border-red-800/50">
                    Critical
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">{data.disruption.severity * 100}% capacity loss</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="text-slate-600 dark:text-slate-400 font-medium">{data.disruption.duration_days} Days duration</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center bg-slate-50 dark:bg-slate-900/50 border-l border-slate-200 dark:border-slate-800 px-8 py-5 space-x-12 shrink-0">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Started</div>
                <div className="text-[13px] font-bold text-slate-900 dark:text-white">May 17, 2025 10:20 AM</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Simulation ID</div>
                <div className="text-[13px] font-bold text-slate-900 dark:text-white">{data.simulation_id}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status</div>
                <div className="flex items-center text-[13px] font-bold text-slate-900 dark:text-white">
                  <span className="relative flex h-2.5 w-2.5 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                  Active
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-2 mt-6 border-b border-slate-200 dark:border-slate-800 px-2">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-5 py-3 text-[13px] font-bold transition-all border-b-2 relative",
                  activeTab === tab 
                    ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400" 
                    : "text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-200"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        
        {/* Tab Content Area */}
        <div className="px-6 py-6 pb-12">
          {/* Keeping tabs in the DOM so they don't remount and lose state/flicker when switching */}
          <div className={activeTab === 'Impact Overview' ? 'block' : 'hidden'}>
            <ImpactOverviewTab disruptionData={data} />
          </div>
          <div className={activeTab === 'Inventory' ? 'block' : 'hidden'}>
            <InventoryTab disruptionData={data} />
          </div>
          <div className={activeTab === 'Production' ? 'block' : 'hidden'}>
            <ProductionTab disruptionData={data} />
          </div>
          
          {/* Fallbacks for other tabs */}
          {!['Impact Overview', 'Inventory', 'Production'].includes(activeTab) && (
            <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500 font-medium py-20">
              {activeTab} view not implemented in this demo.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
