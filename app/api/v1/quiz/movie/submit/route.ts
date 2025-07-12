// ~/app/api/v1/quiz/movie/submit/route.ts

import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase.types";

type QuizAnswerPayload = {
  sessionId?: string;
  questionKey: string;
  answerValue: string;
};

export async function POST(req: Request) {
  try {
    const supabase = createServerComponentClient<Database>({ cookies });
    const { sessionId, questionKey, answerValue }: QuizAnswerPayload = await req.json();

    console.log("📥 Received answer:", { sessionId, questionKey, answerValue });

    // Step 1: Get or create a quiz session
    let updatedSessionId = sessionId;
    let answers: Record<string, string> = {};

    if (sessionId) {
      const { data, error } = await supabase
        .from("quiz_sessions")
        .select("id, answers")
        .eq("id", sessionId)
        .single();

      if (error) throw error;
      answers = (data.answers ?? {}) as Record<string, string>;
    } else {
      const { data, error } = await supabase
        .from("quiz_sessions")
        .insert({ answers: {} })
        .select("id")
        .single();

      if (error) throw error;
      updatedSessionId = data.id;
    }

    // Step 2: Update the answers
    answers[questionKey] = answerValue;

    const { error: updateError } = await supabase
      .from("quiz_sessions")
      .update({ answers })
      .eq("id", updatedSessionId);

    if (updateError) throw updateError;

    // Step 3: Build the dynamic Supabase query
    let query = supabase.from("movies").select("*").limit(6).order("popularity", { ascending: false });

    if (answers.genre) {
      query = query.contains("genres", [answers.genre]);
    }

    if (answers.release_year) {
      const year = parseInt(answers.release_year);
      if (!isNaN(year)) {
        query = query.gte("release_year", year);
      }
    }

    if (answers.original_language) {
      query = query.eq("original_language", answers.original_language);
    }

    if (answers.vote_average_gte) {
      const rating = parseFloat(answers.vote_average_gte);
      if (!isNaN(rating)) {
        query = query.gte("vote_average", rating);
      }
    }

    if (answers.with_watch_providers) {
      query = query.contains("streaming_platforms", [answers.with_watch_providers]);
    }

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

