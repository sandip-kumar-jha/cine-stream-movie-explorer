import MovieCard from "./MovieCard";

function MovieGrid({ movies }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          🎬
        </div>

        <h3>No movies found</h3>

        <p>
          We couldn't find any movies
          to display.
        </p>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
        />
      ))}
    </div>
  );
}

export default MovieGrid;