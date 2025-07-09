'use client';

import { useEffect, useState } from 'react';

interface Movie {
  id: number;
  title: string;
  poster_url?: string;
  synopsis: string;
  rating?: number;
  release_date?: string;
  source?: string;
}

export default function MovieSurprisePage() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use env for your deployed backend API base
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://movfoo-xknj.onrender.com';

  useEffect(() => {
    const fetchSurpriseMovie = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${apiUrl}/v1/quiz/movie/surprise`);
        if (!res.ok) throw new Error('Could not fetch surprise movie');
        const data = await res.json();
        if (!data.movie) throw new Error('No movie returned.');
        setMovie(data.movie);
      } catch (err: any) {
        setError('Could not load surprise movie. Please try again.');
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSurpriseMovie();
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-500">Loading your surprise movie…</div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-red-600">{error}</div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center mt-20 text-gray-500">No movie found. Try again!</div>
    );
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
        {movie.poster_url && (
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-60 rounded shadow mb-4"
          />
        )}
        <h1 className="text-2xl font-bold mb-2">{movie.title}</h1>
        {movie.release_date && (
          <p className="text-sm text-gray-500 mb-2">
            Release: {movie.release_date}
          </p>
        )}
        {movie.rating !== undefined && (
          <p className="text-sm text-yellow-700 mb-2">⭐ {movie.rating.toFixed(1)}</p>
        )}
        <p className="text-gray-700 mb-4">{movie.synopsis}</p>
        {movie.source && (
          <div className="text-xs text-gray-400 mt-2">Source: {movie.source}</div>
        )}
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          Surprise Me Again!
        </button>
      </div>
    </main>
  );
}

