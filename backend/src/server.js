// Servidor para desenvolvimento local. Na Vercel, o app de src/app.js é usado diretamente.
import app from './app.js';
import { env } from './config/env.js';

app.listen(env.port, () => {
  console.log(`API rodando em http://localhost:${env.port}`);
  if (!env.databaseUrl) console.warn('Atenção: DATABASE_URL não definida — configure o arquivo .env.');
});
