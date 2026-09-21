"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function FinalCTA() {
  const productUrl = process.env.NEXT_PUBLIC_APP_URL || "https://resilience-os.vercel.app/command-center";
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleExplore = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push('/login');
    }, 800);
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  const opacity1 = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const opacity2 = useTransform(scrollYProgress, [0.3, 0.8], [0, 1]);
  const y1 = useTransform(scrollYProgress, [0, 0.5], [50, 0]);
  const y2 = useTransform(scrollYProgress, [0.3, 0.8], [50, 0]);

  return (
    <section ref={containerRef} className="py-20 md:py-40 w-full relative overflow-hidden bg-transparent">
      
      <div className="w-full px-6 md:px-12 lg:px-24 relative z-10">
        <motion.div 
          className="max-w-5xl mx-auto text-center border border-white/10 bg-black/40 backdrop-blur-2xl p-8 md:p-16 lg:p-24 rounded-2xl md:rounded-3xl"
          style={{ opacity: opacity1, y: y1 }}
        >
          <motion.h2 className="text-3xl md:text-5xl lg:text-7xl font-serif italic text-white mb-4 md:mb-6">
            Build resilience.
          </motion.h2>
          <motion.p style={{ opacity: opacity2, y: y2 }} className="text-xl text-white/60 font-light mb-12 max-w-2xl mx-auto">
            See the network. Simulate the disruption. Plan the recovery.
          </motion.p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={handleExplore}
              disabled={isLoading}
              className="group flex items-center justify-center gap-3 w-full sm:w-auto text-sm font-bold bg-[#FF9F68] text-black px-10 py-4 rounded-full hover:opacity-90 transition-all duration-300 shadow-xl shadow-[#FF9F68]/20 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Initializing...
                </>
              ) : (
                <>
                  Explore the platform
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
