# Phase 2: Profile & Skill Directory Module

**Goal:** Phát triển trang Hồ sơ cá nhân (`/profile/me`), cập nhật kỹ năng công nghệ (Python, ROS2, ESP32, Jetson, YOLO...) và trang Tra cứu Thư mục Thành viên (`/directory`) theo skill tag.

---

## User Stories & Scope

- **[P1]** Member views and updates tech profile (Bio, Skills, Interests, LookingFor).
- **[P1]** Community members search and filter members by skill tags in the Skill Directory.

---

## Detailed Task Checklist

- [ ] **2.1. TypeScript Types & Profile Service (`src/services/profileService.ts`)**
  - Define `UserProfileDTO`: `id`, `fullName`, `avatarUrl`, `bio`, `skills` (string array), `interests`, `lookingFor`, `globalRole`.
  - API Integration:
    - `GET /api/v1/profiles/me` -> Fetch current user profile.
    - `PUT /api/v1/profiles/me` -> Update user profile details.
    - `GET /api/v1/profiles/search?skill={name}` -> Search community members by tech skill tag.

- [ ] **2.2. Skill Tag Component (`src/components/ui/SkillTag.tsx`)**
  - Reusable pill badge with domain color accents (e.g. AI -> Cyan, Robotics -> Violet, IoT -> Green, Embedded -> Orange).

- [ ] **2.3. User Profile Page (`src/pages/profile/ProfilePage.tsx`)**
  - View mode: Display avatar, full name, global role badge, bio summary, skills list, active projects, equipment bookings.
  - Edit mode: Modal/Form to add/remove skill tags, edit bio, set `lookingFor` preferences.

- [ ] **2.4. Skill Directory Page (`src/pages/directory/DirectoryPage.tsx`)**
  - Search input with debounced API queries (`useDebounce`).
  - Popular skill filter chips (Python, ROS2, ESP32, Jetson Orin, YOLO, PyTorch, C++).
  - Responsive Member Card Grid with avatar, name, skills tags, and "Contact/Invite to Project" actions.

---

## Verification Criteria

- [ ] Updating profile via `/profile/me` successfully calls `PUT /api/v1/profiles/me` and updates local React Query cache.
- [ ] Searching "ROS2" or "ESP32" in `/directory` filters and renders matching member cards.
