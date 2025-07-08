'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface Movie {
  id: string;
  title: string;
  poster_url?: string;
  synopsis: string;
  rating?: number;
  source?: string;
}

interface Recipe {
  id: string;
  title: string;
  image: string;
  summary?: string;
  readyInMinutes?: number;
  sourceUrl?: string;
}

export default function PairingResultsInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('s');

  const [movie, setMovie] = useState<Movie | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('Missing session ID.');
      setLoading(false);
      return;
    }

    const fetchPairing = async () => {
      try {
        const res = await fetch(`/v1/quiz/pairing/results?s=${sessionId}`);
        if (!res.ok) throw new Error('Failed to fetch pairing results');
        const data = await res.json();
        setMovie(data.movie);
        setRecipe(data.recipe);
      } catch (err) {
        console.error(err);
        setError('Could not load pairing. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPairing();
  }, [sessionId]);

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Loading pairing…</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-600">{error}</div>;
  }

  if (!movie || !recipe) {
    return <div className="text-center mt-20">No pairing found for this session.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Movie Card */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-bold mb-2">🎬 Your Movie</h2>
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="w-full h-auto mb-3 rounded"
        />
        <h3 className="text-lg font-semibold">{movie.title}</h3>
        <p className="text-sm text-gray-700 mt-2">{movie.synopsis}</p>
        {movie.rating && (
          <p className="mt-2 text-sm text-gray-600">⭐ Rating: {movie.rating.toFixed(1)}</p>
        )}
        {movie.source && (
          <p className="text-xs text-gray-500 mt-1">Available on: {movie.source}</p>
        )}
      </div>

      {/* Food Card */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-bold mb-2">🍽️ Your Dish</h2>
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-auto mb-3 rounded"
        />
        <h3 className="text-lg font-semibold">{recipe.title}</h3>
        {recipe.summary && (
          <p
            className="text-sm text-gray-700 mt-2"
            dangerouslySetInnerHTML={{ __html: recipe.summary }}
          />
        )}
        {recipe.readyInMinutes && (
          <p className="mt-2 text-sm text-gray-600">⏱️ Ready in {recipe.readyInMinutes} minutes</p>
        )}
        {recipe.sourceUrl && (
          <a
            href={recipe.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 underline text-sm mt-2 inline-block"
          >
            View full recipe
          </a>
        )}
      </div>
    </div>
  );
}

