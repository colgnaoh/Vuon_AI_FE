# Phase 4: Project Hub & Team Join Management

**Goal:** Phát triển trang Danh mục Dự án (`/projects`), Chi tiết dự án, Tạo dự án mới, Gửi yêu cầu xin tham gia dự án (Join Request), và giao diện duyệt thành viên dành cho Project Leader.

---

## User Stories & Scope

- **[P1]** Members browse tech projects, filter by domain, and submit join requests.
- **[P1]** Project Leaders manage project settings, update status, and approve/reject team join requests.

---

## Detailed Task Checklist

- [ ] **4.1. Project Service & Data Types (`src/services/projectService.ts`)**
  - Define `ProjectDTO`, `ProjectMemberDTO`, `CreateProjectDTO`.
  - API Integration:
    - `GET /api/v1/projects` -> Fetch projects list.
    - `GET /api/v1/projects/{id}` -> Fetch project details & member list.
    - `POST /api/v1/projects` -> Create new project.
    - `POST /api/v1/projects/{id}/join` -> Send join request.
    - `PATCH /api/v1/projects/{id}/members/{targetUserId}/approve` -> Leader approves join request.
    - `PATCH /api/v1/projects/{id}/status` -> Update project status (`Building`, `Completed`, `Paused`).

- [ ] **4.2. Project Catalog Page (`src/pages/projects/ProjectsPage.tsx`)**
  - Category filters: All, AI/Vision, Robotics/ROS2, Smart IoT, Embedded Systems, Automation.
  - Project Cards: Cover gradient/thumbnail, project title, leader avatar, team size badge, technology stack pills.

- [ ] **4.3. Project Detail Page (`src/pages/projects/ProjectDetailPage.tsx`)**
  - Tabbed interface: Overview, Team Members, Required Roles, Equipment Used, Updates/Milestones.
  - "Apply to Join Team" button with message modal.

- [ ] **4.4. Project Management Dashboard (`src/pages/projects/ProjectManagePage.tsx`)**
  - Leader View: List of pending join requests with Applicant Profile preview, "Approve" & "Reject" buttons.
  - Project status selector toggle.

---

## Verification Criteria

- [ ] Users can browse projects by domain tags.
- [ ] Clicking "Join Project" sends a request (`POST /projects/{id}/join`).
- [ ] Project Leader can view pending requests and approve member status from `Pending` to `Active`.
