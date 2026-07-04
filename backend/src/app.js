import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import apiRoutes from './routes/index.js';
import { generalLimiter } from './middlewares/rateLimiter.js';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler.js';

export function createApp() {
  const app = express();

  const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.set('trust proxy', 1);

  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));
  app.use(compression({ threshold: 1024 }));
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'If-None-Match'],
    exposedHeaders: ['ETag', 'Content-Disposition', 'X-PDF-Page-Count', 'X-Source-Page-No', 'X-EPIC-No'],
    credentials: true,
  }));

  app.use(express.json({ limit: '16kb' }));
  app.use(express.urlencoded({ extended: false, limit: '16kb' }));

  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  }

  app.use(generalLimiter);
  app.use('/api', apiRoutes);

  app.get('/', (_req, res) => {
    res.json({
      name: 'Smart Voter Slip Printing System API',
      version: '1.0.0',
      endpoints: {
        search: 'GET /api/search?q=',
        print: 'POST /api/print',
        health: 'GET /api/health',
      },
    });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
