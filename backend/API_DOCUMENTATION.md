# EventFlow – Universal Event Management Platform
## Complete Backend API Documentation & Testing Guide

**Base URL**: `http://localhost:5000`  
**Database**: MongoDB Atlas (`eventflow_db`)  
**Timezone**: Indian Standard Time (`IST` / `Asia/Kolkata` / `UTC+05:30`)

---

## Table of Contents
1. [Authentication Setup & Headers](#1-authentication-setup--headers)
2. [Module 1 & 2: Event Management & Discovery APIs](#2-module-1--2-event-management--discovery-apis)
3. [Module 3: Public Event Registration APIs](#3-module-3-public-event-registration-apis)
4. [Module 4: Private Event Invitation APIs](#4-module-4-private-event-invitation-apis)
5. [Module 5: My Registrations, Invitations & Event Participants](#5-module-5-my-registrations-invitations--event-participants)
6. [Module 6 & 7: Attendance Management (QR Check-In)](#6-module-6--7-attendance-management-qr-check-in)
7. [Module 8 & 9: Organizer & Admin Dashboards](#7-module-8--9-organizer--admin-dashboards)
8. [Recommended Viva / Demo Workflow](#8-recommended-viva--demo-workflow)

---

## 1. Authentication Setup & Headers

### How to use Authorization in Postman
For all protected routes, add the following header:
- **Key**: `Authorization`
- **Value**: `Bearer <YOUR_JWT_TOKEN>`

---

### API 1: Register User
Registers a new user. Public registration automatically assigns `role: "guest"`.

- **Method**: `POST`
- **URL**: `http://localhost:5000/api/auth/register`
- **Access**: Public
- **Headers**:
  ```http
  Content-Type: application/json
  ```
- **Raw Request Body**:
  ```json
  {
    "fullName": "Sameer Rangrej",
    "email": "sameer@example.com",
    "password": "password123"
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "user": {
      "_id": "6aec3b0b01401c13348bf0db",
      "fullName": "Sameer Rangrej",
      "email": "sameer@example.com",
      "role": "guest"
    }
  }
  ```

---

### API 2: User Login
Authenticates credentials and returns a JWT token (valid for 1 day).

- **Method**: `POST`
- **URL**: `http://localhost:5000/api/auth/login`
- **Access**: Public
- **Headers**:
  ```http
  Content-Type: application/json
  ```
- **Raw Request Body**:
  ```json
  {
    "email": "sameer@example.com",
    "password": "password123"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "6aec3b0b01401c13348bf0db",
      "fullName": "Sameer Rangrej",
      "email": "sameer@example.com",
      "role": "organizer"
    }
  }
  ```
*(Note: To test Organizer/Admin endpoints, change `role` to `"organizer"` or `"admin"` in MongoDB Atlas and log in).*

---

### API 3: Get User Profile
Returns the authenticated user's profile details (excluding password).

- **Method**: `GET`
- **URL**: `http://localhost:5000/api/auth/profile`
- **Access**: Authenticated (`Bearer <TOKEN>`)
- **Headers**:
  ```http
  Authorization: Bearer <TOKEN>
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "User profile fetched successfully",
    "user": {
      "_id": "6aec3b0b01401c13348bf0db",
      "fullName": "Sameer Rangrej",
      "email": "sameer@example.com",
      "role": "organizer",
      "profileImage": "",
      "createdAt": "2026-11-05T08:25:45.601Z"
    }
  }
  ```

---

## 2. Module 1 & 2: Event Management & Discovery APIs

### API 4: Create Event (Public or Private)
Creates an event. `organizerId` is automatically linked from the JWT token. Supports IST timestamps (`startDateIST` / `endDateIST`).

- **Method**: `POST`
- **URL**: `http://localhost:5000/api/events`
- **Access**: Organizer / Admin
- **Headers**:
  ```http
  Content-Type: application/json
  Authorization: Bearer <ORGANIZER_TOKEN>
  ```
- **Raw Request Body (Public Event with IST)**:
  ```json
  {
    "title": "Annual Music Concert - Mega Concert",
    "category": "concert",
    "eventType": "public",
    "description": "A live music concert in Jaipur",
    "startDate": "2026-12-20T18:00:00+05:30",
    "endDate": "2026-12-20T22:00:00+05:30",
    "venue": "City Convention Hall",
    "address": "Main Road",
    "city": "Jaipur",
    "capacity": 500,
    "status": "published"
  }
  ```
- **Raw Request Body (Private Event with IST)**:
  ```json
  {
    "title": "Private Royal Wedding",
    "category": "wedding",
    "eventType": "private",
    "description": "Exclusive private family wedding",
    "startDate": "2026-12-25T10:00:00+05:30",
    "endDate": "2026-12-25T20:00:00+05:30",
    "venue": "Grand Heritage Palace",
    "address": "Lake Palace Road",
    "city": "Udaipur",
    "capacity": 100,
    "status": "published"
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Event created successfully",
    "event": {
      "_id": "6aec3d8901401c13348bf0de",
      "organizerId": "6aec3b0b01401c13348bf0db",
      "title": "Annual Music Concert - Mega Concert",
      "category": "concert",
      "eventType": "public",
      "description": "A live music concert in Jaipur",
      "startDate": "2026-12-20T12:30:00.000Z",
      "startDateIST": "20 Dec 2026, 6:00 pm IST",
      "endDate": "2026-12-20T16:30:00.000Z",
      "endDateIST": "20 Dec 2026, 10:00 pm IST",
      "venue": "City Convention Hall",
      "address": "Main Road",
      "city": "Jaipur",
      "capacity": 500,
      "status": "published"
    }
  }
  ```

---

### API 5: Get All Public Events (Discovery & Filters)
Returns only published public events. Supports filtering query parameters: `category`, `city`, `search` (keyword in title), `startDate`, `endDate`.

- **Method**: `GET`
- **URL**: `http://localhost:5000/api/events`  
  *(With filters: `http://localhost:5000/api/events?category=concert&city=Jaipur&search=Music`)*
- **Access**: Public
- **Headers**: None
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "count": 1,
    "events": [
      {
        "_id": "6aec3d8901401c13348bf0de",
        "title": "Annual Music Concert - Mega Concert",
        "category": "concert",
        "eventType": "public",
        "city": "Jaipur",
        "startDateIST": "20 Dec 2026, 6:00 pm IST",
        "endDateIST": "20 Dec 2026, 10:00 pm IST",
        "organizerId": {
          "_id": "6aec3b0b01401c13348bf0db",
          "fullName": "Sameer Rangrej",
          "email": "sameer@example.com"
        }
      }
    ]
  }
  ```

---

### API 6: Get Organizer's Own Events
Returns all events created by the logged-in organizer.

- **Method**: `GET`
- **URL**: `http://localhost:5000/api/events/my-events`
- **Access**: Organizer / Admin
- **Headers**:
  ```http
  Authorization: Bearer <ORGANIZER_TOKEN>
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "count": 2,
    "events": [...]
  }
  ```

---

### API 6B: Get All Private Events (Admin Only)
Allows an Admin to view all private events across the entire platform. Supports filtering by `status`, `city`, `category`, and `search`.

- **Method**: `GET`
- **URL**: `http://localhost:5000/api/events/admin/private-events`  
  *(Alias: `http://localhost:5000/api/events/admin/private`)*  
  *(With filters: `http://localhost:5000/api/events/admin/private-events?city=Udaipur&status=published`)*
- **Access**: Admin Only (`adminOnly` middleware)
- **Headers**:
  ```http
  Authorization: Bearer <ADMIN_TOKEN>
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "count": 1,
    "events": [
      {
        "_id": "6aed75ab6954310bb20ac255",
        "title": "Private Royal Wedding",
        "category": "wedding",
        "eventType": "private",
        "description": "Exclusive private family wedding",
        "startDateIST": "25 Dec 2026, 10:00 am IST",
        "endDateIST": "25 Dec 2026, 8:00 pm IST",
        "venue": "Grand Heritage Palace",
        "city": "Udaipur",
        "capacity": 100,
        "status": "published",
        "organizerId": {
          "_id": "6aec3b0b01401c13348bf0db",
          "fullName": "Sameer Rangrej",
          "email": "sameer@example.com"
        }
      }
    ]
  }
  ```

---

### API 7: Get Single Event Details
Returns details of a specific event. Public events can be viewed by anyone; private events require organizer, admin, or invited guest permissions.

- **Method**: `GET`
- **URL**: `http://localhost:5000/api/events/<EVENT_ID>`
- **Access**: Public (for public events) / Protected (for private events)
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "event": {
      "_id": "6aec3d8901401c13348bf0de",
      "title": "Annual Music Concert - Mega Concert",
      "category": "concert",
      "eventType": "public",
      "startDateIST": "20 Dec 2026, 6:00 pm IST",
      "endDateIST": "20 Dec 2026, 10:00 pm IST",
      "venue": "City Convention Hall",
      "city": "Jaipur"
    }
  }
  ```

---

### API 8: Update Event
Allows event owner or admin to update event details.

- **Method**: `PUT`
- **URL**: `http://localhost:5000/api/events/<EVENT_ID>`
- **Access**: Event Owner / Admin
- **Headers**:
  ```http
  Content-Type: application/json
  Authorization: Bearer <ORGANIZER_TOKEN>
  ```
- **Raw Request Body**:
  ```json
  {
    "title": "Annual Music Concert - Mega Concert (Updated)",
    "capacity": 600
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Event updated successfully",
    "event": { ... }
  }
  ```

---

### API 9: Delete Event
Deletes the event and automatically deletes all associated participants and attendance records (cascade delete).

- **Method**: `DELETE`
- **URL**: `http://localhost:5000/api/events/<EVENT_ID>`
- **Access**: Event Owner / Admin
- **Headers**:
  ```http
  Authorization: Bearer <ORGANIZER_TOKEN>
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Event and related records deleted successfully"
  }
  ```

---

## 3. Module 3: Public Event Registration APIs

### API 10: Register for a Public Event
Registers an authenticated guest for a public published event and generates a unique QR token and QR Code Data URL.

- **Method**: `POST`
- **URL**: `http://localhost:5000/api/participants/register/<PUBLIC_EVENT_ID>`
- **Access**: Authenticated Guest / User
- **Headers**:
  ```http
  Content-Type: application/json
  Authorization: Bearer <GUEST_TOKEN>
  ```
- **Raw Request Body**:
  ```json
  {
    "name": "Sameer Rangrej",
    "email": "sameer@example.com"
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "participant": {
      "_id": "6aed76846954310bb20ac25c",
      "eventId": "6aec3d8901401c13348bf0de",
      "userId": "6aec3b0b01401c13348bf0db",
      "name": "Sameer Rangrej",
      "email": "sameer@example.com",
      "participationType": "registration",
      "status": "registered",
      "qrToken": "63efad810f9bd48431ee26995445ade3",
      "createdAt": "2026-11-06T08:45:00.000Z"
    },
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }
  ```

---

## 4. Module 4: Private Event Invitation APIs

### API 11: Invite Guest to Private Event
Allows organizer to invite a guest to their private event and generates a shareable invitation link.

- **Method**: `POST`
- **URL**: `http://localhost:5000/api/participants/invite/<PRIVATE_EVENT_ID>`
- **Access**: Event Owner / Admin
- **Headers**:
  ```http
  Content-Type: application/json
  Authorization: Bearer <ORGANIZER_TOKEN>
  ```
- **Raw Request Body**:
  ```json
  {
    "name": "Aman Sharma",
    "email": "aman@example.com"
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Guest invited successfully",
    "participant": {
      "_id": "6aed8d61f386c79bada64f81",
      "eventId": "6aed75ab6954310bb20ac255",
      "name": "Aman Sharma",
      "email": "aman@example.com",
      "participationType": "invitation",
      "status": "invited",
      "createdAt": "2026-11-06T08:50:00.000Z"
    },
    "invitationLink": "http://localhost:5173/invitation/6aed8d61f386c79bada64f81"
  }
  ```

---

### API 12: View Invitation Details
Allows the invitee to preview the event details from their invitation link.

- **Method**: `GET`
- **URL**: `http://localhost:5000/api/participants/invitation/<PARTICIPANT_ID>`
- **Access**: Public / Invitee
- **Headers**: None
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "invitation": {
      "_id": "6aed8d61f386c79bada64f81",
      "eventId": {
        "_id": "6aed75ab6954310bb20ac255",
        "title": "Private Royal Wedding",
        "category": "wedding",
        "venue": "Grand Heritage Palace",
        "city": "Udaipur"
      },
      "name": "Aman Sharma",
      "email": "aman@example.com",
      "participationType": "invitation",
      "status": "invited"
    }
  }
  ```

---

### API 13: Accept Invitation
Updates invitation status to `"accepted"` and generates a QR code ticket.

- **Method**: `PUT`
- **URL**: `http://localhost:5000/api/participants/invitation/<PARTICIPANT_ID>/accept`
- **Access**: Public / Authenticated Guest
- **Headers**:
  ```http
  Authorization: Bearer <GUEST_TOKEN> (Optional)
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Invitation accepted successfully",
    "participant": {
      "_id": "6aed8d61f386c79bada64f81",
      "name": "Aman Sharma",
      "email": "aman@example.com",
      "status": "accepted",
      "qrToken": "7b8e9f0123456789abcdef1234567890"
    },
    "qrCode": "data:image/png;base64,iVBORw0KGgo..."
  }
  ```

---

### API 14: Decline Invitation
Updates invitation status to `"declined"`.

- **Method**: `PUT`
- **URL**: `http://localhost:5000/api/participants/invitation/<PARTICIPANT_ID>/decline`
- **Access**: Public / Invitee
- **Headers**: None
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Invitation declined successfully",
    "participant": {
      "_id": "6aed8d61f386c79bada64f81",
      "status": "declined"
    }
  }
  ```

---

## 5. Module 5: My Registrations, Invitations & Event Participants

### API 15: Get My Registrations
Returns all public event registrations for the logged-in user.

- **Method**: `GET`
- **URL**: `http://localhost:5000/api/participants/my-registrations`
- **Access**: Authenticated Guest / User
- **Headers**:
  ```http
  Authorization: Bearer <GUEST_TOKEN>
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "count": 1,
    "registrations": [
      {
        "_id": "6aed76846954310bb20ac25c",
        "eventId": {
          "_id": "6aec3d8901401c13348bf0de",
          "title": "Annual Music Concert - Mega Concert",
          "category": "concert",
          "venue": "City Convention Hall",
          "city": "Jaipur"
        },
        "name": "Sameer Rangrej",
        "email": "sameer@example.com",
        "participationType": "registration",
        "status": "registered",
        "qrToken": "63efad810f9bd48431ee26995445ade3"
      }
    ]
  }
  ```

---

### API 16: Get My Invitations
Returns all private event invitations for the logged-in user (matches by user account and email).

- **Method**: `GET`
- **URL**: `http://localhost:5000/api/participants/my-invitations`
- **Access**: Authenticated Guest / User
- **Headers**:
  ```http
  Authorization: Bearer <GUEST_TOKEN>
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "count": 1,
    "invitations": [
      {
        "_id": "6aed8d61f386c79bada64f81",
        "eventId": {
          "_id": "6aed75ab6954310bb20ac255",
          "title": "Private Royal Wedding",
          "category": "wedding",
          "venue": "Grand Heritage Palace",
          "city": "Udaipur"
        },
        "name": "Aman Sharma",
        "email": "aman@example.com",
        "participationType": "invitation",
        "status": "accepted"
      }
    ]
  }
  ```

---

### API 17: Get Participants for an Event
Returns all participants (registrations and invitations) for a specific event.

- **Method**: `GET`
- **URL**: `http://localhost:5000/api/participants/event/<EVENT_ID>`
- **Access**: Event Owner / Admin
- **Headers**:
  ```http
  Authorization: Bearer <ORGANIZER_TOKEN>
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "count": 2,
    "participants": [
      {
        "_id": "6aed76846954310bb20ac25c",
        "name": "Sameer Rangrej",
        "email": "sameer@example.com",
        "participationType": "registration",
        "status": "registered",
        "createdAt": "2026-11-06T08:45:00.000Z"
      }
    ]
  }
  ```

---

## 6. Module 6 & 7: Attendance Management (QR Check-In)

### API 18: QR Code Check-In
Validates the participant's QR token and checks in the attendee. Stores the participant name, event title, and exact Indian Standard Time (`checkedInAtIST`).

- **Method**: `POST`
- **URL**: `http://localhost:5000/api/attendance/check-in`
- **Access**: Event Organizer / Admin
- **Headers**:
  ```http
  Content-Type: application/json
  Authorization: Bearer <ORGANIZER_TOKEN>
  ```
- **Raw Request Body**:
  ```json
  {
    "qrToken": "63efad810f9bd48431ee26995445ade3",
    "eventId": "6aec3d8901401c13348bf0de"
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Guest checked in successfully",
    "attendance": {
      "_id": "6aed95d714b22abb75c39d7b",
      "participantId": "6aed76846954310bb20ac25c",
      "participantName": "Sameer Rangrej",
      "name": "Sameer Rangrej",
      "eventId": "6aec3d8901401c13348bf0de",
      "eventTitle": "Annual Music Concert - Mega Concert",
      "checkedInAt": "2026-11-06T09:45:00.000Z",
      "checkedInAtIST": "6 Nov 2026, 3:15:00 pm IST",
      "checkedInBy": "6aec3b0b01401c13348bf0db"
    },
    "participant": {
      "_id": "6aed76846954310bb20ac25c",
      "name": "Sameer Rangrej",
      "email": "sameer@example.com",
      "participationType": "registration",
      "status": "registered"
    }
  }
  ```
*(Note: Attempting to check in the same guest a second time returns `409 Conflict`).*

---

### API 19: Get Event Attendance List
Returns the list of all checked-in attendees for an event, including their names, IDs, and IST check-in times.

- **Method**: `GET`
- **URL**: `http://localhost:5000/api/attendance/event/<EVENT_ID>`  
  *(or `http://localhost:5000/api/attendance/<EVENT_ID>`)*
- **Access**: Event Organizer / Admin
- **Headers**:
  ```http
  Authorization: Bearer <ORGANIZER_TOKEN>
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "count": 1,
    "attendance": [
      {
        "_id": "6aed95d714b22abb75c39d7b",
        "participantId": "6aed76846954310bb20ac25c",
        "participantName": "Sameer Rangrej",
        "name": "Sameer Rangrej",
        "participantEmail": "sameer@example.com",
        "participationType": "registration",
        "status": "registered",
        "eventId": "6aec3d8901401c13348bf0de",
        "eventTitle": "Annual Music Concert - Mega Concert",
        "checkedInBy": "6aec3b0b01401c13348bf0db",
        "checkedInByName": "Sameer Rangrej",
        "checkedInAt": "2026-11-06T09:45:00.000Z",
        "checkedInAtIST": "6 Nov 2026, 3:15:00 pm IST"
      }
    ]
  }
  ```

---

## 7. Module 8 & 9: Organizer & Admin Dashboards

### API 20: Organizer Dashboard
Returns organizer metrics along with detailed lists containing `_id`, `name`, and `title` for all events, participants, registered guests, invitees, and checked-in attendees.

- **Method**: `GET`
- **URL**: `http://localhost:5000/api/dashboard/organizer`
- **Access**: Organizer / Admin
- **Headers**:
  ```http
  Authorization: Bearer <ORGANIZER_TOKEN>
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "dashboard": {
      "totalEvents": 2,
      "publishedEventsCount": 2,
      "draftEventsCount": 0,
      "cancelledEventsCount": 0,
      "events": [
        {
          "_id": "6aec3d8901401c13348bf0de",
          "title": "Annual Music Concert - Mega Concert",
          "category": "concert",
          "eventType": "public",
          "status": "published"
        }
      ],
      "totalParticipants": 2,
      "participants": [
        {
          "_id": "6aed76846954310bb20ac25c",
          "name": "Sameer Rangrej",
          "email": "sameer@example.com",
          "status": "registered",
          "participationType": "registration",
          "eventId": "6aec3d8901401c13348bf0de"
        },
        {
          "_id": "6aed8d61f386c79bada64f81",
          "name": "Aman Sharma",
          "email": "aman@example.com",
          "status": "accepted",
          "participationType": "invitation",
          "eventId": "6aed75ab6954310bb20ac255"
        }
      ],
      "registeredGuestsCount": 1,
      "registeredGuests": [
        {
          "_id": "6aed76846954310bb20ac25c",
          "name": "Sameer Rangrej",
          "email": "sameer@example.com",
          "eventId": "6aec3d8901401c13348bf0de"
        }
      ],
      "acceptedInvitationsCount": 1,
      "acceptedInvitations": [
        {
          "_id": "6aed8d61f386c79bada64f81",
          "name": "Aman Sharma",
          "email": "aman@example.com",
          "eventId": "6aed75ab6954310bb20ac255"
        }
      ],
      "totalAttendeesCheckedIn": 1,
      "checkedInAttendees": [
        {
          "_id": "6aed95d714b22abb75c39d7b",
          "participantId": "6aed76846954310bb20ac25c",
          "name": "Sameer Rangrej",
          "email": "sameer@example.com",
          "eventId": "6aec3d8901401c13348bf0de",
          "eventTitle": "Annual Music Concert - Mega Concert",
          "checkedInAt": "2026-11-06T09:45:00.000Z",
          "checkedInAtIST": "6 Nov 2026, 3:15:00 pm IST"
        }
      ]
    }
  }
  ```

---

### API 21: Admin Dashboard
Returns global system-wide metrics and user/event lists.

- **Method**: `GET`
- **URL**: `http://localhost:5000/api/dashboard/admin`
- **Access**: Admin Only
- **Headers**:
  ```http
  Authorization: Bearer <ADMIN_TOKEN>
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "dashboard": {
      "totalUsers": 5,
      "organizers": [
        {
          "_id": "6aec3b0b01401c13348bf0db",
          "fullName": "Sameer Rangrej",
          "email": "sameer@example.com"
        }
      ],
      "guests": [...],
      "totalEvents": 2,
      "publicEvents": [...],
      "privateEvents": [...],
      "totalRegistrations": 1,
      "registrations": [...],
      "totalAttendanceRecords": 1,
      "attendanceRecords": [...]
    }
  }
  ```

---

## 8. Recommended Viva / Demo Workflow

When presenting this project to your examiner or instructor:
1. **Show Registration & Login**: Show that passwords are encrypted using `bcrypt` (with 10 salt rounds) and that JWT tokens are generated.
2. **Create Events**: Create a public concert and a private wedding event, demonstrating proper IST time handling.
3. **Public Discovery**: Call `GET /api/events` and filter by category or city to show that only published public events appear.
4. **Register & QR Ticket**: Register a guest for the concert and show the generated Base64 QR code ticket.
5. **Private Invitation**: Invite a guest to the private wedding, show the shareable link, accept it, and show the private ticket.
6. **QR Check-In**: Check in the guest using `POST /api/attendance/check-in`, demonstrate duplicate prevention, and show the exact check-in time in Indian Standard Time (`IST`).
7. **Dashboards**: Call `GET /api/dashboard/organizer` to display full metrics alongside actual attendee and event names and IDs.
