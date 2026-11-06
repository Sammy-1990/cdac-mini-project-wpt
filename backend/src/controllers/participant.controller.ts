import { Request, Response } from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import QRCode from 'qrcode';
import Event from '../models/Event';
import EventParticipant from '../models/EventParticipant';
import User from '../models/User';

// 1. Public Event Registration (Authenticated Guest)
export const registerForEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventId = req.params.eventId as string;
    const { name, email } = req.body;

    // Validate event ID format
    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid event ID format.',
      });
      return;
    }

    // Validate required fields
    if (!name || !email) {
      res.status(400).json({
        success: false,
        message: 'Please provide both name and email.',
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
      return;
    }

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
      return;
    }

    // Check that event is public
    if (event.eventType !== 'public') {
      res.status(400).json({
        success: false,
        message: 'Registration is not allowed for private events. An invitation is required.',
      });
      return;
    }

    // Check that event is published
    if (event.status !== 'published') {
      res.status(400).json({
        success: false,
        message: 'Registration is only open for published events.',
      });
      return;
    }

    // Check event capacity
    const registeredCount = await EventParticipant.countDocuments({
      eventId: event._id,
      status: 'registered',
    });

    if (registeredCount >= event.capacity) {
      res.status(400).json({
        success: false,
        message: 'Event is already at full capacity. Registration closed.',
      });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Prevent duplicate registration for the same email and event
    const existingParticipant = await EventParticipant.findOne({
      eventId: event._id,
      email: normalizedEmail,
    });

    if (existingParticipant) {
      res.status(409).json({
        success: false,
        message: 'This email is already registered for this event.',
      });
      return;
    }

    // Generate unpredictable unique QR token using crypto
    const qrToken = crypto.randomBytes(16).toString('hex');

    // Generate QR Code image as Data URL for the frontend ticket
    const qrCodeImage = await QRCode.toDataURL(qrToken);

    // Create participant record
    const participant = await EventParticipant.create({
      eventId: event._id,
      userId: req.user?.id || null,
      name: name.trim(),
      email: normalizedEmail,
      participationType: 'registration',
      status: 'registered',
      qrToken: qrToken,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      participant: {
        _id: participant._id,
        eventId: participant.eventId,
        userId: participant.userId,
        name: participant.name,
        email: participant.email,
        participationType: participant.participationType,
        status: participant.status,
        qrToken: participant.qrToken,
        createdAt: participant.createdAt,
      },
      qrCode: qrCodeImage,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during event registration.',
    });
  }
};

// 2. Invite Guest to Private Event (Event Organizer or Admin)
export const inviteGuest = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventId = req.params.eventId as string;
    const { name, email } = req.body;

    // Validate event ID format
    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid event ID format.',
      });
      return;
    }

    // Validate required fields
    if (!name || !email) {
      res.status(400).json({
        success: false,
        message: 'Please provide both guest name and email.',
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
      return;
    }

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
      return;
    }

    // Ensure it is a private event
    if (event.eventType !== 'private') {
      res.status(400).json({
        success: false,
        message: 'Invitations are only for private events. Guests can register directly for public events.',
      });
      return;
    }

    // Check event ownership (must be event owner or admin)
    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;

    if (currentUserRole !== 'admin' && event.organizerId.toString() !== currentUserId) {
      res.status(403).json({
        success: false,
        message: 'Access denied. You can only invite guests to your own events.',
      });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Prevent duplicate invitations for the same event and email
    const existingParticipant = await EventParticipant.findOne({
      eventId: event._id,
      email: normalizedEmail,
    });

    if (existingParticipant) {
      res.status(409).json({
        success: false,
        message: 'This guest is already invited or registered for this event.',
      });
      return;
    }

    // Check if the invited guest already has an EventFlow account
    const existingUser = await User.findOne({ email: normalizedEmail });
    const guestUserId = existingUser ? existingUser._id : null;

    // Create EventParticipant record
    const participant = await EventParticipant.create({
      eventId: event._id,
      userId: guestUserId,
      name: name.trim(),
      email: normalizedEmail,
      participationType: 'invitation',
      status: 'invited',
    });

    // Generate manual shareable invitation link for the frontend
    const invitationLink = `http://localhost:5173/invitation/${participant._id}`;

    res.status(201).json({
      success: true,
      message: 'Guest invited successfully',
      participant: {
        _id: participant._id,
        eventId: participant.eventId,
        userId: participant.userId,
        name: participant.name,
        email: participant.email,
        participationType: participant.participationType,
        status: participant.status,
        createdAt: participant.createdAt,
      },
      invitationLink,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while inviting guest.',
    });
  }
};

// 3. Get Invitation Details (Public link view)
export const getInvitationDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const participantId = req.params.participantId as string;

    // Validate participant ID format
    if (!participantId || !mongoose.Types.ObjectId.isValid(participantId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid invitation ID format.',
      });
      return;
    }

    // Find the participant and populate event information
    const participant = await EventParticipant.findById(participantId).populate(
      'eventId',
      'title category description startDate endDate venue address city status'
    );

    if (!participant || participant.participationType !== 'invitation') {
      res.status(404).json({
        success: false,
        message: 'Invitation not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      invitation: participant,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while fetching invitation details.',
    });
  }
};

