'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, PhoneCall, List, TrendingUp, User } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/farmer/home', icon: Home },
  { name: 'Register', href: '/farmer/register', icon: FileText },
  { name: 'Call Agent', href: '/farmer/call-agent', icon: PhoneCall },
  { name: 'Queue', href: '/farmer/queue', icon: List },
  { name: 'Price', href: '/farmer/price', icon: TrendingUp },
  { name: 'Profile', href: '/farmer/profile', icon: User },
];

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't show sidebar on login page
  if (pathname === '/farmer/login') return children;

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-government-bg">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-government-border">
        <div className="p-4 border-b border-government-border bg-government-primary text-white">
          <div className="font-semibold">Farmer Portal</div>
          <div className="text-sm opacity-80">Ramesh Kumar</div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${active ? 'bg-emerald-50 text-government-primary border-r-2 border-government-primary' : 'text-government-text-secondary hover:bg-gray-50'}`}
              >
                <Icon size={18} strokeWidth={1.5} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto pb-16 md:pb-0">
        <div className="bg-government-primary text-white py-3.5 px-6 border-b border-emerald-900/30 flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-white/10 flex items-center justify-center font-bold text-xs border border-white/20">
              KS
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight leading-none text-white">किसानसारथी (KisanSaarthi)</h2>
              <p className="text-[11px] text-emerald-100/80 mt-0.5 font-medium">Farmer Self-Service Portal · Government of Madhya Pradesh</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold bg-emerald-900/40 px-3 py-1 rounded border border-white/10 text-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Portal Active</span>
          </div>
        </div>
        <div className="p-4 md:p-6 flex-1 max-w-5xl w-full mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Nav (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-government-border flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-1 w-full text-xs font-medium ${active ? 'text-government-primary' : 'text-government-text-secondary'}`}
            >
              <Icon size={20} strokeWidth={1.5} className="mb-1" />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
