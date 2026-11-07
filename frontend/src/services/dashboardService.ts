import api from "./api";
import { OrganizerDashboardData, AdminDashboardData } from "../types/dashboard.types";

export const dashboardService = {
  // Organizer Dashboard Metrics
  getOrganizerDashboard: async (): Promise<{ success: boolean; dashboard: OrganizerDashboardData }> => {
    const response = await api.get("/dashboard/organizer");
    return response.data;
  },

  // Admin Dashboard Metrics
  getAdminDashboard: async (): Promise<{ success: boolean; dashboard: AdminDashboardData }> => {
    const response = await api.get("/dashboard/admin");
    return response.data;
  },
};
