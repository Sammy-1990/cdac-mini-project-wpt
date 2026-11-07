import { Router } from 'express';
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllEventsAdmin,
  reassignOrganizer,
} from '../controllers/admin.controller';
import { protect, adminOnly } from '../middlewares/auth.middleware';

const router = Router();

// Protect all admin routes with JWT and admin role check
router.use(protect, adminOnly);

// User management endpoints
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Event management endpoints
router.get('/events', getAllEventsAdmin);
router.put('/events/:id/organizer', reassignOrganizer);

export default router;
