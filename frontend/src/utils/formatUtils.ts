import { EventCategory, EventStatus, EventType } from "../types/event.types";

export const formatCategory = (category: string): string => {
  if (!category) return "";
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getCategoryBadgeStyle = (category: EventCategory | string): { bg: string; text: string; border: string } => {
  switch (category) {
    case "concert":
      return { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" };
    case "wedding":
      return { bg: "bg-rose-100", text: "text-rose-700", border: "border-rose-200" };
    case "festival":
      return { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" };
    case "conference":
    case "seminar":
      return { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" };
    case "birthday":
    case "anniversary":
      return { bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-200" };
    case "comedy-show":
      return { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" };
    case "exhibition":
      return { bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-200" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" };
  }
};

export const getStatusBadgeStyle = (status: EventStatus | string): { bg: string; text: string } => {
  switch (status) {
    case "published":
    case "accepted":
    case "registered":
      return { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", text: "text-emerald-700" };
    case "draft":
    case "invited":
      return { bg: "bg-amber-50 text-amber-700 border-amber-200", text: "text-amber-700" };
    case "completed":
      return { bg: "bg-blue-50 text-blue-700 border-blue-200", text: "text-blue-700" };
    case "cancelled":
    case "declined":
      return { bg: "bg-rose-50 text-rose-700 border-rose-200", text: "text-rose-700" };
    default:
      return { bg: "bg-gray-50 text-gray-700 border-gray-200", text: "text-gray-700" };
  }
};

/**
 * Returns stylish abstract venue/stage gradients for categories
 * No real human photos used!
 */
export const getCategoryGradient = (category: string): string => {
  switch (category) {
    case "concert":
      return "from-[#4A154B] via-[#6C4CE8] to-[#15152B]";
    case "wedding":
      return "from-[#7A1C3C] via-[#C84B68] to-[#2B151E]";
    case "festival":
      return "from-[#B45309] via-[#F59E0B] to-[#78350F]";
    case "conference":
    case "seminar":
      return "from-[#1E3A8A] via-[#3B82F6] to-[#0F172A]";
    case "birthday":
    case "anniversary":
      return "from-[#831843] via-[#EC4899] to-[#500724]";
    case "comedy-show":
      return "from-[#065F46] via-[#10B981] to-[#022C22]";
    case "exhibition":
      return "from-[#312E81] via-[#6366F1] to-[#1E1B4B]";
    default:
      return "from-[#374151] via-[#6C4CE8] to-[#111827]";
  }
};
