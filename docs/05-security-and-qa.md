# PHẦN 9. YÊU CẦU BẢO MẬT (SECURITY)

Danh sách 24 yêu cầu bảo mật bắt buộc (SEC-xx) được nhúng trong mọi khâu thiết kế.

| Mã | Hạng mục | Mô tả kỹ thuật bắt buộc |
| --- | --- | --- |
| SEC-01 | JWT Identity | Xác thực Admin bằng JWT không lưu trạng thái (Stateless). |
| SEC-02 | HTTP-Only Cookie | Token JWT và Session Giỏ hàng PHẢI lưu trong cookie HTTP-Only để chống XSS đọc token. |
| SEC-03 | Secure & SameSite | Cookie phải có cờ Secure (chỉ gửi qua HTTPS) và SameSite=Strict (hoặc Lax tùy QĐ-08). |
| SEC-04 | CORS Policy | Middleware CORS tại Backend chỉ allow các mảng nguồn (Origin) được định nghĩa trong .env. |
| SEC-05 | CORS Credentials | Bật Access-Control-Allow-Credentials: true để cho phép truyền cookie giữa Client và API. |
| SEC-06 | Security Headers | Sử dụng Helmet.js cấu hình CSP, X-Frame-Options (DENY), HSTS. |
| SEC-07 | CSRF Protection | Triển khai Anti-CSRF Token hoặc Double Submit Cookie cho mọi thao tác POST/PUT/PATCH/DELETE. |
| SEC-08 | Origin Check | Backend kiểm tra Header Origin và Referer trùng khớp với danh sách allowlist. |
| SEC-09 | CSRF on Cart/Order | Khách không đăng nhập nhưng có Cookie Giỏ hàng cũng phải chịu kiểm tra CSRF (chống lợi dụng token giỏ). |
| SEC-10 | Password Hashing | Sử dụng bcryptjs với salt rounds (cost) từ 10-12. Tuyệt đối không log password hay hash. |
| SEC-11 | Rate Limiting | Đăng nhập Admin: 5 req/15 phút/IP. Tạo đơn: 3 req/phút/IP. Tra cứu đơn: 5 req/phút/IP. API chung: 100 req/phút/IP. |
| SEC-12 | Brute Force Prevent | Phản hồi đăng nhập sai có thời gian bằng nhau (dùng dummy hash so sánh nếu không tìm thấy user). |
| SEC-13 | Strict Validation | Dùng express-validator. Từ chối request nếu có field thừa, field sai kiểu dữ liệu. |
| SEC-14 | NoSQL Injection | Chặn hoàn toàn việc truyền Object hoặc Array vào các tham số tìm kiếm đơn trị (id, email). (Sanitize). |
| SEC-15 | XSS Prevention | Backend lưu raw data nhưng sanitize. Frontend (React) tự động escape nội dung. Chặn scheme javascript: ở Banner. |
| SEC-16 | Admin API Protect | Middleware xác thực bắt buộc áp dụng cho toàn bộ wildcard `/api/admin/*` (ngoại trừ login). |
| SEC-17 | Secrets Mgmt | JWT Secret, DB URI, Cloudinary API Key phải nằm trong .env. Không commit file này lên Git. |
| SEC-18 | Data Minimization | Không trả về password, token, `_id` nội bộ không cần thiết, số tồn kho chính xác cho API khách hàng. |
| SEC-19 | Image Upload Sec | Kiểm tra extension (jpg, png, webp), mime-type và dung lượng (max 5MB) trước khi gửi sang Cloudinary. |
| SEC-20 | PII Logging | Tuyệt đối không in ra log console: Họ tên, Số điện thoại, Địa chỉ, Mã tra cứu đơn, Mật khẩu. |
| SEC-21 | Track Code Sec | Mã tra cứu gửi qua POST (Body), không nằm ở URL (để tránh lọt vào lịch sử trình duyệt, Access Log). |
| SEC-22 | Payload Tampering | Backend tự tính toán Thành tiền, Tạm tính, Tổng tiền từ Database. Bỏ qua giá tiền Client gửi lên. |
| SEC-23 | Idempotency | Chống gửi lặp đơn hàng (Double Submit) qua Idempotency Key duy nhất theo giỏ/lần click. |
| SEC-24 | Concurrency Lock | Sử dụng Cập nhật nguyên tử có điều kiện (`$inc` kèm điều kiện) để chặn Race Condition bán vượt tồn kho. |

