'use client';
import { useEffect, useState, useMemo } from 'react';
import { useSimulationStore } from '@/stores/useSimulationStore';
import { ReactFlow, Controls, Background, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// A simple layout function for demonstration (real app would use dagre)
const generateNodes = (result: any) => {
  const nodes: any[] = [];
  const edges: any[] = [];
  
  // Create a simplified top-down layout based on dependency paths
  // Root node
  nodes.push({
    id: `${result.disruption.disruption_type}:${result.disruption.affected_entity_id}`,
    position: { x: 400, y: 50 },
    data: { label: `${result.disruption.disruption_type.toUpperCase()}
${result.disruption.affected_entity_id}` },
    style: { background: '#fee2e2', border: '2px solid #ef4444', color: '#7f1d1d', fontWeight: 'bold', width: 150, textAlign: 'center' }
  });

  // Just render the impacted entities in layers to simulate a cascade
  let yOffset = 150;
  
  if (result.affected_materials?.length > 0) {
    result.affected_materials.forEach((m: any, i: number) => {
      nodes.push({
        id: `mat:${m.id}`, position: { x: 200 + (i * 200), y: yOffset },
        data: { label: `MATERIAL
${m.id}` },
        style: { background: '#ffedd5', border: '1px solid #f97316', width: 150, textAlign: 'center' }
      });
      edges.push({ id: `e-mat-${i}`, source: `${result.disruption.disruption_type}:${result.disruption.affected_entity_id}`, target: `mat:${m.id}`, animated: true, style: { stroke: '#ef4444', strokeWidth: 2 } });
    });
    yOffset += 120;
  }

  if (result.affected_plants?.length > 0) {
    result.affected_plants.forEach((p: any, i: number) => {
      nodes.push({
        id: `plt:${p.id}`, position: { x: 200 + (i * 200), y: yOffset },
        data: { label: `PLANT
${p.id}` },
        style: { background: '#e0e7ff', border: '1px solid #4f46e5', width: 150, textAlign: 'center' }
      });
      if (result.affected_materials?.length > 0) {
        edges.push({ id: `e-plt-${i}`, source: `mat:${result.affected_materials[0].id}`, target: `plt:${p.id}`, animated: true, style: { stroke: '#ef4444', strokeWidth: 2 } });
      }
    });
    yOffset += 120;
  }

  if (result.affected_orders?.length > 0) {
    const displayOrders = result.affected_orders.slice(0, 3);
    displayOrders.forEach((o: any, i: number) => {
      nodes.push({
        id: `ord:${o.order_id}`, position: { x: 200 + (i * 200), y: yOffset },
        data: { label: `ORDER
${o.order_id}` },
        style: { background: '#fce7f3', border: '1px solid #db2777', width: 150, textAlign: 'center' }
      });
      if (result.affected_plants?.length > 0) {
        edges.push({ id: `e-ord-${i}`, source: `plt:${result.affected_plants[0].id}`, target: `ord:${o.order_id}`, animated: true, style: { stroke: '#ef4444', strokeWidth: 2 } });
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
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
        <h3 className="font-semibold text-slate-900">Dependency Cascade Graph</h3>
        <p className="text-xs text-slate-500">Visualizing downstream impact flow</p>
      </div>
      <div className="flex-1 relative">
        <ReactFlow nodes={nodes} edges={edges} fitView minZoom={0.5} maxZoom={2}>
          <Background color="#ccc" gap={16} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
