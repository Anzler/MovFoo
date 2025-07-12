import type { QuizQuestion } from '@/app/quiz/types';

export const entityTypeQuizSteps: QuizQuestion[] = [
  {
    id: "entity_type",
    type: "single-select",              // one of: "single-select" | "multi-select" | "slider"
    question: "What are we looking for?",
    options: [
      { value: "movie", label: "A Movie" },
      { value: "tv", label: "A TV Show" },
      { value: "food", label: "A Food Dish" }
    ],
  },
];

