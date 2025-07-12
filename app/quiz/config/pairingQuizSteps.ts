import type { Question } from '@/components/quiz/types';

export const pairingQuizSteps: Question[] = [
  {
    id: "with_genres",
    type: "multi",             // was "multi-select"
    label: "Which pairings are you interested in?",  // renamed from `question`
    options: [
      { value: "wine", label: "Wine" },
      { value: "beer", label: "Beer" },
      { value: "cider", label: "Cider" },
      { value: "cocktail", label: "Cocktail" },
    ],
  },
  {
    id: "with_primary_flavor",
    type: "single",            // was "single-select"
    label: "Primary flavor profile?",                // renamed
    options: [
      { value: "sweet", label: "Sweet" },
      { value: "savory", label: "Savory" },
      { value: "spicy", label: "Spicy" },
      { value: "bitter", label: "Bitter" },
    ],
  },
  {
    id: "with_food",
    type: "multi",             // was "multi-select"
    label: "Which foods will you be pairing?",        // renamed
    options: [
      { value: "cheese", label: "Cheese" },
      { value: "chocolate", label: "Chocolate" },
      { value: "seafood", label: "Seafood" },
      { value: "red_meat", label: "Red Meat" },
    ],
  },
  {
    id: "audience",
    type: "single",            // was "single-select"
    label: "Who's enjoying the pairing?",             // renamed
    options: [
      { value: "all", label: "Everyone" },
      { value: "kids", label: "Kids" },
      { value: "adults", label: "Adults" },
    ],
  },
];

