'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MANDI_NAME } from '@/src/lib/mockData';

const NAV_ITEMS = [
  { href: '/today',       label: 'Today',       icon: '🌾' },
  { href: '/queue',       label: 'Live Queue',  icon: '🔢' },
  { href: '/arrivals',    label: 'Arrivals',    icon: '✅' },
  { href: '/procurement', label: 'Procurement', icon: '⚖️' },
  { href: '/payments',    label: 'Payments',    icon: '💰' },
];

export function Sidebar() {
  const pathname = usePathname();
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <aside className="w-64 min-h-screen bg-blue-900 text-white flex flex-col shadow-xl">
      {/* Branding */}
      <div className="px-6 py-5 border-b border-blue-700">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🌱</span>
          <span className="font-bold text-lg tracking-tight">KisanSaarthi</span>
        </div>
        <p className="text-blue-300 text-xs font-medium truncate">{MANDI_NAME}</p>
        <p className="text-blue-400 text-xs mt-1">{today}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-700 text-white shadow'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-blue-700 text-blue-400 text-xs">
        Staff Portal v0.1 · SIH 2026
      </div>
    </aside>
  );
}
