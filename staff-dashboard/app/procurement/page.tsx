'use client';

import { useState } from 'react';
import { useProcurement } from '@/src/context/DashboardContext';
import { StatusBadge } from '@/components/StatusBadge';
import { MANDI_PRICE_PER_QUINTAL } from '@/src/lib/mockData';

export default function ProcurementPage() {
  const { serving, markProcured } = useProcurement();
  const [quantity, setQuantity] = useState('');
  const [grade, setGrade] = useState<'A' | 'B' | 'C'>('A');
  const [submitted, setSubmitted] = useState(false);

  const qty = parseFloat(quantity) || 0;
  const amount = qty * MANDI_PRICE_PER_QUINTAL;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!serving || qty <= 0) return;
    markProcured(serving.booking.id, qty, grade);
    setSubmitted(true);
    setQuantity('');
  }

  const isAlreadyProcured = serving?.booking.status === 'PROCURED'
    || serving?.booking.status === 'PAYMENT_PROCESSING'
    || serving?.booking.status === 'PAID';

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Procurement Window</h1>
        <p className="text-slate-500 text-sm mt-1">Record weight and quality for the current farmer being served.</p>
      </div>

      {/* Current farmer */}
      {serving ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-medium mb-1">Current Farmer</p>
              <h2 className="text-xl font-bold text-slate-800">#{serving.booking.token} · {serving.farmer.name}</h2>
              <p className="text-slate-500 text-sm">{serving.farmer.village}, {serving.farmer.district}</p>
              <p className="text-slate-500 text-sm capitalize mt-0.5">Crop: <span className="font-medium text-slate-700">{serving.farmer.crop}</span></p>
            </div>
            <StatusBadge status={serving.booking.status} />
          </div>

          {/* Price banner */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-800 mb-6">
            📊 <strong>MSP Rate:</strong> ₹{MANDI_PRICE_PER_QUINTAL.toLocaleString('en-IN')}/quintal &nbsp;·&nbsp;
            <span className="text-blue-600">Source: Agmarknet, ₹2,600/quintal wheat</span>
          </div>

          {isAlreadyProcured ? (
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-teal-800 text-sm font-medium">
              ✅ Procurement already recorded for this farmer.
              {serving.procurement && (
                <p className="mt-1 text-teal-700">
                  {serving.procurement.quantity_quintals} qtl · Grade {serving.procurement.quality_grade} · ₹{serving.procurement.amount.toLocaleString('en-IN')}
                </p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Quantity (quintals)
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  placeholder="e.g. 15.5"
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Quality Grade</label>
                <div className="flex gap-3">
                  {(['A', 'B', 'C'] as const).map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGrade(g)}
                      className={`w-12 h-12 rounded-xl font-bold text-base transition-all ${
                        grade === g
                          ? 'bg-blue-900 text-white shadow-md scale-105'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {qty > 0 && (
                <div className="bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-700">
                  Estimated amount: <span className="font-bold text-slate-900 text-base">₹{amount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={qty <= 0}
                className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl hover:bg-blue-800 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                ⚖️ Mark Procured
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center text-slate-400 text-sm">
          No farmer is currently being served at the window.
          <br />
          Go to <strong>Live Queue</strong> to advance the queue.
        </div>
      )}
    </div>
  );
}
