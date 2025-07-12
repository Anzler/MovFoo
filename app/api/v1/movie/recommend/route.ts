import { NextResponse } from "next/server";

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
    const { filters } = await request.json();

    console.log("📦 Movie recommendations requested with filters:", filters);

    return NextResponse.json({ results: MOCK_MOVIES });
  } catch (err) {
    console.error("❌ Failed to generate movie results:", err);
    return NextResponse.json(
      { error: "Failed to fetch recommendations." },
      { status: 500 }
    );
  }
}

