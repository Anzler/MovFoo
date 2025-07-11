// ~/Projects/movfoo/app/movies/watchlist/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { Database } from '@/lib/supabase.types';

type WatchlistRow = Database['public']['Tables']['watchlist']['Row'];

export default function WatchlistPage() {
  const router = useRouter();
  const [watchlist, setWatchlist] = useState<WatchlistRow[]>([]);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // ── Auth check ───────────────────────────────
  useEffect(() => {
    supabase!.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
      } else {
        router.push('/auth');
      }
    });
  }, [router]);

  // ── Fetch data ───────────────────────────────
  useEffect(() => {
    if (!user) return;

    const fetchWatchlist = async () => {
      try {
        const { data, error } = await supabase!
          .from('watchlist')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        setWatchlist(data || []);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchWatchlist();
  }, [user]);

  if (error) {
    return <div className="text-center text-red-600 mt-10">Error: {error}</div>;
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">📺 Your Watchlist</h1>
      {watchlist.length === 0 ? (
        <p className="text-gray-500">You have nothing in your watchlist yet.</p>
      ) : (
        <ul className="space-y-4">
          {watchlist.map((item) => (
            <li key={item.id} className="border rounded p-4 shadow">
              <h2 className="font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-600">{item.type} on {item.service}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

