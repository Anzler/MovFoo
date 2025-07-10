// ~/Projects/movfoo/app/quiz/pairing/q/[slug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import QuizEngine from "@/components/quiz/QuizEngine";
import { pairingQuizSteps } from "@/app/quiz/config/pairingQuizSteps";

export default function PairingQuizStep() {
  const params = useParams();
  const slug =
    typeof params.slug === "string"
      ? params.slug
      : Array.isArray(params.slug)
      ? params.slug[0]
      : "";

  const stepIndex = pairingQuizSteps.findIndex((q) => q.id === slug);

  if (stepIndex === -1) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-semibold text-red-600">
          Invalid quiz step: “{slug}”
        </h2>
        <p className="text-gray-500">Please return to the quiz start page.</p>
      </div>
    );
  }

  const step = pairingQuizSteps[stepIndex];

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <QuizEngine
        quizType="pairing"
        questions={[step]}
        autoAdvanceToNextSlug={
          stepIndex + 1 < pairingQuizSteps.length
            ? `/quiz/pairing/q/${pairingQuizSteps[stepIndex + 1].id}`
            : `/quiz/pairing/results`
        }
      />
    </div>
  );
}

