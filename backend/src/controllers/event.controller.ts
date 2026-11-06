import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Event from '../models/Event';
import EventParticipant from '../models/EventParticipant';
import Attendance from '../models/Attendance';

// Valid categories as defined in Event model
const VALID_CATEGORIES = [
  'wedding',
  'birthday',
  'anniversary',
  'family-function',
  'concert',
  'award-show',
  'festival',
  'conference',
  'seminar',
  'comedy-show',
  'exhibition',
  'other',
];

// 1. Create Event (Organizer or Admin)
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      category,
      eventType,
      description,
      coverImage,
      startDate,
      endDate,
      venue,
      address,
      city,
      capacity,
      status,
    } = req.body;

    // Check all required fields
    if (
      !title ||
      !category ||
      !eventType ||
      !description ||
      !startDate ||
      !endDate ||
      !venue ||
      !address ||
      !city ||
      capacity === undefined
    ) {
      res.status(400).json({
        success: false,
        message: 'Please provide all required fields.',
      });
      return;
    }

    // Validate category
    if (!VALID_CATEGORIES.includes(category)) {
      res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
      });
      return;
    }

    // Validate event type
    if (eventType !== 'public' && eventType !== 'private') {
      res.status(400).json({
        success: false,
        message: 'Invalid eventType. Must be either "public" or "private".',
      });
      return;
    }

    // Validate capacity
    const parsedCapacity = Number(capacity);
    if (isNaN(parsedCapacity) || parsedCapacity < 1) {
      res.status(400).json({
        success: false,
        message: 'Capacity must be a positive number greater than 0.',
      });
      return;
    }

    // Validate start and end dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({
        success: false,
        message: 'Please provide valid start and end dates.',
      });
      return;
    }

    if (end <= start) {
      res.status(400).json({
        success: false,
        message: 'End date must be later than start date.',
      });
      return;
    }

    // Get organizerId from the authenticated user token (not from request body)
    const organizerId = req.user?.id;
    if (!organizerId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: User not identified.',
      });
      return;
    }

    // Format dates to Indian Standard Time (IST) string for display
    const startIST =
      start.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short',
      }) + ' IST';

    const endIST =
      end.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short',
      }) + ' IST';

    // Create the event in MongoDB
    const newEvent = await Event.create({
      organizerId,
      title: title.trim(),
      category,
      eventType,
      description,
      coverImage: coverImage || '',
      startDate: start,
      startDateIST: startIST,
      endDate: end,
      endDateIST: endIST,
      venue,
      address,
      city,
      capacity: parsedCapacity,
      status: status || 'published',
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event: newEvent,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while creating event.',
    });
  }
};

// 2. Get All Public Events (Public Access with Filters)
export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, city, search, startDate, endDate } = req.query;

    // Base filter: only public and published events
    const filterQuery: any = {
      eventType: 'public',
      status: 'published',
    };

    // Filter by category
    if (category && typeof category === 'string') {
      filterQuery.category = category;
    }

    // Filter by city (case-insensitive search)
    if (city && typeof city === 'string') {
      filterQuery.city = { $regex: new RegExp(city.trim(), 'i') };
    }

    // Search by title (case-insensitive keyword match)
    if (search && typeof search === 'string') {
      filterQuery.title = { $regex: new RegExp(search.trim(), 'i') };
    }

    // Filter by dates
    if (startDate && typeof startDate === 'string') {
      const parsedStart = new Date(startDate);
      if (!isNaN(parsedStart.getTime())) {
        filterQuery.startDate = { ...filterQuery.startDate, $gte: parsedStart };
      }
    }

    if (endDate && typeof endDate === 'string') {
      const parsedEnd = new Date(endDate);
      if (!isNaN(parsedEnd.getTime())) {
        filterQuery.endDate = { ...filterQuery.endDate, $lte: parsedEnd };
      }
    }

    // Fetch matching events and populate basic organizer details
    const events = await Event.find(filterQuery)
      .populate('organizerId', 'fullName email')
      .sort({ startDate: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while fetching events.',
    });
  }
};

