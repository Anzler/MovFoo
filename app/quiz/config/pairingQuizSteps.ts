// ~/Projects/movfoo/app/quiz/config/pairingQuizSteps.ts

import type { Question } from "@/components/quiz/types";

export const pairingQuizSteps: Question[] = [
  {
    id: "mood",
    label: "What's the vibe tonight?",
    type: "single",
    apiField: "mood",
    options: [
      { value: "relaxing", label: "Relaxing" },
      { value: "funny", label: "Funny" },
      { value: "emotional", label: "Emotional" },
      { value: "intense", label: "Intense" }
    ]
  },
  {
    id: "meal_type",
    label: "What kind of food fits your show?",
    type: "single",
    apiField: "type",
    options: [
      { value: "main course", label: "Main course" },
      { value: "snack", label: "Snack" },
      { value: "dessert", label: "Dessert" }
    ]
  },
  {
    id: "genre",
    label: "Pick a genre to pair with",
    type: "multi",
    apiField: "with_genres",
    options: [
      { value: "28", label: "Action" },
      { value: "35", label: "Comedy" },
      { value: "10749", label: "Romance" },
      { value: "99", label: "Documentary" }
    ]
  }
];

