import React from "react";
import { Link } from "react-router-dom";
import { Ticket, Mail, MapPin, Phone, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#111827] text-[#CBD5E1] pt-16 pb-12 border-t border-[#374151]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand & Bio */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/home" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00ADB5] to-[#38BDF8] flex items-center justify-center shadow-lg shadow-[#00ADB5]/20 text-[#111827]">
                <Ticket size={20} className="stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-[#F8FAFC] font-['Plus_Jakarta_Sans']">
                Event<span className="text-[#00ADB5]">Flow</span>
              </span>
            </Link>
            <p className="text-sm text-[#CBD5E1] leading-relaxed">
              "Discover Events. Create Memories."
            </p>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              EventFlow is a universal event discovery, public registration, private invitation, and QR-based attendance management platform.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-[#F8FAFC] text-base mb-4 font-['Plus_Jakarta_Sans']">Explore</h4>
            <ul className="space-y-2.5 text-sm text-[#CBD5E1]">
              <li>
                <Link to="/home" className="hover:text-[#00ADB5] transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-[#00ADB5] transition-colors">Explore All Events</Link>
              </li>
              <li>
                <Link to="/events?category=concert" className="hover:text-[#00ADB5] transition-colors">Live Concerts</Link>
              </li>
              <li>
                <Link to="/events?category=conference" className="hover:text-[#00ADB5] transition-colors">Conferences & Tech</Link>
              </li>
              <li>
                <Link to="/events?category=festival" className="hover:text-[#00ADB5] transition-colors">Festivals</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: For Organizers */}
          <div>
            <h4 className="font-bold text-[#F8FAFC] text-base mb-4 font-['Plus_Jakarta_Sans']">Organizers</h4>
            <ul className="space-y-2.5 text-sm text-[#CBD5E1]">
              <li>
                <Link to="/login" className="hover:text-[#00ADB5] transition-colors">Organizer Portal</Link>
              </li>
              <li>
                <Link to="/organizer/events/create" className="hover:text-[#00ADB5] transition-colors">Create Event</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#00ADB5] transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#00ADB5] transition-colors">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Info */}
          <div>
            <h4 className="font-bold text-[#F8FAFC] text-base mb-4 font-['Plus_Jakarta_Sans']">Get in Touch</h4>
            <div className="space-y-3 text-sm text-[#CBD5E1]">
              <div className="flex items-center gap-2.5">
                <MapPin size={16} className="text-[#00ADB5]" />
                <span>Jaipur & Mumbai, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-[#00ADB5]" />
                <span>support@eventflow.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-[#00ADB5]" />
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#374151] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <p>© {new Date().getFullYear()} EventFlow. All rights reserved. Universal Event Management Platform.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart size={14} className="text-[#F87171] fill-[#F87171] inline" />
            <span>for College Mini-Project</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
