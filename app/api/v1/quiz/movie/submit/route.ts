import { NextResponse } from "next/server";
import axios from "axios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3/discover/movie";
const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function POST(request: Request) {
  try {
    const { sessionId, questionKey, answerValue, allAnswers } = await request.json();

    console.log("📥 Quiz input received:", {
      sessionId,
      questionKey,
      answerValue,
      allAnswers,
    });

    if (!TMDB_API_KEY) {
      throw new Error("❌ TMDB_API_KEY is missing from environment");
    }

    const queryParams = buildQueryParams(allAnswers);
    console.log("🎬 TMDB query params:", queryParams);

    const response = await axios.get(TMDB_BASE_URL, {
      headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`,
      },
      params: queryParams,
    });

    const tmdbResults = response.data.results?.slice(0, 6) || [];

    const results = tmdbResults.map((item: any) => ({
      id: item.id,
      title: item.title,
      poster_url: item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : null,
      synopsis: item.overview,
      rating: item.vote_average,
    }));

    return NextResponse.json({
      sessionId: sessionId || generateSessionId(),
      results,
    });
  } catch (error) {
    console.error("❌ TMDB fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch movie recommendations." },
      { status: 500 }
    );
  }
}

function buildQueryParams(answers: Record<string, any>) {
  const params: Record<string, any> = {
    language: "en-US",
    sort_by: answers.sort_by || "popularity.desc",
    include_adult: false,
    page: 1,
  };

  if (answers.with_genres) params.with_genres = answers.with_genres;
  if (answers.with_original_language) params.with_original_language = answers.with_original_language;
  if (answers.vote_average_gte) params["vote_average.gte"] = answers.vote_average_gte;
  if (answers.with_watch_providers) {
    params.with_watch_providers = answers.with_watch_providers;
    params.watch_region = "US"; // required for provider filtering
  }

  return params;
}

function generateSessionId(): string {
  return `sess_${Math.random().toString(36).substring(2, 10)}`;
}

