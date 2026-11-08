import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import { eventService } from "../../services/eventService";
import { EventItem } from "../../types/event.types";
import { EventCard } from "../common/EventCard";
import { Loader } from "../common/Loader";
import { EmptyState } from "../common/EmptyState";

export const FeaturedEvents: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await eventService.getPublicEvents();
        if (data && data.events) {
          // Take first 6 events for featured display
          setEvents(data.events.slice(0, 6));
        }
      } catch (err: any) {
        console.error("Error loading featured events:", err);
        setError("Unable to load featured events right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] font-['Plus_Jakarta_Sans']">
            Featured Events
          </h2>
          <p className="text-sm text-[#94A3B8] mt-1">Popular events you shouldn't miss</p>
        </div>
        <Link
          to="/events"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#00ADB5] hover:text-[#38BDF8] transition-colors"
        >
          <span>View All</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Events Grid */}
      {loading ? (
        <Loader message="Discovering exciting events around you..." />
      ) : error ? (
        <div className="text-center p-8 bg-red-950/40 border border-red-800/50 rounded-2xl text-[#F87171] text-sm">
          {error}
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Published Events Yet"
          description="Check back soon! New concerts, celebrations, and conferences are being organized every day."
          actionText="Explore All Events"
          onAction={() => (window.location.href = "/events")}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
};
