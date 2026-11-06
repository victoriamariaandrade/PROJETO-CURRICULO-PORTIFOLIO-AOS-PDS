import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { env } from '../src/config/env.js';
import { pool } from '../src/config/database.js';

/** Lista os arquivos .sql de uma pasta em ordem alfabética (001_, 002_...). */
export async function listSqlFiles(directory) {
  const files = await readdir(directory);
  return files.filter((file) => file.endsWith('.sql')).sort();
}

export const readSql = (directory, file) => readFile(path.join(directory, file), 'utf8');

/** Abre uma conexão, executa `task(client)` e encerra o pool, com saída amigável no terminal. */
export async function runTask(name, task) {
  if (!env.databaseUrl) {
    console.error('DATABASE_URL não definida. Copie .env.example para .env e preencha a connection string do Neon.');
    process.exit(1);
  }

  let client;
  try {
    client = await pool.connect();
    await task(client);
    console.log(`✔ ${name}: concluído.`);
  } catch (error) {
    console.error(`✖ ${name}: falhou — ${error.message || error.code}`);
    process.exitCode = 1;
  } finally {
    client?.release();
    await pool.end();
  }
}
