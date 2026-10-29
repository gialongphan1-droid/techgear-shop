# PHẦN 7. THIẾT KẾ CƠ SỞ DỮ LIỆU

Phần này mô tả cấu trúc dữ liệu lưu trữ trên MongoDB Atlas. Do MongoDB là NoSQL, các bảng dưới đây đại diện cho Schema (được định nghĩa qua Mongoose). Các trường hệ thống tự động sinh như `_id` (ObjectId), createdAt, updatedAt được ngầm định có trong mọi Collection.

## 7.1. Collection: Product (Sản phẩm)

Lưu trữ thông tin sản phẩm, giá, tồn kho và cấu hình.

| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả & Ràng buộc | Tham chiếu |
| --- | --- | --- | --- | --- |
| `name` | String | Có | Tên sản phẩm, unique |  |
| `slug` | String | Có | URL thân thiện, unique, tự sinh từ name |  |
| `categoryId` | ObjectId | Có | Tham chiếu đến Category | 2.2.2 |
| `brand` | String | Có | Thương hiệu (ví dụ: ASUS, Dell) |  |
| `listPrice` | Number | Có | Giá niêm yết (VND), >= 0 | BR-PRC-02 |
| `salePrice` | Number | Không | Giá khuyến mãi (VND), < listPrice | BR-PRC-02 |
| `stock` | Number | Có | Tồn khả dụng, số nguyên >= 0 | BR-INV-01 |
| `status` | String | Có | ACTIVE (Đang kinh doanh), PAUSED (Tạm ngưng), INACTIVE (Ngừng kinh doanh) | 2.2.2 |
| `images` | Array[Object] | Có | `[{ url: String, isPrimary: Boolean, publicId: String }]` | SEC-19 |
| `specs` | Array[Object] | Không | `[{ key: String, name: String, value: String, unit: String }]` |  |
| `warranty` | String | Không | Chính sách bảo hành (ví dụ: "24 tháng chính hãng") |  |
| `seo` | Object | Không | `{ title, description, keywords }` | Phần 10 |
| `viewCount` | Number | Có | Lượt xem, mặc định 0 | UC-05 |

## 7.2. Collection: Category (Danh mục)

Lưu trữ cây danh mục sản phẩm. Trong V1, cấu trúc danh mục là 1 cấp (phẳng).

| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả & Ràng buộc | Tham chiếu |
| --- | --- | --- | --- | --- |
| `name` | String | Có | Tên danh mục |  |
| `slug` | String | Có | URL thân thiện, unique |  |
| `description` | String | Không | Mô tả ngắn |  |
| `iconUrl` | String | Không | Ảnh/icon đại diện (Cloudinary URL) |  |
| `isActive` | Boolean | Có | Trạng thái bật/tắt (mặc định true) | 2.2.3, QĐ-12 |

## 7.3. Collection: Banner

Lưu trữ các banner quảng cáo trang chủ.

| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả & Ràng buộc | Tham chiếu |
| --- | --- | --- | --- | --- |
| `title` | String | Có | Tiêu đề banner (chủ yếu để Admin quản lý) |  |
| `imageUrl` | String | Có | URL ảnh Cloudinary |  |
| `publicId` | String | Có | ID ảnh trên Cloudinary để hỗ trợ xóa | 8.6 |
| `linkUrl` | String | Có | Liên kết khi click (nội bộ hoặc http/https) | 2.2.4, SEC-15 |
| `position` | String | Có | Vị trí hiển thị (ví dụ: `HERO_SLIDER`, `SUB_BANNER`) | 8.12 |
| `isActive` | Boolean | Có | Bật/tắt hiển thị |  |

## 7.4. Collection: Admin

Lưu trữ tài khoản quản trị viên.

| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả & Ràng buộc | Tham chiếu |
| --- | --- | --- | --- | --- |
| `name` | String | Có | Họ tên quản trị viên |  |
| `email` | String | Có | Email đăng nhập, unique |  |
| `password` | String | Có | Mật khẩu đã được băm (bcryptjs) | SEC-10 |
| `tokenVersion` | Number | Có | Số phiên bản token để thu hồi phiên, mặc định 0 | QĐ-13 |
| `lastLogin` | Date | Không | Lần đăng nhập cuối thành công | UC-12 |

## 7.5. Collection: Cart (Giỏ hàng)

Lưu trữ giỏ hàng tạm của khách.

| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả & Ràng buộc | Tham chiếu |
| --- | --- | --- | --- | --- |
| `tokenHash` | String | Có | Hash của token ngẫu nhiên lưu trong cookie khách | QĐ-01, SEC-21 |
| `items` | Array[Object] | Không | `[{ productId: ObjectId, quantity: Number }]` | BR-CART-03 |
| `status` | String | Có | ACTIVE (đang mở), PROCESSING (đang xử lý), CONVERTED (đã thành đơn) | 2.4.4 |
| `expireAt` | Date | Có | Thời điểm tự động xóa giỏ (TTL Index, đề xuất 7 ngày) | BR-CART-05 |

## 7.6. Collection: Order (Đơn hàng)

Lưu trữ thông tin đơn hàng và snapshot dữ liệu tại thời điểm đặt.

| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả & Ràng buộc | Tham chiếu |
| --- | --- | --- | --- | --- |
| `orderCode` | String | Có | Mã đơn hiển thị (ví dụ: TG-2610-ABCD), unique | BR-ORD-06 |
| `trackHash` | String | Có | Hash của mã tra cứu bí mật | QĐ-02, SEC-21 |
| `idempotencyKey` | String | Có | Khóa chống gửi lặp từ Frontend, unique | NFR-09 |
| `customerInfo` | Object | Có | `{ fullName, phone, address, note }` | QĐ-04, SEC-20 |
| `items` | Array[Object] | Có | Snapshot: `[{ productId, name, sku, price, quantity, subtotal }]` | BR-PRC-04 |
| `totalAmount` | Number | Có | Tổng tiền do backend tính toán | BR-PRC-01 |
| `shippingFee` | Number | Có | Phí vận chuyển (V1 mặc định 0) | QĐ-05 |
| `status` | String | Có | PENDING, CONFIRMED, PROCESSING, SHIPPED, COMPLETED, CANCELLED, RETURNED | 2.3.2 |
| `payment` | Object | Không | [Mở rộng] Chứa dữ liệu thanh toán trong tương lai | NFR-04 |

## 7.7. Collection: InventoryLog & OrderHistory

Vì biến động tồn kho và lịch sử trạng thái đơn hàng đều cần tính bất biến (append-only), cấu trúc như sau:

### OrderHistory (Lịch sử đơn hàng)

| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả |
| --- | --- | --- | --- |
| `orderId` | ObjectId | Có | Tham chiếu Order |
| `fromStatus` | String | Không | Trạng thái trước (null nếu là CĐ-01) |
| `toStatus` | String | Có | Trạng thái đích |
| `actor` | String | Có | Tên Admin hoặc System |
| `reason` | String | Không | Lý do (bắt buộc khi Hủy/Returned) |
| `note` | String | Không | Ghi chú thêm |

### InventoryLog (Biến động tồn kho)

| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả |
| --- | --- | --- | --- |
| `productId` | ObjectId | Có | Tham chiếu Product |
| `type` | String | Có | initial, `order_create`, `order_cancel`, `admin_add`, `admin_subtract`, `admin_count`, `order_return` |
| `change` | Number | Có | Lượng thay đổi (có dấu) |
| `stockBefore` | Number | Có | Tồn khả dụng trước khi ghi |
| `stockAfter` | Number | Có | Tồn khả dụng sau khi ghi |
| `referenceId` | ObjectId | Không | Tham chiếu orderId nếu type thuộc `order_*` |
| `reason` | String | Không | Lý do Admin điều chỉnh |
| `actor` | String | Có | Tên Admin hoặc System |