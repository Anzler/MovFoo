import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase.types";

type QuizAnswerPayload = {
  sessionId?: string;
  questionKey: string;
  answerValue: string | string[];
  allAnswers?: Record<string, any>;
};

export async function POST(req: Request) {
  try {
    const supabase = createServerComponentClient<Database>({ cookies });

    const {
      sessionId,
      questionKey,
      answerValue,
      allAnswers = {},
    }: QuizAnswerPayload = await req.json();

    console.log("📥 Received answer:", { sessionId, questionKey, answerValue });

    let updatedSessionId = sessionId;
    let answers: Record<string, any> = {};

    if (sessionId) {
      const { data, error } = await supabase
        .from("quiz_sessions")
        .select("id, answers")
        .eq("id", sessionId)
        .single();

      if (error) throw error;

      answers =
        typeof data.answers === "object" &&
        data.answers !== null &&
        !Array.isArray(data.answers)
          ? (data.answers as Record<string, any>)
          : {};
    } else {
      const { data, error } = await supabase
        .from("quiz_sessions")
        .insert({ answers: {} })
        .select("id")
        .single();

      if (error) throw error;
      updatedSessionId = data.id;
    }

    // Merge latest answer
    answers[questionKey] = answerValue;

    const { error: updateError } = await supabase
      .from("quiz_sessions")
      .update({ answers })
      .eq("id", updatedSessionId!);

    if (updateError) throw updateError;

    // === Build Supabase query ===
    let query = supabase
      .from("movies")
      .select("*")
      .limit(6)
      .order("popularity", { ascending: false });

    // === Filtering logic ===

    // Genres
    const genres = answers.with_genres;
    if (Array.isArray(genres)) {
      query = query.overlaps("genres", genres);
    } else if (genres) {
      query = query.contains("genres", [genres]);
    }

    // Release year
    const year = parseInt(answers.primary_release_year);
    if (!isNaN(year)) {
      query = query.gte("release_year", year);
    }

    // Language
    if (answers.with_original_language) {
      query = query.eq("original_language", answers.with_original_language);
    }

    // Rating
    const rating = parseFloat(answers["vote_average.gte"]);
    if (!isNaN(rating)) {
      query = query.gte("vote_average", rating);
    }

    // Streaming providers
    const providers = answers.with_watch_providers;
    if (Array.isArray(providers)) {
      query = query.overlaps("streaming_platforms", providers);
    } else if (providers) {
      query = query.contains("streaming_platforms", [providers]);
    }

    // Audience
    if (answers.audience) {
      query = query.eq("audience", answers.audience);
    }

    const { data: results, error: fetchError } = await query;
    if (fetchError) throw fetchError;

    return NextResponse.json({
      sessionId: updatedSessionId,
      results: results.map((movie) => ({
        id: movie.id,
        title: movie.title,
        poster_url: movie.poster_url,
        synopsis: movie.overview || movie.description,
        rating: movie.vote_average || movie.rating,
      })),
    });
  } catch (err) {
    console.error("❌ Supabase query error:", err);
    return NextResponse.json(
      { error: "Failed to fetch movie recommendations." },
      { status: 500 }
    );
  }
}

