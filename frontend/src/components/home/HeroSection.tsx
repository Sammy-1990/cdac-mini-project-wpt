import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Ticket, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [cityTerm, setCityTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append("search", searchTerm.trim());
    if (cityTerm.trim()) params.append("city", cityTerm.trim());
    navigate(`/events?${params.toString()}`);
  };

  const handleCreateEvent = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role === "organizer" || user?.role === "admin") {
      navigate("/organizer/events/create");
    } else {
      navigate("/events");
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#15152B] via-[#2A1B5E] to-[#15152B] text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      {/* Decorative background glow & abstract concert lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#6C4CE8]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#FF8066]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text & Search Area */}
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-purple-200">
              <Sparkles size={14} className="text-[#FF8066]" />
              <span>Event Discovery & Ticket Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans'] leading-tight">
              Discover What's <br />
              <span className="bg-gradient-to-r from-white via-purple-100 to-[#FF8066] bg-clip-text text-transparent">
                Happening Around You
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#A0A0BA] max-w-2xl leading-relaxed">
              From unforgettable concerts to beautiful celebrations, discover and manage every event with EventFlow.
            </p>

            {/* Floating Search Bar */}
            <form
              onSubmit={handleSearch}
              className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-xl shadow-black/20 flex flex-col sm:flex-row gap-2 max-w-2xl border border-white/20"
            >
              {/* Event Name Input */}
              <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-gray-50/80 rounded-xl">
                <Search size={18} className="text-[#6C4CE8] shrink-0" />
                <input
                  type="text"
                  placeholder="Event name (e.g. Music Concert)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#202033] placeholder-[#77778A] focus:outline-none"
                />
              </div>

              {/* City Input */}
              <div className="sm:w-56 flex items-center gap-2.5 px-3 py-2 bg-gray-50/80 rounded-xl">
                <MapPin size={18} className="text-[#6C4CE8] shrink-0" />
                <input
                  type="text"
                  placeholder="City (e.g. Jaipur)"
                  value={cityTerm}
                  onChange={(e) => setCityTerm(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#202033] placeholder-[#77778A] focus:outline-none"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="px-6 py-3 bg-[#6C4CE8] hover:bg-[#5032C4] text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-purple-600/30 shrink-0"
              >
                Search
              </button>
            </form>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate("/events")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#6C4CE8] hover:bg-[#5032C4] text-white text-sm font-semibold rounded-xl shadow-lg shadow-purple-600/25 transition-all hover:scale-105"
              >
                <span>Explore Events</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={handleCreateEvent}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-xl border border-white/20 transition-all hover:scale-105"
              >
                <span>Create Your Event</span>
              </button>
            </div>
          </div>

          {/* Right Decorative Ticket Graphic */}
          <div className="lg:col-span-4 hidden lg:flex justify-center items-center">
            <div className="relative">
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#6C4CE8] to-[#FF8066] rounded-3xl blur-2xl opacity-40 animate-pulse" />

              {/* Decorative Ticket Card */}
              <div className="relative w-72 bg-gradient-to-b from-[#2B1B54] to-[#1B113B] p-6 rounded-3xl border border-purple-400/30 shadow-2xl space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-purple-400/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#6C4CE8] flex items-center justify-center">
                      <Ticket size={18} className="text-white" />
                    </div>
                    <span className="font-bold text-sm text-white">EventFlow Pass</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    VERIFIED
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-purple-300">UPCOMING FEATURED</span>
                  <h4 className="font-bold text-lg text-white">Annual Music Concert</h4>
                  <p className="text-xs text-[#A0A0BA]">City Convention Hall, Jaipur</p>
                </div>

                <div className="pt-2 flex justify-between items-center text-xs text-purple-200">
                  <span>Fast QR Check-in</span>
                  <span className="font-mono font-bold text-[#FF8066]">★ LIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
