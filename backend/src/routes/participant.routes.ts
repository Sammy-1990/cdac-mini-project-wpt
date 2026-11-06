import { Router } from 'express';
import {
  registerForEvent,
  inviteGuest,
  getInvitationDetails,
  acceptInvitation,
  declineInvitation,
  getMyRegistrations,
  getMyInvitations,
  getEventParticipants,
} from '../controllers/participant.controller';
import {
  protect,
  organizerOrAdmin,
  optionalProtect,
} from '../middlewares/auth.middleware';

const router = Router();

// Module 5: My Registrations and Invitations (Guest / Authenticated User)
// NOTE: Registered first so '/my-registrations' and '/my-invitations' are not treated as parameter IDs
router.get('/my-registrations', protect, getMyRegistrations);
router.get('/my-invitations', protect, getMyInvitations);

// Module 5: Event Participants (Organizer or Admin view for a specific event)
router.get('/event/:eventId', protect, organizerOrAdmin, getEventParticipants);

// Module 3: Public event registration (authenticated user)
router.post('/register/:eventId', protect, registerForEvent);

// Module 4: Private event invitations
// 1. Organizer or Admin invites a guest
router.post('/invite/:eventId', protect, organizerOrAdmin, inviteGuest);

// 2. View invitation details (public link viewable by the invitee)
router.get('/invitation/:participantId', optionalProtect, getInvitationDetails);

// 3. Accept invitation
router.put('/invitation/:participantId/accept', optionalProtect, acceptInvitation);

// 4. Decline invitation
router.put('/invitation/:participantId/decline', optionalProtect, declineInvitation);

export default router;
