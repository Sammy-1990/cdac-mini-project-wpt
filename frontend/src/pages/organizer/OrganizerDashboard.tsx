import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardSidebar } from "../../components/dashboard/DashboardSidebar";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { dashboardService } from "../../services/dashboardService";
import { OrganizerDashboardData } from "../../types/dashboard.types";
import {
  Calendar,
  Users,
  CheckCircle2,
  Ticket,
  PlusCircle,
  QrCode,
  ArrowRight,
  Edit2,
  ExternalLink,
  MapPin,
  Clock,
  XCircle,
} from "lucide-react";
import { Loader } from "../../components/common/Loader";
import { formatCategory, getCategoryGradient, getStatusBadgeStyle } from "../../utils/formatUtils";
import { formatISTDate } from "../../utils/dateUtils";
import { getImageUrl } from "../../utils/imageUrl";

export const OrganizerDashboard: React.FC = () => {
  const [data, setData] = useState<OrganizerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getOrganizerDashboard();
        if (res && res.dashboard) {
          setData(res.dashboard);
        }
      } catch (err) {
        console.error("Error fetching organizer dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F7FC] flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title="Organizer Dashboard"
          subtitle="Welcome back! Here's an overview of your event activities."
          actionText="+ Create New Event"
          actionPath="/organizer/events/create"
          actionIcon={<PlusCircle size={16} />}
        />

        <main className="p-6 sm:p-8 space-y-8 flex-1">
          {loading ? (
            <Loader message="Loading organizer metrics..." />
          ) : !data ? (
            <div className="text-center p-8 bg-white rounded-2xl border border-gray-200 text-[#77778A]">
              Failed to load dashboard metrics.
            </div>
          ) : (
            <>
              {/* Stat Metric Cards (All 8 Key Values from Backend) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
                {/* 1. Total Events */}
                <div className="bg-white p-4.5 rounded-2xl border border-[#E9E8F0] shadow-sm">
                  <p className="text-[11px] text-[#77778A] font-semibold">Total Events</p>
                  <p className="text-2xl font-extrabold text-[#202033] mt-1 font-['Plus_Jakarta_Sans']">
                    {data.totalEvents}
                  </p>
                </div>

                {/* 2. Published */}
                <div className="bg-white p-4.5 rounded-2xl border border-[#E9E8F0] shadow-sm">
                  <p className="text-[11px] text-[#77778A] font-semibold">Published</p>
                  <p className="text-2xl font-extrabold text-emerald-600 mt-1 font-['Plus_Jakarta_Sans']">
                    {data.publishedEventsCount ?? data.publishedEvents ?? 0}
                  </p>
                </div>

                {/* 3. Draft */}
                <div className="bg-white p-4.5 rounded-2xl border border-[#E9E8F0] shadow-sm">
                  <p className="text-[11px] text-[#77778A] font-semibold">Draft</p>
                  <p className="text-2xl font-extrabold text-amber-500 mt-1 font-['Plus_Jakarta_Sans']">
                    {data.draftEventsCount ?? data.draftEvents ?? 0}
                  </p>
                </div>

                {/* 4. Cancelled */}
                <div className="bg-white p-4.5 rounded-2xl border border-[#E9E8F0] shadow-sm">
                  <p className="text-[11px] text-[#77778A] font-semibold">Cancelled</p>
                  <p className="text-2xl font-extrabold text-rose-500 mt-1 font-['Plus_Jakarta_Sans']">
                    {data.cancelledEventsCount ?? data.cancelledEvents ?? 0}
                  </p>
                </div>

                {/* 5. Total Participants */}
                <div className="bg-white p-4.5 rounded-2xl border border-[#E9E8F0] shadow-sm">
                  <p className="text-[11px] text-[#77778A] font-semibold">Participants</p>
                  <p className="text-2xl font-extrabold text-[#6C3BDB] mt-1 font-['Plus_Jakarta_Sans']">
                    {data.totalParticipants}
                  </p>
                </div>

                {/* 6. Registered Guests */}
                <div className="bg-white p-4.5 rounded-2xl border border-[#E9E8F0] shadow-sm">
                  <p className="text-[11px] text-[#77778A] font-semibold">Registered</p>
                  <p className="text-2xl font-extrabold text-[#202033] mt-1 font-['Plus_Jakarta_Sans']">
                    {data.registeredGuestsCount ?? (data.registeredGuests ? data.registeredGuests.length : 0)}
                  </p>
                </div>

                {/* 7. Accepted Invitations */}
                <div className="bg-white p-4.5 rounded-2xl border border-[#E9E8F0] shadow-sm">
                  <p className="text-[11px] text-[#77778A] font-semibold">Accepted Invites</p>
                  <p className="text-2xl font-extrabold text-purple-600 mt-1 font-['Plus_Jakarta_Sans']">
                    {data.acceptedInvitationsCount ?? (data.acceptedInvitations ? data.acceptedInvitations.length : 0)}
                  </p>
                </div>

                {/* 8. Checked-in Attendees */}
                <div className="bg-white p-4.5 rounded-2xl border border-[#E9E8F0] shadow-sm">
                  <p className="text-[11px] text-[#77778A] font-semibold">Checked In</p>
                  <p className="text-2xl font-extrabold text-emerald-600 mt-1 font-['Plus_Jakarta_Sans']">
                    {data.totalAttendeesCheckedIn}
                  </p>
                </div>
              </div>

              {/* Quick Navigation Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Link
                  to="/organizer/events/create"
                  className="p-6 bg-white rounded-2xl border border-[#E9E8F0] shadow-sm hover:shadow hover:border-[#6C3BDB]/50 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#6C3BDB] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <PlusCircle size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-base text-[#202033]">Create Event</p>
                      <p className="text-xs text-[#77778A]">Public concert or private function</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-[#77778A] group-hover:text-[#6C3BDB] group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                  to="/organizer/events"
                  className="p-6 bg-white rounded-2xl border border-[#E9E8F0] shadow-sm hover:shadow hover:border-purple-300 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-base text-[#202033]">My Events</p>
                      <p className="text-xs text-[#77778A]">Manage, edit, or cancel events</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-[#77778A] group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                  to="/organizer/attendance"
                  className="p-6 bg-white rounded-2xl border border-[#E9E8F0] shadow-sm hover:shadow hover:border-emerald-300 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <QrCode size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-base text-[#202033]">QR Attendance</p>
                      <p className="text-xs text-[#77778A]">Scan and check-in attendees</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-[#77778A] group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                </Link>
              </div>

              {/* Recent Events Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-[#202033] font-['Plus_Jakarta_Sans']">
                      Recent Events
                    </h3>
                    <p className="text-xs text-[#77778A]">Recently created events by you</p>
                  </div>
                  <Link
                    to="/organizer/events"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#6C3BDB] hover:underline"
                  >
                    <span>View All</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                {!data.events || data.events.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-[#E9E8F0] p-10 text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6C3BDB] mx-auto flex items-center justify-center">
                      <Calendar size={28} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#202033]">You haven't created any events yet.</h4>
                      <p className="text-xs text-[#77778A] mt-1 max-w-sm mx-auto">
                        Get started by organizing your first concert, festival, conference, or private celebration.
                      </p>
                    </div>
                    <Link
                      to="/organizer/events/create"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6C3BDB] hover:bg-[#5032C4] text-white text-xs font-bold rounded-xl shadow-md transition-all"
                    >
                      <PlusCircle size={16} />
                      <span>Create Your First Event</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.events.slice(0, 6).map((ev) => {
                      const statusStyle = getStatusBadgeStyle(ev.status);
                      const displayDate = ev.startDateIST || (ev.startDate ? formatISTDate(ev.startDate) : "TBA");
                      const gradientClass = getCategoryGradient(ev.category);

                      return (
                        <div
                          key={ev._id}
                          className="bg-white rounded-2xl border border-[#E9E8F0] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                        >
                          {/* Banner Image */}
                          <div className={`relative h-40 w-full bg-gradient-to-br ${gradientClass} flex items-center justify-center overflow-hidden`}>
                            {ev.eventImage ? (
                              <img
                                src={getImageUrl(ev.eventImage)}
                                alt={ev.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  (e.currentTarget as HTMLElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="text-white/20">
                                <Calendar size={48} />
                              </div>
                            )}

                            {/* Category Badge */}
                            <div className="absolute top-3 left-3 z-10">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm bg-white/95 text-[#6C3BDB] border border-white/40">
                                {formatCategory(ev.category)}
                              </span>
                            </div>

                            {/* Status Pill */}
                            <div className="absolute top-3 right-3 z-10">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-sm ${statusStyle.bg}`}>
                                {ev.status}
                              </span>
                            </div>
                          </div>

                          {/* Card Content */}
                          <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-[10px] font-semibold text-[#77778A] uppercase tracking-wider">
                                  {ev.eventType} Event
                                </span>
                              </div>
                              <h4 className="font-bold text-[#202033] text-base line-clamp-1 group-hover:text-[#6C3BDB] transition-colors">
                                {ev.title}
                              </h4>
                              <div className="space-y-1 text-xs text-[#77778A] mt-2">
                                <p className="flex items-center gap-1.5 truncate">
                                  <Clock size={13} className="text-[#6C3BDB] shrink-0" />
                                  <span>{displayDate}</span>
                                </p>
                                <p className="flex items-center gap-1.5 truncate">
                                  <MapPin size={13} className="text-[#6C3BDB] shrink-0" />
                                  <span>{ev.city || "Jaipur"}</span>
                                </p>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                              <Link
                                to={`/events/${ev._id}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-[#202033] text-xs font-semibold rounded-xl transition-colors"
                              >
                                <ExternalLink size={13} />
                                <span>View</span>
                              </Link>

                              <Link
                                to={`/organizer/events/edit/${ev._id}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-[#6C3BDB] text-xs font-bold rounded-xl transition-colors"
                              >
                                <Edit2 size={13} />
                                <span>Edit</span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};
