import mongoose, { Schema, Model } from 'mongoose';
import { IEventParticipantDocument } from '../types/database.types';

const eventParticipantSchema = new Schema<IEventParticipantDocument>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    name: {
      type: String,
      required: [true, 'Participant name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Participant email is required'],
      lowercase: true,
      trim: true,
    },
    participationType: {
      type: String,
      required: [true, 'Participation type is required'],
      enum: {
        values: ['registration', 'invitation'],
        message: '{VALUE} is not a valid participation type',
      },
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['registered', 'invited', 'accepted', 'declined', 'cancelled'],
        message: '{VALUE} is not a valid participant status',
      },
    },
    qrToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate participation for the same event
eventParticipantSchema.index({ eventId: 1, email: 1 }, { unique: true });

// Sparse unique index for QR token (unique only when token is present)
eventParticipantSchema.index({ qrToken: 1 }, { unique: true, sparse: true });

// Index for event and status queries
eventParticipantSchema.index({ eventId: 1, status: 1 });

export const EventParticipant: Model<IEventParticipantDocument> =
  (mongoose.models.EventParticipant as Model<IEventParticipantDocument>) ||
  mongoose.model<IEventParticipantDocument>(
    'EventParticipant',
    eventParticipantSchema
  );

export default EventParticipant;
