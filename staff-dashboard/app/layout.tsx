import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KisanSaarthi Staff Portal',
  description: 'Mandi operations and procurement management dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased m-0 p-0">
        {children}
      </body>
    </html>
  );
}
