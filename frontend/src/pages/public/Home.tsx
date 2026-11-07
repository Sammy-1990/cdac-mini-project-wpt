import React from "react";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "../../components/home/HeroSection";
import { CategorySection } from "../../components/home/CategorySection";
import { FeaturedEvents } from "../../components/home/FeaturedEvents";
import { Compass, CheckCircle2, Mail, QrCode, Ticket, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleCtaClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role === "organizer" || user?.role === "admin") {
      navigate("/organizer/events/create");
    } else {
      navigate("/events");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8FC]">
      {/* Hero Banner with Search */}
      <HeroSection />

      {/* Categories Grid */}
      <CategorySection />

      {/* Featured Public Events from Backend */}
      <FeaturedEvents />

      {/* Section D: Why EventFlow? (4 Feature Cards from Mockup) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202033] font-['Plus_Jakarta_Sans']">
            Why EventFlow?
          </h2>
          <p className="text-sm text-[#77778A] mt-1">A complete platform for all your event needs</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-6 bg-white rounded-2xl border border-[#E9E8F0] shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#6C4CE8] flex items-center justify-center mb-4">
              <Compass size={24} />
            </div>
            <h3 className="font-bold text-base text-[#202033] mb-2 font-['Plus_Jakarta_Sans']">
              Discover Events
            </h3>
            <p className="text-xs sm:text-sm text-[#77778A] leading-relaxed">
              Find and explore exciting concerts, tech conferences, and cultural events happening in your city.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-white rounded-2xl border border-[#E9E8F0] shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="font-bold text-base text-[#202033] mb-2 font-['Plus_Jakarta_Sans']">
              Easy Registration
            </h3>
            <p className="text-xs sm:text-sm text-[#77778A] leading-relaxed">
              Register for public events in just a few clicks and receive instant verified digital passes.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-white rounded-2xl border border-[#E9E8F0] shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
              <Mail size={24} />
            </div>
            <h3 className="font-bold text-base text-[#202033] mb-2 font-['Plus_Jakarta_Sans']">
              Digital Invitations
            </h3>
            <p className="text-xs sm:text-sm text-[#77778A] leading-relaxed">
              Create and share private wedding or party invitations with personalized preview links.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 bg-white rounded-2xl border border-[#E9E8F0] shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <QrCode size={24} />
            </div>
            <h3 className="font-bold text-base text-[#202033] mb-2 font-['Plus_Jakarta_Sans']">
              QR-Based Entry
            </h3>
            <p className="text-xs sm:text-sm text-[#77778A] leading-relaxed">
              Quick and secure event check-in with verified QR tokens and exact IST attendance logging.
            </p>
          </div>
        </div>
      </section>

      {/* Section E: Call To Action Banner */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#5032C4] via-[#6C4CE8] to-[#8B72ED] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-purple-600/20">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0">
              <Ticket size={30} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold font-['Plus_Jakarta_Sans']">
                Have an Event to Organize?
              </h3>
              <p className="text-sm text-purple-100 mt-1">
                Bring your event to life with EventFlow's easy-to-use platform.
              </p>
            </div>
          </div>

          <button
            onClick={handleCtaClick}
            className="px-6 py-3.5 bg-white text-[#6C4CE8] hover:bg-gray-100 font-bold text-sm rounded-xl transition-all shadow-md hover:scale-105 shrink-0 inline-flex items-center gap-2"
          >
            <span>Create Your Event</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
};
