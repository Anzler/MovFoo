import { useEffect, useState } from 'react';

export function useDecades() {
  const [decades, setDecades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDecades = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL}/decades`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data.decades)) {
          throw new Error('Invalid response format');
        }
        setDecades(data.decades);
      } catch (err) {
        console.error('[useDecades] Error:', err);
        setError('Failed to load decades');
      } finally {
        setLoading(false);
      }
    };

    fetchDecades();
  }, []);

  return { decades, loading, error };
}
