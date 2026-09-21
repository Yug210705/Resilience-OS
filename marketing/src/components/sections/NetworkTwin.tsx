"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const TWIN_NODES = [
  // Stage 1: Tier 2 (Raw Materials)
  { id: "t2_1", label: "Supplier", x: 5, y: 15, stage: 1, type: "tier2", status: "normal" },
  { id: "t2_2", label: "Supplier", x: 5, y: 35, stage: 1, type: "tier2", status: "normal" },
  { id: "t2_3", label: "Supplier", x: 5, y: 65, stage: 1, type: "tier2", status: "normal" },
  { id: "t2_4", label: "Supplier", x: 5, y: 85, stage: 1, type: "tier2", status: "normal" },
  
  // Stage 2: Tier 1 (Components)
  { id: "t1_1", label: "Tier 1 Hub", x: 25, y: 25, stage: 2, type: "tier1", status: "normal" },
  { id: "t1_2", label: "Tier 1 Hub (Disrupted)", x: 25, y: 50, stage: 2, type: "tier1", status: "disrupted" },
  { id: "t1_3", label: "Tier 1 Hub", x: 25, y: 75, stage: 2, type: "tier1", status: "normal" },
  
  // Stage 3: Plants (Assembly)
  { id: "p1", label: "Plant Alpha", x: 50, y: 35, stage: 3, type: "plant", status: "normal" },
  { id: "p2", label: "Plant Beta (At Risk)", x: 50, y: 65, stage: 3, type: "plant", status: "at_risk" },
  
  // Stage 4: DCs (Distribution)
  { id: "dc1", label: "DC-EU", x: 75, y: 20, stage: 4, type: "dc", status: "normal" },
  { id: "dc2", label: "DC-NA", x: 75, y: 50, stage: 4, type: "dc", status: "normal" },
  { id: "dc3", label: "DC-APAC (At Risk)", x: 75, y: 80, stage: 4, type: "dc", status: "at_risk" },
  
  // Stage 5: Customers
  { id: "c1", label: "Customer", x: 95, y: 10, stage: 5, type: "customer", status: "normal" },
  { id: "c2", label: "Customer", x: 95, y: 30, stage: 5, type: "customer", status: "normal" },
  { id: "c3", label: "Customer", x: 95, y: 50, stage: 5, type: "customer", status: "normal" },
  { id: "c4", label: "Customer (Impacted)", x: 95, y: 70, stage: 5, type: "customer", status: "at_risk" },
  { id: "c5", label: "Customer (Impacted)", x: 95, y: 90, stage: 5, type: "customer", status: "at_risk" },
];

const TWIN_EDGES = [
  // Stage 1 -> 2
  { source: "t2_1", target: "t1_1", stage: 1, status: "normal" },
  { source: "t2_2", target: "t1_1", stage: 1, status: "normal" },
  { source: "t2_2", target: "t1_2", stage: 1, status: "normal" },
  { source: "t2_3", target: "t1_2", stage: 1, status: "normal" },
  { source: "t2_3", target: "t1_3", stage: 1, status: "normal" },
  { source: "t2_4", target: "t1_3", stage: 1, status: "normal" },
  // Stage 2 -> 3
  { source: "t1_1", target: "p1", stage: 2, status: "normal" },
  { source: "t1_2", target: "p1", stage: 2, status: "normal" }, // Buffer absorbed this
  { source: "t1_2", target: "p2", stage: 2, status: "disrupted" }, // Cascading failure
  { source: "t1_3", target: "p2", stage: 2, status: "normal" },
  // Stage 3 -> 4
  { source: "p1", target: "dc1", stage: 3, status: "normal" },
  { source: "p1", target: "dc2", stage: 3, status: "normal" },
  { source: "p2", target: "dc2", stage: 3, status: "normal" }, // Buffer absorbed this
  { source: "p2", target: "dc3", stage: 3, status: "at_risk" }, // Cascading failure
  // Stage 4 -> 5
  { source: "dc1", target: "c1", stage: 4, status: "normal" },
  { source: "dc1", target: "c2", stage: 4, status: "normal" },
  { source: "dc2", target: "c2", stage: 4, status: "normal" },
  { source: "dc2", target: "c3", stage: 4, status: "normal" },
  { source: "dc2", target: "c4", stage: 4, status: "normal" },
  { source: "dc3", target: "c4", stage: 4, status: "at_risk" },
  { source: "dc3", target: "c5", stage: 4, status: "at_risk" },
];

