import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Search, Menu, X, User as UserIcon, LogOut, Ticket, Mail, PlusCircle, LayoutDashboard } from "lucide-react";
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E9E8F0] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo (Icon + Text) */}
          <Link to="/home" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5032C4] to-[#6C4CE8] flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Ticket size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-[#202033] font-['Plus_Jakarta_Sans']">
                Event<span className="text-[#6C4CE8]">Flow</span>
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/home"
              className={`text-sm font-semibold transition-colors ${
                isActive("/home") || isActive("/")
                  ? "text-[#6C4CE8]"
                  : "text-[#77778A] hover:text-[#202033]"
              }`}
            >
              Home
            </Link>
            <Link
              to="/events"
              className={`text-sm font-semibold transition-colors ${
                isActive("/events")
                  ? "text-[#6C4CE8]"
                  : "text-[#77778A] hover:text-[#202033]"
              }`}
            >
              Explore Events
            </Link>
            <Link
              to="/about"
              className={`text-sm font-semibold transition-colors ${
                isActive("/about")
                  ? "text-[#6C4CE8]"
                  : "text-[#77778A] hover:text-[#202033]"
              }`}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className={`text-sm font-semibold transition-colors ${
                isActive("/contact")
                  ? "text-[#6C4CE8]"
                  : "text-[#77778A] hover:text-[#202033]"
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
              className="p-2 text-[#77778A] hover:text-[#6C4CE8] hover:bg-purple-50 rounded-full transition-colors"
              title="Search Events"
            >
              <Search size={19} />
            </button>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                {user.role === "organizer" && (
                  <Link
                    to="/organizer/events/create"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#6C4CE8] bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
                  >
                    <PlusCircle size={15} />
                    <span>Create Event</span>
                  </Link>
                )}

                {/* User Avatar with Profile Dropdown */}
                <button
                  onClick={handleMenuOpen}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Avatar
                    sx={{
                      width: 34,
                      height: 34,
                      bgcolor: "#6C4CE8",
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                    }}
                  >
                    {user.fullName.charAt(0).toUpperCase()}
                  </Avatar>
                  <span className="text-sm font-medium text-[#202033] max-w-[120px] truncate">
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
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                      border: "1px solid #E9E8F0",
                    },
                  }}
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-medium text-[#77778A]">Signed in as</p>
                    <p className="text-sm font-bold text-[#202033] truncate">{user.fullName}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-[#6C4CE8] uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>

                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      navigate(getDashboardPath());
                    }}
                    className="text-sm py-2 gap-2"
                  >
                    <LayoutDashboard size={16} className="text-[#6C4CE8]" />
                    <span>Dashboard</span>
                  </MenuItem>

                  {user.role === "guest" && (
                    <>
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          navigate("/guest/tickets");
                        }}
                        className="text-sm py-2 gap-2"
                      >
                        <Ticket size={16} className="text-[#6C4CE8]" />
                        <span>My Tickets</span>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          navigate("/guest/invitations");
                        }}
                        className="text-sm py-2 gap-2"
                      >
                        <Mail size={16} className="text-[#6C4CE8]" />
                        <span>My Invitations</span>
                      </MenuItem>
                    </>
                  )}

                  <MenuItem onClick={handleLogout} className="text-sm py-2 gap-2 text-rose-600">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </MenuItem>
                </MuiMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-[#202033] hover:text-[#6C4CE8] transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#6C4CE8] hover:bg-[#5032C4] rounded-xl shadow-sm shadow-purple-500/20 transition-all hover:shadow"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <IconButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </IconButton>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E9E8F0] px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/home"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-[#202033] hover:bg-purple-50"
          >
            Home
          </Link>
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-[#202033] hover:bg-purple-50"
          >
            Explore Events
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-[#202033] hover:bg-purple-50"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-[#202033] hover:bg-purple-50"
          >
            Contact Us
          </Link>

          <div className="pt-4 border-t border-[#E9E8F0] space-y-2">
            {isAuthenticated && user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 text-sm font-semibold text-white bg-[#6C4CE8] rounded-xl"
                >
                  Open Dashboard ({user.role})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-center px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-50 rounded-xl"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 text-sm font-semibold text-[#202033] bg-gray-100 rounded-xl"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 text-sm font-semibold text-white bg-[#6C4CE8] rounded-xl"
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
