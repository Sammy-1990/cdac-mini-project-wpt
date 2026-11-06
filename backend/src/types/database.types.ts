import { Document, Types } from 'mongoose';

// User Types
export type UserRole = 'admin' | 'organizer' | 'guest';

export interface IUser {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  profileImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
}

// Event Types
export type EventCategory =
  | 'wedding'
  | 'birthday'
  | 'anniversary'
  | 'family-function'
  | 'concert'
  | 'award-show'
  | 'festival'
  | 'conference'
  | 'seminar'
  | 'comedy-show'
  | 'exhibition'
  | 'other';

export type EventType = 'public' | 'private';

export type EventStatus = 'draft' | 'published' | 'completed' | 'cancelled';

export interface IEvent {
  organizerId: Types.ObjectId;
  title: string;
  category: EventCategory;
  eventType: EventType;
  description: string;
  coverImage?: string;
  startDate: Date;
  startDateIST?: string;
  endDate: Date;
  endDateIST?: string;
  venue: string;
  address: string;
  city: string;
  capacity: number;
  status: EventStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEventDocument extends IEvent, Document {
  _id: Types.ObjectId;
}

// EventParticipant Types
export type ParticipationType = 'registration' | 'invitation';

export type ParticipantStatus =
  | 'registered'
  | 'invited'
  | 'accepted'
  | 'declined'
  | 'cancelled';

export interface IEventParticipant {
  eventId: Types.ObjectId;
  userId?: Types.ObjectId | null;
  name: string;
  email: string;
  participationType: ParticipationType;
  status: ParticipantStatus;
  qrToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEventParticipantDocument extends IEventParticipant, Document {
  _id: Types.ObjectId;
}

// Attendance Types
export interface IAttendance {
  participantId: Types.ObjectId;
  participantName?: string;
  name?: string;
  eventId: Types.ObjectId;
  eventTitle?: string;
  checkedInAt: Date;
  checkedInAtIST?: string;
  checkedInBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAttendanceDocument extends IAttendance, Document {
  _id: Types.ObjectId;
}

// Authenticated User Information from JWT Token
export interface AuthUser {
  id: string;
  role: string;
}

// Extend Express Request to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
