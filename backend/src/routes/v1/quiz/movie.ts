import express from "express";
import { z } from "zod";
import axios from "axios";

const router = express.Router();

// 1. Define input schema
const QuizInput = z.object({
  genre: z.string(),          // e.g. "Action"
  type: z.enum(["movie", "tv"]),
  releaseWindow: z.enum(["new", "classic"]),
  platforms: z.array(z.string()).optional(), // For future use
});

router.post("/submit", async (req, res) => {
  const parsed = QuizInput.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", issues: parsed.error.issues });
  }

  const { genre, type, releaseWindow } = parsed.data;

  try {
    // 2. Build TMDB query
    const genreMap: Record<string, number> = {
      Action: 28,
      Comedy: 35,
      Drama: 18,
      Horror: 27,
      // Add more as needed
    };

    const genreId = genreMap[genre];
    const currentYear = new Date().getFullYear();
    const yearFilter = releaseWindow === "new" ? currentYear - 3 : 2000;

    const response = await axios.get("https://api.themoviedb.org/3/discover/movie", {
      params: {
        api_key: process.env.TMDB_API_KEY,
        with_genres: genreId,
        primary_release_date_gte: `${yearFilter}-01-01`,
        sort_by: "popularity.desc",
        page: 1,
      },
    });

    const results = response.data.results.slice(0, 3); // Return top 3
    res.status(200).json({ results });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch from TMDB" });
  }
});

export default router;

