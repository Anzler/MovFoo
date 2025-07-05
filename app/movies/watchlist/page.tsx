/* ──────────────────────────────────────────────────────────────
   FRONTEND FILE: app/movies/watchlist/page.tsx
   Purpose  : Movies / TV  ➜  “Currently Watching” list
   Framework: Next.js 13 (App Router, client component)
   Styling  : Tailwind CSS
──────────────────────────────────────────────────────────────── */

'use client';

import { useEffect, useState } from 'react';
import { createClient, User } from '@supabase/supabase-js';

// ── Supabase client ────────────────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

// ── Types ──────────────────────────────────────────────────────
interface MovieRow {
  id: number;
  title: string;
  poster_url: string | null;
}

interface WatchlistRow {
  id: number;
  content_id: number;
  streaming_service: string | null;
  movies: MovieRow | null;             // joined record
}

export default function WatchlistPage() {
  const [user, setUser] = useState<User | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Get current user on mount ───────────────────────────────
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        setError(error.message);
      }
      setUser(user);
    };
    getUser();
  }, []);

  // ── Fetch watchlist once we have a user ─────────────────────
  useEffect(() => {
    if (!user) return;

    const fetchWatchlist = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_watchlist')
          .select(
            `
            id,
            content_id,
            streaming_service,
            movies (
              id,
              title,
              poster_url
            )
          `
          )
          .eq('user_id', user.id)
          .order('id', { ascending: false });

        if (error) throw error;
        setWatchlist((data as WatchlistRow[]) ?? []);
      } catch (err: any) {
        setError(err.message || 'Failed to load watchlist.');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [user]);

  // ── Remove item handler ─────────────────────────────────────
  const removeItem = async (rowId: number) => {
    await supabase.from('user_watchlist').delete().eq('id', rowId);
    setWatchlist((prev) => prev.filter((item) => item.id !== rowId));
  };

  // ── UI states ───────────────────────────────────────────────
  if (loading)
    return <p className="p-6 text-center">Loading your watchlist…</p>;
  if (error)
    return (
      <p className="p-6 text-center text-red-600">
        Error loading watchlist: {error}
      </p>
    );
  if (!user)
    return (
      <p className="p-6 text-center">
        Please sign in to view your watchlist.
      </p>
    );
  if (watchlist.length === 0)
    return (
      <p className="p-6">
        You don’t have anything in your watchlist yet. Browse titles and click
        “Add to Watchlist” to see them here.
      </p>
    );

  // ── Render list ─────────────────────────────────────────────
  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Currently Watching</h1>

      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {watchlist.map((item) => (
          <div
            key={item.id}
            className="rounded-lg overflow-hidden shadow bg-white flex flex-col"
          >
            {item.movies?.poster_url ? (
              <img
                src={item.movies.poster_url}
                alt={item.movies.title}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-sm">
                No Image
              </div>
            )}

            <div className="flex-1 p-3 flex flex-col">
              <h3 className="font-medium text-sm leading-snug">
                {item.movies?.title}
              </h3>

              {item.streaming_service && (
                <span className="mt-1 text-xs text-gray-600">
                  📺 {item.streaming_service}
                </span>
              )}

              <button
                onClick={() => removeItem(item.id)}
                className="mt-auto self-start text-xs text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

