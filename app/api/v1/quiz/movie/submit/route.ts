// ~/Projects/movfoo/app/api/v1/quiz/movie/submit/route.ts

import { NextRequest, NextResponse } from "next/server";

const TMDB_API_URL = "https://api.themoviedb.org/3/discover/movie";
const TMDB_API_KEY = process.env.TMDB_API_KEY!;

function mapQuizAnswersToQuery(answers: Record<string, string | string[] | number>) {
  const params = new URLSearchParams();

  // Always required
  params.set("api_key", TMDB_API_KEY);
  params.set("language", "en-US");
  params.set("include_adult", "false");
  params.set("include_video", "false");
  params.set("sort_by", "popularity.desc");

  // Map known filters
  if (answers.with_genres) {
    const genre = Array.isArray(answers.with_genres)
      ? answers.with_genres.join(",")
      : answers.with_genres;
    params.set("with_genres", genre);
  }

  if (answers.primary_release_year) {
    params.set("primary_release_year", String(answers.primary_release_year));
  }

  if (answers.with_original_language) {
    params.set("with_original_language", String(answers.with_original_language));
  }

  if (answers["vote_average.gte"]) {
    params.set("vote_average.gte", String(answers["vote_average.gte"]));
  }

  if (answers.with_watch_providers) {
    const providers = Array.isArray(answers.with_watch_providers)
      ? answers.with_watch_providers.join("|")
      : answers.with_watch_providers;
    params.set("with_watch_providers", providers);
    params.set("watch_region", "US"); // Or change to your user's region
  }

  if (answers.media_type && answers.media_type === "tv") {
    // Optional: redirect to /discover/tv if media_type is "tv"
    params.set("media_type", "tv");
  }

  return params.toString();
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId, questionKey, answerValue } = await req.json();

    // Grab current answers from localStorage or Supabase (mocked here)
    const stored = req.cookies.get("quiz_answers_movie")?.value ?? "{}";
    const answers = JSON.parse(stored);

    // Merge new answer
    const updatedAnswers = {
      ...answers,
      [questionKey]: answerValue,
    };

    // Construct TMDB query string
    const queryString = mapQuizAnswersToQuery(updatedAnswers);
    const url = `${TMDB_API_URL}?${queryString}`;

    const response = await fetch(url);
    const data = await response.json();

    const results = (data.results || []).slice(0, 12).map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      poster_url: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
      synopsis: movie.overview,
      rating: movie.vote_average,
    }));

    return NextResponse.json({
      sessionId: sessionId || generateSessionId(),
      results,
    });
  } catch (err) {
    console.error("❌ TMDB integration failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch from TMDB" },
      { status: 500 }
    );
  }
}

function generateSessionId(): string {
  return `sess_${Math.random().toString(36).substring(2, 10)}`;
}

