import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardSidebar } from "../../components/dashboard/DashboardSidebar";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { participantService } from "../../services/participantService";
import { ParticipantItem } from "../../types/participant.types";
import { Ticket, Calendar, MapPin, Building2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
} from "@mui/material";
import { Loader } from "../../components/common/Loader";
import { EmptyState } from "../../components/common/EmptyState";
import { formatCategory, getStatusBadgeStyle } from "../../utils/formatUtils";

export const MyRegistrations: React.FC = () => {
  const [registrations, setRegistrations] = useState<ParticipantItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Cancellation State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedReg, setSelectedReg] = useState<ParticipantItem | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const data = await participantService.getMyRegistrations();
      if (data && data.registrations) {
        setRegistrations(data.registrations);
      }
    } catch (err) {
      console.error("Error fetching registrations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const openCancelModal = (item: ParticipantItem) => {
    setSelectedReg(item);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedReg) return;
    try {
      setCancelling(true);
      const res = await participantService.cancelRegistration(selectedReg._id);
      if (res && res.success) {
        setFeedback({ type: "success", text: "Registration cancelled successfully." });
        setCancelModalOpen(false);
        setSelectedReg(null);
        fetchRegistrations();
      }
    } catch (err: any) {
      console.error("Cancel registration error:", err);
      setFeedback({ type: "error", text: err.response?.data?.message || "Failed to cancel registration." });
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1F2937] text-[#F8FAFC] flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title="My Registrations"
          subtitle="All public events you have registered for"
          actionText="Find More Events"
          actionPath="/events"
          actionIcon={<Calendar size={16} />}
        />

        <main className="p-6 sm:p-8 flex-1 space-y-6">
          {feedback && (
            <Alert
              severity={feedback.type}
              className="rounded-2xl text-xs"
              onClose={() => setFeedback(null)}
            >
              {feedback.text}
            </Alert>
          )}

          {loading ? (
            <Loader message="Fetching your registered events..." />
          ) : registrations.length === 0 ? (
            <EmptyState
              title="No Registrations Yet"
              description="You have not registered for any public events yet. Explore conferences, concerts, and festivals happening soon."
              actionText="Explore Events"
              onAction={() => (window.location.href = "/events")}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {registrations.map((item) => {
                const event: any = item.eventId || {};
                const statusStyle = getStatusBadgeStyle(item.status);
                const isCancelled = item.status === "cancelled";

                return (
                  <div
                    key={item._id}
                    className="bg-[#293548] rounded-2xl border border-[#374151] p-6 shadow-lg hover:border-[#00ADB5]/50 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Category & Status */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#1F2937] text-[#00ADB5] border border-[#374151]">
                          {formatCategory(event.category || "Event")}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusStyle.bg}`}>
                          {item.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Event Title */}
                      <h3 className="text-xl font-bold text-[#F8FAFC] font-['Plus_Jakarta_Sans']">
                        {event.title || "Event Title"}
                      </h3>

                      {/* Venue & Location */}
                      <div className="space-y-1.5 text-xs text-[#CBD5E1]">
                        <div className="flex items-center gap-2">
                          <Building2 size={15} className="text-[#00ADB5]" />
                          <span>{event.venue || "Venue TBA"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={15} className="text-[#00ADB5]" />
                          <span>{event.city || "City TBA"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={15} className="text-[#22C55E]" />
                          <span>Registered as: {item.name} ({item.email})</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="pt-4 mt-4 border-t border-[#374151] flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-[#94A3B8]">
                        QR Token: {item.qrToken ? `${item.qrToken.substring(0, 10)}...` : "Active"}
                      </span>

                      <div className="flex items-center gap-2">
                        {!isCancelled && (
                          <button
                            onClick={() => openCancelModal(item)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#F87171] hover:bg-red-950/20 rounded-xl transition-colors border border-transparent hover:border-red-900/40"
                          >
                            <XCircle size={14} />
                            <span>Cancel Registration</span>
                          </button>
                        )}

                        <Link
                          to="/guest/tickets"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00ADB5] hover:bg-[#00949B] text-[#111827] text-xs font-bold rounded-xl shadow-md transition-all"
                        >
                          <Ticket size={14} />
                          <span>View Ticket</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Cancel Registration Confirmation Dialog */}
      <Dialog
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", p: 1, backgroundColor: "#1F2937", border: "1px solid #374151", color: "#F8FAFC" } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#F87171", display: "flex", alignItems: "center", gap: 1 }}>
          <AlertTriangle size={20} />
          <span>Cancel Registration</span>
        </DialogTitle>
        <DialogContent>
          <p className="text-sm text-[#F8FAFC] mb-2">
            Are you sure you want to cancel your registration for this event?
          </p>
          <p className="text-xs text-[#94A3B8]">
            Your registration will be marked as cancelled, freeing up a spot for other attendees.
          </p>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCancelModalOpen(false)} sx={{ color: "#94A3B8", textTransform: "none" }}>
            Keep Ticket
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={cancelling}
            onClick={handleConfirmCancel}
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: "10px" }}
          >
            {cancelling ? "Cancelling..." : "Confirm Cancellation"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
