'use client';
import { useSimulationStore } from '@/stores/useSimulationStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ImpactSummary } from '@/components/disruptions/impact-summary';
import { SupplyChainGraph } from '@/components/disruptions/supply-chain-graph';
import { InventoryRunway } from '@/components/disruptions/inventory-runway';
import { ProductionLoss } from '@/components/disruptions/production-loss';
import { OrderImpactTable } from '@/components/disruptions/order-impact-table';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ImpactAnalysisPage({ params }: { params: { id: string } }) {
  const { activeDisruption } = useSimulationStore();
  const router = useRouter();

  useEffect(() => {
    if (!activeDisruption) {
      router.push('/command-center');
    }
  }, [activeDisruption, router]);

  if (!activeDisruption) return null;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-sm text-slate-500 mb-2">
            <Link href="/command-center" className="hover:text-slate-900 transition-colors">Command Center</Link>
            <span>/</span>
            <span>Disruptions</span>
            <span>/</span>
            <span className="font-semibold text-slate-900">{activeDisruption.simulation_id}</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center">
            Impact Analysis
            <span className="ml-4 text-sm font-bold bg-red-100 text-red-700 px-2.5 py-0.5 rounded uppercase">CRITICAL</span>
          </h1>
          <p className="text-slate-500 mt-1 uppercase font-semibold text-sm">
            {activeDisruption.disruption.disruption_type} • {activeDisruption.disruption.affected_entity_id} • {activeDisruption.disruption.severity * 100}% CAPACITY LOSS • {activeDisruption.disruption.duration_days} DAYS
          </p>
        </div>
        <div className="flex space-x-3">
          <Link 
            href={`/live-demo/${activeDisruption.simulation_id}`}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-md font-semibold text-sm shadow-sm flex items-center transition-colors"
          >
            Launch Slide 8 Demo <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link 
            href={`/recovery/${activeDisruption.simulation_id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md font-semibold text-sm shadow-sm flex items-center transition-colors"
          >
            Evaluate Recovery Options <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
      
      <ImpactSummary />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <SupplyChainGraph />
          <OrderImpactTable />
        </div>
        <div className="space-y-6">
          <InventoryRunway />
          <ProductionLoss />
        </div>
      </div>
    </div>
  );
}
