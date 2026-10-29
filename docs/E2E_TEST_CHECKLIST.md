# Kế hoạch kiểm thử E2E - TechGear Shop

## 0. Chuẩn bị môi trường

- [ ] Frontend đang chạy tại `http://localhost:5173`.
- [ ] Backend đang chạy tại `http://localhost:5000` và `/api/health` trả về HTTP 200.
- [ ] MongoDB đã kết nối; dữ liệu test không bị chia sẻ ngoài môi trường nội bộ.
- [ ] Tài khoản Admin đã được seed:
  - Email: `admin@techgear.com`
  - Mật khẩu: kiểm tra từ biến môi trường hoặc dữ liệu seed nội bộ, không lưu vào tài liệu công khai.
- [ ] Ít nhất một Banner đang bật.
- [ ] Ít nhất một Danh mục đang bật (`isActive: true`).
- [ ] Ít nhất một Sản phẩm trạng thái `ACTIVE`, thuộc danh mục đang bật và có `stock >= 1`.
- [ ] Có một Sản phẩm hết hàng hoặc `stock = 0` để kiểm thử Edge Case.
- [ ] Trình duyệt đã dùng:
  - [ ] Desktop 1366x768.
  - [ ] Mobile viewport/tính năng responsive.
- [ ] Xóa cookie của origin `localhost:5173` trước luồng khách hàng.
- [ ] Mở DevTools > Network để kiểm tra Status, Request Headers, Response, Cookie.
- [ ] Mở DevTools > Application để kiểm tra cookie Admin, Cart và CSRF khi cần.

## 1. Kịch bản Khách hàng - Happy Path

### 1.1 Trang chủ

- [ ] Mở `http://localhost:5173/`.
- [ ] Không có lỗi đỏ trong Console.
- [ ] Không có trạng thái "Chưa thể tải dữ liệu cửa hàng".
- [ ] Banner đang bật được lấy từ API và hiển thị đúng ảnh, tiêu đề, liên kết.
- [ ] Danh mục đang bật được hiển thị đúng tên và biểu tượng ảnh.
- [ ] Danh sách sản phẩm nổi bật/mới hiển thị dữ liệu thật từ `/api/products`.
- [ ] Sản phẩm hiển thị tên, thương hiệu, giá gốc/giá khuyến mãi và ảnh hợp lệ.
- [ ] Đổi banner bằng nút trước/tiếp theo nếu có nhiều hơn một banner.

### 1.2 Trang chi tiết sản phẩm

- [ ] Chọn một Sản phẩm còn hàng và mở `/products/:slug`.
- [ ] Tên, thương hiệu, giá, ảnh, bảo hành và thông số kỹ thuật hiển thị đúng.
- [ ] Sản phẩm còn tồn kho và trạng thái đang bán được hiển thị là "Sẵn sàng giao hàng".
- [ ] Không hiển thị stock nội bộ hoặc dữ liệu không cần thiết.
- [ ] Chuyển đổi ảnh phụ hoạt động nếu sản phẩm có nhiều ảnh.
- [ ] Reload trang chi tiết vẫn tải đúng sản phẩm theo slug.

### 1.3 Thêm vào giỏ hàng

- [ ] Bấm "Thêm vào giỏ hàng".
- [ ] Hiển thị toast xác nhận thêm thành công.
- [ ] Icon giỏ hàng trên Header cập nhật số lượng.
- [ ] Không xuất hiện lỗi 403 CSRF.
- [ ] Không xuất hiện lỗi 422 nếu sản phẩm còn hàng.
- [ ] DevTools cho thấy `POST /api/cart/items` trả HTTP 200.
- [ ] Cookie `csrf_token` tồn tại và không bị đánh dấu HttpOnly; không tiết lộ Admin JWT.
- [ ] Cookie giỏ hàng được đánh dấu HttpOnly.
- [ ] Reload trang vẫn giữ số lượng giỏ hàng đúng.

### 1.4 Trang giỏ hàng

