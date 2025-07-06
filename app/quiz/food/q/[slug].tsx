"use client";

import { useParams } from "next/navigation";
import QuizEngine from "@/components/quiz/QuizEngine";

const foodQuestions = [
  {
    key: "meal_type",
    prompt: "What kind of meal are you planning?",
    options: ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"],
  },
  {
    key: "cuisine",
    prompt: "What cuisine are you craving?",
    options: ["Italian", "Mexican", "Asian", "American", "Any"],
  },
  {
    key: "diet",
    prompt: "Any dietary preference?",
    options: ["Vegetarian", "Vegan", "Gluten-Free", "None"],
  },
  {
    key: "effort",
    prompt: "How much effort do you want to put in?",
    options: ["Quick & Easy", "Moderate", "I'm in the mood to cook"],
  },
];

export default function FoodQuizQuestionPage() {
  const { slug } = useParams<{ slug: string }>();

  const stepIndex = foodQuestions.findIndex((q) => q.key === slug);

  if (stepIndex === -1) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-semibold text-red-600">Invalid step: “{slug}”</h2>
        <p className="text-gray-500">Please return to the quiz start page.</p>
      </div>
    );
  }

  const step = foodQuestions[stepIndex];

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <QuizEngine
        quizType="food"
        questions={[step]}
        autoAdvanceToNextSlug={
          stepIndex + 1 < foodQuestions.length
            ? `/quiz/food/q/${foodQuestions[stepIndex + 1].key}`
            : `/quiz/food/results`
        }
      />
    </div>
  );
}

