# Kỹ năng: Bảo mật & Xác thực (OWASP Top 10)
- **Khi nào dùng:** Khi review code, đặc biệt là các endpoint xác thực, thanh toán, hoặc thao tác với dữ liệu người dùng.
- **Hướng dẫn chi tiết:**
  1. **Kiểm tra OWASP Top 10:** Chống SQL/NoSQL Injection, XSS, CSRF.
  2. **Phân quyền (BOLA/IDOR):** Đảm bảo người dùng A không thể truy cập dữ liệu của người dùng B.
  3. **Secrets:** Không hardcode API Key, mật khẩu phải được hash bằng bcrypt/argon2.