import { HttpError } from './HttpError.js';

/** Converte um parâmetro de rota em ID inteiro positivo ou responde 400. */
export function parseId(value, name = 'id') {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new HttpError(400, `Parâmetro "${name}" deve ser um número inteiro positivo.`);
  }
  return id;
}
