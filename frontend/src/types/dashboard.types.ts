export interface OrganizerDashboardData {
  totalEvents: number;
  publishedEventsCount?: number;
  publishedEvents?: number;
  draftEventsCount?: number;
  draftEvents?: number;
  cancelledEventsCount?: number;
  cancelledEvents?: number;
  events?: Array<{
    _id: string;
    title: string;
    category: string;
    eventType: string;
    status: string;
    startDate?: string;
    startDateIST?: string;
    city?: string;
    venue?: string;
    eventImage?: string;
  }>;
  totalParticipants: number;
  participants?: Array<{
    _id: string;
    name: string;
    email: string;
    status: string;
    participationType: string;
    eventId: string;
  }>;
  registeredGuestsCount?: number;
  registeredGuests?: Array<{
    _id: string;
    name: string;
    email: string;
    eventId: string;
  }>;
  acceptedInvitationsCount?: number;
  acceptedInvitations?: Array<{
    _id: string;
    name: string;
    email: string;
    eventId: string;
  }>;
  totalAttendeesCheckedIn: number;
  checkedInAttendees?: Array<{
    _id: string;
    participantId: string;
    name: string;
    email?: string;
    eventId: string;
    eventTitle?: string;
    checkedInAt: string;
    checkedInAtIST?: string;
  }>;
}

export interface AdminDashboardData {
  totalUsers: number;
  organizers: Array<{
    _id: string;
    fullName: string;
    email: string;
  }>;
  guests: Array<{
    _id: string;
    fullName: string;
    email: string;
  }>;
  totalEvents: number;
  publicEvents: any[];
  privateEvents: any[];
  totalRegistrations: number;
  registrations: any[];
  totalAttendanceRecords: number;
  attendanceRecords: any[];
}
