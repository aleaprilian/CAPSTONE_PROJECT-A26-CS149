import { AppError } from '../utils/errors.js';

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function notFoundHandler(req, res, next) {
  next(new AppError(404, `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan.`, 'NOT_FOUND'));
}

export function errorHandler(err, req, res, _next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_JSON',
        message: 'Format JSON pada request body tidak valid.',
      },
    });
  }

  const statusCode = err.statusCode || 500;
  const code = err.code || (statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR');
  const message =
    statusCode >= 500 && process.env.NODE_ENV === 'production'
      ? 'Terjadi kesalahan pada server.'
      : err.message || 'Terjadi kesalahan.';

  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(err.details ? { details: err.details } : {}),
    },
  });
}
