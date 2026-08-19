# VUON AI SPACE — Design Brief (cho FE/UI Designer)

> Tài liệu này mô tả yêu cầu thiết kế giao diện dựa trên PRD và kiến trúc kỹ thuật đã chốt (Supabase + BE .NET riêng). Không chứa code — chỉ mô tả màn hình, nội dung, luồng, và định hướng phong cách để designer thiết kế UI/UX.

---

## 1. Giới thiệu dự án

**VUON AI SPACE** là nền tảng cộng đồng công nghệ (AI, Robotics, IoT, Embedded, Automation) kết hợp giữa không gian vật lý và platform online, giúp các cá nhân/nhóm có ý tưởng công nghệ tìm được đồng đội, mentor, thiết bị và không gian để biến ý tưởng thành sản phẩm thực tế.

**Tagline:** *VUON AI SPACE – Where Ideas Grow.*

**Cảm giác thương hiệu mong muốn:** trẻ trung, công nghệ, cởi mở (open), thiên về "maker/builder culture" — không formal như coworking space doanh nghiệp, cũng không "kid-friendly" như STEM center cho trẻ em. Gần với tinh thần của các cộng đồng như Hackerspace, Product Hunt, Devpost, nhưng bản địa hoá cho cộng đồng công nghệ Việt Nam.

---

## 2. Đối tượng người dùng (Persona) & Role

| Role | Mô tả | Việc chính họ cần làm trên web |
|---|---|---|
| **Visitor** (chưa đăng nhập) | Người ngoài, sinh viên tò mò, doanh nghiệp tiềm năng | Xem project/idea board, xem event, xem giới thiệu — để bị thu hút và đăng ký |
| **Member** | Đã đăng ký, có skill/interest | Tạo idea/project, join project, đặt thiết bị, đăng ký event |
| **Project Leader** | Member đang dẫn dắt 1 project cụ thể | Quản lý thành viên, duyệt join request, cập nhật trạng thái project, request mentor/thiết bị |
| **Mentor** | Chuyên gia hỗ trợ | Xem request từ project, nhận/từ chối, xem danh sách project đang mentor |
| **Lab Manager** | Quản lý thiết bị/không gian | Duyệt/theo dõi booking, cập nhật trạng thái thiết bị, xử lý báo lỗi |
| **Admin** | Quản trị hệ thống | Quản lý user, xem dashboard KPI toàn hệ thống |

**Lưu ý cho designer:** một user có thể mang nhiều role cùng lúc (vừa là Member, vừa là Leader của project A, vừa là Mentor được mời ở project B) — UI cần thể hiện rõ "vai trò hiện tại của tôi trong màn hình này" thay vì chỉ 1 nhãn role cố định trên toàn site.

---

## 3. Danh sách màn hình cần thiết kế

### 3.1. Public (không cần đăng nhập)
- **Landing Page** — giới thiệu VUON AI SPACE, vision/mission, các zone (AI Lab, Robotics Lab...), CTA "Tham gia cộng đồng"
- **Project & Idea Board (public view)** — danh sách project/idea, filter theo công nghệ/trạng thái, dạng thẻ (card)
- **Project Detail (public view)** — xem được nhưng không tương tác được (join/comment) nếu chưa đăng nhập
- **Event Calendar (public view)** — danh sách sự kiện sắp tới
- **Đăng ký / Đăng nhập**

### 3.2. Member (đã đăng nhập)
- **Onboarding** — 3 bước: tạo profile → chọn interests → chọn skills (theo đúng flow mục 23 PRD)
- **Dashboard cá nhân** — project đang tham gia, booking sắp tới, thông báo mới, event đã đăng ký
- **Project & Idea Board** — thêm nút "Tạo Idea/Project mới", nút "Join"
- **Project Detail** — mô tả, tech stack, danh sách thành viên, comment section, nút Join/Request Mentor/Request Equipment (Leader mới thấy 2 nút sau)
- **Tạo Idea/Project** — form: tên, mô tả, công nghệ liên quan (tag input), "đang tìm vai trò gì" (vd: 1 AI Developer, 1 Embedded Developer — theo đúng mẫu mục 14 PRD)
- **Equipment List** — dạng lưới/bảng, filter theo category, badge trạng thái (Available/Reserved/Borrowed/Maintenance)
- **Equipment Detail + Booking** — chọn khoảng ngày (date range picker theo NGÀY, không theo giờ), hiển thị rõ "hạn trả: 18:00 ngày [end_date]"
- **My Bookings** — danh sách đã đặt, nút "Trả thiết bị", trạng thái (Đã đặt/Đang mượn/Đã trả/Trả trễ)
- **Mentor Directory** — danh sách mentor theo lĩnh vực, nút "Request Mentor" (chỉ hiện nếu user là Leader của ít nhất 1 project)
- **Event List + Event Detail** — nút đăng ký tham gia
- **Community/Skill Directory** — tìm thành viên theo skill/interest (mục 18 PRD)
- **Profile cá nhân** — xem/sửa skills, interests, bio, avatar
- **Notification Center** — danh sách thông báo (join request được duyệt, mentor accept, booking sắp đến hạn...)

### 3.3. Project Leader (thêm trên nền Member)
- **Quản lý thành viên project** — danh sách request đang chờ duyệt, nút Approve/Reject
- **Cập nhật trạng thái project** — dropdown/stepper: Idea → Team Forming → Building → Testing → Demo → Completed

