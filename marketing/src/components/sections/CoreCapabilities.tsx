"use client";

import { Search, Activity, RotateCcw } from "lucide-react";
import { motion, Variants } from "framer-motion";

const CAPABILITIES = [
  {
    id: "see",
    title: "SEE",
    subtitle: "Understand the network.",
    icon: Search,
    items: ["Suppliers", "Facilities", "Inventory", "Shipments", "Ports", "Vessels", "Routes", "Dependencies", "Risk"],
  },
  {
    id: "simulate",
    title: "SIMULATE",
    subtitle: "Stress-test the network.",
    icon: Activity,
    items: ["Supplier shutdown", "Port closure", "Shipment delay", "Demand spike", "Capacity reduction", "Raw material shortage"],
  },
  {
    id: "recover",
    title: "RECOVER",
    subtitle: "Evaluate the way back.",
    icon: RotateCcw,
    items: ["Alternative supplier", "Alternative route", "Inventory reallocation", "Shipment prioritization", "Production adjustment"],
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function CoreCapabilities() {
  return (
    <section className="py-32 w-full overflow-hidden bg-transparent">
      <div className="w-full px-6 md:px-12 lg:px-24">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {CAPABILITIES.map((cap) => (
            <motion.div 
              key={cap.id} 
              variants={cardVariants}
              className="group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 overflow-hidden hover:bg-white/10 transition-all duration-500"
            >
              <div className="flex flex-col gap-6 mb-8 relative z-10">
                <div className="w-14 h-14 rounded-full bg-brand/20 flex items-center justify-center text-brand group-hover:scale-110 transition-transform duration-500">
                  <cap.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-3xl font-serif italic text-white mb-2">{cap.title}</h3>
                  <p className="text-sm text-white/60 uppercase tracking-widest">{cap.subtitle}</p>
                </div>
              </div>

              <div className="space-y-4 mt-8 pt-8 border-t border-white/10 relative z-10">
                {cap.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-brand transition-colors duration-300" />
                    <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
