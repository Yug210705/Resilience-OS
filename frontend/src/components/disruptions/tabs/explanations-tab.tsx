'use client';
import { ArrowDown, AlertTriangle, Sparkles, Factory, Box, Truck, Package, MessageSquareWarning } from 'lucide-react';

export function ExplanationsTab({ disruptionData }: { disruptionData: any }) {
  return (
    <div className="flex flex-col xl:flex-row gap-6 h-full text-slate-900 dark:text-white pb-6">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col space-y-6 min-w-0">
        
        {/* AI Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 shadow-md text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
            <Sparkles className="w-64 h-64 -mt-16 -mr-16" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center space-x-2 bg-white/20 w-max px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/30 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Impact Analysis</span>
            </div>
            <h2 className="text-2xl font-black mb-2">Ripple Effect Explanation</h2>
            <p className="text-blue-100 max-w-2xl font-medium leading-relaxed">
              Our impact engine has traced the disruption at <strong>SUP-007 (TechComponents Ltd)</strong> through your supply chain. 
              Here is the step-by-step breakdown of how this isolated event propagates into a critical revenue risk.
            </p>
          </div>
        </div>

        {/* Timeline Steps */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-8 flex-1">
          <div className="relative h-full">
            
            {/* Connecting Line */}
            <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-gradient-to-b from-red-500 via-amber-500 to-indigo-500"></div>

            <div className="space-y-12">
              
              {/* Step 1 */}
              <div className="relative flex items-start">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/40 border-4 border-white dark:border-[#111827] flex items-center justify-center shrink-0 z-10 shadow-sm shadow-red-500/20">
                  <Truck className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-6 flex-1 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-800 relative">
                  <div className="absolute left-0 top-6 -ml-2.5">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-r-[10px] border-r-slate-100 dark:border-r-slate-800 border-b-[8px] border-b-transparent"></div>
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-black text-red-700 dark:text-red-400">1. Supplier Capacity Drops to 0%</h3>
                    <span className="text-xs font-bold text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">Day 0</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                    A fire at <strong>SUP-007 (Taiwan)</strong> has halted all outbound shipments. This supplier is the sole source for two critical components.
                  </p>
                  <div className="flex space-x-2 text-xs font-bold">
                    <span className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-md text-slate-600 dark:text-slate-400">Sole Source</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-start">
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/40 border-4 border-white dark:border-[#111827] flex items-center justify-center shrink-0 z-10 shadow-sm shadow-amber-500/20">
                  <Box className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="ml-6 flex-1 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-800 relative">
                  <div className="absolute left-0 top-6 -ml-2.5">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-r-[10px] border-r-slate-100 dark:border-r-slate-800 border-b-[8px] border-b-transparent"></div>
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-black text-amber-700 dark:text-amber-500">2. Critical Material Shortage</h3>
                    <span className="text-xs font-bold text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">Day 3</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    Without incoming shipments, our inventory buffer for <strong>MAT-004 (Battery Cell)</strong> will completely exhaust in 3 days. <strong>MAT-009</strong> will exhaust in 7.8 days.
                  </p>
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-lg p-3 flex items-start">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mr-2 mt-0.5 shrink-0" />
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-400/80">MAT-004 is required for 45% of our high-margin product lines.</p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-start">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 border-4 border-white dark:border-[#111827] flex items-center justify-center shrink-0 z-10 shadow-sm shadow-blue-500/20">
                  <Factory className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-6 flex-1 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-800 relative">
                  <div className="absolute left-0 top-6 -ml-2.5">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-r-[10px] border-r-slate-100 dark:border-r-slate-800 border-b-[8px] border-b-transparent"></div>
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-black text-blue-700 dark:text-blue-400">3. Manufacturing Lines Halt</h3>
                    <span className="text-xs font-bold text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">Day 4</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                    Due to the lack of MAT-004, production lines at <strong>PLANT-002 (Jaipur)</strong> and <strong>PLANT-003 (Pune)</strong> are forced to stop. 
                    This causes an immediate production loss of <strong>3,650 units/day</strong> across the network.
                  </p>
                  <div className="flex space-x-2 text-[10px] font-bold">
                    <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded border border-red-200 dark:border-red-800/50">PLANT-002: -850 u/d</span>
                    <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded border border-red-200 dark:border-red-800/50">PLANT-003: -780 u/d</span>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative flex items-start">
                <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/40 border-4 border-white dark:border-[#111827] flex items-center justify-center shrink-0 z-10 shadow-sm shadow-indigo-500/20">
                  <Package className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="ml-6 flex-1 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-800 relative">
                  <div className="absolute left-0 top-6 -ml-2.5">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-r-[10px] border-r-slate-100 dark:border-r-slate-800 border-b-[8px] border-b-transparent"></div>
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-black text-indigo-700 dark:text-indigo-400">4. Revenue Risk & Delayed Orders</h3>
                    <span className="text-xs font-bold text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">Day 8+</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                    The halted production directly impacts <strong>8 finished products</strong>, most notably <em>Smart Device X</em>. 
                    As a result, 142 customer orders are projected to breach their delivery SLAs, putting <strong>₹20.0 Cr</strong> of revenue at risk and potentially incurring ₹1.5 Cr in SLA penalties.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      
      {/* Right Sidebar */}
      <div className="w-full xl:w-[400px] shrink-0 flex flex-col space-y-6 sticky top-6 self-start">
        
        {/* Recommended Action */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center mb-4">
            <div className="bg-emerald-100 dark:bg-emerald-900/50 p-3 rounded-full mr-3 border border-emerald-200 dark:border-emerald-800/50">
              <MessageSquareWarning className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-[16px] font-black text-emerald-800 dark:text-emerald-400">AI Recommendation</h3>
          </div>
          <p className="text-sm font-semibold text-emerald-700/90 dark:text-emerald-300/90 leading-relaxed mb-5">
            To prevent the manufacturing halt at Step 3, you must secure MAT-004 inventory before Day 3. 
            We recommend immediately reviewing the <strong>Recovery Options</strong> tab to initiate a supplier transfer to SUP-012 (Malaysia).
          </p>
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-lg text-sm shadow-sm transition-colors mt-auto">
            View Recovery Options
          </button>
        </div>

        {/* Analysis Meta */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6 flex flex-col flex-1">
          <h3 className="font-bold text-[14px] text-slate-900 dark:text-white mb-5 flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-blue-500" /> Analysis Details
          </h3>
          
          <div className="space-y-4 flex-1">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-semibold text-slate-500">Confidence Score</span>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">98.5%</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-semibold text-slate-500">Engine Build</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">v2.4.1-rc</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-semibold text-slate-500">Trace Depth</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">6 Levels</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500">Execution Time</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">1.24s</span>
            </div>
          </div>
          
          <div className="mt-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Sources Consulted</h4>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-[#111827] px-2 py-1 border border-slate-200 dark:border-slate-700 rounded shadow-sm">ERP Data</span>
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-[#111827] px-2 py-1 border border-slate-200 dark:border-slate-700 rounded shadow-sm">BOM v4</span>
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-[#111827] px-2 py-1 border border-slate-200 dark:border-slate-700 rounded shadow-sm">Logistics API</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
