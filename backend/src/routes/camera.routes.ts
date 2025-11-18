import { Router } from 'express';
import * as cameraController from '../controllers/camera.controller';
import { authenticateToken, authorize } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/status', cameraController.getCameraStatus);
router.get('/stream', cameraController.getStreamUrl);
router.get('/device', cameraController.getDeviceInfo);

// Only admin and operator can control camera
router.post('/record/start', authorize('admin', 'operator'), cameraController.startRecording);
router.post('/record/stop', authorize('admin', 'operator'), cameraController.stopRecording);

export default router;
