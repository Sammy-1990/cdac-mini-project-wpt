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
    <div className="min-h-screen bg-[#111827] text-[#F8FAFC] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Decorative Illustration (Desktop Only) */}
        <div className="hidden md:flex md:col-span-5 flex-col items-center justify-center text-center p-8 bg-[#293548] border border-[#374151] rounded-3xl text-[#F8FAFC] shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#1F2937] border border-[#374151] flex items-center justify-center text-[#00ADB5] shadow-inner">
            <Sparkles size={36} />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold font-['Plus_Jakarta_Sans'] text-[#F8FAFC]">Join EventFlow</h3>
            <p className="text-sm text-[#CBD5E1] mt-2 leading-relaxed">
              Create your account to discover public events, receive digital invitations, and manage entries effortlessly.
            </p>
          </div>
          <div className="pt-4 border-t border-[#374151] w-full flex justify-around text-xs text-[#94A3B8]">
            <span className="text-[#00ADB5]">🎫 Instant Tickets</span>
            <span className="text-[#38BDF8]">📱 QR Entry</span>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="md:col-span-7 bg-[#1F2937] p-8 sm:p-10 rounded-3xl border border-[#374151] shadow-2xl">
          {/* Brand Header */}
          <div className="text-center mb-6">
            <Link to="/home" className="inline-flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00ADB5] to-[#38BDF8] flex items-center justify-center text-[#111827] shadow-md font-bold">
                <Ticket size={20} className="stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-2xl text-[#F8FAFC] font-['Plus_Jakarta_Sans']">
                Event<span className="text-[#00ADB5]">Flow</span>
              </span>
            </Link>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] font-['Plus_Jakarta_Sans']">
              Create Your Account
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
              Join EventFlow and start discovering exciting events.
            </p>
          </div>

          {/* Feedback Messages */}
          {error && (
            <Alert severity="error" className="mb-5 rounded-xl text-xs bg-red-950/40 border border-red-800/50 text-[#F87171]" icon={<AlertCircle size={18} />}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" className="mb-5 rounded-xl text-xs bg-emerald-950/40 border border-emerald-800/50 text-[#22C55E]" icon={<CheckCircle size={18} />}>
              {success}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                Full Name
              </label>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#293548] border border-[#374151] rounded-xl focus-within:border-[#00ADB5] transition-colors">
                <User size={18} className="text-[#94A3B8]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sameer Rangrej"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                Email Address
              </label>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#293548] border border-[#374151] rounded-xl focus-within:border-[#00ADB5] transition-colors">
                <Mail size={18} className="text-[#94A3B8]" />
                <input
                  type="email"
                  required
                  placeholder="e.g. sameer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                Password
              </label>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#293548] border border-[#374151] rounded-xl focus-within:border-[#00ADB5] transition-colors">
                <Lock size={18} className="text-[#94A3B8]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Create a password"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                Confirm Password
              </label>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#293548] border border-[#374151] rounded-xl focus-within:border-[#00ADB5] transition-colors">
                <Lock size={18} className="text-[#94A3B8]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-[#00ADB5] hover:bg-[#00949B] text-[#111827] font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <CircularProgress size={18} sx={{ color: "#111827" }} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Sign Up</span>
              )}
            </button>
          </form>

          {/* Become an Organizer Info Banner */}
          <div className="mt-5 p-3.5 bg-[#293548] border border-[#374151] rounded-2xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#00ADB5]/10 border border-[#00ADB5]/20 text-[#00ADB5] flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-[#F8FAFC]">Want to organize events? Become an Organizer</p>
              <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-relaxed">
                Sign up with your account first. To publish events and manage attendees, contact an administrator to promote your account to the Organizer role.
              </p>
            </div>
          </div>

          {/* Footer Link */}
          <div className="mt-6 text-center text-xs text-[#94A3B8]">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-[#00ADB5] hover:text-[#38BDF8] hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
