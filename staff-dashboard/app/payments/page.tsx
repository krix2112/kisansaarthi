'use client';

import { usePayments } from '@/src/context/DashboardContext';
import { StatusBadge } from '@/components/StatusBadge';

export default function PaymentsPage() {
  const { payable, triggerPayment } = usePayments();

  const paid       = payable.filter(r => r.booking.status === 'PAID');
  const processing = payable.filter(r => r.booking.status === 'PAYMENT_PROCESSING');
  const pending    = payable.filter(r => r.booking.status === 'PROCURED');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Payments</h1>
        <p className="text-slate-500 text-sm mt-1">Trigger DBT payments for procured farmers and track status.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending Payment', value: pending.length,    accent: 'border-l-purple-500' },
          { label: 'Processing',      value: processing.length, accent: 'border-l-amber-400' },
          { label: 'Paid',            value: paid.length,       accent: 'border-l-emerald-500' },
        ].map(c => (
          <div key={c.label} className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-5 border-l-4 ${c.accent}`}>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{c.label}</p>
            <p className="text-3xl font-bold text-slate-800">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Payments table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {['Token','Name','Village','Crop','Quantity (qtl)','Amount (₹)','Status','Action'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {payable.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-400 text-sm">
                  No farmers ready for payment yet.
                </td>
              </tr>
            ) : (
              payable.map(r => {
                const isPending    = r.booking.status === 'PROCURED';
                const isProcessing = r.booking.status === 'PAYMENT_PROCESSING';
                const isPaid       = r.booking.status === 'PAID';

                return (
                  <tr key={r.booking.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-blue-900">#{r.booking.token}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{r.farmer.name}</td>
                    <td className="px-4 py-3 text-slate-500">{r.farmer.village}</td>
                    <td className="px-4 py-3 capitalize text-slate-600">{r.farmer.crop}</td>
                    <td className="px-4 py-3 tabular-nums text-slate-700">
                      {r.procurement?.quantity_quintals ?? '—'}
                    </td>
                    <td className="px-4 py-3 tabular-nums font-semibold text-slate-800">
                      {r.procurement ? `₹${r.procurement.amount.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.booking.status} />
                      {isPaid && r.payment?.reference && (
                        <p className="text-xs text-slate-400 mt-1">Ref: {r.payment.reference}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isPending && (
                        <button
                          onClick={() => triggerPayment(r.booking.id)}
                          className="bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-600 active:scale-95 transition-all shadow-sm"
                        >
                          💳 Trigger Payment
                        </button>
                      )}
                      {isProcessing && (
                        <span className="flex items-center gap-1.5 text-purple-600 text-xs font-semibold">
                          <span className="animate-spin inline-block w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full" />
                          Processing…
                        </span>
                      )}
                      {isPaid && (
                        <span className="text-emerald-600 text-xs font-semibold">✔ Paid</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
