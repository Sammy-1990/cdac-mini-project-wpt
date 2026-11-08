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
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#293548] rounded-2xl border border-[#374151] shadow-lg max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-[#1F2937] border border-[#374151] flex items-center justify-center text-[#00ADB5] mb-4 shadow-inner">
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-bold text-[#F8FAFC] mb-2 font-['Plus_Jakarta_Sans']">{title}</h3>
      <p className="text-[#CBD5E1] text-sm max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button
          variant="contained"
          onClick={onAction}
          sx={{
            bgcolor: "#00ADB5",
            color: "#111827",
            "&:hover": { bgcolor: "#00949B" },
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
