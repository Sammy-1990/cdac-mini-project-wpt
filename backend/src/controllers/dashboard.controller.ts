import { Request, Response } from 'express';
import User from '../models/User';
import Event from '../models/Event';
import EventParticipant from '../models/EventParticipant';
import Attendance from '../models/Attendance';

// 1. Organizer Dashboard (Returning item details with _id & name/title alongside counts)
export const getOrganizerDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const organizerId = req.user?.id;

    if (!organizerId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: User not identified.',
      });
      return;
    }

    // 1. Fetch all events created by this organizer with details
    const organizerEvents = await Event.find({ organizerId })
      .select('_id title category eventType status capacity startDate startDateIST city venue eventImage coverImage')
      .sort({ createdAt: -1 });
    const eventIds = organizerEvents.map((e) => e._id);

    const publishedEvents = organizerEvents.filter((e) => e.status === 'published');
    const draftEvents = organizerEvents.filter((e) => e.status === 'draft');
    const cancelledEvents = organizerEvents.filter((e) => e.status === 'cancelled');

    // 2. Fetch all participants across this organizer's events with _id and name
    const allParticipants = await EventParticipant.find({
      eventId: { $in: eventIds },
    }).select('_id name email status participationType eventId createdAt');

    // Filter registered guests and accepted invitations with _id and name
    const registeredGuests = allParticipants
      .filter((p) => p.status === 'registered')
      .map((p) => ({
        _id: p._id,
        name: p.name,
        email: p.email,
        eventId: p.eventId,
      }));

    const acceptedInvitations = allParticipants
      .filter((p) => p.status === 'accepted')
      .map((p) => ({
        _id: p._id,
        name: p.name,
        email: p.email,
        eventId: p.eventId,
      }));

    // 3. Fetch all checked-in attendance records populated with participant details
    const attendances = await Attendance.find({
      eventId: { $in: eventIds },
    })
      .populate('participantId', 'name email')
      .populate('eventId', 'title')
      .sort({ checkedInAt: -1 });

    const checkedInAttendees = attendances.map((a: any) => ({
      _id: a._id,
      participantId: a.participantId?._id || a.participantId,
      name: a.participantId?.name || 'Unknown',
      email: a.participantId?.email || '',
      eventId: a.eventId?._id || a.eventId,
      eventTitle: a.eventId?.title || '',
      checkedInAt: a.checkedInAt,
      checkedInAtIST:
        a.checkedInAtIST ||
        new Date(a.checkedInAt).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'medium',
          timeStyle: 'medium',
        }) + ' IST',
    }));

    res.status(200).json({
      success: true,
      dashboard: {
        totalEvents: organizerEvents.length,
        publishedEventsCount: publishedEvents.length,
        draftEventsCount: draftEvents.length,
        cancelledEventsCount: cancelledEvents.length,
        events: organizerEvents.map((e) => ({
          _id: e._id,
          title: e.title,
          category: e.category,
          eventType: e.eventType,
          status: e.status,
          startDate: e.startDate,
          startDateIST: e.startDateIST,
          city: e.city,
          venue: e.venue,
          eventImage: e.eventImage || e.coverImage || '',
        })),

        totalParticipants: allParticipants.length,
        participants: allParticipants.map((p) => ({
          _id: p._id,
          name: p.name,
          email: p.email,
          status: p.status,
          participationType: p.participationType,
          eventId: p.eventId,
        })),

        registeredGuestsCount: registeredGuests.length,
        registeredGuests,

        acceptedInvitationsCount: acceptedInvitations.length,
        acceptedInvitations,

        totalAttendeesCheckedIn: checkedInAttendees.length,
        checkedInAttendees,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while fetching organizer dashboard.',
    });
  }
};

// 2. Admin Dashboard (Returning item details with _id & name/title alongside counts)
export const getAdminDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Users with _id and fullName
    const allUsers = await User.find().select('_id fullName email role');
    const organizers = allUsers
      .filter((u) => u.role === 'organizer')
      .map((u) => ({ _id: u._id, fullName: u.fullName, email: u.email }));
    const guests = allUsers
      .filter((u) => u.role === 'guest')
      .map((u) => ({ _id: u._id, fullName: u.fullName, email: u.email }));

    // 2. Events with _id and title
    const allEvents = await Event.find().select('_id title category eventType status');
    const publicEvents = allEvents
      .filter((e) => e.eventType === 'public')
      .map((e) => ({ _id: e._id, title: e.title, category: e.category, status: e.status }));
    const privateEvents = allEvents
      .filter((e) => e.eventType === 'private')
      .map((e) => ({ _id: e._id, title: e.title, category: e.category, status: e.status }));

    // 3. Registrations with _id and name
    const registrations = await EventParticipant.find({
      participationType: 'registration',
    }).select('_id name email status eventId');

    // 4. Attendance records populated with participant name and event title
    const attendances = await Attendance.find()
      .populate('participantId', 'name email')
      .populate('eventId', 'title')
      .sort({ checkedInAt: -1 });

    const attendanceRecords = attendances.map((a: any) => ({
      _id: a._id,
      participantId: a.participantId?._id || a.participantId,
      name: a.participantId?.name || 'Unknown',
      email: a.participantId?.email || '',
      eventId: a.eventId?._id || a.eventId,
      eventTitle: a.eventId?.title || '',
      checkedInAt: a.checkedInAt,
    }));

    res.status(200).json({
      success: true,
      dashboard: {
        totalUsers: allUsers.length,
        organizers,
        guests,

        totalEvents: allEvents.length,
        publicEvents,
        privateEvents,

        totalRegistrations: registrations.length,
        registrations: registrations.map((r) => ({
          _id: r._id,
          name: r.name,
          email: r.email,
          status: r.status,
          eventId: r.eventId,
        })),

        totalAttendanceRecords: attendanceRecords.length,
        attendanceRecords,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while fetching admin dashboard.',
    });
  }
};
