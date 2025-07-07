'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type ResultItem = {
  id: string;
  title: string;
  synopsis?: string;
  poster_url?: string;
  rating?: number;
  source?: string;
};

export default function MovieQuizResults() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('s');

  const [results, setResults] = useState<ResultItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('Missing session ID.');
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await fetch(`/v1/quiz/movie/results?s=${sessionId}`);
        if (!res.ok) throw new Error('Failed to load results');
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error(err);
        setError('Could not fetch results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-500">
        Loading your movie picks...
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-20 text-red-600">{error}</div>;
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center mt-20 text-gray-600">
        No results found. Try answering more questions or hitting “Surprise Me.”
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">🎬 Your Movie Picks</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {results.map((item) => (
          <div
            key={item.id}
            className="rounded-lg overflow-hidden border bg-white shadow hover:shadow-lg transition"
          >
            {item.poster_url ? (
              <img
                src={item.poster_url}
                alt={item.title}
                className="w-full h-60 object-cover"
              />
            ) : (
              <div className="w-full h-60 flex items-center justify-center bg-gray-200 text-sm">
                No Image
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
              {item.synopsis && (
                <p className="text-sm text-gray-600 line-clamp-3">{item.synopsis}</p>
              )}
              {item.rating != null && (
                <p className="text-xs text-yellow-700 mt-2">
                  ⭐ Rating: {item.rating}/10
                </p>
              )}
              {item.source && (
                <p className="text-xs text-gray-400 italic mt-1">
                  Source: {item.source}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

