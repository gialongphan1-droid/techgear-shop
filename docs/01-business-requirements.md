# TECHGEAR SHOP – WEBSITE MÁY TÍNH VÀ LINH KIỆN ĐIỆN TỬ

Tài liệu Đặc tả Yêu cầu Phần mềm (SRS) · Phiên bản 0.1 – bản nháp để rà soát · Ngày lập: 26/10/2026

# THÔNG TIN TÀI LIỆU

| Hạng mục | Nội dung |
| --- | --- |
| Tên dự án | TechGear Shop – Website Máy tính và Linh kiện điện tử |
| Phạm vi áp dụng | Phiên bản đầu tiên (V1), thời gian triển khai dự kiến 7 tuần |
| Nền tảng công nghệ | MERN Stack: MongoDB, Express.js, React + Vite, Node.js |
| Chủ dự án / bên đặt hàng | [Cần bổ sung] |
| Người lập / người phê duyệt | [Cần bổ sung] |

# MỤC LỤC

- [PHẦN 1. GIỚI THIỆU](#phần-1-giới-thiệu)
  - [1.1. Mục đích](#11-mục-đích)
  - [1.2. Mục tiêu dự án](#12-mục-tiêu-dự-án)
  - [1.3. Phạm vi dự án](#13-phạm-vi-dự-án)
  - [1.4. Đối tượng sử dụng](#14-đối-tượng-sử-dụng)
- [PHẦN 2. MÔ TẢ TỔNG QUAN](#phần-2-mô-tả-tổng-quan)
  - [2.1. Luồng hoạt động của khách hàng](#21-luồng-hoạt-động-của-khách-hàng)
  - [2.2. Luồng hoạt động của Admin](#22-luồng-hoạt-động-của-admin)
  - [2.3. Quy trình đơn hàng](#23-quy-trình-đơn-hàng)
  - [2.4. Quy tắc tồn kho](#24-quy-tắc-tồn-kho)
- [PHẦN 3. YÊU CẦU CHỨC NĂNG](#phần-3-yêu-cầu-chức-năng)
  - [3.1. Đặc tả chi tiết Use Case](#31-đặc-tả-chi-tiết-use-case)
  - [3.2. Ma trận phân quyền](#32-ma-trận-phân-quyền)
- [PHẦN 4. YÊU CẦU PHI CHỨC NĂNG](#phần-4-yêu-cầu-phi-chức-năng)
  - [4.1. Bảng yêu cầu phi chức năng](#41-bảng-yêu-cầu-phi-chức-năng)
  - [4.2. Ghi chú và tham chiếu chéo](#42-ghi-chú-và-tham-chiếu-chéo)
- [PHẦN 5. CÔNG NGHỆ SỬ DỤNG](#phần-5-công-nghệ-sử-dụng)
  - [5.1. Kiến trúc tổng thể và nguyên tắc chọn công nghệ](#51-kiến-trúc-tổng-thể-và-nguyên-tắc-chọn-công-nghệ)
  - [5.2. Thành phần Backend](#52-thành-phần-backend)
  - [5.3. Thành phần Frontend](#53-thành-phần-frontend)
  - [5.4. Thành phần Hạ tầng](#54-thành-phần-hạ-tầng)
  - [5.5. Định hướng SEO rendering](#55-định-hướng-seo-rendering)
  - [5.6. Hạ tầng triển khai](#56-hạ-tầng-triển-khai)
  - [5.7. Tổng hợp công nghệ và trạng thái chốt](#57-tổng-hợp-công-nghệ-và-trạng-thái-chốt)
- [PHẦN 6. GIAO DIỆN](#phần-6-giao-diện)
  - [6.1. Nguyên tắc thiết kế](#61-nguyên-tắc-thiết-kế)
  - [6.2. Danh sách màn hình](#62-danh-sách-màn-hình)
  - [6.3. Sơ đồ điều hướng](#63-sơ-đồ-điều-hướng)
  - [6.4. Trạng thái giao diện dùng chung](#64-trạng-thái-giao-diện-dùng-chung)
- [PHẦN 7. THIẾT KẾ CƠ SỞ DỮ LIỆU](#phần-7-thiết-kế-cơ-sở-dữ-liệu)
  - [7.1. Collection: Product (Sản phẩm)](#71-collection-product-sản-phẩm)
  - [7.2. Collection: Category (Danh mục)](#72-collection-category-danh-mục)
  - [7.3. Collection: Banner](#73-collection-banner)
  - [7.4. Collection: Admin](#74-collection-admin)
  - [7.5. Collection: Cart (Giỏ hàng)](#75-collection-cart-giỏ-hàng)
  - [7.6. Collection: Order (Đơn hàng)](#76-collection-order-đơn-hàng)
  - [7.7. Collection: InventoryLog & OrderHistory](#77-collection-inventorylog--orderhistory)
- [PHẦN 8. THIẾT KẾ API](#phần-8-thiết-kế-api)
  - [8.1. API Sản phẩm công khai (Khách hàng)](#81-api-sản-phẩm-công-khai-khách-hàng)
  - [8.2. API Danh mục và Banner công khai](#82-api-danh-mục-và-banner-công-khai)
  - [8.3. API Giỏ hàng (Khách hàng)](#83-api-giỏ-hàng-khách-hàng)
  - [8.4. API Đơn hàng phía Khách (Khách hàng)](#84-api-đơn-hàng-phía-khách-khách-hàng)
  - [8.5. API Xác thực Admin](#85-api-xác-thực-admin)
  - [8.6. API Quản lý Sản phẩm (Admin)](#86-api-quản-lý-sản-phẩm-admin)
  - [8.7. API Quản lý Danh mục & Banner (Admin)](#87-api-quản-lý-danh-mục--banner-admin)
  - [8.8. API Quản lý Tồn kho (Admin)](#88-api-quản-lý-tồn-kho-admin)
  - [8.9. API Quản lý Đơn hàng (Admin)](#89-api-quản-lý-đơn-hàng-admin)
  - [8.10. API Hệ thống & Dashboard](#810-api-hệ-thống--dashboard)
  - [8.11. Bảng mã trạng thái HTTP chuẩn hóa](#811-bảng-mã-trạng-thái-http-chuẩn-hóa)
  - [8.12. Quy tắc Validation đầu vào (Tham chiếu từ NFR-12 & SEC-13)](#812-quy-tắc-validation-đầu-vào-tham-chiếu-từ-nfr-12--sec-13)
- [PHẦN 9. YÊU CẦU BẢO MẬT (SECURITY)](#phần-9-yêu-cầu-bảo-mật-security)
- [PHẦN 10. TỐI ƯU HÓA CÔNG CỤ TÌM KIẾM (SEO)](#phần-10-tối-ưu-hóa-công-cụ-tìm-kiếm-seo)
  - [10.1. Yêu cầu chung về SEO (NFR-07)](#101-yêu-cầu-chung-về-seo-nfr-07)
  - [10.2. Structured Data (Dữ liệu có cấu trúc)](#102-structured-data-dữ-liệu-có-cấu-trúc)
  - [10.3. Phương án Render (Theo QĐ-09)](#103-phương-án-render-theo-qđ-09)
- [PHẦN 11. KẾ HOẠCH TRIỂN KHAI](#phần-11-kế-hoạch-triển-khai)
- [PHẦN 12. QUY TRÌNH VÀ NGHIỆM THU](#phần-12-quy-trình-và-nghiệm-thu)
  - [12.1. Cấu hình Môi trường và Tên miền](#121-cấu-hình-môi-trường-và-tên-miền)
  - [12.2. Khởi tạo tài khoản Admin đầu tiên](#122-khởi-tạo-tài-khoản-admin-đầu-tiên)
  - [12.3. Khởi tạo Tồn kho](#123-khởi-tạo-tồn-kho)
  - [12.4. Áp dụng Khuyến mãi](#124-áp-dụng-khuyến-mãi)
  - [12.5. Xử lý lỗi hệ thống & Log](#125-xử-lý-lỗi-hệ-thống--log)
  - [12.6. Checklist Nghiệm thu (QA Test Cases Core)](#126-checklist-nghiệm-thu-qa-test-cases-core)

# PHẦN 1. GIỚI THIỆU

## 1.1. Mục đích

Tài liệu này đặc tả yêu cầu phần mềm của TechGear Shop, website kinh doanh máy tính, laptop, PC và linh kiện điện tử. Khách hàng tra cứu thông số kỹ thuật, tìm kiếm, lọc, so sánh cấu hình, thêm sản phẩm vào giỏ hàng và tạo đơn hàng. Quản trị viên dùng Admin Panel để quản lý sản phẩm, danh mục, banner, tồn kho và đơn hàng mà không cần chỉnh sửa mã nguồn. SRS là tài liệu tham chiếu chung cho chủ dự án và các nhóm phân tích, thiết kế, phát triển, kiểm thử, triển khai. Tài liệu xác định hệ thống phải làm gì (yêu cầu chức năng), phải đạt mức nào (yêu cầu phi chức năng) cùng các ràng buộc về dữ liệu, API, bảo mật, SEO và tiến độ. Phần schema và API được viết đủ chi tiết để lập trình viên chuyển thành mã nguồn. Vai trò của SRS trong quá trình thực hiện dự án:

- Phát triển: xác định phạm vi và tiêu chí hoàn thành của từng hạng mục; mọi thay đổi phạm vi phải được cập nhật vào SRS trước khi triển khai.
- Kiểm thử: là căn cứ viết test case; mỗi Use Case, NFR và quy tắc validation phải truy vết được tới ít nhất một kịch bản kiểm thử.
- Nghiệm thu: chỉ các yêu cầu có trong SRS, hoặc qua yêu cầu thay đổi đã được duyệt, mới được dùng làm tiêu chí nghiệm thu (checklist tại mục 12.6).

### 1.1.1. Đối tượng sử dụng tài liệu

| Đối tượng | Mục đích sử dụng | Phần nên đọc |
| --- | --- | --- |
| Chủ dự án / bên đặt hàng | Xác nhận phạm vi, quy trình nghiệp vụ, quyết định cần chốt và tiêu chí nghiệm thu | 1, 2, 3, 11, 12 |
| BA / Product Owner | Quản lý yêu cầu, truy vết UC – NFR – kiểm thử, kiểm soát thay đổi phạm vi | 1–4, 12 |
| Thiết kế UI/UX | Dựng wireframe, mockup theo luồng nghiệp vụ và danh sách màn hình | 2, 3, 6 |
| Lập trình viên Backend | Cài đặt schema, API, quy tắc tồn kho, bảo mật | 2, 5, 7, 8, 9 |
| Lập trình viên Frontend | Cài đặt giao diện, giỏ hàng, bộ lọc, SEO | 2, 3, 5, 6, 8, 10 |
| Kiểm thử viên (QA) | Viết test case từ UC, NFR, validation, kịch bản đồng thời và checklist | 3, 4, 8.12, 9, 12.6 |
| DevOps / triển khai | Cấu hình hạ tầng, biến môi trường, giám sát | 5, 9, 11 |

### 1.1.2. Quy ước sử dụng trong tài liệu

| Tiền tố | Ý nghĩa | Vị trí |
| --- | --- | --- |
| UC-xx | Use Case (UC-01 đến UC-24) | Phần 3 |
| NFR-xx | Yêu cầu phi chức năng | Phần 4 |
| BR-xx | Quy tắc nghiệp vụ: BR-CART (giỏ hàng), BR-PRC (giá), BR-ORD (đơn hàng), BR-INV (tồn kho) | Phần 2, 3, 12 |
| SEC-xx | Yêu cầu bảo mật | Phần 9 |
| QĐ-xx | Giả định hoặc quyết định cần chốt | Mục 1.3.4 |
| M1 – M6 | Cột mốc dự án | Phần 11 |

| Nhãn | Ý nghĩa |
| --- | --- |
| [V1] | Thuộc phiên bản đầu tiên, nằm trong kế hoạch 7 tuần |
| [Mở rộng] | Định hướng tương lai, không triển khai và không nghiệm thu trong V1 |
| [Đề xuất] | Giải pháp do tài liệu đề xuất, cần chủ dự án hoặc người phụ trách kiến trúc phê duyệt |
| [Cần xác nhận] | Quyết định hoặc thông tin nghiệp vụ cần chủ dự án xác nhận |
| [Cần xác minh] | Phụ thuộc gói dịch vụ hoặc môi trường, phải kiểm tra khi triển khai |
| [Cần bổ sung] | Thông tin chưa được cung cấp (liên hệ, domain, chi phí), đang để placeholder |

Trong tài liệu, “phải” chỉ yêu cầu bắt buộc, “nên” chỉ khuyến nghị, “có thể” chỉ tùy chọn.

## 1.2. Mục tiêu dự án

TechGear Shop đưa hoạt động bán máy tính và linh kiện lên nền tảng web có giỏ hàng, đơn hàng và quản trị nội dung, trên kiến trúc đủ linh hoạt để bổ xử thanh toán trực tuyến và các tính năng thương mại điện tử khác về sau.

### 1.2.1. Mục tiêu kinh doanh

| STT | Mục tiêu | Mô tả | Truy vết |
| --- | --- | --- | --- |
| 1 | Giới thiệu sản phẩm chuyên nghiệp | Giao diện hiện đại, tập trung vào hình ảnh, giá và cấu hình sản phẩm | UC-01, UC-02, UC-06; Phần 6 |
| 2 | Tra cứu thông số kỹ thuật chi tiết | Bảng thông số theo từng danh mục, đơn vị đo rõ ràng, kèm thông tin bảo hành | UC-06; 7.1 |
| 3 | Hỗ trợ lựa chọn sản phẩm | Tìm kiếm, lọc theo danh mục, thương hiệu, giá, thông số; sắp xếp; so sánh 2–3 sản phẩm | UC-03 → UC-05, UC-24 |
| 4 | Cho phép mua hàng cơ bản | Giỏ hàng, nhập thông tin nhận hàng, tạo đơn hàng có mã đơn | UC-07 → UC-11; 2.1 |
| 5 | Quản trị không cần sửa mã nguồn | Admin quản lý sản phẩm, danh mục, banner, tồn kho, đơn hàng qua Admin Panel | UC-12 → UC-23; NFR-11 |
| 6 | Quản lý đơn hàng theo quy trình | Trạng thái xác định, không chuyển tùy ý, tồn kho nhất quán theo trạng thái | 2.3, 2.4; UC-20 → UC-22 |
| 7 | Tăng khả năng hiển thị trên công cụ tìm kiếm | Metadata, URL thân thiện, sitemap, structured data | Phần 10; NFR-07 |
| 8 | Sẵn sàng mở rộng | Lõi đơn hàng và tồn kho tách bạch để bổ sung thanh toán trực tuyến mà không phải thiết kế lại | NFR-04; 7.6 |

### 1.2.2. Mục tiêu kỹ thuật

| STT | Mục tiêu | Mô tả | Truy vết |
| --- | --- | --- | --- |
| 1 | Kiến trúc tách biệt | Frontend, backend, database và lưu trữ hình ảnh độc lập trên nền MERN Stack | Phần 5 |
| 2 | API nhất quán | RESTful API, định dạng lỗi thống nhất, validation thực hiện ở backend | 8.11, 8.12 |
| 3 | Toàn vẹn đơn hàng và tồn kho | Không bán vượt tồn kho (overselling), không tạo đơn trùng, không trừ hoặc hoàn kho nhiều lần | 2.4; NFR-09, NFR-10 |
| 4 | Bảo mật | JWT trong cookie HTTP-only, kiểm soát CSRF và CORS, rate limiting, bảo vệ dữ liệu khách hàng | Phần 9; NFR-02, NFR-12 |
| 5 | Hiệu năng đo được | Mục tiêu tải trang gắn với điều kiện kiểm thử cụ thể | NFR-01, NFR-06 |
| 6 | SEO phù hợp với SPA | Đánh giá và chốt phương án render trang sản phẩm, danh mục | 5.1, 10.3 |
| 7 | Dễ bảo trì, dễ kiểm thử | Tách lớp route – controller – service – model, module rõ ràng | NFR-08 |
| 8 | Chuẩn bị mở rộng | Thêm thanh toán, tài khoản khách hàng về sau không làm thay đổi lõi dữ liệu | NFR-04 |

Các mục tiêu trên không phải cam kết định lượng về doanh thu, lượng truy cập, thứ hạng tìm kiếm hay uptime. Chỉ tiêu đo được và cách nghiệm thu nằm ở Phần 4 và mục 12.6.

## 1.3. Phạm vi dự án

TechGear Shop V1 là website bán lẻ có giỏ hàng, tạo đơn hàng và quản lý đơn hàng, nhưng chưa tích hợp thanh toán trực tuyến. Khách hàng gửi đơn qua website, hệ thống lưu đơn kèm mã đơn, quản trị viên xử lý đơn trong Admin Panel.

```
Khách hàng --> [Website khách hàng] --+
                                      +--> [API Node.js + Express] --+--> [MongoDB Atlas]
Admin ------> [Khu vực quản trị] -----+                              +--> [Cloudinary: hình ảnh]
```

Sơ đồ ngữ cảnh mức logic của V1; mô hình triển khai và tên miền xem QĐ-08 và mục 5.2. Ngoài phạm vi V1: cổng thanh toán, đơn vị vận chuyển, hóa đơn điện tử, tài khoản khách hàng (mục 1.3.2).

### 1.3.1. Bao gồm trong phiên bản đầu tiên

| STT | Hạng mục | Mô tả và giới hạn | Tham chiếu |
| --- | --- | --- | --- |
| 1 | Trang chủ | Banner, danh mục, sản phẩm nổi bật và sản phẩm mới | UC-01 |
| 2 | Danh sách sản phẩm dạng lưới | Phân trang; hiển thị ảnh, tên, giá, giá khuyến mãi, tình trạng hàng | UC-02 |
| 3 | Trang chi tiết sản phẩm | Hình ảnh, mô tả, giá, nút thêm vào giỏ và so sánh | UC-06 |
| 4 | Bảng thông số kỹ thuật chi tiết | Thông số riêng theo từng danh mục, có đơn vị đo | UC-06; 7.1 |
| 5 | Giá, tình trạng còn hàng, chính sách bảo hành | Dữ liệu do backend cung cấp | UC-06; 7.1 |
| 6 | Tìm kiếm sản phẩm | Theo từ khóa, chỉ trong sản phẩm đang hoạt động | UC-03 |
| 7 | Lọc sản phẩm | Danh mục, thương hiệu, khoảng giá, thông số kỹ thuật (giá trị cụ thể và ngưỡng), kết hợp nhiều điều kiện | UC-04; 8.1 |
| 8 | Sắp xếp sản phẩm | Theo giá, độ mới, lượt xem | UC-05 |
| 9 | So sánh 2–3 sản phẩm | Đặt cấu hình cạnh nhau | UC-24 |
| 10 | Giỏ hàng | Thêm, sửa số lượng, xóa; không cần tài khoản | UC-07, UC-08 |
| 11 | Tạo đơn hàng | Nhập thông tin nhận hàng; backend kiểm tra hợp lệ, tồn kho, tính lại giá và tổng tiền | UC-09, UC-10 |
| 12 | Tra cứu đơn hàng | Cơ chế an toàn cho khách không có tài khoản (mục 1.3.3) | UC-11 |
| 13 | Quản lý sản phẩm | Thêm, sửa, xóa, tìm kiếm; upload nhiều ảnh lên Cloudinary | UC-14 → UC-16 |
| 14 | Quản lý danh mục | Thêm, sửa, xóa | UC-17 |
| 15 | Quản lý banner | Thêm, sửa, xóa, bật hoặc tắt | UC-18 |
| 16 | Quản lý tồn kho | Xem và điều chỉnh có kiểm soát, có ghi nhận thay đổi | UC-19 |
| 17 | Quản lý đơn hàng và trạng thái | Xem, lọc, xem chi tiết, cập nhật trạng thái theo quy trình | UC-20 → UC-22; 2.3 |
| 18 | Dashboard Admin | Thống kê từ dữ liệu thực tế | UC-13 |
| 19 | Đăng nhập, đăng xuất Admin | Xác thực trước khi truy cập chức năng quản trị | UC-12 |
| 20 | SEO cơ bản và cải thiện SEO | Metadata, sitemap, structured data, phương án render | Phần 10 |
| 21 | Responsive | Mobile, tablet, desktop | NFR-06 |
| 22 | Bảo mật API và validation dữ liệu | Xác thực, phân quyền, kiểm tra dữ liệu đầu vào | Phần 9; 8.12 |

### 1.3.2. Không bao gồm trong phiên bản đầu tiên

| STT | Hạng mục | Ghi chú xử lý trong V1 | Trạng thái |
| --- | --- | --- | --- |
| 1 | Đăng ký, đăng nhập tài khoản khách hàng | Khách mua không cần tài khoản; giỏ hàng và tra cứu đơn dùng cơ chế ẩn danh (mục 1.3.3) | [Mở rộng] |
| 2 | Thanh toán trực tuyến | Không có trạng thái, trường dữ liệu hay luồng “đã thanh toán”, “hoàn tiền” hoạt động; việc thu tiền diễn ra ngoài hệ thống (QĐ-06) | [Mở rộng] |
| 3 | Tích hợp cổng thanh toán bên thứ ba | Không tích hợp; không lưu thông tin thẻ hay tài khoản thanh toán | [Mở rộng] |
| 4 | Quản lý kế toán và hóa đơn điện tử | Không xuất hóa đơn, không đối soát doanh thu | [Mở rộng] |
| 5 | Tích hợp vận chuyển bên thứ ba | Không tính phí tự động, không tạo hay theo dõi vận đơn; Admin cập nhật trạng thái Shipped thủ công | [Mở rộng] |
| 6 | Chương trình khách hàng thân thiết | Không có điểm thưởng, hạng thành viên, mã giảm giá; giảm giá chỉ qua giá khuyến mãi của từng sản phẩm | [Mở rộng] |
| 7 | Tính năng chưa được xác định rõ | Mọi tính năng không nằm trong mục 1.3.1 (ví dụ: đánh giá sản phẩm, thông báo email/SMS, đa ngôn ngữ, phân quyền nhiều cấp cho Admin) mặc định ngoài phạm vi, chỉ đưa vào qua yêu cầu thay đổi đã duyệt | — |

### 1.3.3. Giỏ hàng và tra cứu đơn hàng khi chưa có tài khoản khách hàng

Vì V1 không có tài khoản khách hàng, hệ thống không xác minh được danh tính người mua; quyền truy cập giỏ hàng và đơn hàng dựa trên việc sở hữu một mã bí mật. Phương án và giới hạn bảo mật được nêu dưới đây; chi tiết tại 7.5, 7.6, 8.3, 8.4 và Phần 9.

| Chức năng | Phương án đề xuất | Giới hạn bảo mật và vận hành | Biện pháp giảm thiểu |
| --- | --- | --- | --- |
| Giỏ hàng | Lưu phía server, nhận diện bằng token ngẫu nhiên trong cookie HTTP-only; backend chỉ lưu giá trị băm của token (QĐ-01) | Ai nắm được token đều thao tác được giỏ đó; mất cookie là mất giỏ; giỏ không đồng bộ giữa các thiết bị | Token đủ entropy; cookie HTTP-only, Secure; giỏ tự hết hạn; không chứa dữ liệu cá nhân; giá luôn lấy lại từ database |
| Tra cứu đơn hàng | Mã đơn kết hợp mã tra cứu bí mật cấp một lần khi tạo đơn; backend chỉ lưu giá trị băm (QĐ-02) | Người có mã tra cứu xem được thông tin giao nhận của đơn; mất mã thì khách không tự tra cứu lại được | Mã ngẫu nhiên đủ dài; rate limiting; so sánh băm an toàn về thời gian; lỗi chung, không tiết lộ mã đơn có tồn tại hay không; che bớt số điện thoại khi hiển thị |
| Tạo đơn khi chưa xác minh người mua | Không xác minh số điện thoại bằng OTP trong V1 | Có thể bị tạo đơn ảo, spam hoặc chiếm giữ tồn kho; thông tin khách khai báo chưa được kiểm chứng | Rate limiting, validation, giới hạn số lượng mỗi đơn, chống gửi lặp; Admin xác nhận đơn (Pending → Confirmed) trước khi chuẩn bị hàng; hủy đơn sẽ hoàn kho |

### 1.3.4. Giả định, ràng buộc và quyết định cần chốt

| Mã | Nội dung | Trạng thái | Chi tiết tại |
| --- | --- | --- | --- |
| QĐ-01 | Giỏ hàng của khách lưu phía server, nhận diện bằng token ngẫu nhiên trong cookie HTTP-only; thời hạn giữ giỏ xác định ở mục 7.5 | [Đề xuất] | 7.5, 8.3, Phần 9 |
| QĐ-02 | Tra cứu đơn bằng “mã đơn + mã tra cứu bí mật”. Phương án “mã đơn + số điện thoại” tiện hơn nhưng kém an toàn vì số điện thoại dễ biết; chỉ chọn khi chủ dự án chấp nhận rủi ro này | [Đề xuất] | UC-11, 7.6, 8.4 |
| QĐ-03 | Tồn kho khả dụng bị trừ ngay khi đơn tạo thành công và hoàn lại khi hủy theo ma trận trạng thái; không trừ lần hai khi đổi trạng thái | [Đề xuất] | 2.3, 2.4 |
| QĐ-04 | Dữ liệu khách hàng tối thiểu: họ tên, số điện thoại, địa chỉ nhận hàng, ghi chú (không bắt buộc). Không thu thập email vì V1 chưa gửi email tự động | [Đề xuất] | 7.6; NFR-12 |
| QĐ-05 | Chưa có chính sách phí vận chuyển. Giả định V1 không tính phí trên hệ thống (shippingFee mặc định 0); giao diện nêu rõ phí (nếu có) do cửa hàng thông báo khi xác nhận đơn | [Cần xác nhận] | 7.6 |
| QĐ-06 | Cách thu tiền chưa xác định; V1 không có trạng thái hay luồng thanh toán trong hệ thống | [Cần xác nhận] | 2.3, 7.6 |
| QĐ-07 | Kênh liên hệ đặt hàng, tên miền, gói hosting và chi phí chưa xác định; mọi giá trị liên quan để placeholder | [Cần bổ sung] | 5.2, 12.1 |
| QĐ-08 | Cookie xác thực Admin và cookie giỏ hàng chỉ hoạt động ổn định khi frontend và backend cùng site, hoặc API được gọi qua cùng origin với frontend (proxy, rewrite). Nếu hai thành phần chạy trên hai tên miền khác site, trình duyệt có thể chặn cookie bên thứ ba và làm hỏng đăng nhập Admin, giỏ hàng. Đây là quyết định kiến trúc, cần chốt trước M1 | [Cần xác nhận] | 5.2, Phần 9 |
| QĐ-09 | Phương án render SEO (SPA kèm metadata, prerendering, SSR) là quyết định kiến trúc, cần chốt trước M1 | [Cần xác nhận] | 5.1, 10.3 |
| QĐ-10 | Transaction đa tài liệu của MongoDB yêu cầu replica set; khả năng áp dụng và giới hạn theo gói Atlas phải kiểm tra. Nếu không dùng transaction, dùng cập nhật có điều kiện nguyên tử kết hợp bù trừ | [Cần xác minh] | 2.4 |
| QĐ-11 | Gói hạ tầng miễn phí hoặc thấp có thể tạm ngưng dịch vụ khi không có truy cập, làm chậm lần truy cập đầu; không dùng làm cơ sở cam kết uptime hay hiệu năng | [Cần xác minh] | 5.2; NFR-01, NFR-03 |
| QĐ-12 | Chính sách xóa và vô hiệu hóa: sản phẩm đã từng có trong đơn chỉ được ngừng kinh doanh, xóa vĩnh viễn chỉ khi chưa từng có trong đơn; danh mục chỉ xóa được khi không còn sản phẩm tham chiếu; tắt danh mục thì ẩn các sản phẩm thuộc danh mục | [Đề xuất] | 2.2.2, 2.2.3, 8.6, 8.7 |
| QĐ-13 | Thời hạn phiên Admin, việc gia hạn và thu hồi phiên khi đăng xuất hoặc đổi mật khẩu (ví dụ số phiên bản token gắn với Admin) | [Cần xác nhận] | 2.2.8, UC-12, Phần 9 |
| QĐ-14 | Bổ sung trạng thái Returned (giao không thành, hàng về cửa hàng, nhập lại kho) và chuyển đổi trực tiếp Processing → Completed (CĐ-07) ngoài sáu trạng thái tham khảo | [Đề xuất] | 2.3.2, 2.3.3, 2.3.5 |
| QĐ-15 | Đơn đang giữ hàng không tự hết hạn trong V1: cảnh báo đơn Pending quá ngưỡng (đề xuất 24 giờ). Tự động hủy là tùy chọn, cần chủ dự án chấp nhận và cần job nền | [Cần xác nhận] | 2.4.7 |

## 1.4. Đối tượng sử dụng

Hệ thống có hai nhóm đối tượng. Khách hàng không cần đăng nhập trong V1; Admin phải xác thực trước khi truy cập bất kỳ chức năng quản trị nào.

| Đối tượng | Yêu cầu đăng nhập | Quyền truy cập và chức năng chính | Giới hạn |
| --- | --- | --- | --- |
| Khách hàng: người truy cập website công khai để tìm hiểu và đặt mua sản phẩm | Không yêu cầu (V1 không có tài khoản khách hàng) | Xem trang chủ, danh sách và chi tiết sản phẩm; tìm kiếm, lọc, sắp xếp; so sánh 2–3 sản phẩm; quản lý giỏ hàng của chính mình; tạo đơn hàng; tra cứu đơn của mình bằng mã tra cứu | Không truy cập được API quản trị; chỉ xem dữ liệu công khai (sản phẩm, danh mục, banner đang hoạt động); không xem được đơn hàng hay dữ liệu của khách khác; API tạo đơn và tra cứu bị giới hạn tần suất |
| Quản trị viên (Admin): nhân sự cửa hàng được cấp tài khoản quản trị | Bắt buộc; xác thực bằng JWT trong cookie HTTP-only, hết phiên phải đăng nhập lại | Xem Dashboard; thêm, sửa, xóa sản phẩm, danh mục, banner; upload ảnh; quản lý tồn kho; xem và xử lý đơn hàng, cập nhật trạng thái; đăng xuất | V1 chỉ có một vai trò quản trị, không phân cấp; không có đăng ký Admin công khai, tài khoản được khởi tạo theo quy trình an toàn (mục 12.2) |

Công cụ tìm kiếm và trình thu thập dữ liệu (crawler) đọc nội dung công khai nhưng không phải đối tượng sử dụng; phạm vi nội dung được thu thập nêu ở Phần 10. Ma trận phân quyền chi tiết theo từng chức năng nằm ở mục 3.2.

# PHẦN 2. MÔ TẢ TỔNG QUAN

Phần này mô tả cách TechGear Shop V1 vận hành ở mức nghiệp vụ: luồng của khách hàng (2.1), luồng của Admin (2.2), quy trình đơn hàng (2.3) và quy tắc tồn kho (2.4). Phần 2 chỉ nêu luồng và quy tắc ở mức tổng quan; đặc tả Use Case chi tiết nằm ở Phần 3, schema ở Phần 7 và API ở Phần 8. Mọi luồng dưới đây thuộc [V1]; điểm còn cần chốt được gắn nhãn [Đề xuất] hoặc [Cần xác nhận] theo quy ước ở mục 1.1.2.

## 2.1. Luồng hoạt động của khách hàng

Khách hàng không cần đăng nhập. Giỏ hàng được nhận diện bằng token ngẫu nhiên trong cookie HTTP-only, đơn hàng được tra cứu bằng mã tra cứu bí mật (mục 1.3.3, QĐ-01, QĐ-02). Luồng chính gồm 10 bước từ trang chủ đến kết quả đặt hàng. Tình huống bất thường được mô tả thành các nhánh ngoại lệ NL-01 đến NL-09 (2.1.5); tra cứu đơn hàng là luồng phụ (2.1.6).

### 2.1.1. Nguyên tắc xuyên suốt

| STT | Nguyên tắc | Ý nghĩa trong luồng | Tham chiếu |
| --- | --- | --- | --- |
| 1 | Giỏ hàng không phải đơn hàng | Thêm vào giỏ chỉ ghi nhận ý định mua (dữ liệu tạm): không tạo đơn, không giữ hàng, không trừ tồn kho. Đơn hàng chỉ phát sinh khi khách xác nhận và backend kiểm tra thành công | BR-CART-01, BR-ORD-01 |
| 2 | Backend là nguồn dữ liệu đáng tin cậy | Giá, tình trạng sản phẩm và tồn kho luôn lấy từ database. Frontend chỉ hiển thị, không quyết định giá hay tổng tiền | BR-PRC-01 |
| 3 | Kiểm tra sớm để cảnh báo, kiểm tra lại để quyết định | Kiểm tra ở giỏ hàng giúp khách biết vấn đề sớm nhưng không là bảo đảm; kiểm tra có giá trị là lần thực hiện khi tạo đơn | BR-CART-04 |
| 4 | Tạo đơn trọn vẹn hoặc không | Không tạo đơn một phần, không trừ kho một phần | BR-ORD-02 |
| 5 | Lỗi không làm khách mất dữ liệu | Khi có lỗi, giỏ hàng và thông tin đã nhập được giữ nguyên để khách sửa hoặc thử lại | 2.1.5 |

### 2.1.2. Mô tả các bước của luồng chính

| Bước | Khách hàng thực hiện | Hệ thống xử lý và phản hồi | UC |
| --- | --- | --- | --- |
| 1 | Truy cập trang chủ | Trả banner đang hoạt động, danh mục, sản phẩm nổi bật và sản phẩm mới; không trả dữ liệu đã bị vô hiệu hóa | UC-01 |
| 2 | Xem danh mục hoặc tìm kiếm sản phẩm | Trả danh sách dạng lưới, có phân trang, chỉ gồm sản phẩm đang kinh doanh; mỗi sản phẩm hiển thị ảnh, tên, giá, giá khuyến mãi (nếu có) và tình trạng còn hàng | UC-02, UC-03 |
| 3 | Lọc và sắp xếp | Kết hợp nhiều điều kiện: danh mục, thương hiệu, khoảng giá, thông số kỹ thuật (giá trị cụ thể hoặc ngưỡng); sắp xếp theo giá, độ mới, lượt xem. Cú pháp query tại 8.1 | UC-04, UC-05 |
| 4 | Xem chi tiết sản phẩm | Hiển thị ảnh, mô tả, giá niêm yết và giá khuyến mãi, bảng thông số kỹ thuật có đơn vị đo, chính sách bảo hành, tình trạng “Còn hàng” hoặc “Hết hàng” do backend xác định | UC-06 |
| 5 | (Tùy chọn) Chọn so sánh | Thêm sản phẩm vào danh sách so sánh (tối đa 3), hiển thị bảng thông số đặt cạnh nhau, từ đó quay lại chi tiết hoặc thêm vào giỏ. So sánh không tạo dữ liệu nghiệp vụ và không ảnh hưởng giỏ hàng. Nên giới hạn so sánh trong cùng danh mục vì bộ thông số khác nhau theo danh mục (7.1) [Đề xuất] | UC-24 |
| 6 | Thêm vào giỏ hàng | Nếu khách chưa có giỏ: tạo giỏ, sinh token ngẫu nhiên và đặt vào cookie HTTP-only (backend chỉ lưu giá trị băm). Kiểm tra sản phẩm còn được phép đặt mua, số lượng hợp lệ và không vượt tồn khả dụng; sản phẩm đã có trong giỏ thì cộng dồn. Không giữ hàng, không trừ tồn kho | UC-07 |
| 7 | Xem và chỉnh sửa giỏ hàng | Hiển thị từng dòng gồm ảnh, tên, đơn giá hiện hành, số lượng, thành tiền và tạm tính. Khách đổi số lượng hoặc xóa dòng, hệ thống tính lại. Dòng không còn hợp lệ (ngừng bán, thiếu hàng) được đánh dấu và không tính vào tạm tính | UC-07, UC-08 |
| 8 | Nhập thông tin nhận hàng | Biểu mẫu gồm họ tên, số điện thoại, địa chỉ nhận hàng và ghi chú không bắt buộc (QĐ-04). Frontend kiểm tra sơ bộ để phản hồi nhanh. Trang nêu rõ V1 không thanh toán trực tuyến; cách thu tiền và phí vận chuyển (nếu có) do cửa hàng thông báo khi xác nhận đơn (QĐ-05, QĐ-06) | UC-09 |
| 9 | Xác nhận đặt hàng | Frontend vô hiệu hóa nút trong lúc chờ, gửi kèm khóa chống gửi lặp (idempotency key) và tổng tiền đã hiển thị cho khách (chỉ để đối chiếu, không dùng để tính; BR-PRC-03) [Đề xuất]. Backend kiểm tra, tính lại, trừ tồn kho và lưu đơn theo 2.1.4 | UC-09 |
| 10 | Nhận kết quả đặt hàng | Trang kết quả hiển thị mã đơn, mã tra cứu (chỉ hiển thị một lần), tóm tắt đơn theo snapshot (bản sao dữ liệu tại thời điểm đặt) và trạng thái Pending (“Chờ cửa hàng xác nhận”). Giỏ hàng được đóng. Giao diện cho phép sao chép hoặc in tóm tắt trước khi khách rời trang [Đề xuất] | UC-10 |

Mã tra cứu chỉ hiển thị một lần vì backend chỉ lưu giá trị băm (QĐ-02). Khách rời trang mà chưa lưu mã thì không tự tra cứu lại được (giới hạn đã nêu ở 1.3.3).

### 2.1.3. Sơ đồ luồng

Ký hiệu: `(n)` là bước ở 2.1.2; `<...>` là điểm rẽ nhánh; `[NL-xx]` là nhánh ngoại lệ ở 2.1.5.

```
[Bắt đầu]
 |
 v(1) Truy cập trang chủ -- UC-01
 |
 v(2) Xem danh mục / Tìm kiếm sản phẩm -- UC-02, UC-03
 |
 v(3) Lọc (giá, thông số) và sắp xếp -- UC-04, UC-05
 |
 v(4) Xem chi tiết sản phẩm -- UC-06
 |
 +--> (5) So sánh 2-3 sản phẩm -- UC-24
 | |
 | +--> quay lại (4) hoặc sang (6)
 v(6) Thêm vào giỏ hàng -- UC-07
 | * Sản phẩm ngừng bán -> chặn, báo khách [NL-02]
 | * Số lượng vượt tồn -> chặn, báo số tối đa [NL-03]
 v(7) Xem giỏ, sửa số lượng, xóa dòng -- UC-07, UC-08
 |
 v<Giỏ rỗng?> --Có--> Báo "Giỏ hàng trống", về (2) [NL-01]
 | Không
 v(8) Nhập thông tin nhận hàng -- UC-09
 |
 v<Dữ liệu hợp lệ?> --Không--> Báo lỗi từng trường, giữ dữ liệu, về (8) [NL-05]
 | Có
 v(9) Bấm "Xác nhận đặt hàng" -- UC-09
 | (gửi kèm khóa chống gửi lặp + tổng tiền đã hiển thị)
 v+--- BACKEND (đồng bộ, chi tiết ở 2.1.4) ---------------------------|
 | Giới hạn tần suất -> Validate -> Tra khóa chống gửi lặp -> Nạp giỏ|
 | -> Kiểm tra từng dòng -> Tính lại giá -> Đối chiếu tổng tiền |
 | -> [Trừ tồn + Lưu đơn Pending + Đóng giỏ: một thao tác nhất quán] |
 +-------------------------------------------------------------------+
 |
 v<Kết quả xử lý?>
 |-- Yêu cầu trùng -> trả lại đơn đã tạo, không tạo đơn mới [NL-07]
 |-- Ngừng bán / thiếu hàng -> về (7), giỏ đã cập nhật [NL-02, NL-03]
 |-- Giá thay đổi -> hiện số liệu mới, chờ khách xác nhận lại [NL-04]
 |-- Vượt tần suất -> báo chờ, thử lại sau [NL-08]
 |-- Lỗi mạng / máy chủ -> giữ giỏ và dữ liệu, cho thử lại [NL-06]
 |-- Thành công
 v(10) Trang kết quả: mã đơn, mã tra cứu, tóm tắt -- UC-10
 |
 v[Kết thúc]
```

Từ bước (9) trở đi mới có thể phát sinh đơn hàng. Mọi bước trước đó chỉ là duyệt sản phẩm và chuẩn bị dữ liệu tạm.

### 2.1.4. Xử lý của backend khi khách xác nhận đặt hàng

| Bước | Xử lý của backend | Nếu không đạt |
| --- | --- | --- |
| a | Giới hạn tần suất cho API tạo đơn (Phần 9) | NL-08 |
| b | Kiểm tra Origin và CSRF; validate dữ liệu khách hàng (kiểu, độ dài, định dạng số điện thoại); làm sạch đầu vào (8.12, Phần 9) | NL-05 |
| c | Tra khóa chống gửi lặp: nếu khóa đã gắn với một đơn đã tạo thì trả lại kết quả của đơn đó và dừng | NL-07 |
| d | Nạp giỏ hàng theo token trong cookie; giỏ không tồn tại, đã hết hạn hoặc rỗng thì dừng | NL-01 |
| e | Nạp từng sản phẩm hiện hành từ database; kiểm tra còn được phép đặt mua và số lượng không vượt tồn khả dụng. Kiểm tra toàn bộ các dòng trước khi thay đổi bất kỳ dữ liệu nào | NL-02, NL-03 |
| f | Tính lại đơn giá áp dụng (BR-PRC-02), thành tiền từng dòng, tạm tính và tổng tiền từ giá trong database; bỏ qua mọi giá do client gửi | — |
| g | Đối chiếu tổng tiền vừa tính với tổng khách đã thấy; lệch thì dừng và trả số liệu hiện hành | NL-04 |
| h | Trong một thao tác nhất quán: trừ tồn kho bằng cập nhật có điều kiện (chỉ trừ khi tồn còn đủ), lưu đơn Pending cùng snapshot, sinh mã đơn và mã tra cứu (lưu băm), đóng giỏ hàng. Khóa chống gửi lặp có ràng buộc duy nhất để chặn hai yêu cầu đồng thời. Một bước thất bại thì không áp dụng bước nào (cơ chế: 2.4, QĐ-10; phương án B: bù trừ, rủi ro còn lại ở 2.4.4) | NL-03, NL-06, NL-07 |
| i | Trả kết quả: mã đơn, mã tra cứu (chỉ xuất hiện trong phản hồi này), tóm tắt đơn | — |

Bước c nằm trước bước d vì sau khi đơn đầu tiên thành công, giỏ đã đóng. Nếu tra giỏ trước, một yêu cầu lặp sẽ bị báo nhầm là “giỏ hàng trống”.

### 2.1.5. Các nhánh ngoại lệ

| Mã | Tình huống | Phát hiện ở | Xử lý của hệ thống | Kết quả với khách hàng |
| --- | --- | --- | --- | --- |
| NL-01 | Giỏ hàng rỗng (gồm giỏ đã hết hạn hoặc cookie giỏ bị xóa) | Bước 7–8; 2.1.4-d | Không cho chuyển sang bước nhập thông tin; backend từ từ chối tạo đơn kể cả khi API bị gọi trực tiếp; không thay đổi dữ liệu | Thông báo “Giỏ hàng trống” và gợi ý quay lại danh sách sản phẩm; không phát sinh đơn |
| NL-02 | Sản phẩm trong giỏ đã ngừng kinh doanh hoặc không còn được phép đặt mua | Bước 7; 2.1.4-e | Đánh dấu dòng “Không thể đặt mua”, loại khỏi tạm tính; chặn tạo đơn khi còn dòng này; không tự xóa dòng, không tạo đơn thiếu sản phẩm khi khách chưa đồng ý (BR-ORD-02) | Khách xóa dòng rồi tiếp tục hoặc quay lại mua sắm; không có đơn một phần |
| NL-03 | Sản phẩm không đủ tồn kho (gồm hết hàng) | Bước 6–7 (cảnh báo sớm); bắt buộc ở 2.1.4-e và 2.1.4-h | So sánh số lượng đặt với tồn khả dụng; nếu thiếu thì từ chối tạo đơn, trả dòng bị ảnh hưởng và số lượng tối đa hiện có, không trừ kho dòng nào. Khi hai khách đặt sản phẩm cuối cùng gần như đồng thời, chỉ một yêu cầu thành công (2.4, NFR-10) | Khách giảm số lượng hoặc xóa dòng rồi gửi lại; yêu cầu không thành công nhận thông báo hết hàng |
| NL-04 | Giá hoặc tồn kho thay đổi sau khi khách xem, trước khi tạo đơn | 2.1.4-g | Giá đổi: không tạo đơn, trả số liệu hiện hành (đơn giá, tổng tiền, tình trạng), không âm thầm tạo đơn với số tiền khác. Tồn kho đổi nhưng vẫn đủ: không ảnh hưởng, đơn xử lý bình thường; không đủ: chuyển sang NL-03 | Khách xem số liệu mới rồi xác nhận lại hoặc hủy |
| NL-05 | Dữ liệu khách hàng không hợp lệ | Bước 8 (sơ bộ); bắt buộc ở 2.1.4-b | Từ chối và trả lỗi theo từng trường; không tạo đơn, không đổi tồn kho | Lỗi hiển thị cạnh từng trường, dữ liệu đã nhập được giữ nguyên |
| NL-06 | Lỗi kết nối hoặc lỗi máy chủ | Bước 9–10: timeout, mất mạng, phản hồi 5xx | Frontend giữ nguyên giỏ và dữ liệu đã nhập; thông báo chung, không lộ thông tin nội bộ. Thử lại dùng cùng khóa chống gửi lặp (NL-07). Backend không để lại trạng thái dở dang (2.4; phương án B: bù trừ, rủi ro còn lại ở 2.4.4) | Thông báo “Chưa xác nhận được đơn hàng, vui lòng thử lại; hệ thống không tạo đơn trùng”. Nếu lỗi kéo dài, khách liên hệ cửa hàng (QĐ-07) |
| NL-07 | Gửi yêu cầu tạo đơn lặp lại (bấm nhiều lần, tải lại trang, thử lại sau lỗi mạng) | 2.1.4-c; 2.1.4-h | Không tạo đơn mới, không trừ kho lần hai; trả lại kết quả của đơn đã tạo. Cách cấp lại mã tra cứu khi phản hồi gốc bị thất lạc xem 8.4 [Đề xuất] | Khách thấy đúng một đơn |
| NL-08 | Vượt giới hạn tần suất | 2.1.4-a; API giỏ hàng, tra cứu đơn | Từ chối trước khi xử lý nghiệp vụ (HTTP 429) | Thông báo chờ và thử lại sau |
| NL-09 | Tra cứu đơn không thành công (sai mã đơn hoặc mã tra cứu) | 2.1.6 | Trả thông báo chung, không phân biệt “mã đơn không tồn tại” với “mã tra cứu sai”; tính vào giới hạn tần suất | Khách kiểm tra lại mã; nếu mất mã tra cứu thì liên hệ cửa hàng (QĐ-07, 1.3.3) |

### 2.1.6. Luồng phụ: tra cứu đơn hàng (UC-11)

Khách nhập mã đơn và mã tra cứu đã nhận ở bước 10. Backend chỉ trả thông tin tối thiểu cần thiết và không bao giờ liệt kê đơn của người khác.

```
[Mở trang Tra cứu đơn hàng] -- UC-11
 |
 vNhập mã đơn + mã tra cứu
 |
 v<Vượt giới hạn tần suất?> --Có--> Báo chờ, thử lại sau [NL-08]
 | Không
 v<Mã đơn và mã tra cứu khớp?> --Không--> Thông báo chung, không nêu sai mã nào [NL-09]
 | Có
 vHiển thị trạng thái, các dòng sản phẩm (snapshot), tổng tiền,thông tin nhận hàng (số điện thoại che bớt)
 |
 v[Kết thúc]
```

Backend so sánh mã tra cứu với giá trị băm bằng phép so sánh an toàn về thời gian (QĐ-02).

### 2.1.7. Quy tắc nghiệp vụ của luồng khách hàng

Giỏ hàng

| Mã | Quy tắc | Tham chiếu |
| --- | --- | --- |
| BR-CART-01 | Giỏ hàng là dữ liệu tạm. Thêm sản phẩm vào giỏ không tạo đơn hàng, không giữ hàng và không trừ tồn kho | 7.5, 7.6 |
| BR-CART-02 | Giỏ hàng chỉ được nhận diện bằng token ngẫu nhiên trong cookie HTTP-only; không có cách truy cập giỏ của người khác bằng ID đoán được. Giỏ không chứa dữ liệu cá nhân. Các request ghi vào giỏ chịu kiểm tra Origin và CSRF | QĐ-01, QĐ-08, 8.3, Phần 9 |
| BR-CART-03 | Số lượng mỗi dòng là số nguyên từ 1 trở lên; số lượng mỗi dòng và số dòng mỗi giỏ có giới hạn tối đa (giá trị cụ thể tại 8.12), áp dụng cả khi tạo đơn để hạn chế lạm dụng. Thêm cùng một sản phẩm nhiều lần thì cộng dồn vào một dòng | 8.12 |
| BR-CART-04 | Chỉ sản phẩm đang kinh doanh, được phép đặt mua và đủ tồn khả dụng mới thêm được vào giỏ. Kiểm tra ở giỏ chỉ để cảnh báo sớm; kiểm tra có giá trị là kiểm tra khi tạo đơn | 2.1.4 |
| BR-CART-05 | Giỏ hàng có thời hạn lưu và tự hết hạn (thời hạn cụ thể xác định ở 7.5). Dòng không còn hợp lệ được đánh dấu cho khách xử lý, không tự biến mất và không được tính vào tạm tính | QĐ-01, 7.5, NL-02 |

Giá

| Mã | Quy tắc | Tham chiếu |
| --- | --- | --- |
| BR-PRC-01 | Giá do backend quyết định: đơn giá, thành tiền, tạm tính và tổng tiền của đơn đều do backend tính từ giá hiện hành trong database. Giá hoặc tổng tiền do client gửi lên không được dùng để tính đơn | 2.1.4, 8.4 |
| BR-PRC-02 | Đơn giá áp dụng là giá khuyến mãi nếu sản phẩm có giá khuyến mãi hợp lệ, ngược lại là giá niêm yết. Điều kiện khuyến mãi và cách nhập giá xem 12.4 | 7.1, 12.4 |
| BR-PRC-03 | Tổng tiền hiển thị ở giỏ và biểu mẫu đặt hàng là tạm tính để khách tham khảo. Nếu tổng tiền backend tính lại khi tạo đơn khác tổng khách đã thấy, khách phải xác nhận lại. Tổng khách đã thấy chỉ dùng để đối chiếu, không bao giờ là tổng tiền của đơn [Đề xuất] | NL-04 |
| BR-PRC-04 | Khi tạo đơn, tên, SKU (nếu có) và giá được lưu thành snapshot; thay đổi sản phẩm về sau không làm đổi đơn đã tạo | 7.6 |
| BR-PRC-05 | V1 chưa có chính sách phí vận chuyển: phí trên hệ thống mặc định bằng 0, tổng tiền bằng tạm tính; phí phát sinh (nếu có) do cửa hàng thông báo khi xác nhận đơn | QĐ-05 |

Đơn hàng

| Mã | Quy tắc | Tham chiếu |
| --- | --- | --- |
| BR-ORD-01 | Đơn hàng chỉ được tạo khi khách chủ động xác nhận (bước 9) và backend kiểm tra thành công mọi điều kiện | 2.1.4 |
| BR-ORD-02 | Tạo đơn trọn vẹn hoặc không: nếu một dòng không hợp lệ (ngừng bán, thiếu hàng) thì không tạo đơn và không trừ kho của bất kỳ dòng nào; hệ thống không tự tạo đơn một phần | NL-02, NL-03 |
| BR-ORD-03 | Đơn mới có trạng thái Pending và tồn kho khả dụng bị trừ ngay khi tạo đơn thành công; quy tắc chuyển trạng thái và hoàn kho xem 2.3, 2.4 | QĐ-03, 2.3, 2.4 |
| BR-ORD-04 | Mỗi lần xác nhận tạo tối đa một đơn và mỗi giỏ chuyển thành tối đa một đơn: khóa chống gửi lặp kết hợp việc đóng giỏ nằm trong cùng thao tác nhất quán với tạo đơn | NL-07, NFR-09 |
| BR-ORD-05 | Chỉ thu thập dữ liệu khách hàng tối thiểu: họ tên, số điện thoại, địa chỉ nhận hàng, ghi chú (không bắt buộc). Không thu thập email, không lưu thông tin thanh toán | QĐ-04, NFR-12 |
| BR-ORD-06 | Mã đơn và mã tra cứu do backend sinh. Mã đơn không phải bí mật và không được dùng riêng làm cơ chế bảo vệ; quyền xem đơn của khách dựa trên mã tra cứu bí mật, cấp một lần và chỉ lưu giá trị băm | QĐ-02, 8.4 |
| BR-ORD-07 | V1 không có trạng thái, trường dữ liệu hay luồng thanh toán; việc thu tiền diễn ra ngoài hệ thống | QĐ-06, 1.3.2 |

## 2.2. Luồng hoạt động của Admin

Admin là nhân sự cửa hàng được cấp tài khoản theo quy trình ở mục 12.2; V1 chỉ có một vai trò quản trị (mục 1.4). Mọi chức năng quản trị đều yêu cầu phiên xác thực hợp lệ và không có chức năng quản trị nào truy cập được qua API công khai (ma trận phân quyền: 3.2). Mục 2.2.1 mô tả luồng tổng quát và chuỗi kiểm soát chuẩn mà mọi thao tác ghi đều đi qua; các mục 2.2.2 đến 2.2.8 chỉ nêu phần đặc thù của từng chức năng.

### 2.2.1. Luồng tổng quát

Tham chiếu: UC-12, UC-13 · API: 8.5, 8.10 · Bảo mật: Phần 9

| Bước | Admin | Hệ thống | UC |
| --- | --- | --- | --- |
| 1 | Truy cập khu vực quản trị (đường dẫn riêng, tách khỏi giao diện khách; không coi việc giấu đường dẫn là biện pháp bảo mật) | Frontend gọi GET /api/admin/me để kiểm tra phiên, vì JavaScript không đọc được cookie HTTP-only. Có phiên hợp lệ thì vào Dashboard; nhận 401 thì chuyển tới trang đăng nhập | UC-12 |
| 2 | Nhập email và mật khẩu | Frontend kiểm tra sơ bộ định dạng rồi gửi POST /api/admin/login | UC-12 |
| 3 | — | Backend giới hạn tần suất đăng nhập, tìm Admin theo email, so sánh mật khẩu với giá trị băm bcryptjs. Sai thì trả thông báo chung “Email hoặc mật khẩu không đúng”, không cho biết email có tồn tại và tính vào giới hạn tần suất | UC-12 |
| 4 | — | Đúng thì ký JWT, đặt trong cookie HTTP-only (Secure, SameSite theo QĐ-08), cập nhật lastLogin; trả thông tin Admin tối thiểu, không trả token trong nội dung phản hồi | UC-12 |
| 5 | Xem Dashboard | Số liệu tính từ dữ liệu thực (số sản phẩm, danh mục, đơn hàng theo trạng thái, sản phẩm hết hàng, đơn Pending quá ngưỡng, tổng số lượng đang giữ). V1 không đối soát doanh thu (1.3.2) nên không có chỉ số doanh thu. Chi tiết: 8.10 | UC-13 |
| 6 | Chọn chức năng quản lý | Điều hướng tới Sản phẩm, Danh mục, Banner, Tồn kho, Đơn hàng; mọi trang quản trị đều qua kiểm tra phiên | UC-14 → UC-22 |
| 7 | Thực hiện thêm, sửa, xóa hoặc cập nhật | Frontend kiểm tra sơ bộ rồi gửi request kèm cookie và cơ chế chống CSRF | UC-14 → UC-22 |
| 8 | — | Backend chạy chuỗi kiểm soát chuẩn trong sơ đồ dưới đây rồi trả kết quả | — |
| 9 | Nhận kết quả | Thành công thì thông báo và làm mới danh sách; lỗi thì thông báo theo trường và giữ dữ liệu đang nhập. Thao tác khó hoàn tác (xóa, hủy đơn) có xác nhận trước (NFR-11) | UC-23 |
| 10 | Đăng xuất hoặc hết phiên | Xem 2.2.8 | UC-12 |

```
[Bắt đầu]
 |
 vTruy cập khu vực quản trị
 |
 v<Có phiên hợp lệ? (GET /api/admin/me)> --Có--> Dashboard -- UC-13
 | Chưa có hoặc 401
 vNhập email + mật khẩu -- UC-12
 |
 vBackend: giới hạn tần suất -> tìm Admin theo email -> so sánh mật khẩu (bcryptjs)
 |
 +--> Sai hoặc vượt tần suất: thông báo chung, ở lại màn hình đăng nhập
 |
 v (đúng)Cấp JWT trong cookie HTTP-only, ghi lastLogin
 |
 vDashboard -- UC-13
 |
 vChọn chức năng: Sản phẩm / Danh mục / Banner / Tồn kho / Đơn hàng
 |
 vThực hiện thêm, sửa, xóa hoặc cập nhật -- UC-14 đến UC-22
 |
 v+--- BACKEND: chuỗi kiểm soát chuẩn cho mọi thao tác ghi ---------------|
 | 1. Giới hạn tần suất; kiểm tra Origin và token CSRF (sai -> 403) |
 | 2. Xác thực phiên: JWT trong cookie (thiếu, sai hoặc hết hạn -> 401) |
 | 3. Kiểm tra quyền Admin (không đủ quyền -> 403) |
 | 4. Validate dữ liệu (sai -> 422) |
 | 5. Kiểm tra quy tắc nghiệp vụ: tham chiếu, tồn kho, điều kiện chuyển |
 | trạng thái, số phiên bản dữ liệu (xung đột -> 409) |
 | 6. Ghi database: cập nhật có điều kiện; transaction khi cần (QĐ-10) |
 | 7. Ghi nhận lịch sử cho thao tác cần truy vết (7.7), rồi trả kết quả |
 +-----------------------------------------------------------------------+
 |
 +--> Lỗi: hiển thị thông báo hoặc lỗi theo trường, giữ dữ liệu đang nhập
 |
 v (thành công)Cập nhật giao diện, Admin tiếp tục chức năng khác
 |
 vĐăng xuất hoặc phiên hết hạn -- UC-12 (xem 2.2.8)
 |
 vXóa cookie, về trang đăng nhập
 |
 v[Kết thúc]
```

Frontend chỉ kiểm tra để phản hồi nhanh; mọi quyết định về quyền, dữ liệu và quy tắc nghiệp vụ do backend thực hiện. Mã trạng thái HTTP trong sơ đồ là đề xuất, sẽ thống nhất ở 8.11.

### 2.2.2. Quản lý sản phẩm

Tham chiếu: UC-14 → UC-16 · API: 8.6 · Dữ liệu: 7.1, 7.2

```
Mở "Quản lý sản phẩm" -> Xem, tìm kiếm, lọc danh sách (UC-15)
 -> Thêm mới hoặc chọn sản phẩm cần sửa (UC-14)
 -> Nhập thông tin cơ bản, giá, bảo hành, thông số kỹ thuật, SEO
 -> Tải nhiều ảnh lên Cloudinary (UC-16)
 -> Lưu -> Backend: chuỗi kiểm soát chuẩn (2.2.1) + kiểm tra riêng của sản phẩm
 -> Lưu database -> Trả kết quả -> Cập nhật danh sách
```

| Hạng mục | Mô tả |
| --- | --- |
| Danh sách và tìm kiếm (UC-15) | Phân trang; tìm theo tên hoặc slug; lọc theo danh mục và trạng thái bán. Khác danh sách công khai, danh sách quản trị gồm cả sản phẩm ngừng kinh doanh |
| Biểu mẫu thêm và sửa (UC-14) | Gồm thông tin cơ bản (tên, danh mục, thương hiệu, mô tả), giá niêm yết, giá khuyến mãi, bảo hành, thông số kỹ thuật và SEO. Slug tự sinh từ tên, cho phép chỉnh và phải duy nhất. Trường thông số hiển thị theo danh mục đã chọn, khóa thông số thuộc danh sách chuẩn hóa để bộ lọc hoạt động đúng (7.1); khi đổi danh mục, biểu mẫu yêu cầu rà soát lại thông số |
| Trạng thái bán | Đang kinh doanh: hiển thị và đặt mua được nếu còn hàng. Tạm ngưng đặt mua: vẫn hiển thị nhưng không thêm vào giỏ hay đặt mua được [Đề xuất]. Ngừng kinh doanh: ẩn khỏi danh sách và tìm kiếm công khai, không đặt mua được, có thể bật lại. “Hết hàng” không do Admin chọn mà suy ra từ tồn khả dụng bằng 0 (2.2.5) |
| Tồn kho trong biểu mẫu | Tồn kho đầu kỳ chỉ nhập khi tạo sản phẩm. Khi sửa, tồn kho chỉ hiển thị, không sửa trong biểu mẫu; mọi thay đổi đi qua quản lý tồn kho (2.2.5) để dữ liệu cũ trên biểu mẫu không ghi đè tồn kho vừa đổi do có đơn mới [Đề xuất] |
| Tải ảnh (UC-16) | Chọn nhiều ảnh; kiểm tra số lượng, dung lượng, định dạng (8.12, Phần 9); backend tải lên Cloudinary và trả về URL; Admin chọn ảnh đại diện và sắp xếp thứ tự. Ảnh đã tải nhưng sản phẩm chưa lưu, hoặc ảnh bị gỡ khỏi sản phẩm, được dọn khỏi Cloudinary theo cơ chế tại 8.6 [Đề xuất] |
| Sửa đồng thời | Yêu cầu sửa kèm số phiên bản bản ghi Admin đang xem; nếu bản ghi đã bị người khác thay đổi thì trả 409 và yêu cầu tải lại |
| Tác động của việc sửa | Đổi giá hoặc tên có hiệu lực với khách từ lúc lưu; giỏ hàng hiện có được tính lại theo giá mới; đơn đã tạo không đổi (BR-PRC-04) |
| Xóa | Hai thao tác tách biệt: “Ngừng kinh doanh” (giữ dữ liệu) và “Xóa vĩnh viễn” (chỉ khi sản phẩm chưa từng có trong đơn hàng nào; xóa kèm ảnh trên Cloudinary). Sản phẩm đã có trong đơn chỉ được ngừng kinh doanh để giữ toàn vẹn lịch sử đơn và việc hoàn kho khi hủy đơn. Giỏ hàng chứa sản phẩm bị ngừng hoặc xóa xử lý theo NL-02 (QĐ-12) |

| Ngoại lệ | Xử lý |
| --- | --- |
| Dữ liệu không hợp lệ (giá âm, giá khuyến mãi không nhỏ hơn giá niêm yết, thông số sai kiểu hoặc sai đơn vị) | Trả 422 kèm lỗi theo trường; giữ nguyên dữ liệu trên biểu mẫu (8.12) |
| Slug trùng | Trả 409; gợi ý slug khác |
| Danh mục không tồn tại | Trả 422 |
| Tải ảnh lỗi (sai định dạng, quá dung lượng, quá số lượng, Cloudinary không phản hồi) | Báo lỗi theo từng ảnh, giữ các ảnh hợp lệ và dữ liệu biểu mẫu, cho phép thử lại |
| Sửa đồng thời | Trả 409; Admin tải lại bản ghi rồi sửa tiếp |
| Xóa vĩnh viễn sản phẩm đã có trong đơn | Trả 409 và gợi ý “Ngừng kinh doanh” |
| Phiên hết hạn khi đang nhập | Trả 401, xử lý theo 2.2.8 |

### 2.2.3. Quản lý danh mục

Tham chiếu: UC-17 · API: 8.7 · Dữ liệu: 7.2

```
Mở "Quản lý danh mục" -> Xem danh sách -> Thêm mới / Sửa / Bật-Tắt / Xóa
 -> Nhập tên, slug, mô tả, icon, trạng thái, SEO
 -> Lưu -> Backend: chuỗi kiểm soát chuẩn + kiểm tra slug duy nhất
 -> Lưu database -> Trả kết quả
```

| Hạng mục | Mô tả |
| --- | --- |
| Tên và slug | Slug duy nhất. Đổi slug làm đổi URL danh mục đã có thể được lập chỉ mục nên giao diện cảnh báo trước khi lưu (Phần 10) |
| Tắt danh mục | Danh mục tắt bị ẩn khỏi menu và API công khai; sản phẩm thuộc danh mục đó không hiển thị công khai và không đặt mua được cho tới khi danh mục được bật lại; giỏ hàng đang chứa các sản phẩm này xử lý theo NL-02 (QĐ-12) |
| Xóa danh mục | Chỉ khi không còn sản phẩm nào tham chiếu (kể cả sản phẩm ngừng kinh doanh). Nếu còn: trả 409, hiển thị số sản phẩm liên quan và gợi ý chuyển sản phẩm sang danh mục khác hoặc tắt danh mục (QĐ-12) |

Ngoại lệ: slug trùng hoặc sửa đồng thời (409); dữ liệu không hợp lệ (422); xóa danh mục còn sản phẩm (409); phiên hết hạn (401, xem 2.2.8).

### 2.2.4. Quản lý banner

Tham chiếu: UC-18 · API: 8.7 · Dữ liệu: 7.3

```
Mở "Quản lý banner" -> Xem danh sách -> Thêm mới / Sửa / Bật-Tắt / Xóa
 -> Nhập tiêu đề, liên kết, vị trí, trạng thái; tải ảnh lên Cloudinary
 -> Lưu -> Backend: chuỗi kiểm soát chuẩn + kiểm tra ảnh và liên kết
 -> Lưu database -> Trả kết quả
```

| Hạng mục | Mô tả |
| --- | --- |
| Ảnh | Bắt buộc; kiểm tra định dạng và dung lượng (8.12); tải lên Cloudinary qua backend |
| Liên kết | Chỉ nhận đường dẫn nội bộ hoặc URL http/https hợp lệ; từ chối các lược đồ khác như javascript: để giảm nguy cơ XSS (Phần 9) |
| Vị trí | Trường position xác định vị trí hiển thị theo tập giá trị hợp lệ quy định ở 8.12 |
| Bật, tắt | Banner tắt không xuất hiện ở API công khai (8.2); bật hoặc tắt có hiệu lực ngay khi lưu thành công |
| Xóa | Xóa bản ghi và ảnh trên Cloudinary nếu ảnh không còn được dùng; banner không ràng buộc với dữ liệu khác nên xóa trực tiếp |

Ngoại lệ: ảnh hoặc liên kết không hợp lệ (422); Cloudinary không phản hồi (báo lỗi, giữ dữ liệu biểu mẫu, cho thử lại); sửa đồng thời (409); phiên hết hạn (401).

### 2.2.5. Quản lý tồn kho

Tham chiếu: UC-19 · API: 8.8 · Dữ liệu: 7.1, 7.7 · Quy tắc: 2.4

```
Mở "Quản lý tồn kho" -> Xem danh sách tồn, lọc hết hàng, tìm kiếm
 -> Chọn sản phẩm -> Chọn kiểu điều chỉnh, nhập số lượng và lý do
 -> Xác nhận -> Backend: chuỗi kiểm soát chuẩn + kiểm tra số lượng
 -> Cập nhật tồn bằng thao tác nguyên tử có điều kiện + ghi nhận biến động
 -> Trả tồn mới -> Cập nhật danh sách
```

| Hạng mục | Mô tả |
| --- | --- |
| Hiển thị | Danh sách tồn khả dụng của từng sản phẩm, lọc theo hết hàng, tìm theo tên. Vì tồn khả dụng đã trừ các đơn đang giữ hàng (QĐ-03), giao diện hiển thị thêm số lượng đang giữ cho đơn chưa bàn giao vận chuyển (xác định ở 2.3) để Admin đối chiếu khi kiểm kê [Đề xuất] |
| Kiểu điều chỉnh | Nhập thêm (cộng), giảm (trừ: hư hỏng, thất thoát…), đặt lại theo kiểm kê. Lý do là bắt buộc [Đề xuất] |
| Kiểm tra số lượng | Số nguyên; không âm sau điều chỉnh; không vượt giới hạn mỗi lần điều chỉnh (8.12) |
| Cập nhật đồng thời | Cộng hoặc trừ được thực hiện bằng cập nhật có điều kiện trên tồn hiện tại, không ghi đè giá trị đã đọc trước đó. “Đặt lại theo kiểm kê” nhập số đếm thực tế, hệ thống tính tồn khả dụng = số đếm − đang giữ (2.4.6). Kèm giá trị tồn Admin đã thấy; nếu tồn đã đổi (ví dụ có đơn mới) thì trả 409 để Admin xem lại giá trị mới rồi xác nhận lại [Đề xuất] |
| Ghi nhận | Mỗi thay đổi tồn kho (do Admin điều chỉnh, tạo đơn, hủy đơn hoặc hoàn trả (CĐ-10)) được ghi nhận: sản phẩm, tồn trước và sau, lượng thay đổi, lý do hoặc đơn liên quan, người thực hiện, thời điểm (7.7) |
| Bảo vệ | Chỉ Admin đã xác thực; không có request công khai nào cập nhật được tồn kho (8.8) |

Ngoại lệ: số lượng không hợp lệ hoặc thiếu lý do (422); điều chỉnh làm tồn âm, hoặc tồn đã đổi so với lúc Admin xem (409); sản phẩm không tồn tại (404); phiên hết hạn (401).

### 2.2.6. Xử lý đơn hàng

Tham chiếu: UC-20, UC-21 · API: 8.9 · Dữ liệu: 7.6

```
Mở "Đơn hàng" -> Xem danh sách (mới nhất trước), lọc theo trạng thái,
 tìm theo mã đơn, phân trang (UC-20)
 -> Chọn đơn -> Xem chi tiết: thông tin nhận hàng, các dòng sản phẩm (snapshot),
 tổng tiền, trạng thái hiện tại, lịch sử trạng thái (UC-21)
 -> Liên hệ khách để xác nhận đơn (ngoài hệ thống) -> Cập nhật trạng thái (2.2.7)
```

| Hạng mục | Mô tả |
| --- | --- |
| Phạm vi dữ liệu | Admin xem đầy đủ thông tin nhận hàng để xử lý đơn. Dữ liệu này không được ghi vào log và không trả qua API công khai (NFR-12, Phần 9) |
| Danh sách | Mặc định đơn mới nhất trước; lọc theo trạng thái, tìm theo mã đơn hoặc số điện thoại [Đề xuất], phân trang (8.9); có bộ lọc nhanh "Pending quá ngưỡng" và chỉ số tổng số lượng đang giữ. Đơn Pending cần được xem xét sớm vì đang giữ hàng (2.4) |
| Chi tiết | Hiển thị snapshot tại thời điểm đặt (tên, giá, số lượng, thành tiền), thông tin nhận hàng, trạng thái hiện tại và lịch sử trạng thái; không đổi khi sản phẩm bị sửa (BR-PRC-04) |
| Liên hệ khách | V1 không gửi email hay SMS tự động (1.3.2). Admin liên hệ khách qua số điện thoại khách đã khai; kênh cụ thể do cửa hàng quyết định (QĐ-07) |
| Giới hạn thao tác | V1 chỉ cho đổi trạng thái đơn, không sửa dòng sản phẩm, giá hay tổng tiền của đơn đã tạo; muốn đổi nội dung đơn thì hủy (hoàn kho) và khách đặt lại [Đề xuất] |

Ngoại lệ: đơn không tồn tại (404); tham số lọc hoặc phân trang không hợp lệ (422); phiên hết hạn (401).

### 2.2.7. Cập nhật trạng thái đơn hàng

Tham chiếu: UC-22 · API: 8.9 (PATCH /api/admin/orders/:id/status) · Dữ liệu: 7.6, 7.7 · Quy tắc: 2.3, 2.4 Trong sơ đồ, S là trạng thái hiện tại Admin đang thấy và T là trạng thái đích.

```
Admin mở chi tiết đơn (trạng thái hiện tại S)
 |
 vGiao diện chỉ hiển thị các trạng thái T hợp lệ kế tiếp của S (ma trận 2.3)
 |
 vAdmin chọn T (nhập lý do nếu hủy) -> xác nhận
 |
 vGửi PATCH /api/admin/orders/:id/status kèm T và S đang thấy
 |
 vChuỗi kiểm soát chuẩn (2.2.1)
 |
 v<Đơn tồn tại và vẫn đang ở S?> --Không--> 404 hoặc 409: tải lại đơn
 | Có
 v<S -> T hợp lệ theo ma trận 2.3?> --Không--> 409: nêu các chuyển đổi hợp lệ
 | Có
 v+--- Một thao tác nhất quán (2.4, QĐ-10) ---------------------------|
 | 1. Đổi trạng thái S -> T bằng cập nhật có điều kiện (chỉ khi vẫn là S)|
 | 2. Áp dụng ảnh hưởng tồn kho của chuyển đổi (ví dụ hoàn kho khi hủy)|
 | 3. Ghi lịch sử: ai, khi nào, S -> T, lý do |
 +--- Bước nào thất bại: không áp dụng gì, trạng thái giữ nguyên --------+
 |
 vTrả đơn đã cập nhật -> Giao diện hiển thị trạng thái mới và lịch sử
```

| Hạng mục | Mô tả |
| --- | --- |
| Chuyển đổi hợp lệ | Chỉ các chuyển đổi trong ma trận ở 2.3; không chuyển tùy ý (ví dụ không đưa đơn Completed về Pending). Trường hợp hủy đơn, đơn hoàn thành và đơn đã bàn giao vận chuyển theo 2.3 |
| Không áp dụng hai lần | Đổi trạng thái là cập nhật có điều kiện “trạng thái hiện tại vẫn là S”. Khi hai Admin thao tác cùng lúc hoặc bấm lặp, chỉ một thao tác thành công, thao tác còn lại nhận 409; nhờ vậy không trừ hoặc hoàn kho hai lần (BR-INV, 2.4) |
| Tồn kho | Ảnh hưởng tồn kho của từng chuyển đổi theo 2.3 và 2.4. Hoàn kho do hủy áp dụng đúng một lần và nằm trong cùng thao tác với việc đổi trạng thái |
| Thao tác khó hoàn tác | CĐ-03, 05, 06, 07, 08, 09, 10 có hộp thoại xác nhận. Hủy đơn và Returned bắt buộc nhập lý do [Đề xuất] |
| Lịch sử | Mỗi lần đổi trạng thái được ghi nhận (ai, khi nào, từ trạng thái nào sang trạng thái nào, lý do) và hiển thị ở chi tiết đơn (7.7) |
| Thông báo cho khách | V1 không gửi thông báo tự động; khách thấy trạng thái mới khi tra cứu đơn (UC-11) |
| Thanh toán | Không có trạng thái hoặc thao tác xác nhận thanh toán, hoàn tiền (QĐ-06) |

### 2.2.8. Đăng xuất và hết hạn phiên

Tham chiếu: UC-12 · API: 8.5 · Bảo mật: Phần 9

Mỗi request quản trị kiểm tra chữ ký và thời hạn JWT, đồng thời kiểm tra Admin trong token vẫn còn tồn tại. Nếu lời gọi đăng xuất thất bại (ví dụ mất mạng), giao diện báo lỗi và cho thử lại thay vì hiển thị như đã đăng xuất, vì cookie vẫn còn hiệu lực. Khi mở nhiều tab, tab khác nhận 401 ở lần gọi API kế tiếp và tự chuyển về trang đăng nhập. JWT không lưu trạng thái nên token bị lộ vẫn dùng được đến khi hết hạn nếu không có thu hồi phía server. Thời hạn phiên, việc gia hạn và việc thu hồi phiên khi đăng xuất hoặc đổi mật khẩu (ví dụ bằng số phiên bản token gắn với Admin) là quyết định cần chốt ở Phần 9 (QĐ-13).

## 2.3. Quy trình đơn hàng

Mục này định nghĩa vòng đời của đơn hàng sau khi tạo: trạng thái, chuyển đổi hợp lệ, người thực hiện và ảnh hưởng đến tồn kho. Đơn chỉ phát sinh ở trạng thái Pending khi khách xác nhận đặt hàng (bước 9–10 ở 2.1.2). Từ đó chỉ Admin được đổi trạng thái (UC-22, thao tác ở 2.2.7). Trạng thái đơn mô tả tiến trình xử lý và bàn giao hàng, không mô tả thanh toán. V1 không có trạng thái, trường dữ liệu hay luồng xác nhận thanh toán và hoàn tiền (BR-ORD-07, QĐ-06). Tham chiếu: UC-10, UC-11, UC-20 → UC-22 · API: 8.9 · Dữ liệu: 7.6, 7.7 · Quy tắc: BR-ORD-08 → BR-ORD-17, 2.4

### 2.3.1. Nguyên tắc của quy trình đơn hàng

| STT | Nguyên tắc | Ý nghĩa | Tham chiếu |
| --- | --- | --- | --- |
| 1 | Chuyển trạng thái có kiểm soát | Mỗi đơn có đúng một trạng thái hiện tại. Chỉ các chuyển đổi ở 2.3.3 được chấp nhận. Mọi cặp khác bị từ chối, kể cả giữ nguyên trạng thái, quay về trạng thái trước và chuyển đổi xuất phát từ trạng thái cuối | BR-ORD-08, BR-ORD-10 |
| 2 | Chỉ Admin đổi trạng thái | Khách không đổi hoặc hủy đơn trên website (không có Use Case tương ứng), muốn hủy thì liên hệ cửa hàng. Hệ thống không tự đổi trạng thái trong V1, ngoài việc tạo đơn ở CĐ-01 | BR-ORD-09, QĐ-15 |
| 3 | Trạng thái phản ánh hàng, không phản ánh tiền | Completed nghĩa là hàng đã giao cho khách, không nghĩa là tiền đã thu | BR-ORD-16 |
| 4 | Tồn kho gắn với chuyển đổi | Ảnh hưởng tồn kho do chuyển đổi quyết định, không do trạng thái, và xảy ra tối đa một lần cho mỗi đơn | BR-ORD-13, BR-INV-06 |
| 5 | Đổi trạng thái là một thao tác nhất quán | Đổi trạng thái, ảnh hưởng tồn kho và ghi lịch sử cùng được áp dụng hoặc cùng không | 2.2.7, 2.4.4 |
| 6 | Đơn là đơn vị bàn giao | V1 không giao một phần, không tách đơn. Mọi chuyển đổi áp dụng cho toàn bộ đơn | 2.4.2 |
| 7 | Nội dung đơn bất biến | Chỉ trạng thái thay đổi (kèm lịch sử). Dòng sản phẩm, giá, tổng tiền, thông tin nhận hàng không đổi | BR-ORD-15, BR-PRC-04 |

### 2.3.2. Danh sách trạng thái

Sáu trạng thái tham khảo được giữ nguyên. Trạng thái Returned được bổ sung (QĐ-14) vì đơn đã bàn giao vận chuyển có thể giao không thành, và hệ thống cần một trạng thái cuối riêng để hoàn kho đúng cách, không lẫn với đơn bị hủy trước khi giao. Returned chỉ nói về hàng quay về cửa hàng, không liên quan đến hoàn tiền.

| Trạng thái | Hiển thị cho khách (UC-10, UC-11) | Ý nghĩa | Đang giữ hàng | Loại |
| --- | --- | --- | --- | --- |
| Pending | Chờ cửa hàng xác nhận | Đơn mới tạo, chờ Admin xem xét và liên hệ khách | Có | Khởi tạo |
| Confirmed | Đã xác nhận | Cửa hàng đã xác nhận đơn với khách | Có | Trung gian |
| Processing | Đang chuẩn bị hàng | Cửa hàng đang chuẩn bị hàng, hàng vẫn ở cửa hàng | Có | Trung gian |
| Shipped | Đã bàn giao vận chuyển | Hàng đã giao cho đơn vị vận chuyển. Admin cập nhật thủ công vì V1 không tích hợp vận chuyển (1.3.2) | Không: hàng đã rời cửa hàng | Trung gian |
| Completed | Hoàn thành | Khách đã nhận hàng, qua vận chuyển hoặc bàn giao trực tiếp | Không | Cuối |
| Cancelled | Đã hủy | Đơn bị hủy khi hàng chưa rời cửa hàng, tồn kho đã hoàn | Không: đã hoàn kho | Cuối |
| Returned | Giao không thành, hàng đã về cửa hàng | Đơn đã bàn giao vận chuyển nhưng giao không thành, hàng đã về, được kiểm tra và nhập lại kho | Không: đã hoàn kho | Cuối |

Đơn đang giữ hàng gồm Pending, Confirmed và Processing. Đây là nhóm “đơn chưa bàn giao vận chuyển” nhắc ở 2.2.5 và là căn cứ tính đại lượng “đang giữ” ở 2.4.1. Nếu chủ dự án không chấp nhận Returned, đơn giao không thành sẽ không có trạng thái phù hợp và phải xử lý ngoài hệ thống (QĐ-14).

### 2.3.3. Ma trận chuyển trạng thái

S là trạng thái hiện tại, T là trạng thái đích (như ở 2.2.7). Cột Điều kiện tách điều kiện hệ thống kiểm tra khỏi điều kiện nghiệp vụ do Admin chịu trách nhiệm, vì hệ thống không kiểm chứng được điều kiện sau.

| Mã | Chuyển đổi | Người thực hiện | Điều kiện | Ảnh hưởng tồn kho | Dữ liệu ghi nhận |
| --- | --- | --- | --- | --- | --- |
| CĐ-01 | (tạo mới) → Pending | Hệ thống, khi khách xác nhận đặt hàng | Đạt các bước a–g ở 2.1.4 | Trừ tồn khả dụng từng dòng, đơn bắt đầu giữ hàng | Đơn, snapshot, lịch sử đầu tiên, biến động tồn |
| CĐ-02 | Pending → Confirmed | Admin | Hệ thống: đơn đang Pending. Nghiệp vụ: cửa hàng đã liên hệ và xác nhận với khách | Không đổi | Ghi chú tùy chọn |
| CĐ-03 | Pending → Cancelled | Admin | Hệ thống: đơn đang Pending, có lý do hủy. Nghiệp vụ: ví dụ khách không xác nhận, khách yêu cầu hủy, nghi đơn ảo, không còn hàng thực tế | Hoàn tồn khả dụng đúng số lượng từng dòng | Lý do (bắt buộc) |
| CĐ-04 | Confirmed → Processing | Admin | Hệ thống: đơn đang Confirmed | Không đổi | Ghi chú tùy chọn |
| CĐ-05 | Confirmed → Cancelled | Admin | Như CĐ-03, với S = Confirmed | Hoàn kho như CĐ-03 | Lý do (bắt buộc) |
| CĐ-06 | Processing → Shipped | Admin | Hệ thống: đơn đang Processing. Nghiệp vụ: hàng đã bàn giao cho đơn vị vận chuyển | Không đổi tồn khả dụng (đã trừ ở CĐ-01), đơn hết giữ hàng | Ghi chú tùy chọn (tên đơn vị vận chuyển, mã vận đơn dạng văn bản, không tích hợp) |
| CĐ-07 | Processing → Completed | Admin | Hệ thống: đơn đang Processing. Nghiệp vụ: hàng bàn giao trực tiếp cho khách (nhận tại cửa hàng hoặc cửa hàng tự giao), không qua vận chuyển [Đề xuất] | Không đổi, đơn hết giữ hàng | Ghi chú tùy chọn |
| CĐ-08 | Processing → Cancelled | Admin | Như CĐ-03, với S = Processing. Nghiệp vụ: hàng đã chuẩn bị phải đưa về kệ | Hoàn kho như CĐ-03 | Lý do (bắt buộc) |
| CĐ-09 | Shipped → Completed | Admin | Hệ thống: đơn đang Shipped. Nghiệp vụ: khách đã nhận hàng | Không đổi | Ghi chú tùy chọn |
| CĐ-10 | Shipped → Returned | Admin | Hệ thống: đơn đang Shipped, có lý do giao không thành. Nghiệp vụ: hàng đã về cửa hàng và đã được kiểm tra [Đề xuất] | Hoàn tồn khả dụng toàn bộ số lượng từng dòng. Hàng hư hỏng được giảm tồn thủ công ngay sau đó (UC-19, 2.4.6) | Lý do (bắt buộc) |

Mọi cặp (S, T) không có trong bảng bị từ chối bằng 409, kèm danh sách chuyển đổi hợp lệ từ trạng thái hiện tại. Giao diện chỉ hiển thị các T hợp lệ nên trường hợp này chủ yếu xảy ra khi gọi API trực tiếp. CĐ-03, 05, 06, 07, 08, 09, 10 có hộp thoại xác nhận nêu rõ trạng thái đích và ảnh hưởng tồn kho (NFR-11). CĐ-02 và CĐ-04 là bước thường lệ nên không cần.

### 2.3.4. Sơ đồ trạng thái

```
(Khách xác nhận đặt hàng)
| CĐ-01 · Hệ thống · trừ tồn khả dụng
v
[Pending] ----- CĐ-03 · Admin · lý do · hoàn kho ------------> [Cancelled]
| CĐ-02 · Admin (cuối)
v
[Confirmed] --- CĐ-05 · Admin · lý do · hoàn kho ------------> [Cancelled]
| CĐ-04 · Admin
v
[Processing] -- CĐ-08 · Admin · lý do · hoàn kho ------------> [Cancelled]
| \
| +- CĐ-07 · Admin · bàn giao trực tiếp ----------> [Completed] (cuối)
| CĐ-06 · Admin · hàng rời cửa hàng
v
[Shipped] ----- CĐ-10 · Admin · lý do · hàng về, hoàn kho ----> [Returned] (cuối)
| CĐ-09 · Admin · khách đã nhận hàng
v
[Completed] (cuối)
```

Pending, Confirmed, Processing là các trạng thái đang giữ hàng. Cancelled và Completed vẽ nhiều lần cho dễ đọc, mỗi trạng thái là một.

### 2.3.5. Hủy đơn, đơn đã bàn giao vận chuyển và đơn hoàn thành

| Trường hợp | Quy tắc | Lý do thiết kế | Giới hạn V1 |
| --- | --- | --- | --- |
| Hủy đơn (CĐ-03, 05, 08) | Chỉ hủy khi đơn ở Pending, Confirmed hoặc Processing, tức hàng chưa rời cửa hàng. Chỉ Admin thực hiện, bắt buộc có lý do và hộp thoại xác nhận. Hủy thành công thì tồn khả dụng được hoàn đúng một lần, đúng số lượng từng dòng theo snapshot, trong cùng thao tác nhất quán với việc đổi trạng thái (2.4.4). Cancelled là trạng thái cuối, không mở lại. Khách vẫn muốn mua thì đặt đơn mới và phải qua kiểm tra tồn kho, giá như mọi đơn khác | Hàng còn ở cửa hàng nên hoàn kho là chính xác. Mở lại đơn đã hủy phải trừ kho lần hai mà không qua kiểm tra tồn, có nguy cơ bán vượt | Khách tự hủy trên website: [Mở rộng]. Tự động hủy đơn quá hạn: tùy chọn, xem QĐ-15 |
| Đơn đã bàn giao vận chuyển (Shipped) | Không hủy được bằng thao tác hủy. Chỉ có hai hướng: Completed khi khách đã nhận hàng (CĐ-09), hoặc Returned khi giao không thành và hàng đã về cửa hàng, kèm lý do (CĐ-10). Khi khách muốn hủy lúc hàng đang vận chuyển, đơn giữ Shipped đến khi có kết quả giao hàng, việc thỏa thuận với khách và đơn vị vận chuyển diễn ra ngoài hệ thống. Tồn kho chỉ được hoàn ở CĐ-10 | Hàng đã rời cửa hàng và hệ thống không biết hàng có quay về hay không. Hoàn kho theo thao tác hủy sẽ làm tồn khả dụng cao hơn số hàng thực có | Theo dõi vận đơn, tự cập nhật trạng thái vận chuyển: [Mở rộng] (1.3.2) |
| Đơn hoàn thành (Completed) | Trạng thái cuối, không chuyển tiếp, không còn ảnh hưởng tồn kho. Completed không có nghĩa tiền đã thu (BR-ORD-16). Khách trả hàng sau khi đã nhận (đổi trả, bảo hành) nằm ngoài quy trình đơn V1: đơn giữ Completed, nếu cửa hàng nhận lại hàng và bán lại được thì Admin nhập lại kho bằng điều chỉnh “Nhập thêm” kèm lý do và mã đơn (2.4.6). Chính sách bảo hành ở trang sản phẩm chỉ mang tính thông tin | Mở lại đơn đã hoàn thành làm sai lịch sử và dễ hoàn kho sai | Đổi trả, bảo hành, hoàn tiền: [Mở rộng] |

### 2.3.6. Dữ liệu nhập, ghi nhận và ngoại lệ khi đổi trạng thái

| Hạng mục | Quy tắc |
| --- | --- |
| Dữ liệu gửi lên | Trạng thái đích T, trạng thái hiện tại S mà Admin đang thấy (điều kiện đồng thời, 2.2.7), lý do (bắt buộc với CĐ-03, 05, 08, 10), ghi chú tùy chọn. Giới hạn độ dài ở 8.12 |
| Lịch sử trạng thái | Mỗi chuyển đổi, kể cả CĐ-01, tạo một bản ghi lịch sử: đơn, S, T, người thực hiện (Admin hoặc Hệ thống), thời điểm, lý do hoặc ghi chú, tóm tắt ảnh hưởng tồn kho (không đổi, đã trừ, đã hoàn). Bản ghi không sửa, không xóa (7.7) |
| Hiển thị cho Admin | Trạng thái hiện tại, lịch sử, lý do và ghi chú |
| Hiển thị cho khách | Chỉ nhãn trạng thái (2.3.2). Lý do, ghi chú và lịch sử chi tiết là dữ liệu nội bộ [Đề xuất]. V1 không gửi email hoặc SMS thông báo |

| Ngoại lệ | Phản hồi | Xử lý |
| --- | --- | --- |
| Đơn không tồn tại | 404 | Quay về danh sách |
| Trạng thái hiện tại khác S Admin đang thấy (người khác đã đổi, bấm lặp) | 409 kèm trạng thái hiện tại | Giao diện tải lại đơn và hiển thị trạng thái hiện tại, không báo lỗi chung. Thao tác không áp dụng lần hai |
| (S, T) không hợp lệ | 409 kèm danh sách T hợp lệ | Chỉ xảy ra khi gọi API trực tiếp |
| Thiếu lý do bắt buộc, lý do quá dài | 422 theo trường | Giữ dữ liệu trong hộp thoại |
| Lỗi khi áp dụng ảnh hưởng tồn kho | 5xx. Phương án A: trạng thái và tồn kho giữ nguyên. Phương án B: xem 2.4.4 | Thông báo chung, kiểm tra lại trạng thái đơn trước khi thử lại |
| Phiên hết hạn, thiếu CSRF hoặc Origin | 401, 403 | Theo 2.2.8 |

### 2.3.7. Quy tắc nghiệp vụ của quy trình đơn hàng

| Mã | Quy tắc | Tham chiếu |
| --- | --- | --- |
| BR-ORD-08 | Mỗi đơn có đúng một trạng thái hiện tại. Chỉ các chuyển đổi ở 2.3.3 được chấp nhận. Cặp (S, T) khác, kể cả S = T, bị từ chối (409) | 2.3.3 |
| BR-ORD-09 | Chỉ Admin đã xác thực đổi trạng thái đơn. Khách không đổi hoặc hủy đơn trên website. Hệ thống không tự đổi trạng thái trong V1, ngoài CĐ-01 | QĐ-15, 3.2 |
| BR-ORD-10 | Completed, Cancelled, Returned là trạng thái cuối: không chuyển tiếp, không mở lại, không hoàn tác. Sửa thao tác nhầm là yêu cầu thay đổi riêng [Mở rộng], hộp thoại xác nhận nhằm giảm nhầm lẫn | 2.3.3 |
| BR-ORD-11 | Chỉ hủy đơn khi hàng chưa rời cửa hàng (Pending, Confirmed, Processing). Đơn Shipped chỉ kết thúc bằng Completed hoặc Returned | 2.3.5 |
| BR-ORD-12 | Hủy đơn (CĐ-03, 05, 08) và Returned (CĐ-10) bắt buộc có lý do | 2.3.6 |
| BR-ORD-13 | Ảnh hưởng tồn kho của chuyển đổi được áp dụng đúng một lần, trong cùng thao tác nhất quán với việc đổi trạng thái | 2.4.4, BR-INV-06 |
| BR-ORD-14 | Mỗi chuyển đổi, kể cả CĐ-01, tạo một bản ghi lịch sử không sửa, không xóa | 7.7 |
| BR-ORD-15 | Sau khi tạo, dòng sản phẩm, giá, tổng tiền và thông tin nhận hàng không đổi. Muốn đổi nội dung thì hủy (hoàn kho) và khách đặt lại. Thông tin khách bổ sung qua điện thoại ghi vào ghi chú khi đổi trạng thái | 2.2.6, BR-PRC-04 |
| BR-ORD-16 | Completed biểu thị hàng đã giao cho khách, không biểu thị tiền đã thu. Hệ thống không có trạng thái hay thao tác thanh toán, hoàn tiền | BR-ORD-07, QĐ-06 |
| BR-ORD-17 | Lý do hủy, ghi chú và lịch sử chi tiết không trả qua API công khai. Khách chỉ thấy nhãn trạng thái | NFR-12, 8.4 |

## 2.4. Quy tắc tồn kho

Quy tắc tồn kho bảo đảm ba điều: Không bán vượt tồn kho, kể cả khi nhiều yêu cầu đến cùng lúc (NFR-10). Mỗi đơn chỉ trừ và hoàn kho đúng số lần quy định, dù đơn đổi trạng thái hay yêu cầu bị gửi lặp (NFR-09). Đơn, tồn kho và giỏ hàng luôn nhất quán, kể cả khi có lỗi giữa chừng.

Cách tiếp cận có ba ý: Tồn khả dụng bị trừ ngay khi đơn tạo thành công (QĐ-03). Quyết định cuối cùng về tồn kho luôn là một cập nhật nguyên tử có điều kiện trên database, không dựa vào kết quả kiểm tra đọc trước đó. Tính trọn vẹn nhiều bản ghi được bảo đảm bằng transaction (phương án A) hoặc bù trừ (phương án B), tùy khả năng của database (QĐ-10).

Tham chiếu: UC-09, UC-19, UC-22 · API: 8.4, 8.8, 8.9 · Dữ liệu: 7.1, 7.5, 7.6, 7.7 · Quy tắc: 2.3, BR-INV-01 → BR-INV-16

### 2.4.1. Mô hình tồn kho và thuật ngữ

| Thuật ngữ | Định nghĩa | Nguồn và cách dùng |
| --- | --- | --- |
| Tồn khả dụng | Số lượng còn có thể đặt mua. Số nguyên không âm tại mọi thời điểm | Trường stock của sản phẩm (7.1). Là căn cứ duy nhất cho phép hoặc từ chối đặt mua |
| Đang giữ | Tổng số lượng các dòng thuộc đơn Pending, Confirmed, Processing (2.3.2) | Không lưu thành trường riêng, tính từ đơn bằng truy vấn tổng hợp khi hiển thị (2.2.5) và kiểm kê (2.4.6). Không dùng để quyết định đặt mua |
| Tồn thực tế tại kho | Số hàng thực sự ở cửa hàng = Tồn khả dụng + Đang giữ | Để đối chiếu kiểm kê, không lưu |
| Hết hàng | Tồn khả dụng bằng 0 | Suy ra từ stock, không do Admin chọn (2.2.2) |
| Được phép đặt mua | Sản phẩm đang kinh doanh và danh mục đang bật (2.2.2, 2.2.3, QĐ-12) | Độc lập với số tồn: sản phẩm tạm ngưng hay ngừng kinh doanh vẫn có thể còn tồn |

Giỏ hàng, biểu mẫu đặt hàng và danh sách so sánh không giữ hàng (BR-CART-01). API công khai chỉ trả tình trạng còn hàng và số lượng tối đa đặt được (không vượt tồn khả dụng và giới hạn mỗi dòng ở BR-CART-03). Số tồn chính xác và số đang giữ chỉ dành cho Admin [Đề xuất].

### 2.4.2. Thời điểm giữ hàng, trừ hàng và hoàn hàng

Trong tài liệu này, “giữ hàng” và “trừ tồn khả dụng” là cùng một thao tác, xảy ra đúng một lần khi đơn tạo thành công (CĐ-01, QĐ-03). Việc hàng thực sự rời cửa hàng (CĐ-06, CĐ-07) không trừ tồn khả dụng lần hai, chỉ chuyển đơn khỏi nhóm “đang giữ hàng”.

| Thời điểm giữ hàng | Đánh giá | Kết luận |
| --- | --- | --- |
| Khi thêm vào giỏ | Giỏ không cần tài khoản nên ai cũng giữ hàng được mà không cam kết mua; trái BR-CART-01 | Loại |
| Khi tạo đơn (Pending) | Chặn bán vượt ngay khi khách xác nhận, mọi đơn tồn tại đều đã có hàng. Nhược điểm: đơn chưa xử lý, kể cả đơn ảo, chiếm hàng (giảm thiểu ở 2.4.7) | Chọn |
| Khi Admin xác nhận | Giữa Pending và Confirmed hàng có thể bị đơn khác lấy, đơn đã cấp mã có thể phải hủy vì hết hàng | Loại cho V1 |
| Khi bàn giao | Hàng bị bán vượt giữa lúc đặt và lúc giao | Loại |

Tác động của từng sự kiện (q: số lượng một dòng, áp dụng cho từng dòng; n: số lượng Admin điều chỉnh; C: số đếm kiểm kê; H: đang giữ):

| Sự kiện | Tồn khả dụng | Đang giữ | Tồn thực tế tại kho |
| --- | --- | --- | --- |
| CĐ-01 Tạo đơn | −q | +q | Không đổi |
| CĐ-02, CĐ-04, CĐ-09 | Không đổi | Không đổi | Không đổi |
| CĐ-03, 05, 08 Hủy | +q | −q | Không đổi (hàng vẫn ở cửa hàng) |
| CĐ-06 Bàn giao vận chuyển | Không đổi | −q | −q |
| CĐ-07 Bàn giao trực tiếp | Không đổi | −q | −q |
| CĐ-10 Giao không thành, hàng về | +q | Không đổi | +q |
| Admin nhập thêm n | +n | Không đổi | +n |
| Admin giảm n | −n | Không đổi | −n |
| Admin đặt lại theo kiểm kê | C − H | Không đổi | C |

Mọi dòng đều giữ đẳng thức Tồn thực tế = Tồn khả dụng + Đang giữ. Đẳng thức này là tiêu chí kiểm thử và đối soát (2.4.8).

### 2.4.3. Kiểm tra tồn kho khi tạo đơn

| Lớp | Thời điểm | Mục đích | Là bảo đảm? |
| --- | --- | --- | --- |
| 1. Giỏ hàng | Thêm vào giỏ, xem giỏ (UC-07, UC-08) | Cảnh báo sớm, đánh dấu dòng không hợp lệ | Không (BR-CART-04) |
| 2. Kiểm tra đọc | Bước 2.1.4-e | Phát hiện mọi dòng không hợp lệ để trả thông báo đầy đủ | Không: dữ liệu có thể đổi ngay sau khi đọc |
| 3. Cập nhật nguyên tử có điều kiện | Bước 2.1.4-h, từng dòng | Chỉ trừ khi các điều kiện còn đúng tại chính thời điểm ghi | Có: cơ chế chống bán vượt |

MongoDB áp dụng bộ lọc và thay đổi trên cùng một tài liệu như một thao tác không bị xen ngang. Hai yêu cầu cùng nhắm vào một sản phẩm được tuần tự hóa, yêu cầu sau luôn thấy tồn sau khi yêu cầu trước đã trừ. Mã giả minh họa (tên trường chính thức ở 7.1):

```js
// line.* là số liệu backend đã tính ở bước f (2.1.4); các dòng đã sắp xếp theo productId
const updated = await Product.findOneAndUpdate(
 {
 _id: line.productId,
 stock: { $gte: line.quantity }, // còn đủ tồn khả dụng
 /* điều kiện được phép đặt mua: xem 2.2.2 và 7.1 */
 price: line.listPrice, // giá niêm yết chưa đổi kể từ lúc tính đơn
 discountPrice: line.salePrice // giá khuyến mãi chưa đổi (null nếu không có)
 },
 { $inc: { stock: -line.quantity } },
 { new: true, session } // session chỉ có ở phương án A
);

if (!updated) { /* đọc lại để phân loại: NL-02, NL-03 hoặc NL-04 */ }
// Biến động tồn: stockAfter = updated.stock; stockBefore = updated.stock + line.quantity
```

| Điều kiện trong bộ lọc | Mục đích | Khi không khớp |
| --- | --- | --- |
| `_id` | Đúng sản phẩm | NL-02 |
| stock >= quantity | Không bán vượt | NL-03 |
| Được phép đặt mua | Chặn sản phẩm vừa ngừng bán hoặc tạm ngưng | NL-02 |
| price, discountPrice bằng giá đã tính | Giá không đổi giữa lúc tính và lúc trừ kho | NL-04 |

Phân loại lỗi: khi không khớp, service đọc lại sản phẩm và phân loại theo thứ tự ưu tiên NL-02, NL-03, NL-04. Thông báo đầy đủ cho mọi dòng đến từ lớp 2. Lỗi phát hiện ở lớp 3 (hiếm, do đồng thời) có thể chỉ nêu dòng đầu tiên thất bại. Trạng thái danh mục: nằm ở collection khác nên không đưa vào được bộ lọc nguyên tử, chỉ kiểm tra ở lớp 2 (TH-06). Giá và tổng tiền: số lượng lấy từ giỏ phía server, không lấy từ request tạo đơn. Đơn giá, thành tiền, tạm tính và tổng tiền do backend tính từ database (BR-PRC-01, BR-PRC-02). Tổng khách đã thấy chỉ để đối chiếu (BR-PRC-03). Điều kiện giá ở trên khóa giá đúng thời điểm trừ kho, nên snapshot giá (BR-PRC-04) luôn là giá hiện hành lúc hàng được giữ.

### 2.4.4. Chiến lược nhất quán dữ liệu

Điều kiện nguyên tử ở 2.4.3 ngăn bán vượt trên từng sản phẩm mà không cần transaction. Phần còn lại cần chiến lược nhất quán: Đơn nhiều dòng phải trọn vẹn hoặc không (BR-ORD-02). Đổi trạng thái, hoàn kho và ghi lịch sử phải đi cùng nhau. Việc chọn phương án thuộc QĐ-10.

| Tiêu chí | A. Transaction đa tài liệu [Đề xuất ưu tiên] | B. Cập nhật có điều kiện kết hợp bù trừ [Dự phòng] |
| --- | --- | --- |
| Điều kiện | Replica set hoặc sharded cluster, phiên bản MongoDB và driver hỗ trợ transaction, xác minh trên gói Atlas thực tế | Không cần transaction |
| Cách hoạt động | Mọi thay đổi của một đơn vị xử lý chạy trong một transaction, lỗi ở bước nào thì hủy toàn bộ | Mỗi thay đổi là một cập nhật nguyên tử độc lập, lỗi thì bù trừ bằng thao tác ngược |
| Bảo đảm | Trọn vẹn hoặc không, kể cả khi tiến trình dừng giữa chừng | Không bán vượt. Trọn vẹn khi lỗi được phát hiện, không bảo đảm khi tiến trình dừng đột ngột |
| Rủi ro còn lại | Xung đột ghi gây thử lại, độ trễ tăng khi nhiều yêu cầu cùng sản phẩm | Dừng đột ngột có thể để tồn khả dụng thấp hơn thực tế (không bao giờ cao hơn) hoặc thiếu biến động, cần đối soát (2.4.8) |
| Khi chọn | Kiểm thử TH-01 → TH-05 trên cluster thật đạt | Transaction không khả dụng hoặc không đạt, chủ dự án chấp nhận rủi ro còn lại |

Điều kiện triển khai phương án A [Cần xác minh]: Database là replica set (MongoDB 4.0 trở lên) hoặc sharded cluster. Cluster Atlas thường chạy replica set, nhưng khả năng và giới hạn transaction theo gói phải kiểm tra bằng script chạy TH-01 và TH-02 trên cluster dự kiến triển khai. Thực hiện khi khởi tạo kết nối database (Tuần 2), chốt trước M3. Dùng withTransaction (tự thử lại lỗi tạm thời và kết quả commit chưa rõ). Mọi đọc, ghi trong đơn vị xử lý phải truyền cùng session. Thao tác thiếu session nằm ngoài transaction mà không báo lỗi. Transaction chỉ chứa thao tác database, không gọi Cloudinary hay dịch vụ ngoài. Chịu giới hạn thời gian của transaction (mặc định 60 giây, kiểm tra theo gói). Write concern majority, read concern snapshot [Đề xuất]. Tạo sẵn collection và unique index khi triển khai. Xung đột ghi (WriteConflict) được thử lại tối đa vài lần (đề xuất 3–5). Hết lần thử thì trả NL-06, an toàn thử lại nhờ khóa chống gửi lặp. Lỗi trùng khóa (E11000) trên khóa chống gửi lặp thì đọc và trả đơn đã tạo (NL-07). Vẫn giữ điều kiện stock >= quantity trong transaction (phòng thủ nhiều lớp, giảm xung đột).

Quy tắc chung cho cả hai phương án: Toàn bộ logic nằm trong một service (tạo đơn, đổi trạng thái, điều chỉnh tồn). Controller và frontend không đổi tồn kho trực tiếp (NFR-08), nên đổi phương án không đổi API. Trừ kho theo thứ tự productId tăng dần, để hai đơn đặt chéo (TH-03) không loại nhau. Mỗi lần đổi tồn ghi biến động (2.4.8). Bật retryWrites (có sẵn trong chuỗi kết nối Atlas) để ghi bị mất kết nối không áp dụng hai lần [Cần xác minh].

Đơn vị xử lý tạo đơn: PHƯƠNG ÁN A (một transaction)

1. Chèn đơn Pending + khóa chống gửi lặp (duy nhất) trùng khóa -> hủy transaction, trả đơn đã có (NL-07)
2. Với từng dòng, theo thứ tự productId: cập nhật nguyên tử có điều kiện (2.4.3); ghi biến động `order_create` không khớp -> hủy transaction (NL-02 / NL-03 / NL-04)
3. Giỏ hàng: active -> converted (cập nhật có điều kiện) không khớp -> hủy transaction
4. Ghi lịch sử CĐ-01 commit -> trả mã đơn, mã tra cứu hủy -> không có thay đổi nào được áp dụng

PHƯƠNG ÁN B (cập nhật độc lập + bù trừ)

1. Giành quyền xử lý giỏ: active -> processing (có điều kiện, kèm khóa chống gửi lặp) giỏ đã thành đơn cùng khóa -> trả đơn (NL-07) giỏ đang được yêu cầu khác xử lý -> 409 "đang xử lý", frontend chờ rồi gửi lại cùng khóa
2. Với từng dòng, theo thứ tự productId: cập nhật nguyên tử có điều kiện (2.4.3) một dòng không khớp -> BÙ TRỪ các dòng đã trừ (`$inc` ngược), giỏ về active
3. Chèn đơn Pending (khóa duy nhất) lỗi -> BÙ TRỪ toàn bộ, giỏ về active (NL-06)
4. Giỏ: processing -> converted; ghi biến động tồn và lịch sử CĐ-01 lỗi ở bước này không hủy đơn đã tạo: thử lại, ghi log kèm mã đơn để đối soát

Đơn vị xử lý đổi trạng thái có ảnh hưởng tồn kho (CĐ-03, 05, 08, 10): PHƯƠNG ÁN A (một transaction)

1. Đơn: cập nhật có điều kiện `{ _id, status: S }` -> status = T không khớp -> hủy transaction (409)
2. Với từng dòng của đơn (snapshot): tăng tồn khả dụng +q, ghi biến động
3. Ghi lịch sử S -> T (lý do, người thực hiện, tóm tắt ảnh hưởng tồn kho) commit -> trả đơn đã cập nhật | lỗi -> trạng thái và tồn kho giữ nguyên

PHƯƠNG ÁN B

1. Đơn: cập nhật có điều kiện `{ _id, status: S }` -> T (đồng thời chặn thao tác thứ hai trên cùng đơn)
2. Với từng dòng: tăng tồn khả dụng +q; ghi biến động; ghi lịch sử lỗi -> thử lại; vẫn lỗi -> log nghiêm trọng kèm mã đơn, đối soát bổ sung phần hoàn kho còn thiếu (một lần)

Phương án B không đạt mức bảo đảm của A khi tiến trình dừng đột ngột. Vì vậy các câu “không để lại trạng thái dở dang” ở NL-06 và 2.1.4-h chỉ đúng tuyệt đối với A. Với B, chúng đúng khi lỗi được phát hiện, và rủi ro còn lại được xử lý bằng đối soát. Chủ dự án phải xác nhận chấp nhận rủi ro này nếu chọn B (QĐ-10).

### 2.4.5. Xử lý yêu cầu đồng thời

Hai khách đặt đơn vị cuối cùng (TH-01), tồn khả dụng ban đầu bằng 1:

| Thời điểm | Khách A | Khách B | Tồn khả dụng |
| --- | --- | --- | --- |
| t1 | Kiểm tra đọc: đủ hàng | Kiểm tra đọc: đủ hàng | 1 |
| t2 | Cập nhật nguyên tử stock >= 1: khớp, tồn về 0 | Đang xử lý | 0 |
| t3 | Lưu đơn, trả mã đơn | Cập nhật nguyên tử stock >= 1: không khớp | 0 |
| t4 | Nhận mã đơn | NL-03 “vừa hết hàng”, giỏ giữ nguyên, không thay đổi dữ liệu | 0 |

Kết quả không phụ thuộc thứ tự đến thực tế. Gửi đồng thời N yêu cầu cho một đơn vị cuối thì đúng một yêu cầu thành công và tồn không âm (tiêu chí NFR-10).

| Mã | Tình huống | Cơ chế bảo vệ | Kết quả mong đợi |
| --- | --- | --- | --- |
| TH-01 | Hai khách đặt đơn vị cuối cùng | Cập nhật nguyên tử có điều kiện stock >= q | Một đơn thành công, yêu cầu còn lại nhận NL-03, tồn không âm |
| TH-02 | Cùng khách gửi lặp (bấm nhiều lần, thử lại) | Khóa chống gửi lặp duy nhất. A: trùng khóa thì trả đơn đã có. B: giành quyền xử lý giỏ | Một đơn, một lần trừ kho, các yêu cầu còn lại nhận lại đơn (NL-07) |
| TH-03 | Hai đơn nhiều dòng đặt chéo (A: P1, P2; B: P2, P1), mỗi sản phẩm còn 1 | Trừ theo thứ tự productId cố định | Một đơn thành công, một đơn thất bại trọn vẹn, không dòng nào bị trừ dở |
| TH-04 | Admin điều chỉnh tồn trong lúc có đơn mới | `$inc` nguyên tử có điều kiện, không ghi đè. “Đặt lại” kèm tồn đã thấy | Không mất cập nhật nào, “đặt lại” lỗi thời nhận 409 |
| TH-05 | Hai thao tác đổi trạng thái cùng một đơn (hai Admin, bấm lặp, hủy trùng lúc bàn giao) | Cập nhật có điều kiện status = S | Một thao tác thành công, thao tác kia 409, tồn kho đổi tối đa một lần |
| TH-06 | Admin ngừng bán sản phẩm hoặc tắt danh mục khi khách đang tạo đơn | Điều kiện “được phép đặt mua” nằm trong bộ lọc trừ kho. Danh mục chỉ kiểm tra ở lớp 2 | Ngừng bán trước lúc trừ kho: NL-02. Sau lúc trừ kho: đơn hợp lệ, Admin xử lý như đơn thường |
| TH-07 | Admin đổi giá khi khách đang tạo đơn | Giá dùng để tính nằm trong bộ lọc trừ kho | Giá đổi trước lúc trừ kho: NL-04. Không tạo đơn với giá khác giá đã tính |
| TH-08 | Lỗi giữa chừng khi tạo đơn hoặc đổi trạng thái | A: hủy transaction. B: bù trừ và đối soát | A: không để lại thay đổi. B: không bán vượt, có thể tồn thấp tạm thời đến khi đối soát |
| TH-09 | Admin lưu form sửa sản phẩm với dữ liệu cũ sau khi có đơn mới | API cập nhật sản phẩm không nhận trường tồn kho. Kiểm tra số phiên bản bản ghi (2.2.2) | Tồn kho không bị ghi đè bằng dữ liệu cũ |
| TH-10 | Admin xóa vĩnh viễn sản phẩm đúng lúc phát sinh đơn đầu tiên chứa sản phẩm | Chỉ xóa vĩnh viễn sản phẩm đã Ngừng kinh doanh (bộ lọc trừ kho từ chối đơn mới). Kiểm tra “chưa có đơn tham chiếu” và xóa trong cùng transaction (A). Với B kiểm tra thêm không có giỏ ở trạng thái processing chứa sản phẩm | Không đơn nào tham chiếu sản phẩm đã xóa, xung đột trả 409 (QĐ-12) |

Mỗi tình huống TH-01 → TH-10 phải có kịch bản kiểm thử tự động (NFR-10, 12.6 mục 13, 14, 16, 32).

### 2.4.6. Điều chỉnh tồn kho của Admin và kiểm kê

| Kiểu | Admin nhập | Cách áp dụng | Điều kiện | Lỗi |
| --- | --- | --- | --- | --- |
| Nhập thêm | n ≥ 1, lý do (bắt buộc), mã đơn liên quan (tùy chọn) | `$inc`: +n nguyên tử | n và tồn sau không vượt giới hạn ở 8.12 | 422 |
| Giảm | n ≥ 1, lý do (bắt buộc) | `$inc`: −n kèm điều kiện stock >= n | Không để tồn âm | 409 kèm tồn hiện tại |
| Đặt lại theo kiểm kê | Số đếm thực tế C ≥ 0 (gồm cả hàng đang giữ cho đơn chưa bàn giao), tồn khả dụng đã thấy, lý do | Tính H (đang giữ), tồn mới = C − H, cập nhật có điều kiện stock bằng tồn đã thấy. Phương án A: tính H và cập nhật trong cùng transaction | C − H ≥ 0 | 409 nếu tồn đã đổi. 409 nếu C < H, kèm H và danh sách đơn đang giữ |

Tồn kho đầu kỳ chỉ nhập khi tạo sản phẩm và tạo biến động initial (2.2.2). Tồn kho không bao giờ đi qua API cập nhật sản phẩm (BR-INV-13). Điều kiện vận hành khi kiểm kê [Đề xuất]: không bàn giao hàng trong lúc kiểm kê. CĐ-06 và CĐ-07 làm đổi “đang giữ” mà không đổi tồn khả dụng, nên hệ thống không phát hiện được chênh lệch này bằng tồn đã thấy. Hàng hoàn sau bán (đổi trả, bảo hành): dùng “Nhập thêm” kèm lý do và mã đơn, không đổi trạng thái đơn (2.3.5).

Thiếu hàng sau khi đã giữ chỗ, quy trình gồm 4 bước:

1. Đặt sản phẩm “Tạm ngưng đặt mua” (2.2.2) để không phát sinh đơn mới.
2. Hủy các đơn không đáp ứng được (lý do “thiếu hàng”), tồn được hoàn theo 2.4.2.
3. Đặt lại theo kiểm kê. Nếu C < H, hệ thống từ chối và nêu các đơn đang giữ để quay lại bước 2.
4. Bật lại “Đang kinh doanh”.

### 2.4.7. Hạn chế chiếm giữ tồn kho bởi đơn chưa xử lý

V1 không xác minh người mua (1.3.3) và tồn khả dụng bị trừ ngay khi tạo đơn, nên đơn ảo hoặc đơn bị bỏ quên có thể chiếm hàng. V1 giảm thiểu rủi ro này, không loại bỏ hoàn toàn.

| STT | Biện pháp | Mô tả | Tham chiếu |
| --- | --- | --- | --- |
| 1 | Giới hạn tần suất | API tạo đơn, giỏ hàng, tra cứu giới hạn theo nguồn truy cập | NL-08, Phần 9 |
| 2 | Giới hạn quy mô mỗi đơn | Số lượng tối đa mỗi dòng và số dòng tối đa mỗi đơn, để một đơn không chiếm lượng tồn tùy ý | BR-CART-03, 8.12 |
| 3 | Xác nhận trước khi chuẩn bị hàng | Pending → Confirmed qua liên hệ khách. Không xác nhận được thì hủy (CĐ-03), hoàn kho ngay | 1.3.3 |
| 4 | Cảnh báo đơn Pending quá ngưỡng | Danh sách đơn có bộ lọc nhanh “Pending quá ngưỡng”. Dashboard hiển thị số đơn quá ngưỡng và tổng số lượng đang giữ. Ngưỡng đề xuất 24 giờ, đặt trong cấu hình | QĐ-15, UC-13, UC-20 |
| 5 | Không tự hủy trong V1 | Tự động hủy là tùy chọn, nếu chọn thì dùng CĐ-03 với người thực hiện “Hệ thống”, lý do “Quá hạn xác nhận”, cùng cơ chế hoàn kho. Cần job nền, và job trên hạ tầng có thể tạm ngưng khi không có truy cập không bảo đảm chạy đúng giờ | QĐ-15, QĐ-11 |
| 6 | Tạm ngưng đặt mua | Admin đặt sản phẩm “Tạm ngưng đặt mua” khi nghi bị lạm dụng | 2.2.2 |

Xác minh người mua (OTP) hoặc đặt cọc nằm ngoài V1 (1.3.3).

### 2.4.8. Ghi nhận biến động và đối soát tồn kho

Mỗi thay đổi tồn kho tạo một bản ghi biến động bất biến (7.7):

| Trường | Mô tả |
| --- | --- |
| Sản phẩm | Tham chiếu sản phẩm |
| Loại | initial, `order_create`, `order_cancel`, `order_return`, `admin_add`, `admin_subtract`, `admin_count` |
| Lượng thay đổi | Số nguyên khác 0, có dấu |
| Tồn trước, tồn sau | Lấy từ kết quả của chính cập nhật nguyên tử, không đọc riêng |
| Đơn liên quan | Bắt buộc với `order_*`, tùy chọn với điều chỉnh của Admin |
| Lý do | Bắt buộc với loại do Admin điều chỉnh |
| Người thực hiện, thời điểm | Admin hoặc Hệ thống, thời điểm ghi |

| STT | Kiểm tra đối soát | Biểu thức |
| --- | --- | --- |
| 1 | Không có tồn âm | Mọi sản phẩm: stock >= 0 |
| 2 | Tồn khớp sổ biến động | stock bằng tổng lượng thay đổi của sản phẩm kể từ initial |
| 3 | Mỗi đơn trừ kho đúng một lần | Mỗi đơn có đúng một `order_create` cho mỗi dòng, lượng bằng số lượng dòng |
| 4 | Hoàn kho tối đa một lần | Đơn Cancelled hoặc Returned có đúng một bản ghi hoàn cho mỗi dòng, đơn ở trạng thái khác không có |
| 5 | Bảo toàn tồn thực tế | Sau mỗi sự kiện, ba đại lượng thay đổi đúng theo bảng 2.4.2 |

Đối soát chạy bằng truy vấn hoặc script do bộ phận kỹ thuật thực hiện (sau kiểm thử đồng thời và định kỳ), không phải chức năng Admin Panel trong V1 [Đề xuất].

### 2.4.9. Quy tắc nghiệp vụ tồn kho

| Mã | Quy tắc | Tham chiếu |
| --- | --- | --- |
| BR-INV-01 | Tồn khả dụng luôn là số nguyên không âm. Mọi thay đổi dùng cập nhật nguyên tử có điều kiện phía database, cấm đọc rồi ghi đè lại giá trị đã đọc | 2.4.3 |
| BR-INV-02 | Chỉ điều kiện của cập nhật nguyên tử (lớp 3) bảo đảm không bán vượt. Kiểm tra ở giỏ hàng và kiểm tra đọc chỉ để cảnh báo | 2.4.3, BR-CART-04 |
| BR-INV-03 | Số lượng đặt không vượt tồn khả dụng. Hệ thống không tự giảm số lượng xuống bằng tồn hiện có, khách tự quyết định | BR-ORD-02, NL-03 |
| BR-INV-04 | Số lượng lấy từ giỏ phía server, giá lấy từ database và khóa vào điều kiện trừ kho. Không dùng giá, tổng tiền hay tồn kho do client gửi | BR-PRC-01, 2.4.3 |
| BR-INV-05 | Giữ hàng và trừ tồn khả dụng là một thao tác, xảy ra đúng một lần khi tạo đơn (CĐ-01). Giỏ, biểu mẫu, so sánh không giữ hàng | QĐ-03, BR-CART-01 |
| BR-INV-06 | Ảnh hưởng tồn kho gắn với chuyển đổi, không gắn với trạng thái. Mỗi chuyển đổi xảy ra tối đa một lần trên một đơn nhờ cập nhật có điều kiện theo trạng thái, nên không trừ hoặc hoàn lần hai. Chỉ CĐ-01, 03, 05, 08, 10 làm đổi tồn khả dụng | 2.2.7, 2.4.2 |
| BR-INV-07 | Hủy đơn chưa bàn giao hoàn đúng số lượng từng dòng theo snapshot, kể cả khi sản phẩm đã ngừng kinh doanh hoặc danh mục đã tắt | QĐ-12, 2.3.5 |
| BR-INV-08 | Đơn đã bàn giao vận chuyển không hoàn kho tự động. Chỉ CĐ-10, sau khi hàng đã về cửa hàng, hoàn kho | 2.3.5 |
| BR-INV-09 | Đơn Completed, Cancelled, Returned không còn ảnh hưởng tồn kho. Hàng khách trả sau khi Completed được nhập lại bằng điều chỉnh của Admin, không đổi trạng thái đơn | 2.3.5, 2.4.6 |
| BR-INV-10 | Đơn trọn vẹn hoặc không: đơn, các dòng trừ kho, giỏ hàng và lịch sử cùng được áp dụng hoặc cùng không (A), hoặc được bù trừ (B). Trừ kho theo thứ tự productId tăng dần | 2.4.4, BR-ORD-02 |
| BR-INV-11 | Mỗi thay đổi tồn ghi một biến động bất biến, tồn trước và sau lấy từ kết quả của chính thao tác nguyên tử | 2.4.8 |
| BR-INV-12 | Yêu cầu tạo đơn lặp không trừ kho lần hai: khóa chống gửi lặp duy nhất (và giành quyền xử lý giỏ ở phương án B) | BR-ORD-04, NL-07 |
| BR-INV-13 | Chỉ Admin đã xác thực đổi tồn kho trực tiếp. Không API công khai nào đổi tồn kho. API cập nhật sản phẩm không nhận trường tồn kho (từ chối 422). Tồn kho đầu kỳ chỉ nhập khi tạo sản phẩm | 2.2.2, 8.6, 8.8 |
| BR-INV-14 | Điều chỉnh của Admin: số nguyên, lý do bắt buộc, không để tồn âm. “Đặt lại theo kiểm kê” tính tồn = số đếm − đang giữ, kèm tồn đã thấy [Đề xuất] | 2.4.6 |
| BR-INV-15 | Đơn đang giữ hàng không tự hết hạn trong V1. Đơn Pending quá ngưỡng được cảnh báo | 2.4.7, QĐ-15 |
| BR-INV-16 | API công khai chỉ trả tình trạng còn hàng và số lượng tối đa đặt được. Số tồn chính xác và số đang giữ chỉ dành cho Admin [Đề xuất] | 2.4.1 |

# PHẦN 3. YÊU CẦU CHỨC NĂNG

Yêu cầu chức năng của V1 được đặc tả thành 24 Use Case: UC-01 → UC-11 và UC-24 cho khách hàng, UC-12 → UC-23 cho Admin. Mã UC khớp với các tham chiếu ở Phần 1 và Phần 2. Luồng nghiệp vụ, vòng đời đơn hàng và quy tắc tồn kho đã mô tả ở 2.1 → 2.4 nên Use Case chỉ tham chiếu, không nhắc lại. Responsive, SEO và bảo mật là yêu cầu nền tảng, được đặc tả ở NFR-06, Phần 10 và Phần 9, không tạo thành Use Case riêng. Đặc tả chi tiết các Use Case quan trọng nằm ở 3.1, ma trận phân quyền ở 3.2.

| STT | Mã UC | Tên chức năng | Tác nhân | Mô tả | Kết quả mong đợi |
| --- | --- | --- | --- | --- | --- |
| 1 | UC-01 | Trang chủ | Khách hàng | Xem trang chủ gồm banner đang hoạt động, danh mục, sản phẩm nổi bật và sản phẩm mới (2.1.2 bước 1) | Hiển thị đúng dữ liệu đang hoạt động; từ đây vào được danh mục và chi tiết sản phẩm |
| 2 | UC-02 | Danh sách sản phẩm | Khách hàng | Xem sản phẩm dạng lưới, phân trang, theo danh mục hoặc toàn bộ; mỗi sản phẩm hiển thị ảnh, tên, giá, giá khuyến mãi (nếu có), tình trạng còn hàng | Danh sách chỉ gồm sản phẩm hiển thị công khai (không gồm sản phẩm ngừng kinh doanh hoặc thuộc danh mục bị tắt), đúng trang |
| 3 | UC-03 | Tìm kiếm sản phẩm | Khách hàng | Tìm theo từ khóa trong các sản phẩm hiển thị công khai | Kết quả khớp từ khóa, có phân trang; không có kết quả thì thông báo rõ |
| 4 | UC-04 | Lọc sản phẩm | Khách hàng | Kết hợp điều kiện: danh mục, thương hiệu, khoảng giá, thông số kỹ thuật theo giá trị cụ thể hoặc ngưỡng (cú pháp: 8.1) | Kết quả thỏa mọi điều kiện đang chọn; bỏ điều kiện thì danh sách mở rộng lại |
| 5 | UC-05 | Sắp xếp sản phẩm | Khách hàng | Sắp xếp theo giá, độ mới, lượt xem; kết hợp được với tìm kiếm và lọc | Danh sách đúng thứ tự, giữ nguyên các điều kiện đang áp dụng |
| 6 | UC-06 | Chi tiết sản phẩm | Khách hàng | Xem ảnh, mô tả, giá niêm yết và giá khuyến mãi, bảng thông số có đơn vị, bảo hành, tình trạng còn hàng; thêm vào giỏ hoặc so sánh | Thông tin đúng dữ liệu hiện hành; sản phẩm không đặt mua được thì không có thao tác thêm vào giỏ |
| 7 | UC-07 | Giỏ hàng | Khách hàng | Thêm sản phẩm vào giỏ và xem giỏ: đơn giá hiện hành, thành tiền, tạm tính, dòng không hợp lệ (2.1.2 bước 6–7) | Giỏ được tạo hoặc cập nhật; không giữ hàng, không tạo đơn (BR-CART-01) |
| 8 | UC-08 | Cập nhật số lượng và xóa sản phẩm khỏi giỏ | Khách hàng | Đổi số lượng, xóa từng dòng hoặc xóa toàn bộ giỏ | Giỏ và tạm tính được tính lại từ dữ liệu hiện hành, trong giới hạn BR-CART-03 |
| 9 | UC-09 | Tạo đơn hàng | Khách hàng | Nhập thông tin nhận hàng và xác nhận; backend kiểm tra, tính lại giá, trừ tồn kho, lưu đơn Pending (2.1.4) | Đúng một đơn Pending, một lần trừ kho, giỏ đóng; nếu thất bại thì không thay đổi dữ liệu nào |
| 10 | UC-10 | Hiển thị kết quả đặt hàng và mã đơn hàng | Khách hàng | Hiển thị mã đơn, mã tra cứu (một lần), tóm tắt đơn theo snapshot, trạng thái “Chờ cửa hàng xác nhận” | Khách nhận được mã đơn và mã tra cứu để lưu lại |
| 11 | UC-11 | Tra cứu đơn hàng theo cơ chế an toàn | Khách hàng | Nhập mã đơn và mã tra cứu để xem trạng thái và tóm tắt đơn (2.1.6, QĐ-02) | Đúng mã thì xem được đơn của mình (số điện thoại che bớt); sai thì nhận thông báo chung, không lộ đơn khác |
| 12 | UC-12 | Đăng nhập và đăng xuất Admin | Admin | Xác thực bằng email và mật khẩu, cấp phiên JWT trong cookie HTTP-only; đăng xuất; xử lý phiên hết hạn (2.2.1, 2.2.8) | Chỉ Admin hợp lệ vào được khu vực quản trị; phiên kết thúc đúng khi đăng xuất hoặc hết hạn |
| 13 | UC-13 | Dashboard và thống kê | Admin | Hiển thị số sản phẩm, danh mục, đơn theo trạng thái, sản phẩm hết hàng, đơn Pending quá ngưỡng và tổng số lượng đang giữ (8.10, 2.4.7) | Chỉ số tính từ dữ liệu thực; không có chỉ số doanh thu (1.3.2) |
| 14 | UC-14 | Thêm, sửa, xóa sản phẩm | Admin | Quản lý thông tin, giá, bảo hành, thông số, SEO và trạng thái bán; ngừng kinh doanh hoặc xóa vĩnh viễn (2.2.2, QĐ-12) | Sản phẩm lưu đúng validation; xóa theo QĐ-12; tồn kho không bị ghi đè |
| 15 | UC-15 | Tìm kiếm sản phẩm trong trang quản trị | Admin | Tìm theo tên hoặc slug, lọc theo danh mục và trạng thái bán, phân trang; gồm cả sản phẩm ngừng kinh doanh | Admin tìm nhanh được sản phẩm cần quản lý |
| 16 | UC-16 | Upload nhiều hình ảnh lên Cloudinary | Admin | Chọn nhiều ảnh, kiểm tra định dạng và dung lượng, tải lên Cloudinary qua backend, chọn ảnh đại diện và thứ tự | Ảnh hợp lệ có URL gắn với sản phẩm; ảnh lỗi được báo theo từng ảnh |
| 17 | UC-17 | Quản lý danh mục | Admin | Thêm, sửa, bật hoặc tắt, xóa danh mục; slug duy nhất; chính sách khi còn sản phẩm (2.2.3, QĐ-12) | Danh mục đúng dữ liệu; không xóa được danh mục còn sản phẩm |
| 18 | UC-18 | Quản lý banner | Admin | Thêm, sửa, bật hoặc tắt, xóa banner gồm ảnh, liên kết, vị trí (2.2.4) | Banner đang bật hiển thị ở trang chủ; liên kết hợp lệ |
| 19 | UC-19 | Quản lý tồn kho | Admin | Xem tồn khả dụng và số đang giữ; điều chỉnh nhập thêm, giảm, đặt lại theo kiểm kê; ghi nhận biến động (2.2.5, 2.4.6) | Tồn không âm, đúng số liệu tính, mỗi thay đổi có một bản ghi biến động |
| 20 | UC-20 | Xem danh sách đơn hàng | Admin | Danh sách mới nhất trước, lọc theo trạng thái, tìm theo mã đơn hoặc số điện thoại [Đề xuất], phân trang, lọc nhanh đơn Pending quá ngưỡng (2.2.6, 2.4.7) | Admin thấy đúng các đơn cần xử lý |
| 21 | UC-21 | Xem chi tiết đơn hàng | Admin | Xem thông tin nhận hàng, các dòng theo snapshot, tổng tiền, trạng thái hiện tại và lịch sử trạng thái (2.2.6) | Đủ thông tin để xử lý đơn; không đổi khi sản phẩm bị sửa |
| 22 | UC-22 | Cập nhật trạng thái đơn hàng | Admin | Đổi trạng thái theo ma trận CĐ-02 → CĐ-10, kèm ảnh hưởng tồn kho và lịch sử (2.2.7, 2.3.3) | Trạng thái đổi hợp lệ đúng một lần, tồn kho đổi đúng, có lịch sử |
| 23 | UC-23 | Giao diện quản trị dễ sử dụng | Admin | Hành vi giao diện chung của Admin Panel: điều hướng nhất quán, tìm, lọc, phân trang, thông báo kết quả, lỗi theo trường và giữ dữ liệu đang nhập, xác nhận trước thao tác khó hoàn tác, vô hiệu nút khi đang gửi | Admin quản lý nội dung mà không cần sửa mã nguồn (NFR-11) |
| 24 | UC-24 | So sánh sản phẩm | Khách hàng | Thêm 2–3 sản phẩm vào danh sách so sánh, xem bảng thông số cạnh nhau; nên giới hạn trong cùng danh mục (2.1.2 bước 5) | Bảng so sánh đúng thông số hiện hành; không tạo dữ liệu nghiệp vụ |

Tác nhân “Khách hàng” là người truy cập công khai không đăng nhập; “Admin” là quản trị viên đã xác thực (mục 1.4). Backend là hệ thống được đặc tả, không phải tác nhân. UC-02 → UC-05 dùng chung API danh sách (8.1). UC-23 mô tả các hành vi giao diện chung của Admin Panel và áp dụng cho UC-12 → UC-22, nên các Use Case đó không lặp lại.

## 3.1. Đặc tả chi tiết Use Case

Mục này đặc tả chi tiết năm Use Case có rủi ro nghiệp vụ hoặc bảo mật cao nhất: UC-09 (tạo đơn hàng), UC-11 (tra cứu đơn hàng), UC-12 (đăng nhập, đăng xuất Admin), UC-19 (quản lý tồn kho) và UC-22 (cập nhật trạng thái đơn hàng). Các Use Case còn lại đã được mô tả ở bảng trên và các mục 2.1, 2.2.

### 3.1.1. Quy ước đọc đặc tả

| Ký hiệu | Ý nghĩa |
| --- | --- |
| A1, A2… | Luồng thay thế: sau khi xử lý, Use Case quay lại hoặc tiếp tục luồng chính. Chỉ có nghĩa trong từng Use Case, viết đầy đủ là UC-09/A1 |
| E1, E2… | Ngoại lệ: Use Case dừng ở kết quả không thành công và dữ liệu không đổi. Viết đầy đủ là UC-09/E1 |
| NL-xx, CĐ-xx, TH-xx | Nhánh ngoại lệ của khách hàng (2.1.5), chuyển đổi trạng thái đơn (2.3.3), tình huống đồng thời hoặc lỗi giữa chừng (2.4.5) |
| BR-xx | Quy tắc nghiệp vụ ở 2.1.7, 2.3.7 và 2.4.9 |
| SEC-xx | Yêu cầu bảo mật ở Phần 9, đánh số theo thứ tự các yêu cầu tối thiểu của phần đó. Mỗi mã kèm nhãn ngắn để đọc được khi chưa mở Phần 9 |
| Mã HTTP | Đề xuất, thống nhất ở 8.11 |

Mỗi dòng A và E là một kịch bản kiểm thử tối thiểu (mục 1.1.1). Cột “Tại bước” chỉ bước của luồng chính nơi rẽ nhánh phát sinh.

### 3.1.2. UC-09 – Tạo đơn hàng

Thông tin chung

| Hạng mục | Nội dung |
| --- | --- |
| Mã Use Case | UC-09 |
| Tên Use Case | Tạo đơn hàng |
| Tác nhân | Khách hàng (không cần đăng nhập) |
| Tiền điều kiện | (1) Khách có giỏ hàng còn hiệu lực với ít nhất một dòng (UC-07, UC-08). (2) Giỏ chưa được chuyển thành đơn (BR-ORD-04). (3) Khách đang ở biểu mẫu đặt hàng (2.1.2 bước 8) |

Luồng chính

| Bước | Bên thực hiện | Mô tả | Tham chiếu |
| --- | --- | --- | --- |
| 1 | Khách hàng | Từ giỏ hàng chọn “Đặt hàng”. Hệ thống kiểm tra giỏ còn dòng hợp lệ rồi mở biểu mẫu | 2.1.2 bước 7–8 |
| 2 | Frontend | Hiển thị biểu mẫu (họ tên, số điện thoại, địa chỉ nhận hàng, ghi chú không bắt buộc), tóm tắt các dòng và tạm tính; nêu rõ V1 không thanh toán trực tuyến, phí vận chuyển và cách thu tiền do cửa hàng thông báo khi xác nhận đơn | QĐ-04, QĐ-05, QĐ-06 |
| 3 | Khách hàng | Nhập thông tin nhận hàng; frontend kiểm tra sơ bộ | 8.12 |
| 4 | Khách hàng | Bấm “Xác nhận đặt hàng” | — |
| 5 | Frontend | Vô hiệu hóa nút; gửi yêu cầu kèm khóa chống gửi lặp và tổng tiền đã hiển thị (chỉ để đối chiếu) | BR-PRC-03 |
| 6 | Backend | Giới hạn tần suất; kiểm tra Origin và CSRF; validate và làm sạch dữ liệu khách hàng | 2.1.4-a, b |
| 7 | Backend | Tra khóa chống gửi lặp; nạp giỏ theo token trong cookie; nạp từng sản phẩm hiện hành và kiểm tra mọi dòng còn được phép đặt mua, đủ tồn khả dụng. Số lượng lấy từ giỏ phía server | 2.1.4-c → e |
| 8 | Backend | Tính lại đơn giá, thành tiền, tạm tính và tổng tiền từ database; đối chiếu với tổng khách đã thấy | 2.1.4-f, g |
| 9 | Backend | Trong một đơn vị xử lý nhất quán: trừ tồn từng dòng bằng cập nhật nguyên tử có điều kiện (theo thứ tự productId), lưu đơn Pending cùng snapshot, sinh mã đơn và mã tra cứu (lưu băm), đóng giỏ, ghi biến động tồn và lịch sử CĐ-01 | 2.1.4-h, 2.4.3, 2.4.4 |
| 10 | Backend | Trả kết quả: mã đơn, mã tra cứu (chỉ xuất hiện trong phản hồi này), tóm tắt đơn | 2.1.4-i |
| 11 | Frontend | Chuyển sang màn hình kết quả (UC-10), xóa dữ liệu giỏ và biểu mẫu trên giao diện | 2.1.2 bước 10 |

Luồng thay thế và ngoại lệ

| Mã | Tại bước | Điều kiện | Xử lý và kết quả |
| --- | --- | --- | --- |
| A1 | 1, 7, 9 | Dòng trong giỏ đã ngừng kinh doanh hoặc không còn được phép đặt mua (NL-02; TH-06 nếu xảy ra đúng lúc trừ kho) | Đánh dấu dòng, loại khỏi tạm tính, chặn tạo đơn; khách xóa dòng rồi quay lại bước 1. Không tạo đơn một phần (BR-ORD-02) |
| A2 | 7, 9 | Không đủ tồn kho, gồm hai khách đặt đơn vị cuối cùng (NL-03; TH-01, TH-03) | Không tạo đơn, không trừ kho dòng nào; trả dòng bị ảnh hưởng và số lượng tối đa hiện có; khách giảm số lượng hoặc xóa dòng rồi quay lại bước 1 |
| A3 | 8, 9 | Giá thay đổi sau khi khách xem (NL-04; TH-07) | Không tạo đơn; trả số liệu hiện hành (đơn giá, tổng tiền, tình trạng); khách xác nhận lại ở bước 4 với tổng mới hoặc quay về giỏ. Tồn kho đổi nhưng vẫn đủ thì không ảnh hưởng |
| A4 | 7 | Khóa chống gửi lặp đã gắn với một đơn đã tạo: bấm nhiều lần, tải lại trang, thử lại sau lỗi mạng (NL-07; TH-02) | Không tạo đơn mới, không trừ kho lần hai; trả lại kết quả của đơn đã tạo và tiếp tục bước 11. Cách cấp lại mã tra cứu khi phản hồi gốc thất lạc: 8.4 [Đề xuất] |
| E1 | 1, 7 | Giỏ rỗng, hết hạn hoặc cookie giỏ bị xóa (NL-01) | Không mở biểu mẫu; backend từ chối kể cả khi API bị gọi trực tiếp; thông báo “Giỏ hàng trống”; không phát sinh đơn |
| E2 | 3, 6 | Dữ liệu khách hàng không hợp lệ (NL-05) | Lỗi theo trường, giữ nguyên dữ liệu đã nhập; không tạo đơn, không đổi tồn kho |
| E3 | 6 | Vượt giới hạn tần suất (NL-08) | Từ chối trước khi xử lý nghiệp vụ (HTTP 429); thông báo chờ và thử lại sau |
| E4 | 6 | Origin hoặc CSRF không hợp lệ | Từ chối (HTTP 403); không xử lý; thông báo chung |
| E5 | 6 | Số dòng hoặc số lượng vượt giới hạn mỗi giỏ, mỗi đơn (BR-CART-03) | Từ chối (HTTP 422) kèm giới hạn cho phép; giỏ giữ nguyên |
| E6 | 5–10 | Lỗi kết nối hoặc lỗi máy chủ, gồm hết số lần thử lại khi xung đột ghi ở bước 9 (NL-06; TH-08) | Giữ nguyên giỏ và dữ liệu đã nhập; thông báo “Chưa xác nhận được đơn hàng, vui lòng thử lại; hệ thống không tạo đơn trùng”; thử lại dùng cùng khóa chống gửi lặp. Phương án A: không thay đổi dữ liệu. Phương án B: bù trừ, rủi ro còn lại ở 2.4.4 |

Hậu điều kiện, quy tắc nghiệp vụ và bảo mật

| Hạng mục | Nội dung |
| --- | --- |
| Hậu điều kiện (thành công) | Có đúng một đơn Pending (CĐ-01) với snapshot dòng sản phẩm và tổng tiền do backend tính, phí vận chuyển 0 (BR-PRC-05). Tồn khả dụng từng dòng giảm đúng số lượng đặt, đúng một lần; mỗi dòng có một biến động `order_create`. Giỏ đã đóng. Có bản ghi lịch sử CĐ-01. Mã đơn và mã tra cứu đã cấp, mã tra cứu chỉ lưu giá trị băm |
| Hậu điều kiện (thất bại) | Không có đơn mới; tồn kho và biến động không đổi; giỏ vẫn mở với nội dung cũ (phương án A hủy transaction, phương án B bù trừ). Dữ liệu khách đã nhập vẫn còn trên giao diện |
| Quy tắc nghiệp vụ | BR-CART-01 (giỏ không giữ hàng), BR-CART-03 (giới hạn số lượng), BR-CART-04 (kiểm tra sớm chỉ để cảnh báo), BR-PRC-01 (backend quyết định giá), BR-PRC-02 (giá khuyến mãi hợp lệ), BR-PRC-03 (tạm tính chỉ để đối chiếu), BR-PRC-04 (snapshot), BR-PRC-05 (phí vận chuyển 0), BR-ORD-01 → BR-ORD-07, BR-INV-01 → BR-INV-05, BR-INV-10, BR-INV-12 |
| Yêu cầu bảo mật liên quan | SEC-07, SEC-08, SEC-09 (CSRF, Origin); SEC-11 (rate limiting); SEC-13 (validation); SEC-14 (NoSQL injection: chỉ nhận chuỗi và số đúng kiểu); SEC-15 (XSS: dữ liệu khách được làm sạch, Admin Panel hiển thị dưới dạng văn bản thuần); SEC-20 (không ghi số điện thoại, địa chỉ vào log); SEC-22 (giả mạo giá, số lượng: số lượng lấy từ giỏ phía server, giá từ database); SEC-23 (gửi lặp); SEC-24 (tồn kho đồng thời) |
| Tham chiếu | 2.1.2, 2.1.4, 2.1.5, 2.4.3 → 2.4.5 · Dữ liệu: 7.5, 7.6, 7.7 · API: 8.4 · NFR-09, NFR-10, NFR-12 · Kịch bản đồng thời: TH-01, TH-02, TH-03, TH-06, TH-07, TH-08 · Nghiệm thu: 12.6 mục 10 → 14, 26, 27, 31, 32 |

### 3.1.3. UC-11 – Tra cứu đơn hàng theo cơ chế an toàn

Thông tin chung

| Hạng mục | Nội dung |
| --- | --- |
| Mã Use Case | UC-11 |
| Tên Use Case | Tra cứu đơn hàng theo cơ chế an toàn |
| Tác nhân | Khách hàng (không cần đăng nhập) |
| Tiền điều kiện | (1) Khách có mã đơn và mã tra cứu đã nhận ở UC-10. (2) Không cần cookie giỏ hàng hay phiên: tra cứu thực hiện được trên thiết bị khác |

Luồng chính

| Bước | Bên thực hiện | Mô tả | Tham chiếu |
| --- | --- | --- | --- |
| 1 | Khách hàng | Mở trang Tra cứu đơn hàng, nhập mã đơn và mã tra cứu | 6.2 |
| 2 | Frontend | Kiểm tra sơ bộ định dạng (độ dài, ký tự cho phép); gửi hai mã trong thân request, không đặt vào URL hay query string | SEC-21 |
| 3 | Backend | Giới hạn tần suất; validate cả hai mã phải là chuỗi đúng định dạng | SEC-11, SEC-13, SEC-14 |
| 4 | Backend | Tìm đơn theo mã đơn; so sánh mã tra cứu với giá trị băm đã lưu bằng phép so sánh an toàn về thời gian | QĐ-02 |
| 5 | Backend | Khớp thì trả thông tin tối thiểu: nhãn trạng thái, các dòng sản phẩm theo snapshot, tổng tiền, thông tin nhận hàng với số điện thoại che bớt | 2.1.6, 2.3.2 |
| 6 | Frontend | Hiển thị đơn ở chế độ chỉ đọc, không có thao tác sửa hoặc hủy | BR-ORD-09 |

Luồng thay thế và ngoại lệ

| Mã | Tại bước | Điều kiện | Xử lý và kết quả |
| --- | --- | --- | --- |
| A1 | 5 | Đơn đã ở trạng thái cuối (Completed, Cancelled, Returned) | Vẫn tra cứu được và hiển thị nhãn trạng thái tương ứng |
| E1 | 2, 3 | Mã thiếu, sai định dạng hoặc không phải chuỗi | HTTP 422 “Mã không hợp lệ”, không truy vấn database; vẫn tính vào giới hạn tần suất |
| E2 | 4 | Không tìm thấy mã đơn, hoặc mã tra cứu không khớp (NL-09) | Cùng một thông báo chung và cùng mã trạng thái cho cả hai trường hợp; thời gian phản hồi không phân biệt được hai trường hợp (so sánh với giá trị băm giả khi không tìm thấy đơn) [Đề xuất]; tính vào giới hạn tần suất |
| E3 | 3 | Vượt giới hạn tần suất theo nguồn truy cập hoặc theo mã đơn (NL-08) | HTTP 429, thông báo chờ; trong thời gian bị chặn, mã đúng cũng không được xử lý |
| E4 | 3–5 | Lỗi máy chủ | Thông báo chung, không lộ thông tin nội bộ; không trả dữ liệu đơn |
| E5 | 1 | Khách mất mã tra cứu | Không có chức năng cấp lại tự động vì backend chỉ lưu giá trị băm (1.3.3). Khách liên hệ cửa hàng (QĐ-07); Admin tìm đơn theo mã đơn hoặc số điện thoại khách đã khai (UC-20) [Đề xuất] và thông báo trạng thái qua kênh liên hệ |

Hậu điều kiện, quy tắc nghiệp vụ và bảo mật

| Hạng mục | Nội dung |
| --- | --- |
| Hậu điều kiện (thành công) | Khách thấy thông tin tối thiểu của đúng đơn mình; dữ liệu không thay đổi |
| Hậu điều kiện (thất bại) | Khách nhận thông báo chung, không biết mã đơn có tồn tại hay không; dữ liệu đơn không đổi (chỉ tăng bộ đếm giới hạn tần suất) |
| Quy tắc nghiệp vụ | QĐ-02 (mã đơn kết hợp mã tra cứu); BR-ORD-06 (mã đơn không phải bí mật, mã tra cứu cấp một lần và chỉ lưu băm); BR-ORD-09 (khách không đổi hoặc hủy đơn); BR-ORD-17 (lý do, ghi chú, lịch sử chi tiết không trả cho khách); BR-ORD-05 (không thu thập email nên không có kênh gửi lại mã) |
| Yêu cầu bảo mật liên quan | SEC-21 (kiểm soát tra cứu): mã tra cứu ngẫu nhiên đủ dài, so sánh băm an toàn về thời gian, lỗi chung, mã không nằm trong URL, query string hay log; SEC-11 (rate limiting theo nguồn truy cập và theo mã đơn); SEC-13, SEC-14 (chỉ nhận chuỗi đúng định dạng, từ chối đối tượng hoặc mảng); SEC-20 (che bớt số điện thoại, chỉ trả dữ liệu tối thiểu); SEC-18 (không trả trường nội bộ như id hay giá trị băm) |
| Tham chiếu | 2.1.5 (NL-08, NL-09), 2.1.6, 2.3.2 · Dữ liệu: 7.6 · API: 8.4 · Nghiệm thu: 12.6 mục 17, 27 |

### 3.1.4. UC-12 – Đăng nhập và đăng xuất Admin

Thông tin chung

| Hạng mục | Nội dung |
| --- | --- |
| Mã Use Case | UC-12 |
| Tên Use Case | Đăng nhập và đăng xuất Admin |
| Tác nhân | Admin |
| Tiền điều kiện | (1) Tài khoản Admin đã được khởi tạo theo quy trình ở 12.2 (V1 không có đăng ký công khai). (2) Đăng nhập: Admin chưa có phiên hợp lệ. Đăng xuất: Admin đang có phiên hợp lệ. (3) Frontend và backend cùng site hoặc qua cùng origin để cookie hoạt động (QĐ-08) |

Luồng chính 1 – Đăng nhập

| Bước | Bên thực hiện | Mô tả | Tham chiếu |
| --- | --- | --- | --- |
| 1 | Admin | Truy cập khu vực quản trị | 2.2.1 bước 1 |
| 2 | Frontend | Gọi GET /api/admin/me để kiểm tra phiên; nhận 401 thì hiển thị biểu mẫu đăng nhập | 8.5 |
| 3 | Admin | Nhập email, mật khẩu và gửi | — |
| 4 | Frontend | Kiểm tra sơ bộ định dạng; gửi POST /api/admin/login với credentials được bật | SEC-05 (credentials) |
| 5 | Backend | Giới hạn tần suất; kiểm tra Origin; validate (chỉ nhận chuỗi, giới hạn độ dài); chuẩn hóa email (cắt khoảng trắng, chữ thường) | SEC-08, SEC-11, SEC-13, SEC-14 |
| 6 | Backend | Tìm Admin theo email; so sánh mật khẩu với giá trị băm bcryptjs | SEC-10 (bcryptjs) |
| 7 | Backend | Đúng thì ký JWT (id Admin, thời hạn theo QĐ-13), đặt cookie HTTP-only (Secure, SameSite theo QĐ-08), cập nhật lastLogin; trả thông tin Admin tối thiểu (tên, email, avatar), không trả token hay mật khẩu | SEC-01 → SEC-03, SEC-18 |
| 8 | Frontend | Lưu thông tin Admin trong state, chuyển tới Dashboard (UC-13) hoặc trang quản trị Admin đã cố truy cập | 2.2.8 |

Luồng chính 2 – Đăng xuất

| Bước | Bên thực hiện | Mô tả | Tham chiếu |
| --- | --- | --- | --- |
| 1 | Admin | Bấm “Đăng xuất” | — |
| 2 | Frontend | Gửi POST /api/admin/logout kèm cơ chế chống CSRF | SEC-07 → SEC-09 |
| 3 | Backend | Xác thực phiên; xóa cookie xác thực (đặt hết hạn với cùng thuộc tính); thu hồi phiên phía server nếu có cơ chế thu hồi; trả thành công | 2.2.8, QĐ-13 |
| 4 | Frontend | Xóa trạng thái Admin trên giao diện, chuyển về trang đăng nhập | — |

Luồng thay thế và ngoại lệ

| Mã | Tại bước | Điều kiện | Xử lý và kết quả |
| --- | --- | --- | --- |
| A1 | Đăng nhập: 2 | Đã có phiên hợp lệ (GET /api/admin/me trả thành công) | Bỏ qua đăng nhập, vào Dashboard (UC-13) |
| A2 | Mọi UC quản trị | Phiên hết hạn hoặc không hợp lệ khi Admin thao tác; Admin trong token đã bị xóa | Backend trả 401 cho mọi request quản trị. Frontend chuyển về trang đăng nhập, báo “Phiên đã hết hạn”, ghi nhớ trang đang xem; sau khi đăng nhập lại thì quay về trang cũ. Thao tác ghi bị gián đoạn không tự động gửi lại (2.2.8) |
| E1 | Đăng nhập: 6 | Email không tồn tại hoặc mật khẩu sai | Thông báo chung “Email hoặc mật khẩu không đúng”, cùng mã trạng thái (HTTP 401); thời gian phản hồi không phân biệt hai trường hợp (so sánh với giá trị băm giả khi không tìm thấy email) [Đề xuất]; tính vào giới hạn tần suất; không cấp cookie |
| E2 | Đăng nhập: 5 | Vượt giới hạn tần suất | HTTP 429, thông báo chung kèm thời gian chờ nếu có; không kiểm tra thông tin đăng nhập |
| E3 | Đăng nhập: 4–5 | Dữ liệu không hợp lệ: thiếu, không phải chuỗi, quá dài, email sai định dạng | HTTP 422 theo trường; không nêu thông tin về sự tồn tại của tài khoản |
| E4 | Đăng nhập: 5; Đăng xuất: 3 | Origin hoặc CSRF không hợp lệ | HTTP 403; không xử lý |
| E5 | Đăng nhập: 7–8 | Cookie không được trình duyệt lưu (frontend và backend khác site, QĐ-08): đăng nhập thành công nhưng GET /api/admin/me trả 401 ngay sau đó | Giao diện báo “Không giữ được phiên đăng nhập” kèm hướng dẫn cho người vận hành kiểm tra cấu hình. Đây là lỗi cấu hình triển khai, cần xác minh trên môi trường thật [Cần xác minh] |
| E6 | Đăng nhập: 5–7 | Lỗi máy chủ | Thông báo chung, không lộ thông tin nội bộ; không cấp phiên |
| E7 | Đăng xuất: 2–3 | Lời gọi đăng xuất thất bại (mất mạng, lỗi máy chủ) | Giao diện báo lỗi và cho thử lại, không hiển thị như đã đăng xuất vì cookie vẫn còn hiệu lực (2.2.8) |

Hậu điều kiện, quy tắc nghiệp vụ và bảo mật

| Hạng mục | Nội dung |
| --- | --- |
| Hậu điều kiện (thành công) | Đăng nhập: Admin có cookie phiên hợp lệ, lastLogin được cập nhật, truy cập được UC-13 → UC-23. Đăng xuất: cookie bị xóa, mọi request quản trị tiếp theo nhận 401 (nếu có thu hồi phía server thì token cũ cũng không dùng được nữa, QĐ-13) |
| Hậu điều kiện (thất bại) | Không có cookie mới; dữ liệu Admin không đổi (ngoài bộ đếm giới hạn tần suất); Admin ở lại trang đăng nhập |
| Quy tắc nghiệp vụ | V1 chỉ có một vai trò quản trị, không đăng ký công khai (1.4, 12.2); thông báo đăng nhập thất bại luôn chung chung; lastLogin chỉ cập nhật khi đăng nhập thành công; mỗi request quản trị kiểm tra Admin trong token còn tồn tại (2.2.8); thời hạn phiên, gia hạn và thu hồi khi đăng xuất hoặc đổi mật khẩu: QĐ-13 [Cần xác nhận] |
| Yêu cầu bảo mật liên quan | SEC-01 (JWT); SEC-02 (cookie HTTP-only); SEC-03 (Secure, SameSite); SEC-04, SEC-05 (CORS, credentials thống nhất); SEC-07 → SEC-09 (CSRF, Origin, áp dụng cho cả đăng nhập và đăng xuất); SEC-10 (bcryptjs; mật khẩu không bị ghi log hay trả về); SEC-11 (rate limiting đăng nhập theo IP và theo email); SEC-13, SEC-14 (email và mật khẩu chỉ nhận chuỗi, từ chối đối tượng chứa toán tử MongoDB); SEC-16 (bảo vệ API Admin); SEC-17 (khóa ký JWT và tài khoản Admin ban đầu qua biến môi trường); SEC-18 (không đưa dữ liệu nhạy cảm vào frontend) |
| Tham chiếu | 2.2.1, 2.2.8 · Dữ liệu: 7.4 · API: 8.5 · NFR-02 · Nghiệm thu: 12.6 mục 18, 24, 25, 27 |

### 3.1.5. UC-19 – Quản lý tồn kho

Thông tin chung

| Hạng mục | Nội dung |
| --- | --- |
| Mã Use Case | UC-19 |
| Tên Use Case | Quản lý tồn kho |
| Tác nhân | Admin |
| Tiền điều kiện | (1) Admin có phiên hợp lệ (UC-12). (2) Sản phẩm cần điều chỉnh tồn tại. (3) Với “Đặt lại theo kiểm kê”: Admin đã đếm hàng thực tế, gồm cả hàng đang giữ cho đơn chưa bàn giao, và không bàn giao hàng trong lúc kiểm kê (2.4.6) |

Luồng chính

| Bước | Bên thực hiện | Mô tả | Tham chiếu |
| --- | --- | --- | --- |
| 1 | Admin | Mở “Quản lý tồn kho” | 2.2.5 |
| 2 | Backend | Trả danh sách có phân trang: sản phẩm, tồn khả dụng, số đang giữ (tính từ đơn Pending, Confirmed, Processing), tồn thực tế (bằng khả dụng cộng đang giữ); hỗ trợ tìm theo tên và lọc hết hàng | 2.4.1 |
| 3 | Admin | Chọn sản phẩm và kiểu điều chỉnh: Nhập thêm, Giảm hoặc Đặt lại theo kiểm kê | 2.4.6 |
| 4 | Admin | Nhập số liệu: n (Nhập thêm, Giảm) hoặc số đếm thực tế C (Đặt lại); lý do (bắt buộc); mã đơn liên quan (tùy chọn). Frontend gửi kèm tồn khả dụng Admin đang thấy | BR-INV-14 |
| 5 | Frontend | Hiển thị tồn mới dự kiến và yêu cầu xác nhận; với “Đặt lại”, tồn mới bằng C trừ số đang giữ | 2.4.6 |
| 6 | Backend | Chạy chuỗi kiểm soát chuẩn: giới hạn tần suất, Origin và CSRF, xác thực phiên, quyền, validate (n nguyên từ 1; C nguyên từ 0; giới hạn mỗi lần; lý do) | 2.2.1, 8.12 |
| 7 | Backend | Áp dụng cập nhật nguyên tử có điều kiện: Nhập thêm bằng `$inc` +n; Giảm bằng `$inc` −n kèm điều kiện stock không nhỏ hơn n; Đặt lại: tính số đang giữ và cập nhật với điều kiện stock bằng tồn đã thấy (phương án A: cùng transaction) | 2.4.6, BR-INV-01 |
| 8 | Backend | Ghi biến động bất biến cùng đơn vị xử lý: loại (`admin_add`, `admin_subtract`, `admin_count`), lượng thay đổi, tồn trước và sau lấy từ kết quả cập nhật, lý do, đơn liên quan, người thực hiện, thời điểm | 2.4.8, BR-INV-11 |
| 9 | Backend, Frontend | Trả tồn mới; giao diện cập nhật dòng và thông báo thành công | 2.2.5 |

Luồng thay thế và ngoại lệ

| Mã | Tại bước | Điều kiện | Xử lý và kết quả |
| --- | --- | --- | --- |
| A1 | 3–4 | Hàng khách trả sau khi đơn đã Completed (đổi trả, bảo hành) | Dùng Nhập thêm kèm lý do và mã đơn liên quan; không đổi trạng thái đơn (2.3.5, BR-INV-09) |
| A2 | 3 | Thiếu hàng sau khi đã giữ chỗ cho đơn | Quy trình 4 bước (2.4.6): đặt sản phẩm “Tạm ngưng đặt mua” (UC-14); hủy các đơn không đáp ứng được với lý do “thiếu hàng” (UC-22, CĐ-03, 05, 08); Đặt lại theo kiểm kê; bật lại “Đang kinh doanh” |
| E1 | 4, 6 | Số lượng không hợp lệ (không phải số nguyên, n nhỏ hơn 1, C âm, vượt giới hạn mỗi lần hoặc giới hạn tồn tối đa ở 8.12) hoặc thiếu lý do | HTTP 422 theo trường; giữ dữ liệu trên biểu mẫu; không đổi tồn |
| E2 | 7 | “Giảm” với n lớn hơn tồn khả dụng hiện có | HTTP 409 kèm tồn hiện tại; không đổi tồn (BR-INV-01) |
| E3 | 7 | “Đặt lại”: tồn khả dụng đã khác giá trị Admin đã thấy (có đơn mới, đơn bị hủy…) | HTTP 409 kèm tồn hiện tại; Admin xem lại rồi xác nhận lại (TH-04) |
| E4 | 7 | “Đặt lại”: số đếm C nhỏ hơn số đang giữ | HTTP 409 kèm số đang giữ và danh sách đơn đang giữ; Admin kiểm tra lại số đếm hoặc xử lý đơn theo A2 |
| E5 | 7 | Sản phẩm không tồn tại | HTTP 404 |
| E6 | 6–8 | Lỗi khi ghi hoặc khi chạy transaction | Phương án A: hủy toàn bộ, tồn và sổ biến động giữ nguyên. Phương án B: thử lại, nếu vẫn lỗi ghi log kèm mã sản phẩm để đối soát (2.4.4). Thông báo chung (HTTP 5xx); Admin kiểm tra lại tồn trước khi thử lại |
| E7 | 6 | Phiên hết hạn, thiếu CSRF hoặc Origin sai | HTTP 401 hoặc 403 (UC-12/A2, UC-12/E4) |
| E8 | — | Request cập nhật tồn kho từ nguồn không phải Admin | Từ chối (HTTP 401 hoặc 403); không có route công khai cập nhật tồn kho (BR-INV-13) |
| E9 | — | Trường tồn kho được gửi qua biểu mẫu sửa sản phẩm (UC-14) | API sản phẩm từ chối trường này (HTTP 422); tồn kho chỉ đổi ở UC-19 (BR-INV-13, TH-09) |

Hậu điều kiện, quy tắc nghiệp vụ và bảo mật

| Hạng mục | Nội dung |
| --- | --- |
| Hậu điều kiện (thành công) | Tồn khả dụng đổi đúng một lần theo kiểu điều chỉnh và không âm; có một bản ghi biến động với tồn trước và sau; đẳng thức Tồn thực tế = Tồn khả dụng + Đang giữ vẫn đúng theo bảng tác động ở 2.4.2 |
| Hậu điều kiện (thất bại) | Tồn khả dụng và sổ biến động giữ nguyên (phương án B có thể cần đối soát nếu tiến trình dừng đột ngột, 2.4.8) |
| Quy tắc nghiệp vụ | BR-INV-01 (không âm, cập nhật nguyên tử có điều kiện), BR-INV-09 (hàng trả sau Completed), BR-INV-11 (biến động bất biến), BR-INV-13 (chỉ Admin; API sản phẩm không nhận tồn kho), BR-INV-14 (lý do bắt buộc, không âm, đặt lại bằng số đếm trừ số đang giữ), BR-INV-16 (API công khai không lộ số tồn). Điều kiện vận hành: không bàn giao hàng trong lúc kiểm kê (2.4.6) |
| Yêu cầu bảo mật liên quan | SEC-16 (chỉ Admin đã xác thực); SEC-24 (không ghi đè, cập nhật đồng thời); SEC-13 (validation số lượng); SEC-14 (NoSQL injection: id và số lượng chỉ nhận đúng kiểu); SEC-07 → SEC-09 (CSRF); SEC-01 → SEC-03 (phiên). Mỗi biến động ghi rõ người thực hiện để truy vết |
| Tham chiếu | 2.2.5, 2.4.1, 2.4.6, 2.4.8 · Dữ liệu: 7.1, 7.7 · API: 8.8 · NFR-10 · TH-04, TH-09 · Nghiệm thu: 12.6 mục 22, 32, 33 |

### 3.1.6. UC-22 – Cập nhật trạng thái đơn hàng

Thông পুরা chung

| Hạng mục | Nội dung |
| --- | --- |
| Mã Use Case | UC-22 |
| Tên Use Case | Cập nhật trạng thái đơn hàng |
| Tác nhân | Admin |
| Tiền điều kiện | (1) Admin có phiên hợp lệ (UC-12). (2) Đơn tồn tại và đang ở trạng thái S không phải trạng thái cuối (Completed, Cancelled, Returned). (3) Admin đang xem chi tiết đơn (UC-21) và thấy trạng thái hiện tại S |

Luồng chính

| Bước | Bên thực hiện | Mô tả | Tham chiếu |
| --- | --- | --- | --- |
| 1 | Admin | Mở chi tiết đơn (UC-21), xem trạng thái S và lịch sử | 2.2.6 |
| 2 | Frontend | Chỉ hiển thị các trạng thái đích T hợp lệ của S: Pending → CĐ-02, CĐ-03; Confirmed → CĐ-04, CĐ-05; Processing → CĐ-06, CĐ-07, CĐ-08; Shipped → CĐ-09, CĐ-10 | 2.3.3 |
| 3 | Admin | Chọn T; nhập lý do (bắt buộc với CĐ-03, 05, 08, 10) và ghi chú tùy chọn (ví dụ đơn vị vận chuyển, mã vận đơn dạng văn bản ở CĐ-06) | BR-ORD-12, 2.3.6 |
| 4 | Frontend | Với CĐ-03, 05, 06, 07, 08, 09, 10 hiển thị hộp thoại xác nhận nêu rõ T và ảnh hưởng tồn kho; CĐ-02 và CĐ-04 không cần | 2.3.3, NFR-11 |
| 5 | Frontend | Vô hiệu hóa nút; gửi PATCH /api/admin/orders/:id/status kèm T, S đang thấy, lý do, ghi chú | 8.9 |
| 6 | Backend | Chạy chuỗi kiểm soát chuẩn: giới hạn tần suất, Origin và CSRF, xác thực phiên, quyền, validate | 2.2.1 |
| 7 | Backend | Nạp đơn, kiểm tra tồn tại; kiểm tra cặp (S, T) thuộc ma trận | 2.3.3, BR-ORD-08 |
| 8 | Backend | Trong một thao tác nhất quán: đổi trạng thái bằng cập nhật có điều kiện `{ _id, status: S }` thành T; áp dụng ảnh hưởng tồn kho (CĐ-03, 05, 08, 10: tăng tồn khả dụng +q từng dòng theo snapshot, ghi biến động `order_cancel` hoặc `order_return`; các chuyển đổi còn lại không đổi tồn); ghi lịch sử S → T | 2.4.4, BR-ORD-13, BR-INV-06 |
| 9 | Backend | Trả đơn đã cập nhật | — |
| 10 | Frontend | Hiển thị trạng thái mới, lịch sử và các T hợp lệ mới | — |

Luồng thay thế và ngoại lệ

| Mã | Tại bước | Điều kiện | Xử lý và kết quả |
| --- | --- | --- | --- |
| A1 | 3 | Bàn giao cho vận chuyển (CĐ-06) | Ghi chú đơn vị vận chuyển và mã vận đơn chỉ là văn bản; V1 không tích hợp, không theo dõi vận đơn (1.3.2). Đơn hết giữ hàng, tồn khả dụng không đổi |
| A2 | 3 | Bàn giao trực tiếp (CĐ-07) | Processing → Completed khi khách nhận tại cửa hàng hoặc cửa hàng tự giao [Đề xuất, QĐ-14] |
| A3 | 3 | Hủy đơn khi hàng chưa rời cửa hàng (CĐ-03, 05, 08) | Lý do bắt buộc; hoàn tồn khả dụng đúng số lượng từng dòng theo snapshot trong cùng thao tác (BR-INV-07); Cancelled là trạng thái cuối |
| A4 | 3 | Khách muốn hủy khi đơn đã Shipped | Không có thao tác hủy. Đơn giữ Shipped đến khi có kết quả giao hàng: Completed (CĐ-09) hoặc Returned (CĐ-10, hàng đã về cửa hàng, lý do bắt buộc, hoàn kho). Hàng hư hỏng được giảm tồn ở UC-19 sau đó. Việc thỏa thuận với khách và đơn vị vận chuyển diễn ra ngoài hệ thống (2.3.5) |
| E1 | 7 | Đơn không tồn tại | HTTP 404; quay về danh sách (UC-20) |
| E2 | 8 | Trạng thái hiện tại khác S Admin đang thấy (hai Admin thao tác cùng lúc, bấm lặp) | HTTP 409 kèm trạng thái hiện tại; giao diện tải lại đơn và hiển thị. Thao tác không áp dụng lần hai, tồn kho đổi tối đa một lần (TH-05) |
| E3 | 7 | Cặp (S, T) không hợp lệ (chủ yếu khi gọi API trực tiếp), gồm đơn đang ở trạng thái cuối | HTTP 409 kèm danh sách T hợp lệ; không đổi dữ liệu (BR-ORD-08, BR-ORD-10) |
| E4 | 6 | Thiếu lý do bắt buộc, hoặc lý do và ghi chú vượt độ dài | HTTP 422 theo trường; giữ dữ liệu trong hộp thoại (8.12) |
| E5 | 8 | Lỗi khi áp dụng ảnh hưởng tồn kho hoặc ghi lịch sử | Phương án A: hủy transaction, trạng thái và tồn giữ nguyên. Phương án B: thử lại, nếu vẫn lỗi ghi log nghiêm trọng kèm mã đơn để đối soát (2.4.4). Thông báo chung (HTTP 5xx); Admin kiểm tra lại trạng thái trước khi thử lại |
| E6 | 6 | Phiên hết hạn, thiếu CSRF hoặc Origin sai | HTTP 401 hoặc 403 (UC-12/A2, UC-12/E4) |
| E7 | — | Request đổi trạng thái từ nguồn không phải Admin, hoặc khách cố đổi hay hủy đơn qua API | HTTP 401 hoặc 403; khách không có thao tác đổi hay hủy đơn (BR-ORD-09) |

Hậu điều kiện, quy tắc nghiệp vụ và bảo mật

| Hạng mục | Nội dung |
| --- | --- |
| Hậu điều kiện (thành công) | Đơn ở trạng thái T. Tồn kho đổi đúng theo chuyển đổi (tăng +q mỗi dòng với CĐ-03, 05, 08, 10; không đổi với các chuyển đổi còn lại) và đúng một lần. Có bản ghi lịch sử: người thực hiện, thời điểm, S → T, lý do, tóm tắt ảnh hưởng tồn kho. Khách thấy nhãn trạng thái mới khi tra cứu (UC-11); V1 không gửi thông báo tự động |
| Hậu điều kiện (thất bại) | Đơn giữ nguyên S; tồn kho không đổi; không có lịch sử mới (phương án B xem E5) |
| Quy tắc nghiệp vụ | BR-ORD-08 (ma trận chuyển đổi), BR-ORD-09 (chỉ Admin), BR-ORD-10 (trạng thái cuối), BR-ORD-11 (chỉ hủy khi hàng chưa rời cửa hàng), BR-ORD-12 (lý do bắt buộc), BR-ORD-13 (ảnh hưởng tồn đúng một lần), BR-ORD-14 (lịch sử bất biến), BR-ORD-15 (nội dung đơn bất biến), BR-ORD-16 và BR-ORD-07 (không có thanh toán), BR-ORD-17 (dữ liệu nội bộ), BR-INV-06 → BR-INV-09, BR-INV-11 |
| Yêu cầu bảo mật liên quan | SEC-16 (chỉ Admin); SEC-07 → SEC-09 (CSRF); SEC-01 → SEC-03 (phiên); SEC-13 (validation: T thuộc tập trạng thái hợp lệ, id đơn đúng định dạng, lý do là chuỗi); SEC-14 (NoSQL injection); SEC-15 (lý do và ghi chú là văn bản thuần, hiển thị có escape); SEC-24 (cập nhật có điều kiện theo trạng thái chống xử lý hai lần); SEC-20 (không ghi thông tin nhận hàng vào log) |
| Tham chiếu | 2.2.7, 2.3.3 → 2.3.6, 2.4.4 · Dữ liệu: 7.6, 7.7 · API: 8.9 · TH-05, TH-08 · Nghiệm thu: 12.6 mục 15, 16, 32 |

## 3.2. Ma trận phân quyền

Tham chiếu: 1.4, 2.2.1, UC-01 → UC-24 · API: 8.1 → 8.10 · Bảo mật: Phần 9 · Nghiệm thu: 12.6 mục 17, 24, 25, 27, 33

V1 chỉ có hai nhóm đối tượng: Khách hàng (không đăng nhập) và Admin (đã xác thực, một vai trò duy nhất, mục 1.4). Vì không có tài khoản khách hàng, quyền của khách không dựa trên danh tính mà dựa trên phạm vi dữ liệu công khai và việc sở hữu một mã bí mật: token giỏ hàng (QĐ-01) hoặc mã tra cứu đơn (QĐ-02). Khách hàng không có quyền truy cập bất kỳ API quản trị nào. Mục này gồm nguyên tắc phân quyền (3.2.1), ma trận theo chức năng (3.2.2), kiểm soát truy cập theo nhóm API (3.2.3) và biện pháp bảo vệ dữ liệu đơn hàng, hạn chế lạm dụng API tạo đơn (3.2.4).

### 3.2.1. Nguyên tắc phân quyền

| STT | Nguyên tắc | Ý nghĩa | Tham chiếu |
| --- | --- | --- | --- |
| 1 | Từ chối mặc định | Route quản trị nằm dưới tiền tố `/api/admin` và đi qua cùng một middleware xác thực. Route công khai là danh sách đóng ở 8.1 → 8.4 và `GET /api/health`. Mọi route mới phải thuộc một trong hai nhóm này | 2.2, SEC-16 (API Admin) |
| 2 | Backend quyết định quyền | Quyền được kiểm tra ở backend cho từng request. Ẩn nút hoặc menu ở frontend chỉ phục vụ trải nghiệm; đường dẫn khu vực quản trị không được coi là bí mật | 2.2.1, SEC-16 |
| 3 | Một vai trò quản trị | Mọi Admin có toàn quyền quản trị trong V1. Bước “kiểm tra quyền Admin” vẫn là middleware riêng trong chuỗi kiểm soát chuẩn để sau này thêm vai trò mà không viết lại route. Phân quyền nhiều cấp là [Mở rộng] | 1.3.2 (dòng 7), 2.2.1, NFR-08 |
| 4 | Quyền của khách dựa trên mã bí mật | Khách chỉ thao tác được giỏ có token trong cookie của trình duyệt mình và chỉ xem được đơn khi có đúng cặp mã đơn và mã tra cứu. Không route nào dùng ID giỏ hoặc ID đơn đoán được làm cơ chế bảo vệ; token và mã tra cứu chỉ lưu dạng băm | QĐ-01, QĐ-02, BR-CART-02, BR-ORD-06, SEC-21 (tra cứu đơn) |
| 5 | Dữ liệu công khai tối thiểu | API công khai chỉ trả bản ghi đang hoạt động và các trường cần để hiển thị; không trả số tồn chính xác, số đang giữ, id nội bộ, giá trị băm hay dữ liệu của đơn khác | BR-INV-16, BR-ORD-17, SEC-18 (không lộ dữ liệu nhạy cảm), SEC-20 (dữ liệu khách và đơn) |
| 6 | Khách chỉ tạo và tra cứu đơn | Khách không sửa hoặc hủy đơn trên website. Trạng thái đơn chỉ do Admin đổi. Trong V1 hệ thống không tự đổi trạng thái, ngoài CĐ-01 khi tạo đơn, kể cả không tự hủy đơn quá hạn (tự hủy là tùy chọn, cần chủ dự án chấp nhận) | BR-ORD-09, BR-ORD-15, QĐ-15 |
| 7 | Kiểm soát theo loại thao tác | Thao tác ghi của Admin đi qua đủ chuỗi kiểm soát chuẩn. Thao tác đọc của Admin cần phiên hợp lệ và quyền, không cần CSRF vì không đổi dữ liệu [Đề xuất]. Thao tác ghi của khách (giỏ, tạo đơn) chịu giới hạn tần suất, Origin, CSRF và validate, vì cookie giỏ là thông tin trình duyệt tự gửi kèm | 2.2.1, BR-CART-02, UC-09 bước 6 |
| 8 | Từ chối không tiết lộ thông tin | 401: thiếu, sai hoặc hết hạn phiên. 403: Origin hoặc CSRF sai, hoặc không đủ quyền. Với tài nguyên bảo vệ bằng mã bí mật (giỏ, đơn), thông báo chung, không phân biệt “không tồn tại” với “sai mã”. Mã HTTP là đề xuất, thống nhất ở 8.11 | NL-09, UC-11/E2, 8.11 |
| 9 | Truy vết thao tác nhạy cảm | Đổi trạng thái đơn và điều chỉnh tồn kho ghi người thực hiện và thời điểm, bản ghi không sửa, không xóa. Log ứng dụng không chứa họ tên, số điện thoại, địa chỉ, mã tra cứu, token hay mật khẩu | BR-ORD-14, BR-INV-11, SEC-20 |

### 3.2.2. Ma trận phân quyền theo chức năng

Ký hiệu: **Có** – được phép; **Giới hạn** – được phép kèm điều kiện ở cột cuối; **Không** – không được phép, backend từ chối; **Như khách** – Admin dùng website công khai như một khách bình thường, phiên Admin không cấp thêm quyền trên chức năng của khách. UC-23 là hành vi giao diện chung của Admin Panel nên không có quyền riêng. Mỗi dòng “Không” và “Giới hạn” là một kịch bản kiểm thử tối thiểu cho 12.6 mục 33: QA gọi trực tiếp API từ khách (không cookie) và từ Admin, kết quả phải đúng như bảng.

| STT | Chức năng / thao tác | UC | Khách hàng | Admin | Điều kiện, giới hạn và tham chiếu |
| --- | --- | --- | --- | --- | --- |
| **A. Dữ liệu công khai** |  |  |  |  |  |
| 1 | Xem trang chủ, banner, danh mục | UC-01 | Có | Như khách | Chỉ banner và danh mục đang bật (8.2) |
| 2 | Xem danh sách, tìm kiếm, lọc, sắp xếp và xem chi tiết sản phẩm | UC-02 → UC-06 | Có | Như khách | Chỉ sản phẩm hiển thị công khai, không gồm sản phẩm ngừng kinh doanh hoặc thuộc danh mục tắt. Chi tiết sản phẩm không hiển thị công khai trả 404 như sản phẩm không tồn tại [Đề xuất, chốt ở 8.1] |
| 3 | So sánh 2–3 sản phẩm | UC-24 | Có | Như khách | Không tạo dữ liệu nghiệp vụ; chỉ dùng dữ liệu sản phẩm công khai |
| 4 | Xem dữ liệu không công khai: sản phẩm ngừng kinh doanh, danh mục và banner đang tắt | UC-15, UC-17, UC-18 | Không | Có | Chỉ qua API quản trị (8.6, 8.7) |
| **B. Giỏ hàng** |  |  |  |  |  |
| 5 | Thêm, xem, sửa số lượng, xóa dòng và xóa toàn bộ giỏ của chính mình | UC-07, UC-08 | Giới hạn | Như khách | Chỉ giỏ gắn với token trong cookie HTTP-only của trình duyệt đang dùng. Thao tác ghi chịu giới hạn tần suất, Origin và CSRF; số dòng và số lượng có giới hạn (BR-CART-02, BR-CART-03; SEC-07 → SEC-09, SEC-11) |
| 6 | Truy cập hoặc sửa giỏ của người khác | — | Không | Không | Không có route hay giao diện nhận ID giỏ, kể cả với Admin (BR-CART-02) |
| **C. Đơn hàng phía khách** |  |  |  |  |  |
| 7 | Tạo đơn hàng từ giỏ của mình | UC-09 | Giới hạn | Như khách | Cần giỏ hợp lệ và khóa chống gửi lặp; chịu giới hạn tần suất, Origin, CSRF; backend tính lại giá và kiểm tra tồn (3.2.4). V1 không có chức năng Admin tạo đơn thay khách |
| 8 | Xem kết quả đặt hàng (mã đơn, mã tra cứu) | UC-10 | Giới hạn | Như khách | Chỉ trong phản hồi của chính yêu cầu tạo đơn; mã tra cứu chỉ hiển thị một lần (BR-ORD-06) |
| 9 | Tra cứu đơn bằng mã đơn và mã tra cứu | UC-11 | Giới hạn | Như khách | Cần đúng cặp mã; chỉ trả nhãn trạng thái, dòng theo snapshot, tổng tiền, thông tin nhận hàng với số điện thoại che bớt; không trả lý do hủy, ghi chú, lịch sử chi tiết (BR-ORD-17). Admin xử lý đơn qua UC-20, UC-21 |
| 10 | Liệt kê đơn, tìm đơn theo tên hoặc số điện thoại, sửa hoặc hủy đơn qua API công khai | — | Không | Không | Không có route công khai cho các thao tác này (BR-ORD-06, BR-ORD-09). Khách muốn hủy hoặc đổi thông tin thì liên hệ cửa hàng (QĐ-07); Admin thao tác trong khu vực quản trị (nhóm G) |
| **D. Xác thực Admin** |  |  |  |  |  |
| 11 | Đăng nhập | UC-12 | Không | Có | Route đăng nhập mở để Admin vào được nhưng khách không có tài khoản; giới hạn tần suất, thông báo chung khi sai (UC-12/E1, E2) |
| 12 | Kiểm tra phiên, đăng xuất | UC-12 | Không | Có | Cần JWT hợp lệ trong cookie HTTP-only; đăng xuất kèm CSRF |
| 13 | Đăng ký tài khoản Admin hoặc tài khoản khách hàng | — | Không | Không | Không có đăng ký công khai. Tài khoản Admin khởi tạo theo quy trình ở 12.2 (SEC-17, secrets); tài khoản khách hàng là [Mở rộng] (1.3.2 dòng 1) |
| **E. Quản trị nội dung** |  |  |  |  |  |
| 14 | Xem Dashboard và thống kê | UC-13 | Không | Có | Chỉ số tính từ dữ liệu thực; không có doanh thu (1.3.2) |
| 15 | Xem, tìm kiếm, lọc danh sách sản phẩm trong trang quản trị | UC-15 | Không | Có | Gồm cả sản phẩm ngừng kinh doanh |
| 16 | Thêm, sửa sản phẩm; đổi trạng thái bán (Đang kinh doanh, Tạm ngưng đặt mua, Ngừng kinh doanh) | UC-14 | Không | Có | Khi sửa không nhận trường tồn kho (BR-INV-13); tồn đầu kỳ chỉ nhập khi tạo |
| 17 | Xóa vĩnh viễn sản phẩm | UC-14 | Không | Giới hạn | Chỉ khi sản phẩm chưa từng có trong đơn nào; ngược lại trả 409 và chỉ được ngừng kinh doanh (QĐ-12) |
| 18 | Upload nhiều ảnh sản phẩm lên Cloudinary | UC-16 | Không | Có | Giới hạn số lượng, dung lượng, định dạng; kiểm tra ở backend (SEC-19, upload ảnh) |
| 19 | Thêm, sửa, bật hoặc tắt danh mục | UC-17 | Không | Có | Tắt danh mục làm sản phẩm thuộc danh mục không hiển thị công khai và không đặt mua được (QĐ-12) |
| 20 | Xóa danh mục | UC-17 | Không | Giới hạn | Chỉ khi không còn sản phẩm tham chiếu, kể cả sản phẩm ngừng kinh doanh; ngược lại trả 409 (QĐ-12) |
| 21 | Thêm, sửa, bật hoặc tắt, xóa banner | UC-18 | Không | Có | Liên kết chỉ nhận đường dẫn nội bộ hoặc URL http/https (2.2.4) |
| **F. Tồn kho** |  |  |  |  |  |
| 22 | Xem tồn kho | UC-19 (khách: UC-02, UC-06) | Giới hạn | Có | Khách chỉ thấy tình trạng còn hàng và số lượng tối đa đặt được. Số tồn chính xác và số đang giữ chỉ dành cho Admin (BR-INV-16) |
| 23 | Điều chỉnh tồn: nhập thêm, giảm, đặt lại theo kiểm kê | UC-19 | Không | Có | Lý do bắt buộc; mỗi lần điều chỉnh ghi một biến động kèm người thực hiện (BR-INV-11, BR-INV-14) |
| 24 | Đổi tồn kho bằng API công khai hoặc qua API sản phẩm | — | Không | Không | Không có route công khai đổi tồn; API sản phẩm từ chối trường tồn kho (422). Tồn chỉ đổi ở UC-19 và theo CĐ-01, 03, 05, 08, 10 (BR-INV-13) |
| **G. Đơn hàng phía quản trị** |  |  |  |  |  |
| 25 | Xem danh sách, lọc theo trạng thái, tìm đơn | UC-20 | Không | Có | Gồm lọc nhanh đơn Pending quá ngưỡng (QĐ-15) |
| 26 | Xem chi tiết đơn: thông tin nhận hàng đầy đủ, lịch sử, lý do, ghi chú | UC-21 | Không | Có | Lý do, ghi chú, lịch sử là dữ liệu nội bộ, không trả qua API công khai (BR-ORD-17) |
| 27 | Đổi trạng thái đơn | UC-22 | Không | Giới hạn | Chỉ các chuyển đổi CĐ-02 → CĐ-10 ở 2.3.3; lý do bắt buộc với CĐ-03, 05, 08, 10; đơn ở trạng thái cuối không đổi được (BR-ORD-08 → BR-ORD-12) |
| 28 | Sửa dòng sản phẩm, giá, tổng tiền hoặc thông tin nhận hàng của đơn đã tạo; mở lại đơn ở trạng thái cuối; ghi nhận thanh toán hoặc hoàn tiền | — | Không | Không | Nội dung đơn bất biến (BR-ORD-15); trạng thái cuối không mở lại (BR-ORD-10); không có thanh toán (BR-ORD-07, BR-ORD-16). Muốn đổi nội dung thì hủy và khách đặt lại. V1 không có chức năng xóa đơn, đơn không còn hiệu lực chuyển sang Cancelled để giữ lịch sử [Đề xuất] |
| **H. Hệ thống** |  |  |  |  |  |
| 29 | Gọi GET /api/health | — | Có | Có | Công khai để công cụ giám sát gọi; chỉ trả trạng thái tối thiểu, không lộ phiên bản, cấu hình hay chuỗi kết nối (SEC-18) [Đề xuất] |

### 3.2.3. Kiểm soát truy cập theo nhóm API

| Nhóm API | Định danh và xác thực | Kiểm soát bổ sung | Phản hồi khi không đạt |
| --- | --- | --- | --- |
| Dữ liệu công khai (8.1, 8.2): GET sản phẩm, danh mục, banner | Không xác thực | Chỉ đọc; chỉ trả bản ghi đang hoạt động và trường công khai; giới hạn tần suất chung; tham số chỉ nhận đúng kiểu (SEC-11, SEC-13, SEC-14, SEC-18) | 429; 422 khi tham số sai |
| Giỏ hàng (8.3) | Token giỏ trong cookie HTTP-only, backend so với giá trị băm (QĐ-01); không có phiên đăng nhập | Chỉ thao tác giỏ khớp token; thao tác ghi cần Origin và CSRF; giới hạn tần suất; chỉ nhận productId và số lượng đúng kiểu (SEC-07 → SEC-09, SEC-11, SEC-14) | Token thiếu hoặc không khớp: xử lý như chưa có giỏ, không tiết lộ giỏ có tồn tại hay không [Đề xuất]; 403 khi Origin hoặc CSRF sai; 429 (NL-08) |
| Tạo đơn (8.4) | Giỏ hợp lệ trong cookie và khóa chống gửi lặp; không đăng nhập | Giới hạn tần suất riêng cho API tạo đơn; Origin và CSRF; validate và làm sạch; giới hạn số dòng, số lượng; backend tính lại giá (SEC-11, SEC-22, SEC-23) | 429 (NL-08); 403 (Origin, CSRF); 422 (dữ liệu không hợp lệ, vượt giới hạn); các từ chối NL-01 → NL-04 theo mã chốt ở 8.11; khóa lặp trả lại đơn đã tạo (NL-07) |
| Tra cứu đơn (8.4) | Mã đơn và mã tra cứu bí mật, gửi trong thân request, không đặt trong URL hay query string | Giới hạn tần suất theo nguồn truy cập và theo mã đơn; so sánh băm an toàn về thời gian; chỉ trả dữ liệu tối thiểu (SEC-11, SEC-21) | 429 (NL-08); 422 khi sai định dạng; cùng một thông báo và mã trạng thái cho mọi trường hợp không khớp (NL-09) |
| Đăng nhập Admin (8.5): POST /api/admin/login | Email và mật khẩu, so sánh với giá trị băm bcryptjs | Giới hạn tần suất theo IP và theo email; Origin và CSRF; thông báo chung; so sánh với băm giả khi không tìm thấy email [Đề xuất] (SEC-10, SEC-11) | 401 chung; 429; 422; 403 (Origin, CSRF) |
| Phiên và quản trị (8.5: GET /me, POST /logout; 8.6 → 8.10): `/api/admin/*` | JWT trong cookie HTTP-only; Admin trong token phải còn tồn tại (2.2.8) | Chuỗi kiểm soát chuẩn (2.2.1): giới hạn tần suất, Origin và CSRF với thao tác ghi, xác thực phiên, kiểm tra quyền, validate, kiểm tra nghiệp vụ, ghi và lịch sử (SEC-01 → SEC-03, SEC-07 → SEC-09, SEC-16) | 401: thiếu, sai, hết hạn phiên hoặc Admin không còn; 403: Origin hoặc CSRF sai, không đủ quyền; 422; 409; 429 |
| Sức khỏe hệ thống (8.10): GET /api/health | Không xác thực | Chỉ trả trạng thái tối thiểu; giới hạn tần suất | 429 |

*CORS chỉ cho phép các origin được duyệt nhưng không thay thế xác thực, phân quyền hay chống CSRF (Phần 9).*

### 3.2.4. Bảo vệ dữ liệu đơn hàng và hạn chế lạm dụng API tạo đơn

Vì không xác minh được người mua (1.3.3), việc bảo vệ dựa trên nhiều lớp dưới đây. Mục này nêu yêu cầu; cách cài đặt nằm ở 8.4 và Phần 9.

| STT | Rủi ro | Biện pháp bắt buộc | Tham chiếu |
| --- | --- | --- | --- |
| 1 | Đoán hoặc duyệt mã đơn để xem đơn người khác | Quyền xem dựa trên mã tra cứu bí mật cấp một lần, chỉ lưu giá trị băm. Mã đơn không phải bí mật. Không có API liệt kê đơn cho khách. Lỗi chung, không phân biệt sai mã đơn hay sai mã tra cứu | BR-ORD-06, NL-09, UC-11, SEC-21 |
| 2 | Dò mã tra cứu bằng thử liên tục | Giới hạn tần suất theo nguồn truy cập và theo mã đơn; mã ngẫu nhiên đủ dài; trong thời gian bị chặn, mã đúng cũng không được xử lý | NL-08, UC-11/E3, SEC-11 (rate limiting) |
| 3 | Lộ dữ liệu cá nhân qua trang tra cứu hoặc API công khai | Chỉ trả nhãn trạng thái, dòng theo snapshot, tổng tiền, thông tin nhận hàng với số điện thoại che bớt. Không trả lý do hủy, ghi chú, lịch sử chi tiết, id nội bộ, giá trị băm | BR-ORD-17, SEC-18, SEC-20 |
| 4 | Lộ mã tra cứu hoặc token giỏ qua database, URL hay log | Chỉ lưu giá trị băm; mã gửi trong thân request, không trong URL hay query string; mã, token, họ tên, số điện thoại, địa chỉ không ghi vào log | QĐ-01, QĐ-02, SEC-20, SEC-21 |
| 5 | Thu thập dữ liệu khách ngoài mức cần thiết | Chỉ họ tên, số điện thoại, địa chỉ nhận hàng, ghi chú; không thu thập email, không lưu thông tin thanh toán | BR-ORD-05, QĐ-04, NFR-12 |
| 6 | Tạo đơn hàng loạt (spam, đơn ảo) hoặc chiếm giữ tồn kho | Giới hạn tần suất riêng cho API tạo đơn; giới hạn số dòng và số lượng mỗi giỏ, mỗi đơn; Admin xác nhận đơn (Pending → Confirmed) trước khi chuẩn bị hàng; hủy đơn hoàn kho ngay; đơn Pending quá ngưỡng được cảnh báo ở Dashboard và danh sách đơn. V1 không xác minh OTP nên rủi ro này chỉ được giảm, không loại bỏ | 1.3.3, BR-CART-03, 2.4.7, QĐ-15, SEC-11 |
| 7 | Gửi lặp, bấm nhiều lần, thử lại sau lỗi mạng | Khóa chống gửi lặp duy nhất; mỗi giỏ chuyển thành tối đa một đơn; yêu cầu lặp trả lại đơn đã tạo, không trừ kho lần hai | BR-ORD-04, BR-INV-12, NL-07, NFR-09, SEC-23 (gửi lặp) |
| 8 | Giả mạo giá, tổng tiền, số lượng trong request | Backend tính lại mọi giá từ database; số lượng lấy từ giỏ phía server; tổng khách đã thấy chỉ để đối chiếu | BR-PRC-01, BR-PRC-03, SEC-22 (giả mạo giá, số lượng) |
| 9 | Trang web khác khiến trình duyệt của khách tạo đơn từ giỏ của họ (CSRF) | Kiểm tra Origin và token CSRF cho mọi request ghi của khách (giỏ, tạo đơn); CORS chỉ cho phép origin được duyệt | BR-CART-02, UC-09 bước 6, SEC-04, SEC-07 → SEC-09 |
| 10 | Dữ liệu độc hại (NoSQL injection, XSS) trong họ tên, địa chỉ, ghi chú, mã tra cứu | Chỉ nhận chuỗi và số đúng kiểu, từ chối đối tượng hoặc mảng; giới hạn độ dài; làm sạch dữ liệu khách; Admin Panel hiển thị dưới dạng văn bản thuần có escape | SEC-13, SEC-14, SEC-15, 8.12 |
| 11 | Truy cập trái phép dữ liệu đơn qua API quản trị | Mọi route quản trị cần JWT hợp lệ trong cookie HTTP-only và Admin còn tồn tại; khách không có route nào tới nhóm này; thao tác ghi cần CSRF; đổi trạng thái và điều chỉnh tồn ghi người thực hiện | SEC-01 → SEC-03, SEC-16, BR-ORD-14, BR-INV-11 |

Giới hạn còn lại của V1 (1.3.3): thông tin khách khai báo chưa được kiểm chứng; ai nắm được mã tra cứu đều xem được thông tin giao nhận của đơn; mất mã thì khách không tự tra cứu lại (UC-11/E5). Xác minh người mua bằng OTP hoặc tài khoản khách hàng là [Mở rộng].