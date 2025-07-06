"use client";
import { useRouter } from "next/navigation";

export default function QuizStart() {
  const router = useRouter();
  return (
    <section className="text-center space-y-6">
      <h1 className="text-2xl font-bold">Dinner & a Movie</h1>
      <p className="text-gray-600">
        Answer as many or as few questions as you like, or hit&nbsp;
        <em>Surprise Me</em>&nbsp;whenever you want.
      </p>
      <button
        onClick={() => router.push("/quiz/q/genre")}
        className="btn-primary"
      >
        Start&nbsp;Quiz
      </button>
    </section>
  );
}

