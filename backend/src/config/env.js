import dotenv from 'dotenv';

// Em produção (Vercel) as variáveis vêm do painel; localmente, do arquivo .env.
dotenv.config({ quiet: true });

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL,
  /** Quando definida, exigida no header `x-api-key` das rotas de escrita. */
  apiKey: process.env.API_KEY || null,
  /** Origens liberadas no CORS, separadas por vírgula. `*` libera todas. */
  corsOrigin: process.env.CORS_ORIGIN || '*',
};

export const isProduction = env.nodeEnv === 'production';
