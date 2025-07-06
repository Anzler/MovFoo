"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MovieSurprisePage() {
  const router = useRouter();

  useEffect(() => {
    const fireSurpriseRequest = async () => {
      try {
        const defaultChoices = {
          questionKey: "genre",
          answerValue: pickRandom(["Action", "Comedy", "Drama", "Horror", "Romance"]),
        };

        const res = await fetch("/v1/quiz/movie/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(defaultChoices),
        });

        if (!res.ok) throw new Error("Failed to fetch surprise movie");

        const { sessionId } = await res.json();
        router.push(`/quiz/movie/results?s=${sessionId}`);
      } catch (err) {
        console.error("Surprise Me failed", err);
        router.push("/quiz/movie"); // fallback to quiz start
      }
    };

    fireSurpriseRequest();
  }, [router]);

  return (
    <div className="text-center mt-20 text-gray-600">
      🎲 Choosing something great for you...
    </div>
  );
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

