import React from 'react';

export const metadata = {
  title: 'KisanSaarthi Farmer Web Portal',
  description: 'Fallback web view for farmers to check queue and status',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-emerald-50 text-slate-900 font-sans antialiased">
        <header className="bg-emerald-800 text-white p-4">
          <h1 className="text-xl font-bold">KisanSaarthi Farmer Web Status</h1>
        </header>
        <main className="p-6 max-w-4xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
