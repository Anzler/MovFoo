"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Movie = {
  title: string;
  poster_url?: string;
  synopsis?: string;
  rating?: number;
};

type Recipe = {
  name: string;
  poster_url?: string;
  description?: string;
  prep_time?: string;
};

export default function PairingResultsPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("s");

  const [movie, setMovie] = useState<Movie | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Missing session ID.");
      setLoading(false);
      return;
    }

    const fetchPairing = async () => {
      try {
        const res = await fetch(`/v1/quiz/pairing/results?s=${sessionId}`);
        if (!res.ok) throw new Error("Failed to fetch pairing");

        const data = await res.json();
        setMovie(data.movie || null);
        setRecipe(data.recipe || null);
      } catch (err) {
        setError("Could not fetch pairing. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPairing();
  }, [sessionId]);

  if (loading) return <div className="text-center mt-20 text-gray-500">Loading your pairing…</div>;
  if (error) return <div className="text-center mt-20 text-red-600">{error}</div>;

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      <h1 className="text-3xl font-bold text-center">🍿 Your Dinner &amp; Movie Night</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Movie */}
        <div className="rounded-lg overflow-hidden border bg-white shadow">
          {movie?.poster_url && (
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-full h-72 object-cover"
            />
          )}
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-1">{movie?.title}</h2>
            {movie?.synopsis && (
              <p className="text-sm text-gray-600 line-clamp-4">{movie.synopsis}</p>
            )}
            {movie?.rating && (
              <p className="text-xs text-yellow-700 mt-2">⭐ {movie.rating}/10</p>
            )}
          </div>
        </div>

        {/* Recipe */}
        <div className="rounded-lg overflow-hidden border bg-white shadow">
          {recipe?.poster_url && (
            <img
              src={recipe.poster_url}
              alt={recipe.name}
              className="w-full h-72 object-cover"
            />
          )}
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-1">{recipe?.name}</h2>
            {recipe?.description && (
              <p className="text-sm text-gray-600 line-clamp-4">{recipe.description}</p>
            )}
            {recipe?.prep_time && (
              <p className="text-xs text-teal-600 mt-2">⏱️ {recipe.prep_time}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

