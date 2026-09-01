'use client';
import { useSimulationStore } from '@/stores/useSimulationStore';
import { formatCurrency } from '@/lib/utils';

export function OrderImpactTable() {
  const { activeDisruption } = useSimulationStore();
  if (!activeDisruption?.affected_orders) return null;

  const orders = activeDisruption.affected_orders;

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
        <h3 className="font-semibold text-slate-900">Orders at Risk</h3>
        <p className="text-xs text-slate-500">Customer orders impacted by downstream shortages</p>
      </div>
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 border-b border-slate-200 z-10">
            <tr>
              <th className="px-6 py-3 font-semibold">Order ID</th>
              <th className="px-6 py-3 font-semibold">Product</th>
              <th className="px-6 py-3 font-semibold text-right">Shortfall Qty</th>
              <th className="px-6 py-3 font-semibold text-right">Revenue at Risk</th>
              <th className="px-6 py-3 font-semibold text-center">Priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {orders.map((o: any, i: number) => (
              <tr key={i} className="bg-white hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{o.order_id}</td>
                <td className="px-6 py-4 text-slate-600">{o.product_id}</td>
                <td className="px-6 py-4 text-right font-medium text-red-600">{o.shortfall_quantity.toLocaleString()}</td>
                <td className="px-6 py-4 text-right font-bold text-slate-900">{formatCurrency(o.revenue_at_risk)}</td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded">HIGH</span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No orders affected.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
