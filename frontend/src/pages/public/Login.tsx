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
    <div className="min-h-screen bg-[#111827] text-[#F8FAFC] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Decorative Illustration (Desktop Only) */}
        <div className="hidden md:flex md:col-span-5 flex-col items-center justify-center text-center p-8 bg-[#293548] border border-[#374151] rounded-3xl text-[#F8FAFC] shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#1F2937] border border-[#374151] flex items-center justify-center text-[#00ADB5] shadow-inner">
            <Calendar size={36} />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold font-['Plus_Jakarta_Sans'] text-[#F8FAFC]">Welcome Back!</h3>
            <p className="text-sm text-[#CBD5E1] mt-2 leading-relaxed">
              Login to view your registrations, access verified QR tickets, and manage your events seamlessly.
            </p>
          </div>
          <div className="pt-4 border-t border-[#374151] w-full flex justify-around text-xs text-[#94A3B8]">
            <span className="text-[#00ADB5]">✨ Fast QR Entry</span>
            <span className="text-[#38BDF8]">🔒 Secure JWT</span>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="md:col-span-7 bg-[#1F2937] p-8 sm:p-10 rounded-3xl border border-[#374151] shadow-2xl">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <Link to="/home" className="inline-flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00ADB5] to-[#38BDF8] flex items-center justify-center text-[#111827] shadow-md font-bold">
                <Ticket size={20} className="stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-2xl text-[#F8FAFC] font-['Plus_Jakarta_Sans']">
                Event<span className="text-[#00ADB5]">Flow</span>
              </span>
            </Link>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] font-['Plus_Jakarta_Sans']">
              Login to EventFlow
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
              Access your events, tickets, invitations, and more.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <Alert severity="error" className="mb-6 rounded-xl text-xs bg-red-950/40 border border-red-800/50 text-[#F87171]" icon={<AlertCircle size={18} />}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                Email Address
              </label>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#293548] border border-[#374151] rounded-xl focus-within:border-[#00ADB5] transition-colors">
                <Mail size={18} className="text-[#94A3B8]" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                Password
              </label>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#293548] border border-[#374151] rounded-xl focus-within:border-[#00ADB5] transition-colors">
                <Lock size={18} className="text-[#94A3B8]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#94A3B8] hover:text-[#00ADB5]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Note */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-[#94A3B8] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-[#293548] border-[#374151] text-[#00ADB5] focus:ring-[#00ADB5]"
                />
                <span>Remember me</span>
              </label>
              <span className="text-[#00ADB5] hover:underline cursor-pointer">
                Forgot Password?
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#00ADB5] hover:bg-[#00949B] text-[#111827] font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <CircularProgress size={18} sx={{ color: "#111827" }} />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center text-xs text-[#94A3B8]">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-[#00ADB5] hover:text-[#38BDF8] hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
