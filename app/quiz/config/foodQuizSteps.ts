// app/quiz/config/foodQuizSteps.ts
import type { Question } from '@/components/quiz/types';

export const foodQuizSteps: Question[] = [
  {
    id: "with_cuisines",
    apiField: "with_cuisines",
    type: "multi",                     // use "multi" not "multi-select"
    label: "Which cuisines do you love?", 
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
    type: "single",                    // use "single" not "single-select"
    label: "Do you follow a specific diet?",
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
    type: "single",
    label: "Preferred spice level?",
    options: [
      { value: "mild", label: "Mild" },
      { value: "medium", label: "Medium" },
      { value: "hot", label: "Hot" },
    ],
  },
  {
    id: "audience",
    apiField: "audience",
    type: "single",
    label: "Who’s eating?",
    options: [
      { value: "all", label: "Everyone" },
      { value: "kids", label: "Kids" },
      { value: "adults", label: "Adults" },
    ],
  },
];

