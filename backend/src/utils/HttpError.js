/** Erro com status HTTP, convertido em resposta JSON pelo errorHandler. */
export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.details = details;
  }
}

export const notFound = (message) => new HttpError(404, message);
