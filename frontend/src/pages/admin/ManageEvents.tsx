import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardSidebar } from "../../components/dashboard/DashboardSidebar";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { adminService, AdminUser } from "../../services/adminService";
import { eventService } from "../../services/eventService";
import { EventItem } from "../../types/event.types";
import {
  Calendar,
  Search,
  Filter,
  UserCheck,
  XCircle,
  ExternalLink,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Loader } from "../../components/common/Loader";
import { EmptyState } from "../../components/common/EmptyState";
import { formatCategory, getStatusBadgeStyle } from "../../utils/formatUtils";
import { formatISTDate } from "../../utils/dateUtils";
import { getImageUrl } from "../../utils/imageUrl";

export const ManageEvents: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [organizers, setOrganizers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Reassign Modal
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [selectedOrganizerId, setSelectedOrganizerId] = useState("");
  const [reassigning, setReassigning] = useState(false);

  // Cancel Event Modal
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Feedback
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await adminService.getAllEvents(params);
      if (res && res.events) {
        setEvents(res.events);
      }
    } catch (err: any) {
      console.error("Error fetching admin events:", err);
      setFeedback({ type: "error", text: "Failed to load events list." });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizers = async () => {
    try {
      const res = await adminService.getAllUsers({ role: "organizer" });
      if (res && res.users) {
        setOrganizers(res.users);
      }
    } catch (err) {
      console.error("Error loading organizers for reassignment:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchOrganizers();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents();
  };

  const openReassignModal = (event: EventItem) => {
    setSelectedEvent(event);
    const orgId = typeof event.organizerId === "object" ? event.organizerId?._id : event.organizerId;
    setSelectedOrganizerId(orgId || "");
    setReassignModalOpen(true);
  };

  const handleReassign = async () => {
    if (!selectedEvent || !selectedOrganizerId) return;
    try {
      setReassigning(true);
      const res = await adminService.reassignOrganizer(selectedEvent._id, selectedOrganizerId);
      if (res && res.success) {
        setFeedback({ type: "success", text: "Organizer reassigned successfully." });
        setReassignModalOpen(false);
        setSelectedEvent(null);
        fetchEvents();
      }
    } catch (err: any) {
      console.error("Error reassigning organizer:", err);
      setFeedback({ type: "error", text: err.response?.data?.message || "Failed to reassign organizer." });
    } finally {
      setReassigning(false);
    }
  };

  const openCancelModal = (event: EventItem) => {
    setSelectedEvent(event);
    setCancelModalOpen(true);
  };

  const handleCancelEvent = async () => {
    if (!selectedEvent) return;
    try {
      setCancelling(true);
      const res = await eventService.cancelEvent(selectedEvent._id);
      if (res && res.success) {
        setFeedback({ type: "success", text: "Event cancelled successfully." });
        setCancelModalOpen(false);
        setSelectedEvent(null);
        fetchEvents();
      }
    } catch (err: any) {
      console.error("Error cancelling event:", err);
      setFeedback({ type: "error", text: err.response?.data?.message || "Failed to cancel event." });
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title="Manage All Events"
          subtitle="System-wide event management, reassignment, and status moderation"
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

          {/* Search & Filter Bar */}
          <div className="bg-[#1F2937] p-4 sm:p-5 rounded-2xl border border-[#374151] shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search events by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#111827] border border-[#374151] rounded-xl text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:border-[#00ADB5] focus:outline-none"
              />
            </form>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Filter size={16} className="text-[#94A3B8]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3.5 py-2 bg-[#111827] border border-[#374151] rounded-xl text-xs text-[#F8FAFC] focus:border-[#00ADB5] focus:outline-none cursor-pointer"
              >
                <option value="" className="bg-[#1F2937] text-[#F8FAFC]">All Statuses</option>
                <option value="published" className="bg-[#1F2937] text-[#F8FAFC]">Published</option>
                <option value="draft" className="bg-[#1F2937] text-[#F8FAFC]">Draft</option>
                <option value="cancelled" className="bg-[#1F2937] text-[#F8FAFC]">Cancelled</option>
                <option value="completed" className="bg-[#1F2937] text-[#F8FAFC]">Completed</option>
              </select>
              <button
                type="button"
                onClick={fetchEvents}
                className="px-4 py-2 bg-[#00ADB5] text-[#111827] text-xs font-bold rounded-xl hover:bg-[#00949B] transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Events Table */}
          {loading ? (
            <Loader message="Loading events..." />
          ) : events.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No Events Found"
              description="No events match your current search and filters."
            />
          ) : (
            <div className="bg-[#293548] rounded-2xl border border-[#374151] overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1F2937] text-[#94A3B8] font-bold uppercase tracking-wider text-[11px] border-b border-[#374151]">
                    <tr>
                      <th className="py-4 px-6">Event</th>
                      <th className="py-4 px-6">Category / Type</th>
                      <th className="py-4 px-6">Organizer</th>
                      <th className="py-4 px-6">Date (IST)</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#374151]">
                    {events.map((ev) => {
                      const statusStyle = getStatusBadgeStyle(ev.status);
                      const org = typeof ev.organizerId === "object" ? ev.organizerId : null;
                      const bannerImg = ev.eventImage || ev.coverImage;

                      return (
                        <tr key={ev._id} className="hover:bg-[#1F2937]/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              {bannerImg ? (
                                <img
                                  src={getImageUrl(bannerImg)}
                                  alt={ev.title}
                                  className="w-12 h-10 rounded-lg object-cover bg-[#1F2937] border border-[#374151] shrink-0"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-12 h-10 rounded-lg bg-[#00ADB5]/10 text-[#00ADB5] border border-[#00ADB5]/20 flex items-center justify-center font-bold shrink-0">
                                  <Calendar size={18} />
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-[#F8FAFC] text-sm line-clamp-1">{ev.title}</p>
                                <p className="text-[11px] text-[#94A3B8] flex items-center gap-1 mt-0.5">
                                  <MapPin size={12} className="text-[#00ADB5]" /> {ev.venue}, {ev.city}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00ADB5]/10 text-[#00ADB5] border border-[#00ADB5]/20">
                                {formatCategory(ev.category)}
                              </span>
                              <p className="text-[11px] text-[#94A3B8] capitalize">{ev.eventType}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-semibold text-[#F8FAFC]">{org?.fullName || "Assigned Organizer"}</p>
                            <p className="text-[11px] text-[#94A3B8]">{org?.email || "N/A"}</p>
                          </td>
                          <td className="py-4 px-6 text-[#94A3B8]">
                            {ev.startDateIST || formatISTDate(ev.startDate)}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border capitalize ${statusStyle.bg}`}>
                              {ev.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                to={`/events/${ev._id}`}
                                className="p-1.5 text-[#94A3B8] hover:text-[#00ADB5] hover:bg-[#1F2937] rounded-lg transition-colors"
                                title="View Event Page"
                              >
                                <ExternalLink size={16} />
                              </Link>

                              <button
                                onClick={() => openReassignModal(ev)}
                                className="px-2.5 py-1 text-xs font-semibold bg-[#1F2937] text-[#00ADB5] border border-[#374151] hover:bg-[#374151] rounded-lg transition-colors inline-flex items-center gap-1"
                                title="Reassign Organizer"
                              >
                                <UserCheck size={14} />
                                <span>Reassign</span>
                              </button>

                              {ev.status !== "cancelled" && (
                                <button
                                  onClick={() => openCancelModal(ev)}
                                  className="p-1.5 text-[#94A3B8] hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                                  title="Cancel Event"
                                >
                                  <XCircle size={16} />
                                </button>
                              )}
                            </div>
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

      {/* Reassign Organizer Dialog */}
      <Dialog
        open={reassignModalOpen}
        onClose={() => setReassignModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#1F2937",
            border: "1px solid #374151",
            color: "#F8FAFC",
            borderRadius: "1.25rem",
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#F8FAFC", display: "flex", alignItems: "center", gap: 1 }}>
          <UserCheck size={20} className="text-[#00ADB5]" />
          <span>Reassign Event Organizer</span>
        </DialogTitle>
        <DialogContent className="space-y-4 pt-2">
          <p className="text-xs text-[#94A3B8]">
            Transfer ownership of <strong className="text-[#F8FAFC]">{selectedEvent?.title}</strong> to a different organizer.
          </p>

          <FormControl fullWidth size="small">
            <InputLabel id="select-org-label">New Organizer</InputLabel>
            <Select
              labelId="select-org-label"
              value={selectedOrganizerId}
              label="New Organizer"
              onChange={(e) => setSelectedOrganizerId(e.target.value)}
            >
              {organizers.map((o) => (
                <MenuItem key={o._id} value={o._id}>
                  {o.fullName} ({o.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setReassignModalOpen(false)} sx={{ color: "#94A3B8", textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={reassigning || !selectedOrganizerId}
            onClick={handleReassign}
            sx={{
              backgroundColor: "#00ADB5",
              color: "#111827",
              "&:hover": { backgroundColor: "#00949B" },
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "10px",
            }}
          >
            {reassigning ? "Transferring..." : "Reassign Ownership"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Event Dialog */}
      <Dialog
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#1F2937",
            border: "1px solid #374151",
            color: "#F8FAFC",
            borderRadius: "1.25rem",
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#FBBF24", display: "flex", alignItems: "center", gap: 1 }}>
          <AlertTriangle size={20} />
          <span>Cancel Event</span>
        </DialogTitle>
        <DialogContent>
          <p className="text-sm text-[#CBD5E1] mb-2">
            Are you sure you want to administratively cancel <strong className="text-[#F8FAFC]">{selectedEvent?.title}</strong>?
          </p>
          <p className="text-xs text-[#94A3B8]">
            The event status will be changed to "cancelled", stopping any new registrations.
          </p>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCancelModalOpen(false)} sx={{ color: "#94A3B8", textTransform: "none" }}>
            Keep Active
          </Button>
          <Button
            variant="contained"
            disabled={cancelling}
            onClick={handleCancelEvent}
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