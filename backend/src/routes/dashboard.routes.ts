import { Router } from 'express';
import {
  getOrganizerDashboard,
  getAdminDashboard,
} from '../controllers/dashboard.controller';
import {
  protect,
  organizerOrAdmin,
  adminOnly,
} from '../middlewares/auth.middleware';

const router = Router();

// Module 8: Organizer Dashboard (Organizers and Admins)
router.get('/organizer', protect, organizerOrAdmin, getOrganizerDashboard);

// Module 9: Admin Dashboard (Admins only)
router.get('/admin', protect, adminOnly, getAdminDashboard);

export default router;
