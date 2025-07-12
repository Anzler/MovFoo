// ~/app/quiz/movie/results/page.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

type Movie = {
  id: number;
  title: string;
  poster_url?: string;
  synopsis?: string;
  rating?: number;
};

export default function MovieResultsPage() {
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const storageKey = 'quiz_answers_movie';

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      const stored = localStorage.getItem(storageKey);
      if (!stored) {
        setError('No quiz answers found.');
        setLoading(false);
        return;
      }

      try {
        const answers = JSON.parse(stored);
        const res = await axios.post('/api/v1/quiz/movie/submit', {
          sessionId: null,
          questionKey: '',
          answerValue: '',
          allAnswers: answers,
        });

        setResults(res.data.results || []);
      } catch (err) {
        console.error('❌ Fetch error:', err);
        setError('Failed to load recommendations.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-500">
        Loading recommendations...
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-20 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">🎬 Your Movie Matches</h1>
      {results.length === 0 ? (
        <p className="text-gray-500">
          No results found. Try adjusting your quiz filters.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {results.map((movie) => (
            <div key={movie.id} className="rounded-lg shadow border p-3">
              {movie.poster_url && (
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="w-full rounded"
                />
              )}
              <h2 className="text-sm font-semibold mt-2">{movie.title}</h2>
              {movie.rating && (
                <p className="text-xs text-yellow-600">
                  ⭐ {movie.rating}/10
                </p>
              )}
              {movie.synopsis && (
                <p className="text-xs text-gray-500 mt-1">{movie.synopsis}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

