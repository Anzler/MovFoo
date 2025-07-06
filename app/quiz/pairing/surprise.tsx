"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PairingSurprisePage() {
  const router = useRouter();

  useEffect(() => {
    const runSurprisePairing = async () => {
      try {
        const defaultAnswers = [
          {
            questionKey: "movie_genre",
            answerValue: pickRandom(["Comedy", "Action", "Romance", "Drama"]),
          },
          {
            questionKey: "meal_type",
            answerValue: pickRandom(["Dinner", "Snack", "Dessert", "Takeout"]),
          },
        ];

        let sessionId: string | null = null;

        for (const answer of defaultAnswers) {
          const res = await fetch("/v1/quiz/pairing/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...answer, sessionId }),
          });

          if (!res.ok) throw new Error("Failed to submit surprise answer");

          const data = await res.json();
          sessionId = data.sessionId;
        }

        router.push(`/quiz/pairing/results?s=${sessionId}`);
      } catch (err) {
        console.error("Surprise pairing failed", err);
        router.push("/quiz/pairing");
      }
    };

    runSurprisePairing();
  }, [router]);

  return (
    <div className="text-center mt-20 text-gray-600">
      🪄 Finding your perfect pairing…
    </div>
  );
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

