import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Search, Menu, X, Ticket, Mail, PlusCircle, LayoutDashboard, LogOut } from "lucide-react";
import { Menu as MuiMenu, MenuItem, Avatar, IconButton } from "@mui/material";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "organizer") return "/organizer/dashboard";
    if (user.role === "admin") return "/admin/dashboard";
    return "/guest/dashboard";
  };

  return (
    <header className="sticky top-0 z-50 bg-[#111827]/95 backdrop-blur-md border-b border-[#374151] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo (Icon + Text) */}
          <Link to="/home" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00ADB5] to-[#38BDF8] flex items-center justify-center shadow-md shadow-[#00ADB5]/20 group-hover:scale-105 transition-transform text-[#111827]">
              <Ticket size={20} className="stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-[#F8FAFC] font-['Plus_Jakarta_Sans']">
                Event<span className="text-[#00ADB5]">Flow</span>
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/home"
              className={`text-sm font-semibold transition-colors ${
                isActive("/home") || isActive("/")
                  ? "text-[#00ADB5]"
                  : "text-[#CBD5E1] hover:text-[#00ADB5]"
              }`}
            >
              Home
            </Link>
            <Link
              to="/events"
              className={`text-sm font-semibold transition-colors ${
                isActive("/events")
                  ? "text-[#00ADB5]"
                  : "text-[#CBD5E1] hover:text-[#00ADB5]"
              }`}
            >
              Explore Events
            </Link>
            <Link
              to="/about"
              className={`text-sm font-semibold transition-colors ${
                isActive("/about")
                  ? "text-[#00ADB5]"
                  : "text-[#CBD5E1] hover:text-[#00ADB5]"
              }`}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className={`text-sm font-semibold transition-colors ${
                isActive("/contact")
                  ? "text-[#00ADB5]"
                  : "text-[#CBD5E1] hover:text-[#00ADB5]"
              }`}
            >
              Contact Us
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search Icon */}
            <button
              onClick={() => navigate("/events")}
              className="p-2 text-[#94A3B8] hover:text-[#00ADB5] hover:bg-[#1F2937] rounded-full transition-colors"
              title="Search Events"
            >
              <Search size={19} />
            </button>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                {user.role === "organizer" && (
                  <Link
                    to="/organizer/events/create"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#00ADB5] bg-[#00ADB5]/10 hover:bg-[#00ADB5]/20 rounded-lg transition-colors border border-[#00ADB5]/30"
                  >
                    <PlusCircle size={15} />
                    <span>Create Event</span>
                  </Link>
                )}

                {/* User Avatar with Profile Dropdown */}
                <button
                  onClick={handleMenuOpen}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#1F2937] transition-colors"
                >
                  <Avatar
                    sx={{
                      width: 34,
                      height: 34,
                      bgcolor: "#00ADB5",
                      color: "#111827",
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                    }}
                  >
                    {user.fullName.charAt(0).toUpperCase()}
                  </Avatar>
                  <span className="text-sm font-medium text-[#F8FAFC] max-w-[120px] truncate">
                    {user.fullName}
                  </span>
                </button>

                <MuiMenu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 190,
                      borderRadius: "12px",
                      backgroundColor: "#293548",
                      border: "1px solid #374151",
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)",
                    },
                  }}
                >
                  <div className="px-4 py-2 border-b border-[#374151]">
                    <p className="text-xs font-medium text-[#94A3B8]">Signed in as</p>
                    <p className="text-sm font-bold text-[#F8FAFC] truncate">{user.fullName}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#00ADB5]/20 text-[#00ADB5] uppercase tracking-wider border border-[#00ADB5]/30">
                      {user.role}
                    </span>
                  </div>

                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      navigate(getDashboardPath());
                    }}
                    className="text-sm py-2 gap-2 text-[#CBD5E1] hover:text-[#F8FAFC]"
                  >
                    <LayoutDashboard size={16} className="text-[#00ADB5]" />
                    <span>Dashboard</span>
                  </MenuItem>

                  {user.role === "guest" && (
                    <>
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          navigate("/guest/tickets");
                        }}
                        className="text-sm py-2 gap-2 text-[#CBD5E1] hover:text-[#F8FAFC]"
                      >
                        <Ticket size={16} className="text-[#00ADB5]" />
                        <span>My Tickets</span>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          navigate("/guest/invitations");
                        }}
                        className="text-sm py-2 gap-2 text-[#CBD5E1] hover:text-[#F8FAFC]"
                      >
                        <Mail size={16} className="text-[#00ADB5]" />
                        <span>My Invitations</span>
                      </MenuItem>
                    </>
                  )}

                  <MenuItem onClick={handleLogout} className="text-sm py-2 gap-2 text-[#F87171] hover:bg-red-950/20">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </MenuItem>
                </MuiMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-[#CBD5E1] hover:text-[#00ADB5] transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-[#111827] bg-[#00ADB5] hover:bg-[#00949B] rounded-xl shadow-md transition-all font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <IconButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)} sx={{ color: "#CBD5E1" }}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </IconButton>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111827] border-b border-[#374151] px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/home"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-[#CBD5E1] hover:text-[#00ADB5] hover:bg-[#1F2937]"
          >
            Home
          </Link>
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-[#CBD5E1] hover:text-[#00ADB5] hover:bg-[#1F2937]"
          >
            Explore Events
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-[#CBD5E1] hover:text-[#00ADB5] hover:bg-[#1F2937]"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-[#CBD5E1] hover:text-[#00ADB5] hover:bg-[#1F2937]"
          >
            Contact Us
          </Link>

          <div className="pt-4 border-t border-[#374151] space-y-2">
            {isAuthenticated && user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 text-sm font-semibold text-[#111827] bg-[#00ADB5] rounded-xl"
                >
                  Open Dashboard ({user.role})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-center px-4 py-2 text-sm font-semibold text-[#F87171] bg-red-950/40 border border-red-900/50 rounded-xl"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 text-sm font-semibold text-[#F8FAFC] bg-[#1F2937] border border-[#374151] rounded-xl"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 text-sm font-semibold text-[#111827] bg-[#00ADB5] rounded-xl"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
