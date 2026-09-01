import CommandCenter from './pages/CommandCenter';
import { Activity, LayoutDashboard, Shield, FileText } from 'lucide-react';

function App() {
  return (
    <div className="h-screen bg-[#F3F4F6] text-slate-900 flex flex-col font-sans overflow-hidden">
      {/* Enterprise Application Shell Header */}
      <header className="bg-[#0f172a] text-white h-14 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 pr-6 border-r border-slate-700/50">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-inner">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-[13px] font-bold tracking-widest text-white leading-tight">RESILIENCE OS</h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase leading-tight">Command Center</p>
            </div>
          </div>
          
          <nav className="hidden md:flex gap-1">
            <button className="px-4 py-1.5 bg-slate-800/80 text-blue-400 text-xs font-semibold rounded-md flex items-center gap-2 border border-slate-700 shadow-sm">
              <LayoutDashboard className="w-4 h-4" /> NETWORK
            </button>
            <button className="px-4 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors text-xs font-medium rounded-md flex items-center gap-2">
              <Shield className="w-4 h-4" /> SCENARIOS
            </button>
            <button className="px-4 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors text-xs font-medium rounded-md flex items-center gap-2">
              <FileText className="w-4 h-4" /> AUDIT
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 text-xs font-medium border border-slate-700 rounded-full px-3 py-1 bg-slate-800/50">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            <span className="text-slate-300 tracking-wide">SYSTEM OPERATIONAL</span>
          </div>
          <div className="w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-300">
            A
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex">
        <CommandCenter />
      </main>
    </div>
  );
}

export default App;
