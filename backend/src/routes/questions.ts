// backend/src/routes/questions.ts

import express from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/questions
router.get('/questions', async (_req, res) => {
  try {
    const query = `
      SELECT 
        id, 
        category, 
        question_text, 
        choices, 
        field, 
        input_type, 
        "order"
      FROM questions
      ORDER BY "order" ASC
    `;

    const { rows } = await pool.query(query);
    console.log(`✅ Retrieved ${rows.length} question(s) from database`);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'No quiz questions found.' });
    }

    const questions = rows.map((q) => ({
      id: q.id,
      category: q.category,
      question_text: q.question_text,
      field: q.field,
      choices: Array.isArray(q.choices) ? q.choices : [],
      input_type: q.input_type || 'radio',
      order: q.order,
    }));

    // Add decade question manually
    const decadeQuestion = {
      id: null,
      category: 'Time Period',
      question_text: 'What decade is your movie from?',
      field: 'release_date',
      input_type: 'radio',
      choices: [
        { value: '1920', label: '1920s - Women’s Suffrage (1920); The Jazz Singer (1927)' },
        { value: '1930', label: '1930s - The New Deal & FDR’s Fireside Chats (1933); The Wizard of Oz (1939)' },
        { value: '1940', label: "1940s - Victory in WWII (1945); It's a Wonderful Life (1946)" },
        { value: '1950', label: '1950s - The Polio Vaccine (1955); Singin’ in the Rain (1952)' },
        { value: '1960', label: '1960s - Apollo 11 Moon Landing (1969); The Sound of Music (1965)' },
        { value: '1970', label: '1970s - The U.S. Bicentennial (1976); Star Wars (1977)' },
        { value: '1980', label: '1980s - The Fall of the Berlin Wall (1989); E.T. (1982)' },
        { value: '1990', label: '1990s - Rise of the Internet; Titanic (1997)' },
        { value: '2000', label: '2000s - 9/11 Attacks (2001); The Dark Knight (2008)' },
        { value: '2010', label: '2010s - Osama bin Laden’s Death (2011); Frozen (2013)' },
        { value: '2020', label: '2020s - COVID-19 Pandemic; Top Gun: Maverick (2022)' },
        { value: 'any', label: 'Any' },
      ],
      order: 1,
    };

    // Insert as first question (if not already present)
    const finalQuestions = [
      decadeQuestion,
      ...questions.filter((q) => q.field !== 'release_date'),
    ];

    return res.json({ questions: finalQuestions });
  } catch (error) {
    console.error('❌ Error in /api/questions:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

