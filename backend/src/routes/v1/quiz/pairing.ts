import express from "express";
import { z } from "zod";
import { supabase } from "../../../db.js";

const router = express.Router();

/**
 * POST /v1/quiz/pairing/submit
 * Accepts a single answer step and updates session.
 */
router.post("/submit", async (req, res) => {
  const bodySchema = z.object({
    sessionId: z.string().uuid().optional(),
    userId: z.string().uuid().optional(),
    questionKey: z.string(),
    answerValue: z.union([z.string(), z.number(), z.boolean()]),
  });

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input", issues: parsed.error.issues });
  }

  const { sessionId, userId, questionKey, answerValue } = parsed.data;

  try {
    const session = await upsertSession(sessionId, userId, questionKey, answerValue, "pairing");
    res.status(200).json({
      sessionId: session.id,
      currentStep: session.current_step,
      answers: session.answers,
    });
  } catch (err) {
    console.error("Pairing submit error:", err);
    res.status(500).json({ message: "Failed to submit pairing answer" });
  }
});

/**
 * GET /v1/quiz/pairing/results?s=SESSION_ID
 */
router.get("/results", async (req, res) => {
  const sessionId = req.query.s;
  if (!sessionId) return res.status(400).json({ error: "Missing sessionId" });

  try {
    const { data: session, error } = await supabase
      .from("quiz_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (error || !session) throw error || new Error("Session not found");

    const answers = session.answers || {};
    const movie = await fetchMovieRecommendation(answers);
    const recipe = await fetchRecipeRecommendation(answers);

    res.status(200).json({ movie, recipe });
  } catch (err) {
    console.error("Pairing results error:", err);
    res.status(500).json({ error: "Failed to load pairing" });
  }
});

export default router;

/* ───────────────────────────── Helpers ───────────────────────────── */

async function upsertSession(id, userId, key, val, type = "pairing") {
  let session;

  if (id) {
    const { data, error } = await supabase
      .from("quiz_sessions")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    session = data;
  } else {
    const { data, error } = await supabase
      .from("quiz_sessions")
      .insert({
        user_id: userId,
        quiz_type: type,
        current_step: 0,
        answers: {},
      })
      .select("*")
      .single();
    if (error) throw error;
    session = data;
  }

  const answers = { ...session.answers, [key]: val };
  const step = session.current_step + 1;

  const { data: updated, error: updateErr } = await supabase
    .from("quiz_sessions")
    .update({ answers, current_step: step, updated_at: "now()" })
    .eq("id", session.id)
    .select("*")
    .single();

  if (updateErr) throw updateErr;
  return updated;
}

async function fetchMovieRecommendation(answers) {
  let q = supabase.from("content_view").select("*");

  if (answers.movie_genre) q = q.eq("genre", answers.movie_genre);
  if (answers.movie_tone) q = q.ilike("tone", `%${answers.movie_tone}%`);

  q = q.order("rating", { ascending: false }).limit(1);

  const { data, error } = await q;
  if (error || !data?.length) return null;

  const movie = data[0];
  return {
    title: movie.title,
    poster_url: movie.poster_url,
    synopsis: movie.synopsis,
    rating: movie.rating,
  };
}

async function fetchRecipeRecommendation(answers) {
  let q = supabase.from("recipe_view").select("*");

  if (answers.meal_type) q = q.eq("meal_type", answers.meal_type);
  if (answers.cuisine && answers.cuisine !== "Surprise me") {
    q = q.eq("cuisine", answers.cuisine);
  }

  q = q.order("popularity", { ascending: false }).limit(1);

  const { data, error } = await q;
  if (error || !data?.length) return null;

  const recipe = data[0];
  return {
    name: recipe.name,
    poster_url: recipe.image_url,
    description: recipe.description,
    prep_time: recipe.prep_time,
  };
}

