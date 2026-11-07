export type UserRole = "guest" | "organizer" | "admin";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  createdAt?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  user: User;
}
