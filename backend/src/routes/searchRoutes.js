import { Router } from 'express';
import { searchVotersHandler } from '../controllers/searchController.js';
import { searchLimiter } from '../middlewares/rateLimiter.js';
import { cacheControl } from '../middlewares/cacheControl.js';

const router = Router();

router.get(
  '/',
  searchLimiter,
  cacheControl(60, true),
  searchVotersHandler,
);

export default router;
