# Báo cáo tiến độ & API Backend (TechGear Shop)

**Cập nhật lần cuối:** 2026-11-01
**Trạng thái:** Backend V1 + Vector Search hoàn thiện

## 1. Thông tin môi trường

- **Base URL (local):** `http://localhost:5000/api`
- **Port:** `5000`
- **Database:** MongoDB Atlas
- **Vector DB:** Qdrant Cloud
- **Tài khoản Admin mẫu:** Dùng tài khoản được cấu hình trong môi trường phát triển. Không lưu mật khẩu trong tài liệu hoặc mã nguồn.

## 2. Quy tắc bảo mật cho Frontend

- **Cookie Admin:** `admin_token` (HTTP-only, Secure, SameSite=strict trong production).
- **Cookie Customer:** `user_token` (HTTP-only, Secure, SameSite=strict trong production).
- **CSRF:** Mọi request ghi (`POST`, `PUT`, `PATCH`, `DELETE`) cần Header `x-csrf-token`, lấy từ response đăng nhập.
- **CORS:** Local chỉ chấp nhận Origin đã cấu hình, mặc định `http://localhost:5173`. Production cần thay bằng domain thật.
- **Format response chuẩn:**

  ```json
  {
    "success": true,
    "message": "string",
    "data": {},
    "errors": []
  }
  ```

- Cookie là HTTP-only; FE không đọc bằng JavaScript. Dùng Redux store hoặc gọi `GET /api/auth/me` / `GET /api/admin/me` để khôi phục trạng thái đăng nhập.

## 3. Danh sách API đã hoàn thiện

### 3.1. Auth Admin

- `POST /api/admin/login` — Body: `{ "email": "...", "password": "..." }`. Trả `csrfToken` và cookie `admin_token`.
- `POST /api/admin/logout` — Đăng xuất.
- `GET /api/admin/me` — Kiểm tra phiên hiện tại.

### 3.2. Auth Customer

- `POST /api/auth/register` — Body: `{ "fullName": "...", "email": "...", "password": "..." }`. Gửi email xác thực.
- `GET /api/auth/verify-email?token=...` — Xác thực tài khoản.
- `POST /api/auth/login` — Trả `csrfToken` và cookie `user_token`.
- `GET /api/auth/me` — Trả hồ sơ `{ id, fullName, email, isVerified }`, không trả password hoặc token.
- `POST /api/auth/logout` — Đăng xuất.

### 3.3. Sản phẩm công khai

- `GET /api/products` — Danh sách sản phẩm ACTIVE. Query hỗ trợ `page`, `limit`, `category` (ObjectId hoặc slug), `brand`, `minPrice`, `maxPrice`, `sort`, `search`. Cache 60 giây.
  - Pagination: `{ page, limit, total, totalPages, hasNextPage }`.
  - Ví dụ lọc danh mục: `?category=6ae23347b4eb8261ae02ac15` hoặc `?category=chuot-may-tinh`.
- `GET /api/products/:slug` — Chi tiết sản phẩm ACTIVE.
- `GET /api/products/semantic-search` — Tìm kiếm ngữ nghĩa.
  - Query: `q` (tối thiểu 2 ký tự), `limit` (mặc định 10, tối đa 100).
  - Chỉ trả kết quả có `similarityScore >= SEMANTIC_SEARCH_THRESHOLD` (mặc định `0.82`).
  - Cache 5 phút; key gồm query, limit và threshold.
  - Không có kết quả đạt ngưỡng thì trả `items: []`, `total: 0`.
  - Ví dụ response:

    ```json
    {
      "success": true,
      "message": "Tìm kiếm ngữ nghĩa thành công",
      "data": {
        "query": "đồ chơi game",
        "items": [
          {
            "_id": "...",
            "name": "Chuột Logitech...",
            "similarityScore": 0.84
          }
        ],
        "total": 1
      },
      "errors": []
    }
    ```

