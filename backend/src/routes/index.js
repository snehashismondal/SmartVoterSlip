import { Router } from 'express';
import searchRoutes from './searchRoutes.js';
import printRoutes from './printRoutes.js';
import { healthCheckHandler, readinessHandler } from '../controllers/healthController.js';

const router = Router();

router.get('/health', healthCheckHandler);
router.get('/ready', readinessHandler);
router.use('/search', searchRoutes);
router.use('/print', printRoutes);

export default router;
