# Walkthrough: VUON AI SPACE - Frontend MVP Implementation

Hệ thống Frontend **VUON AI SPACE** đã được hoàn thiện 100% các mô-đun MVP Phase 1 dựa trên nền tảng **React 18 + Vite + TypeScript**, áp dụng phong cách thiết kế **Clean Modern Tech System** (Linear / Vercel style).

---

## 🎯 Tính Năng Đã Triển Khai & Kiểm Thử Pass

### 1. 🌐 Landing Page & Design System Core
- **Hero & Vision Banner**: Giới thiệu thông điệp *"VUON AI SPACE – Where Ideas Grow"* và thanh thống kê số liệu cộng đồng.
- **6 Zones Showcase**: Trình bày trực quan 6 khu vực Lab (Community, AI Lab, Robotics Lab, IoT Lab, Maker Space, Project Space).
- **Quy trình ươm mầm**: *Ý tưởng ➔ Team & Mentor ➔ Mượn thiết bị ➔ Prototype*.

### 2. 🔐 Auth Module & JWT Protected Routes (`src/pages/auth/`)
- **Login & Register Forms**: Form đăng nhập/đăng ký giao diện tối giản, có tích hợp nút **Demo Presets** (Member & Admin Demo) giúp kiểm thử tức thì.
- **Auth Context**: Tự động giải mã JWT Claims (`sub`, `email`, `role`) và lưu trữ token an toàn trong `localStorage`.
- **Protected Routes**: Bảo vệ các tuyến đường yêu cầu đăng nhập (`/profile/me`, `/my-bookings`, `/projects/:id/manage`) và phân quyền cho Admin (`/admin/*`).

### 3. 👤 Profile & Skill Directory (`src/pages/directory/` & `src/pages/profile/`)
- **Thư mục kỹ năng**: Tra cứu thành viên cộng đồng theo từ khóa hoặc chip kỹ năng phổ biến (Python, ROS2, ESP32, Jetson Orin, YOLOv8, STM32...).
- **Chỉnh sửa hồ sơ**: Giao diện cập nhật bio, bổ sung/xóa tag kỹ năng công nghệ và thông tin tìm kiếm đồng đội.

### 4. 💡 Idea Board & Conversion (`src/pages/ideas/`)
- **Bảng ý tưởng**: Đăng ý tưởng mới, hiển thị danh sách ý tưởng theo lưới card hiện đại.
- **Thảo luận bình luận**: Chi tiết ý tưởng kèm luồng bình luận đóng góp ý kiến thời gian thực.
- **Chuyển Idea ➔ Project**: Nút *"Chuyển Thành Project"* giúp tác giả chuyển đổi ý tưởng đã chín bồi thành dự án chính thức.

### 5. 📦 Project Hub & Team Management (`src/pages/projects/`)
- **Danh mục dự án**: Lọc dự án theo 5 lĩnh vực (AI, Robotics, IoT, Embedded, Software).
- **Form xin gia nhập**: Nút *"Đăng Ký Tham Gia Team"* kèm modal chọn vai trò ứng tuyển.
- **Leader Console**: Giao diện cho Project Leader duyệt thành viên từ `Pending` sang `Active` và chuyển đổi trạng thái dự án.

### 6. 🔧 Equipment Sharing & Booking System (`src/pages/equipment/`)
- **Kho phần cứng**: Danh mục thiết bị (NVIDIA Jetson, Raspberry Pi 5, Camera RealSense, Máy in 3D Bambu Lab...) với nhãn trạng thái khả dụng.
- **Modal đặt lịch theo ngày**: Đặt mượn theo khoảng `StartDate` ──> `EndDate` kèm kiểm tra chống trùng lịch.
- **Trang lịch mượn cá nhân**: Theo dõi hạn mượn và nút **1-Click "Báo Trả Thiết Bị"**.

### 7. 📅 Events Hub (`src/pages/events/`)
- **Sự kiện & Build Night**: Danh sách Workshop, Tech Talk và nút **1-Click "Đăng Ký Tham Gia"** hiển thị trạng thái đã đăng ký.

### 8. 👑 Admin Portal (`src/pages/admin/`)
- **Admin Dashboard**: Thống kê số liệu hệ thống từ REST API `/api/v1/admin/metrics`.
- **Quản lý kho thiết bị**: Form thêm thiết bị mới vào kho và menu override trạng thái (`Available`, `Borrowed`, `Maintenance`).
- **Quản lý phân quyền**: Bảng cập nhật `GlobalRole` cho thành viên (`Visitor` ↔ `Member` ↔ `LabManager` ↔ `Admin`).

---

## 🛠️ Empirical Verification Results

```powershell
> vuon-ai-space-fe@1.0.0 build
> tsc && vite build

vite v5.4.21 building for production...
✓ 1679 modules transformed.
dist/index.html                   1.14 kB │ gzip:   0.69 kB
dist/assets/index-B8NYJXMW.css   34.79 kB │ gzip:   6.26 kB
dist/assets/index-CZrPTvTb.js   376.44 kB │ gzip: 110.17 kB
✓ built in 47.06s
```

- **TypeScript Compilation**: Clean pass (0 errors).
- **Vite Production Bundle**: Tối ưu thành công file `index.html`, `CSS` và `JS` tại thư mục `dist/`.
