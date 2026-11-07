import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { Compass, ExternalLink } from "lucide-react";

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
    <div className="bg-white border-b border-[#E9E8F0] px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-[#202033] font-['Plus_Jakarta_Sans']">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-[#77778A] mt-0.5">
          {subtitle || `Welcome back, ${user?.fullName || "User"} 👋`}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {actionText && actionPath && (
          <Link
            to={actionPath}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#6C4CE8] hover:bg-[#5032C4] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all"
          >
            {actionIcon}
            <span>{actionText}</span>
          </Link>
        )}

        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#77778A] hover:text-[#202033] bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
        >
          <Compass size={15} />
          <span>Explore Events</span>
        </Link>
      </div>
    </div>
  );
};
