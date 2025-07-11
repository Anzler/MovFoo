// ~/Projects/movfoo/app/quiz/config/foodQuizSteps.ts
import type { Question } from "@/components/quiz/types";

export const foodQuizSteps: Question[] = [
  {
    id: "diet",
    label: "Do you follow a dietary preference?",
    type: "single",
    apiField: "diet",
    options: [
      { value: "vegetarian", label: "Vegetarian" },
      { value: "vegan", label: "Vegan" },
      { value: "pescetarian", label: "Pescetarian" },
      { value: "gluten free", label: "Gluten Free" },
      { value: "none", label: "No Preference" },
    ],
  },
  {
    id: "cuisine",
    label: "Pick a cuisine",
    type: "single",
    apiField: "cuisine",
    options: [
      { value: "mexican", label: "Mexican" },
      { value: "italian", label: "Italian" },
      { value: "thai", label: "Thai" },
      { value: "indian", label: "Indian" },
      { value: "american", label: "American" },
    ],
  },
  {
    id: "prep_time",
    label: "Prep time (in minutes)",
    type: "range",
    apiField: "maxReadyTime",
    rangeConfig: {
      min: 10,
      max: 60,
      step: 5,
    },
  },
];

