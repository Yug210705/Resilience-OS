"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ProductThesis() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Calculate opacity for each line so they fade in sequentially
  // Animation finishes at 0.8, leaving 0.8 to 1.0 (20%) as a pure hold/sustain phase
  const opacity1 = useTransform(scrollYProgress, [0.05, 0.2], [0.2, 1]);
  const opacity2 = useTransform(scrollYProgress, [0.25, 0.4], [0.2, 1]);
  const opacity3 = useTransform(scrollYProgress, [0.45, 0.6], [0.2, 1]);
  const opacity4 = useTransform(scrollYProgress, [0.65, 0.8], [0.2, 1]);

  return (
    <section id="platform" ref={containerRef} className="relative h-[400vh] w-full bg-transparent">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center px-6 md:px-12">
        <div className="max-w-6xl text-center">
          <motion.h2 
            style={{ opacity: opacity1 }} 
            className="text-4xl md:text-5xl lg:text-6xl font-serif italic text-white mb-10"
          >
            An intelligence layer above your systems of record.
          </motion.h2>
          
          <div className="text-xl md:text-3xl font-sans max-w-4xl mx-auto leading-relaxed flex flex-col gap-2">
            <motion.p style={{ opacity: opacity2 }} className="text-white">
              Keep your ERPs, WMSs, and TMSs. LinqChain
            </motion.p>
            <motion.p style={{ opacity: opacity3 }} className="text-white">
              sits above them to provide end-to-end visibility,
            </motion.p>
            <motion.p style={{ opacity: opacity4 }} className="text-white">
              proactive simulation, and AI-assisted recovery paths.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