// 4. Accept Invitation (Guest accepts invite and receives QR ticket)
export const acceptInvitation = async (req: Request, res: Response): Promise<void> => {
  try {
    const participantId = req.params.participantId as string;

    if (!participantId || !mongoose.Types.ObjectId.isValid(participantId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid invitation ID format.',
      });
      return;
    }

    const participant = await EventParticipant.findById(participantId);

    if (!participant || participant.participationType !== 'invitation') {
      res.status(404).json({
        success: false,
        message: 'Invitation not found.',
      });
      return;
    }

    // Ensure invitation is not already declined or cancelled
    if (participant.status === 'declined') {
      res.status(400).json({
        success: false,
        message: 'Cannot accept an invitation that has already been declined.',
      });
      return;
    }

    if (participant.status === 'cancelled') {
      res.status(400).json({
        success: false,
        message: 'This invitation has been cancelled by the organizer.',
      });
      return;
    }

    // If already accepted, return existing ticket and QR code
    if (participant.status === 'accepted' && participant.qrToken) {
      const qrCodeImage = await QRCode.toDataURL(participant.qrToken);
      res.status(200).json({
        success: true,
        message: 'Invitation was already accepted.',
        participant,
        qrCode: qrCodeImage,
      });
      return;
    }

    // Update status to accepted
    participant.status = 'accepted';

    // Link logged-in user if available and not yet set
    if (!participant.userId && req.user?.id) {
      participant.userId = new mongoose.Types.ObjectId(req.user.id);
    }

    // Generate unique QR token
    const qrToken = crypto.randomBytes(16).toString('hex');
    participant.qrToken = qrToken;

    await participant.save();

    // Generate QR code data URL
    const qrCodeImage = await QRCode.toDataURL(qrToken);

    res.status(200).json({
      success: true,
      message: 'Invitation accepted successfully',
      participant,
      qrCode: qrCodeImage,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while accepting invitation.',
    });
  }
};

// 5. Decline Invitation
export const declineInvitation = async (req: Request, res: Response): Promise<void> => {
  try {
    const participantId = req.params.participantId as string;

    if (!participantId || !mongoose.Types.ObjectId.isValid(participantId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid invitation ID format.',
      });
      return;
    }

    const participant = await EventParticipant.findById(participantId);

    if (!participant || participant.participationType !== 'invitation') {
      res.status(404).json({
        success: false,
        message: 'Invitation not found.',
      });
      return;
    }

    if (participant.status === 'cancelled') {
      res.status(400).json({
        success: false,
        message: 'This invitation has already been cancelled.',
      });
      return;
    }

    if (participant.status === 'declined') {
      res.status(400).json({
        success: false,
        message: 'Invitation is already declined.',
      });
      return;
    }

    // Update status to declined
    participant.status = 'declined';
    await participant.save();

    res.status(200).json({
      success: true,
      message: 'Invitation declined successfully',
      participant,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while declining invitation.',
    });
  }
};

// 6. Get My Registrations (Authenticated User)
export const getMyRegistrations = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user?.id;
    if (!currentUserId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized access.',
      });
      return;
    }

    // Find user to obtain their email
    const user = await User.findById(currentUserId);
    const userEmail = user ? user.email.toLowerCase().trim() : '';

    // Match registrations by userId or registered email
    const query: any = {
      participationType: 'registration',
      $or: [{ userId: currentUserId }],
    };
    if (userEmail) {
      query.$or.push({ email: userEmail });
    }

    const registrations = await EventParticipant.find(query)
      .populate('eventId', 'title category description startDate endDate venue address city status coverImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while fetching registrations.',
    });
  }
};

// 7. Get My Invitations (Authenticated User)
export const getMyInvitations = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user?.id;
    if (!currentUserId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized access.',
      });
      return;
    }

    // Find user to obtain their email
    const user = await User.findById(currentUserId);
    const userEmail = user ? user.email.toLowerCase().trim() : '';

    // Match invitations by userId or invited email
    const query: any = {
      participationType: 'invitation',
      $or: [{ userId: currentUserId }],
    };
    if (userEmail) {
      query.$or.push({ email: userEmail });
    }

    const invitations = await EventParticipant.find(query)
      .populate('eventId', 'title category description startDate endDate venue address city status coverImage organizerId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: invitations.length,
      invitations,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while fetching invitations.',
    });
  }
};

// 8. Get Event Participants (Event Organizer or Admin)
export const getEventParticipants = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventId = req.params.eventId as string;

    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid event ID format.',
      });
      return;
    }

    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
      return;
    }

    // Check ownership: logged-in user must be owner or admin
    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;

    if (currentUserRole !== 'admin' && event.organizerId.toString() !== currentUserId) {
      res.status(403).json({
        success: false,
        message: 'Access denied. You can only view participants for your own events.',
      });
      return;
    }

    const participants = await EventParticipant.find({ eventId: event._id })
      .populate('userId', 'fullName email profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: participants.length,
      participants,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while fetching event participants.',
    });
  }
};
