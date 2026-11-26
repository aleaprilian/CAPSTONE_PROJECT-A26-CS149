export class AppError extends Error {
  /**
   * Error terstruktur untuk respons HTTP API yang konsisten.
   */
  constructor(statusCode, message, code = 'BAD_REQUEST', details = undefined) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}
