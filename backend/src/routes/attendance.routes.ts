import { Router } from 'express';
import {
  checkInGuest,
  getEventAttendance,
} from '../controllers/attendance.controller';
import { protect, organizerOrAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Module 7: Check-in a guest using their QR token (Organizer or Admin)
router.post('/check-in', protect, organizerOrAdmin, checkInGuest);

// Module 7: Get all attendance records for an event (Organizer or Admin)
router.get('/event/:eventId', protect, organizerOrAdmin, getEventAttendance);
router.get('/:eventId', protect, organizerOrAdmin, getEventAttendance);

export default router;
