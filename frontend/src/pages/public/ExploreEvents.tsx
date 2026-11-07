import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, MapPin, Filter, Calendar, X, RefreshCw } from "lucide-react";
import { eventService } from "../../services/eventService";
import { EventItem } from "../../types/event.types";
import { EventCard } from "../../components/common/EventCard";
import { Loader } from "../../components/common/Loader";
import { EmptyState } from "../../components/common/EmptyState";
import { formatCategory } from "../../utils/formatUtils";

const CATEGORY_OPTIONS = [
  "wedding",
  "birthday",
  "anniversary",
  "family-function",
  "concert",
  "award-show",
  "festival",
  "conference",
  "seminar",
  "comedy-show",
  "exhibition",
  "other",
];

const POPULAR_CITIES = [
  "Jaipur",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Udaipur",
  "Pune",
  "Goa",
  "Hyderabad",
];

export const ExploreEvents: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || "");
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (category) params.category = category;
      if (city) params.city = city;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const data = await eventService.getPublicEvents(params);
      if (data && data.events) {
        setEvents(data.events);
      }
    } catch (err: any) {
      console.error("Error fetching public events:", err);
      setError("Failed to load events. Please verify backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // Sync state with URL params
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setCategory(searchParams.get("category") || "");
    setCity(searchParams.get("city") || "");
    setStartDate(searchParams.get("startDate") || "");
    setEndDate(searchParams.get("endDate") || "");

    fetchEvents();
  }, [searchParams]);

  const handleApplyFilter = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    if (category) params.set("category", category);
    if (city) params.set("city", city);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);

    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategory("");
    setCity("");
    setStartDate("");
    setEndDate("");
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="min-h-screen bg-[#F8F8FC] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#202033] font-['Plus_Jakarta_Sans']">
            Explore Events
          </h1>
          <p className="text-sm text-[#77778A] mt-1">
            Discover and book amazing public events happening in your area
          </p>
        </div>

        {/* Filter Bar (BookMyShow inspired) */}
        <div className="bg-white p-5 rounded-2xl border border-[#E9E8F0] shadow-sm mb-8 space-y-4">
          <form onSubmit={handleApplyFilter} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="lg:col-span-3 flex items-center gap-2 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl">
              <Search size={18} className="text-[#6C4CE8] shrink-0" />
              <input
                type="text"
                placeholder="Search event by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-sm text-[#202033] placeholder-[#77778A] focus:outline-none"
              />
            </div>

            {/* Category Dropdown */}
            <div className="lg:col-span-2 flex items-center gap-2 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl">
              <Filter size={18} className="text-[#6C4CE8] shrink-0" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-transparent text-sm text-[#202033] focus:outline-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {formatCategory(cat)}
                  </option>
                ))}
              </select>
            </div>

            {/* City Dropdown / Input */}
            <div className="lg:col-span-2 flex items-center gap-2 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl">
              <MapPin size={18} className="text-[#6C4CE8] shrink-0" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-transparent text-sm text-[#202033] focus:outline-none cursor-pointer"
              >
                <option value="">All Cities</option>
                {POPULAR_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div className="lg:col-span-2 flex items-center gap-2 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl">
              <Calendar size={18} className="text-[#6C4CE8] shrink-0" />
              <div className="flex flex-col w-full">
                <span className="text-[10px] text-[#77778A] font-medium leading-none">Start Date</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-xs text-[#202033] focus:outline-none mt-0.5 cursor-pointer"
                />
              </div>
            </div>

            {/* End Date */}
            <div className="lg:col-span-2 flex items-center gap-2 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl">
              <Calendar size={18} className="text-[#6C4CE8] shrink-0" />
              <div className="flex flex-col w-full">
                <span className="text-[10px] text-[#77778A] font-medium leading-none">End Date</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-xs text-[#202033] focus:outline-none mt-0.5 cursor-pointer"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="lg:col-span-1 flex items-center gap-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-[#6C4CE8] hover:bg-[#5032C4] text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
              >
                Search
              </button>
            </div>
          </form>

          {/* Active Filter Tags */}
          {(searchTerm || category || city || startDate || endDate) && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
              <span className="text-xs text-[#77778A] font-medium">Applied Filters:</span>

              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-[#6C4CE8] text-xs font-semibold rounded-full border border-purple-200">
                  Search: {searchTerm}
                  <X size={13} className="cursor-pointer" onClick={() => setSearchTerm("")} />
                </span>
              )}

              {category && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-[#6C4CE8] text-xs font-semibold rounded-full border border-purple-200">
                  Category: {formatCategory(category)}
                  <X size={13} className="cursor-pointer" onClick={() => setCategory("")} />
                </span>
              )}

              {city && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-[#6C4CE8] text-xs font-semibold rounded-full border border-purple-200">
                  City: {city}
                  <X size={13} className="cursor-pointer" onClick={() => setCity("")} />
                </span>
              )}

              {startDate && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-[#6C4CE8] text-xs font-semibold rounded-full border border-purple-200">
                  From: {startDate}
                  <X size={13} className="cursor-pointer" onClick={() => setStartDate("")} />
                </span>
              )}

              {endDate && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-[#6C4CE8] text-xs font-semibold rounded-full border border-purple-200">
                  To: {endDate}
                  <X size={13} className="cursor-pointer" onClick={() => setEndDate("")} />
                </span>
              )}

              <button
                onClick={handleClearFilters}
                className="text-xs text-rose-500 hover:text-rose-700 font-semibold ml-auto transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-semibold text-[#202033]">
            {loading ? "Searching events..." : `${events.length} Events Found`}
          </p>
        </div>

        {/* Events Grid */}
        {loading ? (
          <Loader message="Fetching published events matching your criteria..." />
        ) : error ? (
          <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-center text-rose-700 text-sm">
            {error}
            <div className="mt-4">
              <button
                onClick={fetchEvents}
                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700"
              >
                <RefreshCw size={14} /> Retry
              </button>
            </div>
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            title="No Events Found"
            description="We couldn't find any events matching your selected filters. Try searching with different keywords, categories, or cities."
            actionText="Clear All Filters"
            onAction={handleClearFilters}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
