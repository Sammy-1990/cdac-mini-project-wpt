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
    <section className="relative overflow-hidden bg-[#111827] text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#374151]">
      {/* Subtle radial teal background glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#00ADB5]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text & Search Area */}
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1F2937] border border-[#374151] text-xs font-semibold text-[#00ADB5]">
              <Sparkles size={14} className="text-[#00ADB5]" />
              <span>Universal Event Management Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans'] leading-tight text-[#F8FAFC]">
              Discover Events. <br />
              <span className="text-[#00ADB5]">
                Create Memories.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#CBD5E1] max-w-2xl leading-relaxed">
              From live concerts and vibrant festivals to conferences and private celebrations, discover and manage every event effortlessly with EventFlow.
            </p>

            {/* Floating Search Bar */}
            <form
              onSubmit={handleSearch}
              className="bg-[#1F2937] p-2 sm:p-2.5 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-2 max-w-2xl border border-[#374151]"
            >
              {/* Event Name Input */}
              <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-[#293548] rounded-xl border border-[#374151]/50 focus-within:border-[#00ADB5] transition-colors">
                <Search size={18} className="text-[#00ADB5] shrink-0" />
                <input
                  type="text"
                  placeholder="Event name (e.g. Music Concert)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none"
                />
              </div>

              {/* City Input */}
              <div className="sm:w-56 flex items-center gap-2.5 px-3 py-2 bg-[#293548] rounded-xl border border-[#374151]/50 focus-within:border-[#00ADB5] transition-colors">
                <MapPin size={18} className="text-[#00ADB5] shrink-0" />
                <input
                  type="text"
                  placeholder="City (e.g. Jaipur)"
                  value={cityTerm}
                  onChange={(e) => setCityTerm(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="px-6 py-3 bg-[#00ADB5] hover:bg-[#00949B] text-[#111827] text-sm font-semibold rounded-xl transition-all shadow-md shrink-0"
              >
                Search
              </button>
            </form>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate("/events")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00ADB5] hover:bg-[#00949B] text-[#111827] text-sm font-semibold rounded-xl shadow-md transition-all hover:scale-105"
              >
                <span>Explore Events</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={handleCreateEvent}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#293548] hover:bg-[#374151] text-[#F8FAFC] text-sm font-semibold rounded-xl border border-[#374151] transition-all hover:scale-105"
              >
                <span>Create Your Event</span>
              </button>
            </div>
          </div>

          {/* Right Decorative Ticket Graphic */}
          <div className="lg:col-span-4 hidden lg:flex justify-center items-center">
            <div className="relative">
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-[#00ADB5]/20 rounded-3xl blur-2xl" />

              {/* Decorative Ticket Card */}
              <div className="relative w-72 bg-[#1F2937] p-6 rounded-3xl border border-[#374151] shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-[#374151] pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#00ADB5] text-[#111827] flex items-center justify-center font-bold">
                      <Ticket size={18} />
                    </div>
                    <span className="font-bold text-sm tracking-wide text-[#F8FAFC]">VIP PASS</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00ADB5]/20 text-[#00ADB5] border border-[#00ADB5]/30">
                    VERIFIED
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-[#94A3B8]">Featured Event</p>
                  <p className="font-extrabold text-lg text-[#F8FAFC] font-['Plus_Jakarta_Sans']">
                    Neon Waves Festival
                  </p>
                  <p className="text-xs text-[#CBD5E1] flex items-center gap-1.5">
                    <MapPin size={12} className="text-[#00ADB5]" />
                    Central Arena, Jaipur
                  </p>
                </div>

                {/* Perforated Divider */}
                <div className="relative flex items-center justify-between my-2">
                  <div className="w-4 h-4 rounded-full bg-[#111827] -ml-8 border-r border-[#374151]" />
                  <div className="flex-1 border-t-2 border-dashed border-[#374151] mx-2" />
                  <div className="w-4 h-4 rounded-full bg-[#111827] -mr-8 border-l border-[#374151]" />
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#94A3B8] block text-[10px]">PASS TOKEN</span>
                    <span className="font-mono font-bold text-[#F8FAFC]">#EF-2026-VIP</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#94A3B8] block text-[10px]">ACCESS</span>
                    <span className="text-[#00ADB5] font-bold">FAST QR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
