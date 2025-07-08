'use client';

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

interface WatchlistRow {
  id: number;
  title: string;
  service: string | null;
  type: string;
}

export default function WatchlistPage() {
  const [user, setUser] = useState<User | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Auth check ───────────────────────────────
  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }: { data: { user: User | null } }) => {
        setUser(data.user);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
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
          .select('id, title, service, type')
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
    return <p className="p-6 text-red-600">Error loading watchlist: {error}</p>;
  if (watchlist.length === 0)
    return (
      <p className="p-6">
        Your list is empty. Browse titles and click “Add to Watchlist”.
      </p>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Watchlist</h1>
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {watchlist.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded shadow p-4 flex flex-col justify-between"
          >
            <div className="text-sm font-medium">{item.title}</div>
            <div className="text-xs text-gray-600 mt-2">
              {item.service ? `📺 ${item.service}` : '—'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

