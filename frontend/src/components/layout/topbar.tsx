import { Bell, Search, User } from 'lucide-react';

export function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10 shrink-0">
      <div className="flex items-center bg-slate-100 rounded-md px-3 py-1.5 w-96 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500">
        <Search className="w-4 h-4 text-slate-400 mr-2" />
        <input 
          type="text" 
          placeholder="Search supply chain entities, orders..." 
          className="bg-transparent border-none outline-none text-sm w-full"
        />
      </div>
      <div className="flex items-center space-x-6 text-sm">
        <div className="flex items-center text-emerald-600 font-medium">
          <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
          All Systems Operational
        </div>
        <button className="text-slate-500 hover:text-slate-700 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">4</span>
        </button>
        <div className="flex items-center space-x-2 border-l border-slate-200 pl-6">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            YP
          </div>
          <div>
            <div className="font-semibold text-slate-900 leading-none">Yug Pathak</div>
            <div className="text-xs text-slate-500 mt-1">Enterprise Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}
