'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Activity, ShieldAlert, GitMerge, FileCheck, LayoutDashboard, 
  Network, PlaySquare, Bot, Settings, HelpCircle, ChevronLeft,
  ChevronRight, Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const baseMenuGroups = [
  {
    title: 'COMMAND CENTER',
    items: [
      { name: 'Overview', href: '/command-center', icon: LayoutDashboard },
      { name: 'Disruptions', href: '/disruptions', icon: Activity },
      { name: 'Supply Chain', href: '/supply-chain', icon: Network },
    ]
  },
  {
    title: 'RECOVERY',
    items: [
      { name: 'Recovery Plans', href: '/recovery-plans', icon: GitMerge },
      { name: 'Scenarios', href: '/scenarios', icon: PlaySquare },
    ]
  },
  {
    title: 'RISK & AUDIT',
    items: [
      { name: 'Risk & Audit', href: '/risk-audit', icon: ShieldAlert },
      { name: 'AI Insights', href: '/ai-insights', icon: Bot },
    ]
  },
  {
    title: 'APPROVALS',
    items: [
      { name: 'Approvals', href: '/approvals', icon: FileCheck, badge: 2 },
    ]
  },
  {
    title: 'EXECUTION',
    items: [
      { name: 'SAP Actions', href: '/sap-actions', icon: Play },
      { name: 'Action History', href: '/action-history', icon: Activity },
    ]
  }
];

import { useSimulationStore } from '@/stores/useSimulationStore';

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { activeDisruption } = useSimulationStore();

  const menuGroups = baseMenuGroups.map(group => ({
    ...group,
    items: group.items.map(item => {
      if (item.name === 'Disruptions') {
        return {
          ...item,
          href: activeDisruption ? `/disruptions/${activeDisruption.simulation_id}` : '/disruptions'
        };
      }
      return item;
    })
  }));

  return (
    <div className={cn(
      "bg-white dark:bg-[#0A0F1C] border-r border-slate-200 dark:border-slate-800 flex flex-col h-full z-20 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="h-16 flex items-center px-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <ShieldAlert className="w-6 h-6 text-blue-600 dark:text-blue-500 min-w-[24px]" />
        {!collapsed && <span className="text-slate-900 dark:text-white font-extrabold tracking-tight text-sm ml-3 uppercase">RESILIENCE OS</span>}
      </div>
      
      <div className="flex-1 py-4 overflow-y-auto custom-scrollbar">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="mb-6">
            {!collapsed && (
              <h4 className="px-6 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                {group.title}
              </h4>
            )}
            <nav className="space-y-0.5 px-3">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    title={collapsed ? item.name : undefined}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-semibold transition-colors relative",
                      isActive 
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" 
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-300"
                    )}
                  >
                    <item.icon className={cn(
                      "h-4 w-4 min-w-[16px]", 
                      isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500",
                      !collapsed && "mr-3"
                    )} />
                    {!collapsed && <span>{item.name}</span>}
                    
                    {!collapsed && item.badge && (
                      <span className="ml-auto bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 py-0.5 px-2 rounded-full text-[10px] font-bold">
                        {item.badge}
                      </span>
                    )}
                    {collapsed && item.badge && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
      
      <div className="mt-auto border-t border-slate-200 dark:border-slate-800 py-4 px-3 space-y-0.5">
        <Link href="/settings" className="flex items-center px-3 py-2 rounded-md text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-300">
          <Settings className="h-4 w-4 min-w-[16px] text-slate-400 dark:text-slate-500 mr-3" />
          {!collapsed && <span>Settings</span>}
        </Link>
        <Link href="/help" className="flex items-center px-3 py-2 rounded-md text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-300">
          <HelpCircle className="h-4 w-4 min-w-[16px] text-slate-400 dark:text-slate-500 mr-3" />
          {!collapsed && <span>Help & Docs</span>}
        </Link>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center px-3 py-2 rounded-md text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-300"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 min-w-[16px] text-slate-400 dark:text-slate-500 m-auto" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 min-w-[16px] text-slate-400 dark:text-slate-500 mr-3" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
