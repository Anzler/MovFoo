export default function Home() {
  return (
    <section className="mt-12 text-center">
      <h1 className="text-3xl font-bold mb-4">Dinner & A Movie, Simplified</h1>
      <p className="text-gray-700 mb-6">
        Use our AI‑powered quiz to pick the perfect film or show and track what
        you’re watching across every streaming service.
      </p>
      <a
        href="/movies/quiz"
        className="inline-block px-6 py-3 bg-orange-500 text-white rounded"
      >
        Take the Quiz
      </a>
    </section>
  );
}