### 3.4. Mentor
- **Mentor Request Inbox** — danh sách request từ các project, Accept/Reject
- **My Mentoring Projects** — project đang mentor

### 3.5. Lab Manager
- **Equipment Management** — CRUD thiết bị, cập nhật trạng thái, xử lý báo lỗi
- **Booking Overview** — lịch tổng hợp tất cả booking (calendar view), phát hiện booking trễ hạn

### 3.6. Admin
- **User Management** — danh sách user, đổi role
- **Dashboard KPI** — số liệu: Active Members, Active Projects, Prototype Created, Event Frequency... (theo mục 28 PRD)

---

## 4. Luồng chính cần thiết kế kỹ (User Flow)

### Flow 1 — Tham gia cộng đồng
```
Landing Page → Đăng ký → Onboarding (profile/interest/skill) → Dashboard
```

### Flow 2 — Từ ý tưởng đến project
```
Idea Board → "Tạo Idea mới" → Idea hiển thị công khai (status: idea)
   → Member khác xem, Comment, Join
   → Leader duyệt member → project chuyển "team_forming"
   → Leader request mentor / request equipment
   → Leader cập nhật status dần: building → testing → demo → completed
```
*(Lưu ý: Idea và Project là CÙNG một trang chi tiết, chỉ khác badge trạng thái — không thiết kế 2 trang riêng biệt)*

### Flow 3 — Đặt thiết bị
```
Equipment List → chọn thiết bị Available → chọn khoảng ngày (start date - end date)
   → Xác nhận booking → trạng thái "Đã đặt"
   → Đến ngày mượn thực tế, Lab Manager/Member cập nhật "Đang mượn"
   → Member bấm "Trả thiết bị" → hệ thống tự so sánh với hạn 18:00 ngày end_date
      → Trả đúng hạn: "Đã trả" | Trả sau 18h: "Trả trễ" (hiển thị rõ badge màu khác, vd đỏ/cam)
```
**Quan trọng cho designer:** vì booking theo NGÀY (không theo giờ), UI chọn ngày nên dùng date-range picker đơn giản (kiểu Airbnb/booking.com rút gọn), và cần hiển thị rất rõ dòng cảnh báo "Hạn trả: 18:00, [ngày]" ngay tại màn hình xác nhận booking để tránh hiểu nhầm.

### Flow 4 — Request Mentor
```
Project Detail (Leader) → "Request Mentor" → chọn mentor từ Directory → gửi request
   → Mentor nhận notification → Accept/Reject trong Mentor Request Inbox
   → Nếu Accept: mentor xuất hiện trong danh sách thành viên project (role: mentor)
```

---

## 5. Trạng thái (Status) cần thể hiện bằng màu/badge nhất quán

| Loại | Giá trị | Gợi ý màu |
|---|---|---|
| Project/Idea status | idea, team_forming, building, testing, demo, completed | Gradient từ xám (idea) → xanh dương → vàng → tím → xanh lá (completed) |
| Booking status | booked, borrowed, returned, returned_late, cancelled | returned_late nên nổi bật (đỏ/cam) để cảnh báo |
| Equipment status | available, reserved, borrowed, maintenance | available = xanh lá, maintenance = đỏ |
| Membership status | pending, active, left | pending cần rõ ràng vì Leader phải hành động |

---

## 6. Component dùng chung (Design System) cần có

- Project/Idea Card (dùng lại được cho cả Board và Dashboard)
- Status Badge (theo bảng mục 5)
- Skill/Technology Tag (dùng ở Profile, Project, Equipment)
- Date Range Picker (cho booking thiết bị)
- Avatar + Role indicator
- Notification Item
- Empty state (cho các danh sách chưa có dữ liệu — vd "Chưa có project nào, tạo cái đầu tiên!")
- Form với validate rõ ràng (đặc biệt form tạo Idea/Project có nhiều trường tag/array)

---

## 7. Yêu cầu kỹ thuật cần designer biết (ảnh hưởng UI)

- **Không có multi-tenant / multi-location** → không cần UI chọn "chi nhánh/cơ sở"
- **1 user tham gia được nhiều project cùng lúc** → Dashboard cần hiển thị được danh sách nhiều project, không giả định chỉ 1
- **Idea và Project dùng chung 1 ID/1 trang chi tiết** → thiết kế 1 template duy nhất, hiển thị khác nhau theo status
- **Booking theo ngày, không theo giờ** → tránh dùng time picker phức tạp
- Nền tảng cần **responsive tốt trên mobile** vì nhiều thành viên sẽ check thông báo/booking khi đang ở lab, không phải lúc nào cũng dùng desktop

---

## 8. Định dạng bàn giao mong muốn từ designer

- Wireframe/UI cho các màn hình ở mục 3 (ưu tiên: Landing, Project Board, Project Detail, Equipment Booking, Dashboard — đây là 5 màn hình lõi của MVP)
- Design system cơ bản: color palette, typography, spacing, các component ở mục 6
- Responsive breakpoint tối thiểu: Desktop + Mobile (Tablet nếu có thời gian)
- Xuất file dạng Figma (khuyến nghị) kèm link chia sẻ để dev FE tham chiếu trực tiếp khi code
