'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Activity, PlayCircle, CheckCircle2, AlertCircle, FileText, 
  Search, Filter, RefreshCw, BarChart3, Plus, ArrowUpRight, Inbox, Clock, TrendingDown,
  ChevronRight, ChevronLeft, Hexagon, Crosshair, ShieldCheck, ListChecks, MoreVertical
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { 
  fetchScenarios, generateScenarios, updateScenarioStatus, createRecoveryPlan, 
  Scenario, ScenarioListResponse 
} from '@/services/api';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

function getStatusStyle(status: string) {
  switch (status) {
    case 'SIMULATING': return 'text-amber-700 bg-amber-50 border-amber-200/60';
    case 'READY': return 'text-blue-700 bg-blue-50 border-blue-200/60';
    case 'SELECTED': return 'text-purple-700 bg-purple-50 border-purple-200/60';
    case 'ARCHIVED': return 'text-slate-600 bg-slate-50 border-slate-200/60';
    default: return 'text-slate-600 bg-slate-50 border-slate-200/60';
  }
}

function getRiskColor(risk: number) {
  if (risk < 0.3) return 'text-emerald-600';
  if (risk < 0.7) return 'text-amber-600';
  return 'text-red-600';
}

function getRiskLabel(risk: number) {
  if (risk < 0.3) return 'Low';
  if (risk < 0.7) return 'Medium';
  return 'High';
}

function formatDate(iso: string) {
  if (!iso) return { date: '-', time: '-' };
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return { date, time };
  } catch (e) {
    return { date: iso, time: '' };
  }
}

const DISRUPTION_ID = 'SIM-5AADCC';
const MATERIAL_ID = 'MAT-12';
const PAGE_SIZE = 25;

