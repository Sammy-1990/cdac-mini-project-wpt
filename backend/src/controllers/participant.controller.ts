import { Request, Response } from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import QRCode from 'qrcode';
import Event from '../models/Event';
import EventParticipant from '../models/EventParticipant';

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
