import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Attendance from '../models/Attendance';
import EventParticipant from '../models/EventParticipant';
import Event from '../models/Event';

// 1. Check-In Guest Using QR Token (Organizer or Admin)
export const checkInGuest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { qrToken, eventId } = req.body;

    // Validate request body
    if (!qrToken || !eventId) {
      res.status(400).json({
        success: false,
        message: 'Please provide both qrToken and eventId.',
      });
      return;
    }

    // Validate event ID format
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid event ID format.',
      });
      return;
    }

    // 1. Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
      return;
    }

    // 2. Check organizer permissions: must be the event owner or admin
    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;

    if (currentUserRole !== 'admin' && event.organizerId.toString() !== currentUserId) {
      res.status(403).json({
        success: false,
        message: 'Access denied. You can only check in attendees for your own events.',
      });
      return;
    }

    // 3. Find participant by unique QR token
    const participant = await EventParticipant.findOne({ qrToken: qrToken.trim() });
    if (!participant) {
      res.status(404).json({
        success: false,
        message: 'Invalid QR token. Participant not found.',
      });
      return;
    }

    // 4. Verify the participant belongs to this specific event
    if (participant.eventId.toString() !== event._id.toString()) {
      res.status(400).json({
        success: false,
        message: 'This ticket does not belong to this event.',
      });
      return;
    }

    // 5. Verify the participant has an eligible status (registered for public, accepted for private)
    const validStatuses = ['registered', 'accepted'];
    if (!validStatuses.includes(participant.status)) {
      res.status(400).json({
        success: false,
        message: `Cannot check in. Participant status is "${participant.status}". Only registered or accepted guests can check in.`,
      });
      return;
    }

    // 6. Check if participant has already checked in to prevent duplicate check-in
    const existingAttendance = await Attendance.findOne({ participantId: participant._id });
    if (existingAttendance) {
      res.status(409).json({
        success: false,
        message: 'Duplicate check-in detected. This guest has already checked in.',
        checkedInAt: existingAttendance.checkedInAt,
      });
      return;
    }

    // 7. Create attendance record with participant name, event title, and IST timestamp
    const now = new Date();
    const checkedInAtIST =
      now.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'medium',
      }) + ' IST';

    const attendance = await Attendance.create({
      participantId: participant._id,
      participantName: participant.name,
      name: participant.name,
      eventId: event._id,
      eventTitle: event.title,
      checkedInBy: currentUserId,
      checkedInAt: now,
      checkedInAtIST,
    });

    res.status(201).json({
      success: true,
      message: 'Guest checked in successfully',
      attendance: {
        _id: attendance._id,
        participantId: attendance.participantId,
        participantName: attendance.participantName,
        name: attendance.name,
        eventId: attendance.eventId,
        eventTitle: attendance.eventTitle,
        checkedInAt: attendance.checkedInAt,
        checkedInAtIST: attendance.checkedInAtIST,
        checkedInBy: attendance.checkedInBy,
      },
      participant: {
        _id: participant._id,
        name: participant.name,
        email: participant.email,
        participationType: participant.participationType,
        status: participant.status,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during guest check-in.',
    });
  }
};

// 2. Get Event Attendance Records (Organizer or Admin)
export const getEventAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventId = req.params.eventId as string;

    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid event ID format.',
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

    // Check ownership: must be the event owner or admin
    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;

    if (currentUserRole !== 'admin' && event.organizerId.toString() !== currentUserId) {
      res.status(403).json({
        success: false,
        message: 'Access denied. You can only view attendance for your own events.',
      });
      return;
    }

    // Fetch all attendance records for this event
    const attendanceRecords = await Attendance.find({ eventId: event._id })
      .populate('participantId', 'name email participationType status')
      .populate('checkedInBy', 'fullName email')
      .sort({ checkedInAt: -1 });

    const formattedAttendance = attendanceRecords.map((a: any) => ({
      _id: a._id,
      participantId: a.participantId?._id || a.participantId,
      participantName: a.participantName || a.name || a.participantId?.name || 'Unknown',
      name: a.name || a.participantName || a.participantId?.name || 'Unknown',
      participantEmail: a.participantId?.email || '',
      participationType: a.participantId?.participationType || '',
      status: a.participantId?.status || '',
      eventId: a.eventId?._id || a.eventId,
      eventTitle: a.eventTitle || event.title,
      checkedInBy: a.checkedInBy?._id || a.checkedInBy,
      checkedInByName: a.checkedInBy?.fullName || '',
      checkedInAt: a.checkedInAt,
      checkedInAtIST:
        a.checkedInAtIST ||
        new Date(a.checkedInAt).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'medium',
          timeStyle: 'medium',
        }) + ' IST',
      createdAt: a.createdAt,
    }));

    res.status(200).json({
      success: true,
      count: formattedAttendance.length,
      attendance: formattedAttendance,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while fetching attendance records.',
    });
  }
};
