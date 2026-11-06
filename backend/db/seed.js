// Executa os seeds de db/seeds. Os seeds apagam os dados atuais e recriam os currículos de exemplo.
// Com --if-empty, só roda se ainda não houver nenhuma pessoa cadastrada (usado pelo setup.sh).
import { fileURLToPath } from 'node:url';

import { listSqlFiles, readSql, runTask } from './runner.js';

const seedsDir = fileURLToPath(new URL('./seeds/', import.meta.url));
const onlyIfEmpty = process.argv.includes('--if-empty');

await runTask('Seed', async (client) => {
  if (onlyIfEmpty) {
    const { rows } = await client.query('SELECT count(*)::int AS total FROM people');
    if (rows[0].total > 0) {
      console.log(`  banco já tem ${rows[0].total} pessoa(s) cadastrada(s); seed ignorado para não apagar dados.`);
      return;
    }
  }

  for (const file of await listSqlFiles(seedsDir)) {
    await client.query(await readSql(seedsDir, file));
    console.log(`  executado: ${file}`);
  }
});
