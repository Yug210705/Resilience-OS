"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Activity, Globe2, ShieldAlert } from "lucide-react";
import { useState, useEffect } from "react";

export default function Hero() {
  const productUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000/command-center";

  const [textIndex, setTextIndex] = useState(0);
  const fullText = "> Generating recovery path...\n> Rerouting Supplier B cargo through Port 4.\n> Delay: +1.2 days | Cost impact: $61K.\n> Proceed?";
  
  useEffect(() => {
    if (textIndex < fullText.length) {
      // Slowed down typing effect from 30ms to 50ms
      const timeout = setTimeout(() => setTextIndex(prev => prev + 1), 50);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => setTextIndex(0), 4000);
      return () => clearTimeout(timeout);
    }
  }, [textIndex, fullText.length]);

  return (
    <section className="relative min-h-[100vh] w-full flex flex-col items-center justify-start pt-32 md:pt-40 pb-20 overflow-hidden bg-transparent">
      
      {/* Dynamic Lighting Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand/20 rounded-[100%] blur-[120px] pointer-events-none opacity-60" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-white/5 rounded-[100%] blur-[100px] pointer-events-none" />

      {/* Grid Overlay for Tech Vibe */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="w-full px-6 md:px-12 lg:px-24 z-10 flex flex-col items-center relative">
        
        {/* Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
            </span>
            <span className="text-white/80 text-xs font-bold tracking-widest uppercase">
              LinqChain Intelligence Layer 2.0
            </span>
          </div>
        </motion.div>

        {/* Headlines */}
        <motion.div 
          className="max-w-6xl w-full text-center flex flex-col items-center justify-center mb-6 md:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        >
          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[7rem] font-sans font-semibold tracking-tighter text-white leading-none mb-2 md:mb-2 text-balance drop-shadow-2xl">
            The operating system
          </h1>
          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[7.5rem] font-serif italic text-brand tracking-tighter leading-none text-balance drop-shadow-2xl pr-0 md:pr-4">
            for your supply chain.
          </h1>
        </motion.div>

        {/* Subtitle & CTAs */}
        <motion.div
          className="max-w-2xl text-center w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.4 }}
        >
          <p className="text-base sm:text-lg md:text-xl text-white/70 font-light tracking-wide text-balance leading-relaxed mb-8 md:mb-10 px-4 md:px-0">
            See the physical network in real-time. Simulate cascading disruptions. Let AI map your fastest path to recovery.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-6 sm:px-0">
            <Link
              href="/login"
              className="w-full sm:w-auto group flex items-center justify-center gap-3 text-sm font-bold bg-[#FF9F68] text-black px-10 py-4 rounded-full hover:bg-white transition-all duration-300 shadow-[0_0_40px_rgba(255,159,104,0.3)]"
            >
              Start simulating
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#how-it-works"
              className="w-full sm:w-auto group flex items-center justify-center gap-3 text-sm font-bold bg-black/40 border border-white/20 text-white px-10 py-4 rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-md hover:border-white/40"
            >
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <Play className="w-3 h-3 fill-white ml-0.5" />
              </div>
              Watch demo
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="w-full max-w-6xl mt-12 md:mt-24 px-4 md:px-6 relative z-10 perspective-[2000px]"
        initial={{ opacity: 0, y: 150, rotateX: 20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
      >
        <div className="w-full min-h-[280px] sm:min-h-[350px] md:min-h-[450px] lg:min-h-[500px] rounded-t-3xl border border-white/20 bg-black/50 backdrop-blur-3xl shadow-[0_-20px_80px_rgba(0,0,0,0.8)] overflow-hidden relative flex flex-col">
          {/* Mockup Header */}
          <div className="h-10 md:h-12 border-b border-white/10 bg-white/5 flex items-center px-4 md:px-6 gap-4 shrink-0">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="w-px h-4 bg-white/10 mx-2" />
            <span className="text-[10px] md:text-xs font-mono text-white/40">LinqChain Command Center</span>
          </div>
          {/* Mockup Body - Abstract UI */}
          <div className="flex-1 p-3 sm:p-4 md:p-8 flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-8 overflow-hidden">
            <div className="w-full md:w-64 flex flex-col gap-3 sm:gap-4 shrink-0">
              <div className="flex flex-row gap-3 sm:gap-4 w-full">
                <div className="flex-1 h-16 sm:h-20 md:h-24 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-center px-3 md:px-6 shrink-0">
                  <p className="text-[8px] md:text-[10px] text-white/40 tracking-widest uppercase mb-1">Risk Score</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl md:text-3xl font-mono text-brand">42</span>
                    <Activity className="w-3 h-3 md:w-4 md:h-4 text-brand mb-1.5" />
                  </div>
                </div>
                <div className="flex-1 h-16 sm:h-20 md:h-24 rounded-xl sm:rounded-2xl bg-red-500/10 border border-red-500/20 flex flex-col justify-center px-3 md:px-6 shrink-0">
                  <p className="text-[8px] md:text-[10px] text-red-400 tracking-widest uppercase mb-1">Disruptions</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl md:text-3xl font-mono text-red-400">3</span>
                    <ShieldAlert className="w-3 h-3 md:w-4 md:h-4 text-red-400 mb-1.5" />
                  </div>
                </div>
              </div>
              <div className="w-full min-h-[80px] sm:min-h-[100px] md:min-h-0 md:flex-1 rounded-xl sm:rounded-2xl bg-brand/5 border border-brand/20 p-3 sm:p-4 md:p-6 flex flex-col relative overflow-hidden shrink-0">
                <div className="flex items-center gap-2 mb-2 shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  <p className="text-[8px] md:text-[10px] text-brand tracking-widest uppercase">AI Recommendation</p>
                </div>
                <div className="relative flex-1 min-h-[80px]">
                  <div className="absolute inset-0 text-[10px] md:text-sm text-white/90 font-mono leading-relaxed whitespace-pre-wrap">
                    {fullText.substring(0, textIndex)}
                    <motion.span 
                      animate={{ opacity: [1, 0] }} 
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="inline-block w-1 h-2.5 md:w-1.5 md:h-3.5 bg-brand ml-0.5 align-middle"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex flex-1 rounded-2xl border border-white/10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent relative overflow-hidden items-center justify-center">
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem]" />
               
               {/* Animated Supply Chain Flow */}
               <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Normal Edge */}
                  <path d="M 15 25 L 40 50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" />
                  <motion.path d="M 15 25 L 40 50" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }} />

                  {/* Disrupted Edge */}
                  <path d="M 15 75 L 40 50" fill="none" stroke="rgba(239,68,68,0.2)" strokeWidth="0.4" strokeDasharray="1 1" />
                  <motion.path d="M 15 75 L 40 50" fill="none" stroke="rgba(239,68,68,0.8)" strokeWidth="0.6" strokeDasharray="2 2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />

                  {/* Cascading Impact Edge */}
                  <path d="M 40 50 L 70 50" fill="none" stroke="rgba(250,204,21,0.2)" strokeWidth="0.3" />
                  <motion.path d="M 40 50 L 70 50" fill="none" stroke="rgba(250,204,21,0.8)" strokeWidth="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 4, repeat: Infinity, delay: 0.5, ease: "linear" }} />

                  {/* Final Normal Edges */}
                  <path d="M 70 50 L 90 30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" />
                  <path d="M 70 50 L 90 70" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" />
               </svg>

               {/* Nodes */}
               <div className="absolute top-[25%] left-[15%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                 <div className="w-3 h-3 rounded-full bg-white/20 border border-white" />
                 <span className="text-[9px] text-white/50 mt-1.5 uppercase font-medium tracking-widest bg-black/60 px-2 py-0.5 rounded border border-white/10 backdrop-blur-sm">Supplier A</span>
               </div>
               
               <div className="absolute top-[75%] left-[15%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                 <div className="w-5 h-5 rounded-full bg-red-500/20 border-2 border-red-500 animate-pulse flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                   <div className="w-2 h-2 rounded-full bg-red-500" />
                 </div>
                 <span className="text-[9px] text-red-400 mt-1.5 uppercase font-bold tracking-widest bg-black/60 px-2 py-0.5 rounded border border-red-500/30 backdrop-blur-sm">Supplier B (Disrupted)</span>
               </div>

               <div className="absolute top-[50%] left-[40%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                 <div className="w-4 h-4 rounded-full bg-yellow-500/20 border border-yellow-500 flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                 </div>
                 <span className="text-[9px] text-yellow-400 mt-1.5 uppercase font-bold tracking-widest bg-black/60 px-2 py-0.5 rounded border border-yellow-500/30 backdrop-blur-sm">Plant (At Risk)</span>
               </div>

               <div className="absolute top-[50%] left-[70%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                 <div className="w-3 h-3 rounded-full bg-white/20 border border-white" />
                 <span className="text-[9px] text-white/50 mt-1.5 uppercase font-medium tracking-widest bg-black/60 px-2 py-0.5 rounded border border-white/10 backdrop-blur-sm">Warehouse</span>
               </div>

               <div className="absolute top-[30%] left-[90%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                 <div className="w-2 h-2 rounded-full bg-[#FF9F68]" />
                 <span className="text-[9px] text-[#FF9F68] mt-1.5 uppercase font-medium tracking-widest">Customer</span>
               </div>

               <div className="absolute top-[70%] left-[90%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                 <div className="w-2 h-2 rounded-full bg-[#FF9F68]" />
                 <span className="text-[9px] text-[#FF9F68] mt-1.5 uppercase font-medium tracking-widest">Customer</span>
               </div>
            </div>
          </div>
        </div>
      </motion.div>

    </section>
  );
}
