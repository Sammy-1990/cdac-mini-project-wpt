import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Building2, ArrowRight } from "lucide-react";
import { EventItem } from "../../types/event.types";
import { formatCategory, getCategoryBadgeStyle, getCategoryGradient } from "../../utils/formatUtils";
import { formatISTDate } from "../../utils/dateUtils";
import { getImageUrl } from "../../utils/imageUrl";

interface EventCardProps {
  event: EventItem;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [imageError, setImageError] = useState(false);
  const categoryStyle = getCategoryBadgeStyle(event.category);
  const gradientClass = getCategoryGradient(event.category);
  const displayDate = event.startDateIST || formatISTDate(event.startDate);

  const rawImage = event.eventImage || event.coverImage;
  const imageSrc = !imageError && rawImage ? getImageUrl(rawImage) : null;

  return (
    <div className="bg-white rounded-2xl border border-[#E9E8F0] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group">
      {/* Visual Cover Banner (Stored Local Image or Abstract stage / celebration gradient) */}
      <div className={`relative h-44 w-full bg-gradient-to-br ${gradientClass} flex items-center justify-center overflow-hidden`}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={event.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <>
            {/* Subtle decorative glow effect */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            {/* Decorative center icon outline */}
            <div className="text-white/20 transform group-hover:scale-110 transition-transform duration-300">
              <Calendar size={64} strokeWidth={1.2} />
            </div>
          </>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm bg-white/95 ${categoryStyle.text} border border-white/40`}>
            {formatCategory(event.category)}
          </span>
        </div>

        {/* Status Pill if Private/Draft */}
        {event.eventType === "private" && (
          <div className="absolute top-3 right-3 z-10">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-900/80 text-white border border-purple-400/30">
              Private
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-[#202033] text-lg mb-2 line-clamp-1 group-hover:text-[#6C4CE8] transition-colors">
            {event.title}
          </h3>

          <div className="space-y-1.5 text-sm text-[#77778A] mb-4">
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-[#6C4CE8] shrink-0" />
              <span className="truncate">{event.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-[#6C4CE8] shrink-0" />
              <span className="truncate">{displayDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 size={15} className="text-[#6C4CE8] shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-3 border-t border-[#E9E8F0] flex items-center justify-between">
          <Link
            to={`/events/${event._id}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6C4CE8] hover:text-[#5032C4] transition-colors w-full justify-between"
          >
            <span>View Details</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
