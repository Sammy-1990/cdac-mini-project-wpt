import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardSidebar } from "../../components/dashboard/DashboardSidebar";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { participantService } from "../../services/participantService";
import { ParticipantItem } from "../../types/participant.types";
import { Ticket, QrCode, MapPin, Building2, User, Printer } from "lucide-react";
import { Loader } from "../../components/common/Loader";
import { EmptyState } from "../../components/common/EmptyState";
import { formatCategory } from "../../utils/formatUtils";

export const MyTickets: React.FC = () => {
  const [tickets, setTickets] = useState<ParticipantItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const [regRes, invRes] = await Promise.all([
          participantService.getMyRegistrations(),
          participantService.getMyInvitations(),
        ]);

        const validRegistrations = (regRes.registrations || []).filter(
          (r) => r.status === "registered"
        );
        const acceptedInvitations = (invRes.invitations || []).filter(
          (i) => i.status === "accepted"
        );

        setTickets([...validRegistrations, ...acceptedInvitations]);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#1F2937] text-[#F8FAFC] flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title="My Tickets & Passes"
          subtitle="Your verified QR entry passes for upcoming events"
          actionText="Print Tickets"
          actionPath="#"
          actionIcon={<Printer size={16} />}
        />

        <main className="p-6 sm:p-8 flex-1 space-y-6">
          {loading ? (
            <Loader message="Loading your verified tickets..." />
          ) : tickets.length === 0 ? (
            <EmptyState
              icon={Ticket}
              title="No Tickets Available"
              description="You do not have any active event tickets yet. Register for a public concert or accept an invitation to receive a verified QR entry pass."
              actionText="Explore Events"
              onAction={() => (window.location.href = "/events")}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {tickets.map((ticket) => {
                const event: any = ticket.eventId || {};
                const token = ticket.qrToken || "TOKEN_ACTIVE";

                return (
                  <div
                    key={ticket._id}
                    className="bg-[#293548] rounded-3xl border border-[#374151] shadow-xl overflow-hidden flex flex-col sm:flex-row hover:border-[#00ADB5]/50 transition-all"
                  >
                    {/* Left Event & Attendee Info */}
                    <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#111827] text-[#00ADB5] border border-[#374151]">
                            {formatCategory(event.category || "Event")}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                            VERIFIED PASS
                          </span>
                        </div>

                        <h3 className="text-xl font-extrabold text-[#F8FAFC] font-['Plus_Jakarta_Sans'] leading-snug">
                          {event.title || "Event Title"}
                        </h3>
                      </div>

                      <div className="space-y-2 text-xs text-[#CBD5E1]">
                        <div className="flex items-center gap-2">
                          <Building2 size={15} className="text-[#00ADB5] shrink-0" />
                          <span className="truncate">{event.venue || "Venue Provided"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={15} className="text-[#00ADB5] shrink-0" />
                          <span className="truncate">{event.city || "City"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User size={15} className="text-[#00ADB5] shrink-0" />
                          <span className="truncate font-semibold text-[#F8FAFC]">{ticket.name}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#374151] flex items-center justify-between text-[11px] text-[#94A3B8]">
                        <span>Admission: 1 Person</span>
                        <span className="capitalize font-medium text-[#00ADB5]">{ticket.participationType}</span>
                      </div>
                    </div>

                    {/* Right Stub: QR Code & Token */}
                    <div className="bg-[#111827] text-white p-6 sm:w-52 flex flex-col items-center justify-center text-center border-t sm:border-t-0 sm:border-l border-dashed border-[#374151] relative">
                      {/* Notch cutouts on top and bottom */}
                      <div className="hidden sm:block absolute -top-3 -left-3 w-6 h-6 bg-[#1F2937] rounded-full" />
                      <div className="hidden sm:block absolute -bottom-3 -left-3 w-6 h-6 bg-[#1F2937] rounded-full" />

                      {/* QR Box with fallback token illustration */}
                      <div className="w-32 h-32 bg-white rounded-2xl p-2.5 flex flex-col items-center justify-center shadow-md mb-3">
                        <QrCode size={84} className="text-[#111827]" />
                        <span className="text-[9px] font-mono text-gray-700 font-bold truncate max-w-[100px] mt-1">
                          {token.substring(0, 10)}...
                        </span>
                      </div>

                      <span className="text-[10px] text-[#00ADB5] uppercase tracking-widest font-bold">
                        Scan at Entry
                      </span>
                      <p className="text-[9px] text-[#94A3B8] mt-1 font-mono break-all px-1">
                        ID: {ticket._id.substring(ticket._id.length - 8)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
