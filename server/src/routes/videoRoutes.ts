import { Router } from 'express';
import { videoController } from '../controllers/videoController';

const router = Router();

router.post('/videos/search', videoController.searchVideo);

export default router;
