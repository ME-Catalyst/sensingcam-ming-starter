import { Router } from 'express';
import authRoutes from './auth.routes';
import eventsRoutes from './events.routes';
import frigateRoutes from './frigate.routes';
import cameraRoutes from './camera.routes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SensingCam API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/events', eventsRoutes);
router.use('/frigate', frigateRoutes);
router.use('/camera', cameraRoutes);

export default router;
