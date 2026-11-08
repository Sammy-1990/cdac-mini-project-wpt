import React, { useEffect, useState } from "react";
import { DashboardSidebar } from "../../components/dashboard/DashboardSidebar";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { eventService } from "../../services/eventService";
import { EventItem } from "../../types/event.types";
import { Lock, Search, MapPin } from "lucide-react";
import { Loader } from "../../components/common/Loader";
import { EmptyState } from "../../components/common/EmptyState";
import { formatCategory, getStatusBadgeStyle } from "../../utils/formatUtils";
import { formatISTDate } from "../../utils/dateUtils";

export const AdminPrivateEvents: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");

  const fetchPrivateEvents = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (search.trim()) params.search = search.trim();
      if (city.trim()) params.city = city.trim();

      const data = await eventService.getAdminPrivateEvents(params);
      if (data && data.events) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error("Error loading admin private events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivateEvents();
  }, []);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPrivateEvents();
  };

  return (
    <div className="min-h-screen bg-[#111827] flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title="All Platform Private Events (Admin)"
          subtitle="Exclusive supervisory view of private celebrations across the platform"
        />

        <main className="p-6 sm:p-8 flex-1 space-y-6">
          {/* Filter Bar */}
          <form
            onSubmit={handleFilter}
            className="bg-[#1F2937] p-4 rounded-2xl border border-[#374151] shadow-md flex flex-col sm:flex-row gap-3"
          >
            <div className="flex-1 flex items-center gap-2 px-3.5 py-2 bg-[#111827] border border-[#374151] rounded-xl">
              <Search size={16} className="text-[#00ADB5]" />
              <input
                type="text"
                placeholder="Search private event title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none"
              />
            </div>

            <div className="sm:w-56 flex items-center gap-2 px-3.5 py-2 bg-[#111827] border border-[#374151] rounded-xl">
              <MapPin size={16} className="text-[#00ADB5]" />
              <input
                type="text"
                placeholder="Filter by City..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-transparent text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2 bg-[#00ADB5] text-[#111827] text-xs font-bold rounded-xl hover:bg-[#00949B] shadow-md shadow-[#00ADB5]/20 transition-all"
            >
              Filter
            </button>
          </form>

          {/* Results Table */}
          {loading ? (
            <Loader message="Loading platform private events..." />
          ) : events.length === 0 ? (
            <EmptyState
              icon={Lock}
              title="No Private Events Found"
              description="No private events match your query."
            />
          ) : (
            <div className="bg-[#293548] rounded-2xl border border-[#374151] shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#1F2937] border-b border-[#374151] text-[#94A3B8] font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-6">Event Title</th>
                      <th className="py-3.5 px-6">Category</th>
                      <th className="py-3.5 px-6">Host Organizer</th>
                      <th className="py-3.5 px-6">Venue & City</th>
                      <th className="py-3.5 px-6">Date & Time (IST)</th>
                      <th className="py-3.5 px-6 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#374151]">
                    {events.map((ev) => {
                      const statusStyle = getStatusBadgeStyle(ev.status);
                      const org: any = ev.organizerId || {};
                      const dateDisplay = ev.startDateIST || formatISTDate(ev.startDate);

                      return (
                        <tr key={ev._id} className="hover:bg-[#1F2937]/50 transition-colors">
                          <td className="py-4 px-6 font-bold text-[#F8FAFC] max-w-xs truncate">
                            <span className="flex items-center gap-1.5">
                              <Lock size={13} className="text-[#FBBF24] shrink-0" />
                              <span>{ev.title}</span>
                            </span>
                          </td>
                          <td className="py-4 px-6 text-[#94A3B8]">
                            {formatCategory(ev.category)}
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-semibold text-[#F8FAFC]">{org.fullName || "Organizer"}</p>
                            <p className="text-[11px] text-[#94A3B8]">{org.email}</p>
                          </td>
                          <td className="py-4 px-6 text-[#94A3B8]">
                            {ev.venue}, {ev.city}
                          </td>
                          <td className="py-4 px-6 font-mono text-[11px] text-[#00ADB5]">
                            {dateDisplay}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span className={`px-2.5 py-0.5 rounded-full font-bold border ${statusStyle.bg}`}>
                              {ev.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};