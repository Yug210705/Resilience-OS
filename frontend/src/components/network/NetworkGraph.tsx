import { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  MarkerType,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { GraphData, ImpactData } from '../../api/types';
import { Box, Factory, Truck, User, AlertCircle } from 'lucide-react';

// Custom Node Component
function EnterpriseNode({ data }: { data: any }) {
  const isDisrupted = data.isDisrupted;
  const isAffected = data.isAffected;
  
  let borderColor = 'border-slate-200';
  let bgColor = 'bg-white';
  let statusBadge = null;
  let shadow = 'shadow-sm';

  if (isDisrupted) {
    borderColor = 'border-red-500';
    bgColor = 'bg-red-50/90';
    shadow = 'shadow-[0_0_15px_rgba(239,68,68,0.2)]';
    statusBadge = (
      <div className="absolute -top-2.5 -right-2.5 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-red-700 flex items-center gap-1">
        <AlertCircle className="w-2.5 h-2.5" /> DISRUPTED
      </div>
    );
  } else if (isAffected) {
    borderColor = 'border-orange-400';
    bgColor = 'bg-orange-50/90';
    shadow = 'shadow-[0_0_15px_rgba(249,115,22,0.15)]';
    statusBadge = (
      <div className="absolute -top-2.5 -right-2.5 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-orange-600">
        AT RISK
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'Supplier': return <Truck className="w-3.5 h-3.5 text-slate-500" />;
      case 'Plant': return <Factory className="w-3.5 h-3.5 text-slate-500" />;
      case 'Customer': return <User className="w-3.5 h-3.5 text-slate-500" />;
      case 'Material': return <Box className="w-3.5 h-3.5 text-slate-500" />;
      default: return <Box className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className={`relative w-[220px] rounded-md border ${borderColor} ${bgColor} ${shadow} p-3 font-sans backdrop-blur-sm`}>
      <Handle type="target" position={Position.Left} className="w-1.5 h-3 rounded-sm bg-slate-300 border-none" />
      
      {statusBadge}
      
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200/60">
        <div className="flex items-center gap-1.5">
          {getIcon(data.type)}
          <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">{data.type}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${isDisrupted ? 'bg-red-500' : isAffected ? 'bg-orange-500' : 'bg-emerald-500'}`}></span>
          <span className="text-[9px] font-bold text-slate-400">
            {isDisrupted ? 'ERR' : isAffected ? 'WARN' : 'OK'}
          </span>
        </div>
      </div>
      
      <div className="font-semibold text-slate-800 text-sm leading-tight truncate">
        {data.label}
      </div>
      <div className="text-[10px] font-mono text-slate-400 mt-1 uppercase">
        {data.id}
      </div>

      <Handle type="source" position={Position.Right} className="w-1.5 h-3 rounded-sm bg-slate-300 border-none" />
    </div>
  );
}

const nodeTypes = {
  enterprise: EnterpriseNode,
};

interface NetworkGraphProps {
  graphData: GraphData;
  impactData: ImpactData | null;
}

export default function NetworkGraph({ graphData, impactData }: NetworkGraphProps) {
  const nodes: Node[] = useMemo(() => {
    const typeX: Record<string, number> = { Supplier: 150, Plant: 550, Customer: 950 };
    const typeCounts: Record<string, number> = { Supplier: 0, Plant: 0, Customer: 0 };

    return graphData.nodes.map((node) => {
      const type = node.type;
      const x = typeX[type] || 550;
      const y = (typeCounts[type] || 0) * 160 + 100;
      typeCounts[type] = (typeCounts[type] || 0) + 1;

      const isAffected = impactData?.affected_entities.includes(node.id) || 
                         impactData?.affected_plants.includes(node.id);
      const isDisrupted = impactData?.affected_entities.includes(node.id) && node.type === 'Supplier';

      return {
        id: node.id,
        position: { x, y },
        type: 'enterprise',
        data: { 
          id: node.id,
          label: node.label,
          type: node.type,
          isAffected,
          isDisrupted
        }
      };
    });
  }, [graphData, impactData]);

  const edges: Edge[] = useMemo(() => {
    return graphData.edges.map((edge) => {
      const isAffected = impactData?.affected_entities.includes(edge.source) || 
                         impactData?.affected_plants.includes(edge.source) ||
                         impactData?.affected_plants.includes(edge.target);

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        animated: isAffected,
        style: { 
          stroke: isAffected ? '#f97316' : '#cbd5e1',
          strokeWidth: isAffected ? 2 : 1.5,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isAffected ? '#f97316' : '#cbd5e1',
        },
      };
    });
  }, [graphData, impactData]);

  return (
    <div className="h-full w-full bg-[#f1f5f9]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={1.5}
        className="font-sans"
        proOptions={{ hideAttribution: true }} // Production removal of dev artifacts
      >
        <Background color="#cbd5e1" gap={24} size={1.5} />
        <Controls 
          className="bg-white border-slate-200 shadow-sm rounded-md overflow-hidden" 
          showInteractive={false}
        />
        {/* Removed minimap for a cleaner enterprise canvas */}
      </ReactFlow>
    </div>
  );
}
