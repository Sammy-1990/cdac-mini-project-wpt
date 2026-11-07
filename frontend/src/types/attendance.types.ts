export interface AttendanceItem {
  _id: string;
  participantId: string;
  participantName?: string;
  name?: string;
  participantEmail?: string;
  participationType?: string;
  status?: string;
  eventId: string;
  eventTitle: string;
  checkedInAt: string;
  checkedInAtIST?: string;
  checkedInBy?: string;
  checkedInByName?: string;
}

export interface CheckInResponse {
  success: boolean;
  message: string;
  attendance: AttendanceItem;
  participant?: any;
}

export interface AttendanceListResponse {
  success: boolean;
  count: number;
  attendance: AttendanceItem[];
}
