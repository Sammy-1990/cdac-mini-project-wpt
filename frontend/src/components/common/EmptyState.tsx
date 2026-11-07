import React from "react";
import { LucideIcon, CalendarX } from "lucide-react";
import { Button } from "@mui/material";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = CalendarX,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-[#E9E8F0] shadow-sm max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center text-[#6C4CE8] mb-4">
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-bold text-[#202033] mb-2">{title}</h3>
      <p className="text-[#77778A] text-sm max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <Button
          variant="contained"
          onClick={onAction}
          sx={{
            bgcolor: "#6C4CE8",
            "&:hover": { bgcolor: "#5032C4" },
            textTransform: "none",
            borderRadius: "10px",
            px: 3,
            py: 1,
            fontWeight: 600,
          }}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};
