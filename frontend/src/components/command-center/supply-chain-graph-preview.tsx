'use client';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { Maximize2 } from 'lucide-react';
import Link from 'next/link';

const SupplyChainGraph = dynamic(
  () => import('@/components/disruptions/supply-chain-graph').then((mod) => mod.SupplyChainGraph),
  { ssr: false }
);

export function SupplyChainGraphPreview() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm h-full flex flex-col">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <h3 className="font-bold text-slate-900 dark:text-white">Supply Chain Impact Overview</h3>
        <Link href="/disruptions/SIM-2025-05-17-001" className="text-slate-400 hover:text-blue-500 transition-colors">
          <Maximize2 className="w-4 h-4" />
        </Link>
      </div>
      <div className="flex-1 relative overflow-hidden bg-slate-50/30 dark:bg-[#0f1522] rounded-b-xl min-h-[300px]">
        {/* Render the full graph dynamically to avoid SSR ReactFlow errors */}
        <SupplyChainGraph />
      </div>
    </div>
  );
}
