// ~/Projects/movfoo/app/quiz/food/page.tsx
'use client';

import Link from 'next/link';
import { foodQuizSteps } from '@/app/quiz/config/foodQuizSteps';

export default function FoodQuizStartPage() {
  return (
    <main className="text-center max-w-xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-bold mb-4">Dinner & a Movie</h1>
      <p className="text-gray-600 mb-8">
        Answer as many or as few questions as you like. Or tap{" "}
        <em className="font-semibold">Surprise Me</em> to get instant recommendations.
      </p>

      <Link
        href={`/quiz/food/q/${foodQuizSteps[0].id}`}
        className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded text-lg font-semibold mb-4"
      >
        Start Quiz
      </Link>
      <br />
      <Link
        href="/quiz/food/spoonacular-surprise"
        className="text-green-700 hover:underline text-sm"
      >
        🎲 Surprise Me
      </Link>
    </main>
  );
}

