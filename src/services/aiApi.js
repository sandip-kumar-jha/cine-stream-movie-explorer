const GEMINI_API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY;

const GEMINI_MODEL =
  "gemini-3.6-flash";

const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;


const sanitizeMovieTitle = (title) => {
  return title
    .replace(/^["'`]+|["'`]+$/g, "")
    .replace(
      /^(movie title:|title:)\s*/i,
      ""
    )
    .replace(/^\d+[\s.)-]+/, "")
    .trim();
};


export const getMovieSuggestion =
  async (mood) => {
    const trimmedMood =
      mood.trim();

    if (!trimmedMood) {
      throw new Error(
        "Please describe your mood."
      );
    }

    if (!GEMINI_API_KEY) {
      throw new Error(
        "Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file."
      );
    }

    const prompt = `
You are a movie recommendation assistant.

The user wants a movie based on this request:

"${trimmedMood}"

Suggest exactly ONE movie.

Return ONLY the movie title as plain text.

Do not return:
- quotation marks
- explanation
- bullet points
- numbering
- release year
- additional text
`;

    const response =
      await fetch(
        GEMINI_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

    if (!response.ok) {
      let errorMessage =
        "Gemini request failed.";

      try {
        const errorData =
          await response.json();

        if (
          errorData?.error?.message
        ) {
          errorMessage =
            errorData.error.message;
        }
      } catch {
        // Ignore JSON parsing errors
      }

      throw new Error(
        `${errorMessage} (Status: ${response.status})`
      );
    }

    const data =
      await response.json();

    const suggestion =
      data?.candidates?.[0]
        ?.content?.parts?.[0]
        ?.text;

    if (!suggestion) {
      throw new Error(
        "AI did not return a movie title."
      );
    }

    return sanitizeMovieTitle(
      suggestion
    );
  };