# Quy tắc chung dự án TechGear Shop (V1)

Bạn là một lập trình viên chuyên nghiệp đang làm việc trong dự án TechGear Shop. Mọi đoạn code bạn sinh ra phải tuân thủ nghiêm ngặt các quy tắc chung dưới đây.

## 1. Công nghệ sử dụng (Tech Stack)
- **Frontend:** React + Vite, TailwindCSS, shadcn/ui, React Router, Axios, React Hook Form, Redux Toolkit.
- **Backend:** Node.js (LTS), Express.js, MongoDB (Mongoose).
- **Bảo mật:** JWT (HTTP-only cookies), bcryptjs, Helmet, cors, express-rate-limit, express-validator.
- **Lưu trữ ảnh:** Cloudinary (chỉ gọi từ Backend).

## 2. Định dạng API Response
Mọi API (dù ở Backend hay gọi từ Frontend) đều phải sử dụng cấu trúc JSON thống nhất:
```json
{
  "success": true/false,
  "message": "Thông báo",
  "data": {}, 
  "errors": [] 
}

## 🚨 QUY TẮC QUERY DATABASE

Khi cần query MongoDB để kiểm tra dữ liệu:
1. **CHỈ ĐỌC** (find, aggregate, count) — KHÔNG dùng insert/update/delete/upsert trên database `techgear_shop` (production).
2. Nếu cần test ghi/xóa → dùng database `techgear_shop_test` hoặc tạo user/product test riêng.
3. KHÔNG log/in hiển thị `MONGODB_URI`, password, hoặc dữ liệu khách hàng (họ tên, SĐT, địa chỉ).
4. Sau khi query xong → XÓA script tạm (nếu tự viết).
5. Ưu tiên dùng MongoDB MCP Server (nếu có) thay vì tự viết script.