const BASE_URL =
  "https://www.omdbapi.com/";

const API_KEY =
  import.meta.env.VITE_OMDB_KEY;


/*
 * OMDb does not provide a
 * "popular movies" endpoint.
 *
 * Therefore we maintain a curated
 * movie collection and fetch details
 * from OMDb.
 */
const POPULAR_MOVIES = [
  "Inception",
  "The Dark Knight",
  "Interstellar",
  "Avengers Endgame",
  "Avengers Infinity War",
  "The Matrix",
  "Gladiator",
  "Titanic",
  "Avatar",
  "Jurassic Park",

  "The Godfather",
  "The Shawshank Redemption",
  "Forrest Gump",
  "The Lord of the Rings",
  "The Dark Knight Rises",
  "Spider-Man No Way Home",
  "Iron Man",
  "Black Panther",
  "Doctor Strange",
  "Thor Ragnarok",

  "Captain America Civil War",
  "Guardians of the Galaxy",
  "Deadpool",
  "Joker",
  "Oppenheimer",
  "Dune",
  "Dune Part Two",
  "Top Gun Maverick",
  "John Wick",
  "John Wick Chapter 2",

  "John Wick Chapter 3",
  "John Wick Chapter 4",
  "Mission Impossible Fallout",
  "The Batman",
  "Man of Steel",
  "Wonder Woman",
  "Aquaman",
  "Logan",
  "Deadpool 2",
  "Venom",

  "Spider-Man 2",
  "The Amazing Spider-Man",
  "The Hunger Games",
  "Harry Potter and the Sorcerer's Stone",
  "Harry Potter and the Prisoner of Azkaban",
  "Pirates of the Caribbean",
  "The Wolf of Wall Street",
  "The Departed",
  "Shutter Island",
  "The Prestige",

  "Memento",
  "Django Unchained",
  "Pulp Fiction",
  "Fight Club",
  "Se7en",
  "Whiplash",
  "La La Land",
  "The Social Network",
  "The Green Mile",
  "Saving Private Ryan",

  "Mad Max Fury Road",
  "Edge of Tomorrow",
  "Ready Player One",
  "Godzilla",
  "Godzilla vs Kong",
  "The Conjuring",
  "A Quiet Place",
  "Get Out",
  "Parasite",
  "Train to Busan",

  "RRR",
  "KGF Chapter 1",
  "KGF Chapter 2",
  "Baahubali The Beginning",
  "Baahubali 2 The Conclusion",
  "3 Idiots",
  "Dangal",
  "Zindagi Na Milegi Dobara",
  "Taare Zameen Par",
  "Andhadhun",
];


/*
 * Common OMDb request function.
 */
const request = async (params) => {
  if (!API_KEY) {
    throw new Error(
      "OMDb API key is missing. Please add VITE_OMDB_KEY to your .env file."
    );
  }

  const searchParams =
    new URLSearchParams({
      apikey: API_KEY,
      ...params,
    });

  const response =
    await fetch(
      `${BASE_URL}?${searchParams.toString()}`
    );

  if (!response.ok) {
    throw new Error(
      `OMDb request failed. Status: ${response.status}`
    );
  }

  const data =
    await response.json();

  if (data.Response === "False") {
    throw new Error(
      data.Error ||
        "OMDb request failed."
    );
  }

  return data;
};


/*
 * Convert OMDb movie data
 * into the format expected
 * by our React application.
 */
const normalizeMovie = (
  movie
) => {
  return {
    id: movie.imdbID,

    title:
      movie.Title ||
      "Unknown Title",

    poster_path:
      movie.Poster &&
      movie.Poster !== "N/A"
        ? movie.Poster
        : null,

    release_date:
      movie.Year || "",

    vote_average:
      movie.imdbRating &&
      movie.imdbRating !== "N/A"
        ? Number(movie.imdbRating)
        : 0,

    overview:
      movie.Plot &&
      movie.Plot !== "N/A"
        ? movie.Plot
        : "No description available.",

    imdb_id:
      movie.imdbID || "",

    genre:
      movie.Genre || "",

    runtime:
      movie.Runtime || "",

    actors:
      movie.Actors || "",

    director:
      movie.Director || "",
  };
};


/*
 * SEARCH MOVIES
 *
 * Used by:
 * - SearchBar
 * - Debounced search
 * - Infinite scroll
 * - AI Mood Matcher
 */
export const searchMovies =
  async (
    query,
    page = 1
  ) => {
    const trimmedQuery =
      query.trim();

    if (!trimmedQuery) {
      return {
        results: [],
        total_pages: 1,
        total_results: 0,
      };
    }

    const data =
      await request({
        s: trimmedQuery,
        type: "movie",
        page: String(page),
      });

    const movies =
      (data.Search || [])
        .map(normalizeMovie)
        .filter(
          (movie) =>
            movie.id
        );

    const totalResults =
      Number(data.totalResults) ||
      0;

    /*
     * OMDb returns 10 search
     * results per page.
     */
    const totalPages =
      Math.min(
        Math.ceil(
          totalResults / 10
        ),
        100
      );

    return {
      results: movies,

      total_pages:
        totalPages || 1,

      total_results:
        totalResults,
    };
  };


/*
 * GET MOVIE DETAILS
 */
export const getMovieDetails =
  async (
    imdbId
  ) => {
    if (!imdbId) {
      throw new Error(
        "IMDb ID is required."
      );
    }

    const data =
      await request({
        i: imdbId,
        plot: "full",
      });

    return normalizeMovie(
      data
    );
  };


/*
 * GET POPULAR MOVIES
 *
 * OMDb doesn't have a
 * popular endpoint.
 *
 * We divide our curated list
 * into pages of 10 movies.
 */
export const getPopularMovies =
  async (
    page = 1
  ) => {
    const ITEMS_PER_PAGE = 10;

    const startIndex =
      (page - 1) *
      ITEMS_PER_PAGE;

    const movieTitles =
      POPULAR_MOVIES.slice(
        startIndex,
        startIndex +
          ITEMS_PER_PAGE
      );

    const totalPages =
      Math.ceil(
        POPULAR_MOVIES.length /
          ITEMS_PER_PAGE
      );

    if (
      movieTitles.length === 0
    ) {
      return {
        results: [],
        total_pages: totalPages,
        total_results:
          POPULAR_MOVIES.length,
      };
    }

    /*
     * Fetch movie details
     * in parallel.
     */
    const requests =
      movieTitles.map(
        async (title) => {
          try {
            const data =
              await request({
                t: title,
                type: "movie",
                plot: "short",
              });

            return normalizeMovie(
              data
            );
          } catch (error) {
            console.warn(
              `Unable to load ${title}:`,
              error.message
            );

            return null;
          }
        }
      );

    const results =
      await Promise.all(
        requests
      );

    const validMovies =
      results.filter(Boolean);

    return {
      results: validMovies,

      total_pages:
        totalPages,

      total_results:
        POPULAR_MOVIES.length,
    };
  };


/*
 * OMDb already returns a complete
 * image URL.
 *
 * Example:
 * https://m.media-amazon.com/...
 */
export const getImageUrl =
  (posterPath) => {
    if (!posterPath) {
      return null;
    }

    return posterPath;
  };