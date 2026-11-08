import { EventCategory, EventStatus } from "../types/event.types";

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
      return { bg: "bg-purple-950/60", text: "text-purple-300", border: "border-purple-800/50" };
    case "wedding":
      return { bg: "bg-rose-950/60", text: "text-rose-300", border: "border-rose-800/50" };
    case "festival":
      return { bg: "bg-amber-950/60", text: "text-amber-300", border: "border-amber-800/50" };
    case "conference":
    case "seminar":
      return { bg: "bg-blue-950/60", text: "text-blue-300", border: "border-blue-800/50" };
    case "birthday":
    case "anniversary":
      return { bg: "bg-pink-950/60", text: "text-pink-300", border: "border-pink-800/50" };
    case "comedy-show":
      return { bg: "bg-emerald-950/60", text: "text-emerald-300", border: "border-emerald-800/50" };
    case "exhibition":
      return { bg: "bg-teal-950/60", text: "text-teal-300", border: "border-teal-800/50" };
    default:
      return { bg: "bg-[#1F2937]", text: "text-[#00ADB5]", border: "border-[#374151]" };
  }
};

export const getStatusBadgeStyle = (status: EventStatus | string): { bg: string; text: string } => {
  switch (status) {
    case "published":
      return { bg: "bg-emerald-950/70 text-emerald-400 border-emerald-800/60", text: "text-emerald-400" };
    case "draft":
      return { bg: "bg-slate-800/90 text-sky-300 border-slate-700", text: "text-sky-300" };
    case "completed":
      return { bg: "bg-teal-950/70 text-teal-300 border-teal-800/60", text: "text-teal-300" };
    case "cancelled":
      return { bg: "bg-red-950/70 text-red-400 border-red-800/60", text: "text-red-400" };
    case "registered":
      return { bg: "bg-blue-950/70 text-blue-300 border-blue-800/60", text: "text-blue-300" };
    case "invited":
      return { bg: "bg-purple-950/70 text-purple-300 border-purple-800/60", text: "text-purple-300" };
    case "accepted":
      return { bg: "bg-emerald-950/70 text-emerald-300 border-emerald-800/60", text: "text-emerald-300" };
    case "declined":
      return { bg: "bg-rose-950/70 text-rose-300 border-rose-800/60", text: "text-rose-300" };
    default:
      return { bg: "bg-[#1F2937] text-[#94A3B8] border-[#374151]", text: "text-[#94A3B8]" };
  }
};

/**
 * Returns stylish abstract venue/stage gradients for dark charcoal cards
 * No real human photos used!
 */
export const getCategoryGradient = (category: string): string => {
  switch (category) {
    case "concert":
      return "from-[#1E1B4B] via-[#312E81] to-[#111827]";
    case "wedding":
      return "from-[#4C0519] via-[#881337] to-[#111827]";
    case "festival":
      return "from-[#451A03] via-[#78350F] to-[#111827]";
    case "conference":
    case "seminar":
      return "from-[#0F172A] via-[#1E293B] to-[#111827]";
    case "birthday":
    case "anniversary":
      return "from-[#500724] via-[#831843] to-[#111827]";
    case "comedy-show":
      return "from-[#022C22] via-[#064E3B] to-[#111827]";
    case "exhibition":
      return "from-[#134E4A] via-[#00ADB5]/30 to-[#111827]";
    default:
      return "from-[#1F2937] via-[#293548] to-[#111827]";
  }
};
