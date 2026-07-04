import rateLimit from 'express-rate-limit';

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;

export const generalLimiter = rateLimit({
  windowMs,
  max: Number(process.env.RATE_LIMIT_MAX) || 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later' },
});

export const searchLimiter = rateLimit({
  windowMs,
  max: Number(process.env.SEARCH_RATE_LIMIT_MAX) || 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Search rate limit exceeded' },
});

export const printLimiter = rateLimit({
  windowMs,
  max: Number(process.env.PRINT_RATE_LIMIT_MAX) || 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Print rate limit exceeded' },
});
