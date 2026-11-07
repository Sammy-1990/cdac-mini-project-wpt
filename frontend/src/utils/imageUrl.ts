const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * Returns full URL for local backend uploaded images or external URLs.
 * If path is relative like "/uploads/events/xxx.jpg", prepends backend base URL.
 */
export const getImageUrl = (imagePath?: string): string => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  return `${BASE_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};
