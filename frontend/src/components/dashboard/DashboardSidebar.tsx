import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Ticket,
  LayoutDashboard,
  Calendar,
  PlusCircle,
  Users,
  QrCode,
  Mail,
  LogOut,
  Compass,
  Lock,
} from "lucide-react";

export const DashboardSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const role = user?.role || "guest";

  return (
    <aside className="w-64 bg-[#111827] text-[#F8FAFC] flex flex-col justify-between shrink-0 min-h-screen border-r border-[#374151]">
      {/* Top Brand & Nav */}
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-[#374151]">
          <Link to="/home" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00ADB5] to-[#38BDF8] flex items-center justify-center text-[#111827] shadow-md font-bold">
              <Ticket size={20} className="stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-[#F8FAFC] font-['Plus_Jakarta_Sans']">
                Event<span className="text-[#00ADB5]">Flow</span>
              </span>
              <span className="text-[10px] text-[#00ADB5] uppercase tracking-widest font-semibold">
                {role} portal
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items based on Role */}
        <nav className="p-4 space-y-1.5">
          {/* Guest Links */}
          {role === "guest" && (
            <>
              <Link
                to="/guest/dashboard"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive("/guest/dashboard")
                    ? "bg-[#00ADB5] text-[#111827] font-bold shadow-md shadow-[#00ADB5]/20"
                    : "text-[#CBD5E1] hover:bg-[#293548] hover:text-[#F8FAFC]"
                }`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/guest/registrations"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive("/guest/registrations")
                    ? "bg-[#00ADB5] text-[#111827] font-bold shadow-md shadow-[#00ADB5]/20"
                    : "text-[#CBD5E1] hover:bg-[#293548] hover:text-[#F8FAFC]"
                }`}
              >
                <Calendar size={18} />
                <span>My Registrations</span>
              </Link>

              <Link
                to="/guest/invitations"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive("/guest/invitations")
                    ? "bg-[#00ADB5] text-[#111827] font-bold shadow-md shadow-[#00ADB5]/20"
                    : "text-[#CBD5E1] hover:bg-[#293548] hover:text-[#F8FAFC]"
                }`}
              >
                <Mail size={18} />
                <span>My Invitations</span>
              </Link>

              <Link
                to="/guest/tickets"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive("/guest/tickets")
                    ? "bg-[#00ADB5] text-[#111827] font-bold shadow-md shadow-[#00ADB5]/20"
                    : "text-[#CBD5E1] hover:bg-[#293548] hover:text-[#F8FAFC]"
                }`}
              >
                <Ticket size={18} />
                <span>My Tickets</span>
              </Link>
            </>
          )}

          {/* Organizer Links */}
          {role === "organizer" && (
            <>
              <Link
                to="/organizer/dashboard"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive("/organizer/dashboard")
                    ? "bg-[#00ADB5] text-[#111827] font-bold shadow-md shadow-[#00ADB5]/20"
                    : "text-[#CBD5E1] hover:bg-[#293548] hover:text-[#F8FAFC]"
                }`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/organizer/events"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive("/organizer/events") && !location.pathname.includes("/participants")
                    ? "bg-[#00ADB5] text-[#111827] font-bold shadow-md shadow-[#00ADB5]/20"
                    : "text-[#CBD5E1] hover:bg-[#293548] hover:text-[#F8FAFC]"
                }`}
              >
                <Calendar size={18} />
                <span>My Events</span>
              </Link>

              <Link
                to="/organizer/events/create"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive("/organizer/events/create")
                    ? "bg-[#00ADB5] text-[#111827] font-bold shadow-md shadow-[#00ADB5]/20"
                    : "text-[#CBD5E1] hover:bg-[#293548] hover:text-[#F8FAFC]"
                }`}
              >
                <PlusCircle size={18} />
                <span>Create Event</span>
              </Link>

              <Link
                to="/organizer/events"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  location.pathname.includes("/participants")
                    ? "bg-[#00ADB5] text-[#111827] font-bold shadow-md shadow-[#00ADB5]/20"
                    : "text-[#CBD5E1] hover:bg-[#293548] hover:text-[#F8FAFC]"
                }`}
              >
                <Users size={18} />
                <span>Participants</span>
              </Link>

              <Link
                to="/organizer/attendance"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive("/organizer/attendance")
                    ? "bg-[#00ADB5] text-[#111827] font-bold shadow-md shadow-[#00ADB5]/20"
                    : "text-[#CBD5E1] hover:bg-[#293548] hover:text-[#F8FAFC]"
                }`}
              >
                <QrCode size={18} />
                <span>Attendance</span>
              </Link>
            </>
          )}

          {/* Admin Links */}
          {role === "admin" && (
            <>
              <Link
                to="/admin/dashboard"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive("/admin/dashboard")
                    ? "bg-[#00ADB5] text-[#111827] font-bold shadow-md shadow-[#00ADB5]/20"
                    : "text-[#CBD5E1] hover:bg-[#293548] hover:text-[#F8FAFC]"
                }`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/admin/users"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive("/admin/users")
                    ? "bg-[#00ADB5] text-[#111827] font-bold shadow-md shadow-[#00ADB5]/20"
                    : "text-[#CBD5E1] hover:bg-[#293548] hover:text-[#F8FAFC]"
                }`}
              >
                <Users size={18} />
                <span>Manage Users</span>
              </Link>

              <Link
                to="/admin/events"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive("/admin/events")
                    ? "bg-[#00ADB5] text-[#111827] font-bold shadow-md shadow-[#00ADB5]/20"
                    : "text-[#CBD5E1] hover:bg-[#293548] hover:text-[#F8FAFC]"
                }`}
              >
                <Calendar size={18} />
                <span>Manage Events</span>
              </Link>

              <Link
                to="/admin/private-events"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive("/admin/private-events")
                    ? "bg-[#00ADB5] text-[#111827] font-bold shadow-md shadow-[#00ADB5]/20"
                    : "text-[#CBD5E1] hover:bg-[#293548] hover:text-[#F8FAFC]"
                }`}
              >
                <Lock size={18} />
                <span>Private Events</span>
              </Link>
            </>
          )}

          {/* Public Discovery Link */}
          <div className="pt-4 mt-4 border-t border-[#374151]">
            <Link
              to="/events"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#94A3B8] hover:bg-[#293548] hover:text-[#00ADB5] transition-colors"
            >
              <Compass size={18} />
              <span>Explore Public Events</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Bottom User Info & Logout */}
      <div className="p-4 border-t border-[#374151] space-y-3">
        <div className="px-3.5 py-2.5 bg-[#1F2937] border border-[#374151] rounded-xl flex items-center justify-between">
          <div className="truncate mr-2">
            <p className="text-xs font-bold text-[#F8FAFC] truncate">{user?.fullName}</p>
            <p className="text-[11px] text-[#00ADB5] capitalize font-medium">{user?.role}</p>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] shrink-0 shadow-sm" title="Online" />
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-[#F87171] hover:bg-red-950/30 border border-transparent hover:border-red-900/40 transition-colors"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
