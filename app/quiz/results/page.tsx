'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ResultsInner from '@/components/quiz/ResultsInner';

export interface Movie {
  id: string;
  title: string;
  synopsis?: string;
  poster_url?: string;
  rating?: number;
  source?: string;
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('s');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('Missing session ID');
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await fetch(`/v1/quiz/pairing/results?s=${sessionId}`);
        if (!res.ok) throw new Error('Failed to fetch pairing results');
        const data = await res.json();
        setResults(data.movie ? [data.movie] : []);
      } catch (err) {
        console.error(err);
        setError('Could not load results.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [sessionId]);

  if (loading) return <p className="p-6 text-center">Loading results…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return <ResultsInner results={results} />;
}

