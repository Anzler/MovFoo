// ~/Projects/movfoo/app/api/v1/quiz/movie/submit/route.ts

import { NextResponse } from "next/server";

// ✅ You can replace this with real results from Supabase or TMDB later
const MOCK_MOVIES = [
  {
    id: 1,
    title: "Inception",
    synopsis: "A mind-bending thriller that dives into dreams.",
    poster_url: "https://image.tmdb.org/t/p/w500/8s4h9friP6Ci3adRGahHARVd76E.jpg",
    rating: 8.8,
  },
  {
    id: 2,
    title: "The Matrix",
    synopsis: "A hacker discovers the truth about his reality.",
    poster_url: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    rating: 8.7,
  },
  {
    id: 3,
    title: "The Grand Budapest Hotel",
    synopsis: "A whimsical tale of a concierge and his protégé.",
    poster_url: "https://image.tmdb.org/t/p/w500/nX5XotM9yprCKarRH4fzOq1VM1J.jpg",
    rating: 8.1,
  },
];

export async function POST(request: Request) {
  try {
    const { sessionId, questionKey, answerValue } = await request.json();

    console.log("📥 Received movie quiz answer:", {
      sessionId,
      questionKey,
      answerValue,
    });

    // Optional: persist to Supabase later

    const response = {
      sessionId: sessionId || generateSessionId(),
      results: MOCK_MOVIES,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ Failed to handle movie quiz POST:", error);
    return NextResponse.json(
      { error: "Failed to process quiz submission." },
      { status: 500 }
    );
  }
}

// Utility function to simulate session tracking
function generateSessionId(): string {
  return `sess_${Math.random().toString(36).substr(2, 9)}`;
}

