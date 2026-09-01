import { KPIStrip } from '@/components/command-center/kpi-strip';
import { ActiveDisruptions } from '@/components/command-center/active-disruptions';
import { SimulationLauncher } from '@/components/command-center/simulation-launcher';
import { SupplyChainGraphPreview } from '@/components/command-center/supply-chain-graph-preview';
import { RecentActivity } from '@/components/command-center/recent-activity';
import { InventoryCoverageChart } from '@/components/command-center/inventory-coverage-chart';
import { ProductionImpactChart } from '@/components/command-center/production-impact-chart';
import { RevenueExposureChart } from '@/components/command-center/revenue-exposure-chart';
import { RecoveryReadiness } from '@/components/command-center/recovery-readiness';
import { Zap } from 'lucide-react';

export default function CommandCenter() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Command Center</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time visibility across your supply chain</p>
        </div>
        
        {/* We use SimulationLauncher as the Simulate Disruption button wrapper */}
        <div className="flex bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition-colors overflow-hidden">
          <SimulationLauncher>
            <div className="px-4 py-2 font-semibold text-sm flex items-center cursor-pointer">
              <Zap className="w-4 h-4 mr-2" /> Simulate Disruption
            </div>
          </SimulationLauncher>
          <button className="px-2 py-2 border-l border-blue-500 hover:bg-blue-800 transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </button>
        </div>
      </div>
      
      <KPIStrip />
      
      {/* Middle Row: Active Disruptions, Supply Chain Impact, Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div className="xl:col-span-1">
           <ActiveDisruptions />
        </div>
        <div className="xl:col-span-2">
           <SupplyChainGraphPreview />
        </div>
        <div className="xl:col-span-1">
           <RecentActivity />
        </div>
      </div>
      
      {/* Bottom Row: Inventory, Production, Revenue, Recovery */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <InventoryCoverageChart />
        <ProductionImpactChart />
        <RevenueExposureChart />
        <RecoveryReadiness />
      </div>
    </div>
  );
}
