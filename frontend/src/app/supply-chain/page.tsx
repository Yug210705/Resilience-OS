import Link from 'next/link';
import { Database, Search } from 'lucide-react';

export default function SupplyChainExplorer() {
  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex justify-between items-end border-b border-slate-200 pb-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Supply Chain Explorer</h1>
          <p className="text-slate-500 mt-1">Global network database and master data</p>
        </div>
      </div>
      
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-12 text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Database className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Master Data Explorer</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-6">
          This module is designed for deep-dive network analysis. For the resilience demo, please use the Command Center to simulate disruptions.
        </p>
        <Link 
          href="/command-center"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md font-semibold text-sm shadow-sm transition-colors"
        >
          Go to Command Center
        </Link>
      </div>
    </div>
  );
}
