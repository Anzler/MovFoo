'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { AuthResponse } from '@supabase/supabase-js'; // ✅ Import the type

export default function AuthPage() {
  const router = useRouter();

  // ✅ Fix type error by explicitly typing `data`
  useEffect(() => {
    supabase.auth.getUser().then(({ data }: AuthResponse) => {
      if (data.user) router.push('/movies/watchlist');
    });
  }, [router]);

  return (
    <section className="max-w-md mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Welcome to MovFoo</h1>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google']} // Add other providers as needed
        redirectTo={typeof window !== 'undefined' ? location.origin : undefined}
      />
    </section>
  );
}

