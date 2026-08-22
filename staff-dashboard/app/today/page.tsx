import { StatusBadge } from '@/components/StatusBadge';

export default function TodayPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Today's Active Schedule (/today)</h2>
      <div className="p-4 bg-white rounded shadow">
        <p className="text-slate-600">Placeholder for today's procurement slot entries.</p>
        <div className="mt-2">
          <StatusBadge status="BOOKED" />
        </div>
      </div>
    </div>
  );
}