- `GET /api/products/:id/similar` — Gợi ý sản phẩm tương tự.
  - Query hiện tại không nhận `limit`; service mặc định trả tối đa 5 sản phẩm.
  - Loại trừ sản phẩm đang xem; cache 5 phút theo product ID và limit.
  - Response data: `{ "items": [], "total": 0 }`.

### 3.4. Danh mục & Banner công khai

- `GET /api/categories` — Chỉ trả danh mục đang bật.
- `GET /api/banners` — Chỉ trả banner đang bật.

### 3.5. Giỏ hàng (yêu cầu `user_token`)

- `POST /api/cart/items` — Body: `{ "productId": "...", "quantity": 1 }`.
- `GET /api/cart`
- `PUT /api/cart/items/:productId` — Body: `{ "quantity": 1 }`.
- `DELETE /api/cart/items/:productId`
- `DELETE /api/cart`

### 3.6. Đơn hàng khách hàng (yêu cầu `user_token`)

- `POST /api/orders` — Body gồm `customerInfo`, `idempotencyKey`, `clientTotal`. Tự động trừ kho và xóa giỏ.
  - Snapshot `items` gồm `productId`, `name`, `sku`, `price`, `quantity`, `subtotal`, `image`.
- `POST /api/orders/track` — Body: `{ "orderCode": "...", "trackCode": "..." }`. Tra cứu ẩn danh.
- `GET /api/orders/my-orders` — Query: `page`, `limit`.
  - Trả `orderCode`, `createdAt`, `totalAmount`, `status`, `itemCount`, tối đa 3 `previewItems` và pagination.
  - `previewItems` gồm `{ "name": "...", "image": "https://...", "quantity": 1 }`.
  - Đơn được tạo trước khi snapshot ảnh được bổ sung có thể trả `image: null`; FE cần dùng placeholder.

### 3.7. Quản lý Admin (yêu cầu `admin_token` và CSRF)

- `GET/POST/PUT/DELETE /api/admin/products/*` — CRUD sản phẩm.
  - API update từ chối trường `stock` (BR-INV-13).
  - Tạo/sửa sản phẩm ACTIVE sẽ đồng bộ vector lên Qdrant.
  - Đổi trạng thái sang INACTIVE/PAUSED hoặc xóa sản phẩm sẽ xóa vector tương ứng.
- `PATCH /api/admin/products/:id/status` — Đổi trạng thái bán và đồng bộ Qdrant.
- `GET/POST/PUT/DELETE /api/admin/categories/*` — CRUD danh mục; xóa trả `409` nếu danh mục còn sản phẩm.
- `GET/POST/PUT/DELETE /api/admin/banners/*` — CRUD banner.
- `POST /api/admin/upload` — Upload ảnh Cloudinary bằng multipart (`image` hoặc `file`), tối đa 5 MB.
- `GET /api/admin/inventory` — Danh sách tồn kho.
- `POST /api/admin/inventory/adjust` — Body: `{ "productId": "...", "type": "...", "quantity": 1, "reason": "..." }`; ghi log `InventoryLog`.
- `GET /api/admin/orders` — Danh sách đơn hàng, hỗ trợ lọc trạng thái.
- `GET /api/admin/orders/:id` — Chi tiết đơn hàng.
- `PATCH /api/admin/orders/:id/status` — Cập nhật trạng thái theo ma trận; tự động hoàn kho nếu hủy.
- `GET /api/admin/dashboard` — Thống kê sản phẩm, danh mục, đơn chờ, đơn hoàn thành và doanh thu. Doanh thu chỉ tính đơn `COMPLETED`.

### 3.8. Health

- `GET /api/health` — Kiểm tra trạng thái API.

## 4. Trạng thái Database

Các collections chính:

- `admins`, `users`, `categories`, `products`, `banners`
- `carts`, `orders`, `inventorylogs`, `orderhistories`

Indexes chính:

- **Product:** `{ status: 1, categoryId: 1 }`, slug.
- **Order:** `userId`, unique `orderCode`.
- **User:** unique `email`.

## 5. Rate limiter

