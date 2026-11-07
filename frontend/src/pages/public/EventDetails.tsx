import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Building2,
  CheckCircle,
  Ticket,
  AlertCircle,
  QrCode,
  Share2,
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
      <div className="min-h-screen bg-[#F8F8FC] py-20">
        <Loader message="Loading event details..." />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#F8F8FC] py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <AlertCircle size={48} className="text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#202033] mb-2">Event Unavailable</h2>
          <p className="text-sm text-[#77778A] mb-6">{error || "The requested event could not be found."}</p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6C4CE8] text-white rounded-xl text-sm font-semibold hover:bg-[#5032C4]"
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
    <div className="min-h-screen bg-[#F8F8FC] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#77778A] hover:text-[#6C4CE8] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Events</span>
          </Link>
        </div>

        {/* Large Stage / Event Banner (Local Uploaded Image or Category Gradient) */}
        <div
          className={`relative h-64 sm:h-80 md:h-96 w-full rounded-3xl bg-gradient-to-r ${gradientClass} flex items-center justify-center overflow-hidden shadow-lg mb-8 p-6 text-white`}
        >
          {(event.eventImage || event.coverImage) && (
            <img
              src={getImageUrl(event.eventImage || event.coverImage)}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                // Hide broken image so gradient shows through
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          )}

          {/* Dark Overlay gradient for readable title */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

          {/* Abstract light beam effects */}
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] opacity-20 [background-size:24px_24px]" />

          <div className="text-center z-10 max-w-2xl space-y-3">
            <span className={`inline-block text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-white ${categoryStyle.text} shadow-md`}>
              {formatCategory(event.category)}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans'] drop-shadow">
              {event.title}
            </h1>
            <p className="text-sm sm:text-base text-purple-100 flex items-center justify-center gap-2">
              <MapPin size={16} /> {event.venue}, {event.city}
            </p>
          </div>
        </div>

        {/* Event Quick Info Bar */}
        <div className="bg-white rounded-2xl border border-[#E9E8F0] p-6 shadow-sm mb-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6C4CE8] flex items-center justify-center shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-xs text-[#77778A] font-medium">Date & Time (IST)</p>
              <p className="text-sm font-bold text-[#202033] mt-0.5">{startDisplay}</p>
              <p className="text-xs text-[#77778A]">to {endDisplay}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6C4CE8] flex items-center justify-center shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-xs text-[#77778A] font-medium">Venue & City</p>
              <p className="text-sm font-bold text-[#202033] mt-0.5">{event.venue}</p>
              <p className="text-xs text-[#77778A]">{event.address}, {event.city}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6C4CE8] flex items-center justify-center shrink-0">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs text-[#77778A] font-medium">Capacity</p>
              <p className="text-sm font-bold text-[#202033] mt-0.5">{event.capacity} Attendees</p>
              <p className="text-xs text-emerald-600 font-semibold">Open for entry</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6C4CE8] flex items-center justify-center shrink-0">
              <Building2 size={20} />
            </div>
            <div>
              <p className="text-xs text-[#77778A] font-medium">Status & Type</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${statusStyle.bg}`}>
                  {event.status.toUpperCase()}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
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
            <div className="bg-white rounded-2xl border border-[#E9E8F0] p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#202033] mb-4 font-['Plus_Jakarta_Sans']">
                About This Event
              </h2>
              <p className="text-[#202033]/80 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {event.description || "No detailed description provided for this event."}
              </p>
            </div>

            {/* Information Grid Table */}
            <div className="bg-white rounded-2xl border border-[#E9E8F0] p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#202033] mb-4 font-['Plus_Jakarta_Sans']">
                Event Information
              </h2>
              <div className="divide-y divide-gray-100 text-sm">
                <div className="py-3 flex justify-between">
                  <span className="text-[#77778A]">Category</span>
                  <span className="font-semibold text-[#202033]">{formatCategory(event.category)}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-[#77778A]">Event Type</span>
                  <span className="font-semibold text-[#202033] capitalize">{event.eventType}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-[#77778A]">Venue</span>
                  <span className="font-semibold text-[#202033]">{event.venue}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-[#77778A]">Address</span>
                  <span className="font-semibold text-[#202033]">{event.address}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-[#77778A]">City</span>
                  <span className="font-semibold text-[#202033]">{event.city}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-[#77778A]">Maximum Capacity</span>
                  <span className="font-semibold text-[#202033]">{event.capacity} persons</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#E9E8F0] p-6 shadow-sm sticky top-24 space-y-6">
              <div className="text-center pb-4 border-b border-gray-100">
                <span className="text-xs font-semibold text-[#77778A]">PUBLIC ADMISSION</span>
                <p className="text-2xl font-extrabold text-[#6C4CE8] mt-1">Free Entry</p>
                <p className="text-xs text-emerald-600 font-medium mt-0.5">Verified Digital Ticket</p>
              </div>

              {event.eventType === "public" && event.status === "published" ? (
                <div className="space-y-4">
                  <button
                    onClick={handleRegisterClick}
                    className="w-full py-3.5 bg-[#6C4CE8] hover:bg-[#5032C4] text-white font-bold text-base rounded-xl transition-all shadow-md shadow-purple-600/25 flex items-center justify-center gap-2"
                  >
                    <Ticket size={20} />
                    <span>Register Now</span>
                  </button>
                  <p className="text-xs text-center text-[#77778A]">
                    This is a public event. Register to get your verified QR ticket instantly.
                  </p>
                </div>
              ) : event.eventType === "private" ? (
                <div className="p-4 bg-purple-50 rounded-xl text-center space-y-2">
                  <p className="text-sm font-bold text-[#6C4CE8]">Private Event</p>
                  <p className="text-xs text-[#77778A]">
                    Admission is strictly by private invitation link from the host.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <p className="text-sm font-bold text-gray-500">Event {event.status}</p>
                  <p className="text-xs text-gray-400 mt-1">Registrations are not active.</p>
                </div>
              )}

              {/* Decorative Ticket Pass Illustration */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#6C4CE8] text-white flex items-center justify-center shrink-0">
                  <QrCode size={20} />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-[#202033]">Instant QR Pass</p>
                  <p className="text-[#77778A]">Scan at venue entrance for fast check-in.</p>
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
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#202033", fontFamily: "Plus Jakarta Sans" }}>
          Register for {event.title}
        </DialogTitle>
        <form onSubmit={handleRegisterSubmit}>
          <DialogContent className="space-y-4">
            {registerError && <Alert severity="error">{registerError}</Alert>}
            <p className="text-xs text-[#77778A]">
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
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setRegisterModalOpen(false)} sx={{ color: "#77778A", textTransform: "none" }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={registering}
              sx={{
                bgcolor: "#6C4CE8",
                "&:hover": { bgcolor: "#5032C4" },
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
        PaperProps={{ sx: { borderRadius: "20px", p: 2, textAlign: "center" } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#16A36A", pb: 1, fontFamily: "Plus Jakarta Sans" }}>
          Registration Confirmed! 🎉
        </DialogTitle>
        <DialogContent className="space-y-4">
          <p className="text-xs text-[#77778A]">
            You have successfully registered for <strong>{event.title}</strong>. Here is your entry pass:
          </p>

          {/* Returned QR Code Image from Backend */}
          {generatedTicket?.qrCode && (
            <div className="p-4 bg-white border border-gray-200 rounded-2xl inline-block shadow-sm">
              <img
                src={generatedTicket.qrCode}
                alt="EventFlow QR Ticket"
                className="w-48 h-48 mx-auto object-contain"
              />
              <p className="text-[11px] font-mono text-[#77778A] mt-2">
                Token: {generatedTicket.participant?.qrToken?.substring(0, 16)}...
              </p>
            </div>
          )}

          <div className="bg-purple-50 p-3 rounded-xl text-left text-xs text-[#202033] space-y-1">
            <p><strong>Attendee:</strong> {generatedTicket?.participant?.name}</p>
            <p><strong>Venue:</strong> {event.venue}, {event.city}</p>
            <p><strong>Date:</strong> {startDisplay}</p>
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
              bgcolor: "#6C4CE8",
              "&:hover": { bgcolor: "#5032C4" },
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
