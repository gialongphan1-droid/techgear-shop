# BÁO CÁO TIẾN ĐỘ & TỔNG KẾT DỰ ÁN TECHGEAR SHOP

**Phiên bản:** V2 (Mở rộng từ V1)  
**Ngày cập nhật:** 31/10/2026  
**Trạng thái:** Hoàn thiện các tính năng cốt lõi (Ready for Deployment).

---

## 1. TỔNG QUAN CÔNG NGHỆ
- **Frontend:** React + Vite, TailwindCSS, shadcn/ui, Redux Toolkit, React Hook Form, React Router.
- **Backend:** Node.js (Express.js), MongoDB Atlas (Mongoose), JWT, bcryptjs, nodemailer.
- **Bảo mật:** HTTP-Only Cookie, CSRF Token, Rate Limiting (Chống Spam).
- **Lưu trữ ảnh:** Cloudinary.

---

## 2. CÁC CỘT MỐC ĐÃ HOÀN THÀNH

### ✅ Giai đoạn 1: Khởi tạo & Nền tảng (Backend & Frontend cơ bản)
- Thiết lập cấu trúc thư mục MERN Stack chuẩn (tách biệt `backend` và `frontend`).
- Cấu hình Axios (`withCredentials: true`, đính kèm CSRF Token) và Redux Store.
- Xây dựng Layout cơ bản (Header, Footer) và Router bảo vệ (Protected Routes).

### ✅ Giai đoạn 2: Admin Panel (Quản trị viên)
- **Auth Admin:** Đăng nhập bằng JWT (Cookie HTTP-Only), xử lý lỗi 401/403/429.
- **Dashboard:** Gọi API thật, thống kê số liệu Sản phẩm, Danh mục, Đơn hàng.
- **Quản lý Sản phẩm:** CRUD, Phân trang, Tìm kiếm, Lọc. Tích hợp upload ảnh lên Cloudinary.
- **Quản lý Danh mục & Banner:** CRUD, chặn xóa nếu đang chứa sản phẩm (Lỗi 409).
- **Quản lý Đơn hàng:** Xem danh sách, chi tiết, cập nhật trạng thái đơn theo quy trình (Pending -> Confirmed -> Processing -> Completed/Cancelled).
- **Quản lý Tồn kho:** Xem số lượng, điều chỉnh tồn kho (Nhập/Giảm) có ghi log lịch sử.

### ✅ Giai đoạn 3: Giao diện Khách hàng (Storefront)
- **Trang chủ:** Banner Carousel, Danh mục, Sản phẩm nổi bật/mới.
- **Danh sách & Tìm kiếm:** Lọc theo danh mục, giá, thương hiệu. Đồng bộ bộ lọc lên URL.
- **Chi tiết sản phẩm:** Xem thông số, giá, thêm vào giỏ hàng.
- **Giỏ hàng & Thanh toán:** Thêm/sửa/xóa, tính tổng tiền, điền form đặt hàng.
- **Tra cứu đơn hàng:** Bảo mật bằng mã đơn + mã tra cứu.

### ✅ Giai đoạn 4: Nâng cấp V2 (Tính năng mở rộng)
- **Auth Khách hàng (Mới):** 
  - Đăng ký tài khoản (Gửi email xác thực qua Nodemailer).
  - Xác thực tài khoản qua link email (Token).
  - Đăng nhập / Đăng xuất (Lưu JWT vào Cookie riêng biệt với Admin).
- **Bảo vệ quyền mua hàng:** Bắt buộc Đăng nhập và Xác thực Email mới được thêm vào Giỏ hàng và Đặt hàng. 
- **Đồng bộ Giỏ hàng:** Giỏ hàng và Đơn hàng giờ đã được gắn với `userId` (không còn dùng cookie ẩn danh).

### ✅ Giai đoạn 5: Tối ưu hóa & Đánh bóng (UI/UX & Performance)
- **Nâng cấp UI/UX:** Áp dụng phong cách thiết kế tối giản (Minimalist) theo các bộ skill chống "AI-Slop" (Taste, Hallmark, Superdesign). Sử dụng font Inter, màu sắc trung tính, loại bỏ gradient rẻ tiền.
- **Performance (Rate Limiting):** Tinh chỉnh Middleware giới hạn tần suất. Bỏ qua Rate Limit cho IP localhost khi dev (phục vụ test tải) nhưng vẫn giữ nguyên bảo mật cho Production.
- **Load Testing:** Chạy thành công Autocannon (100 kết nối đồng thời), đảm bảo server không sập.

---

## 3. CÁC QUYẾT ĐỊNH KỸ THUẬT QUAN TRỌNG (Dành cho Báo cáo)
1. **Cơ chế xác thực (Auth):** Sử dụng JWT lưu trong `HTTP-Only Cookie` (kết hợp với CSRF Token) thay vì `localStorage` để chống lại tấn công XSS.
2. **Idempotency Key:** Áp dụng khi tạo Đơn hàng để chống trùng lặp (Double-click tạo 2 đơn).
3. **Chống bán vượt tồn kho:** Sử dụng cơ chế `$inc` nguyên tử của MongoDB trong lúc tạo đơn.
4. **Xác thực Email:** Bắt buộc xác thực email trước khi cho phép đặt hàng, ngăn chặn spam đơn ảo.

---

## 4. HƯỚNG DẪN CHẠY DỰ ÁN
*(Xem chi tiết tại file `README.md`)*
- **Backend:** `cd src/backend` -> Cấu hình `.env` -> `npm run dev`
- **Frontend:** `cd src/frontend` -> `npm install` -> `npm run dev`

---

## 5. KẾ HOẠCH TIẾP THEO (Nếu có thời gian)
- Triển khai (Deploy) Frontend lên Vercel và Backend lên Render.
- Tích hợp cổng thanh toán trực tuyến (VNPay/Momo).
- Viết Unit Test cho các API quan trọng (Auth, Order).