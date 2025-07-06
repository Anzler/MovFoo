import express from "express";
import { z } from "zod";
import { supabase } from "../../../db.js";

const router = express.Router();

/**
 * POST /v1/quiz/food/submit
 */
router.post("/submit", async (req, res) => {
  const schema = z.object({
    sessionId: z.string().uuid().optional(),
    userId: z.string().uuid().optional(),
    questionKey: z.string(),
    answerValue: z.union([z.string(), z.number(), z.boolean()]),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input", issues: parsed.error.issues });
  }

  const { sessionId, userId, questionKey, answerValue } = parsed.data;

  try {
    const session = await upsertSession(sessionId, userId, questionKey, answerValue, "food");
    const results = await fetchRecipeSuggestions(session.answers);

    res.status(200).json({
      sessionId: session.id,
      currentStep: session.current_step,
      results,
    });
  } catch (err) {
    console.error("Food quiz submit error:", err);
    res.status(500).json({ message: "Failed to submit answer" });
  }
});

/**
 * GET /v1/quiz/food/results?s=sessionId
 */
router.get("/results", async (req, res) => {
  const sessionId = req.query.s;
  if (!sessionId) return res.status(400).json({ message: "Missing sessionId" });

  try {
    const { data: session, error } = await supabase
      .from("quiz_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (error || !session) throw error || new Error("Session not found");

    const answers = session.answers || {};
    const results = await fetchRecipeSuggestions(answers);

    res.status(200).json({ results });
  } catch (err) {
    console.error("Food results error:", err);
    res.status(500).json({ message: "Failed to fetch food results" });
  }
});

export default router;

/* ─────────────────────── Helpers ─────────────────────── */

async function upsertSession(id, userId, key, val, type = "food") {
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

async function fetchRecipeSuggestions(answers) {
  let q = supabase.from("recipe_view").select("*");

  if (answers.meal_type) q = q.eq("meal_type", answers.meal_type);
  if (answers.cuisine && answers.cuisine !== "Surprise me") {
    q = q.eq("cuisine", answers.cuisine);
  }
  if (answers.diet && answers.diet !== "None") {
    q = q.eq("diet", answers.diet);
  }

  q = q.order("popularity", { ascending: false }).limit(3);

  const { data, error } = await q;
  if (error || !data) return [];

  return data.map((r) => ({
    name: r.name,
    poster_url: r.image_url,
    description: r.description,
    prep_time: r.prep_time,
  }));
}

