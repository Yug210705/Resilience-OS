'use client';
import { useSimulationStore } from '@/stores/useSimulationStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ShieldCheck, TrendingDown, Clock, PackageCheck } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function RecoveryPage({ params }: { params: { id: string } }) {
  const { activeDisruption } = useSimulationStore();
  const router = useRouter();

  useEffect(() => {
    if (!activeDisruption) router.push('/command-center');
  }, [activeDisruption, router]);

  if (!activeDisruption) return null;

  const options = activeDisruption.recovery_context?.supplier_options || [];
  
  // Dummy generate plans based on options
  const plans = options.map((opt: any, i: number) => ({
    id: `PLAN-${i+1}`,
    name: `Activate ${opt.supplier_id}`,
    supplier: opt.supplier_id,
    time: opt.lead_time_days,
    costIncrease: ((opt.unit_cost - 50) / 50 * 100).toFixed(1), // Fake baseline
    recovered: Math.min(100, Math.round((opt.capacity_per_day / activeDisruption.recovery_context.material_shortages[0]?.normal_demand_per_day) * 100)),
    risk: opt.risk_score < 30 ? 'LOW' : opt.risk_score < 60 ? 'MEDIUM' : 'HIGH',
    recommended: i === 0
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex justify-between items-end border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-sm text-slate-500 mb-2">
            <Link href="/command-center" className="hover:text-slate-900 transition-colors">Command Center</Link>
            <span>/</span>
            <Link href={`/disruptions/${params.id}`} className="hover:text-slate-900 transition-colors">{params.id}</Link>
            <span>/</span>
            <span className="font-semibold text-slate-900">Recovery Options</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Recovery Optimization</h1>
          <p className="text-slate-500 mt-1">Evaluating alternative supply sources and allocation strategies</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {plans.map((plan: any) => (
          <div key={plan.id} className={`bg-white border rounded-xl overflow-hidden shadow-sm relative ${plan.recommended ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200'}`}>
            {plan.recommended && (
              <div className="bg-blue-500 text-white text-xs font-bold uppercase tracking-wider text-center py-1.5 flex justify-center items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Recommended Plan
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
              <p className="text-sm text-slate-500 mb-6">Shift allocation to {plan.supplier}</p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div className="flex items-center text-slate-600"><Clock className="w-4 h-4 mr-2"/> Recovery Time</div>
                  <div className="font-semibold text-slate-900">{plan.time} days</div>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div className="flex items-center text-slate-600"><TrendingDown className="w-4 h-4 mr-2"/> Cost Variance</div>
                  <div className="font-semibold text-red-600">+{plan.costIncrease}%</div>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div className="flex items-center text-slate-600"><PackageCheck className="w-4 h-4 mr-2"/> Orders Recovered</div>
                  <div className="font-semibold text-emerald-600">{plan.recovered}%</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-slate-600">Execution Risk</div>
                  <div className={`text-xs font-bold px-2 py-1 rounded ${plan.risk === 'LOW' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{plan.risk}</div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link 
                  href={`/risk/${params.id}?plan=${plan.id}&supplier=${plan.supplier}`}
                  className={`w-full flex justify-center items-center py-2.5 rounded-md font-semibold text-sm transition-colors ${plan.recommended ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  Audit Risk & Approve <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        ))}
        {plans.length === 0 && (
          <div className="col-span-3 text-center py-12 bg-white border border-slate-200 rounded-lg">
            <p className="text-slate-500">No alternate recovery plans found for this disruption.</p>
          </div>
        )}
      </div>
    </div>
  );
}
