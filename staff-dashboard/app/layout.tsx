import type { Metadata } from 'next';
import './globals.css';
import { Inter, Noto_Sans_Devanagari } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSansDevanagari = Noto_Sans_Devanagari({
  weight: ['400', '700'],
  subsets: ['devanagari'],
  variable: '--font-noto-devanagari',
});

export const metadata: Metadata = {
  title: 'KisanSaarthi Staff Portal',
  description: 'Mandi operations and procurement management dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSansDevanagari.variable}`}>
      <body className="min-h-screen font-sans antialiased m-0 p-0 flex flex-col h-screen overflow-hidden bg-government-bg text-government-text">
        {/* Government header strip */}
        <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-green-600 shrink-0" />
        <header className="bg-white border-b border-government-border text-government-primary py-2 px-4 md:px-6 flex justify-between items-center text-sm font-semibold shrink-0 z-50">
          <div>Department of Consumer Affairs &middot; KisanCall</div>
          <div>EN / हिं</div>
        </header>
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
