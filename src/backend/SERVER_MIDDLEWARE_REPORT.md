# Bao cao middleware trong server.js

File tham chieu: [server.js](./server.js)

## Cau hinh ung dung

- `app.disable("x-powered-by")`: tat header `X-Powered-By` cua Express.
- `app.set("trust proxy", 1)`: tin mot hop so proxy; duoc dung boi middleware xac dinh IP, trong so express-rate-limit.

## Middleware toan cau

Danh sach duoc ap dung theo thu tu:

1. `helmet()`: thiet lap cac HTTP security headers mac dinh.
2. `cors(...)`: kiem tra Origin trong danh sach `CLIENT_ORIGINS`/`CLIENT_URL`; cho request khong co Origin va cho phep cookie qua `credentials: true`.
3. `express.json({ limit: "1mb" })`: parse JSON request body voi gioi han 1 MB.
4. `express.urlencoded({ extended: false, limit: "1mb" })`: parse form URL-encoded voi gioi han 1 MB.
5. `cookieParser()`: parse cookie va luu gia tri vao `req.cookies`.
6. `globalApiRateLimiter` tren prefix `/api`: gioi han toc do chung cho API.

Sau middleware parser, `configureCloudinary()` khoi tao cau hinh Cloudinary; ham nay khong phai Express middleware va khong thay doi request/response.

## Router va middleware theo route

File dang mount cac router sau:

- `/api/admin`: adminAuth, adminProduct, adminCategoryBanner, adminInventory, adminOrder, adminDashboard va adminUpload.
- `/api/auth`: userAuth.
- `/api`: cart, order va public routes.

Nhieu router co the gan middleware rieng ben trong cac file route, vi du authentication, CSRF, validation, upload hoac rate limiter. `server.js` chi doc thay viec mount router va middleware toan cau, khong mount truc tiep cac middleware auth/validation/upload trong file nay.

## Handler cuoi

1. Handler 404: tra ve JSON voi `success: false` cho moi API chua khop route.
2. Error middleware: ghi log loi server; chuyen loi sang HTTP status code. Loi 500 tra thong diep chung `Internal server error`, loi khac tra loi cu the va du lieu API dong bo theo dinh dang:

```json
{
  "success": false,
  "message": "...",
  "data": {},
  "errors": []
}
```
