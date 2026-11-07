import React from "react";
import { Link } from "react-router-dom";
import { Ticket, Mail, MapPin, Phone, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#15152B] text-white pt-16 pb-12 border-t border-[#2A2A48]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand & Bio */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/home" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5032C4] to-[#6C4CE8] flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Ticket size={20} className="text-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight font-['Plus_Jakarta_Sans']">
                Event<span className="text-[#6C4CE8]">Flow</span>
              </span>
            </Link>
            <p className="text-sm text-[#A0A0BA] leading-relaxed">
              "Discover Events. Create Memories."
            </p>
            <p className="text-xs text-[#77778A] leading-relaxed">
              EventFlow is a universal event discovery, public registration, private invitation, and QR-based attendance management platform.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-white text-base mb-4 font-['Plus_Jakarta_Sans']">Explore</h4>
            <ul className="space-y-2.5 text-sm text-[#A0A0BA]">
              <li>
                <Link to="/home" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-colors">Explore All Events</Link>
              </li>
              <li>
                <Link to="/events?category=concert" className="hover:text-white transition-colors">Live Concerts</Link>
              </li>
              <li>
                <Link to="/events?category=conference" className="hover:text-white transition-colors">Conferences & Tech</Link>
              </li>
              <li>
                <Link to="/events?category=festival" className="hover:text-white transition-colors">Festivals</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: For Organizers */}
          <div>
            <h4 className="font-bold text-white text-base mb-4 font-['Plus_Jakarta_Sans']">Organizers</h4>
            <ul className="space-y-2.5 text-sm text-[#A0A0BA]">
              <li>
                <Link to="/login" className="hover:text-white transition-colors">Organizer Portal</Link>
              </li>
              <li>
                <Link to="/organizer/events/create" className="hover:text-white transition-colors">Create Event</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Info */}
          <div>
            <h4 className="font-bold text-white text-base mb-4 font-['Plus_Jakarta_Sans']">Get in Touch</h4>
            <div className="space-y-3 text-sm text-[#A0A0BA]">
              <div className="flex items-center gap-2.5">
                <MapPin size={16} className="text-[#6C4CE8]" />
                <span>Jaipur & Mumbai, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-[#6C4CE8]" />
                <span>support@eventflow.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-[#6C4CE8]" />
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#2A2A48] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#77778A]">
          <p>© {new Date().getFullYear()} EventFlow. All rights reserved. Universal Event Management Platform.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart size={14} className="text-rose-500 fill-rose-500 inline" />
            <span>for College Mini-Project</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
