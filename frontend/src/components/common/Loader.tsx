import React from "react";
import { CircularProgress } from "@mui/material";

interface LoaderProps {
  message?: string;
  minHeight?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message = "Loading...", minHeight = "300px" }) => {
  return (
    <div
      className="flex flex-col items-center justify-center p-8 gap-3"
      style={{ minHeight }}
    >
      <CircularProgress size={40} sx={{ color: "#00ADB5" }} />
      <p className="text-sm font-medium text-[#94A3B8]">{message}</p>
    </div>
  );
};
