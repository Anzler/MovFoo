"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import MovieQuizResults from "../../../components/quiz/ResultsInner";

export default function ResultsPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="text-center mt-20 text-gray-500">
          Loading results…
        </div>
      }
    >
      <MovieQuizResults />
    </Suspense>
  );
}

