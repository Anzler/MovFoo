// app/quiz/config/foodQuizSteps.ts
import type { Question } from '@/components/quiz/types';

export const foodQuizSteps: Question[] = [
  {
    id: "with_cuisines",
    apiField: "with_cuisines",
    type: "multi-select",     // literal matches Question.type
    question: "Which cuisines do you love?",
    options: [
      { value: "italian", label: "Italian" },
      { value: "mexican", label: "Mexican" },
      { value: "indian", label: "Indian" },
      { value: "thai", label: "Thai" },
      { value: "japanese", label: "Japanese" },
    ],
  },
  {
    id: "diet_type",
    apiField: "diet_type",
    type: "single-select",
    question: "Do you follow a specific diet?",
    options: [
      { value: "none", label: "No preference" },
      { value: "vegan", label: "Vegan" },
      { value: "vegetarian", label: "Vegetarian" },
      { value: "gluten_free", label: "Gluten-Free" },
    ],
  },
  {
    id: "spice_level",
    apiField: "spice_level",
    type: "single-select",
    question: "Preferred spice level?",
    options: [
      { value: "mild", label: "Mild" },
      { value: "medium", label: "Medium" },
      { value: "hot", label: "Hot" },
    ],
  },
  {
    id: "audience",
    apiField: "audience",
    type: "single-select",
    question: "Who’s eating?",
    options: [
      { value: "all", label: "Everyone" },
      { value: "kids", label: "Kids" },
      { value: "adults", label: "Adults" },
    ],
  },
];

