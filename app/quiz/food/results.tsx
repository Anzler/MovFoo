// ~/Projects/movfoo/app/quiz/food/results.tsx
'use client';

import { useEffect, useState } from "react";
import axios from "axios";

type Recipe = {
  title?: string;
  name?: string;
  description?: string;
  prep_time?: string;
  poster_url?: string;
};

export default function FoodResultsPage() {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);

    try {
      const answers = JSON.parse(localStorage.getItem("quiz_answers_food") || "{}");

      const res = await axios.post("/v1/quiz/food/submit", {
        answers,
      });

      // ✅ TEMP MOCK: display mock recipes if backend returns empty
      setRecipes(
        res.data.results || [
          {
            name: "Stuffed Bell Peppers",
            description: "Healthy and easy stuffed peppers with rice and ground turkey.",
            prep_time: "45 minutes",
            poster_url: "https://spoonacular.com/recipeImages/715538-556x370.jpg",
          },
          {
            name: "Zucchini Noodles with Pesto",
            description: "Low-carb spiralized zucchini with homemade basil pesto.",
            prep_time: "25 minutes",
            poster_url: "https://spoonacular.com/recipeImages/660228-556x370.jpg",
          },
        ]
      );
    } catch (err: any) {
      console.error("Failed to fetch food results:", err);
      setError("Could not load recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-gray-600">Loading results…</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-red-600">
        {error}
        <br />
        <button
          onClick={fetchResults}
          className="mt-4 px-4 py-2 bg-green-100 border border-green-300 rounded hover:bg-green-200 font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center mt-20 text-gray-600">
        No recommendations found.
        <br />
        <button
          onClick={fetchResults}
          className="mt-4 px-4 py-2 bg-green-100 border border-green-300 rounded hover:bg-green-200 font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">🍽️ Your Food Matches</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recipes.map((item, i) => (
          <div key={i} className="p-4 border rounded shadow">
            {item.poster_url && (
              <img
                src={item.poster_url}
                alt={item.title || item.name}
                className="w-full h-auto mb-3 rounded"
              />
            )}
            <h2 className="text-lg font-semibold mb-1">{item.title || item.name}</h2>
            {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
            {item.prep_time && (
              <p className="text-xs text-teal-600 mt-1">⏱️ {item.prep_time}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

