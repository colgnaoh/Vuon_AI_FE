# Phase 3: Idea Board & Idea-to-Project Conversion

**Goal:** Phát triển trang Idea Board (`/ideas`), Đăng ý tưởng mới, Bình luận thảo luận, và tính năng độc đáo: Chuyển đổi Ý tưởng thành Dự án chính thức (`ConvertIdeaToProject`).

---

## User Stories & Scope

- **[P1]** Innovators post ideas, receive comments, and recruit team members.
- **[P1]** Idea authors can convert matured ideas into official Projects.

---

## Detailed Task Checklist

- [ ] **3.1. Idea Service & Data Types (`src/services/ideaService.ts`)**
  - Define `IdeaDTO`, `CommentDTO`, `CreateIdeaDTO`.
  - API Integration:
    - `GET /api/v1/ideas` -> Fetch list of community ideas.
    - `GET /api/v1/ideas/{id}` -> Fetch idea detail with comments.
    - `POST /api/v1/ideas` -> Post new idea.
    - `POST /api/v1/ideas/{id}/comments` -> Post comment under an idea.
    - `POST /api/v1/ideas/{id}/convert-to-project` -> Convert idea into an active Project (`ConvertedFromIdeaId`).

- [ ] **3.2. Idea Card & List Component (`src/components/ideas/IdeaCard.tsx`)**
  - Card layout with title, author avatar, category tag, status badge (`Draft`, `Open`, `Converted`), comment count, and timestamp.

- [ ] **3.3. Idea Detail Drawer / Page (`src/pages/ideas/IdeaDetailPage.tsx`)**
  - Main discussion thread with real-time style comment box.
  - "Convert to Project" action button (visible to Idea Author when status is `Open`).

- [ ] **3.4. Create Idea Modal (`src/components/ideas/CreateIdeaModal.tsx`)**
  - Form fields: Title, Summary, Full Description, Tech Domains required (AI, Robotics, IoT), Target Roles looking for.

---

## Verification Criteria

- [ ] Posting an idea creates a new card on `/ideas`.
- [ ] Adding comments appends them under the idea detail discussion thread.
- [ ] Triggering "Convert to Project" updates idea status to `Converted` and navigates to the newly created Project page.
