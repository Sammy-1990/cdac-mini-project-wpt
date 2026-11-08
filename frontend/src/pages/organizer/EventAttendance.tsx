import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardSidebar } from "../../components/dashboard/DashboardSidebar";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { attendanceService } from "../../services/attendanceService";
import { eventService } from "../../services/eventService";
import { AttendanceItem } from "../../types/attendance.types";
import { EventItem } from "../../types/event.types";
import {
  QrCode,
  CheckCircle2,
  UserCheck,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { Alert, CircularProgress } from "@mui/material";
import { Loader } from "../../components/common/Loader";
import { formatCategory } from "../../utils/formatUtils";

export const EventAttendance: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedEventId = searchParams.get("eventId") || "";

  const [myEvents, setMyEvents] = useState<EventItem[]>([]);
  const [activeEventId, setActiveEventId] = useState<string>(selectedEventId);

  // Check-In Form State
  const [qrToken, setQrToken] = useState("");
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkInResult, setCheckInResult] = useState<{
    success: boolean;
    message: string;
    attendance?: AttendanceItem;
  } | null>(null);

  // Attendance Records State
  const [attendanceList, setAttendanceList] = useState<AttendanceItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load organizer's events for dropdown selector
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await eventService.getMyEvents();
        if (data && data.events && data.events.length > 0) {
          setMyEvents(data.events);
          if (!activeEventId) {
            setActiveEventId(data.events[0]._id);
            setSearchParams({ eventId: data.events[0]._id });
          }
        }
      } catch (err) {
        console.error("Error loading events for attendance:", err);
      }
    };

    loadEvents();
  }, []);

  const fetchAttendance = async (eventId: string) => {
    if (!eventId) return;
    try {
      setLoading(true);
      const res = await attendanceService.getEventAttendance(eventId);
      if (res && res.attendance) {
        setAttendanceList(res.attendance);
      }
    } catch (err) {
      console.error("Error fetching attendance list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeEventId) {
      fetchAttendance(activeEventId);
    }
  }, [activeEventId]);

  const handleEventChange = (newId: string) => {
    setActiveEventId(newId);
    setSearchParams({ eventId: newId });
    setCheckInResult(null);
  };

  const handleCheckInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrToken.trim() || !activeEventId) return;

    try {
      setCheckingIn(true);
      setCheckInResult(null);

      const response = await attendanceService.checkIn({
        qrToken: qrToken.trim(),
        eventId: activeEventId,
      });

      if (response && response.success) {
        setCheckInResult({
          success: true,
          message: response.message || "Attendee checked in successfully!",
          attendance: response.attendance,
        });
        setQrToken("");
        fetchAttendance(activeEventId);
      }
    } catch (err: any) {
      console.error("Check-in error:", err);
      setCheckInResult({
        success: false,
        message: err.response?.data?.message || "Check-in failed. Invalid QR Token or duplicate check-in.",
      });
    } finally {
      setCheckingIn(false);
    }
  };

  const currentEvent = myEvents.find((e) => e._id === activeEventId);

  return (
    <div className="min-h-screen bg-[#111827] flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title="QR Attendance & Check-In Desk"
          subtitle="Verify entry tickets and log Indian Standard Time check-ins"
        />

        <main className="p-6 sm:p-8 flex-1 space-y-8">
          {/* Top Event Selector */}
          <div className="bg-[#1F2937] p-6 rounded-2xl border border-[#374151] shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <label className="block text-xs font-bold text-[#CBD5E1] mb-1.5">
                Select Active Event for Check-In Desk
              </label>
              <select
                value={activeEventId}
                onChange={(e) => handleEventChange(e.target.value)}
                className="px-4 py-2.5 bg-[#111827] border border-[#374151] rounded-xl text-sm font-bold text-[#F8FAFC] focus:border-[#00ADB5] focus:outline-none transition-all cursor-pointer min-w-[280px]"
              >
                {myEvents.map((ev) => (
                  <option key={ev._id} value={ev._id} className="bg-[#1F2937] text-[#F8FAFC]">
                    {ev.title} ({formatCategory(ev.category)})
                  </option>
                ))}
              </select>
            </div>

            {currentEvent && (
              <div className="text-right text-xs text-[#94A3B8]">
                <p className="font-bold text-[#F8FAFC] text-sm">{currentEvent.venue}, {currentEvent.city}</p>
                <p>Total Checked In: <span className="text-[#00ADB5] font-bold">{attendanceList.length}</span> / {currentEvent.capacity} Capacity</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: QR Terminal Input */}
            <div className="lg:col-span-5 bg-[#293548] p-6 sm:p-8 rounded-3xl border border-[#374151] shadow-lg space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#00ADB5]/10 text-[#00ADB5] border border-[#00ADB5]/20 flex items-center justify-center">
                  <QrCode size={26} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#F8FAFC] font-['Plus_Jakarta_Sans']">
                    Gate Check-In Terminal
                  </h3>
                  <p className="text-xs text-[#94A3B8]">
                    Enter or paste the attendee's 32-character QR Token
                  </p>
                </div>
              </div>

              {/* Feedback Alert */}
              {checkInResult && (
                <Alert
                  severity={checkInResult.success ? "success" : "error"}
                  className="rounded-xl text-xs"
                  onClose={() => setCheckInResult(null)}
                >
                  <p className="font-bold">{checkInResult.message}</p>
                  {checkInResult.attendance && (
                    <div className="mt-1 text-[11px] space-y-0.5">
                      <p>Guest: <strong>{checkInResult.attendance.name || checkInResult.attendance.participantName}</strong></p>
                      <p>Time (IST): <strong>{checkInResult.attendance.checkedInAtIST}</strong></p>
                    </div>
                  )}
                </Alert>
              )}

              {/* Form */}
              <form onSubmit={handleCheckInSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                    Participant QR Token *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Paste 32-character token (e.g. 63efad810f9b...)"
                    value={qrToken}
                    onChange={(e) => setQrToken(e.target.value)}
                    className="w-full px-4 py-3 bg-[#111827] border border-[#374151] rounded-xl text-sm font-mono text-[#F8FAFC] placeholder-[#94A3B8] focus:border-[#00ADB5] focus:outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={checkingIn || !qrToken.trim()}
                  className="w-full py-3.5 bg-[#00ADB5] hover:bg-[#00949B] text-[#111827] font-bold text-sm rounded-xl transition-all shadow-md shadow-[#00ADB5]/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {checkingIn ? (
                    <>
                      <CircularProgress size={16} sx={{ color: "#111827" }} />
                      <span>Validating Token...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      <span>Verify & Check-In Attendee</span>
                    </>
                  )}
                </button>
              </form>

              {/* Security Hint */}
              <div className="p-4 bg-[#111827] rounded-2xl border border-[#374151] text-xs text-[#CBD5E1] space-y-1">
                <p className="font-bold text-[#00ADB5] flex items-center gap-1.5">
                  <CheckCircle2 size={15} /> Exact IST Time Logging
                </p>
                <p className="text-[#94A3B8] text-[11px] leading-relaxed">
                  The backend validates cryptographic tokens, rejects duplicate check-ins, and records timestamps in Indian Standard Time (IST).
                </p>
              </div>
            </div>

            {/* Right Column: Verified Attendance Log */}
            <div className="lg:col-span-7 bg-[#293548] p-6 sm:p-8 rounded-3xl border border-[#374151] shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#F8FAFC] font-['Plus_Jakarta_Sans']">
                      Verified Attendee List
                    </h3>
                    <p className="text-xs text-[#94A3B8]">
                      Guests currently checked in at the venue
                    </p>
                  </div>
                  <button
                    onClick={() => fetchAttendance(activeEventId)}
                    className="p-2 text-[#94A3B8] hover:text-[#00ADB5] rounded-xl hover:bg-[#1F2937] transition-colors"
                    title="Refresh List"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>

                {loading ? (
                  <Loader message="Loading attendance records..." />
                ) : attendanceList.length === 0 ? (
                  <div className="text-center py-12 text-[#94A3B8] text-xs">
                    <UserCheck size={36} className="mx-auto text-[#374151] mb-2" />
                    <p className="font-bold text-sm text-[#F8FAFC]">No Check-Ins Yet</p>
                    <p className="mt-1">Attendees who enter via QR check-in will appear here in real time.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#374151] text-[#94A3B8] font-bold uppercase tracking-wider text-[11px]">
                          <th className="pb-3">Attendee</th>
                          <th className="pb-3">Type</th>
                          <th className="pb-3">Check-In Time (IST)</th>
                          <th className="pb-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#374151]">
                        {attendanceList.map((att) => (
                          <tr key={att._id} className="hover:bg-[#1F2937]/50 transition-colors">
                            <td className="py-3 font-bold text-[#F8FAFC]">
                              <p>{att.name || att.participantName || "Guest"}</p>
                              <p className="text-[11px] text-[#94A3B8] font-normal">{att.participantEmail}</p>
                            </td>
                            <td className="py-3 capitalize text-[#CBD5E1]">
                              {att.participationType || "registration"}
                            </td>
                            <td className="py-3 font-mono text-[11px] text-[#00ADB5]">
                              {att.checkedInAtIST || att.checkedInAt}
                            </td>
                            <td className="py-3 text-right">
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold text-[10px]">
                                CHECKED IN
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};