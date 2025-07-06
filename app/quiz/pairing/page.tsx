"use client";

import { useRouter } from "next/navigation";

export default function PairingQuizStart() {
  const router = useRouter();

  return (
    <section className="text-center space-y-6 mt-12 px-4">
      <h1 className="text-3xl font-bold tracking-tight">Dinner &amp; a Movie</h1>
      <p className="text-gray-600 text-base max-w-xl mx-auto">
        Let MovFoo plan your perfect night in. Answer a few quick questions and we'll pair the
        perfect film with a dish to match — or skip straight to a surprise combo.
      </p>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => router.push("/quiz/pairing/q/movie-genre")}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Start Pairing Quiz
        </button>

        <button
          onClick={() => router.push("/quiz/pairing/surprise")}
          className="text-sm text-indigo-600 hover:underline"
        >
          🎲 Surprise Me with a Combo
        </button>
      </div>
    </section>
  );
}

