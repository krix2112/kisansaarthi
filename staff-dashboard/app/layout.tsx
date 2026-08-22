import type { Metadata } from 'next';
import './globals.css';
import { DashboardProvider } from '@/src/context/DashboardContext';
import { Sidebar } from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'KisanSaarthi Staff Portal',
  description: 'Mandi operations and procurement management dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        <DashboardProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">{children}</main>
          </div>
        </DashboardProvider>
      </body>
    </html>
  );
}
