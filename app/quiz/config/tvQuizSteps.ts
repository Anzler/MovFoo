// ~/Projects/movfoo/app/quiz/config/tvQuizSteps.ts
import type { Question } from "@/components/quiz/types";

export const tvQuizSteps: Question[] = [
  {
    id: "genre",
    label: "Pick a TV genre",
    type: "single",
    apiField: "with_genres",
    options: [
      { value: "18", label: "Drama" },
      { value: "35", label: "Comedy" },
      { value: "80", label: "Crime" },
      { value: "10759", label: "Action & Adventure" },
      { value: "99", label: "Documentary" },
    ],
  },
  {
    id: "release_year",
    label: "What decade was it released?",
    type: "single",
    apiField: "first_air_date_year",
    options: [
      { value: "1980", label: "1980s" },
      { value: "1990", label: "1990s" },
      { value: "2000", label: "2000s" },
      { value: "2010", label: "2010s" },
      { value: "2020", label: "2020s" },
    ],
  },
  {
    id: "rating_min",
    label: "Minimum rating?",
    type: "range",
    apiField: "vote_average.gte",
    rangeConfig: {
      min: 5,
      max: 10,
      step: 1,
    },
  },
];

