import { useMoviesByDecade } from '../hooks/useMoviesByDecade';

function Nineties() {
  const { movies, loading, error } = useMoviesByDecade(1990);

  return (
    <div className="nineties-results">
      <h2>1990s Movies</h2>
      {loading && <p>Loading movies...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && movies.length > 0 && (
        <ul className="movie-list">
          {movies.map((movie) => (
            <li key={movie.tmdb_id} className="movie-card">
              <h3>
                {movie.title} ({new Date(movie.release_date).getFullYear()})
              </h3>
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
    </div>
  );
}

export default Nineties;
