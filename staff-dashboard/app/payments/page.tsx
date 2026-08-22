import { StatusBadge } from '@/components/StatusBadge';

export default function PaymentsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Payments & Proof Tracking (/payments)</h2>
      <div className="p-4 bg-white rounded shadow space-y-2">
        <p className="text-slate-600">Placeholder for payment status and blockchain anchoring.</p>
        <div className="flex gap-2">
          <StatusBadge status="PAYMENT_PROCESSING" />
          <StatusBadge status="PAID" />
        </div>
      </div>
    </div>
  );
}
