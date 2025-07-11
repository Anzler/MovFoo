// ~/Projects/movfoo/app/quiz/tv/page.tsx
'use client';

import Link from 'next/link';
import { tvQuizSteps } from '@/app/quiz/config/tvQuizSteps';

export default function TvQuizStartPage() {
  return (
    <main className="text-center max-w-xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-bold mb-4">Dinner & a TV Show</h1>
      <p className="text-gray-600 mb-8">
        Answer as many or as few questions as you like. Or tap{" "}
        <em className="font-semibold">Surprise Me</em> to get instant recommendations.
      </p>

      <Link
        href={`/quiz/tv/q/${tvQuizSteps[0].id}`}
        className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-lg font-semibold mb-4"
      >
        Start Quiz
      </Link>
      <br />
      <Link
        href="/quiz/movie/spoonacular-surprise" // Replace if you want a TV-specific surprise route
        className="text-blue-700 hover:underline text-sm"
      >
        🎲 Surprise Me
      </Link>
    </main>
  );
}

