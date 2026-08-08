import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import MovieGrid from "../components/MovieGrid";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import SearchBar from "../components/SearchBar";
import MoodMatcher from "../components/MoodMatcher";

import {
  getPopularMovies,
  searchMovies,
} from "../services/omdbApi";

import useDebounce from "../hooks/useDebounce";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

function Home() {
  const [movies, setMovies] = useState([]);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [isSearching, setIsSearching] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [error, setError] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  /*
   * Debounce search input by 500ms.
   */
  const debouncedSearchQuery =
    useDebounce(
      searchQuery,
      500
    );

  /*
   * Sentinel element used by
   * IntersectionObserver.
   */
  const sentinelRef =
    useRef(null);

  /*
   * Fetch movies.
   *
   * Handles:
   * - Popular movies
   * - Search
   * - Pagination
   * - Infinite scroll
   */
  const fetchMovies =
    useCallback(
      async ({
        pageNumber = 1,
        query = "",
        append = false,
      } = {}) => {
        try {
          if (append) {
            setLoadingMore(true);
          } else {
            setLoading(true);
          }

          setError("");

          const trimmedQuery =
            query.trim();

          /*
           * Use search API when query exists.
           * Otherwise load popular movies.
           */
          const data = trimmedQuery
            ? await searchMovies(
                trimmedQuery,
                pageNumber
              )
            : await getPopularMovies(
                pageNumber
              );

          const newMovies =
            data?.results || [];

          /*
           * Replace movies for:
           * - Initial load
           * - New search
           * - Retry
           *
           * Append movies for:
           * - Infinite scroll
           */
          setMovies(
            (previousMovies) => {
              if (!append) {
                return newMovies;
              }

              /*
               * Prevent duplicate movies.
               */
              const existingIds =
                new Set(
                  previousMovies.map(
                    (movie) =>
                      movie.id
                  )
                );

              const uniqueNewMovies =
                newMovies.filter(
                  (movie) =>
                    !existingIds.has(
                      movie.id
                    )
                );

              return [
                ...previousMovies,
                ...uniqueNewMovies,
              ];
            }
          );

          setPage(pageNumber);

          /*
           * OMDb pagination is limited
           * by the API/search implementation.
           *
           * omdbApi.js should return
           * total_pages after normalization.
           */
          setTotalPages(
            Math.min(
              data?.total_pages || 1,
              100
            )
          );
        } catch (err) {
          console.error(
            "Movie fetch error:",
            err
          );

          setError(
            err?.message ||
              "Unable to load movies."
          );
        } finally {
          if (append) {
            setLoadingMore(false);
          } else {
            setLoading(false);
          }
        }
      },
      []
    );

  /*
   * Initial load + debounced search.
   */
  useEffect(() => {
    const query =
      debouncedSearchQuery.trim();

    setIsSearching(
      query.length > 0
    );

    setPage(1);

    fetchMovies({
      pageNumber: 1,
      query,
      append: false,
    });
  }, [
    debouncedSearchQuery,
    fetchMovies,
  ]);

  /*
   * Fetch next page.
   */
  const fetchNextPage =
    useCallback(async () => {
      if (
        loading ||
        loadingMore
      ) {
        return;
      }

      if (
        page >= totalPages
      ) {
        return;
      }

      const nextPage =
        page + 1;

      await fetchMovies({
        pageNumber: nextPage,
        query:
          debouncedSearchQuery,
        append: true,
      });
    }, [
      loading,
      loadingMore,
      page,
      totalPages,
      debouncedSearchQuery,
      fetchMovies,
    ]);

  /*
   * IntersectionObserver.
   */
  useInfiniteScroll({
    targetRef: sentinelRef,

    onIntersect:
      fetchNextPage,

    enabled:
      !loading &&
      !loadingMore &&
      page < totalPages,

    rootMargin: "300px",
  });

  /*
   * Search change.
   */
  const handleSearchChange =
    (value) => {
      setSearchQuery(value);
    };

  /*
   * Clear search.
   */
  const handleClearSearch =
    () => {
      setSearchQuery("");
    };

  /*
   * Retry API request.
   */
  const handleRetry = () => {
    fetchMovies({
      pageNumber: 1,
      query:
        debouncedSearchQuery,
      append: false,
    });
  };

  return (
    <main className="home-page">

      {/* =========================
          HERO SECTION
      ========================== */}

      <section className="hero-section">

        <div className="hero-content">

          <p className="hero-label">
            WELCOME TO CINE-STREAM
          </p>

          <h1>
            Discover Your
            <span>
              {" "}
              Next Favorite Movie
            </span>
          </h1>

          <p className="hero-description">
            Explore popular movies,
            search for your favorites,
            and build your personal
            movie collection.
          </p>

          <SearchBar
            value={searchQuery}
            onChange={
              handleSearchChange
            }
            onClear={
              handleClearSearch
            }
          />

        </div>

      </section>


      {/* =========================
          AI MOOD MATCHER
      ========================== */}

      <MoodMatcher />


      {/* =========================
          MOVIES SECTION
      ========================== */}

      <section className="movies-section">

        <div className="section-header">

          <div>

            <p className="section-label">
              {isSearching
                ? "SEARCH RESULTS"
                : "TRENDING NOW"}
            </p>

            <h2>
              {isSearching
                ? `Results for "${searchQuery}"`
                : "Popular Movies"}
            </h2>

          </div>

        </div>


        {/* INITIAL LOADING */}

        {loading && (
          <Loader
            text={
              isSearching
                ? "Searching movies..."
                : "Loading popular movies..."
            }
          />
        )}


        {/* ERROR */}

        {!loading &&
          error && (
            <ErrorMessage
              message={error}
              onRetry={handleRetry}
            />
          )}


        {/* RESULTS */}

        {!loading &&
          !error && (
            <>

              <MovieGrid
                movies={movies}
              />


              {/* INFINITE SCROLL SENTINEL */}

              <div
                ref={sentinelRef}
                className="infinite-scroll-sentinel"
                aria-hidden="true"
              />


              {/* LOADING NEXT PAGE */}

              {loadingMore && (
                <Loader
                  text="Loading more movies..."
                />
              )}


              {/* END OF RESULTS */}

              {!loadingMore &&
                page >= totalPages &&
                movies.length > 0 && (
                  <p className="end-message">
                    You have reached
                    the end of the
                    results.
                  </p>
                )}


              {/* NO SEARCH RESULTS */}

              {!loadingMore &&
                movies.length === 0 &&
                isSearching && (
                  <div className="empty-search">

                    <h3>
                      No movies found
                    </h3>

                    <p>
                      Try searching
                      with another
                      movie title.
                    </p>

                  </div>
                )}

            </>
          )}

      </section>

    </main>
  );
}

export default Home;