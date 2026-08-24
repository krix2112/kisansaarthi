import React from 'react';
import './globals.css';
import { Inter, Noto_Sans_Devanagari } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSansDevanagari = Noto_Sans_Devanagari({
  weight: ['400', '700'],
  subsets: ['devanagari'],
  variable: '--font-noto-devanagari',
});

export const metadata = {
  title: 'KisanCall Farmer Portal',
  description: 'Department of Consumer Affairs · KisanCall',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSansDevanagari.variable}`}>
      <body className="min-h-screen bg-government-bg text-government-text font-sans antialiased flex flex-col">
        {/* Government header strip */}
        <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-green-600" />
        <header className="bg-white border-b border-government-border text-government-primary py-2 px-4 md:px-6 flex justify-between items-center text-sm font-semibold">
          <div>Department of Consumer Affairs &middot; KisanCall</div>
          <div>EN / हिं</div>
        </header>
        
        {children}
      </body>
    </html>
  );
}
