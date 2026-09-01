'use client';
import { useState, useMemo } from 'react';
import { Factory, Truck, Package, Box, Users, Search, Filter, ArrowDownToLine, ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type EntityType = 'Supplier' | 'Material' | 'Plant' | 'Product' | 'Customer';
type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

interface Entity {
  id: string;
  name: string;
  type: EntityType;
  impact: string;
  severity: Severity;
  owner: string;
  status: string;
}

export function AffectedEntitiesTab({ disruptionData }: { disruptionData: any }) {
  const [activeTab, setActiveTab] = useState<string>('All');
  
  const entitiesList = useMemo(() => {
    if (!disruptionData) return [];
    
    const entities: Entity[] = [];
    
    const getSev = (i: number): Severity => i === 0 ? 'Critical' : i % 2 === 0 ? 'High' : 'Medium';
    
    (disruptionData.affected_suppliers || []).forEach((s: any, i: number) => {
       entities.push({ id: s.id, name: `Supplier ${s.id}`, type: 'Supplier', impact: 'Capacity constrained', severity: getSev(i), owner: 'Supply Team', status: 'Pending' });
    });
    
    (disruptionData.affected_materials || []).forEach((m: any, i: number) => {
       entities.push({ id: m.id, name: `Material ${m.id}`, type: 'Material', impact: 'Shortage projected', severity: getSev(i), owner: 'Procurement', status: 'Pending' });
    });

    (disruptionData.affected_plants || []).forEach((p: any, i: number) => {
       entities.push({ id: p.id, name: `Plant ${p.id}`, type: 'Plant', impact: 'Production halted', severity: getSev(i), owner: 'Operations', status: 'Pending' });
    });

    (disruptionData.affected_products || []).forEach((p: any, i: number) => {
       entities.push({ id: p.id, name: `Product ${p.id}`, type: 'Product', impact: 'Volume at risk', severity: getSev(i), owner: 'Sales', status: 'Pending' });
    });

    (disruptionData.affected_orders || []).forEach((o: any, i: number) => {
       entities.push({ id: o.order_id || o.id, name: `Order ${o.order_id || o.id}`, type: 'Customer', impact: `${o.shortfall_quantity || 'Unknown'} units delayed`, severity: getSev(i), owner: 'Account Exec', status: 'Pending' });
    });
    
    return entities;
  }, [disruptionData]);

  const filteredEntities = activeTab === 'All' 
    ? entitiesList 
    : entitiesList.filter(e => e.type === activeTab || (activeTab === 'Materials' && e.type === 'Material') || (activeTab === 'Plants' && e.type === 'Plant'));

  const getIcon = (type: EntityType) => {
    switch (type) {
      case 'Supplier': return <Truck className="w-4 h-4" />;
      case 'Material': return <Box className="w-4 h-4" />;
      case 'Plant': return <Factory className="w-4 h-4" />;
      case 'Product': return <Package className="w-4 h-4" />;
      case 'Customer': return <Users className="w-4 h-4" />;
    }
  };

  const getSeverityBadge = (severity: Severity) => {
    return (
      <span className={cn(
        "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider",
        severity === 'Critical' ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50" :
        severity === 'High' ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50" :
        severity === 'Medium' ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50" :
        "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50"
      )}>
        {severity}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full text-slate-900 dark:text-white pb-6 space-y-6">
      
      {/* Top Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Suppliers', count: entitiesList.filter(e => e.type === 'Supplier').length, icon: Truck, color: 'text-purple-500' },
          { label: 'Materials', count: entitiesList.filter(e => e.type === 'Material').length, icon: Box, color: 'text-blue-500' },
          { label: 'Plants', count: entitiesList.filter(e => e.type === 'Plant').length, icon: Factory, color: 'text-indigo-500' },
          { label: 'Products', count: entitiesList.filter(e => e.type === 'Product').length, icon: Package, color: 'text-emerald-500' },
          { label: 'Customers', count: entitiesList.filter(e => e.type === 'Customer').length, icon: Users, color: 'text-amber-500' },
        ].map((m, i) => (
          <div key={i} className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center justify-between cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{m.label}</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{m.count}</div>
            </div>
            <div className={`p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 ${m.color}`}>
              <m.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Area */}
      <div className="flex-1 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50 dark:bg-[#0f1522]">
          <div className="flex space-x-1 bg-slate-200/50 dark:bg-slate-800 p-1 rounded-lg">
            {['All', 'Supplier', 'Materials', 'Plants', 'Products', 'Customers'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-1.5 rounded-md text-xs font-bold transition-all",
                  activeTab === tab 
                    ? "bg-white dark:bg-[#1e293b] shadow-sm text-blue-600 dark:text-blue-400" 
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/50"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex space-x-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search entities..." 
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
            <button className="flex items-center px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </button>
            <button className="flex items-center px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
              <ArrowDownToLine className="w-4 h-4 mr-2" /> Export
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-6 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50"><div className="flex items-center">Entity <ChevronDown className="w-3 h-3 ml-1" /></div></th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Direct Impact</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredEntities.map((entity, i) => (
                <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="py-3 px-6">
                    <div className="flex items-center">
                      <div className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer mr-3 w-20">{entity.id}</div>
                      <div className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{entity.name}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <div className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-2 border border-slate-200 dark:border-slate-700">
                        {getIcon(entity.type)}
                      </div>
                      {entity.type}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                      {entity.severity === 'Critical' && <AlertTriangle className="w-3.5 h-3.5 text-red-500 mr-1.5" />}
                      {entity.impact}
                    </div>
                  </td>
                  <td className="py-3 px-4">{getSeverityBadge(entity.severity)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-[10px] font-bold mr-2">
                        {entity.owner.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{entity.owner}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      {entity.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredEntities.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Search className="w-8 h-8 mb-3 opacity-20" />
              <p className="font-medium text-sm">No entities found for this filter.</p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#0f1522] text-xs font-semibold text-slate-500">
          <div>Showing 1 to {filteredEntities.length} of {filteredEntities.length} entries</div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">1</button>
            <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700">2</button>
            <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
