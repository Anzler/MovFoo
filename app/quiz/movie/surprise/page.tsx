'use client';

import { useEffect, useState } from 'react';

interface SurpriseMovie {
  id: number;
  title: string;
  synopsis: string;
  poster_url: string;
  rating?: number;
  source?: string;
}

export default function SurpriseMoviePage() {
  const [movie, setMovie] = useState<SurpriseMovie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurprise = async () => {
      try {
        const res = await fetch('/v1/quiz/movie/surprise');
        if (!res.ok) throw new Error('Failed to fetch surprise movie');
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error(err);
        setError('Could not load surprise movie. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSurprise();
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Loading a surprise movie…</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-600">{error}</div>;
  }

  if (!movie) {
    return <div className="text-center mt-20">No surprise movie found.</div>;
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">🎉 Your Surprise Movie!</h1>
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="w-64 h-auto rounded mb-4"
        />
        <h2 className="text-xl font-semibold">{movie.title}</h2>
        <p className="text-sm text-gray-700 mt-2 text-center">{movie.synopsis}</p>
        {movie.rating && (
          <p className="mt-2 text-sm text-gray-600">⭐ Rating: {movie.rating.toFixed(1)}</p>
        )}
        {movie.source && (
          <p className="text-xs text-gray-500 mt-1">Source: {movie.source}</p>
        )}
      </div>
    </main>
  );
}

