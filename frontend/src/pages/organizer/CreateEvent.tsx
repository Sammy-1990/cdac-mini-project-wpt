import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "../../components/dashboard/DashboardSidebar";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { eventService } from "../../services/eventService";
import { EventCategory, EventType } from "../../types/event.types";
import { combineDateAndTimeToIST } from "../../utils/dateUtils";
import {
  Calendar,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Globe,
  Lock,
  Building2,
  Users,
  FileText,
  Save,
  Send,
} from "lucide-react";
import { Alert, CircularProgress } from "@mui/material";
import { ImageUpload } from "../../components/common/ImageUpload";

const CATEGORIES: { label: string; value: EventCategory }[] = [
  { label: "Concert", value: "concert" },
  { label: "Conference", value: "conference" },
  { label: "Festival", value: "festival" },
  { label: "Wedding", value: "wedding" },
  { label: "Birthday", value: "birthday" },
  { label: "Anniversary", value: "anniversary" },
  { label: "Family Function", value: "family-function" },
  { label: "Award Show", value: "award-show" },
  { label: "Seminar", value: "seminar" },
  { label: "Comedy Show", value: "comedy-show" },
  { label: "Exhibition", value: "exhibition" },
  { label: "Other", value: "other" },
];

export const CreateEvent: React.FC = () => {
  const navigate = useNavigate();

  // Section A: Basic Info
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<EventCategory>("concert");
  const [eventType, setEventType] = useState<EventType>("public");
  const [description, setDescription] = useState("");

  // Section B: Image
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  // Section C: Date & Time (IST)
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("18:00");

  // Section D: Venue Info
  const [venue, setVenue] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Jaipur");

  // Section E: Capacity & Status
  const [capacity, setCapacity] = useState<number>(500);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (submitStatus: "draft" | "published") => {
    setError(null);

    // Basic Validations
    if (!title.trim()) {
      setError("Please provide an Event Title.");
      return;
    }
    if (!description.trim()) {
      setError("Please enter an Event Description.");
      return;
    }
    if (!startDate || !startTime) {
      setError("Please select both a Start Date and Start Time.");
      return;
    }
    if (!endDate || !endTime) {
      setError("Please select both an End Date and End Time.");
      return;
    }

    // Combine date & time into IST ISO format
    const startISO = combineDateAndTimeToIST(startDate, startTime);
    const endISO = combineDateAndTimeToIST(endDate, endTime);

    const startObj = new Date(startISO);
    const endObj = new Date(endISO);

    if (isNaN(startObj.getTime()) || isNaN(endObj.getTime())) {
      setError("Invalid date or time selected. Please check your inputs.");
      return;
    }

    if (endObj <= startObj) {
      setError("End date and time must be strictly after the start date and time.");
      return;
    }

    if (!venue.trim() || !address.trim() || !city.trim()) {
      setError("Please fill in the Venue Name, Address, and City.");
      return;
    }

    if (!capacity || Number(capacity) < 1) {
      setError("Maximum Capacity must be at least 1 attendee.");
      return;
    }

    try {
      setLoading(true);

      if (selectedImageFile) {
        // Send multipart form-data for local Multer image upload
        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("category", category);
        formData.append("eventType", eventType);
        formData.append("description", description.trim());
        formData.append("startDate", startISO);
        formData.append("endDate", endISO);
        formData.append("venue", venue.trim());
        formData.append("address", address.trim());
        formData.append("city", city.trim());
        formData.append("capacity", String(Number(capacity)));
        formData.append("status", submitStatus);
        formData.append("eventImage", selectedImageFile);

        const response = await eventService.createEvent(formData);
        if (response && response.success) {
          setSuccessMessage(
            submitStatus === "published"
              ? "Event created and published successfully!"
              : "Event saved as draft successfully!"
          );
          setTimeout(() => {
            navigate("/organizer/events");
          }, 1200);
        } else {
          setError(response?.message || "Failed to create event.");
        }
      } else {
        // Send JSON payload
        const payload = {
          title: title.trim(),
          category,
          eventType,
          description: description.trim(),
          startDate: startISO,
          endDate: endISO,
          venue: venue.trim(),
          address: address.trim(),
          city: city.trim(),
          capacity: Number(capacity),
          status: submitStatus,
        };

        const response = await eventService.createEvent(payload);
        if (response && response.success) {
          setSuccessMessage(
            submitStatus === "published"
              ? "Event created and published successfully!"
              : "Event saved as draft successfully!"
          );
          setTimeout(() => {
            navigate("/organizer/events");
          }, 1200);
        } else {
          setError(response?.message || "Failed to create event.");
        }
      }
    } catch (err: any) {
      console.error("Create event error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create event. Please verify all fields and backend status."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title="Create New Event"
          subtitle="Publish a public event or host an invite-only celebration"
          actionText="Back to My Events"
          actionPath="/organizer/events"
          actionIcon={<ArrowLeft size={16} />}
        />

        <main className="p-6 sm:p-8 flex-1 max-w-4xl">
          <div className="bg-[#1F2937] rounded-3xl border border-[#374151] p-6 sm:p-10 shadow-xl">
            {error && (
              <Alert
                severity="error"
                className="mb-6 rounded-2xl text-xs"
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            {successMessage && (
              <Alert
                severity="success"
                className="mb-6 rounded-2xl text-xs"
                icon={<CheckCircle2 size={18} />}
              >
                {successMessage}
              </Alert>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit("published");
              }}
              className="space-y-10"
            >
              {/* SECTION A: Basic Event Information */}
              <div className="space-y-5">
                <div className="border-b border-[#374151] pb-3">
                  <h3 className="text-base font-bold text-[#F8FAFC] font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                    <FileText size={18} className="text-[#00ADB5]" />
                    <span>Section A: Basic Event Information</span>
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    General identification, category, and discovery visibility.
                  </p>
                </div>

                {/* Event Title */}
                <div>
                  <label className="block text-xs font-bold text-[#CBD5E1] mb-1.5">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Annual Music Concert - Mega Concert"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-[#111827] border border-[#374151] rounded-xl text-sm text-[#F8FAFC] placeholder-[#94A3B8] focus:border-[#00ADB5] focus:outline-none transition-all"
                  />
                </div>

                {/* Category & Event Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#CBD5E1] mb-1.5">
                      Event Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as EventCategory)}
                      className="w-full px-4 py-3 bg-[#111827] border border-[#374151] rounded-xl text-sm text-[#F8FAFC] focus:border-[#00ADB5] focus:outline-none transition-all cursor-pointer capitalize"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value} className="bg-[#1F2937] text-[#F8FAFC]">
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#CBD5E1] mb-1.5">
                      Event Visibility (Type) *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Public Option */}
                      <button
                        type="button"
                        onClick={() => setEventType("public")}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          eventType === "public"
                            ? "border-[#00ADB5] bg-[#00ADB5]/10 text-[#00ADB5] shadow-sm"
                            : "border-[#374151] bg-[#111827] text-[#94A3B8] hover:border-[#4B5563] hover:text-[#CBD5E1]"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <Globe size={14} />
                          <span>Public Event</span>
                        </div>
                        <span className="text-[10px] text-[#94A3B8] mt-1 line-clamp-2">
                          Open for everyone to discover & register.
                        </span>
                      </button>

                      {/* Private Option */}
                      <button
                        type="button"
                        onClick={() => setEventType("private")}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          eventType === "private"
                            ? "border-[#00ADB5] bg-[#00ADB5]/10 text-[#00ADB5] shadow-sm"
                            : "border-[#374151] bg-[#111827] text-[#94A3B8] hover:border-[#4B5563] hover:text-[#CBD5E1]"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <Lock size={14} />
                          <span>Private Event</span>
                        </div>
                        <span className="text-[10px] text-[#94A3B8] mt-1 line-clamp-2">
                          Invite-only via direct private link.
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-[#CBD5E1] mb-1.5">
                    Event Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your event, schedule, performers, or celebration details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-[#111827] border border-[#374151] rounded-xl text-sm text-[#F8FAFC] placeholder-[#94A3B8] focus:border-[#00ADB5] focus:outline-none transition-all resize-none"
                  />
                </div>
              </div>

              {/* SECTION B: Event Banner Image */}
              <div className="space-y-4">
                <div className="border-b border-[#374151] pb-3">
                  <h3 className="text-base font-bold text-[#F8FAFC] font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                    <Calendar size={18} className="text-[#00ADB5]" />
                    <span>Section B: Event Banner Image</span>
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Images are stored directly on the local server in{" "}
                    <code className="bg-[#111827] px-1.5 py-0.5 rounded text-[#00ADB5] border border-[#374151] font-mono text-[11px]">
                      uploads/events/
                    </code>{" "}
                    (Max 5MB: JPG, PNG, WebP).
                  </p>
                </div>

                <ImageUpload
                  onFileSelect={(file) => setSelectedImageFile(file)}
                  label="Select Banner Image from Computer"
                  helperText="Supported formats: JPG, PNG, WebP (Max size: 5MB). File will be uploaded securely via Multer."
                />
              </div>

              {/* SECTION C: Event Date and Time (IST) */}
              <div className="space-y-4">
                <div className="border-b border-[#374151] pb-3">
                  <h3 className="text-base font-bold text-[#F8FAFC] font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                    <Clock size={18} className="text-[#00ADB5]" />
                    <span>Section C: Event Date and Time (Indian Standard Time - IST)</span>
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Timestamps are standardized with the <code className="bg-[#111827] px-1.5 py-0.5 rounded text-[#00ADB5] border border-[#374151] font-mono text-[11px]">+05:30</code> offset.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Start Date & Time */}
                  <div className="p-4 bg-[#111827] border border-[#374151] rounded-2xl space-y-3">
                    <span className="text-xs font-bold text-[#F8FAFC] block">
                      Start Schedule *
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#94A3B8] mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          required
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="[color-scheme:dark] w-full px-3 py-2 bg-[#1F2937] border border-[#374151] rounded-xl text-xs text-[#F8FAFC] focus:border-[#00ADB5] focus:outline-none cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#94A3B8] mb-1">
                          Start Time (IST)
                        </label>
                        <input
                          type="time"
                          required
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="[color-scheme:dark] w-full px-3 py-2 bg-[#1F2937] border border-[#374151] rounded-xl text-xs text-[#F8FAFC] focus:border-[#00ADB5] focus:outline-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* End Date & Time */}
                  <div className="p-4 bg-[#111827] border border-[#374151] rounded-2xl space-y-3">
                    <span className="text-xs font-bold text-[#F8FAFC] block">
                      End Schedule *
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#94A3B8] mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          required
                          value={endDate}
                          min={startDate || undefined}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="[color-scheme:dark] w-full px-3 py-2 bg-[#1F2937] border border-[#374151] rounded-xl text-xs text-[#F8FAFC] focus:border-[#00ADB5] focus:outline-none cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#94A3B8] mb-1">
                          End Time (IST)
                        </label>
                        <input
                          type="time"
                          required
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="[color-scheme:dark] w-full px-3 py-2 bg-[#1F2937] border border-[#374151] rounded-xl text-xs text-[#F8FAFC] focus:border-[#00ADB5] focus:outline-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION D: Venue Information */}
              <div className="space-y-4">
                <div className="border-b border-[#374151] pb-3">
                  <h3 className="text-base font-bold text-[#F8FAFC] font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                    <Building2 size={18} className="text-[#00ADB5]" />
                    <span>Section D: Venue Information</span>
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Physical location details for attendee directions and ticket passes.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#CBD5E1] mb-1.5">
                      Venue Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. City Convention Hall"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      className="w-full px-4 py-3 bg-[#111827] border border-[#374151] rounded-xl text-sm text-[#F8FAFC] placeholder-[#94A3B8] focus:border-[#00ADB5] focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#CBD5E1] mb-1.5">
                      Full Address *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Near MI Road, C-Scheme"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-3 bg-[#111827] border border-[#374151] rounded-xl text-sm text-[#F8FAFC] placeholder-[#94A3B8] focus:border-[#00ADB5] focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#CBD5E1] mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jaipur"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 bg-[#111827] border border-[#374151] rounded-xl text-sm text-[#F8FAFC] placeholder-[#94A3B8] focus:border-[#00ADB5] focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION E: Capacity and Publishing */}
              <div className="space-y-4">
                <div className="border-b border-[#374151] pb-3">
                  <h3 className="text-base font-bold text-[#F8FAFC] font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                    <Users size={18} className="text-[#00ADB5]" />
                    <span>Section E: Capacity and Publishing</span>
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Set attendance limits and choose whether to save as draft or publish immediately.
                  </p>
                </div>

                <div className="max-w-xs">
                  <label className="block text-xs font-bold text-[#CBD5E1] mb-1.5">
                    Maximum Capacity (Max Attendees) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-[#111827] border border-[#374151] rounded-xl text-sm text-[#F8FAFC] placeholder-[#94A3B8] focus:border-[#00ADB5] focus:outline-none transition-all"
                  />
                  <span className="text-[11px] text-[#94A3B8] mt-1 block">
                    Public registrations or private RSVPs will halt once capacity is reached.
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS (Save as Draft & Publish Event) */}
              <div className="pt-6 flex flex-wrap items-center justify-end gap-3 border-t border-[#374151]">
                <button
                  type="button"
                  onClick={() => navigate("/organizer/events")}
                  className="px-6 py-3 text-sm font-semibold text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#293548] rounded-xl transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSubmit("draft")}
                  className="px-6 py-3.5 bg-[#293548] hover:bg-[#374151] text-[#CBD5E1] border border-[#374151] font-bold text-sm rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save size={16} />
                  <span>Save as Draft</span>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSubmit("published")}
                  className="px-8 py-3.5 bg-[#00ADB5] hover:bg-[#00949B] text-[#111827] font-bold text-sm rounded-xl transition-all shadow-md shadow-[#00ADB5]/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <CircularProgress size={16} sx={{ color: "#111827" }} />
                      <span>Creating Event...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Publish Event</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};