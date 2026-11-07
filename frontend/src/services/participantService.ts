import api from "./api";
import {
  ParticipantItem,
  RegisterParticipantResponse,
  InviteParticipantResponse,
  InvitationDetailsResponse,
  AcceptInvitationResponse,
  DeclineInvitationResponse,
} from "../types/participant.types";

export const participantService = {
  // Public Event Registration
  registerForEvent: async (
    eventId: string,
    data: { name: string; email: string }
  ): Promise<RegisterParticipantResponse> => {
    const response = await api.post<RegisterParticipantResponse>(`/participants/register/${eventId}`, data);
    return response.data;
  },

  // Invite guest to private event
  inviteGuest: async (
    eventId: string,
    data: { name: string; email: string }
  ): Promise<InviteParticipantResponse> => {
    const response = await api.post<InviteParticipantResponse>(`/participants/invite/${eventId}`, data);
    return response.data;
  },

  // Preview invitation details (Public / Invitee)
  getInvitationDetails: async (participantId: string): Promise<InvitationDetailsResponse> => {
    const response = await api.get<InvitationDetailsResponse>(`/participants/invitation/${participantId}`);
    return response.data;
  },

  // Accept private invitation
  acceptInvitation: async (participantId: string): Promise<AcceptInvitationResponse> => {
    const response = await api.put<AcceptInvitationResponse>(`/participants/invitation/${participantId}/accept`);
    return response.data;
  },

  // Decline private invitation
  declineInvitation: async (participantId: string): Promise<DeclineInvitationResponse> => {
    const response = await api.put<DeclineInvitationResponse>(`/participants/invitation/${participantId}/decline`);
    return response.data;
  },

  // Get logged-in user's public registrations
  getMyRegistrations: async (): Promise<{ success: boolean; count: number; registrations: ParticipantItem[] }> => {
    const response = await api.get("/participants/my-registrations");
    return response.data;
  },

  // Get logged-in user's private invitations
  getMyInvitations: async (): Promise<{ success: boolean; count: number; invitations: ParticipantItem[] }> => {
    const response = await api.get("/participants/my-invitations");
    return response.data;
  },

  // Cancel public or private registration (Guest/Admin)
  cancelRegistration: async (participantId: string): Promise<{ success: boolean; message: string; participant: ParticipantItem }> => {
    const response = await api.put(`/participants/${participantId}/cancel`);
    return response.data;
  },

  // Get all participants for an event (Organizer/Admin)
  getEventParticipants: async (
    eventId: string
  ): Promise<{ success: boolean; count: number; participants: ParticipantItem[] }> => {
    const response = await api.get(`/participants/event/${eventId}`);
    return response.data;
  },
};
