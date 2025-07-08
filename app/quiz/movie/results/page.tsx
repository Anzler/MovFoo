'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ResultsInner, { Movie } from '@/components/quiz/ResultsInner'; // ✅ Import both component and type

export default function MovieResultsPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('s');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('Missing session ID.');
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await fetch(`/v1/quiz/movie/results?s=${sessionId}`);
        if (!res.ok) throw new Error('Failed to fetch results');
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error(err);
        setError('Could not load results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [sessionId]);

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Loading your results…</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-600">{error}</div>;
  }

  return <ResultsInner results={results} />;
}

