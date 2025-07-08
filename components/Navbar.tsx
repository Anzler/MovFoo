'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    // Get user session
    supabase.auth.getUser().then(
      ({ data }: { data: { user: User | null } }) => {
        setEmail(data.user?.email ?? null);
      }
    );

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setEmail(session?.user?.email ?? null);
      }
    );

    // Ping backend for health check
    const pingBackend = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/`);
        setApiHealthy(res.ok);
      } catch {
        setApiHealthy(false);
      }
    };

    pingBackend();

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
          <li title="Backend API status">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                apiHealthy === null
                  ? 'bg-gray-300'
                  : apiHealthy
                  ? 'bg-green-500'
                  : 'bg-red-500'
              }`}
            ></span>
          </li>
        </ul>
      </nav>
    </header>
  );
}

