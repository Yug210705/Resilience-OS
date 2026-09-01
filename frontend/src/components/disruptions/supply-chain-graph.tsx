'use client';
import { useEffect, useState, useMemo } from 'react';
import { useSimulationStore } from '@/stores/useSimulationStore';
import { ReactFlow, Controls, Background, MarkerType, Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Generates nodes matching the Pitch Deck Slide 1 visual style (Left-to-Right flow)
const generateNodes = (result: any) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  const nodeStyle = (type: 'failed' | 'risk' | 'stable') => {
    const base = { 
      borderRadius: '4px', 
      padding: '10px 15px', 
      width: 160, 
      textAlign: 'center' as const,
      fontFamily: 'sans-serif',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    };
    if (type === 'failed') return { ...base, background: '#fff', border: '2px solid #ef4444', color: '#ef4444' };
    if (type === 'risk') return { ...base, background: '#fff', border: '2px solid #f97316', color: '#f97316' };
    return { ...base, background: '#fff', border: '1px solid #cbd5e1', color: '#64748b' }; // stable
  };

  const edgeStyle = (type: 'failed' | 'risk' | 'stable') => ({
    stroke: type === 'failed' ? '#ef4444' : type === 'risk' ? '#f97316' : '#cbd5e1',
    strokeWidth: 2,
  });

  // Level 0: The Disrupted Supplier
  const sourceId = `${result.disruption.disruption_type}:${result.disruption.affected_entity_id}`;
  nodes.push({
    id: sourceId,
    position: { x: 50, y: 150 },
    data: { 
      label: (
        <div className="flex flex-col items-center">
          <strong className="text-sm uppercase tracking-wide">{result.disruption.affected_entity_id}</strong>
          <span className="text-xs mt-1 font-semibold">FAILED ({result.disruption.duration_days}D)</span>
        </div>
      )
    },
    style: nodeStyle('failed'),
    sourcePosition: 'right' as any,
    targetPosition: 'left' as any,
  });

  // Level 1: Materials (Stockout Risk)
  let matY = 50;
  if (result.affected_materials?.length > 0) {
    result.affected_materials.forEach((m: any, i: number) => {
      const id = `mat:${m.id}`;
      nodes.push({
        id, position: { x: 300, y: matY + (i * 100) },
        data: { 
          label: (
            <div className="flex flex-col items-center">
              <strong className="text-sm uppercase tracking-wide">{m.id}</strong>
              <span className="text-xs mt-1">Stockout Risk</span>
            </div>
          )
        },
        style: nodeStyle('risk'),
        sourcePosition: 'right' as any,
        targetPosition: 'left' as any,
      });
      edges.push({ 
        id: `e-${sourceId}-${id}`, source: sourceId, target: id, 
        style: edgeStyle('failed'), animated: true 
      });
    });
  }

  // Level 2: Plants (Material Risk)
  let plantY = 50;
  if (result.affected_plants?.length > 0) {
    result.affected_plants.forEach((p: any, i: number) => {
      const id = `plt:${p.id}`;
      nodes.push({
        id, position: { x: 550, y: plantY + (i * 120) },
        data: { 
          label: (
            <div className="flex flex-col items-center">
              <strong className="text-sm uppercase tracking-wide">{p.id}</strong>
              <span className="text-xs mt-1">Material Risk</span>
            </div>
          )
        },
        style: nodeStyle('risk'),
        sourcePosition: 'right' as any,
        targetPosition: 'left' as any,
      });
      
      // Connect first material to plants for visual cascade
      if (result.affected_materials?.length > 0) {
        edges.push({ 
          id: `e-mat-${i}-${id}`, source: `mat:${result.affected_materials[0].id}`, target: id, 
          style: edgeStyle('risk'), animated: true 
        });
      }
    });
  }

  // Level 3: Products/Orders (Delayed / At Risk)
  let ordY = 50;
  if (result.affected_orders?.length > 0) {
    const displayOrders = result.affected_orders.slice(0, 3);
    displayOrders.forEach((o: any, i: number) => {
      const id = `ord:${o.order_id}`;
      nodes.push({
        id, position: { x: 800, y: ordY + (i * 100) },
        data: { 
          label: (
            <div className="flex flex-col items-center">
              <strong className="text-sm uppercase tracking-wide">ORDER {o.order_id.split('-')[1]}</strong>
              <span className="text-xs mt-1">SLA At Risk</span>
            </div>
          )
        },
        style: nodeStyle('failed'),
        sourcePosition: 'right' as any,
        targetPosition: 'left' as any,
      });
      
      if (result.affected_plants?.length > 0) {
        edges.push({ 
          id: `e-plt-${i}-${id}`, source: `plt:${result.affected_plants[0].id}`, target: id, 
          style: edgeStyle('risk'), animated: true 
        });
      }
    });
  }

  return { nodes, edges };
};

export function SupplyChainGraph() {
  const { activeDisruption } = useSimulationStore();
  
  const { nodes, edges } = useMemo(() => {
    if (!activeDisruption) return { nodes: [], edges: [] };
    return generateNodes(activeDisruption);
  }, [activeDisruption]);

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm h-[600px] flex flex-col">
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-slate-900">Live Supply Chain Network Map</h3>
          <p className="text-xs text-slate-500">Left-to-right dependency cascade</p>
        </div>
        <div className="flex items-center space-x-4 text-xs font-medium text-slate-500">
          <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2"></span>Failure</div>
          <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 mr-2"></span>Impacted</div>
          <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-slate-300 mr-2"></span>Stable</div>
        </div>
      </div>
      <div className="flex-1 relative">
        <ReactFlow nodes={nodes} edges={edges} fitView minZoom={0.2} maxZoom={2}>
          <Background color="#f1f5f9" gap={20} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
