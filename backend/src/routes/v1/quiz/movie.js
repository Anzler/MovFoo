import express from "express";
import { z } from "zod";
import axios from "axios";

const router = express.Router();

// Input schema for quiz submission
const QuizInput = z.object({
  genre: z.string(), // e.g., "Action"
  type: z.enum(["movie", "tv"]),
  releaseWindow: z.enum(["new", "classic"]),
  platforms: z.array(z.string()).optional(), // Reserved for future use
});

// POST /v1/quiz/movie/submit
router.post("/submit", async (req, res) => {
  const parsed = QuizInput.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", issues: parsed.error.issues });
  }

  const { genre, type, releaseWindow } = parsed.data;

  try {
    const genreMap = {
      Action: 28,
      Comedy: 35,
      Drama: 18,
      Horror: 27,
      // Extend as needed
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

    const results = response.data.results.slice(0, 3);
    res.status(200).json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch from TMDB" });
  }
});

// GET /v1/quiz/movie/results?s=sessionId
router.get("/results", async (req, res) => {
  const sessionId = req.query.s;

  if (!sessionId || typeof sessionId !== "string") {
    return res.status(400).json({ error: "Missing session ID" });
  }

  try {
    // Replace with real logic to look up quiz results from your DB or session
    const mockResults = [
      {
        id: "1",
        title: "Inception",
        synopsis: "A thief who steals corporate secrets...",
        poster_url: "https://image.tmdb.org/t/p/w500/xyz.jpg",
        rating: 8.8,
        source: "Netflix",
      },
      {
        id: "2",
        title: "The Dark Knight",
        synopsis: "Batman raises the stakes...",
        poster_url: "https://image.tmdb.org/t/p/w500/abc.jpg",
        rating: 9.0,
        source: "HBO Max",
      },
    ];

    res.status(200).json({ results: mockResults });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve quiz results" });
  }
});

// GET /v1/quiz/movie/surprise
router.get("/surprise", async (req, res) => {
  try {
    const response = await axios.get("https://api.themoviedb.org/3/movie/popular", {
      params: {
        api_key: process.env.TMDB_API_KEY,
        page: 1,
      },
    });

    const movies = response.data.results;
    if (!movies || movies.length === 0) {
      return res.status(404).json({ error: "No movies found" });
    }

    const randomIndex = Math.floor(Math.random() * movies.length);
    const movie = movies[randomIndex];

    res.status(200).json({
      id: movie.id,
      title: movie.title,
      synopsis: movie.overview,
      poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      rating: movie.vote_average,
      source: "TMDB",
    });
  } catch (err) {
    console.error("❌ Surprise movie fetch error:", err);
    res.status(500).json({ error: "Failed to fetch surprise movie" });
  }
});

export default router;

