// ~/Projects/movfoo/app/api/v1/quiz/movie/submit/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3/discover/movie";

export async function POST(request: Request) {
  try {
    const { sessionId, questionKey, answerValue } = await request.json();

    console.log("📥 Received movie quiz answer:", {
      sessionId,
      questionKey,
      answerValue,
    });

    // Load previous answers from somewhere (if stored)
    // For now, we just pass this single one
    const filters = { [questionKey]: answerValue };

    const query = buildQueryFromAnswers(filters);

    const { data } = await axios.get(TMDB_BASE_URL, {
      params: {
        api_key: TMDB_API_KEY,
        language: "en-US",
        sort_by: "popularity.desc",
        page: 1,
        ...query,
      },
    });

    const results = (data.results || []).map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      synopsis: movie.overview,
      poster_url: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
      rating: movie.vote_average,
    }));

    return NextResponse.json({
      sessionId: sessionId || generateSessionId(),
      results,
    });
  } catch (error) {
    console.error("❌ TMDB fetch failed", error);
    return NextResponse.json({ error: "TMDB fetch failed" }, { status: 500 });
  }
}

function buildQueryFromAnswers(answers: Record<string, any>) {
  const query: Record<string, any> = {};

  if (answers.with_genres || answers.genre) {
    query.with_genres = answers.with_genres || answers.genre;
  }

  if (answers["vote_average.gte"] || answers.rating) {
    query["vote_average.gte"] = answers["vote_average.gte"] || answers.rating;
  }

  if (answers.primary_release_year || answers.decade) {
    query.primary_release_year =
      answers.primary_release_year || answers.decade;
  }

  if (answers.with_original_language || answers.language) {
    query.with_original_language =
      answers.with_original_language || answers.language;
  }

  if (answers.with_watch_providers || answers.streaming) {
    query.with_watch_providers =
      answers.with_watch_providers || answers.streaming;
    query.watch_region = "US";
  }

  return query;
}

function generateSessionId(): string {
  return `sess_${Math.random().toString(36).substr(2, 9)}`;
}

