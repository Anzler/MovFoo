'use client';

import { useParams, useRouter } from 'next/navigation';
import { entityTypeQuizSteps } from '@/app/quiz/config/entityTypeQuizSteps';
import QuizEngine from '@/components/quiz/QuizEngine';
import { movieQuizSteps } from '@/app/quiz/config/movieQuizSteps';
import { tvQuizSteps } from '@/app/quiz/config/tvQuizSteps';
import { foodQuizSteps } from '@/app/quiz/config/foodQuizSteps';

export default function EntityQuizStepPage() {
  const params = useParams();
  const router = useRouter();
  const slug =
    typeof params.slug === 'string'
      ? params.slug
      : Array.isArray(params.slug)
      ? params.slug[0]
      : '';

  const stepIndex = entityTypeQuizSteps.findIndex((q) => q.id === slug);
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

  const step = entityTypeQuizSteps[stepIndex];

  // After selection, QuizEngine will call our API and then navigate here:
  // we intercept the answerValue to redirect into the proper quiz flow.
  const handleAdvance = (answerValue: string | string[]) => {
    const entity = Array.isArray(answerValue)
      ? answerValue[0]
      : answerValue;

    let firstSlug: string;
    switch (entity) {
      case 'movie':
        firstSlug = movieQuizSteps[0].id;
        router.push(`/quiz/movie/q/${firstSlug}`);
        break;
      case 'tv':
        firstSlug = tvQuizSteps[0].id;
        router.push(`/quiz/tv/q/${firstSlug}`);
        break;
      case 'food':
        firstSlug = foodQuizSteps[0].id;
        router.push(`/quiz/food/q/${firstSlug}`);
        break;
      default:
        router.push('/quiz'); // fallback to quiz home
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <QuizEngine
        quizType="entity"
        questions={[step]}
        // override default autoAdvance: use our handler
        onAnswer={(key, value) => handleAdvance(value)}
      />
    </div>
  );
}

