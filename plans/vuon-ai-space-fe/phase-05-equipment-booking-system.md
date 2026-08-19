# Phase 5: Equipment Sharing & Booking System

**Goal:** Phát triển Danh mục kho Thiết bị phần cứng (`/equipment`), Modal Đặt mượn thiết bị theo khoảng ngày (StartDate -> EndDate) chống trùng lịch, và trang Quản lý lịch mượn cá nhân (`/my-bookings`).

---

## User Stories & Scope

- **[P1]** Members browse lab hardware (Jetson Orin, Raspberry Pi 5, 3D Printer, Robot Arm, Oscilloscope) and check real-time availability.
- **[P1]** Members submit date-range booking requests and return borrowed items.

---

## Detailed Task Checklist

- [ ] **5.1. Equipment Service & Data Types (`src/services/equipmentService.ts`)**
  - Define `EquipmentDTO`, `BookingDTO`, `CreateBookingDTO`.
  - API Integration:
    - `GET /api/v1/equipment` -> Fetch hardware catalog.
    - `GET /api/v1/equipment/{id}` -> Fetch equipment details.
    - `GET /api/v1/equipment/my-bookings` -> Fetch current user's booking history.
    - `POST /api/v1/equipment/{id}/bookings` -> Create date-range booking request (`startDate`, `endDate`, `purpose`).
    - `PATCH /api/v1/equipment/bookings/{bookingId}/return` -> Return borrowed hardware.

- [ ] **5.2. Equipment Catalog Page (`src/pages/equipment/EquipmentPage.tsx`)**
  - Category tabs: AI Workstations, Robotics & Motors, IoT & Microcontrollers, Maker Tools & Soldering, Sensors & Vision.
  - Availability Badge: `Available` (Green), `Borrowed` (Orange), `Maintenance` (Red).

- [ ] **5.3. Date Range Booking Modal (`src/components/equipment/BookingModal.tsx`)**
  - Date inputs: `StartDate` and `EndDate`.
  - Client-side validation: `StartDate >= today` and `EndDate >= StartDate`.
  - Backend Overlap handling: Display clear Toast notification if the DB detects an overlapping active booking (`StartDate <= reqEndDate && EndDate >= reqStartDate`).

- [ ] **5.4. My Bookings Page (`src/pages/equipment/MyBookingsPage.tsx`)**
  - Table of active and past bookings with hardware specs, borrow dates, expected return time, status (`Active`, `Returned`, `ReturnedLate`).
  - 1-Click "Return Equipment" action button.

---

## Verification Criteria

- [ ] Equipment catalog accurately reflects equipment list from `GET /api/v1/equipment`.
- [ ] Submitting valid dates creates a booking and appears in `/my-bookings`.
- [ ] Clicking "Return Equipment" updates status via `PATCH /equipment/bookings/{id}/return`.
