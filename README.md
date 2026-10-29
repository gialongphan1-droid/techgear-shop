# DỰ ÁN TECHGEAR SHOP (MERN STACK)

Chào mừng bạn đến với dự án TechGear Shop. Đây là hệ thống website thương mại điện tử bán máy tính và linh kiện, bao gồm Frontend (React + Vite) và Backend (Node.js + Express + MongoDB).

## 📚 TÀI LIỆU DỰ ÁN (QUAN TRỌNG)

Trước khi bắt đầu code, mọi thành viên (và AI) **bắt buộc** phải đọc các tài liệu sau:

- **Bộ quy tắc Code:** Đọc trong thư mục `.github/instructions/`.
- **Tài liệu SRS (Đặc tả yêu cầu):** Đọc trong thư mục `docs/` (từ file 01 đến 05).
- **Tiến độ Backend:** Đọc file `docs/BACKEND_PROGRESS.md` để biết API nào đã hoàn thiện và sẵn sàng tích hợp.

## 🚀 HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN

### 1. Cài đặt và chạy Backend

Mở Terminal, di chuyển vào thư mục backend và chạy các lệnh sau:
````bash
cd backend
npm install
**Cấu hình môi trường:**
Tạo file `.env` ở thư mục `backend/` (bạn có thể copy từ file `.env.example`). Điền các thông số kết nối MongoDB (`MONGODB_URI`), khóa bảo mật (`JWT_SECRET`), v.v.

**Khởi chạy Server:**
```bash
npm run dev
*(Server sẽ chạy ở cổng 5000)*

### 2. Cài đặt và chạy Frontend
Mở một Tab Terminal mới, di chuyển vào thư mục frontend và chạy:

```bash
cd frontend
npm install
npm run dev
*(Giao diện sẽ chạy ở cổng 5173)*

---

## 🛠 CÁC LỆNH TIỆN ÍCH (Dành cho Backend)
- **`npm run seed:admin`**: Khởi tạo tài khoản Admin đầu tiên vào Database.
  - *Tài khoản mặc định:* `admin@techgear.com`
  - *Mật khẩu:* `Admin@123456`
````
