'use client';

import { useQueue } from '@/src/context/DashboardContext';
import { StatusBadge } from '@/components/StatusBadge';
import { slotTime } from '@/src/lib/mockData';

export default function QueuePage() {
  const { queued, serving, currentToken, callNext } = useQueue();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Live Mandi Queue</h1>
        <p className="text-slate-500 text-sm mt-1">Manage real-time queue at the procurement window.</p>
      </div>

      {/* Now Serving hero */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-3xl p-10 text-white shadow-xl flex flex-col items-center gap-6">
        <p className="text-blue-200 text-sm uppercase tracking-widest font-semibold">Now Serving</p>
        <div className="text-[5rem] font-black leading-none tracking-tight">
          #{currentToken}
        </div>
        {serving && (
          <div className="text-center">
            <p className="text-xl font-bold">{serving.farmer.name}</p>
            <p className="text-blue-300 text-sm">{serving.farmer.village} · {serving.farmer.crop}</p>
          </div>
        )}
        <button
          onClick={callNext}
          disabled={queued.length < 2}
          className="mt-2 bg-white text-blue-900 font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-blue-50 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-base"
        >
          Call Next →
        </button>
        {queued.length < 2 && (
          <p className="text-blue-300 text-xs">No more farmers in queue</p>
        )}
      </div>

      {/* Queue list */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-700">
            Waiting ({queued.length} farmers)
          </h2>
        </div>
        {queued.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-400 text-sm">
            No farmers currently in queue.
          </div>
        ) : (
          <ul className="divide-y divide-slate-50">
            {queued.map((r, idx) => (
              <li
                key={r.booking.id}
                className={`flex items-center gap-4 px-6 py-4 ${
                  r.booking.token === currentToken ? 'bg-amber-50' : 'hover:bg-slate-50'
                } transition-colors`}
              >
                {/* Position */}
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  idx === 0 ? 'bg-amber-400 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {idx + 1}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">
                    #{r.booking.token} · {r.farmer.name}
                  </p>
                  <p className="text-xs text-slate-500">{r.farmer.village} · {r.farmer.crop} · Slot {slotTime(r.booking.token - 1).split(' ')[1]}</p>
                </div>

                <StatusBadge status="IN_QUEUE" />

                {idx === 0 && (
                  <span className="ml-2 text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                    At window
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
