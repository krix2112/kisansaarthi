import { StatusBadge } from '@/components/StatusBadge';

export default function QueuePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Live Mandi Queue (/queue)</h2>
      <div className="p-4 bg-white rounded shadow">
        <p className="text-slate-600">Placeholder for real-time queue management.</p>
        <div className="mt-2">
          <StatusBadge status="IN_QUEUE" />
        </div>
      </div>
    </div>
  );
}
