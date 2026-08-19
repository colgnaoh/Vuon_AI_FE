# Phase 6: Event Hub & Admin Console

**Goal:** Xây dựng Cổng Sự kiện Cộng đồng (`/events`) và Bảng điều khiển Quản trị hệ thống (`/admin/*`) cho Admin/Lab Manager quản lý Metrics, Kho thiết bị và Phân quyền người dùng.

---

## User Stories & Scope

- **[P1]** Members browse upcoming tech events (Workshops, Tech Talks, Hackathons) and register.
- **[P1]** Admins view system metrics dashboard, manage equipment inventory, and update user roles.

---

## Detailed Task Checklist

- [ ] **6.1. Admin Service & Data Types (`src/services/adminService.ts`)**
  - Define `SystemMetricsDTO` (`totalUsers`, `totalIdeas`, `activeProjects`, `activeBookings`, `totalEquipment`).
  - API Integration:
    - `GET /api/v1/admin/metrics` -> Fetch admin dashboard stats.
    - `POST /api/v1/admin/equipment` -> Add new hardware to inventory.
    - `PATCH /api/v1/admin/equipment/{id}/status` -> Update hardware status.
    - `PATCH /api/v1/admin/users/{userId}/role` -> Update user global role (`Visitor`, `Member`, `LabManager`, `Admin`).

- [ ] **6.2. Event Hub Page (`src/pages/events/EventsPage.tsx`)**
  - Event Grid with filter tabs (All, Workshop, Tech Talk, Hackathon, Build Night).
  - Event Cards with Date/Time badge, location, presenter info, registration count.
  - 1-Click "Register Event" button with toast confirmation.

- [ ] **6.3. Admin Layout & Side Navigation (`src/layouts/AdminLayout.tsx`)**
  - Dedicated Admin sidebar (`/admin/dashboard`, `/admin/equipment`, `/admin/users`).
  - Protected by `ProtectedRoute` verifying `user.globalRole === 'admin'`.

- [ ] **6.4. Admin Dashboard Page (`src/pages/admin/AdminDashboardPage.tsx`)**
  - Stat Cards: Total Members, Total Ideas, Active Projects, Hardware Borrowed, Total Devices.
  - Quick action shortcuts (Add Equipment, Change User Role).

- [ ] **6.5. Admin Inventory & User Management Pages (`src/pages/admin/`)**
  - `AdminEquipmentPage.tsx`: Hardware inventory data table, Add new device modal, Status toggle select.
  - `AdminUsersPage.tsx`: Community member table, Role dropdown selector (`Member` ↔ `LabManager` ↔ `Admin`).

---

## Verification Criteria

- [ ] Non-admin users attempting to access `/admin/*` receive 403 Forbidden / redirect.
- [ ] Admin dashboard correctly renders System Metrics from `GET /api/v1/admin/metrics`.
- [ ] Adding new equipment updates the catalog view instantly.
