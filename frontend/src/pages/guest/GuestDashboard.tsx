import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardSidebar } from "../../components/dashboard/DashboardSidebar";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { useAuth } from "../../context/AuthContext";
import { participantService } from "../../services/participantService";
import { ParticipantItem } from "../../types/participant.types";
import { Ticket, Mail, Calendar, ArrowRight } from "lucide-react";
import { Loader } from "../../components/common/Loader";
import { getStatusBadgeStyle } from "../../utils/formatUtils";

export const GuestDashboard: React.FC = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<ParticipantItem[]>([]);
  const [invitations, setInvitations] = useState<ParticipantItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGuestData = async () => {
      try {
        setLoading(true);
        const [regRes, invRes] = await Promise.all([
          participantService.getMyRegistrations(),
          participantService.getMyInvitations(),
        ]);

        if (regRes && regRes.registrations) setRegistrations(regRes.registrations);
        if (invRes && invRes.invitations) setInvitations(invRes.invitations);
      } catch (err) {
        console.error("Error loading guest dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadGuestData();
  }, []);

  return (
    <div className="min-h-screen bg-[#1F2937] text-[#F8FAFC] flex">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title="Guest Dashboard"
          subtitle={`Welcome, ${user?.fullName || "Guest"} 👋 Here's a summary of your event activities.`}
        />

        <main className="p-6 sm:p-8 space-y-8 flex-1">
          {loading ? (
            <Loader message="Loading your dashboard activities..." />
          ) : (
            <>
              {/* Stat Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
                {/* Registrations Stat Card */}
                <div className="bg-[#293548] p-6 rounded-2xl border border-[#374151] shadow-lg flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#1F2937] border border-[#374151] text-[#00ADB5] flex items-center justify-center shrink-0">
                    <Calendar size={28} />
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-[#F8FAFC] font-['Plus_Jakarta_Sans']">
                      {registrations.length}
                    </p>
                    <p className="text-xs font-semibold text-[#94A3B8] mt-0.5">
                      Event Registrations
                    </p>
                  </div>
                </div>

                {/* Invitations Stat Card */}
                <div className="bg-[#293548] p-6 rounded-2xl border border-[#374151] shadow-lg flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#1F2937] border border-[#374151] text-[#A78BFA] flex items-center justify-center shrink-0">
                    <Mail size={28} />
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-[#F8FAFC] font-['Plus_Jakarta_Sans']">
                      {invitations.length}
                    </p>
                    <p className="text-xs font-semibold text-[#94A3B8] mt-0.5">
                      Private Invitations
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-bold text-[#F8FAFC] mb-4 font-['Plus_Jakarta_Sans']">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                  <Link
                    to="/guest/tickets"
                    className="p-5 bg-[#293548] rounded-2xl border border-[#374151] shadow-md hover:border-[#00ADB5]/50 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#1F2937] border border-[#374151] text-[#00ADB5] flex items-center justify-center">
                        <Ticket size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#F8FAFC]">View My Tickets</p>
                        <p className="text-xs text-[#94A3B8]">Access verified QR entry passes</p>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-[#94A3B8] group-hover:text-[#00ADB5] group-hover:translate-x-1 transition-all" />
                  </Link>

                  <Link
                    to="/guest/invitations"
                    className="p-5 bg-[#293548] rounded-2xl border border-[#374151] shadow-md hover:border-[#A78BFA]/50 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#1F2937] border border-[#374151] text-[#A78BFA] flex items-center justify-center">
                        <Mail size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#F8FAFC]">View Invitations</p>
                        <p className="text-xs text-[#94A3B8]">Respond to private events</p>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-[#94A3B8] group-hover:text-[#A78BFA] group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
              </div>

              {/* Recent Registrations Table */}
              <div className="bg-[#293548] rounded-2xl border border-[#374151] p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base text-[#F8FAFC] font-['Plus_Jakarta_Sans']">
                    Recent Registrations
                  </h3>
                  <Link to="/guest/registrations" className="text-xs font-bold text-[#00ADB5] hover:underline">
                    View All ({registrations.length})
                  </Link>
                </div>

                {registrations.length === 0 ? (
                  <p className="text-xs text-[#94A3B8] py-4 text-center">
                    You have not registered for any events yet.{" "}
                    <Link to="/events" className="text-[#00ADB5] font-semibold underline">
                      Explore events now
                    </Link>
                  </p>
                ) : (
                  <div className="divide-y divide-[#374151] text-xs">
                    {registrations.slice(0, 3).map((item) => {
                      const ev: any = item.eventId || {};
                      const statusStyle = getStatusBadgeStyle(item.status);
                      return (
                        <div key={item._id} className="py-3 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-[#F8FAFC] text-sm">{ev.title || "Event"}</p>
                            <p className="text-[#94A3B8] mt-0.5">{ev.venue}, {ev.city}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-1 rounded-full font-bold border ${statusStyle.bg}`}>
                              {item.status.toUpperCase()}
                            </span>
                            <Link
                              to="/guest/tickets"
                              className="px-3 py-1 bg-[#00ADB5]/15 border border-[#00ADB5]/30 text-[#00ADB5] rounded-lg font-bold hover:bg-[#00ADB5]/25 transition-colors"
                            >
                              Ticket
                            </Link>
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
