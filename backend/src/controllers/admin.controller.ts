import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import Event from '../models/Event';
import EventParticipant from '../models/EventParticipant';
import Attendance from '../models/Attendance';

// 1. Get All Users (Admin Only)
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role, search } = req.query;

    const filter: any = {};
    if (role && (role === 'guest' || role === 'organizer' || role === 'admin')) {
      filter.role = role;
    }
    if (search && typeof search === 'string' && search.trim()) {
      const keyword = search.trim();
      filter.$or = [
        { fullName: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while fetching users.',
    });
  }
};

// 2. Update User Role (e.g. Promote Guest to Organizer) (Admin Only)
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { role } = req.body;
    const currentAdminId = req.user?.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid user ID format.',
      });
      return;
    }

    if (!role || !['guest', 'organizer', 'admin'].includes(role)) {
      res.status(400).json({
        success: false,
        message: 'Invalid role. Must be guest, organizer, or admin.',
      });
      return;
    }

    // Safeguard: Prevent admin from accidentally demoting themselves
    if (id === currentAdminId && role !== 'admin') {
      res.status(400).json({
        success: false,
        message: 'Cannot demote your own active administrator account.',
      });
      return;
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found.',
      });
      return;
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role} successfully.`,
      user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while updating user role.',
    });
  }
};

// 3. Delete or Deactivate User (Admin Only)
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const currentAdminId = req.user?.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid user ID format.',
      });
      return;
    }

    // Safeguard: Cannot delete self
    if (id === currentAdminId) {
      res.status(400).json({
        success: false,
        message: 'Cannot delete your own active administrator account.',
      });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found.',
      });
      return;
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while deleting user.',
    });
  }
};

// 4. Get All Events for Admin (Draft, Published, Cancelled, Private, Public)
export const getAllEventsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, city, status, search } = req.query;

    const filter: any = {};
    if (category) filter.category = category;
    if (city) filter.city = city;
    if (status) filter.status = status;
    if (search && typeof search === 'string' && search.trim()) {
      filter.title = { $regex: search.trim(), $options: 'i' };
    }

    const events = await Event.find(filter)
      .populate('organizerId', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while fetching admin events.',
    });
  }
};

// 5. Reassign Event Organizer (Admin Only)
export const reassignOrganizer = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventId = req.params.id as string;
    const { organizerId } = req.body;

    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid event ID format.',
      });
      return;
    }

    if (!organizerId || !mongoose.Types.ObjectId.isValid(organizerId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid organizer ID format.',
      });
      return;
    }

    // Verify target organizer exists
    const targetUser = await User.findById(organizerId);
    if (!targetUser) {
      res.status(404).json({
        success: false,
        message: 'Target organizer user not found.',
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

    event.organizerId = targetUser._id;
    await event.save();

    res.status(200).json({
      success: true,
      message: `Event reassigned to ${targetUser.fullName} successfully.`,
      event,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while reassigning event.',
    });
  }
};
