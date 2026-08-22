import Link from 'next/link';

export default function StaffHomePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-800">Staff Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/today" className="p-4 bg-white rounded shadow hover:shadow-md transition">
          <h3 className="font-semibold text-lg text-emerald-700">Today's Schedule</h3>
          <p className="text-sm text-slate-600">View active slots and scheduled arrivals</p>
        </Link>
        <Link href="/queue" className="p-4 bg-white rounded shadow hover:shadow-md transition">
          <h3 className="font-semibold text-lg text-emerald-700">Live Mandi Queue</h3>
          <p className="text-sm text-slate-600">Manage queue progression and ETAs</p>
        </Link>
        <Link href="/arrivals" className="p-4 bg-white rounded shadow hover:shadow-md transition">
          <h3 className="font-semibold text-lg text-emerald-700">Farmer Arrivals</h3>
          <p className="text-sm text-slate-600">Check in arriving farmers</p>
        </Link>
        <Link href="/procurement" className="p-4 bg-white rounded shadow hover:shadow-md transition">
          <h3 className="font-semibold text-lg text-emerald-700">Procurement Entry</h3>
          <p className="text-sm text-slate-600">Record crop weights and quality grades</p>
        </Link>
        <Link href="/payments" className="p-4 bg-white rounded shadow hover:shadow-md transition">
          <h3 className="font-semibold text-lg text-emerald-700">Payment Status</h3>
          <p className="text-sm text-slate-600">Track payouts and proof anchoring</p>
        </Link>
      </div>
    </div>
  );
}
