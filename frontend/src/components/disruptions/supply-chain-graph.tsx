'use client';
import { useEffect, useMemo } from 'react';
import { ReactFlow, Controls, Background, Edge, Node, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { useTheme } from 'next-themes';
import { useSimulationStore } from '@/stores/useSimulationStore';

const nodeWidth = 140;
const nodeHeight = 40;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction, nodesep: 30, ranksep: 80 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
    return node;
  });

  return { nodes: layoutedNodes, edges };
};

export function SupplyChainGraph() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { activeDisruption } = useSimulationStore();

  const { layoutedNodes, layoutedEdges } = useMemo(() => {
    if (!activeDisruption) return { layoutedNodes: [], layoutedEdges: [] };

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const edgeSet = new Set<string>();
    
    const getSeverityColor = (riskScore?: number) => {
      if (riskScore === undefined) return 'amber';
      if (riskScore >= 0.8) return 'red';
      if (riskScore >= 0.5) return 'amber';
      if (riskScore >= 0.2) return 'yellow';
      return 'green';
    };

    const getSeverityLabel = (riskScore?: number) => {
      if (riskScore === undefined) return 'High';
      if (riskScore >= 0.8) return 'Critical';
      if (riskScore >= 0.5) return 'High';
      if (riskScore >= 0.2) return 'Medium';
      return 'Low';
    };

    const addNode = (id: string, label: string, color: string, sub: string) => {
      if (!nodes.find(n => n.id === id)) {
        nodes.push({
          id,
          position: { x: 0, y: 0 },
          data: { label, sub, color }
        });
      }
    };

    const addEdge = (source: string, target: string, color: string) => {
      const edgeId = `e-${source}-${target}`;
      if (!edgeSet.has(edgeId)) {
        edgeSet.add(edgeId);
        
        const strokeColor = color === 'red' ? '#ef4444' : color === 'amber' ? '#f59e0b' : color === 'yellow' ? '#eab308' : '#cbd5e1';
        
        edges.push({
          id: edgeId,
          source,
          target,
          style: { stroke: strokeColor, strokeWidth: 2 },
          animated: true
        });
      }
    };

    // Add source disruption node
    if (activeDisruption.disruption) {
      addNode(
        activeDisruption.disruption.affected_entity_id, 
        activeDisruption.disruption.affected_entity_id, 
        'red', 
        'Critical'
      );
    }

    // Process nodes from API arrays (limit to 3 for visual cleanliness per column)
    const layers = [
      { array: activeDisruption.affected_suppliers || [], prefix: '', type: 'SUP' },
      { array: activeDisruption.affected_materials || [], prefix: 'mat-', type: 'MAT' },
      { array: activeDisruption.affected_plants || [], prefix: 'plt-', type: 'PLT' },
      { array: activeDisruption.affected_products || [], prefix: 'prd-', type: 'PRD' },
      { array: activeDisruption.affected_orders || [], prefix: 'ord-', type: 'ORD' },
    ];

    layers.forEach(layer => {
      const topItems = layer.array.slice(0, 3);
      topItems.forEach((item: any) => {
        const id = item.id || item.order_id || item.name;
        if (!id) return;
        
        const risk = item.risk_score || 0.6;
        addNode(
          id, 
          id, 
          getSeverityColor(risk), 
          getSeverityLabel(risk)
        );
      });

      if (layer.array.length > 3) {
        const remaining = layer.array.length - 3;
        nodes.push({
          id: `more-${layer.type}`,
          position: { x: 0, y: 0 },
          data: { label: `+${remaining} more`, sub: '', color: 'none' }
        });
        
        // Add invisible edge to force layout position right below the 3rd item
        if (topItems.length > 0) {
          const lastId = topItems[topItems.length - 1].id || topItems[topItems.length - 1].order_id || topItems[topItems.length - 1].name;
          if (lastId) {
            edges.push({
              id: `e-${lastId}-more-${layer.type}`,
              source: lastId,
              target: `more-${layer.type}`,
              style: { stroke: 'transparent', strokeWidth: 0 },
              animated: false
            });
          }
        }
      }
    });

    // Create edges based on dependency_paths
    if (activeDisruption.dependency_paths && activeDisruption.dependency_paths.length > 0) {
      activeDisruption.dependency_paths.forEach((pathObj: any) => {
        const path = pathObj.path || [];
        for (let i = 0; i < path.length - 1; i++) {
          const source = path[i].id;
          const target = path[i+1].id;
          if (nodes.find(n => n.id === source) && nodes.find(n => n.id === target)) {
            const risk = path[i].risk_score || 0.5;
            addEdge(source, target, getSeverityColor(risk));
          }
        }
      });
    } else {
      // Fallback: Connect columns sequentially if no explicit paths
      for (let i = 0; i < layers.length - 1; i++) {
        const sourceLayer = layers[i].array.slice(0, 3);
        const targetLayer = layers[i+1].array.slice(0, 3);
        
        sourceLayer.forEach((sourceItem: any) => {
          const sourceId = sourceItem.id || sourceItem.order_id || sourceItem.name;
          if (!sourceId) return;
          
          targetLayer.forEach((targetItem: any) => {
             const targetId = targetItem.id || targetItem.order_id || targetItem.name;
             if (!targetId) return;
             // Connect 1st to 1st, 2nd to 2nd etc to keep it clean, or random
             const sIdx = sourceLayer.indexOf(sourceItem);
             const tIdx = targetLayer.indexOf(targetItem);
             if (sIdx === tIdx || (sIdx === 0 && tIdx === 1) || (sIdx === 1 && tIdx === 0)) {
               addEdge(sourceId, targetId, getSeverityColor(sourceItem.risk_score));
             }
          });
        });
      }
    }

    // Apply styles to all nodes
    nodes.forEach(n => {
      const cStr = n.data.color;
      
      if (cStr === 'none') {
        n.style = {
          background: 'transparent',
          border: 'none',
          width: nodeWidth,
          height: 20,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        };
        n.data.label = (
          <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
            {n.data.label as string}
          </div>
        );
        return;
      }

      const borderColor = cStr === 'red' ? '#ef4444' : cStr === 'amber' ? '#f59e0b' : cStr === 'yellow' ? '#eab308' : '#10b981';
      const textColor = cStr === 'red' ? '#ef4444' : cStr === 'amber' ? '#f59e0b' : cStr === 'yellow' ? '#eab308' : '#10b981';
      
      n.style = {
        borderRadius: '8px',
        background: isDark ? '#111827' : '#ffffff',
        border: `1.5px solid ${borderColor}`,
        width: nodeWidth,
        height: nodeHeight,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
      };
      
      n.data.label = (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <span style={{ color: textColor, fontSize: '11px', fontWeight: 800 }}>{n.data.label as string}</span>
          <span style={{ color: textColor, fontSize: '9px', fontWeight: 600 }}>{n.data.sub as string}</span>
        </div>
      );
    });

    if (nodes.length === 0) return { layoutedNodes: [], layoutedEdges: [] };

    const layouted = getLayoutedElements(nodes, edges);
    return { layoutedNodes: layouted.nodes, layoutedEdges: layouted.edges };
  }, [isDark, activeDisruption]);

  if (!activeDisruption) return null;

  return (
    <div className="w-full h-full relative">
      {/* Column Headers matching screenshot */}
      <div className="absolute top-4 left-0 w-full flex justify-between px-12 z-10 pointer-events-none">
        {['SUPPLIERS', 'MATERIALS', 'PLANTS', 'PRODUCTS', 'CUSTOMER ORDERS'].map((col, i) => (
          <div key={i} className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center w-[140px]">
            {col}
          </div>
        ))}
      </div>
      
      <ReactFlow 
        nodes={layoutedNodes} 
        edges={layoutedEdges} 
        fitView 
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2} 
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background color={isDark ? '#334155' : '#e2e8f0'} gap={16} />
        <Controls position="top-left" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg shadow-sm !mt-12 !ml-4" />
      </ReactFlow>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex space-x-4 z-10 pointer-events-none">
        <div className="flex items-center text-[10px] font-bold text-slate-500"><div className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2"></div>Critical</div>
        <div className="flex items-center text-[10px] font-bold text-slate-500"><div className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2"></div>High</div>
        <div className="flex items-center text-[10px] font-bold text-slate-500"><div className="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-2"></div>Medium</div>
        <div className="flex items-center text-[10px] font-bold text-slate-500"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2"></div>Low</div>
      </div>
      <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
        <span className="text-[10px] font-semibold text-slate-500 bg-white/80 dark:bg-[#111827]/80 px-2 py-1 rounded">Showing critical and high impact paths</span>
      </div>
    </div>
  );
}
