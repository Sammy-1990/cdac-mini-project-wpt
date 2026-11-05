import mongoose, { Schema, Model } from 'mongoose';
import { IAttendanceDocument } from '../types/database.types';

const attendanceSchema = new Schema<IAttendanceDocument>(
  {
    participantId: {
      type: Schema.Types.ObjectId,
      ref: 'EventParticipant',
      required: [true, 'Participant ID is required'],
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    checkedInAt: {
      type: Date,
      default: Date.now,
    },
    checkedInBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Checked-in by user ID is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate check-in for the same participant
attendanceSchema.index({ participantId: 1 }, { unique: true });

// Index for querying event attendances
attendanceSchema.index({ eventId: 1 });

export const Attendance: Model<IAttendanceDocument> =
  (mongoose.models.Attendance as Model<IAttendanceDocument>) ||
  mongoose.model<IAttendanceDocument>('Attendance', attendanceSchema);

export default Attendance;
