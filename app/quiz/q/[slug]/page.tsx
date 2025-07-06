"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const QUESTIONS: Record<
  string,
  { prompt: string; options: string[]; key: string }
> = {
  genre: {
    prompt: "Which genre suits your mood?",
    options: ["Action", "Comedy", "Drama", "Horror", "Romance", "Thriller", "Any"],
    key: "genre",
  },
  year: {
    prompt: "Earliest release year you’ll accept?",
    options: ["2020", "2010", "2000", "1990", "Any"],
    key: "year_min",
  },
};

const fetcher = (url: string, body: unknown) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((r) => r.json());

export default function QuizQuestionPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : Array.isArray(params.slug) ? params.slug[0] : "";
  const question = QUESTIONS[slug];

  const router = useRouter();
  const search = useSearchParams();
  const [busy, setBusy] = useState(false);

  const sessionId = search.get("s") ?? undefined;
  const userId = "anon-user"; // TODO: swap for Supabase user ID if logged in

  if (!question) return <p className="text-red-600">Unknown question: “{slug}”</p>;

  async function answer(value: string) {
    setBusy(true);

    try {
      const data = await fetcher(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quiz/watch/answer`,
        {
          sessionId,
          userId,
          questionKey: question.key,
          answerValue: value,
        }
      );

      const nextSlug = getNextQuestion(slug);
      router.replace(
        nextSlug
          ? `/quiz/q/${nextSlug}?s=${data.sessionId}`
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
      <h2 className="text-xl font-semibold">{question.prompt}</h2>

      {question.options.map((opt) => (
        <button
          key={opt}
          onClick={() => answer(opt)}
          className="block w-full py-2 px-4 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          disabled={busy}
        >
          {opt}
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

/* helpers */
function getNextQuestion(current: string) {
  const keys = Object.keys(QUESTIONS);
  const i = keys.indexOf(current);
  return i >= 0 && i < keys.length - 1 ? keys[i + 1] : undefined;
}

