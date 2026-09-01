import { KPIStrip } from '@/components/command-center/kpi-strip';
import { ActiveDisruptions } from '@/components/command-center/active-disruptions';
import { SimulationLauncher } from '@/components/command-center/simulation-launcher';

export default function CommandCenter() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-end border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Supply Chain Command Center</h1>
          <p className="text-slate-500 mt-1">Global network visibility and resilience monitoring</p>
        </div>
        <SimulationLauncher />
      </div>
      
      <KPIStrip />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <ActiveDisruptions />
        </div>
        <div className="space-y-6">
           {/* Mini Risk Audit or Alerts */}
           <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
             <h3 className="font-semibold text-slate-900 mb-4">Pending Approvals</h3>
             <div className="text-sm text-slate-500 py-8 text-center border border-dashed border-slate-200 rounded">
               No pending actions requiring human approval.
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
