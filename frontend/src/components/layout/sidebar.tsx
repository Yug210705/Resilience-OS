'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, ShieldAlert, GitMerge, FileCheck, Search, LayoutDashboard, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Command Center', href: '/command-center', icon: LayoutDashboard },
  { name: 'Disruptions', href: '/disruptions', icon: Activity },
  { name: 'Supply Chain Explorer', href: '/supply-chain', icon: Database },
  { name: 'Recovery', href: '/recovery', icon: GitMerge },
  { name: 'Risk & Audit', href: '/risk', icon: ShieldAlert },
  { name: 'Approvals', href: '/approvals', icon: FileCheck },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full shadow-xl z-20">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <ShieldAlert className="w-6 h-6 text-blue-500 mr-3" />
        <span className="text-white font-bold tracking-wider text-sm">RESILIENCE OS</span>
      </div>
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive ? "bg-blue-600 text-white" : "hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-white" : "text-slate-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
