import cors from 'cors';
import express from 'express';

import { env } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { requireApiKey } from './middlewares/requireApiKey.js';
import routes from './routes/index.js';

const app = express();

app.disable('x-powered-by');
app.use(cors({ origin: env.corsOrigin === '*' ? '*' : env.corsOrigin.split(',').map((o) => o.trim()) }));
app.use(express.json({ limit: '100kb' }));

app.get('/', (_req, res) => {
  res.json({
    data: {
      name: 'API de Currículos',
      version: '1.0.0',
      health: '/api/health',
      people: '/api/people',
      resume: '/api/people/:idOuSlug/resume',
    },
  });
});

app.use('/api', requireApiKey, routes);

app.use(notFoundHandler);
app.use(errorHandler);

// A Vercel detecta src/app.js e usa o app exportado como função serverless.
export default app;
