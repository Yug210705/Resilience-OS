'use client';
import { Bell, Search, HelpCircle, ChevronDown, Moon, Sun, CheckCircle2, AlertTriangle, Settings, LogOut, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useSimulationStore } from '@/stores/useSimulationStore';

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEnv, setShowEnv] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const [env, setEnv] = useState('Production');
  const [notifications, setNotifications] = useState<any[]>([
    { id: 1, title: 'System Update', desc: 'ResilienceOS updated to v2.4.1 successfully.', time: 'Yesterday', type: 'success' },
  ]);
  const { activeDisruption } = useSimulationStore();

  useEffect(() => {
    if (activeDisruption) {
      const newNotif = {
        id: Date.now(),
        title: 'Disruption Detected',
        desc: `Impact analysis ready for ${activeDisruption.disruption?.affected_entity_id || 'entity'}.`,
        time: 'Just now',
        type: 'alert'
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  }, [activeDisruption]);

  useEffect(() => {
    setMounted(true);
    
    // Close dropdowns on outside click
    const handleClickOutside = () => {
      setShowNotifications(false);
      setShowEnv(false);
      setShowProfile(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
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
        {activeDisruption ? (
          <div className="flex items-center text-red-600 dark:text-red-500 font-semibold text-xs tracking-wide">
            <div className="w-2 h-2 rounded-full bg-red-500 mr-2 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse"></div>
            System Disrupted
          </div>
        ) : (
          <div className="flex items-center text-emerald-600 dark:text-emerald-500 font-semibold text-xs tracking-wide">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            Operational
          </div>
        )}
        
        {/* Actions */}
        <div className="flex items-center space-x-3 border-l border-slate-200 dark:border-slate-800 pl-5">
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); setShowEnv(false); setShowProfile(false); }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 relative p-1 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 border border-white dark:border-slate-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
              >
                <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Notifications</h4>
                  {notifications.length > 0 && (
                    <button onClick={() => setNotifications([])} className="text-xs text-blue-600 hover:underline">Mark all read</button>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-sm">No new notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className="p-3 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-start">
                        <div className={`mt-0.5 p-1.5 rounded-full mr-3 ${n.type === 'alert' ? 'bg-red-100 text-red-600' : n.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                          {n.type === 'alert' ? <AlertTriangle className="w-3.5 h-3.5" /> : n.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{n.title}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{n.desc}</div>
                          <div className="text-[10px] text-slate-400 mt-1">{n.time}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
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
        <div className="flex items-center border-l border-slate-200 dark:border-slate-800 pl-5 space-x-4 relative">
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowEnv(!showEnv); setShowNotifications(false); setShowProfile(false); }}
              className="flex items-center text-slate-600 dark:text-slate-300 font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {env} <ChevronDown className="w-4 h-4 ml-1 opacity-50" />
            </button>
            {showEnv && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden py-1">
                {['Production', 'Staging', 'Sandbox'].map(e => (
                  <button 
                    key={e} 
                    onClick={() => setEnv(e)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="relative">
            <div 
              onClick={(e) => { e.stopPropagation(); setShowProfile(!showProfile); setShowNotifications(false); setShowEnv(false); }}
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                YP
              </div>
              <div className="hidden md:block text-left">
                <div className="font-bold text-slate-900 dark:text-white text-xs leading-none">Yug Pathak</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Admin</div>
              </div>
            </div>
            {showProfile && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden py-1">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Yug Pathak</p>
                  <p className="text-xs text-slate-500 truncate">yug.pathak@resilience.com</p>
                </div>
                <button className="w-full flex items-center px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200">
                  <User className="w-4 h-4 mr-2 opacity-70" /> My Profile
                </button>
                <button className="w-full flex items-center px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200">
                  <Settings className="w-4 h-4 mr-2 opacity-70" /> Account Settings
                </button>
                <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                <button className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <LogOut className="w-4 h-4 mr-2 opacity-70" /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
