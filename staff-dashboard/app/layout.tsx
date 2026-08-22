import React from 'react';

export const metadata = {
  title: 'KisanSaarthi Staff Portal',
  description: 'Mandi operations and procurement management dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        <header className="bg-emerald-700 text-white p-4 shadow-md">
          <h1 className="text-xl font-bold">KisanSaarthi Mandi Staff Portal</h1>
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
