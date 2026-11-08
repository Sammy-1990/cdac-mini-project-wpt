import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardSidebar } from "../../components/dashboard/DashboardSidebar";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { dashboardService } from "../../services/dashboardService";
import { AdminDashboardData } from "../../types/dashboard.types";
import {
  Users,
  Shield,
  Calendar,
  Lock,
  ExternalLink,
} from "lucide-react";
import { Loader } from "../../components/common/Loader";

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getAdminDashboard();
        if (res && res.dashboard) {
          setData(res.dashboard);
        }
      } catch (err) {
        console.error("Error fetching admin dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-[#111827] flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title="Platform Administration Dashboard"
          subtitle="System-wide metrics and user event records"
          actionText="View Private Events"
          actionPath="/admin/private-events"
          actionIcon={<Lock size={16} />}
        />

        <main className="p-6 sm:p-8 flex-1 space-y-8">
          {loading ? (
            <Loader message="Loading platform metrics..." />
          ) : !data ? (
            <div className="p-8 bg-[#1F2937] rounded-2xl border border-[#374151] text-[#94A3B8] text-center">
              Unable to load admin dashboard data.
            </div>
          ) : (
            <>
              {/* Administrative Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  to="/admin/users"
                  className="p-4 bg-[#293548] rounded-2xl border border-[#374151] shadow-md hover:border-[#00ADB5] hover:shadow-lg transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00ADB5]/10 text-[#00ADB5] border border-[#00ADB5]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#F8FAFC]">Manage Users</p>
                      <p className="text-[11px] text-[#94A3B8]">Promote guests & view accounts</p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-[#94A3B8] group-hover:text-[#00ADB5] transition-colors" />
                </Link>

                <Link
                  to="/admin/events"
                  className="p-4 bg-[#293548] rounded-2xl border border-[#374151] shadow-md hover:border-[#00ADB5] hover:shadow-lg transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#F8FAFC]">Manage Events</p>
                      <p className="text-[11px] text-[#94A3B8]">Moderate & reassign organizers</p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-[#94A3B8] group-hover:text-[#00ADB5] transition-colors" />
                </Link>

                <Link
                  to="/admin/private-events"
                  className="p-4 bg-[#293548] rounded-2xl border border-[#374151] shadow-md hover:border-[#00ADB5] hover:shadow-lg transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F87171]/10 text-[#F87171] border border-[#F87171]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Lock size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#F8FAFC]">Private Events</p>
                      <p className="text-[11px] text-[#94A3B8]">View all private celebrations</p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-[#94A3B8] group-hover:text-[#00ADB5] transition-colors" />
                </Link>
              </div>

              {/* Stat Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                <div className="bg-[#293548] p-5 rounded-2xl border border-[#374151] shadow-md">
                  <p className="text-xs text-[#94A3B8] font-semibold">Total Users</p>
                  <p className="text-2xl font-extrabold text-[#00ADB5] mt-1 font-['Plus_Jakarta_Sans']">
                    {data.totalUsers}
                  </p>
                </div>

                <div className="bg-[#293548] p-5 rounded-2xl border border-[#374151] shadow-md">
                  <p className="text-xs text-[#94A3B8] font-semibold">Organizers</p>
                  <p className="text-2xl font-extrabold text-[#A78BFA] mt-1 font-['Plus_Jakarta_Sans']">
                    {data.organizers ? data.organizers.length : 0}
                  </p>
                </div>

                <div className="bg-[#293548] p-5 rounded-2xl border border-[#374151] shadow-md">
                  <p className="text-xs text-[#94A3B8] font-semibold">Guests</p>
                  <p className="text-2xl font-extrabold text-[#38BDF8] mt-1 font-['Plus_Jakarta_Sans']">
                    {data.guests ? data.guests.length : 0}
                  </p>
                </div>

                <div className="bg-[#293548] p-5 rounded-2xl border border-[#374151] shadow-md">
                  <p className="text-xs text-[#94A3B8] font-semibold">Total Events</p>
                  <p className="text-2xl font-extrabold text-[#F8FAFC] mt-1 font-['Plus_Jakarta_Sans']">
                    {data.totalEvents}
                  </p>
                </div>

                <div className="bg-[#293548] p-5 rounded-2xl border border-[#374151] shadow-md">
                  <p className="text-xs text-[#94A3B8] font-semibold">Public Events</p>
                  <p className="text-2xl font-extrabold text-[#22C55E] mt-1 font-['Plus_Jakarta_Sans']">
                    {data.publicEvents ? data.publicEvents.length : 0}
                  </p>
                </div>

                <div className="bg-[#293548] p-5 rounded-2xl border border-[#374151] shadow-md">
                  <p className="text-xs text-[#94A3B8] font-semibold">Private Events</p>
                  <p className="text-2xl font-extrabold text-[#FBBF24] mt-1 font-['Plus_Jakarta_Sans']">
                    {data.privateEvents ? data.privateEvents.length : 0}
                  </p>
                </div>

                <div className="bg-[#293548] p-5 rounded-2xl border border-[#374151] shadow-md">
                  <p className="text-xs text-[#94A3B8] font-semibold">Registrations</p>
                  <p className="text-2xl font-extrabold text-[#00ADB5] mt-1 font-['Plus_Jakarta_Sans']">
                    {data.totalRegistrations}
                  </p>
                </div>

                <div className="bg-[#293548] p-5 rounded-2xl border border-[#374151] shadow-md">
                  <p className="text-xs text-[#94A3B8] font-semibold">Attendance</p>
                  <p className="text-2xl font-extrabold text-[#38BDF8] mt-1 font-['Plus_Jakarta_Sans']">
                    {data.totalAttendanceRecords}
                  </p>
                </div>
              </div>

              {/* Two Summary Columns: Organizers & Guests */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Organizers Roster */}
                <div className="bg-[#293548] p-6 rounded-2xl border border-[#374151] shadow-md">
                  <h3 className="text-base font-bold text-[#F8FAFC] mb-4 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                    <Shield size={18} className="text-[#00ADB5]" />
                    <span>Registered Organizers ({data.organizers ? data.organizers.length : 0})</span>
                  </h3>
                  <div className="divide-y divide-[#374151] text-xs">
                    {data.organizers && data.organizers.length > 0 ? (
                      data.organizers.map((org) => (
                        <div key={org._id} className="py-2.5 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-[#F8FAFC]">{org.fullName}</p>
                            <p className="text-[#94A3B8]">{org.email}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-[#00ADB5]/10 text-[#00ADB5] border border-[#00ADB5]/20 font-bold text-[10px]">
                            ORGANIZER
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[#94A3B8] py-3">No organizers registered.</p>
                    )}
                  </div>
                </div>

                {/* Guest Users Roster */}
                <div className="bg-[#293548] p-6 rounded-2xl border border-[#374151] shadow-md">
                  <h3 className="text-base font-bold text-[#F8FAFC] mb-4 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                    <Users size={18} className="text-[#38BDF8]" />
                    <span>Registered Guests ({data.guests ? data.guests.length : 0})</span>
                  </h3>
                  <div className="divide-y divide-[#374151] text-xs">
                    {data.guests && data.guests.length > 0 ? (
                      data.guests.slice(0, 8).map((g) => (
                        <div key={g._id} className="py-2.5 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-[#F8FAFC]">{g.fullName}</p>
                            <p className="text-[#94A3B8]">{g.email}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-[#1F2937] text-[#CBD5E1] border border-[#374151] font-bold text-[10px]">
                            GUEST
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[#94A3B8] py-3">No guests registered.</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};