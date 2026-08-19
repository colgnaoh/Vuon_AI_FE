# Spec: VUON AI SPACE - Frontend MVP (Phase 1)

**Date:** 2026-08-19  
**Status:** Ready  

---

## Problem Statement

VUON AI SPACE cần một nền tảng web hiện đại, mượt mà và trực quan để kết nối cộng đồng đam mê công nghệ (AI, Robotics, IoT, Embedded Systems, Software). Hệ thống cho phép thành viên đăng ký hồ sơ kỹ năng, đăng tải và tham gia dự án, đề xuất ý tưởng, mượn thiết bị lab, đăng ký sự kiện và quản lý các tài nguyên sáng tạo.

---

## User Stories

<!-- P1 = MVP (must ship), P2 = nice-to-have, P3 = future/out-of-scope -->

- **[P1]** As a **Visitor/Member**, I want to register and login using JWT Authentication so that I can securely access profile features and community actions.  
  *Accepted when:* User can sign up, log in, persist token in storage, see logged-in state in navbar, and log out cleanly.

- **[P1]** As a **Member**, I want to manage my profile and skill tags so that I am discoverable in the Community Skill Directory.  
  *Accepted when:* User can update profile details (skills, bio, interests, contact) and filter members by skill tags in the Directory.

- **[P1]** As a **Member**, I want to browse, create, and submit join requests for projects so that I can collaborate with teams.  
  *Accepted when:* User can view project catalog with category filters (AI, IoT, Robotics), view detail page, create a new project, and click "Join Project" to send a request.

- **[P1]** As an **Innovator**, I want to post ideas on the Idea Board and allow comments so that the community can give feedback and join the idea team.  
  *Accepted when:* User can post an idea card, view discussion comments under each idea, and interact with feedback.

- **[P1]** As a **Member**, I want to view lab equipment catalog (Jetson, Raspberry Pi, 3D Printer, Sensors) and submit simple booking requests so that I can build prototypes.  
  *Accepted when:* Equipment status is visible (Available, Borrowed, Maintenance) and user can submit a simple booking form (Start Date, End Date, Purpose).

- **[P1]** As a **Tech Enthusiast**, I want to browse tech events (Workshops, Tech Talks, Hackathons) and register with 1-click so that I can attend offline/online activities.  
  *Accepted when:* User can view event list, view event schedule/details, and register to receive attendance confirmation.

- **[P1]** As an **Admin/Lab Manager**, I want to access an Admin Console so that I can manage users, approve equipment bookings, and maintain equipment inventory.  
  *Accepted when:* Admin role user can access `/admin`, view user list, and manage equipment status.

- **[P2]** As a **Member**, I want to view notification badges for project join requests and equipment booking approvals.  
  *Accepted when:* Notification dropdown displays recent status updates.

- **[P3]** Interactive 3D Lab Map & Drag-and-Drop Equipment Calendar *(Out of scope for Phase 1 MVP)*.

---

## Functional Requirements

1. **FR-01 (Auth Module):** JWT-based Authentication (Login, Register, Logout, Token persistence, Axios Interceptor for Authorization headers, ProtectedRoute wrapper).
2. **FR-02 (Skill Directory & Profiles):** Profile view/edit form, Skill tags selector, Member Directory page with search & multi-skill filter.
3. **FR-03 (Project Hub):** Project list grid with category badges (AI, Robotics, IoT, Embedded, Software), Project detail modal/page, Create Project wizard, Join request action.
4. **FR-04 (Idea Board):** Masonry/Grid view of community ideas, Idea detail drawer/page, Comment system per idea, "Join Idea Team" button.
5. **FR-05 (Equipment Sharing):** Equipment list with status badges & category filters, Simple Booking Modal (Dates & Purpose), "My Bookings" user history page.
6. **FR-06 (Event Center):** Event timeline/cards (Upcoming & Past), Event detail page, 1-Click "Register Event" button, Registration status indicator.
7. **FR-07 (Admin Console):** Clean side-nav dashboard layout, User Management table (Role toggle), Equipment Inventory CRUD table with status override.

---

## Non-Functional Requirements

- **Performance:** Initial page load < 1.5s on broadband; smooth client-side route transitions using React Router DOM.
- **UI/UX Aesthetics:** **Clean Modern Tech System** inspired by Linear & Vercel — crisp dark/light themes, Geist/Inter font hierarchy, 1px border lines, subtle micro-interactions, responsive grid layout.
- **Code Quality:** Strict TypeScript typing, component modularity, scalable folder structure (`src/components`, `src/pages`, `src/services`, `src/types`, `src/hooks`).
- **Security:** Sanitize user input, handle 401/403 API responses gracefully, secure JWT storage.

---

## Success Criteria

- [ ] All 7 core MVP modules fully created and navigable with responsive desktop and mobile support.
- [ ] Clean TypeScript compilation (`npm run build`) without errors or broken dependencies.
- [ ] Complete API service integration layer configured with base Axios instance connecting to `.NET 8 Web API`.

---

## Out of Scope

- Real-time WebSockets chat or messaging system (Phase 2).
- Payment gateway for paid events or equipment rental fees (All MVP activities are community-free).
- Complex drag-and-drop calendar matrix for equipment (Replaced by Simple Datetime Booking in Phase 1).

---

## Assumptions

- Backend .NET 8 Web API provides CORS support for `http://localhost:5173`.
- Backend endpoints return standard JSON response structures with HTTP status codes (200, 201, 400, 401, 403, 500).
