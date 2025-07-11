// ~/Projects/movfoo/app/quiz/movie/q/[slug]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import QuizEngine from '@/components/quiz/QuizEngine';
import { movieQuizSteps } from '@/app/quiz/config/movieQuizSteps';

export default function MovieQuizStepPage() {
  const params = useParams();
  const slug: string =
    typeof params.slug === 'string'
      ? params.slug
      : Array.isArray(params.slug)
      ? params.slug[0]
      : '';

  const stepIndex = movieQuizSteps.findIndex((step) => step.id === slug);

  if (stepIndex === -1) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-semibold text-red-600">
          Invalid quiz step: “{slug}”
        </h2>
        <p className="text-gray-500">Please return to the quiz start page.</p>
      </div>
    );
  }

  const step = movieQuizSteps[stepIndex];

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <QuizEngine
        quizType="movie"
        questions={[step]}
        autoAdvanceToNextSlug={
          stepIndex + 1 < movieQuizSteps.length
            ? `/quiz/movie/q/${movieQuizSteps[stepIndex + 1].id}`
            : `/quiz/movie/results`
        }
      />
    </div>
  );
}

