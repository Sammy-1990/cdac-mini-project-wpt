import { EventItem } from "./event.types";

export type ParticipationType = "registration" | "invitation";

export type ParticipantStatus = "registered" | "invited" | "accepted" | "declined" | "cancelled";

export interface ParticipantItem {
  _id: string;
  eventId: string | EventItem;
  userId?: string;
  name: string;
  email: string;
  participationType: ParticipationType;
  status: ParticipantStatus;
  qrToken?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterParticipantResponse {
  success: boolean;
  message: string;
  participant: ParticipantItem;
  qrCode?: string; // Base64 data URL
}

export interface InviteParticipantResponse {
  success: boolean;
  message: string;
  participant: ParticipantItem;
  invitationLink: string;
}

export interface InvitationDetailsResponse {
  success: boolean;
  invitation: ParticipantItem;
}

export interface AcceptInvitationResponse {
  success: boolean;
  message: string;
  participant: ParticipantItem;
  qrCode?: string; // Base64 data URL
}

export interface DeclineInvitationResponse {
  success: boolean;
  message: string;
  participant: ParticipantItem;
}
