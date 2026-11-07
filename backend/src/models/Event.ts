import mongoose, { Schema, Model } from 'mongoose';
import { IEventDocument } from '../types/database.types';

const EVENT_CATEGORIES = [
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
] as const;

const eventSchema = new Schema<IEventDocument>(
  {
    organizerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Organizer ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: EVENT_CATEGORIES,
        message: '{VALUE} is not a valid event category',
      },
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      enum: {
        values: ['public', 'private'],
        message: '{VALUE} is not a valid event type',
      },
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    eventImage: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    startDateIST: {
      type: String,
      default: '',
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function (this: IEventDocument, value: Date): boolean {
          if (!this.startDate || !value) {
            return true;
          }
          return value > this.startDate;
        },
        message: 'End date must be later than start date',
      },
    },
    endDateIST: {
      type: String,
      default: '',
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'published', 'completed', 'cancelled'],
        message: '{VALUE} is not a valid event status',
      },
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for event discovery & querying
eventSchema.index({ eventType: 1, status: 1, startDate: 1 });
eventSchema.index({ category: 1, city: 1 });
eventSchema.index({ organizerId: 1 });

export const Event: Model<IEventDocument> =
  (mongoose.models.Event as Model<IEventDocument>) ||
  mongoose.model<IEventDocument>('Event', eventSchema);

export default Event;