- [ ] Mở trang `/cart`.
- [ ] Sản phẩm vừa thêm xuất hiện đúng tên, thương hiệu, ảnh và giá.
- [ ] Số lượng ban đầu là 1.
- [ ] Bấm nút "+" hoặc "Tăng số lượng".
- [ ] DevTools cho thấy `PUT /api/cart/items/:productId` trả HTTP 200.
- [ ] Số lượng thay đổi thành 2.
- [ ] Từng dòng tính lại đúng `đơn giá x số lượng`.
- [ ] Tổng "Tạm tính" và tổng trong "Tóm tắt đơn hàng" bằng dữ liệu `subtotal` từ Backend.
- [ ] Bấm "-" có thể giảm số lượng; giảm về 0 thì dòng sản phẩm bị xóa.
- [ ] Tải lại trang không làm mất giỏ hàng ngoài ý muốn.
- [ ] Giỏ hàng rỗng hiển thị "Giỏ hàng đang trống".

### 1.5 Checkout

- [ ] Bấm "Tiến hành đặt hàng".
- [ ] URL chuyển sang `/checkout`.
- [ ] Tóm tắt bên phải chứa đúng sản phẩm, số lượng và giá.
- [ ] Nhập họ tên hợp lệ nhưng để trống SĐT; nút submit hiển thị lỗi SĐT bắt buộc.
- [ ] Nhập SĐT không hợp lệ; lỗi phải yêu cầu bắt đầu bằng `0` và đúng 10 chữ số.
- [ ] Nhập địa chỉ dưới 5 ký tự; lỗi ở trường địa chỉ.
- [ ] Nhập đầy đủ họ tên, SĐT `0xxxxxxxxx`, địa chỉ và ghi chú.
- [ ] Bấm "Xác nhận đặt hàng".
- [ ] DevTools cho thấy `POST /api/orders` trả HTTP 201 (hoặc 200 nếu yêu cầu trùng Idempotency).
- [ ] Không có lỗi 422 giá thay đổi hoặc tồn kho.
- [ ] Sau khi đặt hàng, icon giỏ hàng trở về 0.

### 1.6 Trang kết quả đặt hàng

- [ ] URL chuyển sang `/order-success`.
- [ ] Hiển thị "Đặt hàng thành công" và "Cảm ơn bạn đã mua sắm!".
- [ ] Hiển thị đầy đủ Mã đơn hàng và Mã tra cứu.
- [ ] Mã tra cứu được lưu rõ ràng để kiểm thử bước tiếp theo.
- [ ] Không hiển thị lại thông tin Mã tra cứu sau khi reload `/order-success`.
- [ ] Thông tin tóm tắt sản phẩm, số lượng và tổng tiền đúng với đơn vừa tạo.
- [ ] Bấm "Sao chép mã đơn và mã tra cứu" hoạt động hoặc hiển thị phương án ghi tay.

### 1.7 Tra cứu đơn hàng

- [ ] Mở trang `/track-order` bằng nút trên success page hoặc Header.
- [ ] Nhập đúng Mã đơn hàng và Mã tra cứu nhận được.
- [ ] Bấm "Tra cứu".
- [ ] DevTools cho thấy `POST /api/orders/track` trả HTTP 200.
- [ ] Trạng thái hiển thị là "Chờ xử lý" cho đơn mới.
- [ ] Số điện thoại API trả về dạng che bớt như `0987***321`.
- [ ] Không hiển thị lý do hủy hoặc ghi chú Admin.
- [ ] Thử nhập sai Mã tra cứu; UI phải hiển thị thông báo chung không tiết lộ sự khác biệt mã.
- [ ] Thông báo sai mã tra cứu giống thông báo không tìm thấy mã đơn.
- [ ] Thử nhiều lần sai mã liên tiếp để kích hoạt rate limit chặt; khi bị giới hạn thì hiển thị HTTP 429 hoặc thông báo chờ.

## 2. Kịch bản Quản trị Admin

### 2.1 Đăng nhập Admin

