import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'MovFoo – Dinner & a Movie',
  description: 'Quiz‑powered movie & food picks'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="mx-auto max-w-5xl px-4">{children}</main>
      </body>
    </html>
  );
}