export default function NetworkTwin() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Path drawing animations (Cascading through 4 routing stages)
  const path1 = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);
  const path2 = useTransform(scrollYProgress, [0.25, 0.4], [0, 1]);
  const path3 = useTransform(scrollYProgress, [0.4, 0.55], [0, 1]);
  const path4 = useTransform(scrollYProgress, [0.55, 0.7], [0, 1]);

  // Node highlight opacities (Lighting up as data reaches them)
  const node1 = useTransform(scrollYProgress, [0.05, 0.15], [0.3, 1]);
  const node2 = useTransform(scrollYProgress, [0.2, 0.3], [0.3, 1]);
  const node3 = useTransform(scrollYProgress, [0.35, 0.45], [0.3, 1]);
  const node4 = useTransform(scrollYProgress, [0.5, 0.6], [0.3, 1]);
  const node5 = useTransform(scrollYProgress, [0.65, 0.75], [0.3, 1]);

  const getPathProgress = (stage: number) => {
    if (stage === 1) return path1;
    if (stage === 2) return path2;
    if (stage === 3) return path3;
    return path4;
  };

  const getNodeOpacity = (stage: number) => {
    if (stage === 1) return node1;
    if (stage === 2) return node2;
    if (stage === 3) return node3;
    if (stage === 4) return node4;
    return node5;
  };

  const getBezierPath = (source: typeof TWIN_NODES[0], target: typeof TWIN_NODES[0]) => {
    const dx = target.x - source.x;
    return `M ${source.x} ${source.y} C ${source.x + dx / 2} ${source.y}, ${source.x + dx / 2} ${target.y}, ${target.x} ${target.y}`;
  };

  return (
    <section id="network" ref={containerRef} className="relative h-[500vh] bg-transparent w-full mt-32 md:mt-64 mb-32">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center pt-24 pb-6 md:pb-8 px-6 md:px-12 lg:px-24">
        
        <div className="max-w-4xl mx-auto text-center shrink-0 mb-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif italic text-white mb-3 md:mb-4">
            Map every dependency.
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto font-light leading-relaxed">
            Scroll to trace the physical flow of goods across the digital twin, and instantly spot the blast radius of any disruption.
          </p>
        </div>

        <div className="relative w-full max-w-6xl mx-auto flex-1 min-h-0 border border-white/10 rounded-3xl bg-black/60 backdrop-blur-2xl p-4 md:p-8 overflow-x-auto shadow-[0_0_100px_rgba(0,0,0,0.8)] hide-scrollbar">
          <div className="min-w-[600px] lg:min-w-0 w-full h-full relative">
          
          {/* Tech Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#000_100%)] pointer-events-none" />

          {/* Base inactive paths */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {TWIN_EDGES.map((edge, i) => {
              const source = TWIN_NODES.find(n => n.id === edge.source)!;
              const target = TWIN_NODES.find(n => n.id === edge.target)!;
              return (
                <path
                  key={`base-${i}`}
                  d={getBezierPath(source, target)}
                  fill="none"
                  strokeWidth="0.15"
                  className="stroke-white/10"
                />
              );
            })}
          </svg>

          {/* Animated active paths */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {TWIN_EDGES.map((edge, i) => {
              const source = TWIN_NODES.find(n => n.id === edge.source)!;
              const target = TWIN_NODES.find(n => n.id === edge.target)!;
              
              let strokeColor = "stroke-brand";
              let strokeDasharray = "none";
              
              if (edge.status === "disrupted") {
                strokeColor = "stroke-red-500";
                strokeDasharray = "1 1";
              } else if (edge.status === "at_risk") {
                strokeColor = "stroke-yellow-400";
                strokeDasharray = "1.5 1.5";
              }

              return (
                <motion.path
                  key={`active-${i}`}
                  d={getBezierPath(source, target)}
                  fill="none"
                  strokeWidth="0.4"
                  strokeDasharray={strokeDasharray}
                  className={strokeColor}
                  style={{ pathLength: getPathProgress(edge.stage) }}
                />
              );
            })}
          </svg>

          {/* Nodes */}
          {TWIN_NODES.map((node) => {
            const isPlant = node.type === "plant";
            
            // Determine colors based on status
            let dotColorClass = "bg-black border-white/60";
            let labelColorClass = "text-white/50 border-white/5";
            let pulseColor = "";
            let shadowClass = "shadow-[0_0_10px_rgba(255,255,255,0.1)]";

            if (isPlant) {
              dotColorClass = "bg-black border-brand";
              labelColorClass = "text-brand border-brand/20 font-bold";
              pulseColor = "border-brand/30";
              shadowClass = "shadow-[0_0_20px_rgba(255,159,104,0.6)]";
            } else if (node.type === "customer" || node.type === "tier2") {
              dotColorClass = "bg-black border-white/40";
            }

            // Overrides for disrupted/at-risk nodes
            if (node.status === "disrupted") {
              dotColorClass = "bg-red-500/20 border-red-500";
              labelColorClass = "text-red-400 border-red-500/30 font-bold";
              pulseColor = "border-red-500/50";
              shadowClass = "shadow-[0_0_20px_rgba(239,68,68,0.7)]";
            } else if (node.status === "at_risk") {
              dotColorClass = "bg-yellow-500/20 border-yellow-400";
              labelColorClass = "text-yellow-400 border-yellow-400/30 font-bold";
              pulseColor = "border-yellow-400/50";
              shadowClass = "shadow-[0_0_20px_rgba(250,204,21,0.6)]";
            }

            return (
              <motion.div
                key={node.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 z-10"
                style={{ 
                  left: `${node.x}%`, 
                  top: `${node.y}%`,
                  opacity: getNodeOpacity(node.stage)
                }}
              >
                <div className="relative flex items-center justify-center">
                  {(isPlant || node.status !== "normal") && (
                    <div className={cn("absolute w-8 h-8 rounded-full border animate-[ping_3s_linear_infinite]", pulseColor)} />
                  )}
                  <div className={cn(
                    "rounded-full flex items-center justify-center border-2",
                    isPlant || node.status !== "normal" ? "w-4 h-4" : (node.type === "customer" || node.type === "tier2" ? "w-2 h-2" : "w-3 h-3"),
                    dotColorClass,
                    shadowClass
                  )}>
                    {(isPlant || node.status !== "normal") && (
                      <div className={cn("w-1.5 h-1.5 rounded-full", node.status === "disrupted" ? "bg-red-500" : (node.status === "at_risk" ? "bg-yellow-400" : "bg-brand"))} />
                    )}
                  </div>
                </div>
                
                <span className={cn(
                  "text-[8px] tracking-[0.2em] uppercase bg-black/80 px-1.5 py-0.5 rounded backdrop-blur-md border",
                  labelColorClass,
                  node.status !== "normal" ? "whitespace-nowrap z-20" : ""
                )}>
                  {node.label}
                </span>
              </motion.div>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}
