import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { Ticket, Mail, Lock, Eye, EyeOff, Calendar, AlertCircle } from "lucide-react";
import { Alert, CircularProgress } from "@mui/material";

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await authService.login({ email, password });

      if (response && response.token && response.user) {
        login(response.token, response.user);

        // Redirect according to user role or previous protected page
        if (from) {
          navigate(from, { replace: true });
        } else if (response.user.role === "organizer") {
          navigate("/organizer/dashboard", { replace: true });
        } else if (response.user.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/guest/dashboard", { replace: true });
        }
      } else {
        setError("Invalid response received from server.");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8FC] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Decorative Illustration (Desktop Only) */}
        <div className="hidden md:flex md:col-span-5 flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-[#5032C4] to-[#6C4CE8] rounded-3xl text-white shadow-xl shadow-purple-600/20 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center">
            <Calendar size={36} className="text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold font-['Plus_Jakarta_Sans']">Welcome Back!</h3>
            <p className="text-sm text-purple-100 mt-2 leading-relaxed">
              Login to view your registrations, access verified QR tickets, and manage your events seamlessly.
            </p>
          </div>
          <div className="pt-4 border-t border-white/10 w-full flex justify-around text-xs text-purple-200">
            <span>✨ Fast QR Entry</span>
            <span>🔒 Secure JWT</span>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="md:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#E9E8F0] shadow-sm">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <Link to="/home" className="inline-flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#6C4CE8] flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                <Ticket size={20} />
              </div>
              <span className="font-extrabold text-2xl text-[#202033] font-['Plus_Jakarta_Sans']">
                Event<span className="text-[#6C4CE8]">Flow</span>
              </span>
            </Link>
            <h2 className="text-xl sm:text-2xl font-bold text-[#202033] font-['Plus_Jakarta_Sans']">
              Login to EventFlow
            </h2>
            <p className="text-xs sm:text-sm text-[#77778A] mt-1">
              Access your events, tickets, invitations, and more.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <Alert severity="error" className="mb-6 rounded-xl text-xs" icon={<AlertCircle size={18} />}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-[#202033] mb-1.5">
                Email Address
              </label>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-[#6C4CE8] focus-within:bg-white transition-all">
                <Mail size={18} className="text-[#77778A]" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#202033] focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-[#202033] mb-1.5">
                Password
              </label>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-[#6C4CE8] focus-within:bg-white transition-all">
                <Lock size={18} className="text-[#77778A]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#202033] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#77778A] hover:text-[#202033]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Note */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-[#77778A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#6C4CE8] focus:ring-[#6C4CE8]"
                />
                <span>Remember me</span>
              </label>
              <span className="text-[#6C4CE8] hover:underline cursor-pointer">
                Forgot Password?
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#6C4CE8] hover:bg-[#5032C4] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <CircularProgress size={18} sx={{ color: "white" }} />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center text-xs text-[#77778A]">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-[#6C4CE8] hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
