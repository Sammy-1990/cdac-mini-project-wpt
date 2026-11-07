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
  Shield,
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
    <aside className="w-64 bg-[#15152B] text-white flex flex-col justify-between shrink-0 min-h-screen border-r border-[#242442]">
      {/* Top Brand & Nav */}
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-[#242442]">
          <Link to="/home" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5032C4] to-[#6C4CE8] flex items-center justify-center text-white shadow-md">
              <Ticket size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight font-['Plus_Jakarta_Sans']">
                Event<span className="text-[#6C4CE8]">Flow</span>
              </span>
              <span className="text-[10px] text-purple-300 uppercase tracking-widest font-semibold">
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive("/guest/dashboard")
                    ? "bg-[#6C4CE8] text-white shadow-md shadow-purple-600/30"
                    : "text-[#A0A0BA] hover:bg-[#20203C] hover:text-white"
                }`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/guest/registrations"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive("/guest/registrations")
                    ? "bg-[#6C4CE8] text-white shadow-md shadow-purple-600/30"
                    : "text-[#A0A0BA] hover:bg-[#20203C] hover:text-white"
                }`}
              >
                <Calendar size={18} />
                <span>My Registrations</span>
              </Link>

              <Link
                to="/guest/invitations"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive("/guest/invitations")
                    ? "bg-[#6C4CE8] text-white shadow-md shadow-purple-600/30"
                    : "text-[#A0A0BA] hover:bg-[#20203C] hover:text-white"
                }`}
              >
                <Mail size={18} />
                <span>My Invitations</span>
              </Link>

              <Link
                to="/guest/tickets"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive("/guest/tickets")
                    ? "bg-[#6C4CE8] text-white shadow-md shadow-purple-600/30"
                    : "text-[#A0A0BA] hover:bg-[#20203C] hover:text-white"
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive("/organizer/dashboard")
                    ? "bg-[#6C4CE8] text-white shadow-md shadow-purple-600/30"
                    : "text-[#A0A0BA] hover:bg-[#20203C] hover:text-white"
                }`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/organizer/events"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive("/organizer/events")
                    ? "bg-[#6C4CE8] text-white shadow-md shadow-purple-600/30"
                    : "text-[#A0A0BA] hover:bg-[#20203C] hover:text-white"
                }`}
              >
                <Calendar size={18} />
                <span>My Events</span>
              </Link>

              <Link
                to="/organizer/events/create"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive("/organizer/events/create")
                    ? "bg-[#6C4CE8] text-white shadow-md shadow-purple-600/30"
                    : "text-[#A0A0BA] hover:bg-[#20203C] hover:text-white"
                }`}
              >
                <PlusCircle size={18} />
                <span>Create Event</span>
              </Link>

              <Link
                to="/organizer/events"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  location.pathname.includes("/participants")
                    ? "bg-[#6C4CE8] text-white shadow-md shadow-purple-600/30"
                    : "text-[#A0A0BA] hover:bg-[#20203C] hover:text-white"
                }`}
              >
                <Users size={18} />
                <span>Participants</span>
              </Link>

              <Link
                to="/organizer/attendance"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive("/organizer/attendance")
                    ? "bg-[#6C4CE8] text-white shadow-md shadow-purple-600/30"
                    : "text-[#A0A0BA] hover:bg-[#20203C] hover:text-white"
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive("/admin/dashboard")
                    ? "bg-[#6C4CE8] text-white shadow-md shadow-purple-600/30"
                    : "text-[#A0A0BA] hover:bg-[#20203C] hover:text-white"
                }`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/admin/users"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive("/admin/users")
                    ? "bg-[#6C4CE8] text-white shadow-md shadow-purple-600/30"
                    : "text-[#A0A0BA] hover:bg-[#20203C] hover:text-white"
                }`}
              >
                <Users size={18} />
                <span>Manage Users</span>
              </Link>

              <Link
                to="/admin/events"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive("/admin/events")
                    ? "bg-[#6C4CE8] text-white shadow-md shadow-purple-600/30"
                    : "text-[#A0A0BA] hover:bg-[#20203C] hover:text-white"
                }`}
              >
                <Calendar size={18} />
                <span>Manage Events</span>
              </Link>

              <Link
                to="/admin/private-events"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive("/admin/private-events")
                    ? "bg-[#6C4CE8] text-white shadow-md shadow-purple-600/30"
                    : "text-[#A0A0BA] hover:bg-[#20203C] hover:text-white"
                }`}
              >
                <Lock size={18} />
                <span>Private Events</span>
              </Link>
            </>
          )}

          {/* Public Discovery Link */}
          <div className="pt-4 mt-4 border-t border-[#242442]">
            <Link
              to="/events"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#A0A0BA] hover:bg-[#20203C] hover:text-white transition-colors"
            >
              <Compass size={18} />
              <span>Explore Public Events</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Bottom User Info & Logout */}
      <div className="p-4 border-t border-[#242442] space-y-3">
        <div className="px-3 py-2 bg-[#1B1B36] rounded-xl flex items-center justify-between">
          <div className="truncate mr-2">
            <p className="text-xs font-bold text-white truncate">{user?.fullName}</p>
            <p className="text-[11px] text-purple-300 capitalize">{user?.role}</p>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" title="Online" />
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
