# Implementation Plan: VUON AI SPACE Frontend MVP

**Mode:** --hard  
**Risk:** high-risk — Touches JWT Authentication, Supabase Auth integration, role-based access control (Admin vs Member), and state mutation across 6 core domain modules.  
**Spec Reference:** `plans/vuon-ai-space-fe/spec.md`  
**Design Direction:** Clean Modern Tech (Linear / Vercel inspired aesthetic with dark canvas `#0A0D12`, crisp 1px borders `#1F2937`, Geist/Inter font hierarchy, subtle micro-interactions).  

---

## Executive Summary

Hệ thống Frontend **VUON AI SPACE** được xây dựng trên nền tảng **React 18 + Vite + TypeScript**, tiêu thụ RESTful API từ backend **.NET 8 Clean Architecture**. Ứng dụng cung cấp cổng thông tin và bảng điều khiển trực quan cho cộng đồng sáng tạo công nghệ (AI, Robotics, IoT, Embedded Systems), hỗ trợ kết nối tài năng, quản lý ý tưởng, phát triển dự án, mượn thiết bị phần cứng và đăng ký sự kiện.

---

## Architecture & Tech Stack

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        React Router DOM v6 Routes                      │
│   Public Landing | Directory | Idea Board | Projects | Equipment | Admin │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  TanStack Query v5 + Axios Client Layer                │
│   JWT Auth Interceptor | Base URL (/api/v1) | Error Toast Handler       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  Clean Modern Tech UI Components                       │
│   TailwindCSS + CSS Modules | Lucide Icons | Radix UI Primitives        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Backend .NET 8 Web API Server                      │
│   https://localhost:7198/api/v1 (or http://localhost:5246/api/v1)      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Phases Overview & Spec Mapping

| Phase | Tên Phase | User Stories Covered | File Chi tiết |
|---|---|---|---|
| **Phase 1** | Project Initialization & Auth Core | `[P1]` Auth & Login/Register, JWT Interceptors | `phase-01-core-setup-and-auth.md` |
| **Phase 2** | Profile & Skill Directory Module | `[P1]` Member Profile & Skill Tag Search | `phase-02-profile-and-skill-directory.md` |
| **Phase 3** | Idea Board & Idea-to-Project Conversion | `[P1]` Idea Board, Comments, Conversion | `phase-03-idea-board-and-conversion.md` |
| **Phase 4** | Project Hub & Team Join Management | `[P1]` Project Catalog, Join Requests, Leader Approval | `phase-04-project-hub-and-teams.md` |
| **Phase 5** | Equipment Sharing & Booking System | `[P1]` Hardware Catalog, Overlap-free Booking | `phase-05-equipment-booking-system.md` |
| **Phase 6** | Event Hub & Admin Console | `[P1]` Event Catalog, Admin Dashboard & Controls | `phase-06-event-hub-and-admin-console.md` |

---

## File Ownership & Layout Matrix

```text
src/
 ├── assets/             # Global CSS, SVGs, Fonts
 ├── components/         # Reusable UI Primitives (Button, Modal, Card, Badge, Input)
 ├── context/            # AuthContext (JWT decode, User State)
 ├── hooks/              # Custom hooks (useAuth, useDebounce)
 ├── layouts/            # RootLayout, Navbar, Footer, AdminLayout
 ├── pages/              # Landing, Login, Directory, Ideas, Projects, Equipment, Events, Admin
 ├── services/           # Axios instance & API Service modules (authService, ideaService...)
 ├── types/              # TypeScript Interfaces (User, Idea, Project, Equipment, Booking)
 └── utils/              # Helper functions (formatDate, jwtHelper)
```

---

## Red-Team Review & Risk Mitigation

1. **JWT Expiration & Token Sync:**
   - *Risk:* JWT Token từ Supabase Auth hết hạn dẫn đến API trả về HTTP `401 Unauthorized`.
   - *Mitigation:* Cấu hình Axios Response Interceptor tự động xóa token hỏng, chuyển hướng về `/login` kèm thông báo Toast hợp lý.
2. **Overlap Booking Validation UI:**
   - *Risk:* Người dùng chọn khoảng ngày đã bị đăng ký mượn trước đó cho cùng một thiết bị.
   - *Mitigation:* Frontend hiển thị trạng thái thiết bị thực tế (`Available`, `Borrowed`), đồng thời xử lý bắt lỗi 400 từ DB backend khi trùng lịch (`StartDate <= reqEndDate && EndDate >= reqStartDate`).
3. **Race Condition khi Duyệt Thành viên Dự án:**
   - *Risk:* Trạng thái Join Request thay đổi trên Server nhưng UI chưa cập nhật.
   - *Mitigation:* Sử dụng `queryClient.invalidateQueries({ queryKey: ['project', id] })` ngay sau khi gọi API approve thành công.
