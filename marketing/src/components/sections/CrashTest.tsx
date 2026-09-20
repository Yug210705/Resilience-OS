"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Package, Clock, TrendingUp, CheckCircle2 } from "lucide-react";

const PATHS = [
  {
    name: "PATH A",
    desc: "Alternate supplier",
    cost: "$61K",
    delay: "+1.2 days",
    risk: "Low",
    recommended: true,
  },
  {
    name: "PATH B",
    desc: "Inventory reallocation",
    cost: "$18K",
    delay: "+3.4 days",
    risk: "Medium",
    recommended: false,
  },
  {
    name: "PATH C",
    desc: "Route + supplier change",
    cost: "$42K",
    delay: "+2.1 days",
    risk: "Medium",
    recommended: false,
  },
];

export default function CrashTest() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // We make the section 500vh tall to create a much longer, relaxed scroll timeline
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  // Impact panel fades in
  const impactOpacity = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);
  const impactX = useTransform(scrollYProgress, [0.1, 0.25], [-50, 0]);

  // Recovery panel fades in
  const recoveryOpacity = useTransform(scrollYProgress, [0.35, 0.5], [0, 1]);
  const recoveryX = useTransform(scrollYProgress, [0.35, 0.5], [50, 0]);

  // Recommended path pops out at the end
  const recommendedScale = useTransform(scrollYProgress, [0.6, 0.75], [1, 1.05]);
  const recommendedGlow = useTransform(scrollYProgress, [0.6, 0.75], ["0px 0px 0px rgba(255,159,104,0)", "0px 0px 30px rgba(255,159,104,0.3)"]);

  return (
    <section ref={containerRef} className="relative h-[500vh] w-full bg-transparent mt-32 md:mt-64 mb-32">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center pt-12 md:pt-16 px-4 md:px-8 lg:px-12">
        
        <div className="w-full max-w-5xl flex flex-col items-center">
          <div className="text-center mb-4 md:mb-6">
            <h2 className="text-4xl md:text-5xl font-serif italic text-white mb-4">
              Crash-test your supply chain.
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto font-sans font-light">
              Scroll to model disruption scenarios, trace downstream impact, and compare recovery strategies before committing to a decision.
            </p>
          </div>

          <div className="w-full border border-white/10 rounded-2xl bg-black/60 backdrop-blur-2xl overflow-hidden shadow-2xl shrink-0">
            <div className="border-b border-white/10 bg-white/5 p-3 md:p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                <span className="text-[10px] font-medium tracking-widest text-red-400 uppercase">
                  Simulation Active
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              
              {/* Impact Panel */}
              <motion.div style={{ opacity: impactOpacity, x: impactX }}>
                <div className="mb-6">
                  <h3 className="text-2xl font-serif italic text-white mb-1">Primary Supplier</h3>
                  <p className="text-red-400 font-bold text-sm tracking-wide uppercase">Offline for 14 Days</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <Package className="w-5 h-5 text-brand" />
                    <div>
                      <p className="text-xl font-bold text-white leading-tight">18,420</p>
                      <p className="text-[10px] text-white/50 tracking-widest uppercase mt-0.5">Orders at risk</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <Clock className="w-5 h-5 text-brand" />
                    <div>
                      <p className="text-xl font-bold text-white leading-tight">11 Days</p>
                      <p className="text-[10px] text-white/50 tracking-widest uppercase mt-0.5">Inventory runway</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <TrendingUp className="w-5 h-5 text-brand" />
                    <div>
                      <p className="text-xl font-bold text-white leading-tight">37</p>
                      <p className="text-[10px] text-white/50 tracking-widest uppercase mt-0.5">Shipments affected</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Recovery Panel */}
              <motion.div style={{ opacity: recoveryOpacity, x: recoveryX }}>
                <h4 className="text-[10px] text-white/50 tracking-widest uppercase mb-4">Recovery Paths</h4>
                <div className="space-y-3">
                  {PATHS.map((path) => (
                    <motion.div 
                      key={path.name} 
                      style={path.recommended ? { scale: recommendedScale, boxShadow: recommendedGlow } : {}}
                      className={`p-4 rounded-xl border ${path.recommended ? "border-brand bg-brand/10 relative z-10" : "border-white/10 bg-white/5"}`}
                    >
                      {path.recommended && (
                        <div className="mb-2 text-[10px] tracking-widest text-brand uppercase flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3" /> Recommended
                        </div>
                      )}
                      <h5 className="text-base font-bold text-white mb-0.5">{path.name}</h5>
                      <p className="text-xs text-white/60 mb-3">{path.desc}</p>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-[9px] text-white/40 tracking-widest uppercase mb-0.5">Cost</p>
                          <p className="text-xs font-mono text-white">{path.cost}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-white/40 tracking-widest uppercase mb-0.5">Delay</p>
                          <p className="text-xs font-mono text-white">{path.delay}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-white/40 tracking-widest uppercase mb-0.5">Risk</p>
                          <p className="text-xs font-mono text-white">{path.risk}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
