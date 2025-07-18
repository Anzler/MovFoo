// backend/src/routes/questions.ts

import express from 'express';
import { Pool } from 'pg';

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/questions
router.get('/questions', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, category, question_text, choices, field, input_type, "order"
       FROM questions
       ORDER BY "order" ASC`
    );

    // Optionally map for frontend compatibility
    const questions = rows.map((q) => ({
      id: q.id,
      category: q.category,
      question_text: q.question_text,
      field: q.field,
      choices: q.choices,
      input_type: q.input_type,
      order: q.order,
    }));

    res.json({ questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

