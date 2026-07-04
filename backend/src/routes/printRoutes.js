import { Router } from 'express';
import { printVoterSlipHandler } from '../controllers/printController.js';
import { printLimiter } from '../middlewares/rateLimiter.js';
import { noCache } from '../middlewares/cacheControl.js';

const router = Router();

router.post('/', printLimiter, noCache, printVoterSlipHandler);

export default router;
