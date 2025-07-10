// movfoo-backend/src/routes/v1/spoonacular.js

import express from 'express';

const router = express.Router();
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

router.get('/surprise', async (req, res) => {
  if (!SPOONACULAR_API_KEY) {
    return res.status(500).json({ error: 'Missing Spoonacular API key.' });
  }

  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/random?number=1&apiKey=${SPOONACULAR_API_KEY}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Spoonacular API error:', errorText);
      return res.status(response.status).json({ error: 'Failed to fetch recipe from Spoonacular.' });
    }

    const data = await response.json();
    const recipe = data.recipes?.[0];

    if (!recipe) {
      return res.status(500).json({ error: 'No recipe returned.' });
    }

    res.json({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      summary: recipe.summary,
      readyInMinutes: recipe.readyInMinutes,
      sourceUrl: recipe.sourceUrl,
    });

  } catch (err) {
    console.error('Unexpected error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;