Cấu hình trong `src/backend/middleware/rateLimit.middleware.js`:

- Global API: 300 request / 15 phút.
- Admin Login: 5 request / 15 phút.
- Tạo đơn: 3 request / phút.
- Tra cứu đơn: 5 request / phút.
- Semantic Search: 30 request / phút.
- Có thể tắt tạm khi phát triển bằng `RATE_LIMIT_ENABLED=false`.

## 6. Cache

- `GET /api/products`: TTL 60 giây.
- Semantic search: TTL 5 phút; cache key gồm query, limit, threshold.
- Similar products: TTL 5 phút; cache key gồm product ID và limit.
- Cache danh sách sản phẩm công khai được xóa khi Admin thay đổi sản phẩm.

## 7. Vector Search & Qdrant Cloud

**Model embedding:** `onnx-community/granite-embedding-311m-multilingual-r2-ONNX`

- Vector dimensions: **768**
- Pooling: `cls`
- Không thêm instruction prefix.
- Quantized: q8.

**Qdrant Cloud:**

- Collection: `techgear_products`
- Distance: Cosine.
- Payload indexes: `productId` (keyword), `name` (text).

**Luồng đồng bộ:**

- Admin tạo/sửa sản phẩm ACTIVE → `upsertProductVector()` (embed và upsert Qdrant).
- Admin đổi trạng thái sang INACTIVE/PAUSED hoặc xóa → `deleteProductVector()`.
- Lỗi Qdrant không chặn CRUD MongoDB; lỗi được log.

**Scripts:**

- `npm run index:products` — Index toàn bộ sản phẩm ACTIVE vào Qdrant.
- `node scripts/test-qdrant-connection.js` — Kiểm tra kết nối và collection.
- `node scripts/test-qdrant-sync.js` — Kiểm tra upsert/delete vector.
- `node scripts/test-similar.js` — Kiểm tra API service gợi ý sản phẩm tương tự.

**Biến môi trường:**

```env
QDRANT_URL=https://<cluster>.aws.cloud.qdrant.io
QDRANT_API_KEY=<api-key>
QDRANT_COLLECTION=techgear_products
ENABLE_SEMANTIC_SEARCH=true
SEMANTIC_SEARCH_THRESHOLD=0.82
EMBEDDING_MODEL=onnx-community/granite-embedding-311m-multilingual-r2-ONNX
EMBEDDING_DIMENSION=768
```

## 8. Test Suite

- Backend Test Suite: **37/37 PASS** (2026-10-31).
- Semantic Search: **5/5 PASS** (query VI/EN, validation, cache, threshold).
- Similar Products: **4/4 PASS**.
- Qdrant Sync: đã xác minh luồng upsert/delete qua CRUD.
- E2E Playwright: cần cập nhật luồng đăng nhập trước khi đặt hàng và bổ sung test semantic search/similar.

## 9. Việc còn lại

- [ ] Cập nhật E2E Playwright cho luồng mới (login → semantic search → similar).
- [ ] FE tích hợp semantic search và khối sản phẩm tương tự.
- [ ] Hoàn thiện Admin Dashboard nếu FE yêu cầu.
- [ ] Deploy production (Vercel + Render + MongoDB Atlas + Qdrant Cloud + Cloudinary).
- [ ] Xoay vòng các API keys đã được chia sẻ trong quá trình phát triển (Qdrant, Cohere, Cloudinary).

## 10. Lưu ý khi deploy

Xem checklist chi tiết trong `README.md`. Tóm tắt:

- Đặt `NODE_ENV=production`, `RATE_LIMIT_ENABLED=true`, `COOKIE_SECURE=true`.
- Cập nhật `CLIENT_ORIGINS` thành domain production.
- Cấu hình MongoDB Atlas IP access list theo hạ tầng production; tránh mở toàn mạng nếu không cần thiết.
- Kiểm tra Qdrant Cloud network access, Cloudinary credentials và email credentials.
- Đảm bảo secrets được lưu trong secret manager/environment variables, không commit vào repository.
