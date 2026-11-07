import api from "./api";
import { EventItem, CreateEventPayload, UpdateEventPayload } from "../types/event.types";

export interface EventFilterParams {
  category?: string;
  city?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export const eventService = {
  // Get all public published events with optional filters
  getPublicEvents: async (params?: EventFilterParams): Promise<{ success: boolean; count: number; events: EventItem[] }> => {
    const response = await api.get("/events", { params });
    return response.data;
  },

  // Get single event details
  getEventById: async (eventId: string): Promise<{ success: boolean; event: EventItem }> => {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  },

  // Get organizer's own events
  getMyEvents: async (): Promise<{ success: boolean; count: number; events: EventItem[] }> => {
    const response = await api.get("/events/my-events");
    return response.data;
  },

  // Create new event (Public or Private) - accepts JSON payload or FormData (for image upload)
  createEvent: async (data: CreateEventPayload | FormData): Promise<{ success: boolean; message: string; event: EventItem }> => {
    const response = await api.post("/events", data);
    return response.data;
  },

  // Update existing event - accepts JSON payload or FormData (for image upload)
  updateEvent: async (eventId: string, data: UpdateEventPayload | FormData): Promise<{ success: boolean; message: string; event: EventItem }> => {
    const response = await api.put(`/events/${eventId}`, data);
    return response.data;
  },

  // Cancel event (sets status to 'cancelled')
  cancelEvent: async (eventId: string): Promise<{ success: boolean; message: string; event: EventItem }> => {
    const response = await api.put(`/events/${eventId}`, { status: "cancelled" });
    return response.data;
  },

  // Delete event (with cascade deletion of participants and attendance)
  deleteEvent: async (eventId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  },

  // Admin view all private events
  getAdminPrivateEvents: async (params?: EventFilterParams): Promise<{ success: boolean; count: number; events: EventItem[] }> => {
    const response = await api.get("/events/admin/private-events", { params });
    return response.data;
  },
};
