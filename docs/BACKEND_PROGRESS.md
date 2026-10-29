# BÁO CÁO TIẾN ĐỘ & BÀN GIAO API BACKEND (TECHGEAR SHOP)

Tài liệu này ghi lại trạng thái các API Backend đã hoàn thiện để đội ngũ Frontend (FE) có thể bắt đầu tích hợp.

## 1. THÔNG TIN MÔI TRƯỜNG (Environment)
- **Base URL:** `http://localhost:5000/api`
- **Cơ chế xác thực:** JWT lưu trong Cookie HTTP-only (Tên cookie: `admin_token`).
- **Bảo mật CSRF:** Mọi request ghi (POST, PUT, PATCH, DELETE) yêu cầu Header `x-csrf-token`. (Lấy mã này từ response của API Đăng nhập).
- **Bắt buộc Header:** `Origin: http://localhost:5173` (để vượt qua CORS).
- **Định dạng Response chung:** 
  ```json
  { "success": boolean, "message": "string", "data": {}, "errors": [] }
  ## 3. DANH SÁCH CÁC API ĐÃ HOÀN THIỆN
*(Dành cho Frontend tích hợp ngay)*

### 3.1. API Xác thực (Auth)
- **`POST /admin/login`**: Đăng nhập.
  - *Body:* `{ "email": "...", "password": "..." }`
  - *Trả về:* Thông tin Admin và `csrfToken`.
- **`POST /admin/logout`**: Đăng xuất, xóa cookie.
- **`GET /admin/me`**: Kiểm tra phiên đăng nhập hiện tại (dùng khi F5 tải lại trang).

### 3.2. API Quản lý Sản phẩm (Admin)
- **`GET /admin/products`**: Lấy danh sách sản phẩm (có phân trang, lọc).
- **`GET /admin/products/:id`**: Lấy chi tiết 1 sản phẩm.
- **`POST /admin/products`**: Tạo sản phẩm mới.
- **`PUT /admin/products/:id`**: Cập nhật sản phẩm. 
  - *(Lưu ý: Nếu gửi trường `stock` lên sẽ bị lỗi 422 - Hệ thống chặn sửa tồn kho trực tiếp để bảo vệ dữ liệu).*
- **`PATCH /admin/products/:id/status`**: Cập nhật trạng thái bán (ACTIVE, INACTIVE, PAUSED).
- **`DELETE /admin/products/:id`**: Xóa sản phẩm.
  - *(Nếu sản phẩm đã từng nằm trong đơn hàng, API sẽ tự động chuyển trạng thái thành INACTIVE thay vì xóa vĩnh viễn).*

### 3.3. API Quản lý Danh mục (Admin)
- **`GET /admin/categories`**: Danh sách danh mục.
- **`POST /admin/categories`**: Tạo danh mục mới.
- **`PUT /admin/categories/:id`**: Sửa danh mục.
- **`DELETE /admin/categories/:id`**: Xóa danh mục.
  - *(Trả về lỗi 409 Conflict nếu danh mục đang chứa sản phẩm).*

### 3.4. API Quản lý Banner (Admin)
- **`GET /admin/banners`**: Danh sách banner.
- **`POST /admin/banners`**: Tạo banner mới.
- **`PUT /admin/banners/:id`**: Sửa banner.
- **`DELETE /admin/banners/:id`**: Xóa banner.

---

## 4. TRẠNG THÁI CƠ SỞ DỮ LIỆU
Hiện tại Database `techgear_shop` trên MongoDB Atlas đang hiển thị 5 collections: `admins`, `categories`, `products`, `banners`, `orders`.

> **Lưu ý:** Các collection như `carts`, `inventorylogs`, `orderhistories` đã được viết Model nhưng chưa xuất hiện trên Database. Đây là do cơ chế "Lazy Creation" của MongoDB (chỉ tạo bảng khi có dữ liệu đầu tiên được chèn vào). Chúng sẽ tự động xuất hiện khi FE test các tính năng Giỏ hàng và Đặt hàng.

---

## 5. CÁC API CHƯA HOÀN THIỆN (FE DÙNG MOCK DATA)
Các API dưới đây chưa được viết ở Backend, FE hãy tạm dùng dữ liệu giả (Mock Data) để dựng giao diện:
- **API Sản phẩm công khai:** (Dành cho trang chủ khách hàng). 
- **API Giỏ hàng (Cart):** Thêm, sửa, xóa sản phẩm trong giỏ.
- **API Đơn hàng (Order) & Tra cứu:** Tạo đơn, tra cứu đơn.
- **API Upload ảnh (Cloudinary):** Đang chờ cấu hình tài khoản.

---

## 6. HƯỚNG DẪN TÍCH HỢP CHO FRONTEND
1. Cấu hình Axios với `withCredentials: true` để trình duyệt tự động gửi/nhận cookie.
2. Tạo Interceptor xử lý lỗi: Nếu nhận mã `401` thì đá về trang đăng nhập; nếu `403` thì hiển thị thông báo lỗi CSRF/Origin.
3. Với các API ghi (Thêm/Sửa/Xóa), bắt buộc phải đính kèm `x-csrf-token` và `Origin` vào Headers.
4. Tạm thời dùng Mock Data cho các tính năng Giỏ hàng/Đặt hàng cho đến khi Backend thông báo hoàn thiện.