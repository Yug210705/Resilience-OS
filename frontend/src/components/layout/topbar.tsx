'use client';
import { Bell, Search, HelpCircle, ChevronDown, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="h-16 bg-white dark:bg-[#0A0F1C] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shadow-sm z-10 shrink-0">
      
      {/* Search Bar */}
      <div className="flex items-center bg-slate-50 dark:bg-slate-900 rounded-md px-3 py-2 w-[400px] border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-blue-500 transition-shadow">
        <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
        <input 
          type="text" 
          placeholder="Search suppliers, materials, plants, orders..." 
          className="bg-transparent border-none outline-none text-sm w-full text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
        />
        <div className="flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 ml-2 shrink-0 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">⌘K</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-5 text-sm">
        {/* Status */}
        <div className="flex items-center text-emerald-600 dark:text-emerald-500 font-semibold text-xs tracking-wide">
          <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          Operational
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-3 border-l border-slate-200 dark:border-slate-800 pl-5">
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 relative p-1 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 bg-red-500 border border-white dark:border-slate-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">4</span>
          </button>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
          
          {/* Theme Toggle */}
          {mounted && (
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}
        </div>
        
        {/* Context Selector */}
        <div className="flex items-center border-l border-slate-200 dark:border-slate-800 pl-5 space-x-4">
          <button className="flex items-center text-slate-600 dark:text-slate-300 font-medium hover:text-slate-900 dark:hover:text-white transition-colors">
            Production <ChevronDown className="w-4 h-4 ml-1 opacity-50" />
          </button>
          
          {/* User Profile */}
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              YP
            </div>
            <div className="hidden md:block text-left">
              <div className="font-bold text-slate-900 dark:text-white text-xs leading-none">Yug Pathak</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Admin</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
