'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

type Recipe = {
  name?: string;
  title?: string;
  description?: string;
  prep_time?: string;
  poster_url?: string;
};

export default function FoodResultsPage() {
  const [results, setResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const storageKey = 'quiz_answers_food';

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const stored = localStorage.getItem(storageKey);
        if (!stored) {
          setError("No quiz answers found.");
          setLoading(false);
          return;
        }

        const answers = JSON.parse(stored);

        const res = await axios.post('/api/v1/quiz/food/submit', {
          answers,
        });

        setResults(res.data.results || []);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError("Failed to load recommendations.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Loading recommendations...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">🍽️ Your Food Matches</h1>
      {results.length === 0 ? (
        <p className="text-gray-500">No results found. Try adjusting your quiz filters.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {results.map((item, i) => (
            <div key={i} className="rounded-lg shadow border p-3">
              {item.poster_url && (
                <img src={item.poster_url} alt={item.title || item.name} className="w-full rounded" />
              )}
              <h2 className="text-sm font-semibold mt-2">{item.title || item.name}</h2>
              {item.prep_time && (
                <p className="text-xs text-teal-600 mt-1">⏱️ {item.prep_time}</p>
              )}
              {item.description && (
                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

