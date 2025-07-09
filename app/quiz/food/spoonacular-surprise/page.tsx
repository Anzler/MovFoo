'use client';

import { useEffect, useState } from 'react';

type SpoonacularRecipe = {
  id: number;
  title: string;
  image: string;
  summary?: string;
  readyInMinutes?: number;
  sourceUrl?: string;
};

export default function SpoonacularSurprisePage() {
  const [recipe, setRecipe] = useState<SpoonacularRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSurpriseRecipe = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/v1/quiz/food/spoonacular-surprise');
      if (!res.ok) throw new Error('Failed to fetch surprise recipe');
      const data = await res.json();
      setRecipe(data.recipe);
    } catch (err) {
      setError('Could not fetch a surprise recipe. Please try again.');
      setRecipe(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurpriseRecipe();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-500">
        Loading a surprise recipe…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-red-600">
        {error}
        <br />
        <button
          onClick={fetchSurpriseRecipe}
          className="mt-4 px-4 py-2 bg-green-100 border border-green-300 rounded hover:bg-green-200 font-semibold"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center mt-20 text-gray-600">
        No recipe found.
        <br />
        <button
          onClick={fetchSurpriseRecipe}
          className="mt-4 px-4 py-2 bg-green-100 border border-green-300 rounded hover:bg-green-200 font-semibold"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="max-w-xl mx-auto py-12 px-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">🍽️ Your Surprise Recipe</h1>
        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-auto mb-3 rounded"
            onError={(e) => ((e.target as HTMLImageElement).src = '/placeholder-food.png')}
          />
        )}
        <h2 className="text-xl font-semibold mb-2">{recipe.title}</h2>
        {recipe.summary && (
          <div
            className="text-gray-700 text-sm mb-2"
            dangerouslySetInnerHTML={{ __html: recipe.summary }}
          />
        )}
        {recipe.readyInMinutes && (
          <p className="text-sm text-gray-600 mb-2">⏱️ Ready in {recipe.readyInMinutes} minutes</p>
        )}
        {recipe.sourceUrl && (
          <a
            href={recipe.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 underline text-sm mt-2 inline-block"
          >
            View Full Recipe
          </a>
        )}
        <div className="mt-6 text-center">
          <button
            onClick={fetchSurpriseRecipe}
            className="px-4 py-2 bg-green-100 border border-green-300 rounded hover:bg-green-200 font-semibold"
          >
            🎲 Surprise Me Again
          </button>
        </div>
      </div>
    </section>
  );
}

