import { HttpError } from '../utils/HttpError.js';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const URL_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);

function isValidDate(value) {
  if (!DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function isValidUrl(value) {
  try {
    return URL_PROTOCOLS.has(new URL(value).protocol);
  } catch {
    return false;
  }
}

/** Valida um valor já presente no corpo. Devolve `{ value }` ou `{ error }`. */
function checkField(rule, raw) {
  if (raw === null) {
    return rule.nullable ? { value: null } : { error: 'não pode ser nulo' };
  }

  switch (rule.type) {
    case 'string':
    case 'slug':
    case 'url':
    case 'enum': {
      if (typeof raw !== 'string') return { error: 'deve ser um texto' };
      const value = raw.trim();
      if (!value) return { error: 'não pode ser vazio' };
      if (rule.max && value.length > rule.max) return { error: `deve ter no máximo ${rule.max} caracteres` };
      if (rule.type === 'slug' && !SLUG_PATTERN.test(value)) {
        return { error: 'deve conter apenas letras minúsculas, números e hífens (ex.: maria-silva)' };
      }
      if (rule.type === 'url' && !isValidUrl(value)) {
        return { error: 'deve ser uma URL válida (http://, https:// ou mailto:)' };
      }
      if (rule.type === 'enum' && !rule.values.includes(value)) {
        return { error: `deve ser um dos valores: ${rule.values.join(', ')}` };
      }
      return { value };
    }
    case 'integer': {
      if (!Number.isInteger(raw)) return { error: 'deve ser um número inteiro' };
      if (rule.min !== undefined && raw < rule.min) return { error: `deve ser maior ou igual a ${rule.min}` };
      if (rule.max !== undefined && raw > rule.max) return { error: `deve ser menor ou igual a ${rule.max}` };
      return { value: raw };
    }
    case 'date': {
      if (typeof raw !== 'string' || !isValidDate(raw)) return { error: 'deve ser uma data válida no formato YYYY-MM-DD' };
      return { value: raw };
    }
    case 'stringArray': {
      if (!Array.isArray(raw)) return { error: 'deve ser uma lista de textos' };
      const seen = new Set();
      const value = [];
      for (const item of raw) {
        if (typeof item !== 'string' || !item.trim()) return { error: 'deve conter apenas textos não vazios' };
        const name = item.trim();
        if (rule.itemMax && name.length > rule.itemMax) {
          return { error: `cada item deve ter no máximo ${rule.itemMax} caracteres` };
        }
        // Ignora repetidos sem diferenciar maiúsculas/minúsculas.
        if (!seen.has(name.toLowerCase())) {
          seen.add(name.toLowerCase());
          value.push(name);
        }
      }
      if (rule.maxItems && value.length > rule.maxItems) return { error: `deve ter no máximo ${rule.maxItems} itens` };
      return { value };
    }
    default:
      throw new Error(`Tipo de regra desconhecido: ${rule.type}`);
  }
}

/**
 * Valida `body` contra `schema` e devolve apenas os campos conhecidos, já normalizados.
 *
 * - `partial: false` (POST/PUT): campos obrigatórios precisam estar presentes; opcionais ausentes
 *   recebem o `default` da regra (ou `null`).
 * - `partial: true` (PATCH): só os campos enviados são validados e devolvidos.
 */
export function validate(schema, body, { partial = false } = {}) {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw new HttpError(400, 'O corpo da requisição deve ser um objeto JSON.');
  }

  const data = {};
  const errors = [];

  for (const [field, rule] of Object.entries(schema)) {
    if (body[field] === undefined) {
      if (partial) continue;
      if (rule.required) errors.push({ field, message: 'é obrigatório' });
      else data[field] = rule.default ?? null;
      continue;
    }

    const result = checkField(rule, body[field]);
    if (result.error) errors.push({ field, message: result.error });
    else data[field] = result.value;
  }

  if (partial && errors.length === 0 && Object.keys(data).length === 0) {
    throw new HttpError(400, `Envie ao menos um dos campos: ${Object.keys(schema).join(', ')}.`);
  }

  if (errors.length > 0) throw new HttpError(400, 'Dados inválidos.', errors);
  return data;
}

/** Lança 400 com os erros de regras que envolvem mais de um campo (ex.: datas de início e fim). */
export function assertRules(errors) {
  const failed = errors.filter(Boolean);
  if (failed.length > 0) throw new HttpError(400, 'Dados inválidos.', failed);
}

/** Opções de validação de acordo com o método: PATCH aceita atualização parcial. */
export const modeFor = (req) => ({ partial: req.method === 'PATCH' });
