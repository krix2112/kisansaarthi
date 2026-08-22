import Link from 'next/link';

export default function WebHomePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-emerald-900">Farmer Web Portal</h2>
      <p className="text-slate-700">Read-only web fallback for tracking procurement status and mandi queue.</p>
      <div className="flex gap-4">
        <Link href="/status" className="px-4 py-2 bg-emerald-600 text-white rounded font-medium hover:bg-emerald-700">
          View Status (/status)
        </Link>
        <Link href="/queue" className="px-4 py-2 bg-emerald-600 text-white rounded font-medium hover:bg-emerald-700">
          View Queue (/queue)
        </Link>
      </div>
    </div>
  );
}
