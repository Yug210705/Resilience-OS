"use client";

import { ShieldAlert, PackageMinus, Anchor, Truck, BarChart3, Network, Route, Eye } from "lucide-react";
import { motion } from "framer-motion";

const USE_CASES = [
  { title: "Supplier Risk", desc: "Monitor supplier health and tier-N dependencies.", icon: ShieldAlert },
  { title: "Inventory Risk", desc: "Prevent stockouts before they affect revenue.", icon: PackageMinus },
  { title: "Port Disruption", desc: "Navigate congestion and port closures in real-time.", icon: Anchor },
  { title: "Transportation Risk", desc: "Track cascading delays across multi-modal transit.", icon: Truck },
  { title: "Demand Shocks", desc: "Simulate demand spikes against current capacity.", icon: BarChart3 },
  { title: "Network Planning", desc: "Optimize your physical footprint and routes.", icon: Network },
  { title: "Recovery Planning", desc: "Evaluate scenarios to restore operations faster.", icon: Route },
  { title: "Operational Visibility", desc: "One source of truth for the end-to-end supply chain.", icon: Eye },
];

export default function UseCases() {
  return (
    <section id="use-cases" className="py-32 w-full overflow-hidden bg-transparent">
      <div className="w-full px-6 md:px-12 lg:px-24">
        <motion.div 
          className="max-w-4xl mx-auto text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-serif italic text-white mb-6">
            For modern challenges.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1400px] mx-auto">
          {USE_CASES.map((uc, i) => (
            <motion.div 
              key={uc.title} 
              className="group p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md hover:bg-white/10 transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-brand/20 group-hover:border-brand/50 transition-all duration-300">
                <uc.icon className="w-5 h-5 text-white/70 group-hover:text-brand transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-serif italic text-white mb-2">{uc.title}</h3>
              <p className="text-sm text-white/50 font-light">{uc.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
