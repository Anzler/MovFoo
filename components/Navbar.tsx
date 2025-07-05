'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setEmail(session?.user?.email ?? null);
      });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="bg-white shadow mb-6">
      <nav className="mx-auto max-w-5xl px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-orange-600">MovFoo</Link>
        <ul className="flex items-center gap-4 text-sm">
          <li><Link href="/movies/quiz" className="hover:underline">Quiz</Link></li>
          <li><Link href="/movies/watchlist" className="hover:underline">Watchlist</Link></li>
          {email ? (
            <>
              <li className="text-gray-700">{email}</li>
              <li>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  Sign out
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                href="/auth"
                className="px-3 py-1 bg-orange-500 text-white rounded"
              >
                Sign in
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

