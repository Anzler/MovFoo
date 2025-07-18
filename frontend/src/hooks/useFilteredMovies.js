import { useEffect, useState } from 'react';

export function useFilteredMovies(answers) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Skip if no answers yet
    if (!answers || Object.keys(answers).length === 0) return;

    // Optional: guard against partially filled answers
    const hasEmpty = Object.values(answers).some((v) => v === null || v === '');
    if (hasEmpty) return;

    const fetchFilteredMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const payload = {
          answers: Object.entries(answers).map(([field, value]) => ({ field, value })),
        };

        console.log('[useFilteredMovies] Sending payload:', payload);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/filter`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();
        setMovies(data.results || []);
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

