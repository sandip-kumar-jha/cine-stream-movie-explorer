import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const FavoritesContext =
  createContext(null);

const STORAGE_KEY =
  "cine-stream-favorites";

function FavoritesProvider({
  children,
}) {
  /*
   * Load favorites from localStorage
   * when application starts.
   */
  const [favorites, setFavorites] =
    useState(() => {
      try {
        const savedFavorites =
          localStorage.getItem(
            STORAGE_KEY
          );

        if (!savedFavorites) {
          return [];
        }

        const parsedFavorites =
          JSON.parse(savedFavorites);

        return Array.isArray(
          parsedFavorites
        )
          ? parsedFavorites
          : [];
      } catch (error) {
        console.error(
          "Failed to load favorites:",
          error
        );

        return [];
      }
    });

  /*
   * Save favorites to localStorage
   * whenever favorites change.
   */
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(favorites)
      );
    } catch (error) {
      console.error(
        "Failed to save favorites:",
        error
      );
    }
  }, [favorites]);

  /*
   * Check whether a movie is
   * already in favorites.
   */
  const isFavorite = (movieId) => {
    return favorites.some(
      (movie) =>
        movie.id === movieId
    );
  };

  /*
   * Add movie to favorites.
   */
  const addFavorite = (movie) => {
    if (!movie?.id) {
      return;
    }

    setFavorites(
      (previousFavorites) => {
        const alreadyExists =
          previousFavorites.some(
            (favorite) =>
              favorite.id === movie.id
          );

        if (alreadyExists) {
          return previousFavorites;
        }

        return [
          ...previousFavorites,
          movie,
        ];
      }
    );
  };

  /*
   * Remove movie from favorites.
   */
  const removeFavorite = (
    movieId
  ) => {
    setFavorites(
      (previousFavorites) =>
        previousFavorites.filter(
          (movie) =>
            movie.id !== movieId
        )
    );
  };

  /*
   * Add or remove favorite.
   */
  const toggleFavorite = (
    movie
  ) => {
    if (!movie?.id) {
      return;
    }

    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  /*
   * Remove all favorites.
   */
  const clearFavorites = () => {
    setFavorites([]);
  };

  const value = {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
  };

  return (
    <FavoritesContext.Provider
      value={value}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

/*
 * Custom hook.
 */
export function useFavorites() {
  const context =
    useContext(
      FavoritesContext
    );

  if (!context) {
    throw new Error(
      "useFavorites must be used inside FavoritesProvider"
    );
  }

  return context;
}

export default FavoritesProvider;