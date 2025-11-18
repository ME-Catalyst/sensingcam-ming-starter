import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/login', authRateLimiter, authController.login);
router.post('/register', authController.register);
router.post('/refresh', authController.refreshToken);
router.get('/me', authenticateToken, authController.getCurrentUser);

export default router;
