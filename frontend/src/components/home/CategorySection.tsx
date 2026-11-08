import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Cake,
  Music,
  Trophy,
  Users,
  Presentation,
  Smile,
  Palette,
  Sparkles,
  PartyPopper,
  CalendarDays,
  MoreHorizontal,
  ArrowRight,
} from "lucide-react";
import { EventCategory } from "../../types/event.types";

interface CategoryItem {
  id: EventCategory;
  name: string;
  icon: React.ElementType;
}

const CATEGORIES: CategoryItem[] = [
  { id: "wedding", name: "Weddings", icon: Heart },
  { id: "birthday", name: "Birthdays", icon: Cake },
  { id: "anniversary", name: "Anniversaries", icon: Sparkles },
  { id: "family-function", name: "Family Functions", icon: Users },
  { id: "concert", name: "Concerts", icon: Music },
  { id: "award-show", name: "Award Shows", icon: Trophy },
  { id: "festival", name: "Festivals", icon: PartyPopper },
  { id: "conference", name: "Conferences", icon: Presentation },
  { id: "seminar", name: "Seminars", icon: CalendarDays },
  { id: "comedy-show", name: "Comedy Shows", icon: Smile },
  { id: "exhibition", name: "Exhibitions", icon: Palette },
  { id: "other", name: "Other", icon: MoreHorizontal },
];

export const CategorySection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] font-['Plus_Jakarta_Sans']">
            Browse by Category
          </h2>
          <p className="text-sm text-[#94A3B8] mt-1">Find events that match your interests</p>
        </div>
        <Link
          to="/events"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#00ADB5] hover:text-[#38BDF8] transition-colors"
        >
          <span>View All</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => navigate(`/events?category=${cat.id}`)}
              className="p-5 rounded-2xl border border-[#374151] bg-[#293548] hover:bg-[#1F2937] hover:border-[#00ADB5]/50 transition-all duration-200 flex flex-col items-center justify-center gap-3 text-center group shadow-md hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1F2937] border border-[#374151] flex items-center justify-center text-[#00ADB5] group-hover:scale-110 transition-transform">
                <Icon size={24} strokeWidth={2} />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#F8FAFC] group-hover:text-[#00ADB5] transition-colors">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
