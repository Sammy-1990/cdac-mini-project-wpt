import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Building2,
  Ticket,
  AlertCircle,
  QrCode,
} from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
} from "@mui/material";
import { eventService } from "../../services/eventService";
import { participantService } from "../../services/participantService";
import { EventItem } from "../../types/event.types";
import { useAuth } from "../../context/AuthContext";
import { Loader } from "../../components/common/Loader";
import { formatCategory, getCategoryBadgeStyle, getCategoryGradient, getStatusBadgeStyle } from "../../utils/formatUtils";
import { formatISTDate } from "../../utils/dateUtils";
import { getImageUrl } from "../../utils/imageUrl";

export const EventDetails: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Registration Modal State
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [participantName, setParticipantName] = useState("");
  const [participantEmail, setParticipantEmail] = useState("");
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  // Success Ticket Modal State
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState<{
    participant: any;
    qrCode?: string;
  } | null>(null);

  useEffect(() => {
    if (user) {
      setParticipantName(user.fullName || "");
      setParticipantEmail(user.email || "");
    }
  }, [user]);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      try {
        setLoading(true);
        setError(null);
        const data = await eventService.getEventById(eventId);
        if (data && data.event) {
          setEvent(data.event);
        } else {
          setError("Event not found.");
        }
      } catch (err: any) {
        console.error("Error fetching event details:", err);
        setError(err.response?.data?.message || "Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/events/${eventId}` } });
      return;
    }
    setRegisterError(null);
    setRegisterModalOpen(true);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId || !participantName.trim() || !participantEmail.trim()) {
      setRegisterError("Please fill out all registration fields.");
      return;
    }

    try {
      setRegistering(true);
      setRegisterError(null);

      const response = await participantService.registerForEvent(eventId, {
        name: participantName.trim(),
        email: participantEmail.trim(),
      });

      if (response && response.success) {
        setRegisterModalOpen(false);
        setGeneratedTicket({
          participant: response.participant,
          qrCode: response.qrCode,
        });
        setTicketModalOpen(true);
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setRegisterError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111827] py-20">
        <Loader message="Loading event details..." />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#111827] py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-[#1F2937] p-8 rounded-2xl border border-[#374151] shadow-lg">
          <AlertCircle size={48} className="text-[#F87171] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#F8FAFC] mb-2">Event Unavailable</h2>
          <p className="text-sm text-[#CBD5E1] mb-6">{error || "The requested event could not be found."}</p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00ADB5] text-[#111827] rounded-xl text-sm font-semibold hover:bg-[#00949B]"
          >
            <ArrowLeft size={16} /> Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const categoryStyle = getCategoryBadgeStyle(event.category);
  const gradientClass = getCategoryGradient(event.category);
  const statusStyle = getStatusBadgeStyle(event.status);

  const startDisplay = event.startDateIST || formatISTDate(event.startDate);
  const endDisplay = event.endDateIST || formatISTDate(event.endDate);

  return (
    <div className="min-h-screen bg-[#111827] text-[#F8FAFC] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#94A3B8] hover:text-[#00ADB5] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Events</span>
          </Link>
        </div>

        {/* Large Stage / Event Banner */}
        <div
          className={`relative h-64 sm:h-80 md:h-96 w-full rounded-3xl bg-gradient-to-r ${gradientClass} flex items-center justify-center overflow-hidden shadow-2xl mb-8 p-6 text-white border border-[#374151]`}
        >
          {(event.eventImage || event.coverImage) && (
            <img
              src={getImageUrl(event.eventImage || event.coverImage)}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          )}

          {/* Dark Overlay gradient for readable title */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/60 to-transparent" />

          <div className="text-center z-10 max-w-2xl space-y-3">
            <span className={`inline-block text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-[#111827]/90 text-[#00ADB5] border border-[#374151] shadow-md backdrop-blur-sm`}>
              {formatCategory(event.category)}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans'] text-[#F8FAFC] drop-shadow">
              {event.title}
            </h1>
            <p className="text-sm sm:text-base text-[#CBD5E1] flex items-center justify-center gap-2">
              <MapPin size={16} className="text-[#00ADB5]" /> {event.venue}, {event.city}
            </p>
          </div>
        </div>

        {/* Event Quick Info Bar */}
        <div className="bg-[#293548] rounded-2xl border border-[#374151] p-6 shadow-lg mb-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1F2937] border border-[#374151] text-[#00ADB5] flex items-center justify-center shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-xs text-[#94A3B8] font-medium">Date & Time (IST)</p>
              <p className="text-sm font-bold text-[#F8FAFC] mt-0.5">{startDisplay}</p>
              <p className="text-xs text-[#94A3B8]">to {endDisplay}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1F2937] border border-[#374151] text-[#00ADB5] flex items-center justify-center shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-xs text-[#94A3B8] font-medium">Venue & City</p>
              <p className="text-sm font-bold text-[#F8FAFC] mt-0.5">{event.venue}</p>
              <p className="text-xs text-[#94A3B8] truncate">{event.address}, {event.city}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1F2937] border border-[#374151] text-[#00ADB5] flex items-center justify-center shrink-0">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs text-[#94A3B8] font-medium">Capacity</p>
              <p className="text-sm font-bold text-[#F8FAFC] mt-0.5">{event.capacity} Attendees</p>
              <p className="text-xs text-[#22C55E] font-semibold">Open for entry</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1F2937] border border-[#374151] text-[#00ADB5] flex items-center justify-center shrink-0">
              <Building2 size={20} />
            </div>
            <div>
              <p className="text-xs text-[#94A3B8] font-medium">Status & Type</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${statusStyle.bg}`}>
                  {event.status.toUpperCase()}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#1F2937] text-[#CBD5E1] border border-[#374151]">
                  {event.eventType}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Description & Specifications */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-[#293548] rounded-2xl border border-[#374151] p-6 sm:p-8 shadow-md">
              <h2 className="text-xl font-bold text-[#F8FAFC] mb-4 font-['Plus_Jakarta_Sans']">
                About This Event
              </h2>
              <p className="text-[#CBD5E1] leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {event.description || "No detailed description provided for this event."}
              </p>
            </div>

            {/* Information Grid Table */}
            <div className="bg-[#293548] rounded-2xl border border-[#374151] p-6 sm:p-8 shadow-md">
              <h2 className="text-xl font-bold text-[#F8FAFC] mb-4 font-['Plus_Jakarta_Sans']">
                Event Information
              </h2>
              <div className="divide-y divide-[#374151] text-sm">
                <div className="py-3 flex justify-between">
                  <span className="text-[#94A3B8]">Category</span>
                  <span className="font-semibold text-[#00ADB5]">{formatCategory(event.category)}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-[#94A3B8]">Event Type</span>
                  <span className="font-semibold text-[#F8FAFC] capitalize">{event.eventType}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-[#94A3B8]">Venue</span>
                  <span className="font-semibold text-[#F8FAFC]">{event.venue}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-[#94A3B8]">Address</span>
                  <span className="font-semibold text-[#F8FAFC]">{event.address}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-[#94A3B8]">City</span>
                  <span className="font-semibold text-[#F8FAFC]">{event.city}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-[#94A3B8]">Maximum Capacity</span>
                  <span className="font-semibold text-[#F8FAFC]">{event.capacity} persons</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Card */}
          <div className="lg:col-span-1">
            <div className="bg-[#293548] rounded-2xl border border-[#374151] p-6 shadow-lg sticky top-24 space-y-6">
              <div className="text-center pb-4 border-b border-[#374151]">
                <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">PUBLIC ADMISSION</span>
                <p className="text-2xl font-extrabold text-[#00ADB5] mt-1 font-['Plus_Jakarta_Sans']">Free Entry</p>
                <p className="text-xs text-[#22C55E] font-medium mt-0.5">Verified Digital Ticket</p>
              </div>

              {event.eventType === "public" && event.status === "published" ? (
                <div className="space-y-4">
                  <button
                    onClick={handleRegisterClick}
                    className="w-full py-3.5 bg-[#00ADB5] hover:bg-[#00949B] text-[#111827] font-bold text-base rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Ticket size={20} />
                    <span>Register Now</span>
                  </button>
                  <p className="text-xs text-center text-[#94A3B8]">
                    This is a public event. Register to get your verified QR ticket instantly.
                  </p>
                </div>
              ) : event.eventType === "private" ? (
                <div className="p-4 bg-[#1F2937] border border-[#374151] rounded-xl text-center space-y-2">
                  <p className="text-sm font-bold text-[#A78BFA]">Private Event</p>
                  <p className="text-xs text-[#94A3B8]">
                    Admission is strictly by private invitation link from the host.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-[#1F2937] border border-[#374151] rounded-xl text-center">
                  <p className="text-sm font-bold text-[#94A3B8]">Event {event.status}</p>
                  <p className="text-xs text-[#94A3B8] mt-1">Registrations are not active.</p>
                </div>
              )}

              {/* Decorative Ticket Pass Illustration */}
              <div className="p-4 rounded-xl bg-[#1F2937] border border-[#374151] flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#00ADB5]/15 border border-[#00ADB5]/30 text-[#00ADB5] flex items-center justify-center shrink-0">
                  <QrCode size={20} />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-[#F8FAFC]">Instant QR Pass</p>
                  <p className="text-[#94A3B8]">Scan at venue entrance for fast check-in.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal Dialog (MUI) */}
      <Dialog
        open={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", p: 1, backgroundColor: "#1F2937", border: "1px solid #374151", color: "#F8FAFC" } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#F8FAFC", fontFamily: "Plus Jakarta Sans" }}>
          Register for {event.title}
        </DialogTitle>
        <form onSubmit={handleRegisterSubmit}>
          <DialogContent className="space-y-4">
            {registerError && <Alert severity="error">{registerError}</Alert>}
            <p className="text-xs text-[#94A3B8]">
              Confirm your attendee details below. Your QR ticket will be issued upon registration.
            </p>
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              required
              size="small"
              InputLabelProps={{ style: { color: "#94A3B8" } }}
              InputProps={{ style: { color: "#F8FAFC", backgroundColor: "#293548" } }}
            />
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              value={participantEmail}
              onChange={(e) => setParticipantEmail(e.target.value)}
              required
              size="small"
              InputLabelProps={{ style: { color: "#94A3B8" } }}
              InputProps={{ style: { color: "#F8FAFC", backgroundColor: "#293548" } }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setRegisterModalOpen(false)} sx={{ color: "#94A3B8", textTransform: "none" }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={registering}
              sx={{
                bgcolor: "#00ADB5",
                color: "#111827",
                "&:hover": { bgcolor: "#00949B" },
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "10px",
                px: 3,
              }}
            >
              {registering ? "Confirming..." : "Confirm Registration"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Success Ticket Modal Dialog (MUI) */}
      <Dialog
        open={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px", p: 2, textAlign: "center", backgroundColor: "#1F2937", border: "1px solid #374151", color: "#F8FAFC" } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#22C55E", pb: 1, fontFamily: "Plus Jakarta Sans" }}>
          Registration Confirmed! 🎉
        </DialogTitle>
        <DialogContent className="space-y-4">
          <p className="text-xs text-[#CBD5E1]">
            You have successfully registered for <strong>{event.title}</strong>. Here is your entry pass:
          </p>

          {/* Returned QR Code Image from Backend */}
          {generatedTicket?.qrCode && (
            <div className="p-4 bg-white border border-gray-300 rounded-2xl inline-block shadow-lg">
              <img
                src={generatedTicket.qrCode}
                alt="EventFlow QR Ticket"
                className="w-48 h-48 mx-auto object-contain"
              />
              <p className="text-[11px] font-mono text-gray-700 mt-2">
                Token: {generatedTicket.participant?.qrToken?.substring(0, 16)}...
              </p>
            </div>
          )}

          <div className="bg-[#293548] border border-[#374151] p-3 rounded-xl text-left text-xs text-[#F8FAFC] space-y-1">
            <p><strong className="text-[#94A3B8]">Attendee:</strong> {generatedTicket?.participant?.name}</p>
            <p><strong className="text-[#94A3B8]">Venue:</strong> {event.venue}, {event.city}</p>
            <p><strong className="text-[#94A3B8]">Date:</strong> {startDisplay}</p>
          </div>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 1 }}>
          <Button
            variant="contained"
            onClick={() => {
              setTicketModalOpen(false);
              navigate("/guest/tickets");
            }}
            sx={{
              bgcolor: "#00ADB5",
              color: "#111827",
              "&:hover": { bgcolor: "#00949B" },
              textTransform: "none",
              borderRadius: "10px",
              fontWeight: 600,
              px: 4,
            }}
          >
            Go to My Tickets
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
