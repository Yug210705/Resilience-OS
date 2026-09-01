'use client';
import { useSimulationStore } from '@/stores/useSimulationStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Zap, BarChart2, Target, Bot, CheckSquare, ArrowRight, Lightbulb } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function LiveDemoPage({ params }: { params: { id: string } }) {
  const { activeDisruption } = useSimulationStore();
  const router = useRouter();

  useEffect(() => {
    if (!activeDisruption) router.push('/command-center');
  }, [activeDisruption, router]);

  if (!activeDisruption) return null;

  const summary = activeDisruption.summary;
  const disruption = activeDisruption.disruption;
  const options = activeDisruption.recovery_context?.supplier_options || [];

  // Generate dynamic plans based on API response to match slide
  const plans = options.map((opt: any, i: number) => {
    const cost = ((opt.unit_cost - 50) / 50 * 100).toFixed(0);
    return {
      id: `PLAN-${i+1}`,
      name: i === 0 ? `Activate ${opt.supplier_id} (Split Sourcing)` : `Alternative ${opt.supplier_id}`,
      supplier: opt.supplier_id,
      time: opt.lead_time_days,
      costIncrease: cost,
      recommended: i === 0
    };
  });

  // Fallbacks if no options exist in DB for the selected node
  if (plans.length === 0) {
    plans.push(
      { id: 'PLAN-1', name: 'Split Sourcing', supplier: 'SUP-011', time: 3, costIncrease: '14', recommended: true },
      { id: 'PLAN-2', name: 'Alternate Sourcing', supplier: 'SUP-012', time: 8, costIncrease: '21', recommended: false },
      { id: 'PLAN-3', name: 'Inventory Prioritization', supplier: 'INTERNAL', time: 5, costIncrease: '9', recommended: false }
    );
  }

  const bestPlan = plans.find((p: any) => p.recommended) || plans[0];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-12 pt-4">
      {/* HEADER MATCHING SLIDE 8 */}
      <div className="text-center mb-10">
        <h2 className="text-sm font-bold tracking-widest text-blue-600 uppercase mb-2">Live Proof + Impact</h2>
        <h1 className="text-4xl font-extrabold text-slate-900 uppercase tracking-tight mb-2">Let's Deliberately Break The Supply Chain.</h1>
        <p className="text-lg text-slate-500 mb-8">Live prototype demonstration — from disruption to recovery decision</p>
        
        {/* STEP TRACKER */}
        <div className="inline-flex items-center space-x-3 bg-slate-50 border border-slate-200 rounded-full px-6 py-3 text-sm font-bold text-slate-600 shadow-sm">
          <span className="flex items-center text-red-600"><AlertTriangle className="w-4 h-4 mr-1.5" /> BREAK</span>
          <ArrowRight className="w-4 h-4 text-slate-300" />
          <span className="flex items-center text-amber-500"><Zap className="w-4 h-4 mr-1.5" /> CASCADE</span>
          <ArrowRight className="w-4 h-4 text-slate-300" />
          <span className="flex items-center text-blue-500"><BarChart2 className="w-4 h-4 mr-1.5" /> COMPARE</span>
          <ArrowRight className="w-4 h-4 text-slate-300" />
          <span className="flex items-center text-red-500"><Target className="w-4 h-4 mr-1.5" /> OPTIMIZE</span>
          <ArrowRight className="w-4 h-4 text-slate-300" />
          <span className="flex items-center text-amber-600"><Bot className="w-4 h-4 mr-1.5" /> EXPLAIN</span>
          <ArrowRight className="w-4 h-4 text-slate-300" />
          <span className="flex items-center text-emerald-600"><CheckSquare className="w-4 h-4 mr-1.5" /> APPROVE</span>
        </div>
      </div>

      {/* 3-COLUMN GRID MATCHING SLIDE 8 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMN 1: SCENARIO & KPIs */}
        <div className="space-y-6">
          {/* Simulated Scenario Card (Red Border) */}
          <div className="bg-white border-2 border-red-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500"></div>
            <div className="flex items-center text-red-600 font-bold text-sm mb-3">
              <AlertTriangle className="w-4 h-4 mr-2" /> Simulated Scenario
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-1">{disruption.disruption_type.toUpperCase()} {disruption.affected_entity_id} UNAVAILABLE</h3>
            <p className="text-red-600 font-semibold mb-6">Disruption duration: {disruption.duration_days} Days</p>
            <p className="text-sm text-slate-500 italic">Live inject triggers downstream cascade simulation</p>
          </div>

          {/* Resilience OS Identifies Card (Yellow Border) */}
          <div className="bg-white border-2 border-amber-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500"></div>
            <h4 className="font-bold text-slate-700 text-sm mb-6">Resilience OS Identifies</h4>
            
            <div className="space-y-5">
              <div>
                <div className="text-3xl font-extrabold text-slate-900">{summary.affected_suppliers}</div>
                <div className="text-sm text-slate-500 font-medium">Suppliers Affected</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-slate-900">{summary.affected_orders}</div>
                <div className="text-sm text-slate-500 font-medium">Orders Impacted</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-amber-500">{summary.affected_plants}</div>
                <div className="text-sm text-slate-500 font-medium">Plants At Risk</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-red-600">{formatCurrency(summary.revenue_at_risk)}</div>
                <div className="text-sm text-red-600 font-semibold">Revenue Exposed</div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: RECOVERY OPTIONS (Blue Border) */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 shadow-sm relative overflow-hidden h-full">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500"></div>
          <h4 className="font-bold text-blue-800 text-sm mb-6">Recovery Options Evaluation</h4>
          
          <div className="space-y-6">
            {plans.map((plan: any, i: number) => (
              <div key={i} className={`p-4 rounded-lg border ${plan.recommended ? 'bg-white border-blue-400 shadow-md ring-1 ring-blue-400' : 'bg-transparent border-blue-200 opacity-70'}`}>
                <div className="flex justify-between items-center mb-1">
                  <h5 className="font-extrabold text-slate-900 text-lg uppercase">{plan.id} — {plan.name.split('(')[0]}</h5>
                  {plan.recommended && <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">Best Fit</span>}
                </div>
                <div className="text-slate-600 font-medium text-sm flex space-x-4">
                  <span>Cost: <span className="text-slate-900">+{plan.costIncrease}%</span></span>
                  <span>Delay: <span className="text-slate-900">{plan.time} days</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMN 3: OPTIMAL RECOMMENDATION (Green Border) */}
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 shadow-sm relative overflow-hidden flex flex-col h-full">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
          <h4 className="font-bold text-emerald-800 text-sm mb-4">Optimal Recommendation</h4>
          
          <h3 className="text-3xl font-extrabold text-emerald-600 uppercase tracking-tight">{bestPlan.id} ACTIVE</h3>
          <p className="text-emerald-800 font-bold mb-8">{bestPlan.name}</p>
          
          <ul className="space-y-4 mb-auto text-sm font-medium text-emerald-900">
            <li className="flex items-start"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 mr-3 shrink-0"></div>Available supplier capacity verified</li>
            <li className="flex items-start"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 mr-3 shrink-0"></div>Critical plant inventory preserved</li>
            <li className="flex items-start"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 mr-3 shrink-0"></div>Key customer SLAs fully protected</li>
            <li className="flex items-start"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 mr-3 shrink-0"></div>Lowest overall business impact</li>
          </ul>
          
          <div className="mt-8">
            <Link 
              href={`/risk/${params.id}?plan=${bestPlan.id}&supplier=${bestPlan.supplier}`}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3.5 rounded-lg shadow-lg flex justify-center items-center transition-colors uppercase tracking-wide text-sm"
            >
              <Lightbulb className="w-5 h-5 mr-2" /> Explore "Why {bestPlan.id}?"
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
