"use client";

import { useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function getInitialShow() {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("transition") === "true";
}

export function BootScreen() {
  // Show immediately on first render if transition=true — no flash of underlying content
  const [show, setShow] = useState(getInitialShow);
  const cleanedRef = useRef(false);

  useEffect(() => {
    if (show && !cleanedRef.current) {
      cleanedRef.current = true;
      
      // Remove the transition parameter from the URL so refreshes don't trigger it again
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      // Keep the boot screen visible for 2s for a premium loading feel
      const timer = setTimeout(() => {
        setShow(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-slate-50 dark:bg-[#050505] flex flex-col items-center justify-center text-slate-900 dark:text-slate-100"
        >
          <div className="absolute inset-0 bg-blue-600/5 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none w-[60%] h-[60%] left-[20%] top-[20%]"></div>
          
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-8 relative z-10" />
          <h1 className="font-serif italic text-3xl tracking-wide mb-3 relative z-10">LinqChain</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold relative z-10">
            Initializing Resilience OS
          </p>
          
          {/* Progress bar effect */}
          <div className="w-48 h-1 bg-slate-200 dark:bg-white/10 rounded-full mt-10 overflow-hidden relative z-10">
            <motion.div 
              className="h-full bg-blue-600 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.8, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

