import { useEffect, useState } from 'react';

export function useFilteredMovies(answers) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Guard: skip if no answers or incomplete values
    if (!answers || Object.keys(answers).length === 0) return;

    const hasEmpty = Object.values(answers).some(
      (v) => v === null || v === '' || v === undefined
    );
    if (hasEmpty) return;

    const fetchFilteredMovies = async () => {
      setLoading(true);
      setError(null);

      const payload = {
        answers: Object.entries(answers).map(([field, value]) => ({ field, value })),
      };

      if (import.meta.env.DEV) {
        console.log('[useFilteredMovies] Sending payload:', payload);
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/filter`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const responseText = await response.text();
          if (import.meta.env.DEV) {
            console.error('[useFilteredMovies] Bad response text:', responseText);
          }
          throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data.results)) {
          throw new Error('Invalid response format: expected results array');
        }

        setMovies(data.results);
      } catch (err) {
        console.error('[useFilteredMovies] Error:', err);
        setError('Failed to fetch filtered movies');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredMovies();
  }, [answers]);

  return { movies, loading, error };
}

