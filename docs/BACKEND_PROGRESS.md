# BÁO CÁO TIẾN ĐỘ & BÀN GIAO API BACKEND (TECHGEAR SHOP)

Tài liệu này ghi lại trạng thái các API Backend đã hoàn thiện để đội ngũ Frontend (FE) có thể bắt đầu tích hợp.

## 1. THÔNG TIN MÔI TRƯỜNG (Environment)

- **Base URL:** `http://localhost:5000/api`
- **Cơ chế xác thực:** Admin và khách hàng dùng JWT trong Cookie HTTP-only (`admin_token`, `user_token`).
- **Cloudinary Upload:** Bổ sung `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` và `CLOUDINARY_UPLOAD_FOLDER=techgear/uploads` trong `src/backend/.env`.
- **Bảo mật CSRF:** Mọi request ghi (POST, PUT, PATCH, DELETE) yêu cầu Header `x-csrf-token`. (Lấy mã này từ response của API Đăng nhập).
- **Bắt buộc Header:** `Origin: http://localhost:5173` (để vượt qua CORS).
- **Định dạng Response chung:**
  ```json
  { "success": boolean, "message": "string", "data": {}, "errors": [] }
  ## 3. DANH SÁCH CÁC API ĐÃ HOÀN THIỆN
  *(Dành cho Frontend tích hợp ngay)*
  ```

### 3.1. API Xác thực (Auth)

- **`POST /admin/login`**: Đăng nhập.
  - _Body:_ `{ "email": "...", "password": "..." }`
  - _Trả về:_ Thông tin Admin và `csrfToken`.
- **`POST /admin/logout`**: Đăng xuất, xóa cookie.
- **`GET /admin/me`**: Kiểm tra phiên đăng nhập hiện tại (dùng khi F5 tải lại trang).

### 3.2. API Quản lý Sản phẩm (Admin)

- **`GET /admin/products`**: Lấy danh sách sản phẩm (có phân trang, lọc).
- **`GET /admin/products/:id`**: Lấy chi tiết 1 sản phẩm.
- **`POST /admin/products`**: Tạo sản phẩm mới.
- **`PUT /admin/products/:id`**: Cập nhật sản phẩm.
  - _(Lưu ý: Nếu gửi trường `stock` lên sẽ bị lỗi 422 - Hệ thống chặn sửa tồn kho trực tiếp để bảo vệ dữ liệu)._
- **`PATCH /admin/products/:id/status`**: Cập nhật trạng thái bán (ACTIVE, INACTIVE, PAUSED).
- **`DELETE /admin/products/:id`**: Xóa sản phẩm.
  - _(Nếu sản phẩm đã từng nằm trong đơn hàng, API sẽ tự động chuyển trạng thái thành INACTIVE thay vì xóa vĩnh viễn)._

### 3.3. API Quản lý Danh mục (Admin)

- **`GET /admin/categories`**: Danh sách danh mục.
- **`POST /admin/categories`**: Tạo danh mục mới.
- **`PUT /admin/categories/:id`**: Sửa danh mục.
- **`DELETE /admin/categories/:id`**: Xóa danh mục.
  - _(Trả về lỗi 409 Conflict nếu danh mục đang chứa sản phẩm)._

### 3.4. API Quản lý Banner (Admin)

- **`GET /admin/banners`**: Danh sách banner.
- **`POST /admin/banners`**: Tạo banner mới.
- **`PUT /admin/banners/:id`**: Sửa banner.
- **`DELETE /admin/banners/:id`**: Xóa banner.

### 3.5. API Giỏ hàng & Đơn hàng (Khách hàng)
- `POST /api/cart/items`: Thêm sản phẩm vào giỏ (yêu cầu khách đăng nhập, email đã xác thực).
- `GET /api/cart`: Xem giỏ hàng và tính tạm tính.
- `POST /api/orders`: Tạo đơn hàng (yêu cầu khách đăng nhập, email đã xác thực). Bắt buộc có `idempotencyKey` (UUID). Tự động trừ kho và xóa giỏ.
- `GET /api/orders/my-orders`: Xem lịch sử đơn hàng của khách đã đăng nhập; hỗ trợ `page` (mặc định 1), `limit` (mặc định 10, tối đa 100) và trả về `orderCode`, `createdAt`, `totalAmount`, `status`, `itemCount` cùng thông tin phân trang.
- `POST /api/orders/track`: Tra cứu đơn hàng bằng `orderCode` và `trackCode`.

### 3.6. API Quản lý Tồn kho & Đơn hàng (Admin)

