export type EventCategory =
  | "wedding"
  | "birthday"
  | "anniversary"
  | "family-function"
  | "concert"
  | "award-show"
  | "festival"
  | "conference"
  | "seminar"
  | "comedy-show"
  | "exhibition"
  | "other";

export type EventType = "public" | "private";

export type EventStatus = "draft" | "published" | "completed" | "cancelled";

export interface OrganizerRef {
  _id: string;
  fullName: string;
  email: string;
}

export interface EventItem {
  _id: string;
  organizerId: string | OrganizerRef;
  title: string;
  category: EventCategory;
  eventType: EventType;
  description: string;
  eventImage?: string;
  coverImage?: string;
  startDate: string;
  endDate: string;
  startDateIST?: string;
  endDateIST?: string;
  venue: string;
  address: string;
  city: string;
  capacity: number;
  status: EventStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEventPayload {
  title: string;
  category: EventCategory;
  eventType: EventType;
  description: string;
  eventImage?: string;
  startDate: string;
  endDate: string;
  venue: string;
  address: string;
  city: string;
  capacity: number;
  status: "draft" | "published";
}

export interface UpdateEventPayload {
  title?: string;
  category?: EventCategory;
  eventType?: EventType;
  description?: string;
  eventImage?: string;
  startDate?: string;
  endDate?: string;
  venue?: string;
  address?: string;
  city?: string;
  capacity?: number;
  status?: EventStatus;
}
