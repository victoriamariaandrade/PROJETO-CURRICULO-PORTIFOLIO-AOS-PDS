import { query } from '../config/database.js';

/** Verifica se a API está no ar e se consegue falar com o PostgreSQL. */
export async function health(_req, res) {
  const startedAt = Date.now();
  try {
    await query('SELECT 1');
    res.json({ data: { status: 'ok', database: 'up', latencyMs: Date.now() - startedAt } });
  } catch (error) {
    res.status(503).json({ data: { status: 'degraded', database: 'down', message: error.message } });
  }
}