- [ ] Mở `/admin/login`.
- [ ] Nhập sai email/mật khẩu; hiển thị thông báo lỗi chung, không lộ mật khẩu hoặc JWT.
- [ ] Nhập đúng tài khoản seed.
- [ ] JWT được lưu trong HTTP-only cookie, không xuất hiện trong `localStorage`/`sessionStorage`.
- [ ] Không lưu Admin JWT trong Redux hoặc DOM.
- [ ] CSRF cookie/header được tạo đúng cho thao tác viết.
- [ ] Đăng nhập thành công chuyển về `/admin` hoặc `returnTo` hợp lệ.

### 2.2 Dashboard và đơn hàng mới

- [ ] Trang Dashboard tải dữ liệu thật:
  - [ ] Tổng số sản phẩm.
  - [ ] Tổng số danh mục.
  - [ ] Số đơn đang chờ xử lý.
  - [ ] Tổng doanh thu Completed nếu UI có hiển thị.
- [ ] Mở `/admin/orders`.
- [ ] Đơn hàng mới ở Kịch bản 1 xuất hiện trong danh sách.
- [ ] Bộ lọc trạng thái `Pending` hoạt động.
- [ ] Phân trang hoạt động nếu có nhiều đơn.
- [ ] Mở chi tiết `/admin/orders/:id`; thông tin khách hàng và sản phẩm khớp đơn vừa tạo.
- [ ] Lịch sử trạng thái ban đầu hiển thị đúng `Pending` nếu UI hỗ trợ.

### 2.3 Hủy đơn hàng và hoàn kho

- [ ] Mở menu/chọn trạng thái trên chi tiết đơn và chuyển sang `CANCELLED`.
- [ ] Nếu UI hỏi xác nhận, xác nhận hành động hủy.
- [ ] DevTools cho thấy `PATCH /api/admin/orders/:id/status` trả HTTP 200.
- [ ] Giao diện không cho chuyển Pending thẳng sang trạng thái sai luật; trường hợp không hợp lệ phải trả HTTP 409.
- [ ] Reload chi tiết; trạng thái đơn đã là `CANCELLED`.
- [ ] Lịch sử trạng thái ghi thêm dòng chuyển sang `CANCELLED`.
- [ ] Mở `/admin/inventory` hoặc `/admin/products`.
- [ ] Tồn kho của sản phẩm trong đơn đã cộng lại đúng số lượng trước khi hủy.
- [ ] Có ít nhất một `InventoryLog` ghi đúng Admin thực hiện, lý do, số lượng điều chỉnh và tồn kho trước/sau.
- [ ] Transaction không để tồn kho thành âm hoặc ghi history thiếu.

### 2.4 Tạo danh mục và sản phẩm mới

- [ ] Mở `/admin/categories`.
- [ ] Bấm tạo danh mục mới và nhập dữ liệu hợp lệ.
- [ ] Tên và slug không trùng danh mục hiện có.
- [ ] DevTools cho thấy request tạo danh mục thành công HTTP 200/201.
- [ ] Danh mục mới đang bật xuất hiện ngay trong danh sách Admin.
- [ ] Mở `/admin/products/new`.
- [ ] Nhập tên, slug, thương hiệu, danh mục mới, giá, tồn kho `stock >= 1` và thông tin bắt buộc.
- [ ] Tạo sản phẩm thành công.
- [ ] Không thấy lỗi validation hoặc upload ảnh không mong muốn.
- [ ] Mở trang khách `/products`.
- [ ] Danh mục và sản phẩm mới xuất hiện ngay, trong vòng trang reload/refetch.
- [ ] Mở chi tiết sản phẩm mới; thêm vào giỏ hàng hoạt động.
- [ ] Tắt danh mục/sản phẩm hoặc đổi trạng thái Inactive nếu cần; sản phẩm không còn xuất hiện ở Public API/UI.

## 3. Kịch bản Bảo mật và lỗi

### 3.1 Quyền truy cập Admin

