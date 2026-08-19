# Phase 1: Project Initialization, Design System & Auth Core

**Goal:** Khởi tạo dự án React + Vite + TypeScript, thiết lập Clean Modern Tech UI System, cấu hình React Router DOM, Axios Client, TanStack Query và hệ thống Đăng nhập / Đăng ký / Token Auth.

---

## User Stories & Scope

- **[P1]** Visitor/Member register and sign in with JWT authentication.
- **[P1]** Persist JWT token, decode user claims (sub, role, email), and handle protected routes.

---

## Detailed Task Checklist

- [ ] **1.1. Setup Project & Dependencies**
  - Install dependencies: `react-router-dom`, `@tanstack/react-query`, `axios`, `lucide-react`, `jwt-decode`, `clsx`, `tailwind-merge`.
  - Setup Tailwind CSS & CSS Variables for Clean Modern Tech Theme (`#0A0D12` background, 1px border system).

- [ ] **1.2. API Client & Auth Service Setup (`src/services/`)**
  - Create `apiClient.ts`: Base Axios instance with `baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5246/api/v1'`.
  - Add Request Interceptor: Attach `Authorization: Bearer <token>` from LocalStorage.
  - Add Response Interceptor: Catch 401 errors, clear token, and redirect to `/login`.

- [ ] **1.3. Auth Context & JWT Helper (`src/context/AuthContext.tsx`)**
  - Decode JWT claims (`sub` -> User ID, `role` -> Global Role: Visitor, Member, LabManager, Admin).
  - Expose `user`, `token`, `login()`, `logout()`, `isAuthenticated`, `isAdmin`.

- [ ] **1.4. Layouts & Navigation (`src/layouts/`)**
  - `Navbar.tsx`: Responsive navigation with VUON AI SPACE logo, Zone quick links, User Profile Menu / Login button.
  - `Footer.tsx`: Modern footer with community links, lab locations, social links.
  - `RootLayout.tsx`: Header + Main Outlet + Footer + Toast Container.

- [ ] **1.5. Auth Pages & Protected Routes (`src/pages/auth/`)**
  - `LoginPage.tsx`: Clean Modern Tech login form with email & password.
  - `RegisterPage.tsx`: Sign up form with role interest selection.
  - `ProtectedRoute.tsx`: Guard component restricting access based on auth status and role requirements.

---

## Verification Criteria

- [ ] `npm run build` passes with 0 TypeScript errors.
- [ ] Navigating to `/login` allows submitting credentials and storing JWT token.
- [ ] Unauthenticated users attempting to access protected routes are redirected to `/login`.
