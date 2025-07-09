// ~/Projects/movfoo/backend/src/routes/v1/quiz/food.js
//
// Handles the “What should I eat?” quiz logic.
// Submits answers, stores in quiz_sessions, and returns matching recipes.

import express from "express";
import { z } from "zod";
import axios from "axios";
import { supabase } from "../../../db.js";

const router = express.Router();

/**
 * POST /v1/quiz/food/submit
 * Store an answer and return updated recipe results.
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
    console.error("❌ Food quiz submit error:", err);
    res.status(500).json({ message: "Failed to submit answer" });
  }
});

/**
 * GET /v1/quiz/food/results?s=sessionId
 * Return quiz results for a given session.
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

    const results = await fetchRecipeSuggestions(session.answers || {});
    res.status(200).json({ results });
  } catch (err) {
    console.error("❌ Food results fetch error:", err);
    res.status(500).json({ message: "Failed to fetch food results" });
  }
});

/**
 * GET /v1/quiz/food/surprise
 * Return a single random recipe (for "Surprise Me" feature) from Supabase.
 */
router.get("/surprise", async (_req, res) => {
  try {
    // Count total recipes to pick a random offset
    const { count, error: countError } = await supabase
      .from("recipe_view")
      .select('*', { count: 'exact', head: true });
    if (countError || !count || count === 0) {
      throw new Error("No recipes available");
    }
    const randomOffset = Math.floor(Math.random() * count);

    const { data, error } = await supabase
      .from("recipe_view")
      .select("*")
      .range(randomOffset, randomOffset)
      .limit(1);

    if (error || !data || !data.length) throw error || new Error("No recipe found");

    const r = data[0];

    res.json({
      recipe: {
        id: r.id,
        title: r.name,
        image: r.image_url,
        summary: r.description,
        readyInMinutes: r.prep_time,
        sourceUrl: r.source_url || undefined
      }
    });
  } catch (err) {
    console.error("❌ Surprise food error:", err);
    res.status(500).json({ message: "Failed to fetch surprise recipe" });
  }
});

/**
 * GET /v1/quiz/food/spoonacular-surprise
 * Return a single random recipe from the Spoonacular API.
 */
router.get("/spoonacular-surprise", async (_req, res) => {
  try {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    if (!apiKey) return res.status(500).json({ message: "Spoonacular API key missing" });

    const response = await axios.get(
      "https://api.spoonacular.com/recipes/random",
      {
        params: {
          apiKey: apiKey,
          number: 1
        }
      }
    );
    const recipe = response.data.recipes && response.data.recipes[0];
    if (!recipe) throw new Error("No Spoonacular recipe found");

    res.json({
      recipe: {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        summary: recipe.summary,
        readyInMinutes: recipe.readyInMinutes,
        sourceUrl: recipe.sourceUrl
      }
    });
  } catch (err) {
    // Handle Spoonacular API errors gracefully
    if (axios.isAxiosError(err) && err.response) {
      console.error("❌ Spoonacular API error:", err.response.data);
      return res.status(500).json({ message: "Spoonacular API error: " + JSON.stringify(err.response.data) });
    }
    console.error("❌ Spoonacular API error:", err);
    res.status(500).json({ message: "Failed to fetch from Spoonacular" });
  }
});

export default router;

/* ───────────────────────── Helpers ───────────────────────── */

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

