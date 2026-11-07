/**
 * Date and time utilities for EventFlow (Timezone: IST / UTC+05:30)
 */

/**
 * Converts a datetime-local input string (YYYY-MM-DDTHH:mm) to an IST ISO string with +05:30 offset
 * Example: "2026-12-20T18:00" -> "2026-12-20T18:00:00+05:30"
 */
export const toISTISOString = (dateTimeLocal: string): string => {
  if (!dateTimeLocal) return "";
  if (dateTimeLocal.length === 16) {
    return `${dateTimeLocal}:00+05:30`;
  }
  if (dateTimeLocal.includes("+05:30") || dateTimeLocal.endsWith("Z")) {
    return dateTimeLocal;
  }
  return `${dateTimeLocal}+05:30`;
};

/**
 * Combines separate date input (YYYY-MM-DD) and time input (HH:mm) into IST ISO format (+05:30 offset)
 */
export const combineDateAndTimeToIST = (dateStr: string, timeStr: string): string => {
  if (!dateStr || !timeStr) return "";
  return `${dateStr}T${timeStr}:00+05:30`;
};

/**
 * Splits an ISO string or date string into { date: YYYY-MM-DD, time: HH:mm }
 */
export const splitISTDateTime = (isoString?: string): { date: string; time: string } => {
  if (!isoString) return { date: "", time: "" };
  try {
    const d = new Date(isoString);
    if (!isNaN(d.getTime())) {
      // Format in IST timezone
      const year = d.toLocaleString("en-CA", { timeZone: "Asia/Kolkata", year: "numeric" });
      const month = d.toLocaleString("en-CA", { timeZone: "Asia/Kolkata", month: "2-digit" });
      const day = d.toLocaleString("en-CA", { timeZone: "Asia/Kolkata", day: "2-digit" });
      const hours = d.toLocaleString("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", hour12: false });
      const minutes = d.toLocaleString("en-GB", { timeZone: "Asia/Kolkata", minute: "2-digit" });
      return {
        date: `${year}-${month}-${day}`,
        time: `${hours}:${minutes}`,
      };
    }
  } catch {
    // fallback simple string parsing
    if (isoString.includes("T")) {
      const [dPart, tPart] = isoString.split("T");
      return { date: dPart, time: (tPart || "").slice(0, 5) };
    }
  }
  return { date: "", time: "" };
};

/**
 * Formats an ISO string to a human-readable IST string
 * Example: "20 Dec 2026, 6:00 pm IST"
 */
export const formatISTDate = (isoString?: string): string => {
  if (!isoString) return "Date TBA";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date) + " IST";
  } catch {
    return isoString;
  }
};
