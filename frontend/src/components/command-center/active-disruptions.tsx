'use client';
import { useSimulationStore } from '@/stores/useSimulationStore';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { ArrowRight, Activity } from 'lucide-react';

export function ActiveDisruptions() {
  const { activeDisruption } = useSimulationStore();

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 flex items-center">
          <Activity className="w-4 h-4 mr-2 text-slate-500" />
          Active Incidents
        </h3>
        <span className="text-xs font-medium bg-slate-200 text-slate-700 px-2 py-1 rounded-full">
          {activeDisruption ? '1 Active' : 'All Clear'}
        </span>
      </div>
      
      {activeDisruption ? (
        <div className="p-5 border-l-4 border-l-red-500 hover:bg-slate-50 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h4 className="text-lg font-bold text-slate-900 uppercase">
                  {activeDisruption.disruption.disruption_type} {activeDisruption.disruption.affected_entity_id}
                </h4>
                <span className="text-xs font-bold bg-red-100 text-red-700 px-2.5 py-0.5 rounded uppercase">CRITICAL</span>
              </div>
              <p className="text-sm text-slate-600">
                {activeDisruption.disruption.severity * 100}% capacity loss • {activeDisruption.disruption.duration_days} days duration
              </p>
            </div>
            <Link 
              href={`/disruptions/${activeDisruption.simulation_id}`}
              className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              View Impact <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="mt-5 grid grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-500 font-medium">Impact Score</p>
              <p className="text-sm font-bold text-slate-900">{activeDisruption.summary.overall_impact_score}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Affected Plants</p>
              <p className="text-sm font-bold text-slate-900">{activeDisruption.summary.affected_plants}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Affected Orders</p>
              <p className="text-sm font-bold text-slate-900">{activeDisruption.summary.affected_orders}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Revenue at Risk</p>
              <p className="text-sm font-bold text-red-600">{formatCurrency(activeDisruption.summary.revenue_at_risk)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Activity className="w-6 h-6" />
          </div>
          <h4 className="text-slate-900 font-medium">No active disruptions</h4>
          <p className="text-slate-500 text-sm mt-1">Your supply chain is operating within monitored thresholds.</p>
        </div>
      )}
    </div>
  );
}
