import express from 'express';
import { Pool } from 'pg';

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/health
router.get('/health', async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', time: result.rows[0].now });
  } catch (err) {
    console.error('❌ Health check failed:', err.message);
    res.status(500).json({ status: 'error', error: err.message });
  }
});

export default router;

