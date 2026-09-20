"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function GlobalBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-background">
      {/* Light subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      {/* Moving gradient blobs for dynamic feel */}
      <motion.div
        className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand/5 blur-[120px]"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-300/10 blur-[120px]"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      {/* Abstract Supply Chain Nodes & Paths */}
      <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
        <motion.path
          d="M -100 200 C 200 200, 300 400, 800 300 S 1200 600, 1600 500"
          fill="none"
          stroke="var(--color-brand)"
          strokeWidth="1"
          strokeDasharray="4 8"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -100 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M 1600 100 C 1200 200, 1000 600, 500 500 S 200 800, -100 700"
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth="0.5"
          strokeDasharray="2 4"
          initial={{ strokeDashoffset: 100 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Animated Packets */}
        <motion.circle
          r="3"
          fill="var(--color-brand)"
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ offsetPath: 'path("M -100 200 C 200 200, 300 400, 800 300 S 1200 600, 1600 500")' }}
        />
        <motion.circle
          r="2"
          fill="var(--color-foreground)"
          initial={{ offsetDistance: "100%" }}
          animate={{ offsetDistance: "0%" }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ offsetPath: 'path("M 1600 100 C 1200 200, 1000 600, 500 500 S 200 800, -100 700")' }}
        />
      </svg>
    </div>
  );
}
