// ~/Projects/movfoo/app/api/v1/quiz/movie/submit/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3/discover/movie"; // we assume movies only

export async function POST(request: Request) {
  try {
    const { sessionId, questionKey, answerValue } = await request.json();

    // Optionally store the answer
    console.log("📥 Movie quiz answer received:", { sessionId, questionKey, answerValue });

    // Fetch stored answers from localStorage is handled on client side, so here we mock it:
    const filters = {
      media_type: "movie",
      genre: ["28", "35"], // Example genres
      decade: "2000",
      language: "en",
      rating: 7.5,
      streaming: ["8", "9"],
    };

    const params = new URLSearchParams({
      api_key: TMDB_API_KEY!,
      language: "en-US",
      sort_by: "popularity.desc",
      with_genres: filters.genre.join(","),
      primary_release_year: filters.decade,
      with_original_language: filters.language,
      vote_average_gte: filters.rating.toString(),
      with_watch_providers: filters.streaming.join(","),
      watch_region: "US",
    });

    const tmdbRes = await axios.get(TMDB_BASE_URL, { params });

    const results = (tmdbRes.data.results || []).slice(0, 10).map((item: any) => ({
      id: item.id,
      title: item.title,
      poster_url: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
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
      { error: "TMDB request failed" },
      { status: 500 }
    );
  }
}

function generateSessionId(): string {
  return `sess_${Math.random().toString(36).slice(2)}`;
}

