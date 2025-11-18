import { Router } from 'express';
import * as frigateController from '../controllers/frigate.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/status', frigateController.getFrigateStatus);
router.get('/cameras', frigateController.getCameras);
router.get('/clips', frigateController.getClips);
router.get('/clips/:id', frigateController.getClipById);
router.get('/clips/:id/url', frigateController.getClipUrl);
router.get('/clips/:id/download', frigateController.downloadClip);

export default router;
