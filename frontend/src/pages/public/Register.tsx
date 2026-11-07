import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { Ticket, User, Mail, Lock, Eye, EyeOff, Sparkles, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, CircularProgress } from "@mui/material";

export const Register: React.FC = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await authService.register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });

      if (response && response.success) {
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError(response?.message || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(err.response?.data?.message || "Failed to register. Email may already be registered.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8FC] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Decorative Illustration (Desktop Only) */}
        <div className="hidden md:flex md:col-span-5 flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-[#6C4CE8] to-[#5032C4] rounded-3xl text-white shadow-xl shadow-purple-600/20 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center">
            <Sparkles size={36} className="text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold font-['Plus_Jakarta_Sans']">Join EventFlow</h3>
            <p className="text-sm text-purple-100 mt-2 leading-relaxed">
              Create your account to discover public events, receive digital invitations, and manage entries effortlessly.
            </p>
          </div>
          <div className="pt-4 border-t border-white/10 w-full flex justify-around text-xs text-purple-200">
            <span>🎫 Instant Tickets</span>
            <span>📱 QR Entry</span>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="md:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#E9E8F0] shadow-sm">
          {/* Brand Header */}
          <div className="text-center mb-6">
            <Link to="/home" className="inline-flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#6C4CE8] flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                <Ticket size={20} />
              </div>
              <span className="font-extrabold text-2xl text-[#202033] font-['Plus_Jakarta_Sans']">
                Event<span className="text-[#6C4CE8]">Flow</span>
              </span>
            </Link>
            <h2 className="text-xl sm:text-2xl font-bold text-[#202033] font-['Plus_Jakarta_Sans']">
              Create Your Account
            </h2>
            <p className="text-xs sm:text-sm text-[#77778A] mt-1">
              Join EventFlow and start discovering exciting events.
            </p>
          </div>

          {/* Feedback Messages */}
          {error && (
            <Alert severity="error" className="mb-5 rounded-xl text-xs" icon={<AlertCircle size={18} />}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" className="mb-5 rounded-xl text-xs" icon={<CheckCircle size={18} />}>
              {success}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[#202033] mb-1">
                Full Name
              </label>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-[#6C4CE8] focus-within:bg-white transition-all">
                <User size={18} className="text-[#77778A]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sameer Rangrej"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#202033] focus:outline-none"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-[#202033] mb-1">
                Email Address
              </label>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-[#6C4CE8] focus-within:bg-white transition-all">
                <Mail size={18} className="text-[#77778A]" />
                <input
                  type="email"
                  required
                  placeholder="e.g. sameer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#202033] focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#202033] mb-1">
                Password
              </label>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-[#6C4CE8] focus-within:bg-white transition-all">
                <Lock size={18} className="text-[#77778A]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Create a password"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-[#202033] mb-1">
                Confirm Password
              </label>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-[#6C4CE8] focus-within:bg-white transition-all">
                <Lock size={18} className="text-[#77778A]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#202033] focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-[#6C4CE8] hover:bg-[#5032C4] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <CircularProgress size={18} sx={{ color: "white" }} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Sign Up</span>
              )}
            </button>
          </form>

          {/* Become an Organizer Info Banner */}
          <div className="mt-5 p-3.5 bg-purple-50/70 border border-purple-100 rounded-2xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#6C4CE8] flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-[#202033]">Want to organize events? Become an Organizer</p>
              <p className="text-[11px] text-[#77778A] mt-0.5 leading-relaxed">
                Sign up with your account first. To publish events and manage attendees, contact an administrator to promote your account to the Organizer role.
              </p>
            </div>
          </div>

          {/* Footer Link */}
          <div className="mt-6 text-center text-xs text-[#77778A]">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-[#6C4CE8] hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