- [ ] Xóa cookie phiên Admin hoặc đăng xuất.
- [ ] Truy cập trực tiếp `/admin` bằng URL.
- [ ] Hệ thống chuyển hướng về `/admin/login`.
- [ ] Gọi trực tiếp `/api/admin/dashboard` khi chưa đăng nhập; nhận HTTP 401.
- [ ] Gọi `/api/admin/upload` không cookie; nhận HTTP 401.
- [ ] Không có Dashboard hoặc dữ liệu đơn bị lộ trước redirect.

### 3.2 CSRF và Origin

- [ ] Xóa `csrf_token` hoặc gửi sai `x-csrf-token` cho một thao tác Admin/write public.
- [ ] API trả HTTP 403 "CSRF token không hợp lệ hoặc bị thiếu".
- [ ] Gọi mutation với `Origin` không nằm trong allowlist; API trả HTTP 403.
- [ ] Admin không thể thực hiện POST/PUT/PATCH/DELETE khi thiếu cả cookie và header token.

### 3.3 Sản phẩm hết hàng

- [ ] Chọn sản phẩm có `stock = 0`.
- [ ] Mở trang chi tiết.
- [ ] Thông tin có báo "Tạm hết hàng" hoặc trạng thái tương đương.
- [ ] Bấm Thêm vào giỏ; giao diện báo lỗi tồn kho rõ ràng.
- [ ] API trả HTTP 422 chứ không tạo dòng giỏ hàng thành công.
- [ ] Giỏ hàng/Header không cộng số lượng cho sản phẩm hết hàng.

### 3.4 Double-submit và Idempotency

- [ ] Chuẩn bị giỏ hàng hợp lệ và mở `/checkout`.
- [ ] Mở DevTools > Network và lọc `/api/orders`.
- [ ] Bấm "Xác nhận đặt hàng" liên tiếp hai lần thật nhanh.
- [ ] Cả hai request dùng cùng một `idempotencyKey`.
- [ ] Request thứ nhất tạo đơn; request thứ hai trả đơn cũ.
- [ ] Database chỉ có một đơn theo `idempotencyKey`.
- [ ] Database chỉ trừ tồn kho một lần.
- [ ] Header hoặc UI không đổi sang trạng thái lỗi trùng đơn.
- [ ] Nếu backend không nhận GET/Network double click do UI disable, kiểm tra bằng hai POST API thủ công cùng key.

### 3.5 Sai giá và sai tồn kho khi checkout

- [ ] Thêm sản phẩm vào giỏ.
- [ ] Đổi giá hoặc tồn kho ở Admin sau khi giỏ đã tải.
- [ ] Bấm checkout với `clientTotal` cũ.
- [ ] Nếu giá khác: API trả HTTP 422 cùng mã lỗi giá thay đổi.
- [ ] Nếu tồn kho không đủ: API trả HTTP 422 và không trừ kho dòng nào.
- [ ] Giỏ trên Frontend được refresh để phản ánh dữ liệu mới.

### 3.6 Upload ảnh

- [ ] Đăng nhập Admin.
- [ ] Upload file không phải ảnh; nhận HTTP 422.
- [ ] Upload file ảnh lớn hơn giới hạn; nhận HTTP 422.
- [ ] Upload JPEG/PNG/WEBP hợp lệ; nếu Cloudinary credential thật thì nhận HTTP 200 và `{ url, publicId }`.
- [ ] Nếu Cloudinary credential thiếu/sai: API trả HTTP 503 hoặc lỗi Cloudinary rõ ràng, không gây crash server.
- [ ] Không thấy Cloudinary `api_secret` lộ ra trong Network, Response hoặc Frontend.

## 4. Bộ smoke API bằng Postman/curl

### 4.1 Public API

