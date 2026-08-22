import { StatusBadge } from '@/components/StatusBadge';

export default function ProcurementPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Procurement Recording (/procurement)</h2>
      <div className="p-4 bg-white rounded shadow">
        <p className="text-slate-600">Placeholder for crop weighing and grading entries.</p>
        <div className="mt-2">
          <StatusBadge status="PROCURED" />
        </div>
      </div>
    </div>
  );
}
