import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardSidebar } from "../../components/dashboard/DashboardSidebar";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { eventService } from "../../services/eventService";
import { EventItem } from "../../types/event.types";
import {
  Calendar,
  PlusCircle,
  Edit2,
  Trash2,
  Users,
  QrCode,
  ExternalLink,
  MapPin,
  AlertTriangle,
  XCircle,
  Clock,
  Shield,
  Globe,
  Lock,
} from "lucide-react";
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
import { formatCategory, getCategoryGradient, getStatusBadgeStyle } from "../../utils/formatUtils";
import { formatISTDate } from "../../utils/dateUtils";
import { getImageUrl } from "../../utils/imageUrl";

export const MyEvents: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog States
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getMyEvents();
      if (data && data.events) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error("Error fetching my events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const openDeleteDialog = (event: EventItem) => {
    setSelectedEvent(event);
    setDeleteDialogOpen(true);
  };

  const openCancelDialog = (event: EventItem) => {
    setSelectedEvent(event);
    setCancelDialogOpen(true);
  };

  const confirmCancel = async () => {
    if (!selectedEvent) return;
    try {
      setCancelling(true);
      const res = await eventService.cancelEvent(selectedEvent._id);
      if (res && res.success) {
        setFeedback({
          type: "success",
          text: `"${selectedEvent.title}" has been cancelled successfully. Registration has been closed.`,
        });
        setCancelDialogOpen(false);
        setSelectedEvent(null);
        fetchMyEvents();
      }
    } catch (err: any) {
      console.error("Cancel error:", err);
      setFeedback({
        type: "error",
        text: err.response?.data?.message || "Failed to cancel event.",
      });
    } finally {
      setCancelling(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedEvent) return;
    try {
      setDeleting(true);
      const res = await eventService.deleteEvent(selectedEvent._id);
      if (res && res.success) {
        setFeedback({
          type: "success",
          text: `"${selectedEvent.title}" and its local image file were removed successfully.`,
        });
        setDeleteDialogOpen(false);
        setSelectedEvent(null);
        fetchMyEvents();
      }
    } catch (err: any) {
      console.error("Delete error:", err);
      setFeedback({
        type: "error",
        text:
          err.response?.data?.message ||
          "Failed to delete event. Note: Active events with registered participants must be cancelled instead of deleted.",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7FC] flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title="My Organized Events"
          subtitle="Manage all events you have created"
          actionText="+ Create New Event"
          actionPath="/organizer/events/create"
          actionIcon={<PlusCircle size={16} />}
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
            <Loader message="Loading your events..." />
          ) : events.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="You haven't created any events yet."
              description="Start organizing public festivals, conferences, or private family celebrations."
              actionText="Create Your First Event"
              onAction={() => navigate("/organizer/events/create")}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {events.map((ev) => {
                const statusStyle = getStatusBadgeStyle(ev.status);
                const startDisplay = ev.startDateIST || formatISTDate(ev.startDate);
                const bannerImage = ev.eventImage || ev.coverImage;
                const gradientClass = getCategoryGradient(ev.category);

                return (
                  <div
                    key={ev._id}
                    className="bg-white rounded-3xl border border-[#E9E8F0] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    {/* Event Banner */}
                    <div className={`h-44 w-full relative bg-gradient-to-br ${gradientClass} flex items-center justify-center overflow-hidden`}>
                      {bannerImage ? (
                        <img
                          src={getImageUrl(bannerImage)}
                          alt={ev.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="text-white/25">
                          <Calendar size={56} />
                        </div>
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm bg-white/95 text-[#6C3BDB] border border-white/40">
                          {formatCategory(ev.category)}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm bg-black/60 text-white backdrop-blur-sm flex items-center gap-1">
                          {ev.eventType === "public" ? <Globe size={11} /> : <Lock size={11} />}
                          <span>{ev.eventType}</span>
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 z-10">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-sm ${statusStyle.bg}`}>
                          {ev.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        {/* Event Title */}
                        <h3 className="text-xl font-bold text-[#202033] font-['Plus_Jakarta_Sans'] line-clamp-1">
                          {ev.title}
                        </h3>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#77778A]">
                          <p className="flex items-center gap-2 truncate">
                            <Clock size={14} className="text-[#6C3BDB] shrink-0" />
                            <span className="truncate">{startDisplay}</span>
                          </p>
                          <p className="flex items-center gap-2 truncate">
                            <MapPin size={14} className="text-[#6C3BDB] shrink-0" />
                            <span className="truncate">{ev.venue}, {ev.city}</span>
                          </p>
                          <p className="flex items-center gap-2 truncate">
                            <Users size={14} className="text-[#6C3BDB] shrink-0" />
                            <span>Capacity: {ev.capacity || 500} attendees</span>
                          </p>
                          <p className="flex items-center gap-2 truncate font-semibold text-[#202033]">
                            <Shield size={14} className="text-emerald-600 shrink-0" />
                            <span className="capitalize">{ev.status}</span>
                          </p>
                        </div>
                      </div>

                      {/* Action Bar (View Details, Edit Event, Cancel Event, Delete Event) */}
                      <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 mt-4">
                        {/* Secondary Links: Participants & Check-in */}
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/organizer/events/${ev._id}/participants`}
                            className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-[#6C3BDB] text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition-colors"
                          >
                            <Users size={13} />
                            <span>Participants</span>
                          </Link>

                          <Link
                            to={`/organizer/attendance?eventId=${ev._id}`}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition-colors"
                          >
                            <QrCode size={13} />
                            <span>Check-In</span>
                          </Link>
                        </div>

                        {/* Primary Event Management Actions */}
                        <div className="flex items-center gap-1.5">
                          {/* 1. View Details */}
                          <Link
                            to={`/events/${ev._id}`}
                            className="p-2 text-gray-500 hover:text-[#6C3BDB] hover:bg-gray-100 rounded-xl transition-colors"
                            title="View Public Details"
                          >
                            <ExternalLink size={16} />
                          </Link>

                          {/* 2. Edit Event (Prominent Button) */}
                          <Link
                            to={`/organizer/events/edit/${ev._id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#6C3BDB] hover:bg-[#5032C4] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                            title="Edit Event"
                          >
                            <Edit2 size={13} />
                            <span>Edit Event</span>
                          </Link>

                          {/* 3. Cancel Event */}
                          {ev.status !== "cancelled" && (
                            <button
                              onClick={() => openCancelDialog(ev)}
                              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                              title="Cancel Event"
                            >
                              <XCircle size={16} />
                            </button>
                          )}

                          {/* 4. Delete Event */}
                          <button
                            onClick={() => openDeleteDialog(ev)}
                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#E5484D", display: "flex", alignItems: "center", gap: 1 }}>
          <AlertTriangle size={22} />
          <span>Confirm Event Deletion</span>
        </DialogTitle>
        <DialogContent>
          <p className="text-sm text-[#202033] mb-2">
            Are you sure you want to permanently delete <strong>{selectedEvent?.title}</strong>?
          </p>
          <p className="text-xs text-[#77778A] leading-relaxed">
            Note: Draft events and events without participants can be safely deleted along with their local image files. Events with active registrations must be cancelled instead to protect attendee records.
          </p>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: "#77778A", textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={deleting}
            onClick={confirmDelete}
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: "10px" }}
          >
            {deleting ? "Deleting..." : "Delete Permanently"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Event Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#D97706", display: "flex", alignItems: "center", gap: 1 }}>
          <AlertTriangle size={22} />
          <span>Cancel Event</span>
        </DialogTitle>
        <DialogContent>
          <p className="text-sm text-[#202033] mb-2">
            Are you sure you want to cancel <strong>{selectedEvent?.title}</strong>?
          </p>
          <p className="text-xs text-[#77778A] leading-relaxed">
            The event will be marked as "CANCELLED", stopping any new registrations while keeping attendee history and the banner image intact.
          </p>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCancelDialogOpen(false)} sx={{ color: "#77778A", textTransform: "none" }}>
            Keep Active
          </Button>
          <Button
            variant="contained"
            disabled={cancelling}
            onClick={confirmCancel}
            sx={{
              backgroundColor: "#D97706",
              "&:hover": { backgroundColor: "#B45309" },
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "10px",
            }}
          >
            {cancelling ? "Cancelling..." : "Confirm Cancellation"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
