'use client';

import { useApiData } from '../../hooks/useApiData';

interface Farmer {
  id: string;
  name: string;
  phone: string;
  crop: string;
}

export default function TodayPage() {
  // Fetches live farmers from backend API
  const { data: farmers, loading, error } = useApiData<Farmer[]>('/farmers');

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-slate-500">
        <p>Loading today's farmers…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
          <p className="font-semibold">Couldn't reach the backend</p>
          <p className="text-sm mt-1">Check that the Fastify server is running at the configured API URL ({process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}).</p>
        </div>
      </div>
    );
  }

  if (!farmers || farmers.length === 0) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-slate-500">
        <p>No farmers registered yet. Post a new farmer to <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">/farmers</code> to see them here.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Today's Farmers</h1>
          <p className="text-sm text-slate-500 mt-1">Live farmer directory fetched from backend API</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full text-xs font-semibold text-green-700 dark:text-green-400">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          API Connected
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-5 border-b border-slate-100 dark:border-slate-800">Farmer Name</th>
              <th className="py-3 px-5 border-b border-slate-100 dark:border-slate-800">Phone</th>
              <th className="py-3 px-5 border-b border-slate-100 dark:border-slate-800">Crop</th>
            </tr>
          </thead>
          <tbody>
            {farmers.map((farmer) => (
              <tr key={farmer.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-sm">
                <td className="py-3 px-5 font-semibold text-slate-900 dark:text-white">{farmer.name || 'Unnamed'}</td>
                <td className="py-3 px-5 text-slate-600 dark:text-slate-400 font-mono text-xs">{farmer.phone}</td>
                <td className="py-3 px-5">
                  <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {farmer.crop || 'Mixed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
