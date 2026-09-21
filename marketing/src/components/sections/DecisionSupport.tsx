"use client";

import { AlertCircle, ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function DecisionSupport() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const opacity1 = useTransform(scrollYProgress, [0, 0.3], [0.1, 1]);
  const opacity2 = useTransform(scrollYProgress, [0.1, 0.5], [0.1, 1]);

  return (
    <section ref={containerRef} className="py-32 w-full overflow-hidden bg-transparent">
      <div className="w-full px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <motion.div>
            <motion.h2 style={{ opacity: opacity1 }} className="text-3xl sm:text-4xl md:text-6xl font-serif italic text-white mb-4 md:mb-6">
              From signal to impact.
            </motion.h2>
            <motion.p style={{ opacity: opacity2 }} className="text-lg md:text-xl text-white/70 mb-10 md:mb-12 font-light">
              Don&apos;t just detect risk. Evaluate what to do next with AI-assisted resolution paths.
            </motion.p>
            
            <ul className="space-y-8">
              <li className="flex items-start gap-6 group">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center shrink-0 group-hover:border-brand transition-colors">
                  <span className="text-xs font-mono text-white/50 group-hover:text-brand">01</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Detect Anomaly</h4>
                  <p className="text-sm text-white/50">Port congestion detected in Shanghai. ETA delayed by 4 days.</p>
                </div>
              </li>
              <li className="flex items-start gap-6 group">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center shrink-0 group-hover:border-brand transition-colors">
                  <span className="text-xs font-mono text-white/50 group-hover:text-brand">02</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Trace Downstream Impact</h4>
                  <p className="text-sm text-white/50">14 shipments, 3 warehouses, and 2 major customer groups affected.</p>
                </div>
              </li>
              <li className="flex items-start gap-6 group">
                <div className="w-10 h-10 rounded-full bg-brand/20 border border-brand text-brand flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,159,104,0.3)]">
                  <span className="text-xs font-mono">03</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Evaluate Resolutions</h4>
                  <p className="text-sm text-white/50">Compare rerouting, expediting, or inventory reallocation.</p>
                </div>
              </li>
            </ul>
          </motion.div>

          <motion.div 
            className="relative rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 md:p-12 shadow-2xl"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
              <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
              <h3 className="text-xs md:text-sm font-medium tracking-widest text-white uppercase">PORT CONGESTION DETECTED</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="p-4 md:p-5 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-[9px] md:text-[10px] tracking-widest text-white/40 uppercase mb-1 md:mb-2">Route</p>
                <p className="text-sm md:text-base font-bold text-white">Shanghai → Mumbai</p>
              </div>
              <div className="p-4 md:p-5 rounded-2xl bg-red-500/10 border border-red-500/20">
                <p className="text-[9px] md:text-[10px] tracking-widest text-red-400 uppercase mb-1 md:mb-2">Potential Impact</p>
                <p className="text-sm md:text-base font-bold text-red-400">14 Shipments Delayed</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-brand/30 bg-brand/10 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h4 className="text-base font-bold text-white">Resolution Plan Active</h4>
                <span className="text-[10px] tracking-widest font-bold text-brand uppercase border border-brand/30 px-3 py-1.5 rounded-full">REROUTE</span>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">Diverting 8 critical shipments to alternate port. Cost implication: <span className="text-white font-mono">$12.4K</span>. Delay saved: <span className="text-white font-mono">3 days</span>.</p>
            </div>

            <button className="w-full py-4 rounded-full bg-[#FF9F68] text-black text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-3 shadow-lg shadow-[#FF9F68]/20">
              Simulate Impact <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
