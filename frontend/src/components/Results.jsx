// frontend/src/components/Results.jsx

import { useEffect, useState } from 'react';

function Results({ answers }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulated API fetch
  useEffect(() => {
    if (!answers || Object.keys(answers).length === 0) return;

    const fetchMovies = async () => {
      setLoading(true);

      try {
        // Replace this with actual backend call
        const response = await fakeFetchMovies(answers);
        setMovies(response);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [answers]);

  if (!answers || Object.keys(answers).length === 0) {
    return null;
  }

  if (loading) {
    return <div>Loading movie suggestions...</div>;
  }

  if (movies.length === 0) {
    return <div>No matching movies found. Try different choices!</div>;
  }

  return (
    <div className="results">
      <h2>🎥 Recommended Movies</h2>
      <ul className="movie-list">
        {movies.map((movie) => (
          <li key={movie.tmdb_id} className="movie-card">
            <h3>{movie.title}</h3>
            <p>{movie.overview?.slice(0, 150)}...</p>
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Temporary fake backend fetch
async function fakeFetchMovies(answers) {
  console.log('Simulating fetch for answers:', answers);

  // Return fake result
  return [
    {
      tmdb_id: 123,
      title: 'Back to the Future',
      overview: 'A teenager travels back in time to 1955.',
      poster_path: '/bttf.jpg'
    },
    {
      tmdb_id: 456,
      title: 'The Matrix',
      overview: 'A hacker discovers reality is a simulation.',
      poster_path: '/matrix.jpg'
    }
  ];
}

export default Results;

