// frontend/src/hooks/useFilteredMovies.js

import { useEffect, useState } from 'react';

export function useFilteredMovies(answers) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!answers || Object.keys(answers).length === 0) return;

    const fetchFilteredMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/filter`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ answers: Object.entries(answers).map(([field, value]) => ({ field, value })) })
        });

        const data = await response.json();
        setMovies(data.results || []);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch filtered movies');
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredMovies();
  }, [answers]);

  return { movies, loading, error };
}

