"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { movieQuizSteps } from "@/app/quiz/config/movieQuizSteps"; // Centralized config

type Question = {
  id: string;
  prompt: string;
  options: string[];
  apiField: string;
};

// Utility fetcher
const fetcher = (url: string, body: unknown) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((r) => r.json());

export default function QuizQuestionPage() {
  const params = useParams();
  const router = useRouter();
  const search = useSearchParams();
  const [busy, setBusy] = useState(false);

  const slug =
    typeof params.slug === "string"
      ? params.slug
      : Array.isArray(params.slug)
      ? params.slug[0]
      : "";

  const stepIndex = movieQuizSteps.findIndex((step) => step.id === slug);
  const question = movieQuizSteps[stepIndex];

  const sessionId = search.get("s") ?? undefined;

  if (!question)
    return <p className="text-red-600">Unknown question: “{slug}”</p>;

  async function answer(value: string) {
    setBusy(true);

    try {
      const data = await fetcher(`/api/quiz/watch/answer`, {
        sessionId,
        userId: "anon-user", // TODO: swap for Supabase auth user if available
        questionKey: question.apiField,
        answerValue: value,
      });

      const nextStep = movieQuizSteps[stepIndex + 1];
      router.replace(
        nextStep
          ? `/quiz/q/${nextStep.id}?s=${data.sessionId}`
          : `/quiz/results?s=${data.sessionId}`
      );
    } catch (err) {
      console.error("Quiz submission failed", err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-4 mt-10 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold">{question.label}</h2>

      {question.options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => answer(opt.value)}
          className="block w-full py-2 px-4 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          disabled={busy}
        >
          {opt.label}
        </button>
      ))}

      <button
        onClick={() => router.push(`/quiz/results?s=${sessionId ?? ""}`)}
        className="mt-4 text-sm underline text-orange-600"
      >
        🎲 Surprise Me
      </button>
    </section>
  );
}

