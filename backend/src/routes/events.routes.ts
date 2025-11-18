import { Router } from 'express';
import * as eventsController from '../controllers/events.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', eventsController.getEvents);
router.get('/statistics', eventsController.getStatistics);
router.get('/:id', eventsController.getEventById);

export default router;