## 12.6. Checklist Nghiệm thu (QA Test Cases Core)

Phần này định nghĩa các kịch bản kiểm thử BẮT BUỘC ĐẠT để ký nghiệm thu. Được truy vết trực tiếp từ NFR, UC và BR.

### A. Hiệu năng & Giao diện (UI/UX & NFR)

01. Giao diện hiển thị đúng trên 3 breakpoint (Desktop, Tablet, Mobile) mà không bị vỡ layout (NFR-06).
02. Chạy Lighthouse trên môi trường Staging, Tốc độ tải trang chủ/sản phẩm (LCP) <= 3 giây (NFR-01).
03. Thẻ Meta SEO, Canonical render chính xác trên view-source của trình duyệt giả lập Crawler (NFR-07).

### B. Nghiệp vụ Giỏ hàng & Sản phẩm

04. Thêm sản phẩm hết hàng vào giỏ -> Báo lỗi (BR-CART-04).
05. Thêm quá giới hạn số lượng (vd: > 10) -> Backend chặn 422 (BR-CART-03).
06. Giá tiền trên Client bị sửa đổi qua DevTools (F12) -> Backend vẫn tính toán đúng giá trị từ DB (SEC-22).
07. Admin Tắt danh mục -> Sản phẩm thuộc danh mục tự động bị ẩn khỏi UI và API công khai (QĐ-12).

### C. Nghiệp vụ Đơn hàng & Tồn kho (Cực kỳ quan trọng)

08. Nhập sai số điện thoại, form validate ngay lập tức, không mất dữ liệu đã điền (NL-05).
09. Chặn gửi đơn trùng bằng cách double-click liên tục -> Chỉ 1 đơn sinh ra, tồn trừ 1 lần (TH-02, NFR-09).
10. (Kiểm thử Đồng thời - Race Condition): Dùng JMeter/Postman gửi 5 request mua cùng 1 sản phẩm chỉ còn 1 tồn kho vào đúng cùng 1 mili-giây -> Kết quả: 1 request thành công 200, 4 request thất bại 422, Tồn kho = 0 (Không bị âm) (TH-01, NFR-10).
11. Đơn hàng tạo xong -> Mã tra cứu hiển thị. F5 trang báo thành công -> Mã tra cứu không hiển thị lại.
12. Khách hàng nhập mã đơn đúng nhưng mã tra cứu sai -> Báo lỗi chung chung, không lộ thông tin (NL-09, SEC-21).
13. Admin chuyển trạng thái Pending -> Cancelled (Kèm lý do) -> Tồn kho của đơn hàng cộng ngược trở lại tự động và đúng số lượng (CĐ-03).
14. Admin không thể đổi trạng thái của đơn đã Completed hoặc Cancelled (BR-ORD-10).

### D. Bảo mật & Phân quyền Admin

15. Truy cập route API quản trị /api/admin/products từ Postman (Không cookie) -> Chặn 401 (SEC-16).
16. Sửa payload sửa đơn hàng bằng API từ Client (Giả mạo Admin) -> Chặn 401 hoặc 403.
17. Thực hiện POST/PUT (Sửa giá, sửa tên SP) nhưng xóa Anti-CSRF Token hoặc Origin lạ -> Chặn 403 (SEC-07).
18. Brute force API đăng nhập 10 lần liên tiếp -> Bị khóa tạm thời (429 Too Many Requests) (SEC-11).
19. Kiểm tra Log server sau khi khách đặt hàng -> KHÔNG có sđt, tên, địa chỉ của khách in ra log console (SEC-20).