// ~/app/api/debug/tmdb/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "TMDB_API_KEY is not set" }, { status: 500 });
  }

  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=28&sort_by=popularity.desc`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    return NextResponse.json({ success: true, results: data.results?.slice(0, 3) || [] });
  } catch (error) {
    console.error("❌ TMDB fetch failed:", error);
    return NextResponse.json({ error: "TMDB fetch failed" }, { status: 500 });
  }
}

