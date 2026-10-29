# PHẦN 8. THIẾT KẾ API

Mọi API trả về định dạng JSON thống nhất: `{ success: boolean, message: string, data: object/array, errors: array }`.

## 8.1. API Sản phẩm công khai (Khách hàng)

- `GET /api/products`: Danh sách sản phẩm (hỗ trợ query: page, limit, category, brand, minPrice, maxPrice, sort, search). Chỉ trả SP ACTIVE và Category isActive=true.
- `GET /api/products/:slug`: Chi tiết sản phẩm. Trả 404 nếu không ACTIVE.

## 8.2. API Danh mục và Banner công khai

- `GET /api/categories`: Trả danh sách danh mục đang bật (isActive=true).
- `GET /api/banners`: Trả danh sách banner đang bật.

## 8.3. API Giỏ hàng (Khách hàng)

Bảo mật: Yêu cầu Origin & CSRF Token cho các thao tác POST/PUT/DELETE. Nhận diện qua HTTP-Only cookie.

- `GET /api/cart`: Lấy thông tin giỏ hàng hiện tại.
- `POST /api/cart/items`: Thêm sản phẩm vào giỏ (body: productId, quantity).
- `PUT /api/cart/items/:productId`: Cập nhật số lượng.
- `DELETE /api/cart/items/:productId`: Xóa sản phẩm khỏi giỏ.
- `DELETE /api/cart`: Làm sạch giỏ.

## 8.4. API Đơn hàng phía Khách (Khách hàng)

- `POST /api/orders`: Tạo đơn hàng (body: customerInfo, idempotencyKey, clientTotal). Rate limiting nghiêm ngặt.
- `POST /api/orders/track`: Tra cứu đơn (body: orderCode, trackCode). Không lưu query string. (SEC-21).

## 8.5. API Xác thực Admin

- `POST /api/admin/login`: Đăng nhập (body: email, password). Trả cookie. Rate limiting theo IP/Email.
- `GET /api/admin/me`: Kiểm tra phiên hợp lệ.
- `POST /api/admin/logout`: Đăng xuất, xóa cookie.

## 8.6. API Quản lý Sản phẩm (Admin)

Bảo mật: Mọi API từ 8.6 -> 8.10 yêu cầu JWT Token hợp lệ (Middleware phân quyền).

- `GET /api/admin/products`: Danh sách (gồm cả sản phẩm ẩn/ngừng kinh doanh).
- `POST /api/admin/products`: Tạo mới.
- `PUT /api/admin/products/:id`: Cập nhật. (Từ chối trường stock).
- `PATCH /api/admin/products/:id/status`: Đổi trạng thái bán.
- `DELETE /api/admin/products/:id`: Xóa vĩnh viễn (Chỉ khi chưa có đơn hàng).

## 8.7. API Quản lý Danh mục & Banner (Admin)

- `POST, PUT, PATCH, DELETE /api/admin/categories`: Quản lý danh mục. (Kiểm tra ràng buộc xóa QĐ-12).
- `POST, PUT, PATCH, DELETE /api/admin/banners`: Quản lý banner.

## 8.8. API Quản lý Tồn kho (Admin)

- `GET /api/admin/inventory`: Lấy danh sách tồn kho & số lượng đang giữ (tính toán từ Order).
- `POST /api/admin/inventory/adjust`: Điều chỉnh tồn kho (body: productId, type, quantity, reason, currentSeenStock).

## 8.9. API Quản lý Đơn hàng (Admin)

- `GET /api/admin/orders`: Lấy danh sách đơn hàng.
- `GET /api/admin/orders/:id`: Lấy chi tiết đơn hàng & lịch sử.
- `PATCH /api/admin/orders/:id/status`: Đổi trạng thái (body: status, currentStatus, reason, note). (Thao tác nguyên tử, CĐ-02 -> CĐ-10).

## 8.10. API Hệ thống & Dashboard

- `GET /api/admin/dashboard`: Trả về stats (số lượng SP, đơn hàng theo trạng thái, cảnh báo Pending quá hạn).
- `GET /api/health`: Health check (Public).

## 8.11. Bảng mã trạng thái HTTP chuẩn hóa

| Mã HTTP | Ý nghĩa áp dụng trong dự án |
| --- | --- |
| 200 / 201 | Thành công / Tạo mới thành công. |
| 400 | Bad Request (Cú pháp query sai). |
| 401 | Unauthorized (Chưa đăng nhập, sai mật khẩu, phiên hết hạn). Lỗi chung chung. |
| 403 | Forbidden (Sai CSRF, sai Origin, không đủ quyền). |
| 404 | Not Found (Tài nguyên không tồn tại, hoặc đang bị ẩn khỏi khách). |
| 409 | Conflict (Sửa đồng thời, đổi trạng thái lỗi thời, slug trùng, vi phạm ràng buộc xóa). |
| 422 | Unprocessable Entity (Lỗi Validation form, tồn kho không đủ để đáp ứng - NL-03). |
| 429 | Too Many Requests (Rate limiting). |
| 500 | Internal Server Error (Lỗi logic, DB, Cloudinary không phản hồi). |

## 8.12. Quy tắc Validation đầu vào (Tham chiếu từ NFR-12 & SEC-13)

- Tên, Họ tên: String, trim, length 2 - 100. Không chứa mã HTML.
- Số điện thoại: Regex số điện thoại VN hợp lệ (10 số).
- Mật khẩu: Độ dài tối thiểu 8 ký tự, có số và chữ cái.
- Số lượng (Cart/Inventory): Interger, > 0. Max quantity/item trong giỏ = 10. Max items/cart = 20. Limit điều chỉnh tồn kho 1 lần = 10,000.
- Lý do/Ghi chú: String, max length 500. Tránh XSS (Escape đầu vào).
- IdempotencyKey & trackCode: String, GUID/UUID format.

# PHẦN 10. TỐI ƯU HÓA CÔNG CỤ TÌM KIẾM (SEO)

## 10.1. Yêu cầu chung về SEO (NFR-07)

- URL thân thiện: Cấu trúc URL sạch, ví dụ: `/san-pham/laptop-asus-rog-strix-2026`. Tránh tham số query lạ trên trang chi tiết.
- Thẻ Meta Dynamic: Tên sản phẩm, mô tả ngắn, từ khóa phải được đưa vào thẻ `<title>` và `<meta name="description">`.
- Canonical: Mọi trang phải có thẻ `<link rel="canonical">` để tránh trùng lặp nội dung do parameter bộ lọc (Ví dụ trang danh sách có bộ lọc phải trỏ canonical về trang danh mục gốc).

## 10.2. Structured Data (Dữ liệu có cấu trúc)

Sử dụng JSON-LD cho các trang công khai để Google nhận diện:

- Trang chi tiết sản phẩm: Schema Product kèm Offer.
  - Bắt buộc map price, availability (InStock / OutOfStock) từ Database hiện tại.
  - Lưu ý: Không hiển thị số lượng tồn kho chính xác trong schema, chỉ dùng enum của Schema.org.
- Trang chủ: Schema Organization, WebSite.

## 10.3. Phương án Render (Theo QĐ-09)

Vì React + Vite mặc định là SPA (Single Page Application), Crawler có thể gặp khó khăn khi lập chỉ mục. Quyết định (đề xuất B từ mục 5.5.2):

- Sử dụng Prerendering / Static Site Generation (SSG) cho các route `/`, `/danh-muc/*`, `/san-pham/*`.
- Các route như `/gio-hang`, `/thanh-toan`, `/admin/*` vẫn giữ nguyên SPA thuần túy.