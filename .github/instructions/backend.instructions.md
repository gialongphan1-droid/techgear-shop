---
applyTo: "src/backend/**/*, server/**/*, api/**/*"
---
# Quy tắc Phát triển Backend (Node.js/Express) - TechGear Shop

Khi viết code trong thư mục Backend, bạn phải tuân thủ nghiêm ngặt các quy tắc sau:

## 1. Kiến trúc & Clean Code
- Tách lớp nghiêm ngặt: `Route -> Controller -> Service -> Model`.
- **Tuyệt đối không** viết logic nghiệp vụ (tính toán tồn kho, giá cả) trong Controller. Mọi logic phải nằm trong Service.
- Áp dụng các nguyên lý SOLID, Dependency Inversion, Repository Pattern.
- Tối ưu hóa Database (Mongoose): Tránh lỗi N+1 query. Đánh index cho các trường hay tìm kiếm (như `slug`, `email`, `categoryId`).

## 2. Nghiệp vụ Cốt lõi
- **Đơn hàng (Order):** 
  - Giá và tổng tiền **phải** được tính lại từ Database. Không bao giờ tin tưởng giá trị `total` do Client gửi lên.
  - Bắt buộc dùng `idempotencyKey` để chống tạo đơn trùng khi khách bấm nhiều lần.
  - Lưu Snapshot: Lưu lại tên, giá sản phẩm tại thời điểm mua vào đơn hàng.
- **Tồn kho (Inventory):**
  - Chống bán vượt tồn kho (Race Condition): Sử dụng **cập nhật nguyên tử** (Atomic updates). Ví dụ: `findOneAndUpdate({ _id, stock: { $gte: quantity } }, { $inc: { stock: -quantity } })`. Không đọc rồi ghi đè.
  - Không bao giờ để tồn kho âm.

## 3. Bảo mật & Validation (Bắt buộc dùng express-validator)
- **CSRF & CORS:** Bắt buộc kiểm tra CSRF Token và Origin cho mọi thao tác ghi (POST/PUT/PATCH/DELETE).
- **Rate Limiting:** Áp dụng cho Login (5 req/15p), Tạo đơn (3 req/phút), Tra cứu đơn (5 req/phút).
- **Validation Đầu vào:**
  - Tên: 2-100 ký tự. Số điện thoại: Đúng 10 số. Mật khẩu: Tối thiểu 8 ký tự, có chữ và số.
  - Chặn NoSQL Injection: Từ chối nếu tham số (id, email) là Object hoặc Array.
- **OWASP Top 10:** Phòng chống triệt để lỗi phân quyền (BOLA/IDOR - User A không được xem dữ liệu User B), Mass Assignment.
- **Secrets:** Cấm hardcode API Key. Mật khẩu phải hash bằng bcrypt/argon2.

## 4. Kiểm thử (Testing)
- API mới viết xong phải được kiểm tra bằng Postman hoặc Unit Test (Jest).
- Xử lý lỗi tập trung (Global Exception Handler). Không dùng `console.log` bừa bãi, dùng thư viện logging chuẩn.

## 5. DevOps & Deployment
- Code phải sẵn sàng để đóng gói (Dockerfile multi-stage build).
- **TUYỆT ĐỐI KHÔNG** chạy `npm run dev` hoặc tự ý khởi động server. Không tự ý `git commit` hay `git push`.