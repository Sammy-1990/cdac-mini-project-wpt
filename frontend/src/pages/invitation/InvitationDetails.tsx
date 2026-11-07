import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Check,
  X,
  Ticket,
  Sparkles,
  AlertCircle,
  Building2,
  Mail,
  UserCheck,
} from "lucide-react";
import { participantService } from "../../services/participantService";
import { ParticipantItem } from "../../types/participant.types";
import { Loader } from "../../components/common/Loader";
import { formatCategory, getCategoryGradient, getStatusBadgeStyle } from "../../utils/formatUtils";
import { formatISTDate } from "../../utils/dateUtils";
import { Alert, CircularProgress } from "@mui/material";

export const InvitationDetails: React.FC = () => {
  const { participantId } = useParams<{ participantId: string }>();

  const [invitation, setInvitation] = useState<ParticipantItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [processing, setProcessing] = useState<boolean>(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [generatedQrCode, setGeneratedQrCode] = useState<string | null>(null);

  const fetchInvitation = async () => {
    if (!participantId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await participantService.getInvitationDetails(participantId);
      if (data && data.invitation) {
        setInvitation(data.invitation);
      } else {
        setError("Invitation not found or link has expired.");
      }
    } catch (err: any) {
      console.error("Error fetching invitation:", err);
      setError(err.response?.data?.message || "Failed to load invitation.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitation();
  }, [participantId]);

  const handleAccept = async () => {
    if (!participantId) return;
    try {
      setProcessing(true);
      setError(null);

      const response = await participantService.acceptInvitation(participantId);
      if (response && response.success) {
        setActionSuccess("Invitation accepted successfully! Your QR ticket is ready below.");
        if (response.qrCode) {
          setGeneratedQrCode(response.qrCode);
        }
        // Refresh invitation state
        fetchInvitation();
      }
    } catch (err: any) {
      console.error("Accept error:", err);
      setError(err.response?.data?.message || "Failed to accept invitation.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDecline = async () => {
    if (!participantId) return;
    try {
      setProcessing(true);
      setError(null);

      const response = await participantService.declineInvitation(participantId);
      if (response && response.success) {
        setActionSuccess("Invitation declined.");
        fetchInvitation();
      }
    } catch (err: any) {
      console.error("Decline error:", err);
      setError(err.response?.data?.message || "Failed to decline invitation.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8FC] py-20">
        <Loader message="Loading your personal invitation..." />
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-[#F8F8FC] py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <AlertCircle size={48} className="text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-[#202033]">Invitation Not Found</h2>
          <p className="text-sm text-[#77778A]">{error || "This invitation link is invalid or has expired."}</p>
          <Link
            to="/home"
            className="inline-block px-5 py-2.5 bg-[#6C4CE8] text-white font-semibold rounded-xl text-sm"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const event: any = invitation.eventId || {};
  const gradientClass = getCategoryGradient(event.category || "wedding");
  const statusStyle = getStatusBadgeStyle(invitation.status);

  const startDisplay = event.startDateIST || formatISTDate(event.startDate);
  const endDisplay = event.endDateIST || formatISTDate(event.endDate);

  return (
    <div className="min-h-screen bg-[#F8F8FC] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-[#E9E8F0] shadow-xl overflow-hidden">
        {/* Top Decorative Floral / Celebration Arch Banner */}
        <div
          className={`relative h-48 w-full bg-gradient-to-r ${gradientClass} flex flex-col items-center justify-center text-white p-6 text-center`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] opacity-25 [background-size:20px_20px]" />
          <div className="z-10 space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} className="text-amber-300" />
              <span>Event Invitation</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans'] drop-shadow">
              {event.title || "Private Event"}
            </h1>
            <p className="text-xs sm:text-sm text-purple-100 font-medium">
              Category: {formatCategory(event.category || "wedding")}
            </p>
          </div>
        </div>

        {/* Invitation Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {actionSuccess && (
            <Alert severity="success" className="rounded-xl text-xs">
              {actionSuccess}
            </Alert>
          )}

          {/* Guest Greeting */}
          <div className="text-center space-y-1 pb-4 border-b border-gray-100">
            <p className="text-xs uppercase tracking-wider text-[#77778A] font-semibold">Cordially Invited</p>
            <h3 className="text-xl font-bold text-[#202033] font-['Plus_Jakarta_Sans']">
              Dear {invitation.name}
            </h3>
            <p className="text-xs text-[#77778A]">{invitation.email}</p>
          </div>

          {/* Event Quick Details */}
          <div className="bg-purple-50/60 rounded-2xl p-4 space-y-3 text-sm text-[#202033] border border-purple-100">
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-[#6C4CE8] shrink-0" />
              <div>
                <span className="font-semibold">{startDisplay}</span>
                {endDisplay && <span className="text-xs text-[#77778A] block">Ends: {endDisplay}</span>}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-[#6C4CE8] shrink-0" />
              <div>
                <span className="font-semibold">{event.venue || "Venue Provided by Host"}</span>
                <span className="text-xs text-[#77778A] block">{event.address}, {event.city}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Building2 size={18} className="text-[#6C4CE8] shrink-0" />
              <div>
                <span className="text-xs text-[#77778A]">Invitation Status: </span>
                <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusStyle.bg}`}>
                  {invitation.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Message Prompt */}
          <div className="text-center text-sm text-[#77778A] leading-relaxed">
            {invitation.status === "invited" && (
              <p>You are cordially invited to this private celebration. Please accept your invitation to generate your verified entry pass.</p>
            )}
            {invitation.status === "accepted" && (
              <p className="text-emerald-700 font-semibold">
                You have accepted this invitation! Present your verified QR pass at the entrance.
              </p>
            )}
            {invitation.status === "declined" && (
              <p className="text-rose-600 font-medium">
                You have declined this invitation. If this was a mistake, please contact the host.
              </p>
            )}
          </div>

          {/* Generated QR Pass Preview (If Accepted) */}
          {(generatedQrCode || invitation.qrToken) && invitation.status === "accepted" && (
            <div className="p-5 bg-white border border-gray-200 rounded-2xl text-center space-y-3 shadow-sm">
              <span className="text-xs font-bold text-[#6C4CE8] uppercase tracking-wider block">
                Official Entry Pass
              </span>
              {generatedQrCode ? (
                <img
                  src={generatedQrCode}
                  alt="Private Event QR Ticket"
                  className="w-48 h-48 mx-auto object-contain"
                />
              ) : (
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <Ticket size={40} className="text-[#6C4CE8] mx-auto mb-2" />
                  <p className="text-xs font-mono text-[#77778A] break-all">
                    Pass Token: {invitation.qrToken}
                  </p>
                </div>
              )}
              <p className="text-[11px] text-[#77778A]">
                Keep this pass ready on your phone for QR check-in at the gate.
              </p>
            </div>
          )}

          {/* Response Actions */}
          {invitation.status === "invited" && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                onClick={handleAccept}
                disabled={processing}
                className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {processing ? (
                  <CircularProgress size={16} sx={{ color: "white" }} />
                ) : (
                  <>
                    <Check size={18} />
                    <span>Accept Invitation</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDecline}
                disabled={processing}
                className="py-3 px-4 bg-white border border-gray-300 hover:bg-rose-50 hover:border-rose-300 text-[#77778A] hover:text-rose-600 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <X size={18} />
                <span>Decline</span>
              </button>
            </div>
          )}

          {/* Guest Ticket Link */}
          {invitation.status === "accepted" && (
            <div className="text-center pt-2">
              <Link
                to="/guest/tickets"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#6C4CE8] hover:bg-[#5032C4] text-white text-xs font-bold rounded-xl shadow-md"
              >
                <Ticket size={16} />
                <span>View All My Tickets</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
