// Aplica, em ordem, as migrations de db/migrations ainda não registradas em schema_migrations.
import { fileURLToPath } from 'node:url';

import { listSqlFiles, readSql, runTask } from './runner.js';

const migrationsDir = fileURLToPath(new URL('./migrations/', import.meta.url));

await runTask('Migração', async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name        TEXT PRIMARY KEY,
      applied_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  const { rows } = await client.query('SELECT name FROM schema_migrations');
  const applied = new Set(rows.map((row) => row.name));
  const pending = (await listSqlFiles(migrationsDir)).filter((file) => !applied.has(file));

  if (pending.length === 0) {
    console.log('Nenhuma migration pendente.');
    return;
  }

  for (const file of pending) {
    const sql = await readSql(migrationsDir, file);
    // Cada migration roda em sua própria transação: ou aplica tudo, ou nada.
    await client.query('BEGIN');
    try {
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
      await client.query('COMMIT');
      console.log(`  aplicada: ${file}`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`${file}: ${error.message}`);
    }
  }
});
