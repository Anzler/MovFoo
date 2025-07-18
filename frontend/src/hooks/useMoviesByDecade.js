import { useEffect, useState } from 'react';

export function useMoviesByDecade(decadeStart) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!decadeStart) return;

    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${import.meta.env.VITE_API_URL}/movies/decade/${decadeStart}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data.results)) {
          throw new Error('Invalid response format: expected results array');
        }
        setMovies(data.results);
      } catch (err) {
        console.error('[useMoviesByDecade] Error:', err);
        setError('Failed to fetch movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [decadeStart]);

  return { movies, loading, error };
}
