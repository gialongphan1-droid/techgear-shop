---
applyTo: "src/frontend/**/*, client/**/*, src/components/**/*, src/pages/**/*"
---
<!-- Lưu ý: Có thể sửa lại đường dẫn applyTo tùy theo thư mục dự án thực tế -->

# Quy tắc Phát triển Frontend (React/Vite)

Khi viết code trong thư mục Frontend, bạn phải tuân thủ các quy tắc sau:

## 1. Cấu trúc & Giao diện (UI/UX)
- Chia module theo tính năng (features). Sử dụng TailwindCSS và `shadcn/ui` cho giao diện.
- Bắt buộc thiết kế Responsive (Mobile, Tablet, Desktop).
- Sử dụng `React Hook Form` kết hợp validation phía Client để phản hồi lỗi nhanh cho người dùng (hiển thị lỗi theo từng trường).
- Các thao tác khó hoàn tác (Xóa, Hủy đơn) phải có hộp thoại xác nhận (Confirm Dialog).
- Trạng thái UI: Phải có hiệu ứng chờ (Loading/Spinner) khi gọi API và giữ nguyên dữ liệu form nếu có lỗi xảy ra.

## 2. Gọi API & Quản lý Trạng thái (State)
- **Axios:** Luôn cấu hình `withCredentials: true` để gửi kèm cookie (dùng cho Giỏ hàng và Đăng nhập Admin).
- **Xử lý lỗi tập trung qua Interceptor:** 
  - Nếu nhận mã `401`: Chuyển hướng về trang đăng nhập.
  - Nếu nhận mã `429` (Rate Limit): Hiển thị thông báo yêu cầu chờ.
- **Redux Toolkit:** Dùng để quản lý state toàn cục. Tuyệt đối **KHÔNG** lưu token hay dữ liệu nhạy cảm trong `localStorage` hoặc Redux store.
- Đồng bộ lại giỏ hàng từ Backend sau mỗi thao tác Thêm/Sửa/Xóa để tránh sai lệch dữ liệu.

## 3. Nghiệp vụ Cốt lõi
- **Tạo đơn hàng:** Khi khách bấm "Xác nhận đặt hàng", bắt buộc phải tạo và gửi kèm `idempotencyKey` (UUID) để chống tạo đơn trùng.
- **Giá cả:** Giá hiển thị trên UI chỉ mang tính chất tham khảo. Không tự ý tính toán tổng tiền cuối cùng ở Frontend rồi gửi lên làm giá trị chính thức.
- **Hiển thị an toàn:** Dữ liệu khách hàng (họ tên, địa chỉ, ghi chú) hiển thị dưới dạng văn bản thuần có escape (React tự động làm việc này, nhưng không dùng `dangerouslySetInnerHTML`).