- `GET /api/admin/inventory`: Xem danh sách tồn kho.
- `POST /api/admin/inventory/adjust`: Điều chỉnh tồn kho (ghi log InventoryLog).
- `GET /api/admin/orders`: Danh sách đơn hàng.
- `PATCH /api/admin/orders/:id/status`: Cập nhật trạng thái đơn (tự động hoàn kho nếu hủy).

### 3.7. API Dashboard & Upload ảnh (Admin)

- `GET /api/admin/dashboard`: Lấy thống kê Dashboard (yêu cầu quyền Admin).
  - Trả về `totalProducts`, `totalCategories`, `pendingOrders`, `completedOrders` và `totalRevenue`.
  - Doanh thu chỉ tính các đơn có trạng thái `COMPLETED`.
- `POST /api/admin/upload`: Upload ảnh bằng `multipart/form-data` (yêu cầu quyền Admin, Origin và CSRF token).
  - Field được hỗ trợ: `image` hoặc `file`.
  - Chỉ hỗ trợ JPEG, PNG, WEBP hoặc GIF, dung lượng tối đa 5MB.
  - Trả về `{ url, publicId }` để Frontend lưu vào dữ liệu sản phẩm/banner.

---

## 4. TRẠNG THÁI CƠ SỞ DỮ LIỆU

Hiện tại Database `techgear_shop` trên MongoDB Atlas đang hiển thị 5 collections: `admins`, `categories`, `products`, `banners`, `orders`.

> **Lưu ý:** Các collection như `carts`, `inventorylogs`, `orderhistories` đã được viết Model nhưng chưa xuất hiện trên Database. Đây là do cơ chế "Lazy Creation" của MongoDB (chỉ tạo bảng khi có dữ liệu đầu tiên được chèn vào). Chúng sẽ tự động xuất hiện khi FE test các tính năng Giỏ hàng và Đặt hàng.

---

## 6. HƯỚNG DẪN TÍCH HỢP CHO FRONTEND

1. Cấu hình Axios với `withCredentials: true` để trình duyệt tự động gửi/nhận cookie.
2. Tạo Interceptor xử lý lỗi: Nếu nhận mã `401` thì đá về trang đăng nhập; nếu `403` thì hiển thị thông báo lỗi CSRF/Origin.
3. Với các API ghi (Thêm/Sửa/Xóa), bắt buộc phải đính kèm `x-csrf-token` và `Origin` vào Headers.
4. Tạm thời dùng Mock Data cho các tính năng Giỏ hàng/Đặt hàng cho đến khi Backend thông báo hoàn thiện.

### 3.7. Các tính năng hạ tầng & Tối ưu hóa (Mới cập nhật)
- **Rate Limiter:** Đã cấu hình lại với các giới hạn:
  - Global API: 300 req / 15 phút.
  - Admin Login: 5 req / 15 phút.
  - Tạo đơn: 3 req / phút.
  - Tra cứu đơn: 5 req / phút.
  - Có thể tắt qua biến `RATE_LIMIT_ENABLED=false` trong file `.env` khi dev.
- **Tối ưu hóa hiệu năng API `GET /api/products`:**
  - Đã thêm Index cho `status` và `categoryId`.
  - Đã dùng `.lean()` cho query.
  - Đã tích hợp **In-memory Cache (node-cache)** với TTL 60 giây.
  - Phân trang dùng `limit + 1` thay vì `countDocuments()`.
  - Kết quả: Tốc độ đạt >1.100 req/s (tăng 47 lần), độ trễ < 100ms.
- **Cloudinary:** Đã cấu hình thành công (cloud_name: techgear). API upload ảnh đã hoạt động.

### 3.8. API Xác thực Khách hàng (User) & Thay đổi luồng mua hàng
- **Thay đổi nghiệp vụ:** Khách hàng bắt buộc phải Đăng nhập và Xác thực Email mới được thêm vào giỏ hàng và đặt đơn. Xem sản phẩm vẫn công khai.
- **Các API mới:**
  - `POST /api/auth/register`: Đăng ký (gửi email xác thực).
  - `GET /api/auth/verify-email?token=...`: Xác thực tài khoản qua link trong email.
  - `POST /api/auth/login`: Đăng nhập, trả về JWT trong Cookie HTTP-only (role: 'customer') và `csrfToken`.
- **Thay đổi API cũ:**
  - `POST /api/cart/items`, `GET /api/cart`, v.v. và `POST /api/orders`: Bắt buộc phải có Cookie đăng nhập của Customer. Trả lỗi `401` nếu chưa đăng nhập, `403` nếu chưa xác thực email.
  - Dữ liệu Giỏ hàng (Cart) và Đơn hàng (Order) giờ đã được gắn với `userId`.