- [ ] `GET /api/health` -> 200.
- [ ] `GET /api/banners` -> 200 và chỉ banner `isActive`.
- [ ] `GET /api/categories` -> 200 và chỉ category `isActive`.
- [ ] `GET /api/products?page=1&limit=20` -> 200 và chỉ sản phẩm ACTIVE thuộc danh mục Active.
- [ ] `GET /api/products/:slug` -> 200 cho sản phẩm Active hợp lệ.
- [ ] `GET /api/products/:slug` -> 404 cho slug không tồn tại/InActive.

### 4.2 Cart API

- [ ] `GET /api/cart` tạo CSRF cookie và trả giỏ đúng format.
- [ ] `POST /api/cart/items` -> 200 khi hợp lệ; 422 khi hết hàng/không hợp lệ.
- [ ] `PUT /api/cart/items/:productId` -> cập nhật đúng và số 0 xóa dòng.
- [ ] `DELETE /api/cart/items/:productId` -> xóa đúng dòng.
- [ ] `DELETE /api/cart` -> xóa toàn bộ giỏ.

### 4.3 Checkout và tracking

- [ ] `POST /api/orders` -> 201 cho đơn mới; 200 cho idempotent replay.
- [ ] `POST /api/orders` -> 422 khi cart rỗng.
- [ ] `POST /api/orders` -> 422 khi stock không đủ.
- [ ] `POST /api/orders` -> 422 khi `clientTotal` khác giá DB.
- [ ] `POST /api/orders/track` đúng mã -> 200; số điện thoại che.
- [ ] Sai mã đơn hoặc mã tra cứu -> cùng một thông báo 404.

### 4.4 Admin API

- [ ] Không cookie Admin:
  - [ ] `/api/admin/dashboard` -> 401.
  - [ ] `/api/admin/orders` -> 401.
  - [ ] `/api/admin/upload` -> 401.
- [ ] Với cookie Admin nhưng thiếu CSRF:
  - [ ] Mutation -> 403.
- [ ] `PATCH /api/admin/orders/:id/status` chuyển sai luật -> 409.
- [ ] `PATCH .../status` chuyển CANCELLED -> 200 và tồn kho được hoàn.

## 5. Playwright tự động - Kịch bản 1

Script mẫu nằm tại [src/frontend/e2e/customer-happy-path.spec.js](../src/frontend/e2e/customer-happy-path.spec.js).

### 5.1 Cài đặt và chạy

- [ ] Chạy:

```bash
cd src/frontend
npm install
npx playwright install chromium
npm run test:e2e
```

- [ ] Chạy có giao diện:

```bash
npm run test:e2e:headed
```

- [ ] Chạy Playwright UI:

```bash
npm run test:e2e:ui
```

- [ ] Script tự khám phá sản phẩm ACTIVE và thử các sản phẩm cho đến khi tìm được sản phẩm còn hàng.
- [ ] Nếu script không tìm thấy sản phẩm còn hàng, tạo dữ liệu seed hoặc điều chỉnh stock rồi chạy lại.
- [ ] Khi chạy Desktop và Mobile, cùng test Happy Path được thực thi hai lần.
- [ ] Khi fail, mở `playwright-report/index.html` và thư mục `test-results/` để xem trace, screenshot, video.

### 5.2 Phạm vi script hiện tại

- [ ] Kiểm tra Banner, Category, Product API/UI trên trang chủ.
- [ ] Mở trang chi tiết sản phẩm theo slug.
- [ ] Thêm sản phẩm còn hàng vào giỏ.
- [ ] Tăng số lượng từ 1 lên 2.
- [ ] Kiểm tra subtotal Cart response và UI.
- [ ] Điền form checkout và tạo đơn.
- [ ] Lưu/lấy Mã đơn hàng và Mã tra cứu từ API/DOM.
- [ ] Dùng mã để tra cứu đơn.
- [ ] Kiểm tra trạng thái PENDING và che số điện thoại qua API track.

## 6. Điểm dễ lỗi khi nối FE và BE

