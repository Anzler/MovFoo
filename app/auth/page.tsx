'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'; // path adjusted if needed

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    if (!supabase) {
      console.warn('Supabase client is not available');
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.push('/movies/watchlist');
      }
    });
  }, [router]);

  return (
    <main className="text-center py-20">
      <h1 className="text-3xl font-bold">Sign In</h1>
      <p className="text-gray-600 mt-2">Please log in to continue.</p>
      {/* Insert your login form or provider buttons here */}
    </main>
  );
}

