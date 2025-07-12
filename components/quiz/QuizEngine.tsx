import React from 'react';
import { useRouter } from 'next/navigation';
import { QuizQuestion } from '@/app/quiz/types';

// 1️⃣ Extend the QuizType union to include "entity"
export type QuizType = 'movie' | 'tv' | 'food' | 'pairing' | 'entity';

export interface QuizEngineProps {
  quizType: QuizType;
  questions: QuizQuestion[];
  autoAdvanceToNextSlug?: string;
  onAnswer?: (questionKey: string, answerValue: string | string[]) => void;
}

export default function QuizEngine({
  quizType,
  questions,
  autoAdvanceToNextSlug,
  onAnswer,
}: QuizEngineProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const step = questions[currentIndex];

  const handleAnswer = (key: string, value: string | string[]) => {
    // 2️⃣ Record answer (e.g. call your API)
    fetch(`/api/v1/quiz/${quizType}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionKey: key,
        answerValue: value,
      }),
    });

    // 3️⃣ Either custom handler or default auto-advance
    if (onAnswer) {
      onAnswer(key, value);
    } else if (autoAdvanceToNextSlug) {
      router.push(autoAdvanceToNextSlug);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">{step.question}</h3>
      {/* Render controls based on step.type (omitted for brevity) */}
      {/* For each option/button/slider, call handleAnswer(step.id, selectedValue) */}
    </div>
  );
}

