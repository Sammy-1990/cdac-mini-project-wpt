import api from "./api";
import { CheckInResponse, AttendanceListResponse } from "../types/attendance.types";

export const attendanceService = {
  // QR Check-in by token and eventId
  checkIn: async (data: { qrToken: string; eventId: string }): Promise<CheckInResponse> => {
    const response = await api.post<CheckInResponse>("/attendance/check-in", data);
    return response.data;
  },

  // Get list of attendees checked in for an event
  getEventAttendance: async (eventId: string): Promise<AttendanceListResponse> => {
    const response = await api.get<AttendanceListResponse>(`/attendance/event/${eventId}`);
    return response.data;
  },
};
