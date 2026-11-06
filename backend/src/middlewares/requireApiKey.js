import { timingSafeEqual } from 'node:crypto';

import { env } from '../config/env.js';
import { HttpError } from '../utils/HttpError.js';

const READ_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function safeEqual(a, b) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/**
 * Protege as rotas de escrita (POST, PUT, PATCH, DELETE) quando `API_KEY` está definida.
 * Leituras continuam públicas para o app consumir sem credenciais.
 */
export function requireApiKey(req, _res, next) {
  if (!env.apiKey || READ_METHODS.has(req.method)) return next();

  const provided = req.get('x-api-key');
  if (!provided || !safeEqual(provided, env.apiKey)) {
    return next(new HttpError(401, 'Envie uma chave válida no header "x-api-key" para alterar dados.'));
  }
  return next();
}
