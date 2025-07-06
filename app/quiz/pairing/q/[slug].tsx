"use client";

import { useParams } from "next/navigation";
import QuizEngine from "@/components/quiz/QuizEngine";

// Combined question flow (movie first, then food)
const pairingQuestions = [
  {
    key: "movie_genre",
    prompt: "What kind of movie are you in the mood for?",
    options: ["Action", "Comedy", "Romance", "Drama", "Sci-Fi"],
  },
  {
    key: "movie_tone",
    prompt: "What tone are you feeling?",
    options: ["Light-hearted", "Gritty", "Inspiring", "Dark"],
  },
  {
    key: "meal_type",
    prompt: "What type of meal fits the mood?",
    options: ["Dinner", "Snack", "Dessert", "Takeout"],
  },
  {
    key: "cuisine",
    prompt: "What cuisine are you craving?",
    options: ["Italian", "Mexican", "Comfort food", "Asian", "Surprise me"],
  },
];

export default function PairingQuizStep() {
  const { slug } = useParams<{ slug: string }>();

  const stepIndex = pairingQuestions.findIndex((q) => q.key === slug);

  if (stepIndex === -1) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-semibold text-red-600">Invalid quiz step: “{slug}”</h2>
        <p className="text-gray-500">Please return to the pairing quiz start page.</p>
      </div>
    );
  }

  const step = pairingQuestions[stepIndex];

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <QuizEngine
        quizType="pairing"
        questions={[step]}
        autoAdvanceToNextSlug={
          stepIndex + 1 < pairingQuestions.length
            ? `/quiz/pairing/q/${pairingQuestions[stepIndex + 1].key}`
            : `/quiz/pairing/results`
        }
      />
    </div>
  );
}

