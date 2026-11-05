import { Router } from 'express';
import { registerForEvent } from '../controllers/participant.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Public event registration (authenticated user/guest)
router.post('/register/:eventId', protect, registerForEvent);

export default router;
