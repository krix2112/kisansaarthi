import { StatusBadge } from '@/components/StatusBadge';

export default function ArrivalsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Farmer Arrivals (/arrivals)</h2>
      <div className="p-4 bg-white rounded shadow">
        <p className="text-slate-600">Placeholder for farmer arrival check-in logging.</p>
        <div className="mt-2">
          <StatusBadge status="ARRIVED" />
        </div>
      </div>
    </div>
  );
}
