import type { QuizQuestion } from '@/app/quiz/types';

export const pairingQuizSteps: QuizQuestion[] = [
  {
    id: "with_genres",
    type: "multi-select",
    question: "Which pairings are you interested in?",
    options: [
      { value: "wine", label: "Wine" },
      { value: "beer", label: "Beer" },
      { value: "cider", label: "Cider" },
      { value: "cocktail", label: "Cocktail" },
    ],
  },
  {
    id: "with_primary_flavor",
    type: "single-select",
    question: "Primary flavor profile?",
    options: [
      { value: "sweet", label: "Sweet" },
      { value: "savory", label: "Savory" },
      { value: "spicy", label: "Spicy" },
      { value: "bitter", label: "Bitter" },
    ],
  },
  {
    id: "with_food",
    type: "multi-select",
    question: "Which foods will you be pairing?",
    options: [
      { value: "cheese", label: "Cheese" },
      { value: "chocolate", label: "Chocolate" },
      { value: "seafood", label: "Seafood" },
      { value: "red_meat", label: "Red Meat" },
    ],
  },
  {
    id: "audience",
    type: "single-select",
    question: "Who's enjoying the pairing?",
    options: [
      { value: "all", label: "Everyone" },
      { value: "kids", label: "Kids" },
      { value: "adults", label: "Adults" },
    ],
  },
];

