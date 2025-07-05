import './globals.css';
export const metadata = { title: 'MovFoo', description: 'Dinner & a Movie helper' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
