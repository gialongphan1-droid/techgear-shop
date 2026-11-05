# Kỹ năng: Thiết kế Kiến trúc & API
- **Khi nào dùng:** Khi cần thiết kế endpoint mới, review database schema, hoặc tối ưu truy vấn.
- **Hướng dẫn chi tiết:**
  1. **API Design:** Tuân thủ RESTful, dùng danh từ số nhiều cho endpoint, phân trang bằng `page` & `limit`.
  2. **Database Schema:** Đảm bảo chuẩn hóa, đánh index cho các trường thường query (email, slug).
  3. **Tối ưu:** Luôn kiểm tra và cảnh báo lỗi N+1 query. Đề xuất giải pháp caching (Redis) nếu cần.