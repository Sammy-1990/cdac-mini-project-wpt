import React from "react";
import { Link } from "react-router-dom";
import { Ticket, Users, ShieldCheck, QrCode, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8F8FC] py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-[#6C4CE8] text-xs font-bold border border-purple-200">
            <Sparkles size={14} /> About EventFlow
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#202033] font-['Plus_Jakarta_Sans'] tracking-tight">
            Universal Event Management & Discovery Platform
          </h1>
          <p className="text-base text-[#77778A] leading-relaxed">
            "Discover Events. Create Memories." EventFlow bridges the gap between public event discovery and private celebrations, backed by verifiable QR-code ticketing and real-time attendance tracking.
          </p>
        </div>

        {/* 4 Feature Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-white rounded-3xl border border-[#E9E8F0] shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#6C4CE8] flex items-center justify-center shrink-0">
              <Ticket size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#202033] mb-2 font-['Plus_Jakarta_Sans']">
                Public Discovery & Booking
              </h3>
              <p className="text-sm text-[#77778A] leading-relaxed">
                Discover live concerts, technical conferences, comedy nights, and festivals with fast search, city filtering, and category selection inspired by leading booking experiences.
              </p>
            </div>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-[#E9E8F0] shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#202033] mb-2 font-['Plus_Jakarta_Sans']">
                Private Event Invitations
              </h3>
              <p className="text-sm text-[#77778A] leading-relaxed">
                Organizers can host private royal weddings, birthday celebrations, or family functions. Invite guests directly with shareable links and receive one-click Accept/Decline responses.
              </p>
            </div>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-[#E9E8F0] shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <QrCode size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#202033] mb-2 font-['Plus_Jakarta_Sans']">
                Verified QR-Code Ticketing
              </h3>
              <p className="text-sm text-[#77778A] leading-relaxed">
                Every registered attendee receives a unique cryptographic QR token and Base64 digital ticket. Organizers scan or enter tokens at venue gates to prevent ticket duplication.
              </p>
            </div>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-[#E9E8F0] shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#202033] mb-2 font-['Plus_Jakarta_Sans']">
                Role-Based Dashboards
              </h3>
              <p className="text-sm text-[#77778A] leading-relaxed">
                Distinct user roles (Guest, Organizer, and Admin) provide tailored experiences: from personal ticket views to organizer participant management and system-wide admin metrics.
              </p>
            </div>
          </div>
        </div>

        {/* Tech Stack Banner */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E9E8F0] shadow-sm">
          <h2 className="text-xl font-bold text-[#202033] mb-6 text-center font-['Plus_Jakarta_Sans']">
            Architecture & Technology Stack
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-sm font-semibold text-[#202033]">
            <div className="p-4 bg-gray-50 rounded-2xl">
              <p className="text-xs text-[#77778A] mb-1">Frontend</p>
              React 18 + TypeScript + Vite
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl">
              <p className="text-xs text-[#77778A] mb-1">Styling & UI</p>
              Tailwind CSS + Material UI
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl">
              <p className="text-xs text-[#77778A] mb-1">Backend</p>
              Node.js + Express + TypeScript
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl">
              <p className="text-xs text-[#77778A] mb-1">Database & Security</p>
              MongoDB Atlas + JWT + bcrypt
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-4">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#6C4CE8] text-white font-bold rounded-2xl shadow-lg shadow-purple-600/25 hover:bg-[#5032C4] transition-all hover:scale-105"
          >
            <span>Explore Events Now</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};
