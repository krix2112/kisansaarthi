'use client';

import { useState } from 'react';
import { useDashboard } from '@/src/context/DashboardContext';
import { StatusBadge, StatusVocabulary } from '@/components/StatusBadge';
import { slotTime } from '@/src/lib/mockData';

type FilterTab = 'ALL' | 'IN_QUEUE' | 'PROCURED' | 'PAYMENT_PENDING';

const FILTER_TABS: { label: string; key: FilterTab }[] = [
  { label: 'All',            key: 'ALL' },
  { label: 'In Queue',       key: 'IN_QUEUE' },
  { label: 'Procured',       key: 'PROCURED' },
  { label: 'Payment Pending',key: 'PAYMENT_PENDING' },
];

function StatCard({ label, value, accent }: { label: string; value: string | number; accent: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 ${accent}`}>
      <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
    </div>
  );
}

export default function TodayPage() {
  const { records, currentToken } = useDashboard();
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');

  const total       = records.length;
  const completed   = records.filter(r => ['PROCURED','PAYMENT_PROCESSING','PAID'].includes(r.booking.status)).length;
  const payPending  = records.filter(r => r.booking.status === 'PROCURED').length;

  const filtered = records.filter(r => {
    if (activeTab === 'ALL')             return true;
    if (activeTab === 'IN_QUEUE')        return r.booking.status === 'IN_QUEUE';
    if (activeTab === 'PROCURED')        return r.booking.status === 'PROCURED';
    if (activeTab === 'PAYMENT_PENDING') return r.booking.status === 'PROCURED';
    return true;
  }).sort((a, b) => a.booking.token - b.booking.token);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Today's Overview</h1>
        <p className="text-slate-500 text-sm mt-1">All farmer records for today's procurement session.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Farmers"         value={total}         accent="border-l-4 border-l-blue-500" />
        <StatCard label="Now Serving Token #"   value={currentToken}  accent="border-l-4 border-l-amber-400" />
        <StatCard label="Completed"             value={completed}     accent="border-l-4 border-l-teal-500" />
        <StatCard label="Payment Pending"       value={payPending}    accent="border-l-4 border-l-purple-500" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-blue-900 text-white shadow'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Farmer table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {['Token #','Name','Village','Crop','Slot Time','Status','Payment'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(r => {
              const payStatus: StatusVocabulary | null =
                r.booking.status === 'PAYMENT_PROCESSING' ? 'PAYMENT_PROCESSING'
                : r.booking.status === 'PAID' ? 'PAID'
                : null;

              return (
                <tr key={r.booking.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-blue-900">#{r.booking.token}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{r.farmer.name}</td>
                  <td className="px-4 py-3 text-slate-500">{r.farmer.village}</td>
                  <td className="px-4 py-3 capitalize text-slate-600">{r.farmer.crop}</td>
                  <td className="px-4 py-3 text-slate-500 tabular-nums">
                    {slotTime(r.booking.token - 1).split(' ')[1]}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.booking.status} />
                  </td>
                  <td className="px-4 py-3">
                    {payStatus ? <StatusBadge status={payStatus} /> : <span className="text-slate-300">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