export default function ScenariosPage() {
  const router = useRouter();
  
  // Data State
  const [data, setData] = useState<ScenarioListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination & Filter State
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Action State
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // View State (distinguish current generation from history)
  const [viewMode, setViewMode] = useState<'ACTIVE' | 'ARCHIVED' | 'ALL'>('ACTIVE');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset page on search change
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadData = useCallback(async (currentPage: number, currentSearch: string, currentView: string, forceResetSelection: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      let statusFilter = undefined;
      if (currentView === 'ACTIVE') statusFilter = 'READY,SIMULATING';
      if (currentView === 'ARCHIVED') statusFilter = 'ARCHIVED';
      
      const res = await fetchScenarios({
        limit: PAGE_SIZE,
        offset: (currentPage - 1) * PAGE_SIZE,
        search: currentSearch || undefined,
        status: statusFilter
      });
      setData(res);
      
      // Auto-select first READY scenario if none selected (or if forced reset)
      if (res.items.length > 0 && (forceResetSelection || !selectedId)) {
        const firstReady = res.items.find(s => s.status === 'READY') || res.items[0];
        setSelectedId(firstReady.id);
      }
    } catch (err) {
      const e = err as Error;
      setError(e.message || 'Unable to load scenarios.');
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => {
    loadData(page, debouncedSearch, viewMode, false);
  }, [page, debouncedSearch, viewMode]); // Note: removing loadData from deps to avoid infinite loops, as selectedId changes.

  // We need to know if there are any active scenarios for this disruption to decide button semantics
  // We can check if total_active > 0 (this is global, not just the page)
  const hasActiveScenarios = data ? data.total_active > 0 : false;

  const handleGenerate = async (force = false) => {
    if (generating) return;
    setGenerating(true);
    setGenerateError(null);
    try {
      await generateScenarios(DISRUPTION_ID, MATERIAL_ID, force);
      setPage(1);
      setSearchQuery('');
      setDebouncedSearch('');
      setSelectedId(null);
      setViewMode('ACTIVE'); // Ensure we see the new active ones
      await loadData(1, '', 'ACTIVE', true); // Force selection reset on reload
    } catch (err) {
      const e = err as Error;
      setGenerateError(e.message || 'Failed to generate scenarios.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectPlan = async (scenario: Scenario) => {
    if (selecting) return;
    setSelecting(true);
    try {
      await updateScenarioStatus(scenario.id, 'SELECTED');
      await createRecoveryPlan(
        scenario.disruption_id,
        MATERIAL_ID,
        scenario.details?.id || scenario.id,
        scenario.id
      );
      router.push('/recovery-plans');
    } catch (err) {
      const e = err as Error;
      setSelecting(false);
      alert(e.message || 'Failed to select recovery plan.');
    }
  };

  const selected = data?.items.find(s => s.id === selectedId) || null;

  // Chart data: since we want to compare the active generation, we should ideally show READY/SIMULATING
  // Because the chart needs actual data points, we'll use the current page's active scenarios.
  // In a real app we might fetch a dedicated chart dataset if the active batch is larger than one page.
  const activeScenarios = useMemo(() => {
    if (!data) return [];
    return data.items.filter(s => s.status === 'READY' || s.status === 'SIMULATING');
  }, [data]);

  const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6'];

  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  return (
    <div className="h-[calc(100vh-theme(spacing.24))] flex flex-col max-w-[1600px] mx-auto w-full font-sans">
      
      {/* HEADER (shrink-0) */}
      <div className="shrink-0 flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Scenarios</h1>
          <p className="text-[13px] text-slate-500 mt-1">Model alternative responses to active supply chain disruptions.</p>
        </div>
        <div className="flex items-center space-x-3">
          {hasActiveScenarios ? (
            <button
              onClick={() => handleGenerate(true)}
              disabled={generating}
              title="Archive current scenarios and generate a fresh set from the recovery engine"
              className="flex items-center px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-[13px] font-medium transition-colors disabled:opacity-50 shadow-sm"
            >
              {generating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Regenerate Scenarios
            </button>
          ) : (
            <button
              onClick={() => handleGenerate(false)}
              disabled={generating}
              className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[13px] font-medium transition-colors disabled:opacity-50"
            >
              {generating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Generate Scenarios
            </button>
          )}
          <button onClick={() => loadData(page, debouncedSearch, viewMode, false)} disabled={loading} className="flex items-center px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[13px] font-medium transition-colors shadow-sm disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="shrink-0 mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center shadow-sm">
          <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
          <div>
            <p className="text-sm font-medium">Unable to load scenario data</p>
            <p className="text-sm opacity-90 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {generateError && (
        <div className="shrink-0 mb-6 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg flex items-center shadow-sm">
          <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium">Scenario generation failed</p>
            <p className="text-sm opacity-90 mt-0.5">{generateError}</p>
          </div>
          <button onClick={() => setGenerateError(null)} className="ml-4 text-amber-600 hover:text-amber-800 text-sm underline">Dismiss</button>
        </div>
      )}

      {!data && loading ? (
        <div className="flex-1 space-y-6">
          <div className="h-24 bg-white border border-slate-200 rounded-xl shadow-sm animate-pulse" />
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 h-[400px] bg-white border border-slate-200 rounded-xl shadow-sm animate-pulse" />
            <div className="xl:col-span-1 h-[400px] bg-white border border-slate-200 rounded-xl shadow-sm animate-pulse" />
          </div>
        </div>
      ) : data?.total === 0 && !searchQuery ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-xl shadow-sm py-32 text-center">
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mb-4">
            <BarChart3 className="w-6 h-6 text-slate-400" />
          </div>
          <h2 className="text-[15px] font-semibold text-slate-900">No scenarios generated</h2>
          <p className="text-[13px] text-slate-500 mt-1.5 max-w-sm mx-auto">Generate recovery scenarios to simulate outcomes and compare alternative strategies.</p>
          <button 
            onClick={() => handleGenerate(false)}
            disabled={generating}
            className="mt-6 flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[13px] font-medium transition-colors disabled:opacity-50"
          >
            {generating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />} Generate Scenarios
          </button>
        </div>
      ) : (
        <div className="flex-1 min-h-0 flex flex-col space-y-6">
          
          {/* KPI STRIP (shrink-0) */}
          <div className="shrink-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mr-3 shrink-0">
                <Activity className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Active Scenarios</p>
                <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">{data?.total_active || 0}</div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mr-3 shrink-0">
                <PlayCircle className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Simulating</p>
                <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">{data?.total_simulating || 0}</div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mr-3 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Ready for Decision</p>
                <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">{data?.total_ready || 0}</div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center mr-3 shrink-0">
                <Hexagon className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Selected</p>
                <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">{data?.total_selected || 0}</div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center lg:col-span-1 md:col-span-2 col-span-2">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center mr-3 shrink-0">
                <TrendingDown className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Est. Exposure</p>
                <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">{formatCurrency(data?.aggregate_sla_exposure || 0)}</div>
              </div>
            </div>
          </div>

          {/* MAIN WORKSPACE (flex-1 min-h-0) */}
          <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-3 gap-6 items-start pb-6">
            
            {/* LEFT: DATA GRID */}
            <div className="xl:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
              <div className="shrink-0 px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="font-semibold text-[15px] text-slate-900">All Scenarios</h3>
                <div className="flex w-full sm:w-auto items-center space-x-2">
                  <select 
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value as any)}
                    className="text-[13px] bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="ACTIVE">Active (Ready/Simulating)</option>
                    <option value="ARCHIVED">Historical (Archived)</option>
                    <option value="ALL">All Scenarios</option>
                  </select>
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search scenarios..." 
                      className="w-full pl-9 pr-4 py-2 text-[13px] bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors placeholder:text-slate-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* TABLE SCROLL AREA */}
              <div className="flex-1 overflow-auto relative">
                {loading && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
                  </div>
                )}
                {data?.items.length ? (
                  <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm">
                      <tr>
                        <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">Scenario ID</th>
                        <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">Name & Disruption</th>
                        <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">Strategy</th>
                        <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 text-right">Recovery</th>
                        <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 text-right">Cost</th>
                        <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 text-right">Risk</th>
                        <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.items.map((scenario) => {
                        const isSelected = scenario.id === selectedId;
                        return (
                          <tr 
                            key={`scenario-row-${scenario.id}`}
                            onClick={() => setSelectedId(scenario.id)}
                            className={`cursor-pointer transition-colors group ${isSelected ? 'bg-indigo-50/30' : 'bg-white hover:bg-slate-50/80'}`}
                          >
                            <td className="px-5 py-4 relative">
                              {isSelected && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-600" />}
                              <div className={`text-[13px] font-mono font-medium ${isSelected ? 'text-indigo-700' : 'text-slate-900'}`}>
                                {scenario.id}
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <div className="text-[13px] font-medium text-slate-900 max-w-[180px] truncate" title={scenario.name}>{scenario.name}</div>
                              <div className="text-[12px] text-slate-500 mt-0.5 font-mono">{scenario.disruption_id}</div>
                            </td>
                            <td className="px-5 py-4">
                              <div className="text-[13px] text-slate-700 max-w-[150px] truncate" title={scenario.strategy}>{scenario.strategy}</div>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <div className="text-[13px] font-mono text-slate-900">{scenario.max_delay_days}d</div>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <div className="text-[13px] font-mono text-slate-900">{formatCurrency(scenario.total_cost)}</div>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <div className="flex flex-col items-end">
                                <div className={`text-[13px] font-mono font-medium ${getRiskColor(scenario.blended_risk)}`}>
                                  {scenario.blended_risk.toFixed(2)}
                                </div>
                                <div className={`text-[10px] uppercase font-bold mt-0.5 ${getRiskColor(scenario.blended_risk)} opacity-80`}>
                                  {getRiskLabel(scenario.blended_risk)}
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-center">
                              <div className={`inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wide font-bold rounded border ${getStatusStyle(scenario.status)}`}>
                                {scenario.status}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : !loading ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center h-full">
                    <Search className="w-6 h-6 text-slate-300 mb-3" />
                    <p className="text-[13px] text-slate-500">No scenarios match your search.</p>
                  </div>
                ) : null}
              </div>
              
              {/* PAGINATION FOOTER */}
              <div className="shrink-0 px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="text-[12px] text-slate-500">
                  Showing <span className="font-medium text-slate-900">{data?.items.length ? (page - 1) * PAGE_SIZE + 1 : 0}</span> to <span className="font-medium text-slate-900">{Math.min(page * PAGE_SIZE, data?.total || 0)}</span> of <span className="font-medium text-slate-900">{data?.total || 0}</span> scenarios
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                    className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[12px] font-medium text-slate-700 px-2">Page {page} of {totalPages}</span>
                  <button 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || loading || !data?.has_more}
                    className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT: INTELLIGENCE PANEL (Anchored, Max Height = Grid Height) */}
            <div className="xl:col-span-1 h-full flex flex-col min-h-0">
              {selected ? (
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col max-h-full overflow-hidden">
                  
                  {/* Header */}
                  <div className="shrink-0 px-5 py-4 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                    <div>
                      <h3 className="text-[15px] font-semibold text-slate-900">{selected.name}</h3>
                      <p className="text-[12px] text-slate-500 mt-1">Mitigating disruption <span className="font-mono text-slate-700 bg-white border border-slate-200 px-1 rounded">{selected.disruption_id}</span></p>
                    </div>
                    <div className={`inline-flex items-center px-2 py-0.5 text-[10px] uppercase font-bold rounded border ${getStatusStyle(selected.status)}`}>
                      {selected.status}
                    </div>
                  </div>
                  
                  {/* Scrollable Details */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    {/* Strategy Overvew */}
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Strategy Overview</div>
                      <div className="text-[13px] text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-3">
                        <span className="font-semibold text-slate-900">{selected.strategy}</span>
                        <p className="mt-1">Involves allocation shift to suppliers: <span className="font-medium">{selected.supplier_id.replace(/,/g, ' + ')}</span>.</p>
                      </div>
                    </div>

                    {/* Line items */}
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Outcome Summary</div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-[13px]">
                          <span className="text-slate-500 flex items-center"><Clock className="w-3.5 h-3.5 mr-2" /> Est. Recovery Time</span>
                          <span className="font-mono font-medium text-slate-900">{selected.max_delay_days} days</span>
                        </div>
                        <div className="flex justify-between items-center text-[13px]">
                          <span className="text-slate-500 flex items-center"><TrendingDown className="w-3.5 h-3.5 mr-2" /> Est. Plan Cost</span>
                          <span className="font-mono font-medium text-slate-900">{formatCurrency(selected.total_cost)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[13px]">
                          <span className="text-slate-500 flex items-center"><AlertCircle className="w-3.5 h-3.5 mr-2" /> SLA Exposure</span>
                          <span className="font-mono font-medium text-red-600">{formatCurrency(selected.total_sla_exposure)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[13px]">
                          <span className="text-slate-500 flex items-center"><ShieldCheck className="w-3.5 h-3.5 mr-2" /> Risk Score</span>
                          <span className={`font-mono font-medium ${getRiskColor(selected.blended_risk)}`}>
                            {selected.blended_risk.toFixed(2)} ({getRiskLabel(selected.blended_risk)})
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* SCENARIO COMPARISON (CHART) */}
                    {activeScenarios.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-slate-100">
                        <div className="mb-4">
                          <h3 className="font-semibold text-[13px] text-slate-900">Active Batch Comparison</h3>
                          <p className="text-[12px] text-slate-500 mt-0.5">Cost vs Recovery Time (Lower is better)</p>
                        </div>
                        <div className="h-[200px] w-full bg-white border border-slate-100 rounded-lg p-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                              <XAxis 
                                type="number" 
                                dataKey="max_delay_days" 
                                name="Recovery Time" 
                                unit="d" 
                                stroke="#94a3b8" 
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                              />
                              <YAxis 
                                type="number" 
                                dataKey="total_cost" 
                                name="Cost" 
                                stroke="#94a3b8" 
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                              />
                              <RechartsTooltip 
                                cursor={{ strokeDasharray: '3 3' }} 
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    const cData = payload[0].payload as Scenario;
                                    return (
                                      <div className="bg-white border border-slate-200 p-2 rounded shadow-lg text-[11px]">
                                        <p className="font-semibold text-slate-900">{cData.name}</p>
                                        <p className="text-slate-600 mt-0.5">Rec: <span className="font-mono text-slate-900">{cData.max_delay_days}d</span></p>
                                        <p className="text-slate-600">Cost: <span className="font-mono text-slate-900">{formatCurrency(cData.total_cost)}</span></p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Scatter name="Scenarios" data={activeScenarios}>
                                {activeScenarios.map((entry, index) => (
                                  <Cell 
                                    key={`chart-cell-${entry.id}`} 
                                    fill={entry.id === selected.id ? '#4f46e5' : '#cbd5e1'} 
                                    r={entry.id === selected.id ? 6 : 4}
                                  />
                                ))}
                              </Scatter>
                            </ScatterChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                    
                    {/* Sub metadata */}
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Created At</span>
                      <span className="font-mono text-slate-600">{formatDate(selected.created_at).date} {formatDate(selected.created_at).time}</span>
                    </div>
                  </div>
                  
                  {/* Action Footer (shrink-0) */}
                  <div className="shrink-0 p-4 bg-slate-50 border-t border-slate-100">
                    <button 
                      onClick={() => handleSelectPlan(selected)}
                      disabled={selected.status !== 'READY' || selecting}
                      className="w-full flex justify-center items-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium text-[13px] shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {selecting ? (
                        <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Creating Recovery Plan...</>
                      ) : (
                        'Select for Recovery Plan'
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50/50 border border-slate-200 border-dashed rounded-xl flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center mb-4 shadow-sm">
                    <ListChecks className="w-4 h-4 text-slate-400" />
                  </div>
                  <h3 className="text-[13px] font-semibold text-slate-900">Select a Scenario</h3>
                  <p className="text-[12px] text-slate-500 mt-1 max-w-[200px]">Select a scenario to view intelligence and comparison metrics.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
