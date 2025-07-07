'use client';

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

interface WatchlistRow {
  id: number;
  title: string;
  poster_url: string | null;
  platform: string | null;
}

export default function WatchlistPage() {
  const [user, setUser] = useState<User | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Auth check ───────────────────────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_e, session) =>
      setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  // ── Fetch watchlist ──────────────────────────
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchWatchlist = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('watchlist')
          .select('id, title, poster_url, platform')
          .eq('user_id', user.id)
          .order('id', { ascending: false });

        if (error) throw error;
        setWatchlist(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [user]);

  // ── UI states ────────────────────────────────
  if (!user)
    return (
      <p className="p-6">
        You must be signed in to view your watchlist.{' '}
        <a href="/auth" className="text-orange-600 underline">
          Sign in
        </a>
      </p>
    );

  if (loading) return <p className="p-6">Loading…</p>;
  if (error)
    return (
      <p className="p-6 text-red-600">Error loading watchlist: {error}</p>
    );
  if (watchlist.length === 0)
    return (
      <p className="p-6">
        Your list is empty. Browse titles and click “Add to Watchlist”.
      </p>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Currently Watching</h1>
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {watchlist.map((item) => (
          <div key={item.id} className="bg-white rounded shadow flex flex-col">
            {item.poster_url ? (
              <img
                src={item.poster_url}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-sm">
                No Image
              </div>
            )}
            <div className="flex-1 p-3 flex flex-col">
              <span className="font-medium text-sm">{item.title}</span>
              {item.platform && (
                <span className="text-xs text-gray-600 mt-1">
                  📺 {item.platform}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

