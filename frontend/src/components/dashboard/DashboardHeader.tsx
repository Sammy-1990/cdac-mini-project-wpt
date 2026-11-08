import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  actionPath?: string;
  actionIcon?: React.ReactNode;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  actionText,
  actionPath,
  actionIcon,
}) => {
  const { user } = useAuth();

  return (
    <div className="bg-[#111827] border-b border-[#374151] px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-[#F8FAFC] font-['Plus_Jakarta_Sans']">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
          {subtitle || `Welcome back, ${user?.fullName || "User"} 👋`}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {actionText && actionPath && (
          <Link
            to={actionPath}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#00ADB5] hover:bg-[#00949B] text-[#111827] text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all"
          >
            {actionIcon}
            <span>{actionText}</span>
          </Link>
        )}

        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#CBD5E1] hover:text-[#00ADB5] bg-[#1F2937] hover:bg-[#293548] rounded-xl transition-colors border border-[#374151]"
        >
          <Compass size={15} />
          <span>Explore Events</span>
        </Link>
      </div>
    </div>
  );
};
