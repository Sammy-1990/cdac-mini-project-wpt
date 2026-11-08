import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Building2, ArrowRight } from "lucide-react";
import { EventItem } from "../../types/event.types";
import { formatCategory, getCategoryGradient } from "../../utils/formatUtils";
import { formatISTDate } from "../../utils/dateUtils";
import { getImageUrl } from "../../utils/imageUrl";

interface EventCardProps {
  event: EventItem;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [imageError, setImageError] = useState(false);
  const gradientClass = getCategoryGradient(event.category);
  const displayDate = event.startDateIST || formatISTDate(event.startDate);

  const rawImage = event.eventImage || event.coverImage;
  const imageSrc = !imageError && rawImage ? getImageUrl(rawImage) : null;

  return (
    <div className="bg-[#293548] rounded-2xl border border-[#374151] overflow-hidden shadow-md hover:shadow-xl hover:border-[#00ADB5]/50 hover:-translate-y-1 transition-all duration-200 flex flex-col h-full group">
      {/* Visual Cover Banner (Stored Local Image or Abstract stage / celebration gradient) */}
      <div className={`relative h-44 w-full bg-gradient-to-br ${gradientClass} flex items-center justify-center overflow-hidden border-b border-[#374151]`}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={event.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <>
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#00ADB5_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="text-white/20 transform group-hover:scale-110 transition-transform duration-300">
              <Calendar size={60} strokeWidth={1.2} />
            </div>
          </>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm bg-[#111827]/90 text-[#00ADB5] border border-[#374151] backdrop-blur-sm uppercase tracking-wider">
            {formatCategory(event.category)}
          </span>
        </div>

        {/* Status Pill if Private */}
        {event.eventType === "private" && (
          <div className="absolute top-3 right-3 z-10">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#1F2937]/90 text-[#A78BFA] border border-[#374151] backdrop-blur-sm">
              Private
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-[#F8FAFC] text-lg mb-2.5 line-clamp-1 group-hover:text-[#00ADB5] transition-colors font-['Plus_Jakarta_Sans']">
            {event.title}
          </h3>

          <div className="space-y-2 text-xs sm:text-sm text-[#CBD5E1] mb-4">
            <div className="flex items-center gap-2 truncate">
              <MapPin size={15} className="text-[#00ADB5] shrink-0" />
              <span className="truncate">{event.city}</span>
            </div>
            <div className="flex items-center gap-2 truncate">
              <Calendar size={15} className="text-[#00ADB5] shrink-0" />
              <span className="truncate">{displayDate}</span>
            </div>
            <div className="flex items-center gap-2 truncate text-[#94A3B8]">
              <Building2 size={15} className="text-[#00ADB5] shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-3 border-t border-[#374151] flex items-center justify-between">
          <Link
            to={`/events/${event._id}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00ADB5] hover:text-[#38BDF8] transition-colors w-full justify-between"
          >
            <span>View Details</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
