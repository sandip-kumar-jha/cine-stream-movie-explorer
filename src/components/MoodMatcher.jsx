import { useState } from "react";

import {
  getMovieSuggestion,
} from "../services/aiApi";

import {
  searchMovies,
} from "../services/omdbApi";

import MovieCard from "./MovieCard";

function MoodMatcher() {
  const [mood, setMood] = useState("");

  const [movie, setMovie] = useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedMood = mood.trim();

    if (!trimmedMood) {
      setError(
        "Tell us how you are feeling first."
      );

      setMovie(null);

      return;
    }

    try {
      setLoading(true);
      setError("");
      setMovie(null);

      /*
       * STEP 1:
       * Ask Gemini AI for exactly
       * one movie title.
       */
      const movieTitle =
        await getMovieSuggestion(
          trimmedMood
        );

      if (!movieTitle) {
        throw new Error(
          "AI could not suggest a movie."
        );
      }

      /*
       * STEP 2:
       * Send the AI-generated movie title
       * to OMDb.
       */
      const data =
        await searchMovies(
          movieTitle,
          1
        );

      const results =
        data?.results || [];

      /*
       * STEP 3:
       * Take the first available
       * OMDb result.
       */
      const firstMovie =
        results[0];

      if (!firstMovie) {
        throw new Error(
          `OMDb could not find "${movieTitle}".`
        );
      }

      /*
       * STEP 4:
       * Show the movie.
       */
      setMovie(firstMovie);
    } catch (err) {
      console.error(
        "Mood matcher error:",
        err
      );

      setError(
        err?.message ||
          "Unable to find a movie."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mood-matcher">

      {/* Header */}

      <div className="mood-header">

        <p className="mood-label">
          AI POWERED
        </p>

        <h2>
          Mood Matcher
        </h2>

        <p>
          Tell us what you're feeling.
          Our AI will find one movie
          for you.
        </p>

      </div>


      {/* Mood Form */}

      <form
        className="mood-form"
        onSubmit={handleSubmit}
      >

        <input
          type="text"
          value={mood}
          onChange={(event) =>
            setMood(
              event.target.value
            )
          }
          placeholder="e.g. I feel sad but want an action movie"
          aria-label="Describe your mood"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Finding..."
            : "Find My Movie"}
        </button>

      </form>


      {/* Error */}

      {error && (
        <p className="mood-error">
          {error}
        </p>
      )}


      {/* Loading */}

      {loading && (
        <div className="mood-loading">

          <span>
            🤖
          </span>

          <p>
            Finding a movie for your
            mood...
          </p>

        </div>
      )}


      {/* AI Result */}

      {!loading && movie && (
        <div className="mood-result">

          <div className="mood-result-header">

            <p>
              YOUR AI MATCH
            </p>

            <h3>
              {movie.title}
            </h3>

          </div>

          <MovieCard
            movie={movie}
          />

        </div>
      )}

    </section>
  );
}

export default MoodMatcher;