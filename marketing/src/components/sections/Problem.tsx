"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Problem() {
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
    <section ref={containerRef} className="relative h-[400vh] w-full bg-transparent">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center px-6 md:px-12">
        <div className="max-w-5xl text-center">
          <motion.p style={{ opacity: opacity1 }} className="text-4xl md:text-6xl lg:text-7xl font-sans font-medium text-white tracking-tight leading-tight mb-2">
            Supply chains don&apos;t fail
          </motion.p>
          <motion.p style={{ opacity: opacity2 }} className="text-4xl md:text-6xl lg:text-7xl font-sans font-medium text-white tracking-tight leading-tight mb-2">
            in isolation.
          </motion.p>
          <motion.p style={{ opacity: opacity3 }} className="text-4xl md:text-6xl lg:text-7xl font-sans font-medium text-white tracking-tight leading-tight mb-2">
            One disruption cascades
          </motion.p>
          <motion.p style={{ opacity: opacity4 }} className="text-4xl md:text-6xl lg:text-7xl font-sans font-medium text-white tracking-tight leading-tight">
            across the entire network.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
