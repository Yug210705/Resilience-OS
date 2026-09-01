import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import NetworkGraph from '../components/network/NetworkGraph';
import ScenarioPanel from '../components/scenario/ScenarioPanel';
import { ShieldCheck, ShieldAlert, Database, Server, Cpu, AlertTriangle, Loader2 } from 'lucide-react';

export default function CommandCenter() {
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  const { data: graphData, isLoading: isLoadingGraph, isError: isErrorGraph } = useQuery({
    queryKey: ['graph'],
    queryFn: api.getGraph,
  });

  const { data: impactData } = useQuery({
    queryKey: ['impact', activeScenarioId],
    queryFn: () => activeScenarioId ? api.getImpact(activeScenarioId) : null,
    enabled: !!activeScenarioId,
  });

  const { data: healthData } = useQuery({
    queryKey: ['health'],
    queryFn: api.getHealth,
    refetchInterval: 30000,
  });

  if (isLoadingGraph) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium tracking-wide">Initializing Supply Chain Graph...</p>
        </div>
      </div>
    );
  }

  if (isErrorGraph || !graphData) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 text-red-600">
        <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
        <p className="font-semibold text-lg tracking-tight text-slate-900">Platform Unavailable</p>
        <p className="text-sm text-slate-500 mt-1">Unable to establish connection to Resilience OS core API.</p>
      </div>
    );
  }

  const isDisrupted = !!impactData && impactData.revenue_at_risk > 0;

  // Connection icon map
  const getIcon = (provider: string) => {
    if (provider.includes('Postgres')) return <Database className="w-3.5 h-3.5" />;
    if (provider.includes('SAP')) return <Server className="w-3.5 h-3.5" />;
    if (provider.includes('AI')) return <Cpu className="w-3.5 h-3.5" />;
    return <Database className="w-3.5 h-3.5" />;
  };

  return (
    <div className="flex h-full w-full flex-col md:flex-row bg-[#F8FAFC]">
      {/* LEFT: Graph Workspace */}
      <div className="flex-1 relative h-full">
        
        {/* Top Left: Operational Status Overlay */}
        <div className="absolute top-4 left-4 z-10 w-72 flex flex-col gap-3">
          
          {/* System Health Card */}
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-200/80">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Operational State</h2>
              {isDisrupted ? (
                <div className="flex items-center gap-1.5 bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-200">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold tracking-wide">AT RISK</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold tracking-wide">HEALTHY</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                <p className="text-slate-500 text-xs font-medium">Revenue At Risk</p>
                <p className={`font-mono text-base tracking-tight font-semibold ${isDisrupted ? 'text-red-600' : 'text-slate-700'}`}>
                  ${(impactData?.revenue_at_risk || 0).toLocaleString()}
                </p>
              </div>
              <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                <p className="text-slate-500 text-xs font-medium">Orders At Risk</p>
                <p className={`font-mono text-base tracking-tight font-semibold ${isDisrupted ? 'text-orange-600' : 'text-slate-700'}`}>
                  {impactData?.delayed_orders || 0}
                </p>
              </div>
              <div className="flex justify-between items-end">
                <p className="text-slate-500 text-xs font-medium">Critical Nodes</p>
                <p className={`font-mono text-base tracking-tight font-semibold ${isDisrupted ? 'text-red-600' : 'text-slate-700'}`}>
                  {impactData?.affected_entities.length || 0}
                </p>
              </div>
            </div>
          </div>
          
          {/* Enterprise Connections Card */}
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-200/80">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Enterprise Connections</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <Database className="w-3.5 h-3.5 text-blue-500" /> PostgreSQL
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_#10b981]"></span>
                  <span className="text-[10px] font-bold text-slate-600 tracking-wide">CONNECTED</span>
                </div>
              </div>
              
              {healthData?.connections.map(conn => {
                const isConnected = conn.status === 'CONFIGURED';
                return (
                  <div key={conn.provider} className="flex items-center justify-between text-xs p-2 rounded bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      {getIcon(conn.provider)} {conn.provider}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 shadow-[0_0_4px_#10b981]' : 'bg-slate-300'}`}></span>
                      <span className={`text-[10px] font-bold tracking-wide ${isConnected ? 'text-slate-600' : 'text-slate-400'}`}>
                        {conn.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <NetworkGraph 
          graphData={graphData} 
          impactData={impactData || null} 
        />
      </div>

      {/* RIGHT: Control Panel */}
      <div className="w-full md:w-[420px] h-full flex flex-col bg-white border-l border-slate-200 shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-10 shrink-0">
        <ScenarioPanel 
          graphData={graphData}
          onScenarioCreated={setActiveScenarioId}
          activeScenarioId={activeScenarioId}
        />
      </div>
    </div>
  );
}
