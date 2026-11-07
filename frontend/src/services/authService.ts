import api from "./api";
import { LoginResponse, RegisterResponse, ProfileResponse } from "../types/auth.types";

export const authService = {
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    return response.data;
  },

  register: async (userData: { fullName: string; email: string; password: string }): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>("/auth/register", userData);
    return response.data;
  },

  getProfile: async (): Promise<ProfileResponse> => {
    const response = await api.get<ProfileResponse>("/auth/profile");
    return response.data;
  },
};
