"use client";

import { useRouter } from "next/navigation";

type Props = {
  quizType?: "movie" | "food";
};

export default function QuizStart({ quizType = "movie" }: Props) {
  const router = useRouter();
  const firstQuestionPath = `/quiz/${quizType}/q/genre`;

  return (
    <section className="text-center space-y-6 mt-10">
      <h1 className="text-3xl font-bold tracking-tight">Dinner &amp; a Movie</h1>
      <p className="text-gray-600 text-base max-w-md mx-auto">
        Answer as many or as few questions as you like. Or tap{" "}
        <em className="text-gray-800 font-semibold">Surprise Me</em> to get instant recommendations.
      </p>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => router.push(firstQuestionPath)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label={`Start ${quizType} quiz`}
        >
          Start Quiz
        </button>

        <button
          onClick={() => router.push(`/quiz/${quizType}/surprise`)}
          className="text-sm text-indigo-600 hover:underline"
        >
          🎲 Surprise Me
        </button>
      </div>
    </section>
  );
}

