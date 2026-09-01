'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Factory, Package, ArrowRight, Truck, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Dynamically import React Flow component to avoid SSR issues
const SupplyChainGraph = dynamic(
  () => import('@/components/disruptions/supply-chain-graph').then((mod) => mod.SupplyChainGraph),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 animate-pulse rounded-xl" /> }
);

export function DependencyGraphTab({ disruptionData }: { disruptionData: any }) {
  const [selectedNode, setSelectedNode] = useState<any>({
    id: 'SUP-007',
    type: 'supplier',
    name: 'TechComponents Ltd',
    location: 'Taiwan',
    status: 'critical',
    impact: '100% capacity loss',
    materials: ['MAT-004', 'MAT-009']
  });

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-full text-slate-900 dark:text-white pb-6">
      {/* Main Graph Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden h-[600px] xl:h-[700px]">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-[#0f1522]">
          <div>
            <h3 className="font-bold text-[15px]">Supply Chain Network</h3>
            <p className="text-xs text-slate-500">Interactive dependency mapping of affected nodes</p>
          </div>
          <div className="flex space-x-2 text-[10px] font-bold">
            <div className="flex items-center bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
              <div className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></div> Critical
            </div>
            <div className="flex items-center bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
              <div className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></div> Warning
            </div>
          </div>
        </div>
        
        <div className="flex-1 relative cursor-grab active:cursor-grabbing">
          <SupplyChainGraph />
          
          <div className="absolute bottom-4 left-4 right-4 pointer-events-none flex justify-between">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 pointer-events-auto">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Impact Propagation</h4>
              <div className="flex items-center space-x-2 text-xs font-semibold">
                <span className="text-red-600 dark:text-red-400">Supplier</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="text-amber-600 dark:text-amber-400">Materials</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="text-yellow-600 dark:text-yellow-500">Plants</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="text-blue-600 dark:text-blue-400">Products</span>
              </div>
            </div>
            
            <div className="flex space-x-2 pointer-events-auto">
              <button className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <span className="sr-only">Zoom In</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/></svg>
              </button>
              <button className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <span className="sr-only">Zoom Out</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="8" x2="14" y1="11" y2="11"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Sidebar - Node Details */}
      <div className="w-full xl:w-[350px] shrink-0 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0f1522]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[13px] text-slate-500 uppercase tracking-wider">Node Details</h3>
            <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50 text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider">Source</span>
          </div>
          <div className="flex items-start mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3 border border-red-200 dark:border-red-800/50 shrink-0">
              <Truck className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{selectedNode.id}</h2>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{selectedNode.name}</p>
            </div>
          </div>
        </div>
        
        <div className="p-5 flex-1 overflow-y-auto custom-scrollbar space-y-8">
          
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Disruption Status</h4>
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 mr-2 shrink-0" />
                <div>
                  <h5 className="text-sm font-bold text-red-800 dark:text-red-300">Complete Facility Shutdown</h5>
                  <p className="text-xs text-red-600 dark:text-red-400/80 mt-1 font-medium leading-relaxed">
                    Fire incident at primary manufacturing facility reported at 02:30 AM local time. 
                    Production capacity reduced to 0% for an estimated 30-45 days.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Affected Materials</h4>
            <div className="space-y-3">
              {[
                { id: 'MAT-004', name: 'Battery Cell (High Capacity)', stock: '3.0 days', deps: 2 },
                { id: 'MAT-009', name: 'Microcontroller (Type B)', stock: '7.8 days', deps: 3 },
              ].map((m, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">{m.id}</div>
                      <div className="text-[11px] font-medium text-slate-500">{m.name}</div>
                    </div>
                    <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 text-[10px] font-bold px-2 py-0.5 rounded">
                      {m.stock}
                    </span>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 flex items-center mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/50">
                    <Factory className="w-3 h-3 mr-1" /> Used in {m.deps} downstream plants
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Alternative Suppliers</h4>
            <div className="space-y-3">
              <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 rounded-lg p-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">SUP-012 (Malaysia)</span>
                  <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded">Active</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-3">Has compatible MAT-004 spec</div>
                
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700">
                    <div className="text-slate-400 font-semibold mb-0.5">Avail. Capacity</div>
                    <div className="font-bold text-slate-900 dark:text-white">4,000 u/w</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700">
                    <div className="text-slate-400 font-semibold mb-0.5">Lead Time</div>
                    <div className="font-bold text-slate-900 dark:text-white">12 days</div>
                  </div>
                </div>
                
                <button className="w-full mt-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 font-bold py-1.5 rounded-md text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  Initiate Transfer
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
