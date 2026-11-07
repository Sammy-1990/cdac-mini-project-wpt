import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { Alert, TextField, Button } from "@mui/material";

export const Contact: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#F8F8FC] py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-[#6C4CE8] text-xs font-bold border border-purple-200">
            <MessageSquare size={14} /> Get In Touch
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#202033] font-['Plus_Jakarta_Sans']">
            Contact EventFlow Support
          </h1>
          <p className="text-sm sm:text-base text-[#77778A]">
            Have a question about an upcoming concert, booking issue, or hosting a private event? Our team is here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Cards */}
          <div className="md:col-span-5 space-y-4">
            <div className="p-6 bg-white rounded-3xl border border-[#E9E8F0] shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#6C4CE8] flex items-center justify-center shrink-0">
                <Mail size={22} />
              </div>
              <div>
                <h4 className="font-bold text-[#202033] text-base font-['Plus_Jakarta_Sans']">Email Us</h4>
                <p className="text-xs text-[#77778A] mt-0.5">We reply within 24 hours</p>
                <p className="text-sm font-semibold text-[#6C4CE8] mt-2">support@eventflow.com</p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-[#E9E8F0] shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Phone size={22} />
              </div>
              <div>
                <h4 className="font-bold text-[#202033] text-base font-['Plus_Jakarta_Sans']">Call Support</h4>
                <p className="text-xs text-[#77778A] mt-0.5">Mon - Sat, 9:00 AM - 7:00 PM IST</p>
                <p className="text-sm font-semibold text-emerald-600 mt-2">+91 98765 43210</p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-[#E9E8F0] shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                <MapPin size={22} />
              </div>
              <div>
                <h4 className="font-bold text-[#202033] text-base font-['Plus_Jakarta_Sans']">Locations</h4>
                <p className="text-xs text-[#77778A] mt-0.5">Event hubs & partner offices</p>
                <p className="text-sm font-semibold text-[#202033] mt-2">Jaipur & Mumbai, India</p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="md:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#E9E8F0] shadow-sm">
            <h3 className="text-2xl font-bold text-[#202033] mb-6 font-['Plus_Jakarta_Sans']">
              Send us a Message
            </h3>

            {submitted && (
              <Alert severity="success" className="mb-6 rounded-2xl text-xs" icon={<CheckCircle2 size={18} />}>
                Thank you! Your message has been sent. Our support desk will reach out shortly.
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#202033] mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#202033] focus:bg-white focus:border-[#6C4CE8] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202033] mb-1.5">
                  Your Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#202033] focus:bg-white focus:border-[#6C4CE8] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202033] mb-1.5">
                  Message / Query
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we assist you with EventFlow?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#202033] focus:bg-white focus:border-[#6C4CE8] focus:outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#6C4CE8] hover:bg-[#5032C4] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-2"
              >
                <Send size={18} />
                <span>Submit Query</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
