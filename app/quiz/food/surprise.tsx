"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FoodSurprisePage() {
  const router = useRouter();

  useEffect(() => {
    const fireSurpriseRequest = async () => {
      try {
        const defaultChoice = {
          questionKey: "meal_type",
          answerValue: pickRandom(["Dinner", "Snack", "Dessert", "Lunch"]),
        };

        const res = await fetch("/v1/quiz/food/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(defaultChoice),
        });

        if (!res.ok) throw new Error("Failed to fetch surprise recipe");

        const { sessionId } = await res.json();
        router.push(`/quiz/food/results?s=${sessionId}`);
      } catch (err) {
        console.error("Surprise Me (food) failed", err);
        router.push("/quiz/food");
      }
    };

    fireSurpriseRequest();
  }, [router]);

  return (
    <div className="text-center mt-20 text-gray-600">
      🍽️ Choosing a surprise recipe for you…
    </div>
  );
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

