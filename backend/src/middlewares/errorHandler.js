import { isProduction } from '../config/env.js';
import { HttpError } from '../utils/HttpError.js';

// Códigos de erro do PostgreSQL mais comuns em violações de regras do banco.
const PG_ERRORS = {
  23505: [409, 'Registro duplicado: já existe um item com esses dados.'],
  23503: [409, 'Operação viola um relacionamento: o registro está em uso ou a referência não existe.'],
  23001: [409, 'Registro em uso por outros registros e não pode ser excluído.'],
  23514: [400, 'Dados violam uma regra do banco de dados.'],
  23502: [400, 'Campo obrigatório ausente.'],
  '22P02': [400, 'Valor em formato inválido.'],
  22001: [400, 'Texto maior que o tamanho permitido.'],
};

function toHttpError(error) {
  if (error instanceof HttpError) return error;

  // JSON malformado no corpo da requisição (express.json).
  if (error.type === 'entity.parse.failed') {
    return new HttpError(400, 'Corpo da requisição não é um JSON válido.');
  }
  if (error.type === 'entity.too.large') {
    return new HttpError(413, 'Corpo da requisição excede o tamanho permitido.');
  }

  const pgError = PG_ERRORS[error.code];
  if (pgError) {
    const [status, message] = pgError;
    return new HttpError(status, message, error.constraint ? { constraint: error.constraint } : undefined);
  }

  return null;
}

// eslint-disable-next-line no-unused-vars -- o Express identifica o handler de erro pelos 4 parâmetros.
export function errorHandler(error, req, res, _next) {
  const httpError = toHttpError(error);

  if (!httpError) {
    console.error(`[${req.method} ${req.originalUrl}]`, error);
    return res.status(500).json({
      error: {
        status: 500,
        message: isProduction ? 'Erro interno do servidor.' : error.message,
      },
    });
  }

  if (httpError.status >= 500) console.error(`[${req.method} ${req.originalUrl}]`, error);

  return res.status(httpError.status).json({
    error: {
      status: httpError.status,
      message: httpError.message,
      ...(httpError.details && { details: httpError.details }),
    },
  });
}
