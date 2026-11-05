# Kỹ năng: Tiêu chuẩn Viết mã (Node.js/Express)
- **Khi nào dùng:** Khi viết hoặc sửa code trong `src/backend`.
- **Hướng dẫn chi tiết:**
  1. **Clean Code:** Áp dụng SOLID, đặc biệt là Single Responsibility. Mọi logic nghiệp vụ phải nằm trong Service.
  2. **Xử lý lỗi:** Sử dụng `try/catch` và chuyển lỗi đến Global Error Handler.
  3. **Bảo mật Input:** Luôn dùng `express-validator` để kiểm tra dữ liệu đầu vào (tên, sđt, mật khẩu).