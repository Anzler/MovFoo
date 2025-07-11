'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      console.warn('⚠️ Supabase client is not available.');
      return;
    }

    supabase.auth.getUser().then(
      ({ data }: { data: { user: User | null } }) => {
        setEmail(data.user?.email ?? null);
      }
    );
  }, []);

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-100 shadow">
      <h1 className="text-xl font-bold">🎬 MovFoo</h1>
      {email ? (
        <p className="text-sm text-gray-700">Logged in as {email}</p>
      ) : (
        <p className="text-sm text-gray-500">Not logged in</p>
      )}
    </nav>
  );
}

