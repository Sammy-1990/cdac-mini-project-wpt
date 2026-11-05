import { Router } from 'express';
import {
  createEvent,
  getAllEvents,
  getMyEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from '../controllers/event.controller';
import {
  protect,
  organizerOrAdmin,
  optionalProtect,
} from '../middlewares/auth.middleware';

const router = Router();

// Public route: Discover & filter public events
router.get('/', getAllEvents);

// Organizer/Admin route: Get all events created by logged-in user
// NOTE: Must be defined before '/:id' so 'my-events' is not interpreted as an ID
router.get('/my-events', protect, organizerOrAdmin, getMyEvents);

// Single event details (optionalAuth to allow checking invited status for private events)
router.get('/:id', optionalProtect, getEventById);

// Create event (Organizers and Admins only)
router.post('/', protect, organizerOrAdmin, createEvent);

// Update event (Event Owner or Admin only)
router.put('/:id', protect, organizerOrAdmin, updateEvent);

// Delete event (Event Owner or Admin only)
router.delete('/:id', protect, organizerOrAdmin, deleteEvent);

export default router;
