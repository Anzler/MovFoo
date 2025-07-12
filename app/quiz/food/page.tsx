// ~/Projects/movfoo/app/quiz/food/page.tsx
'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { foodQuizSteps } from "@/app/quiz/config/foodQuizSteps";

export default function FoodQuizStartPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to first question
    router.replace(`/quiz/food/q/${foodQuizSteps[0].id}`);
  }, [router]);

  return (
    <main className="text-center max-w-xl mx-auto py-20 px-6">
      <p className="text-gray-600">Preparing your food quiz...</p>
    </main>
  );
}

