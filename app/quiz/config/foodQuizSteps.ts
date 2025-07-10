// ~/Projects/movfoo/app/quiz/config/foodQuizSteps.ts

import type { Question } from "@/components/quiz/types";

export const foodQuizSteps: Question[] = [
  {
    id: "meal_type",
    label: "What type of meal?",
    type: "single",
    apiField: "type",
    options: [
      { value: "main course", label: "Main course" },
      { value: "dessert", label: "Dessert" },
      { value: "appetizer", label: "Appetizer" },
      { value: "snack", label: "Snack" }
    ]
  },
  {
    id: "diet",
    label: "Any dietary preference?",
    type: "multi",
    apiField: "diet",
    options: [
      { value: "vegetarian", label: "Vegetarian" },
      { value: "vegan", label: "Vegan" },
      { value: "gluten free", label: "Gluten-Free" },
      { value: "keto", label: "Keto" }
    ]
  },
  {
    id: "cuisine",
    label: "Preferred cuisine?",
    type: "multi",
    apiField: "cuisine",
    options: [
      { value: "italian", label: "Italian" },
      { value: "mexican", label: "Mexican" },
      { value: "thai", label: "Thai" },
      { value: "japanese", label: "Japanese" }
    ]
  },
  {
    id: "ready_in",
    label: "Ready in under (minutes)",
    type: "range",
    apiField: "readyInMinutes",
    rangeConfig: {
      min: 5,
      max: 90,
      step: 5
    }
  }
];

