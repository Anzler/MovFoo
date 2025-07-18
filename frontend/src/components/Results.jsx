import { useFilteredMovies } from '../hooks/useFilteredMovies';

function Results({ answers, onRestart }) {
  const { movies, loading, error } = useFilteredMovies(answers);

  if (!answers || Object.keys(answers).length === 0) return null;

  return (
    <div className="results">
      <h2>🎥 Recommended Movies</h2>

      {loading && <p>Loading movie suggestions...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && movies.length === 0 && (
        <p>No matching movies found. Try different choices.</p>
      )}

      {!loading && movies.length > 0 && (
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
      )}

      {/* Optional: Display quiz answers */}
      <div className="answers-summary">
        <h4>Your Answers</h4>
        <ul>
          {Object.entries(answers).map(([field, value]) => (
            <li key={field}>
              <strong>{field}</strong>: {value}
            </li>
          ))}
        </ul>
      </div>

      {/* Start Over */}
      {typeof onRestart === 'function' && (
        <button className="restart-btn" onClick={onRestart}>
          🔁 Start Over
        </button>
      )}
    </div>
  );
}

export default Results;

