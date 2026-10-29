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