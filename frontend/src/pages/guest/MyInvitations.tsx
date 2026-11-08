import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardSidebar } from "../../components/dashboard/DashboardSidebar";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { participantService } from "../../services/participantService";
import { ParticipantItem } from "../../types/participant.types";
import { Mail, Check, X, Building2, MapPin, ExternalLink, Ticket } from "lucide-react";
import { Loader } from "../../components/common/Loader";
import { EmptyState } from "../../components/common/EmptyState";
import { formatCategory, getStatusBadgeStyle } from "../../utils/formatUtils";
import { Alert, CircularProgress } from "@mui/material";

export const MyInvitations: React.FC = () => {
  const [invitations, setInvitations] = useState<ParticipantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const data = await participantService.getMyInvitations();
      if (data && data.invitations) {
        setInvitations(data.invitations);
      }
    } catch (err) {
      console.error("Error fetching invitations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      setActionId(id);
      setMessage(null);
      const response = await participantService.acceptInvitation(id);
      if (response && response.success) {
        setMessage("Invitation accepted successfully!");
        fetchInvitations();
      }
    } catch (err: any) {
      console.error("Accept error:", err);
      setMessage(err.response?.data?.message || "Failed to accept.");
    } finally {
      setActionId(null);
    }
  };

  const handleDecline = async (id: string) => {
    try {
      setActionId(id);
      setMessage(null);
      const response = await participantService.declineInvitation(id);
      if (response && response.success) {
        setMessage("Invitation declined.");
        fetchInvitations();
      }
    } catch (err: any) {
      console.error("Decline error:", err);
      setMessage(err.response?.data?.message || "Failed to decline.");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#1F2937] text-[#F8FAFC] flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title="My Invitations"
          subtitle="Private event invitations sent to your account"
        />

        <main className="p-6 sm:p-8 flex-1 space-y-6">
          {message && (
            <Alert severity="info" className="rounded-xl text-xs bg-[#00ADB5]/15 border border-[#00ADB5]/30 text-[#00ADB5]" onClose={() => setMessage(null)}>
              {message}
            </Alert>
          )}

          {loading ? (
            <Loader message="Fetching your private invitations..." />
          ) : invitations.length === 0 ? (
            <EmptyState
              icon={Mail}
              title="No Invitations Received"
              description="You do not have any pending private invitations. When friends or organizers invite you to a wedding, party, or private event, it will appear here."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {invitations.map((item) => {
                const event: any = item.eventId || {};
                const statusStyle = getStatusBadgeStyle(item.status);
                const isProcessing = actionId === item._id;

                return (
                  <div
                    key={item._id}
                    className="bg-[#293548] rounded-2xl border border-[#374151] p-6 shadow-lg hover:border-[#00ADB5]/50 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Category & Status */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#1F2937] text-[#00ADB5] border border-[#374151]">
                          {formatCategory(event.category || "wedding")}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusStyle.bg}`}>
                          {item.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Event Title */}
                      <h3 className="text-xl font-bold text-[#F8FAFC] font-['Plus_Jakarta_Sans']">
                        {event.title || "Private Event"}
                      </h3>

                      {/* Venue & Location */}
                      <div className="space-y-1.5 text-xs text-[#CBD5E1]">
                        <div className="flex items-center gap-2">
                          <Building2 size={15} className="text-[#00ADB5]" />
                          <span>{event.venue || "Venue Provided by Host"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={15} className="text-[#00ADB5]" />
                          <span>{event.city || "City TBA"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 mt-4 border-t border-[#374151] flex items-center justify-between gap-3">
                      <Link
                        to={`/invitation/${item._id}`}
                        className="text-xs font-bold text-[#00ADB5] hover:text-[#38BDF8] inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Open Preview Card</span>
                        <ExternalLink size={13} />
                      </Link>

                      {item.status === "invited" ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAccept(item._id)}
                            disabled={isProcessing}
                            className="px-3.5 py-1.5 bg-[#00ADB5] hover:bg-[#00949B] text-[#111827] rounded-xl text-xs font-bold inline-flex items-center gap-1 transition-all shadow-md disabled:opacity-60"
                          >
                            {isProcessing ? <CircularProgress size={13} sx={{ color: "#111827" }} /> : <Check size={14} />}
                            <span>Accept</span>
                          </button>

                          <button
                            onClick={() => handleDecline(item._id)}
                            disabled={isProcessing}
                            className="px-3.5 py-1.5 bg-transparent border border-[#F87171]/50 text-[#F87171] hover:bg-red-950/30 rounded-xl text-xs font-bold inline-flex items-center gap-1 transition-all disabled:opacity-60"
                          >
                            <X size={14} />
                            <span>Decline</span>
                          </button>
                        </div>
                      ) : item.status === "accepted" ? (
                        <Link
                          to="/guest/tickets"
                          className="px-3 py-1.5 bg-[#00ADB5]/15 border border-[#00ADB5]/30 text-[#00ADB5] hover:bg-[#00ADB5]/25 rounded-xl text-xs font-bold inline-flex items-center gap-1 transition-colors"
                        >
                          <Ticket size={14} />
                          <span>View Ticket</span>
                        </Link>
                      ) : (
                        <span className="text-xs text-[#F87171] font-semibold">Declined</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
