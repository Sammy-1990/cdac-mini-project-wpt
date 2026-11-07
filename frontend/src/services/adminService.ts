import api from "./api";
import { EventItem } from "../types/event.types";

export interface AdminUser {
  _id: string;
  fullName: string;
  email: string;
  role: "guest" | "organizer" | "admin";
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUserFilterParams {
  role?: string;
  search?: string;
}

export interface AdminEventFilterParams {
  category?: string;
  city?: string;
  status?: string;
  search?: string;
}

export const adminService = {
  // Get all users with optional role and search filters
  getAllUsers: async (params?: AdminUserFilterParams): Promise<{ success: boolean; count: number; users: AdminUser[] }> => {
    const response = await api.get("/admin/users", { params });
    return response.data;
  },

  // Update a user's role (e.g. promote Guest to Organizer)
  updateUserRole: async (userId: string, role: "guest" | "organizer" | "admin"): Promise<{ success: boolean; message: string; user: AdminUser }> => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  // Delete a user
  deleteUser: async (userId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Get all events across system for administration
  getAllEvents: async (params?: AdminEventFilterParams): Promise<{ success: boolean; count: number; events: EventItem[] }> => {
    const response = await api.get("/admin/events", { params });
    return response.data;
  },

  // Reassign event organizer
  reassignOrganizer: async (eventId: string, organizerId: string): Promise<{ success: boolean; message: string; event: EventItem }> => {
    const response = await api.put(`/admin/events/${eventId}/organizer`, { organizerId });
    return response.data;
  },
};
