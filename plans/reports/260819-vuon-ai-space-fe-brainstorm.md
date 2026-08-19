# Brainstorm: VUON AI SPACE - Frontend MVP Architecture & Design

**Date:** 2026-08-19

## Ideas Explored

1. **Framework Choices:**
   - *Option A: Next.js (App Router + SSR)* — Strong for SEO & hybrid rendering, but introduces extra server/client hydration complexity when pairing with an external .NET 8 Web API.
   - *Option B: React + Vite + TypeScript (SPA)* — **Selected.** Siêu nhẹ, khởi tạo cực nhanh, phát triển mượt mà với TanStack Query + Axios để tiêu thụ .NET 8 RESTful API.

2. **UI/UX Design Directions:**
   - *Direction 1: Dark Cyber-Lab* — Neon glow, glassmorphism, intense cyberpunk feel.
   - *Direction 2: Clean Modern Tech (Linear / Vercel style)* — Initial Dark concept.
   - *Direction 3: Eco-Tech Innovation Hub (Garden Light Theme)* — **Selected (Updated).** Tông nền sáng tinh khôi (`#F8FAFC`), thẻ thông tin màu trắng (`#FFFFFF`), viền 1px sắc nét (`#E2E8F0`), điểm nhấn sắc Xanh Lục Bảo (Emerald Green `#059669`) tượng trưng cho "VƯỜN" ươm mầm + màu Hổ phách/Đồng (Copper/Amber) tượng trưng cho vi mạch phần cứng.

3. **Phase 1 MVP Scope:**
   - Auth + Profile + Skill Directory
   - Project CRUD + Join Request Flow
   - Idea Board + Comments + Team Recruitment
   - Equipment Catalog + Simple Booking Request
   - Event Hub + Event Registration
   - Admin Portal (User & Equipment Management)

## User's Direction

- **Framework:** React 18+ with Vite and TypeScript.
- **Design System:** Eco-Tech Innovation Garden Light Theme (Fresh Emerald Green & Warm Amber hardware accents).
- **Data Fetching & State Management:** TanStack Query (React Query) + Axios.
- **Routing & Security:** React Router DOM v6 with JWT-based Protected Routes (`/admin/*`, `/projects/create`, `/equipment/booking`...).

## Open Questions

- Exact REST endpoints and DTO schema contracts from the .NET 8 Web API backend.
- Avatar/Image storage strategy (Direct Base64 vs. Multipart Form S3/Local Upload API).

## Risks

- **Token Lifecycle:** Managing JWT expiration and Refresh Token rotation seamlessly on the client side.
- **State Synchronization:** Concurrent equipment booking requests or project join requests requiring immediate UI feedback.
