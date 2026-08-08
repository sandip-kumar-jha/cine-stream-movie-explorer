import MovieGrid from "../components/MovieGrid";

import {
  useFavorites,
} from "../context/FavoritesContext";

function Favorites() {
  const {
    favorites,
    clearFavorites,
  } = useFavorites();

  return (
    <main className="favorites-page">

      {/* Favorites Header */}

      <section className="favorites-hero">

        <p className="section-label">
          YOUR COLLECTION
        </p>

        <div className="favorites-title-row">

          <div>
            <h1>
              My Favorites
            </h1>

            <p>
              {favorites.length}{" "}
              {favorites.length === 1
                ? "movie"
                : "movies"}{" "}
              saved
            </p>
          </div>

          {favorites.length > 0 && (
            <button
              type="button"
              className="clear-favorites-button"
              onClick={clearFavorites}
            >
              Clear All
            </button>
          )}

        </div>

      </section>


      {/* Favorite Movies */}

      {favorites.length > 0 ? (
        <section className="favorites-movies-section">

          <MovieGrid
            movies={favorites}
          />

        </section>
      ) : (
        <section className="empty-favorites">

          <div className="empty-icon">
            ♡
          </div>

          <h2>
            No Favorites Yet
          </h2>

          <p>
            Start exploring movies
            and add your favorites
            to build your collection.
          </p>

        </section>
      )}

    </main>
  );
}

export default Favorites;