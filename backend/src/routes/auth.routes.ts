import { Router } from 'express';
import { register, login, getProfile } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route (requires valid JWT token)
router.get('/profile', protect, getProfile);

export default router;
