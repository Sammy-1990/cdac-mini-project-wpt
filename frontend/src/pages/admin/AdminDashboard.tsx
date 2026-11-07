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
  Ticket,
  CheckCircle2,
  Building2,
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
    <div className="min-h-screen bg-[#F8F8FC] flex">
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
            <div className="p-8 bg-white rounded-2xl border text-[#77778A] text-center">
              Unable to load admin dashboard data.
            </div>
          ) : (
            <>
              {/* Administrative Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  to="/admin/users"
                  className="p-4 bg-white rounded-2xl border border-[#E9E8F0] shadow-sm hover:border-[#6C4CE8] hover:shadow transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6C4CE8] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#202033]">Manage Users</p>
                      <p className="text-[11px] text-[#77778A]">Promote guests & view accounts</p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-gray-400 group-hover:text-[#6C4CE8] transition-colors" />
                </Link>

                <Link
                  to="/admin/events"
                  className="p-4 bg-white rounded-2xl border border-[#E9E8F0] shadow-sm hover:border-[#6C4CE8] hover:shadow transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#202033]">Manage Events</p>
                      <p className="text-[11px] text-[#77778A]">Moderate & reassign organizers</p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-gray-400 group-hover:text-[#6C4CE8] transition-colors" />
                </Link>

                <Link
                  to="/admin/private-events"
                  className="p-4 bg-white rounded-2xl border border-[#E9E8F0] shadow-sm hover:border-[#6C4CE8] hover:shadow transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Lock size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#202033]">Private Events</p>
                      <p className="text-[11px] text-[#77778A]">View all private celebrations</p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-gray-400 group-hover:text-[#6C4CE8] transition-colors" />
                </Link>
              </div>

              {/* Stat Metric Cards (Matching Admin Mockup) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#E9E8F0] shadow-sm">
                  <p className="text-xs text-[#77778A] font-semibold">Total Users</p>
                  <p className="text-2xl font-extrabold text-[#202033] mt-1 font-['Plus_Jakarta_Sans']">
                    {data.totalUsers}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E9E8F0] shadow-sm">
                  <p className="text-xs text-[#77778A] font-semibold">Organizers</p>
                  <p className="text-2xl font-extrabold text-[#6C4CE8] mt-1 font-['Plus_Jakarta_Sans']">
                    {data.organizers ? data.organizers.length : 0}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E9E8F0] shadow-sm">
                  <p className="text-xs text-[#77778A] font-semibold">Guests</p>
                  <p className="text-2xl font-extrabold text-[#202033] mt-1 font-['Plus_Jakarta_Sans']">
                    {data.guests ? data.guests.length : 0}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E9E8F0] shadow-sm">
                  <p className="text-xs text-[#77778A] font-semibold">Total Events</p>
                  <p className="text-2xl font-extrabold text-[#202033] mt-1 font-['Plus_Jakarta_Sans']">
                    {data.totalEvents}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E9E8F0] shadow-sm">
                  <p className="text-xs text-[#77778A] font-semibold">Public Events</p>
                  <p className="text-2xl font-extrabold text-blue-600 mt-1 font-['Plus_Jakarta_Sans']">
                    {data.publicEvents ? data.publicEvents.length : 0}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E9E8F0] shadow-sm">
                  <p className="text-xs text-[#77778A] font-semibold">Private Events</p>
                  <p className="text-2xl font-extrabold text-rose-500 mt-1 font-['Plus_Jakarta_Sans']">
                    {data.privateEvents ? data.privateEvents.length : 0}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E9E8F0] shadow-sm">
                  <p className="text-xs text-[#77778A] font-semibold">Registrations</p>
                  <p className="text-2xl font-extrabold text-[#6C4CE8] mt-1 font-['Plus_Jakarta_Sans']">
                    {data.totalRegistrations}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E9E8F0] shadow-sm">
                  <p className="text-xs text-[#77778A] font-semibold">Attendance</p>
                  <p className="text-2xl font-extrabold text-emerald-600 mt-1 font-['Plus_Jakarta_Sans']">
                    {data.totalAttendanceRecords}
                  </p>
                </div>
              </div>

              {/* Two Summary Columns: Organizers & Guests */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Organizers Roster */}
                <div className="bg-white p-6 rounded-2xl border border-[#E9E8F0] shadow-sm">
                  <h3 className="text-base font-bold text-[#202033] mb-4 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                    <Shield size={18} className="text-[#6C4CE8]" />
                    <span>Registered Organizers ({data.organizers ? data.organizers.length : 0})</span>
                  </h3>
                  <div className="divide-y divide-gray-100 text-xs">
                    {data.organizers && data.organizers.length > 0 ? (
                      data.organizers.map((org) => (
                        <div key={org._id} className="py-2.5 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-[#202033]">{org.fullName}</p>
                            <p className="text-[#77778A]">{org.email}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-purple-50 text-[#6C4CE8] font-bold text-[10px]">
                            ORGANIZER
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[#77778A] py-3">No organizers registered.</p>
                    )}
                  </div>
                </div>

                {/* Guest Users Roster */}
                <div className="bg-white p-6 rounded-2xl border border-[#E9E8F0] shadow-sm">
                  <h3 className="text-base font-bold text-[#202033] mb-4 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                    <Users size={18} className="text-blue-500" />
                    <span>Registered Guests ({data.guests ? data.guests.length : 0})</span>
                  </h3>
                  <div className="divide-y divide-gray-100 text-xs">
                    {data.guests && data.guests.length > 0 ? (
                      data.guests.slice(0, 8).map((g) => (
                        <div key={g._id} className="py-2.5 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-[#202033]">{g.fullName}</p>
                            <p className="text-[#77778A]">{g.email}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-bold text-[10px]">
                            GUEST
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[#77778A] py-3">No guests registered.</p>
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
