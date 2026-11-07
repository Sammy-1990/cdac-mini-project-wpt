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
  bgLight: string;
  iconColor: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: "wedding", name: "Weddings", icon: Heart, bgLight: "bg-rose-50 hover:bg-rose-100", iconColor: "text-rose-500" },
  { id: "birthday", name: "Birthdays", icon: Cake, bgLight: "bg-pink-50 hover:bg-pink-100", iconColor: "text-pink-500" },
  { id: "anniversary", name: "Anniversaries", icon: Sparkles, bgLight: "bg-red-50 hover:bg-red-100", iconColor: "text-red-500" },
  { id: "family-function", name: "Family Functions", icon: Users, bgLight: "bg-orange-50 hover:bg-orange-100", iconColor: "text-orange-500" },
  { id: "concert", name: "Concerts", icon: Music, bgLight: "bg-purple-50 hover:bg-purple-100", iconColor: "text-[#6C4CE8]" },
  { id: "award-show", name: "Award Shows", icon: Trophy, bgLight: "bg-amber-50 hover:bg-amber-100", iconColor: "text-amber-500" },
  { id: "festival", name: "Festivals", icon: PartyPopper, bgLight: "bg-yellow-50 hover:bg-yellow-100", iconColor: "text-yellow-600" },
  { id: "conference", name: "Conferences", icon: Presentation, bgLight: "bg-blue-50 hover:bg-blue-100", iconColor: "text-blue-500" },
  { id: "seminar", name: "Seminars", icon: CalendarDays, bgLight: "bg-cyan-50 hover:bg-cyan-100", iconColor: "text-cyan-600" },
  { id: "comedy-show", name: "Comedy Shows", icon: Smile, bgLight: "bg-emerald-50 hover:bg-emerald-100", iconColor: "text-emerald-500" },
  { id: "exhibition", name: "Exhibitions", icon: Palette, bgLight: "bg-indigo-50 hover:bg-indigo-100", iconColor: "text-indigo-500" },
  { id: "other", name: "Other", icon: MoreHorizontal, bgLight: "bg-gray-100 hover:bg-gray-200", iconColor: "text-gray-600" },
];

export const CategorySection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202033] font-['Plus_Jakarta_Sans']">
            Browse by Category
          </h2>
          <p className="text-sm text-[#77778A] mt-1">Find events that match your interests</p>
        </div>
        <Link
          to="/events"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#6C4CE8] hover:text-[#5032C4] transition-colors"
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
              className={`p-5 rounded-2xl border border-[#E9E8F0] ${cat.bgLight} transition-all duration-200 flex flex-col items-center justify-center gap-3 text-center group shadow-sm hover:shadow hover:-translate-y-1`}
            >
              <div className={`w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center ${cat.iconColor} group-hover:scale-110 transition-transform`}>
                <Icon size={24} strokeWidth={2} />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#202033]">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
