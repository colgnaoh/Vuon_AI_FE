# VUON AI SPACE — Frontend Application (React + Vite + TypeScript)

> **Giao diện Nền tảng Ươm mầm & Sáng tạo Công nghệ VUON AI SPACE** — Dành cho cộng đồng yêu thích **AI, Robotics, IoT, Embedded Systems và Software**. Hỗ trợ kết nối nhân tài, quản lý ý tưởng, phát triển dự án, mượn thiết bị phần cứng và đăng ký sự kiện.

---

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

* **Framework Core**: `React 18` + `Vite` + `TypeScript`
* **Styling & UI**: `TailwindCSS` + `Clean Modern Tech System` (Linear / Vercel style với Dark canvas `#0A0D12`, viền 1px sắc nét)
* **Icons**: `Lucide React`
* **Routing**: `React Router DOM v6` với hệ thống `ProtectedRoute` phân quyền `GlobalRole`
* **State & Data Fetching**: `@tanstack/react-query` v5 + `Axios` (Tự động đính kèm `Bearer JWT Token` và bắt lỗi `401 Unauthorized`)
* **Auth**: Tích hợp Supabase JWT Auth session & LocalStorage persistence

---

## 🌟 Các Mô-đun Tính Năng Chính

### 1. 🌐 Landing Page (`/`)
* Banner Hero giới thiệu tầm nhìn **VUON AI SPACE – Where Ideas Grow**.
* Giới thiệu 6 khu vực Lab (Community Space, AI Lab, Robotics Lab, IoT Lab, Maker Space, Project Space).
* Quy trình ươm mầm sản phẩm thực tế: *Ý tưởng ➔ Team & Mentor ➔ Mượn thiết bị ➔ Prototype*.

### 2. 🔐 Xác Thực & Phân Quyền (`/login`, `/register`)
* Form Đăng nhập & Đăng ký tài khoản thành viên.
* Tích hợp nút **`Demo Presets` (`Member Demo` & `Admin Demo`)** giúp thử nghiệm nhanh.
* Giải mã JWT Claims (`sub`, `email`, `role`) để bảo vệ các trang Member & Admin Portal.

### 3. 👤 Skill Directory & Hồ Sơ Thành Viên (`/directory`, `/profile/me`)
* **Thư mục kỹ năng**: Tra cứu thành viên cộng đồng theo công nghệ (Python, ROS2, ESP32, Jetson, YOLOv8, STM32...).
* **Chỉnh sửa hồ sơ**: Cập nhật thông tin cá nhân, tiểu sử, bộ tag kỹ năng và nhu cầu tìm đồng đội.

### 4. 💡 Bảng Ý Tưởng & Chuyển Đổi Project (`/ideas`, `/ideas/:id`)
* Đăng tải ý tưởng mới và thảo luận bình luận cộng đồng.
* Nút **"Chuyển Thành Project"** hỗ trợ chuyển đổi ý tưởng đã gom đủ team thành dự án chính thức.

### 5. 📦 Danh Mục Dự Án & Quản Lý Team (`/projects`, `/projects/:id`)
* Lọc dự án theo 5 lĩnh vực chuyên sâu (*AI, Robotics, IoT, Embedded, Software*).
* Form gửi yêu cầu xin tham gia dự án dành cho Member.
* Giao diện **Project Leader Console** (`/manage`) phê duyệt thành viên chính thức (`Pending` ➔ `Active`).

### 6. 🔧 Kho Thiết Bị & Đặt Lịch Mượn (`/equipment`, `/my-bookings`)
* Danh mục phần cứng cao cấp (NVIDIA Jetson, Raspberry Pi 5, Camera RealSense, Máy in 3D Bambu Lab...).
* Modal đăng ký mượn theo khoảng ngày (*StartDate ➔ EndDate*) có kiểm tra chống trùng lịch.
* Bảng lịch mượn cá nhân kèm nút **1-Click "Báo Trả Thiết Bị"**.

### 7. 📅 Cổng Sự Kiện (`/events`)
* Danh sách Workshop, Tech Talk và Build Night định kỳ.
* Nút **1-Click "Đăng Ký Tham Gia"** hiển thị trạng thái giữ chỗ.

### 8. 👑 Bảng Quản Trị Admin (`/admin/*`)
* **Admin Dashboard**: Xem thống kê chỉ số hệ thống (System Metrics).
* **Quản lý Kho Thiết Bị**: Thêm thiết bị mới vào kho và override trạng thái hoạt động.
* **Quản lý Phân Quyền**: Bảng điều chỉnh role người dùng (*Visitor, Member, LabManager, Admin*).

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Local

### 1. Yêu cầu môi trường
* Node.js version `>= 18.0.0`
* npm version `>= 9.0.0`

### 2. Cài đặt các gói phụ thuộc (Dependencies)
```powershell
npm install
```

### 3. Cấu hình File `.env`
Tạo file `.env` tại thư mục gốc với nội dung:
```env
VITE_API_BASE_URL=http://localhost:5246/api/v1
```

### 4. Khởi chạy Development Server
```powershell
npm run dev
```
Truy cập địa chỉ: 👉 **`http://localhost:5173`**

### 5. Biên dịch Production (Build & Verify)
```powershell
npm run build
```
File đóng gói sản phẩm sẽ nằm tại thư mục `dist/`.

---

## 🗺️ Cấu Trúc Thư Mục Source Code

```text
d:\VUON_AI_FE\
 ├── public/             # Favicon & Static Assets
 ├── src/
 │    ├── assets/        # Stylesheets & Graphics
 │    ├── components/    # Reusable UI Components
 │    ├── context/       # AuthContext (JWT & Role State)
 │    ├── layouts/       # RootLayout, Navbar, Footer, AdminLayout
 │    ├── pages/         # Landing, Auth, Directory, Ideas, Projects, Equipment, Events, Admin
 │    ├── services/      # Axios Client & API Service modules (auth, profile, idea, project...)
 │    ├── types/         # TypeScript Interfaces (User, Idea, Project, Equipment, Booking...)
 │    ├── App.tsx        # React Router DOM v6 Routes Matrix
 │    ├── index.css      # Clean Modern Tech Tailwind & CSS Variables
 │    └── main.tsx       # Application Entry Point
 ├── .env                # Environment Variables
 ├── .env.example        # Environment Variables Template
 ├── package.json        # Project Manifest & Scripts
 ├── tailwind.config.js   # Tailwind Custom Color Tokens & Animations
 ├── tsconfig.json       # TypeScript Configuration
 └── vite.config.ts      # Vite Bundler & Path Alias (@/) Config
```

---

## 🔑 Thử Nghiệm Nhanh Tài Khoản Demo

Khi truy cập trang Đăng nhập (`http://localhost:5173/login`), bạn có thể bấm trực tiếp nút Presets:

* **Member Demo**: `alex@vuon.ai` ➔ Trải nghiệm tính năng đăng ý tưởng, xin gia nhập dự án, mượn thiết bị.
* **Admin Demo**: `admin@vuon.ai` ➔ Mở nút **`ADMIN PORTAL`** trên Navbar để truy cập trang quản trị hệ thống (`/admin/dashboard`).
