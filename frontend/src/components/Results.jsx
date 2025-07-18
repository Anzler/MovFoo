// frontend/src/components/Results.jsx

import { useFilteredMovies } from '../hooks/useFilteredMovies';

function Results({ answers }) {
  const { movies, loading, error } = useFilteredMovies(answers);

  if (!answers || Object.keys(answers).length === 0) return null;
  if (loading) return <p>Loading movie suggestions...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (movies.length === 0) return <p>No matching movies found. Try different choices.</p>;

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

export default Results;

