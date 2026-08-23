'use client';

import { useRealtimeTable } from '../../hooks/useRealtimeTable';

interface QueueEvent {
  id: string;
  farmer_id: string;
  slot_id: string;
  queue_position: number | null;
  queue_eta_minutes: number | null;
  event_type: string;
  created_at: string;
}

export default function QueuePage() {
  const { rows: queueEvents, loading, error } = useRealtimeTable<QueueEvent>('queue_events');

  if (loading) return <div className="p-8 text-slate-500">Loading queue…</div>;
  if (error) return <div className="p-8 text-red-500">Couldn't load the queue — check the Supabase connection.</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Live Queue Monitor</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time Supabase replication feed for token queue events</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full text-xs font-semibold text-green-700 dark:text-green-400">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Realtime Connected
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-5 border-b border-slate-100 dark:border-slate-800">Event ID</th>
              <th className="py-3 px-5 border-b border-slate-100 dark:border-slate-800">Farmer ID</th>
              <th className="py-3 px-5 border-b border-slate-100 dark:border-slate-800">Position</th>
              <th className="py-3 px-5 border-b border-slate-100 dark:border-slate-800">ETA (min)</th>
              <th className="py-3 px-5 border-b border-slate-100 dark:border-slate-800">Status</th>
              <th className="py-3 px-5 border-b border-slate-100 dark:border-slate-800">Time</th>
            </tr>
          </thead>
          <tbody>
            {queueEvents.map((event) => (
              <tr key={event.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-sm">
                <td className="py-3 px-5 font-mono text-xs text-slate-400">{event.id ? event.id.slice(0, 8) : '—'}...</td>
                <td className="py-3 px-5 font-medium text-slate-900 dark:text-white">{event.farmer_id}</td>
                <td className="py-3 px-5 font-bold text-blue-900 dark:text-blue-400">{event.queue_position ?? '—'}</td>
                <td className="py-3 px-5 text-slate-600 dark:text-slate-400">{event.queue_eta_minutes ?? '—'}</td>
                <td className="py-3 px-5">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {event.event_type}
                  </span>
                </td>
                <td className="py-3 px-5 text-xs text-slate-400">
                  {event.created_at ? new Date(event.created_at).toLocaleTimeString() : '—'}
                </td>
              </tr>
            ))}
            {queueEvents.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 text-sm">
                  No queue events recorded yet. Insert a row in Supabase <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">queue_events</code> to see live updates.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
