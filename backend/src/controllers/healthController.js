import { voterStore } from '../database/voterStore.js';
import { pdfService } from '../pdf/pdfService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const healthCheckHandler = asyncHandler(async (_req, res) => {
  res.json({
    success: true,
    status: 'ok',
    uptime: process.uptime(),
    voters: voterStore.count,
    pdfPages: pdfService.pageCount,
    timestamp: new Date().toISOString(),
  });
});

export const readinessHandler = asyncHandler(async (_req, res) => {
  const ready = voterStore.isLoaded() && pdfService.isLoaded();
  res.status(ready ? 200 : 503).json({
    success: ready,
    ready,
    voters: voterStore.count,
    pdfPages: pdfService.pageCount,
  });
});
