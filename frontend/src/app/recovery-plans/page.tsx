'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, TrendingDown, Clock, AlertCircle, CheckCircle2, 
  Search, Filter, Activity, MoreVertical, ListChecks, ArrowUpRight, Inbox,
  Zap, Server, Box, Crosshair
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { fetchPersistedRecoveryPlans, updateRecoveryPlanStatus, RecoveryPlan, RecoveryPlanStatus } from '@/services/api';

function formatStatus(status: RecoveryPlanStatus): string {
  switch (status) {
    case 'PENDING_AUDIT': return 'Pending Audit';
    case 'PENDING_APPROVAL': return 'Pending Approval';
    case 'APPROVED': return 'Approved';
    case 'COMPLETED': return 'Completed';
    case 'REJECTED': return 'Rejected';
    default: return 'Unknown';
  }
}

function getStatusColor(status: RecoveryPlanStatus) {
  switch (status) {
    case 'PENDING_AUDIT': return 'text-amber-600 bg-amber-50 border-amber-200/60';
    case 'PENDING_APPROVAL': return 'text-blue-600 bg-blue-50 border-blue-200/60';
    case 'APPROVED': return 'text-indigo-600 bg-indigo-50 border-indigo-200/60';
    case 'COMPLETED': return 'text-emerald-600 bg-emerald-50 border-emerald-200/60';
    case 'REJECTED': return 'text-red-600 bg-red-50 border-red-200/60';
    default: return 'text-slate-600 bg-slate-50 border-slate-200/60';
  }
}

function getStatusDotColor(status: RecoveryPlanStatus) {
  switch (status) {
    case 'PENDING_AUDIT': return 'bg-amber-500';
    case 'PENDING_APPROVAL': return 'bg-blue-500';
    case 'APPROVED': return 'bg-indigo-500';
    case 'COMPLETED': return 'bg-emerald-500';
    case 'REJECTED': return 'bg-red-500';
    default: return 'bg-slate-400';
  }
}

function formatDate(iso: string) {
  if (!iso) return { date: '-', time: '-' };
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return { date, time };
  } catch (e) {
    return { date: iso, time: '' };
  }
}

