// ~/Projects/movfoo/app/quiz/food/results/page.tsx
'use client';

export default function FoodResultsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">🍽️ Your Food Matches</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded shadow">
          <img
            src="https://spoonacular.com/recipeImages/715538-556x370.jpg"
            alt="Stuffed Bell Peppers"
            className="w-full h-auto mb-3 rounded"
          />
          <h2 className="text-lg font-semibold mb-1">Stuffed Bell Peppers</h2>
          <p className="text-sm text-gray-600">
            Healthy and easy stuffed peppers with rice and ground turkey.
          </p>
          <p className="text-xs text-teal-600 mt-1">⏱️ 45 minutes</p>
        </div>

        <div className="p-4 border rounded shadow">
          <img
            src="https://spoonacular.com/recipeImages/660228-556x370.jpg"
            alt="Zucchini Noodles with Pesto"
            className="w-full h-auto mb-3 rounded"
          />
          <h2 className="text-lg font-semibold mb-1">Zucchini Noodles with Pesto</h2>
          <p className="text-sm text-gray-600">
            Low-carb spiralized zucchini with homemade basil pesto.
          </p>
          <p className="text-xs text-teal-600 mt-1">⏱️ 25 minutes</p>
        </div>
      </div>
    </main>
  );
}