// 3. Get Single Event by ID
export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    // Validate MongoDB ObjectId format
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid event ID format.',
      });
      return;
    }

    const event = await Event.findById(id).populate('organizerId', 'fullName email');

    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
      return;
    }

    // Public & published events are viewable by anyone
    if (event.eventType === 'public' && event.status === 'published') {
      res.status(200).json({
        success: true,
        event,
      });
      return;
    }

    // Private event access control
    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;

    if (!currentUserId) {
      res.status(403).json({
        success: false,
        message: 'Access denied. Please log in to view this private event.',
      });
      return;
    }

    // Admin or the event owner can view the event
    const organizerIdStr = (event.organizerId as any)._id
      ? (event.organizerId as any)._id.toString()
      : event.organizerId.toString();

    if (currentUserRole === 'admin' || organizerIdStr === currentUserId) {
      res.status(200).json({
        success: true,
        event,
      });
      return;
    }

    // Invited guests can also view the private event details
    const participant = await EventParticipant.findOne({
      eventId: event._id,
      userId: currentUserId,
      participationType: 'invitation',
    });

    if (participant) {
      res.status(200).json({
        success: true,
        event,
      });
      return;
    }

    // Unauthorized access
    res.status(403).json({
      success: false,
      message: 'Access denied. This is a private event.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while fetching event details.',
    });
  }
};

// 4. Update Event (Event owner or Admin)
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid event ID format.',
      });
      return;
    }

    const event = await Event.findById(id);
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
        message: 'Access denied. You can only update your own events.',
      });
      return;
    }

    const {
      title,
      category,
      eventType,
      description,
      coverImage,
      startDate,
      endDate,
      venue,
      address,
      city,
      capacity,
      status,
    } = req.body;

    // Validate category if updating
    if (category && !VALID_CATEGORIES.includes(category)) {
      res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
      });
      return;
    }

    // Validate eventType if updating
    if (eventType && eventType !== 'public' && eventType !== 'private') {
      res.status(400).json({
        success: false,
        message: 'Invalid eventType. Must be "public" or "private".',
      });
      return;
    }

    // Validate capacity if updating
    if (capacity !== undefined) {
      const parsedCapacity = Number(capacity);
      if (isNaN(parsedCapacity) || parsedCapacity < 1) {
        res.status(400).json({
          success: false,
          message: 'Capacity must be at least 1.',
        });
        return;
      }
      event.capacity = parsedCapacity;
    }

    // Validate dates if updating
    const newStart = startDate ? new Date(startDate) : event.startDate;
    const newEnd = endDate ? new Date(endDate) : event.endDate;

    if (isNaN(newStart.getTime()) || isNaN(newEnd.getTime())) {
      res.status(400).json({
        success: false,
        message: 'Please provide valid start and end dates.',
      });
      return;
    }

    if (newEnd <= newStart) {
      res.status(400).json({
        success: false,
        message: 'End date must be later than start date.',
      });
      return;
    }

    // Update remaining allowed fields
    if (title) event.title = title.trim();
    if (category) event.category = category;
    if (eventType) event.eventType = eventType;
    if (description) event.description = description;
    if (coverImage !== undefined) event.coverImage = coverImage;
    if (startDate) {
      event.startDate = newStart;
      event.startDateIST =
        newStart.toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'medium',
          timeStyle: 'short',
        }) + ' IST';
    }
    if (endDate) {
      event.endDate = newEnd;
      event.endDateIST =
        newEnd.toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'medium',
          timeStyle: 'short',
        }) + ' IST';
    }
    if (venue) event.venue = venue;
    if (address) event.address = address;
    if (city) event.city = city;
    if (status) event.status = status;

    const updatedEvent = await event.save();

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while updating event.',
    });
  }
};

// 5. Delete Event (Event owner or Admin)
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid event ID format.',
      });
      return;
    }

    const event = await Event.findById(id);
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
        message: 'Access denied. You can only delete your own events.',
      });
      return;
    }

    // Delete related participants and attendance records
    await EventParticipant.deleteMany({ eventId: event._id });
    await Attendance.deleteMany({ eventId: event._id });

    // Delete the event
    await Event.findByIdAndDelete(event._id);

    res.status(200).json({
      success: true,
      message: 'Event and related records deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while deleting event.',
    });
  }
};

// 6. Get Organizer Events (My Events)
export const getMyEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const organizerId = req.user?.id;

    if (!organizerId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: User not identified.',
      });
      return;
    }

    const events = await Event.find({ organizerId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while fetching organizer events.',
    });
  }
};

// 7. Get All Private Events (Admin Only)
export const getPrivateEventsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, city, category, search } = req.query;

    const filterQuery: any = {
      eventType: 'private',
    };

    if (status && typeof status === 'string') {
      filterQuery.status = status;
    }

    if (category && typeof category === 'string') {
      filterQuery.category = category;
    }

    if (city && typeof city === 'string') {
      filterQuery.city = { $regex: new RegExp(city.trim(), 'i') };
    }

    if (search && typeof search === 'string') {
      filterQuery.title = { $regex: new RegExp(search.trim(), 'i') };
    }

    const privateEvents = await Event.find(filterQuery)
      .populate('organizerId', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: privateEvents.length,
      events: privateEvents,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while fetching private events for admin.',
    });
  }
};
