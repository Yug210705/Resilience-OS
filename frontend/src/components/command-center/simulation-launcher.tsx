'use client';
import { useState } from 'react';
import { AlertTriangle, Play, X, Presentation, Zap } from 'lucide-react';
import { useSimulationStore } from '@/stores/useSimulationStore';
import { simulateDisruption } from '@/services/api';
import { useRouter } from 'next/navigation';

export function SimulationLauncher({ children }: { children?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPitchMode, setIsPitchMode] = useState(true);
  const { setActiveDisruption } = useSimulationStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    disruption_type: 'supplier',
    affected_entity_id: 'SUP-007',
    severity: 1.0,
    duration_days: 10
  });

  const getPitchModeData = () => {
    return {
      simulation_id: "SIM-2025-05-17-001",
      disruption: {
        disruption_type: "Supplier Capacity Disruption",
        affected_entity_id: "SUP-007",
        severity: 1.0,
        duration_days: 10
      },
      summary: {
        affected_suppliers: 7,
        affected_materials: 3,
        affected_plants: 4,
        affected_products: 8,
        affected_orders: 124,
        revenue_at_risk: 185000000, // 18.5 Cr
        overall_impact_score: 94
      },
      affected_materials: [{ id: "MAT-004", risk_score: 1.0 }, { id: "MAT-006", risk_score: 0.6 }, { id: "MAT-009", risk_score: 0.3 }],
      affected_plants: [{ id: "PLANT-002", risk_score: 1.0 }, { id: "PLANT-003", risk_score: 0.6 }, { id: "PLANT-005", risk_score: 0.3 }],
      affected_products: [{ id: "PRD-008", risk_score: 1.0 }, { id: "PRD-003", risk_score: 0.6 }, { id: "PRD-010", risk_score: 0.3 }],
      affected_orders: [{ order_id: "ORD-1042", risk_score: 1.0 }, { order_id: "ORD-1043", risk_score: 0.6 }, { order_id: "ORD-1044", risk_score: 0.3 }],
      recovery_context: {
        supplier_options: [], // Will be handled by the Live Demo component fallback
        material_shortages: [{ material_id: "MAT-004", normal_demand_per_day: 420 }]
      },
      timeline: [] // Simplified for demo
    };
  };

  const runSimulation = async () => {
    setIsLoading(true);
    try {
      let result;
      if (isPitchMode) {
        // Simulate network delay for effect
        await new Promise(r => setTimeout(r, 2000));
        result = getPitchModeData();
      } else {
        result = await simulateDisruption(formData);
      }
      
      setActiveDisruption(result);
      setIsOpen(false);
      
      // Always route to the beautiful Disruption Impact Analysis page
      router.push(`/disruptions/${result.simulation_id}`);
    } catch (e) {
      console.error(e);
      alert("Failed to simulate. Ensure backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {children ? (
        <div onClick={() => setIsOpen(true)} className="h-full cursor-pointer flex items-center">
          {children}
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-md font-semibold text-sm shadow-lg flex items-center transition-all hover:scale-105 active:scale-95 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          <AlertTriangle className="w-4 h-4 mr-2 relative z-10" />
          <span className="relative z-10">Simulate Disruption</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col transform transition-all">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 relative overflow-hidden">
              {isPitchMode && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>}
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center">
                  Simulate Disruption
                </h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-full p-1 transition-colors"><X className="w-4 h-4"/></button>
            </div>
            
            <div className="p-6 space-y-5 relative">
              {/* Pitch Mode Toggle */}
              {!isLoading && (
                <div className="flex items-center justify-between p-3 mb-2 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-lg">
                  <div className="flex items-center">
                    <Presentation className="w-5 h-5 text-indigo-600 mr-2" />
                    <div>
                      <h4 className="text-sm font-bold text-indigo-900">SAP Hackfest Presentation Mode</h4>
                      <p className="text-xs text-indigo-700">Matches Slide 8 data exactly</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsPitchMode(!isPitchMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isPitchMode ? 'bg-indigo-600' : 'bg-slate-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPitchMode ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              )}

              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <div className="animate-ping absolute inset-0 rounded-full bg-red-400 opacity-20"></div>
                    <div className="relative bg-red-100 text-red-600 p-4 rounded-full">
                      <Zap className="w-8 h-8 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-slate-800 font-bold text-lg text-center">
                    Injecting Chaos...<br/>
                    <span className="text-sm text-slate-500 font-medium mt-2 block animate-pulse">Calculating systemic cascading failure</span>
                  </div>
                </div>
              ) : (
                <div className={`transition-opacity duration-300 ${isPitchMode ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Disruption Type</label>
                      <select 
                        className="w-full border border-slate-300 rounded-md p-2.5 text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        value={isPitchMode ? 'supplier' : formData.disruption_type}
                        onChange={(e) => setFormData({...formData, disruption_type: e.target.value})}
                      >
                        <option value="supplier">Supplier</option>
                        <option value="material">Material</option>
                        <option value="plant">Plant</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Affected Entity</label>
                      <input 
                        type="text" 
                        className="w-full border border-slate-300 rounded-md p-2.5 text-slate-900 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={isPitchMode ? 'S47' : formData.affected_entity_id}
                        onChange={(e) => setFormData({...formData, affected_entity_id: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Severity (0-1.0)</label>
                        <input 
                          type="number" step="0.1" min="0" max="1"
                          className="w-full border border-slate-300 rounded-md p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                          value={isPitchMode ? 1.0 : formData.severity}
                          onChange={(e) => setFormData({...formData, severity: parseFloat(e.target.value)})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Duration (Days)</label>
                        <input 
                          type="number" min="1"
                          className="w-full border border-slate-300 rounded-md p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                          value={isPitchMode ? 10 : formData.duration_days}
                          onChange={(e) => setFormData({...formData, duration_days: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {!isLoading && (
              <div className="p-4 border-t border-slate-200 flex justify-end space-x-3 bg-slate-50">
                <button onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-md transition-colors">Cancel</button>
                <button 
                  onClick={runSimulation} 
                  className={`px-6 py-2 rounded-md font-bold text-sm flex items-center shadow-md transition-transform hover:scale-105 active:scale-95 ${isPitchMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                >
                  <Play className="w-4 h-4 mr-2" /> {isPitchMode ? 'Run Pitch Demo' : 'Run Live Simulation'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
