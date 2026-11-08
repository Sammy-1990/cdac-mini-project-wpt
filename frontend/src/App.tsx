import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";
import { ProtectedRoute } from "./components/common/ProtectedRoute";

// Public Pages
import { Home } from "./pages/public/Home";
import { ExploreEvents } from "./pages/public/ExploreEvents";
import { EventDetails } from "./pages/public/EventDetails";
import { Login } from "./pages/public/Login";
import { Register } from "./pages/public/Register";
import { About } from "./pages/public/About";
import { Contact } from "./pages/public/Contact";

// Invitation Page
import { InvitationDetails } from "./pages/invitation/InvitationDetails";

// Guest Pages
import { GuestDashboard } from "./pages/guest/GuestDashboard";
import { MyRegistrations } from "./pages/guest/MyRegistrations";
import { MyInvitations } from "./pages/guest/MyInvitations";
import { MyTickets } from "./pages/guest/MyTickets";

// Organizer Pages
import { OrganizerDashboard } from "./pages/organizer/OrganizerDashboard";
import { MyEvents } from "./pages/organizer/MyEvents";
import { CreateEvent } from "./pages/organizer/CreateEvent";
import { EditEvent } from "./pages/organizer/EditEvent";
import { EventParticipants } from "./pages/organizer/EventParticipants";
import { EventAttendance } from "./pages/organizer/EventAttendance";

// Admin Pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminPrivateEvents } from "./pages/admin/AdminPrivateEvents";
import { ManageUsers } from "./pages/admin/ManageUsers";
import { ManageEvents } from "./pages/admin/ManageEvents";

export const App: React.FC = () => {
  const location = useLocation();

  // Hide public navbar and footer on dashboard and auth pages
  const isDashboardRoute =
    location.pathname.startsWith("/guest/") ||
    location.pathname.startsWith("/organizer/") ||
    location.pathname.startsWith("/admin/");

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="flex flex-col min-h-screen bg-[#111827] text-[#F8FAFC]">
      {!isDashboardRoute && <Navbar />}

      <div className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/events" element={<ExploreEvents />} />
          <Route path="/events/:eventId" element={<EventDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/invitation/:participantId" element={<InvitationDetails />} />

          {/* Guest Protected Routes */}
          <Route
            path="/guest/dashboard"
            element={
              <ProtectedRoute allowedRoles={["guest", "organizer", "admin"]}>
                <GuestDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guest/registrations"
            element={
              <ProtectedRoute allowedRoles={["guest", "organizer", "admin"]}>
                <MyRegistrations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guest/invitations"
            element={
              <ProtectedRoute allowedRoles={["guest", "organizer", "admin"]}>
                <MyInvitations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guest/tickets"
            element={
              <ProtectedRoute allowedRoles={["guest", "organizer", "admin"]}>
                <MyTickets />
              </ProtectedRoute>
            }
          />

          {/* Organizer Protected Routes */}
          <Route
            path="/organizer/dashboard"
            element={
              <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                <OrganizerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/events"
            element={
              <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                <MyEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/events/create"
            element={
              <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/events/:eventId/edit"
            element={
              <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                <EditEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/events/edit/:id"
            element={
              <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                <EditEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/events/:eventId/participants"
            element={
              <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                <EventParticipants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/attendance"
            element={
              <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                <EventAttendance />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/private-events"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPrivateEvents />
              </ProtectedRoute>
            }
          />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>

      {!isDashboardRoute && !isAuthPage && <Footer />}
    </div>
  );
};

export default App;
