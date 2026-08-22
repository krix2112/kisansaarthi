'use client';

import { useArrivals } from '@/src/context/DashboardContext';
import { StatusBadge } from '@/components/StatusBadge';
import { slotTime } from '@/src/lib/mockData';

export default function ArrivalsPage() {
  const { booked, arrived, markArrived } = useArrivals();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Farmer Arrivals</h1>
        <p className="text-slate-500 text-sm mt-1">Check in farmers as they arrive at the mandi gate.</p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5 border-l-4 border-l-blue-500">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Awaiting Arrival</p>
          <p className="text-3xl font-bold text-blue-900">{booked.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-5 border-l-4 border-l-indigo-500">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Arrived & Queued</p>
          <p className="text-3xl font-bold text-indigo-900">{arrived.length}</p>
        </div>
      </div>

      {/* Booked — pending arrival */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
          <h2 className="font-semibold text-slate-700">Booked — Not Yet Arrived</h2>
        </div>
        {booked.length === 0 ? (
          <p className="px-6 py-10 text-center text-slate-400 text-sm">All booked farmers have arrived.</p>
        ) : (
          <ul className="divide-y divide-slate-50">
            {booked.map(r => (
              <li key={r.booking.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800">
                    #{r.booking.token} · {r.farmer.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {r.farmer.village}, {r.farmer.district} · {r.farmer.crop} · Slot {slotTime(r.booking.token - 1).split(' ')[1]}
                  </p>
                </div>
                <StatusBadge status="BOOKED" />
                <button
                  onClick={() => markArrived(r.booking.id)}
                  className="ml-4 bg-blue-900 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-800 active:scale-95 transition-all shadow-sm"
                >
                  ✓ Mark Arrived
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Already arrived */}
      {arrived.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 bg-indigo-50 border-b border-indigo-100">
            <h2 className="font-semibold text-indigo-800">Arrived — Moved to Queue</h2>
          </div>
          <ul className="divide-y divide-slate-50">
            {arrived.map(r => (
              <li key={r.booking.id} className="flex items-center gap-4 px-6 py-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800">#{r.booking.token} · {r.farmer.name}</p>
                  <p className="text-xs text-slate-500">{r.farmer.village} · {r.farmer.crop}</p>
                </div>
                <StatusBadge status="ARRIVED" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
