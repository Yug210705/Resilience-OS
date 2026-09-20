"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const NODES = [
  { id: "supplier", x: 10, y: 50, label: "SUPPLIER" },
  { id: "factory", x: 35, y: 20, label: "FACTORY" },
  { id: "port_a", x: 50, y: 70, label: "PORT A" },
  { id: "vessel", x: 70, y: 40, label: "VESSEL" },
  { id: "warehouse", x: 90, y: 80, label: "WAREHOUSE" },
];

const EDGES = [
  { id: "e1", from: "supplier", to: "factory" },
  { id: "e2", from: "factory", to: "port_a" },
  { id: "e3", from: "port_a", to: "vessel" },
  { id: "e4", from: "vessel", to: "warehouse" },
];

export default function NetworkAnimation() {
  const prefersReducedMotion = useReducedMotion();
  const [disrupted, setDisrupted] = useState(false);
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setDisrupted(true);
      setTimeout(() => setRecovering(true), 2000);
      setTimeout(() => {
        setDisrupted(false);
        setRecovering(false);
      }, 5000);
    }, 8000);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className="w-full h-full border border-border/50 rounded-xl bg-surface/50 flex items-center justify-center">
        <span className="text-muted text-sm tracking-widest">NETWORK TOPOLOGY</span>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video md:aspect-[21/9] border border-border/50 rounded-xl bg-surface/30 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Edges */}
        {EDGES.map((edge) => {
          const fromNode = NODES.find((n) => n.id === edge.from)!;
          const toNode = NODES.find((n) => n.id === edge.to)!;
          
          const isDisruptedEdge = disrupted && edge.id === "e3";
          const isRecoveryEdge = recovering && edge.id === "e3";

          return (
            <motion.path
              key={edge.id}
              d={`M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`}
              fill="none"
              strokeWidth="0.5"
              className={cn(
                "transition-colors duration-1000",
                isDisruptedEdge && !recovering ? "stroke-red-500/50" : 
                isRecoveryEdge ? "stroke-brand/50" : "stroke-border"
              )}
            />
          );
        })}

        {/* Data Packets */}
        {!disrupted && !recovering && (
          <motion.circle
            r="1"
            className="fill-brand"
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ offsetPath: `path("M ${NODES[0].x} ${NODES[0].y} L ${NODES[1].x} ${NODES[1].y}")` }}
          />
        )}
      </svg>

      {/* Nodes */}
      {NODES.map((node) => {
        const isDisruptedNode = disrupted && node.id === "port_a";
        const isRecoveryNode = recovering && node.id === "port_a";
        
        return (
          <div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <motion.div
              className={cn(
                "w-3 h-3 rounded-full border border-background transition-colors duration-1000",
                isDisruptedNode && !recovering ? "bg-red-500" :
                isRecoveryNode ? "bg-brand" : "bg-foreground"
              )}
              animate={isDisruptedNode && !recovering ? { scale: [1, 1.5, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
            <span className="text-[10px] tracking-widest text-muted font-medium bg-background/80 px-1 rounded">
              {node.label}
            </span>
          </div>
        );
      })}

      {/* Status Banner */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10 glass px-4 py-2 rounded-lg">
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", disrupted && !recovering ? "bg-red-500 animate-pulse" : recovering ? "bg-brand animate-pulse" : "bg-green-500")} />
          <span className="text-xs font-mono uppercase tracking-widest">
            {disrupted && !recovering ? "PORT DELAY DETECTED" : recovering ? "REROUTING CARGO" : "NETWORK OPTIMAL"}
          </span>
        </div>
      </div>
    </div>
  );
}
