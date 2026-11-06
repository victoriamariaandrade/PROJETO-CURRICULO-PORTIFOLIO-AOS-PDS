import pg from 'pg';

import { HttpError } from '../utils/HttpError.js';
import { env } from './env.js';

// Colunas DATE chegam como texto `YYYY-MM-DD`, sem conversão de fuso horário.
pg.types.setTypeParser(pg.types.builtins.DATE, (value) => value);

// Pool pequeno: na Vercel cada instância da função mantém suas próprias conexões.
// Use a connection string "pooled" do Neon (host com `-pooler`).
export const pool = new pg.Pool({
  connectionString: env.databaseUrl,
  max: 5,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 10_000,
});

pool.on('error', (error) => {
  console.error('[database] Erro inesperado em conexão ociosa:', error.message);
});

function ensureConfigured() {
  if (!env.databaseUrl) {
    throw new HttpError(500, 'DATABASE_URL não configurada no servidor.');
  }
}

/** Executa uma consulta parametrizada no pool. */
export function query(text, params) {
  ensureConfigured();
  return pool.query(text, params);
}

/** Executa `callback(client)` dentro de uma transação (COMMIT ou ROLLBACK automáticos). */
export async function withTransaction(callback) {
  ensureConfigured();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