export default function RecoveryPlansWorkspace() {
  const router = useRouter();
  const [plans, setPlans] = useState<RecoveryPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPersistedRecoveryPlans()
      .then((res) => {
        setPlans(res || []);
        if (res && res.length > 0) {
          setSelectedPlanId(res[0].id);
        }
        setLoading(false);
      })
      .catch((err) => {
        const errorObj = err as Error;
        setError(errorObj.message || 'Unable to load recovery plans.');
        setLoading(false);
      });
  }, []);

  const filteredPlans = plans.filter(p => 
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.strategy.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.disruption_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.supplier_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedPlan = plans.find(p => p.id === selectedPlanId) || null;

  const kpiActive = plans.length;
  const kpiPendingAudit = plans.filter(p => p.status === 'PENDING_AUDIT').length;
  const kpiCompleted = plans.filter(p => p.status === 'COMPLETED').length;
  const kpiTotalCost = plans.reduce((acc, curr) => acc + (curr.total_cost || 0), 0);

  const handleAction = async (plan: RecoveryPlan) => {
    if (plan.status === 'PENDING_AUDIT') {
      router.push(`/risk/${plan.id}`);
    } else if (plan.status === 'PENDING_APPROVAL') {
      router.push(`/approvals/${plan.id}`);
    } else if (plan.status === 'APPROVED') {
      try {
        await updateRecoveryPlanStatus(plan.id, 'COMPLETED');
        router.push(`/sap-actions?sim=${plan.disruption_id}`);
      } catch (err) {
        const e = err as Error;
        alert(e.message || 'Execution failed');
      }
    } else if (plan.status === 'COMPLETED') {
      router.push(`/sap-actions?sim=${plan.disruption_id}`);
    }
  };

  const getTimelineSteps = (plan: RecoveryPlan) => {
    const s = plan.status;
    const isPastAudit = s === 'PENDING_APPROVAL' || s === 'APPROVED' || s === 'COMPLETED';
    const isPastApproval = s === 'APPROVED' || s === 'COMPLETED';
    const isCompleted = s === 'COMPLETED';
    
    return [
      { label: 'Plan Created', active: true, time: formatDate(plan.created_at) },
      { label: 'Risk Audit', active: isPastAudit },
      { label: 'Approval', active: isPastApproval },
      { label: 'SAP Execution', active: isCompleted },
    ];
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[13px] text-slate-500 mb-2 font-medium">
              <Link href="/command-center" className="hover:text-slate-900 transition-colors">Command Center</Link>
              <span className="text-slate-300">/</span>
              <span className="text-slate-900">Recovery Plans</span>
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Recovery Operations</h1>
            <p className="text-[13px] text-slate-500 mt-1">Manage, audit, and execute active recovery plans across the enterprise.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center shadow-sm">
            <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
            <div>
              <p className="text-sm font-medium">Unable to load operations data</p>
              <p className="text-sm opacity-90 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-6">
            <div className="h-20 bg-white border border-slate-200 rounded-xl shadow-sm animate-pulse" />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 h-[400px] bg-white border border-slate-200 rounded-xl shadow-sm animate-pulse" />
              <div className="xl:col-span-1 h-[400px] bg-white border border-slate-200 rounded-xl shadow-sm animate-pulse" />
            </div>
          </div>
        ) : plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white border border-slate-200 rounded-xl shadow-sm py-32 text-center">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mb-4">
              <Inbox className="w-6 h-6 text-slate-400" />
            </div>
            <h2 className="text-[15px] font-semibold text-slate-900">No active plans</h2>
            <p className="text-[13px] text-slate-500 mt-1.5 max-w-sm mx-auto">There are currently no persisted recovery plans in the system.</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* UNIFIED COMMAND STRIP */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col sm:flex-row overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              <div className="flex-1 p-5 flex items-center">
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mr-4 shrink-0">
                  <Box className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Plans</p>
                  <div className="text-xl font-semibold text-slate-900 mt-0.5 font-mono">{kpiActive}</div>
                </div>
              </div>
              <div className="flex-1 p-5 flex items-center">
                <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center mr-4 shrink-0">
                  <Activity className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pending Audit</p>
                  <div className="text-xl font-semibold text-slate-900 mt-0.5 font-mono">{kpiPendingAudit}</div>
                </div>
              </div>
              <div className="flex-1 p-5 flex items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mr-4 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Completed</p>
                  <div className="text-xl font-semibold text-slate-900 mt-0.5 font-mono">{kpiCompleted}</div>
                </div>
              </div>
              <div className="flex-1 p-5 flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center mr-4 shrink-0">
                  <TrendingDown className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Exposure</p>
                  <div className="text-xl font-semibold text-slate-900 mt-0.5 font-mono">{formatCurrency(kpiTotalCost)}</div>
                </div>
              </div>
            </div>

            {/* MAIN WORKSPACE */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
              
              {/* LEFT: DATA GRID */}
              <div className="xl:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
                <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-t-xl">
                  <div className="relative flex-1 max-w-md w-full">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search by ID, strategy, or supplier..." 
                      className="w-full pl-9 pr-4 py-2 text-[13px] bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors placeholder:text-slate-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button className="flex items-center px-3 py-2 text-[13px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors">
                    <Filter className="w-3.5 h-3.5 mr-2" /> Filter
                  </button>
                </div>

                <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
                  {filteredPlans.length > 0 ? (
                    <table className="w-full text-left whitespace-nowrap">
                      <thead className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm">
                        <tr>
                          <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">Plan ID</th>
                          <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">Disruption</th>
                          <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">Strategy</th>
                          <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">Status</th>
                          <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">Created</th>
                          <th className="px-5 py-3 border-b border-slate-200"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredPlans.map((plan) => {
                          const isSelected = plan.id === selectedPlanId;
                          const { date, time } = formatDate(plan.created_at);
                          const isRecommended = plan.final_score > 0;
                          
                          return (
                            <tr 
                              key={plan.id} 
                              onClick={() => setSelectedPlanId(plan.id)}
                              className={`cursor-pointer transition-colors group ${isSelected ? 'bg-indigo-50/30' : 'bg-white hover:bg-slate-50/80'}`}
                            >
                              <td className="px-5 py-3.5 relative">
                                {isSelected && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-600" />}
                                <div className="flex flex-col">
                                  <span className={`text-[13px] font-mono font-medium ${isSelected ? 'text-indigo-700' : 'text-slate-900'}`}>
                                    {plan.id.split('-')[0]}-{plan.id.split('-')[1]?.substring(0, 6) || plan.id}
                                  </span>
                                  {isRecommended && <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mt-0.5">Recommended</span>}
                                </div>
                              </td>
                              <td className="px-5 py-3.5">
                                <div className="text-[13px] font-mono text-slate-600">{plan.disruption_id}</div>
                              </td>
                              <td className="px-5 py-3.5">
                                <div className="text-[13px] font-medium text-slate-900 max-w-[180px] truncate" title={plan.strategy}>{plan.strategy}</div>
                                <div className="text-[12px] text-slate-500 mt-0.5 max-w-[180px] truncate" title={plan.supplier_id}>{plan.supplier_id.replace(/,/g, ' + ')}</div>
                              </td>
                              <td className="px-5 py-3.5">
                                <div className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full border ${getStatusColor(plan.status)}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDotColor(plan.status)}`}></span>
                                  {formatStatus(plan.status)}
                                </div>
                              </td>
                              <td className="px-5 py-3.5">
                                <div className="text-[13px] font-medium text-slate-700">{date}</div>
                                <div className="text-[11px] text-slate-400 font-mono mt-0.5">{time}</div>
                              </td>
                              <td className="px-5 py-3.5 text-right">
                                <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                                  <ArrowUpRight className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Search className="w-6 h-6 text-slate-300 mb-3" />
                      <p className="text-[13px] text-slate-500">No plans match your current search.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: INTELLIGENCE PANEL */}
              <div className="xl:col-span-1">
                {selectedPlan ? (
                  <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-fit sticky top-6 overflow-hidden">
                    
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center mr-3 shadow-sm">
                          <Crosshair className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <h3 className="text-[13px] font-mono font-medium text-slate-900">{selectedPlan.id}</h3>
                          <p className="text-[11px] text-slate-500 uppercase tracking-wider mt-0.5 font-medium">Selected Plan</p>
                        </div>
                      </div>
                      <div className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full border ${getStatusColor(selectedPlan.status)}`}>
                        {formatStatus(selectedPlan.status)}
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 space-y-6">
                      
                      {/* Strategy Block */}
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Strategy Allocation</div>
                        <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-3">
                          <div className="text-[14px] font-semibold text-slate-900">{selectedPlan.strategy}</div>
                          <p className="text-[12px] text-slate-600 mt-1 leading-relaxed">
                            Mitigating <span className="font-mono text-[11px] bg-slate-200/50 px-1 py-0.5 rounded text-slate-700">{selectedPlan.disruption_id}</span> using <span className="font-medium text-slate-800">{selectedPlan.supplier_id.replace(/,/g, ' + ')}</span>.
                          </p>
                        </div>
                      </div>

                      {/* 2x2 Metrics Grid */}
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Impact Metrics</div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white border border-slate-200/60 rounded-lg p-3 shadow-sm">
                            <div className="flex items-center text-slate-500 mb-1.5">
                              <Clock className="w-3.5 h-3.5 mr-1.5" />
                              <span className="text-[11px] font-medium">Recovery Time</span>
                            </div>
                            <div className="text-[15px] font-mono font-semibold text-slate-900">{selectedPlan.max_delay_days} <span className="text-[11px] text-slate-500 font-sans font-normal">days</span></div>
                          </div>
                          <div className="bg-white border border-slate-200/60 rounded-lg p-3 shadow-sm">
                            <div className="flex items-center text-slate-500 mb-1.5">
                              <TrendingDown className="w-3.5 h-3.5 mr-1.5" />
                              <span className="text-[11px] font-medium">Total Cost</span>
                            </div>
                            <div className="text-[15px] font-mono font-semibold text-slate-900">{formatCurrency(selectedPlan.total_cost)}</div>
                          </div>
                          <div className="bg-white border border-slate-200/60 rounded-lg p-3 shadow-sm">
                            <div className="flex items-center text-slate-500 mb-1.5">
                              <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
                              <span className="text-[11px] font-medium">SLA Exposure</span>
                            </div>
                            <div className="text-[15px] font-mono font-semibold text-red-600">{formatCurrency(selectedPlan.total_sla_exposure)}</div>
                          </div>
                          <div className="bg-white border border-slate-200/60 rounded-lg p-3 shadow-sm">
                            <div className="flex items-center text-slate-500 mb-1.5">
                              <Activity className="w-3.5 h-3.5 mr-1.5" />
                              <span className="text-[11px] font-medium">Risk Score</span>
                            </div>
                            <div className="text-[15px] font-mono font-semibold text-slate-900">{selectedPlan.blended_risk.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>

                      {/* Compact Lifecycle */}
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Lifecycle Progress</div>
                        <div className="flex justify-between items-start relative px-1">
                          <div className="absolute top-2 left-4 right-4 h-[2px] bg-slate-100 z-0"></div>
                          {getTimelineSteps(selectedPlan).map((step, idx) => (
                            <div key={idx} className="relative z-10 flex flex-col items-center group">
                              <div className={`w-4 h-4 rounded-full border-[2px] flex items-center justify-center bg-white ${step.active ? 'border-indigo-600' : 'border-slate-200'}`}>
                                {step.active && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                              </div>
                              <span className={`text-[10px] font-medium mt-1.5 text-center ${step.active ? 'text-slate-800' : 'text-slate-400'}`}>
                                {step.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Contextual Action */}
                    <div className="p-4 bg-slate-50 border-t border-slate-100">
                      <button 
                        onClick={() => handleAction(selectedPlan)}
                        className="w-full flex justify-center items-center py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-medium text-[13px] shadow-sm transition-colors"
                      >
                        {selectedPlan.status === 'PENDING_AUDIT' ? 'Start Risk Audit' :
                         selectedPlan.status === 'PENDING_APPROVAL' ? 'Review for Approval' :
                         selectedPlan.status === 'APPROVED' ? 'Execute SAP Action' :
                         'View Action History'}
                         <ArrowUpRight className="w-3.5 h-3.5 ml-1.5 opacity-80" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50/50 border border-slate-200 border-dashed rounded-xl flex flex-col items-center justify-center min-h-[300px] h-fit text-center p-8 sticky top-6">
                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center mb-4 shadow-sm">
                      <ListChecks className="w-5 h-5 text-slate-400" />
                    </div>
                    <h3 className="text-[14px] font-semibold text-slate-900">Select a Plan</h3>
                    <p className="text-[12px] text-slate-500 mt-1 max-w-[200px]">Select a recovery plan from the active workspace to view intelligence, metrics, and actions.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
