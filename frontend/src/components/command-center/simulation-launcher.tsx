'use client';
import { useState } from 'react';
import { AlertTriangle, Play, X } from 'lucide-react';
import { useSimulationStore } from '@/stores/useSimulationStore';
import { simulateDisruption } from '@/services/api';
import { useRouter } from 'next/navigation';

export function SimulationLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setActiveDisruption } = useSimulationStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    disruption_type: 'supplier',
    affected_entity_id: 'SUP-007',
    severity: 1.0,
    duration_days: 10
  });

  const runSimulation = async () => {
    setIsLoading(true);
    try {
      // 6. Show: "Analyzing supply-chain dependencies..."
      const result = await simulateDisruption(formData);
      setActiveDisruption(result);
      setIsOpen(false);
      // 8. Automatically navigate to Impact Analysis
      router.push(`/disruptions/${result.simulation_id}`);
    } catch (e) {
      console.error(e);
      alert("Failed to simulate. Ensure Member 2 backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-md font-semibold text-sm shadow-sm flex items-center transition-colors"
      >
        <AlertTriangle className="w-4 h-4 mr-2" />
        Simulate Disruption
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">Simulate Supply Chain Disruption</h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-6 space-y-5">
              {isLoading ? (
                <div className="py-8 flex flex-col items-center justify-center space-y-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
                  <div className="text-slate-600 font-medium text-center">
                    Analyzing supply-chain dependencies...<br/>
                    <span className="text-xs text-slate-400 font-normal">Resolving disruption → Traversing dependency graph → Calculating exposure</span>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Disruption Type</label>
                    <select 
                      className="w-full border border-slate-300 rounded-md p-2.5 text-slate-900 bg-white"
                      value={formData.disruption_type}
                      onChange={(e) => setFormData({...formData, disruption_type: e.target.value})}
                    >
                      <option value="supplier">Supplier</option>
                      <option value="material">Material</option>
                      <option value="plant">Plant</option>
                      <option value="port">Port</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Affected Entity</label>
                    <input 
                      type="text" 
                      className="w-full border border-slate-300 rounded-md p-2.5 text-slate-900 font-mono text-sm"
                      value={formData.affected_entity_id}
                      onChange={(e) => setFormData({...formData, affected_entity_id: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Severity (0-1.0)</label>
                      <input 
                        type="number" step="0.1" min="0" max="1"
                        className="w-full border border-slate-300 rounded-md p-2.5 text-slate-900"
                        value={formData.severity}
                        onChange={(e) => setFormData({...formData, severity: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Duration (Days)</label>
                      <input 
                        type="number" min="1"
                        className="w-full border border-slate-300 rounded-md p-2.5 text-slate-900"
                        value={formData.duration_days}
                        onChange={(e) => setFormData({...formData, duration_days: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {!isLoading && (
              <div className="p-4 border-t border-slate-200 flex justify-end space-x-3 bg-slate-50">
                <button onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-md">Cancel</button>
                <button onClick={runSimulation} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md font-semibold text-sm flex items-center shadow-sm">
                  <Play className="w-4 h-4 mr-2" /> Run Simulation
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
