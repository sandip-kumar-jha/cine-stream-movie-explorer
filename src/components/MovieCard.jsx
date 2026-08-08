import { getImageUrl } from "../services/omdbApi";

import { useFavorites } from "../context/FavoritesContext";

function MovieCard({ movie }) {
  const {
    isFavorite,
    toggleFavorite,
  } = useFavorites();

  const favorite =
    isFavorite(movie.id);

  const releaseYear =
    movie.release_date
      ? movie.release_date.slice(0, 4)
      : "N/A";

  const rating =
    typeof movie.vote_average === "number" &&
    movie.vote_average > 0
      ? movie.vote_average.toFixed(1)
      : "N/A";

  const posterUrl =
    getImageUrl(
      movie.poster_path
    );

  const handleFavoriteClick = (
    event
  ) => {
    event.preventDefault();
    event.stopPropagation();

    toggleFavorite(movie);
  };

  return (
    <article className="movie-card">

      <div className="movie-poster-wrapper">

        {posterUrl ? (
          <img
            className="movie-poster"
            src={posterUrl}
            alt={`${movie.title} poster`}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display =
                "none";
            }}
          />
        ) : (
          <div className="poster-placeholder">
            <span>🎬</span>

            <p>
              No Poster Available
            </p>
          </div>
        )}

        <div className="movie-rating">
          ⭐ {rating}
        </div>

        <button
          type="button"
          className={`favorite-button ${
            favorite
              ? "favorite-active"
              : ""
          }`}
          onClick={
            handleFavoriteClick
          }
          aria-label={
            favorite
              ? `Remove ${movie.title} from favorites`
              : `Add ${movie.title} to favorites`
          }
          aria-pressed={favorite}
        >
          {favorite ? "♥" : "♡"}
        </button>

      </div>

      <div className="movie-info">

        <h3 title={movie.title}>
          {movie.title ||
            "Untitled Movie"}
        </h3>

        <p>
          {releaseYear}
        </p>

      </div>

    </article>
  );
}

export default MovieCard;