import { logger } from '../utils/logger.js';

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
  });
}

export function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || err.status || 500;
  const isServerError = statusCode >= 500;

  if (isServerError) {
    logger.error('Unhandled error', {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      path: req.originalUrl,
    });
  }

  res.status(statusCode).json({
    success: false,
    error: isServerError ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV === 'development' && !isServerError && { details: err.message }),
  });
}
