"use client";

import { useParams } from "next/navigation";
import QuizEngine from "@/components/quiz/QuizEngine";

const movieQuestions = [
  {
    key: "genre",
    prompt: "What genre are you in the mood for?",
    options: ["Action", "Comedy", "Drama", "Horror", "Romance"],
  },
  {
    key: "special_category",
    prompt: "Do you want something new or a classic?",
    options: ["new_release", "classic"],
  },
  {
    key: "audience",
    prompt: "Who are you watching with?",
    options: ["Any", "Kids", "Adults"],
  },
  {
    key: "rating_min",
    prompt: "Minimum rating (1–10)?",
    options: ["5", "6", "7", "8", "9"],
  }
];

export default function MovieQuizStep() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : Array.isArray(params.slug) ? params.slug[0] : "";

  const stepIndex = movieQuestions.findIndex((q) => q.key === slug);
  if (stepIndex === -1) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-semibold text-red-600">Invalid quiz step: “{slug}”</h2>
        <p className="text-gray-500">Please return to the quiz start page.</p>
      </div>
    );
  }

  const step = movieQuestions[stepIndex];

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <QuizEngine
        quizType="movie"
        questions={[step]}
        autoAdvanceToNextSlug={
          stepIndex + 1 < movieQuestions.length
            ? `/quiz/movie/q/${movieQuestions[stepIndex + 1].key}`
            : `/quiz/movie/results`
        }
      />
    </div>
  );
}

