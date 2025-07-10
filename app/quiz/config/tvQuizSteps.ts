// ~/Projects/movfoo/app/quiz/config/tvQuizSteps.ts
import type { Question } from "@/components/quiz/QuizEngine";

export const tvQuizSteps: Question[] = [
  {
    id: "media_type",
    label: "What are you watching?",
    type: "single",
    apiField: "media_type",
    options: [
      { value: "tv", label: "TV Series 📺" }
    ]
  },
  {
    id: "genre",
    label: "Pick a genre",
    type: "multi",
    apiField: "with_genres",
    options: [
      { value: "18", label: "Drama" },
      { value: "35", label: "Comedy" },
      { value: "10765", label: "Sci-Fi & Fantasy" },
      { value: "99", label: "Documentary" }
    ]
  },
  {
    id: "episodes",
    label: "Number of episodes?",
    type: "range",
    apiField: "number_of_episodes",
    rangeConfig: {
      min: 1,
      max: 100,
      step: 5
    }
  },
  {
    id: "language",
    label: "Original language?",
    type: "single",
    apiField: "with_original_language",
    options: [
      { value: "en", label: "English" },
      { value: "es", label: "Spanish" },
      { value: "ko", label: "Korean" },
      { value: "ja", label: "Japanese" }
    ]
  }
];