| Điểm rủi ro | Triệu chứng thường gặp | Cách kiểm tra |
| --- | --- | --- |
| CORS/Origin mismatch | Mutation nhận 403; browser báo CORS; write không chạy | `CLIENT_ORIGINS` hoặc `CLIENT_URL` phải gồm `http://localhost:5173`; Origin request phải khớp |
| Cookie credentials | Cart/Admin mất phiên; request POST thấy token nhưng server không nhận cookie | Axios phải `withCredentials: true`; Playwright context phải chia sẻ cookie |
| SameSite/Secure | Cookie không gửi trên origin/port khác hoặc môi trường HTTPS | Tắt Secure ở localhost HTTP; giữ `SameSite=strict/lax`; kiểm tra cookie thật trong Application |
| CSRF cookie/header | POST/PUT/PATCH/DELETE nhận 403 ngay cả khi Admin đã login | `GET /api/cart` phải tạo `csrf_token`; axios đọc cookie và gửi `x-csrf-token` |
| Token Admin/CSRF header stale | Logout/đổi phiên nhưng UI vẫn gửi token cũ | Clear cookie, reload `/admin/login`, verify lại bằng `/api/admin/me` |
| Response nesting sai | Frontend đọc `response.data.items` thay vì `response.data.data.items` | So khớp Response JSON `{ success, message, data, errors }` và service transform |
| Public API không lọc Active | Sản phẩm Inactive hoặc danh mục Inactive lộ trên Home | Kiểm tra filter `status: ACTIVE` và `categoryId` thuộc danh mục `isActive: true` |
| Cart cookie không bền vững | Header số lượng reset sau reload hoặc checkout mất giỏ | Kiểm tra HttpOnly cookie `techgear_cart`, TTL, cùng host và `sameSite` |
| CSRF cookie không được refresh | Giỏ chạy lúc đầu nhưng mutation sau đó nhận 403 | `GET /api/cart` phải chạy sau context mới để cấp `csrf_token` |
| Double submit dùng key khác | Tạo hai đơn trong 2 lần click | Chuẩn hóa `idempotencyKey` bằng UUID được tạo một lần mỗi mounted Checkout attempt |
| Thay đổi giá/tồn kho | Checkout 422 hoặc cart mismatch | Giỏ luôn lấy giá/stock từ DB; refresh cart sau lỗi, không tin giá Frontend |
| Trạng thái chữ hoa/thường | Admin chuyển đơn thất bại hoặc Dashboard không đếm Pending | Đơn dùng enum uppercase `PENDING...CANCELLED` |
| Ma trận trạng thái sai | UI cho Pending -> Completed; API phải trả 409 | Kiểm tra CĐ-02..CĐ-10 ở backend, không chỉ disable UI |
| Hoàn kho/History không atomic | Cancel đơn nhưng không cộng stock hoặc không có log | API phải dùng MongoDB transaction và hoàn kho cùng lúc |
| Cloudinary credential | Upload trả 503 hoặc lỗi cấu hình | Kiểm tra `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` trong backend `.env` |
| Tracking rate limit | UI nhận 429 hoặc mã sai được dò bằng brute force | Kiểm tra IP/code limit; mã sai và mã không tồn tại phải 404 cùng một message |
| Paginate/filter response sai | Order/Product list trắng hoặc sai trang | Kiểm tra `data.items`, `data.pagination`, page/limit và total |

## 7. Quy tắc Pass/Fail

- [ ] Pass khi tất cả API, UI và trạng thái dữ liệu mong đợi khớp.
- [ ] Pass khi không có console exception khiến luồng không thể tiếp tục.
- [ ] Pass khi không lộ JWT, Admin reason, ghi chú Admin hoặc trackHash trên Public API/DOM.
- [ ] Pass khi không tạo trùng đơn hoặc trừ kho hơn một lần trong double-submit.
- [ ] Fail khi có dữ liệu thật bị mất; ghi lại Step, HTTP status, Request/Response, screenshot và Playwright trace.
- [ ] Với UI lỗi dù API đúng: xem như lỗi FE/BE contract, không đánh dấu Pass dựa trên Network đơn lẻ.
