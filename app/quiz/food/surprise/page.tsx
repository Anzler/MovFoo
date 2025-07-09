'use client';

import { useEffect, useState } from 'react';

type Recipe = {
  id: string;
  title: string;
  image: string;
  summary?: string;
  readyInMinutes?: number;
  sourceUrl?: string;
};

export default function SurpriseFoodPage() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurprise = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/v1/quiz/food/surprise');
        if (!res.ok) throw new Error('Failed to fetch surprise recipe');
        const data = await res.json();
        setRecipe(data.recipe || null);
      } catch (err: any) {
        setError('Could not load surprise recipe. Please try again.');
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSurprise();
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Loading your surprise dish…</div>;
  }

  if (error || !recipe) {
    return <div className="text-center mt-20 text-red-600">{error || 'No recipe found.'}</div>;
  }

  return (
    <div className="flex flex-col items-center mt-8">
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-64 h-64 object-cover rounded shadow mb-4"
      />
      <h1 className="text-2xl font-bold mb-2">{recipe.title}</h1>
      {recipe.readyInMinutes && (
        <div className="text-gray-500 mb-2">⏱️ Ready in {recipe.readyInMinutes} minutes</div>
      )}
      {recipe.summary && (
        <div
          className="text-center mb-4 max-w-lg text-gray-700"
          dangerouslySetInnerHTML={{ __html: recipe.summary }}
        />
      )}
      {recipe.sourceUrl && (
        <a
          href={recipe.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-600 underline text-sm"
        >
          View full recipe
        </a>
      )}
    </div>
  );
}

