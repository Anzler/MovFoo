import express from "express";
import { z } from "zod";
import axios from "axios";

const router = express.Router();

// Input schema for quiz submission
const QuizInput = z.object({
  genre: z.string(),
  type: z.enum(["movie", "tv"]),
  releaseWindow: z.enum(["new", "classic"]),
  platforms: z.array(z.string()).optional(),
});

// --- POST /v1/quiz/movie/submit ---
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
    console.error("TMDB fetch error:", err);
    res.status(500).json({ error: "Failed to fetch from TMDB" });
  }
});

// --- GET /v1/quiz/movie/results?s=sessionId ---
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
    console.error("Quiz results fetch error:", err);
    res.status(500).json({ error: "Failed to retrieve quiz results" });
  }
});

// --- GET /v1/quiz/movie/surprise --- (for "Surprise Me" front-end) ---
router.get("/surprise", async (req, res) => {
  try {
    // We'll fetch a random popular movie from TMDB
    const randomPage = Math.floor(Math.random() * 10) + 1; // pages 1-10
    const response = await axios.get("https://api.themoviedb.org/3/discover/movie", {
      params: {
        api_key: process.env.TMDB_API_KEY,
        sort_by: "popularity.desc",
        page: randomPage,
      },
    });

    const movies = response.data.results;
    if (!movies || movies.length === 0) {
      console.warn("No results from TMDB for surprise.");
      return res.status(404).json({ error: "No movies found for surprise" });
    }

    // Pick a truly random movie from this page
    const movie = movies[Math.floor(Math.random() * movies.length)];
    if (!movie) {
      console.warn("No movie found at random index on surprise page");
      return res.status(404).json({ error: "No movie found" });
    }

    // Clean, minimal response for front-end
    res.json({
      movie: {
        id: movie.id,
        title: movie.title,
        poster_url: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,
        synopsis: movie.overview,
        rating: movie.vote_average,
        release_date: movie.release_date,
        source: "TMDB",
      },
    });
  } catch (err) {
    console.error("Surprise movie error:", err);

    // Fallback: return a hardcoded "surprise" if all else fails
    res.status(200).json({
      movie: {
        id: "fallback-1",
        title: "Surprise: The Matrix",
        poster_url: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
        synopsis: "A computer hacker learns about the true nature of reality...",
        rating: 8.7,
        release_date: "1999-03-31",
        source: "Fallback (Hardcoded)",
      },
      warning: "Fallback movie used due to API failure.",
    });
  }
});

export default router;

