import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { DashboardSidebar } from "../../components/dashboard/DashboardSidebar";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { participantService } from "../../services/participantService";
import { eventService } from "../../services/eventService";
import { ParticipantItem } from "../../types/participant.types";
import { EventItem } from "../../types/event.types";
import {
  Users,
  UserPlus,
  Mail,
  Copy,
  Check,
  ArrowLeft,
  ExternalLink,
  QrCode,
  Calendar,
} from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Loader } from "../../components/common/Loader";
import { EmptyState } from "../../components/common/EmptyState";
import { getStatusBadgeStyle } from "../../utils/formatUtils";

export const EventParticipants: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [participants, setParticipants] = useState<ParticipantItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Invite Modal State
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Success Link Dialog State
  const [successLink, setSuccessLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchParticipants = async () => {
    if (!eventId) return;
    try {
      setLoading(true);
      const [pRes, eRes] = await Promise.all([
        participantService.getEventParticipants(eventId),
        eventService.getEventById(eventId),
      ]);

      if (pRes && pRes.participants) setParticipants(pRes.participants);
      if (eRes && eRes.event) setEvent(eRes.event);
    } catch (err) {
      console.error("Error loading participants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [eventId]);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId || !guestName.trim() || !guestEmail.trim()) {
      setInviteError("Please provide both name and email.");
      return;
    }

    try {
      setInviting(true);
      setInviteError(null);

      const res = await participantService.inviteGuest(eventId, {
        name: guestName.trim(),
        email: guestEmail.trim(),
      });

      if (res && res.success) {
        setInviteModalOpen(false);
        setGuestName("");
        setGuestEmail("");
        setSuccessLink(res.invitationLink);
        setCopied(false);
        fetchParticipants();
      }
    } catch (err: any) {
      console.error("Invite error:", err);
      setInviteError(err.response?.data?.message || "Failed to invite guest.");
    } finally {
      setInviting(false);
    }
  };

  const handleCopyLink = () => {
    if (!successLink) return;
    navigator.clipboard.writeText(successLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8F8FC] flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title={event ? `Participants: ${event.title}` : "Manage Participants"}
          subtitle="View registrations and send private guest invitations"
          actionText="Invite Guest"
          actionPath="#"
          actionIcon={<UserPlus size={16} />}
        />

        <main className="p-6 sm:p-8 flex-1 space-y-6">
          {/* Top Actions & Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E9E8F0] shadow-sm">
            <div className="flex items-center gap-3">
              <Link
                to="/organizer/events"
                className="p-2 text-gray-500 hover:text-[#6C4CE8] rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft size={18} />
              </Link>
              <div>
                <p className="text-sm font-bold text-[#202033]">
                  Total: {participants.length} Participant(s)
                </p>
                <p className="text-xs text-[#77778A]">
                  Event Type: <span className="capitalize font-semibold text-[#6C4CE8]">{event?.eventType}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={`/organizer/attendance?eventId=${eventId}`}
                className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition-colors"
              >
                <QrCode size={16} />
                <span>QR Check-In Desk</span>
              </Link>

              <button
                onClick={() => {
                  setInviteError(null);
                  setInviteModalOpen(true);
                }}
                className="px-4 py-2 bg-[#6C4CE8] hover:bg-[#5032C4] text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-all"
              >
                <UserPlus size={16} />
                <span>Invite New Guest</span>
              </button>
            </div>
          </div>

          {/* Participant Table */}
          {loading ? (
            <Loader message="Loading participant roster..." />
          ) : participants.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No Participants Registered"
              description="No guests have registered or been invited to this event yet. Use the Invite Guest button to generate private invitations."
              actionText="Invite First Guest"
              onAction={() => setInviteModalOpen(true)}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-[#E9E8F0] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50/70 border-b border-gray-100 text-[#77778A] font-semibold">
                      <th className="py-3.5 px-6">Attendee Name</th>
                      <th className="py-3.5 px-6">Email Address</th>
                      <th className="py-3.5 px-6">Participation Type</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6 text-right">Invitation Link / Token</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {participants.map((p) => {
                      const statusStyle = getStatusBadgeStyle(p.status);
                      return (
                        <tr key={p._id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="py-4 px-6 font-bold text-[#202033]">
                            {p.name}
                          </td>
                          <td className="py-4 px-6 text-[#77778A]">
                            {p.email}
                          </td>
                          <td className="py-4 px-6">
                            <span className="capitalize px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium">
                              {p.participationType}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-0.5 rounded-full font-bold border ${statusStyle.bg}`}>
                              {p.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right font-mono text-[11px] text-[#77778A]">
                            {p.participationType === "invitation" ? (
                              <Link
                                to={`/invitation/${p._id}`}
                                target="_blank"
                                className="text-[#6C4CE8] font-bold hover:underline inline-flex items-center gap-1"
                              >
                                <span>Preview Link</span>
                                <ExternalLink size={12} />
                              </Link>
                            ) : (
                              <span>QR Pass Issued</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Invite Guest Dialog */}
      <Dialog
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#202033", fontFamily: "Plus Jakarta Sans" }}>
          Invite Guest to Event
        </DialogTitle>
        <form onSubmit={handleInviteSubmit}>
          <DialogContent className="space-y-4">
            {inviteError && <Alert severity="error">{inviteError}</Alert>}
            <p className="text-xs text-[#77778A]">
              Enter the guest's name and email. EventFlow will generate a dedicated invitation link that you can share with them.
            </p>
            <TextField
              fullWidth
              label="Guest Full Name"
              required
              size="small"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Guest Email Address"
              type="email"
              required
              size="small"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setInviteModalOpen(false)} sx={{ color: "#77778A", textTransform: "none" }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={inviting}
              sx={{
                bgcolor: "#6C4CE8",
                "&:hover": { bgcolor: "#5032C4" },
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "10px",
                px: 3,
              }}
            >
              {inviting ? "Generating..." : "Generate Invitation Link"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Generated Link Dialog */}
      <Dialog
        open={Boolean(successLink)}
        onClose={() => setSuccessLink(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", p: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#16A36A", pb: 1, fontFamily: "Plus Jakarta Sans" }}>
          Invitation Created Successfully! ✉️
        </DialogTitle>
        <DialogContent className="space-y-3">
          <p className="text-xs text-[#77778A]">
            Share this link with your guest so they can preview event details and accept the invitation:
          </p>
          <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl">
            <input
              type="text"
              readOnly
              value={successLink || ""}
              className="w-full bg-transparent text-xs font-mono text-[#202033] focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-[#6C4CE8] text-white rounded-lg text-xs font-bold hover:bg-[#5032C4] shrink-0 inline-flex items-center gap-1 transition-all"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 1 }}>
          <Button
            onClick={() => setSuccessLink(null)}
            variant="contained"
            sx={{ bgcolor: "#6C4CE8", textTransform: "none", borderRadius: "10px" }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
