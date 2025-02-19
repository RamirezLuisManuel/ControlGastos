import { Router } from 'express';
import { simulateUserMessage } from '../controllers/telegramController';

const router = Router();

router.post('/simulate', simulateUserMessage);

export default router;
