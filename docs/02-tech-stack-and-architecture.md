# PHẦN 4. YÊU CẦU PHI CHỨC NĂNG

Phần này đặc tả các yêu cầu phi chức năng (NFR) mà hệ thống TechGear Shop V1 phải đáp ứng. Mỗi NFR gồm mã, nhóm, mô tả và tiêu chí kiểm thử hoặc nghiệm thu tương ứng. Các tiêu chí này là căn cứ để QA viết test case (mục 1.1.1) và để nghiệm thu theo checklist tại mục 12.6. Các NFR dưới đây áp dụng cho toàn bộ hệ thống trừ khi có ghi chú phạm vi riêng; tham chiếu chéo tới Phần 2, 3, 5, 8, 9 và 10 khi cần.

Nguyên tắc chung khi đọc Phần 4:

- Không có tiêu chí tuyệt đối nếu chưa xác định được cách đo. Mọi chỉ tiêu định lượng đều gắn với điều kiện kiểm thử cụ thể (môi trường, dữ liệu, công cụ đo) và cách xác nhận.
- Các yêu cầu phụ thuộc gói dịch vụ hoặc hạ tầng (ví dụ QĐ-10, QĐ-11) được ghi rõ trạng thái [Cần xác minh] và không dùng làm cam kết uptime hay hiệu năng.
- Các yêu cầu đã được đặc tả chi tiết ở phần khác (ví dụ validation tại 8.12, bảo mật tại Phần 9, SEO tại Phần 10) chỉ được tóm tắt ở đây và tham chiếu tới nơi đặc tả đầy đủ.

## 4.1. Bảng yêu cầu phi chức năng

| STT | Mã NFR | Nhóm | Tên yêu cầu | Mô tả | Tiêu chí kiểm thử / nghiệm thu |
| --- | --- | --- | --- | --- | --- |
| 1 | NFR-01 | Hiệu năng | Thời gian tải trang trong điều kiện kiểm thử xác định | Trang chủ, trang danh sách sản phẩm và trang chi tiết sản phẩm phải đạt mục tiêu tải dưới 3 giây trong điều kiện kiểm thử được xác định: mạng 4G mô phỏng (băng thông xuống 10 Mbps, độ trễ 40 ms, không mất gói), thiết bị tham chiếu cấu hình trung bình (CPU 4 nhân, RAM 8 GB, trình duyệt Chrome bản ổn định mới nhất), dữ liệu thử có ít nhất 5.000 sản phẩm và 20 danh mục, đo bằng Lighthouse (chế độ mobile) hoặc WebPageTest. Không áp dụng cho lần truy cập đầu tiên khi dịch vụ hạ tầng đang ở trạng thái ngủ (QĐ-11). | Đo 5 lần trên môi trường staging với dữ liệu thử; lấy trung vị; trung vị ≤ 3 giây cho Largest Contentful Paint và ≤ 5 giây cho fully loaded. Ghi lại cấu hình đo, phiên bản công cụ và kết quả. Nếu vượt, phân tích nguyên nhân và ghi nhận là nợ kỹ thuật, không tự động đạt. |
| 2 | NFR-02 | Bảo mật | Xác thực, phân quyền và bảo vệ phiên Admin | Admin phải xác thực bằng JWT trong cookie HTTP-only; mọi route quản trị đi qua middleware xác thực và kiểm tra quyền (3.2.3); kiểm soát CSRF và CORS theo Phần 9; mật khẩu băm bằng bcryptjs; rate limiting cho đăng nhập và tạo đơn; Helmet bật security headers. Chi tiết tại Phần 9. | Kiểm thử theo checklist 12.6 mục 24, 25 và các test case từ SEC-01 → SEC-17: (a) truy cập route quản trị khi không có cookie nhận 401; (b) gọi ghi khi thiếu CSRF hoặc Origin sai nhận 403; (c) mật khẩu không xuất hiện trong response hay log; (d) vượt ngưỡng đăng nhập nhận 429. Tất cả phải đạt. |
| 3 | NFR-03 | Tính sẵn sàng | Mức sẵn sàng theo hạ tầng được chốt | Hệ thống không cam kết uptime 99,9% trong V1. Mức sẵn sàng thực tế phụ thuộc gói dịch vụ Vercel, Render, MongoDB Atlas và Cloudinary được chọn (QĐ-07, QĐ-11). Gói miễn phí hoặc thấp có thể tạm ngưng dịch vụ khi không có truy cập; không dùng làm cơ sở cam kết uptime. Mục tiêu nội bộ: không có lỗi 5xx do ứng dụng trong giờ kiểm thử nghiệm thu. | Ghi nhận cấu hình gói dịch vụ tại thời điểm nghiệm thu; đo uptime trong 7 ngày chạy thử bằng công cụ giám sát (UptimeRobot hoặc tương đương) và lưu báo cáo. Không đặt ngưỡng số cứng; kết quả dùng để đối chiếu với gói dịch vụ đã chốt. Công cụ giám sát không được coi là bảo đảm uptime. |
| 4 | NFR-04 | Khả năng mở rộng | Kiến trúc sẵn sàng bổ sung thanh toán trực tuyến | Lõi đơn hàng và tồn kho tách bạch khỏi phần trình bày để có thể bổ sung cổng thanh toán, trạng thái thanh toán và hoàn tiền trong tương lai mà không phải thiết kế lại schema Order, OrderStatusHistory hay quy tắc tồn kho. V1 không có trường, trạng thái hay luồng thanh toán đang hoạt động (BR-ORD-07, QĐ-06). | Đánh giá kiến trúc: schema Order (7.6) có điểm mở rộng rõ ràng (ví dụ nhóm trường payment dự phòng, đánh dấu rõ là chưa dùng); API tạo đơn và đổi trạng thái không phụ thuộc logic thanh toán; tài liệu kiến trúc nêu cách bổ sung thanh toán. Kiểm tra bằng review thiết kế, không phải kiểm thử chức năng. |
| 5 | NFR-05 | Trình duyệt | Hỗ trợ trình duyệt hiện hành | Giao diện khách hàng và Admin Panel phải hoạt động trên Chrome, Firefox, Safari và Edge phiên bản ổn định mới nhất tại thời điểm nghiệm thu (bản phát hành trong vòng 6 tháng). Không hỗ trợ Internet Explorer. | Kiểm thử thủ công trên 4 trình duyệt × 3 kích thước màn hình (desktop, tablet, mobile) cho các luồng chính: xem sản phẩm, giỏ hàng, tạo đơn, tra cứu đơn, đăng nhập Admin, quản lý sản phẩm và đơn hàng. Ghi nhận lỗi theo trình duyệt; lỗi hiển thị không nghiêm trọng được ghi nhận nhưng không chặn nghiệm thu. |
| 6 | NFR-06 | Responsive | Giao diện thích ứng mobile, tablet, desktop | Giao diện phải hiển thị và thao tác được trên ba nhóm kích thước: mobile (chiều rộng 360–767 px), tablet (768–1023 px) và desktop (≥ 1024 px). Bố cục lưới sản phẩm, bộ lọc, giỏ hàng, biểu mẫu đặt hàng và Admin Panel phải dùng được trên cảm ứng. | Kiểm thử thủ công và tự động (nếu có) tại các breakpoint 360, 414, 768, 1024, 1280, 1440 px. Mọi màn hình trong 6.2 phải đạt: không tràn ngang ngoài vùng cuộn cho phép, không che khuất nút hành động chính, chữ đọc được ở cỡ mặc định. Liệt kê màn hình đã kiểm tra trong biên bản. |
| 7 | NFR-07 | SEO | Metadata, URL thân thiện, sitemap và structured data | Trang chủ, trang danh mục và trang chi tiết sản phẩm phải có meta title, meta description, URL thân thiện, canonical, Open Graph và structured data Product/Offer theo Phần 10. Sitemap.xml và robots.txt phải được sinh và cập nhật. Phương án render (SPA + metadata, prerendering, SSR) là quyết định kiến trúc cần chốt trước M1 (QĐ-09). | Kiểm tra từng loại trang bằng công cụ (Rich Results Test, trình kiểm tra thẻ meta, công cụ SEO): có đủ thẻ bắt buộc, structured data hợp lệ, canonical đúng, sitemap chứa URL công khai, robots.txt không chặn nhầm. Kiểm tra 10 URL đại diện (trang chủ, 3 danh mục, 6 sản phẩm). Đạt khi tất cả URL mẫu vượt qua kiểm tra và không có cảnh báo nghiêm trọng. |
| 8 | NFR-08 | Khả năng bảo trì | Cấu trúc module rõ ràng, dễ kiểm thử | Backend tách lớp route – controller – service – model; frontend tách module theo tính năng (sản phẩm, giỏ hàng, đơn hàng, quản trị); toàn bộ logic tồn kho và đơn hàng nằm trong service (2.4.4) để đổi phương án nhất quán (A/B) không đổi API; cấu hình qua biến môi trường; có hướng dẫn chạy và kiểm thử. | Review mã nguồn theo checklist: (a) không có controller hay frontend gọi trực tiếp thao tác tồn kho; (b) không có chuỗi kết nối, khóa bí mật hay mật khẩu trong mã nguồn; (c) có script chạy kiểm thử tự động và hướng dẫn trong README; (d) module hóa theo tính năng. Đạt khi review không phát hiện vi phạm nghiêm trọng. |
| 9 | NFR-09 | Toàn vẹn dữ liệu | Không tạo đơn trùng do gửi lặp ngoài ý muốn | Mỗi lần xác nhận tạo tối đa một đơn; mỗi giỏ chuyển thành tối đa một đơn; yêu cầu lặp (bấm nhiều lần, tải lại, thử lại sau lỗi mạng) không tạo đơn mới và không trừ kho lần hai. Cơ chế: khóa chống gửi lặp duy nhất kết hợp đóng giỏ trong cùng đơn vị xử lý (BR-ORD-04, BR-INV-12, NL-07). | Kiểm thử tự động kịch bản TH-02: gửi đồng thời 10 yêu cầu tạo đơn với cùng khóa; kết quả đúng một đơn được tạo, một lần trừ kho, các yêu cầu còn lại nhận lại đơn đã tạo (NL-07). Bổ sung kịch bản thử lại sau lỗi mạng mô phỏng. Đạt khi số đơn = 1 và tồn kho giảm đúng một lần. |
| 10 | NFR-10 | Toàn vẹn tồn kho | Không bán vượt tồn kho do yêu cầu đồng thời | Tồn khả dụng không âm tại mọi thời điểm; khi nhiều yêu cầu đồng thời nhắm vào cùng sản phẩm, chỉ các yêu cầu thỏa điều kiện tồn kho thành công, các yêu cầu còn lại bị từ chối (NL-03). Cơ chế: cập nhật nguyên tử có điều kiện stock >= quantity, kết hợp transaction (phương án A) hoặc bù trừ (phương án B) theo QĐ-10. Chi tiết tại 2.4.3, 2.4.4, 2.4.5. | Kiểm thử tự động TH-01, TH-03, TH-05, TH-08 trên cluster thật: (a) N yêu cầu đồng thời cho đơn vị cuối → đúng một thành công, tồn không âm; (b) hai đơn chéo nhiều dòng → một đơn thành công trọn vẹn, không dòng nào bị trừ dở; (c) hai thao tác đổi trạng thái cùng đơn → một thành công, tồn đổi tối đa một lần; (d) lỗi giữa chừng → không bán vượt (A) hoặc có đối soát (B). Đạt khi mọi kịch bản thỏa tiêu chí. |
| 11 | NFR-11 | Khả năng sử dụng | Admin quản lý nội dung không cần sửa mã nguồn | Admin phải thực hiện được toàn bộ nghiệp vụ quản trị qua Admin Panel: sản phẩm, danh mục, banner, tồn kho, đơn hàng và trạng thái đơn, không cần chỉnh sửa mã nguồn hay truy cập database trực tiếp. Giao diện có điều hướng nhất quán, tìm kiếm, lọc, phân trang, thông báo kết quả, lỗi theo trường, giữ dữ liệu đang nhập, xác nhận trước thao tác khó hoàn tác, vô hiệu nút khi đang gửi (UC-23). | Kiểm thử theo kịch bản nghiệp vụ đầu-cuối: một Admin mới (đã được cấp tài khoản) thực hiện thêm danh mục, thêm sản phẩm kèm ảnh, điều chỉnh tồn kho, xử lý một đơn từ Pending đến Completed và một đơn hủy, tất cả qua giao diện. Đạt khi không cần can thiệp mã nguồn hay database. |
| 12 | NFR-12 | Riêng tư dữ liệu | Chỉ thu thập dữ liệu khách hàng cần thiết | Chỉ thu thập họ tên, số điện thoại, địa chỉ nhận hàng và ghi chú (không bắt buộc); không thu thập email, không lưu thông tin thanh toán (BR-ORD-05, QĐ-04). Log ứng dụng không chứa họ tên, số điện thoại, địa chỉ, mã tra cứu, token hay mật khẩu (SEC-20). API công khai chỉ trả dữ liệu tối thiểu (BR-ORD-17, BR-INV-16). Dữ liệu khách không ghi vào log và không trả qua API công khai. | Review schema Order (7.6) và biểu mẫu đặt hàng: không có trường email hay thanh toán. Kiểm tra mẫu log sau khi chạy các luồng chính: không xuất hiện số điện thoại, địa chỉ, mã tra cứu, token. Kiểm tra response của API tra cứu đơn: số điện thoại được che bớt, không trả trường nội bộ (SEC-18). Đạt khi tất cả kiểm tra âm tính. |

## 4.2. Ghi chú và tham chiếu chéo

| Mã NFR | Đặc tả chi tiết tại | Ghi chú |
| --- | --- | --- |
| NFR-01 | 5.2, 10.1, 12.6 mục 28, 29 | Điều kiện đo phải ghi trong biên bản kiểm thử; không dùng kết quả đo trên máy cá nhân làm căn cứ nghiệm thu. |
| NFR-02 | Phần 9, 3.2.3, UC-12 | SEC-01 → SEC-17 là các yêu cầu bảo mật tối thiểu; NFR-02 là yêu cầu tổng hợp ở mức nghiệm thu. |
| NFR-03 | 5.2, QĐ-07, QĐ-11 | Không cam kết uptime; chỉ ghi nhận và đối chiếu với gói dịch vụ đã chốt. |
| NFR-04 | 1.2.2 (mục tiêu kỹ thuật 8), 7.6 | Đánh giá qua review kiến trúc, không phải kiểm thử chức năng. |
| NFR-05 | 6.1, 12.6 mục 1 | Danh sách trình duyệt chốt tại thời điểm nghiệm thu; ghi rõ phiên bản trong biên bản. |
| NFR-06 | 6.1, 12.6 mục 1 | Breakpoint tham chiếu; có thể điều chỉnh nếu thiết kế UI/UX chốt bộ breakpoint khác, miễn phủ đủ ba nhóm kích thước. |
| NFR-07 | Phần 10, QĐ-09 | Phương án render là quyết định kiến trúc cần chốt trước M1; NFR-07 chỉ đặt mục tiêu, không chốt phương án. |
| NFR-08 | 2.4.4, Phần 5 | Đổi phương án A/B không đổi API và không đổi cấu trúc controller. |
| NFR-09 | 2.1.4, 2.4.5, TH-02 | Kiểm thử tự động là bắt buộc; kết quả phải lưu cùng mã nguồn kiểm thử. |
| NFR-10 | 2.4.3 → 2.4.5, TH-01, TH-03, TH-05, TH-08 | Kiểm thử trên cluster thật theo QĐ-10; không chấp nhận kết quả trên database giả lập không có hành vi nguyên tử tương đương. |
| NFR-11 | UC-23, 2.2, 12.6 mục 19 → 23 | Kịch bản đầu-cuối dùng tài khoản Admin mới, không dùng tài khoản đã quen thao tác. |
| NFR-12 | 7.6, 8.4, Phần 9 (SEC-18, SEC-20), QĐ-04 | Kiểm tra âm tính trên log và response; không chỉ dựa vào review mã nguồn. |

Các NFR trên là điều kiện nghiệm thu phi chức năng. Mỗi NFR phải truy vết được tới ít nhất một kịch bản kiểm thử trong 12.6 hoặc một test case tự động tương ứng; nếu một NFR không có kịch bản kiểm thử, NFR đó chưa đủ điều kiện nghiệm thu và phải bổ sung trước M5.

# PHẦN 5. CÔNG NGHỆ SỬ DỤNG

Phần này trình bày nền tảng công nghệ của TechGear Shop V1: kiến trúc tổng thể, các thành phần Backend, Frontend và Hạ tầng, vai trò và lý do chọn từng công nghệ, cùng các điểm cần lưu ý khi triển khai. Nền tảng cốt lõi là MERN Stack (MongoDB, Express.js, React + Vite, Node.js); các công nghệ bổ sung được chọn để đáp ứng yêu cầu bảo mật (Phần 9), SEO (Phần 10), hiệu năng (NFR-01) và khả năng bảo trì (NFR-08). Mọi thông tin phụ thuộc gói dịch vụ hoặc môi trường triển khai được ghi rõ trạng thái [Cần xác minh]; không có domain, chi phí hay thông tin liên hệ nào được trình bày như dữ liệu đã xác nhận (QĐ-07).

## 5.1. Kiến trúc tổng thể và nguyên tắc chọn công nghệ

### 5.1.1. Kiến trúc logic

Hệ thống gồm bốn thành phần triển khai độc lập, giao tiếp qua HTTPS:

```
[Trình duyệt khách hàng] ----+
                             +--> [Frontend: React + Vite] --+
[Trình duyệt Admin] ---------+                               |
                                                             +--> [Backend API: Node.js + Express] --+--> [MongoDB Atlas]
                                                             |                                       +--> [Cloudinary]
                                                             +--> [Dịch vụ ngoài: Cloudinary API, dịch vụ giám sát]
```

- Frontend (SPA React + Vite): chạy trên trình duyệt, gọi RESTful API tới backend. Hai khu vực giao diện tách biệt: website khách hàng và Admin Panel, dùng chung một codebase nhưng khác layout, route và cơ chế xác thực.
- Backend API (Node.js + Express): xử lý nghiệp vụ, xác thực, validation, truy cập database và Cloudinary. Không phục vụ HTML cho trình duyệt (trừ khi chọn phương án SSR/prerendering ở 5.2); chỉ trả JSON.
- MongoDB Atlas: database chính, lưu tất cả collection nghiệp vụ (Phần 7). Yêu cầu replica set để dùng transaction (QĐ-10, [Cần xác minh]).
- Cloudinary: lưu trữ và tối ưu hình ảnh sản phẩm, banner. Backend là bên duy nhất gọi Cloudinary; frontend không nhận API key Cloudinary.

Ranh giới tin cậy: mọi quyết định về giá, tồn kho, quyền truy cập và trạng thái đơn đều nằm ở backend. Frontend chỉ hiển thị và gửi yêu cầu. Nguyên tắc này xuyên suốt Phần 2, 3 và Phần 9.

### 5.1.2. Nguyên tắc chọn công nghệ

| STT | Nguyên tắc | Ý nghĩa | Tham chiếu |
| --- | --- | --- | --- |
| 1 | Giữ MERN Stack | Không thay đổi framework cốt lõi (MongoDB, Express, React + Vite, Node) trong V1; mọi bổ sung phải tương thích và không phá vỡ kiến trúc | 1.2.2 |
| 2 | Tách biệt frontend – backend – database | Ba thành phần triển khai độc lập, giao tiếp qua API; cho phép mở rộng, thay thế từng phần mà không viết lại phần khác | NFR-04, NFR-08 |
| 3 | Bảo mật theo mặc định | Các thư viện bảo mật (Helmet, CORS, rate limiting, bcryptjs, cookie HTTP-only) là bắt buộc, không phải tùy chọn | Phần 9 |
| 4 | Đo lường được | Mọi lựa chọn ảnh hưởng tới hiệu năng hoặc SEO phải có cách đo và tiêu chí nghiệm thu (NFR-01, NFR-07) | Phần 4, 10 |
| 5 | Không khóa nhà cung cấp | Ưu tiên công nghệ mã nguồn mở, chuẩn mở; dịch vụ quản lý (Atlas, Cloudinary, Vercel, Render) có thể thay thế mà không đổi mã nguồn ứng dụng | NFR-04, NFR-08 |
| 6 | Phụ thuộc gói dịch vụ phải ghi rõ | Không trình bày gói miễn phí/thấp như bảo đảm uptime hay hiệu năng; ghi rõ [Cần xác minh] khi phụ thuộc gói | QĐ-11, NFR-03 |

## 5.2. Thành phần Backend

| Thành phần | Công nghệ | Vai trò | Lý do chọn | Điểm cần lưu ý |
| --- | --- | --- | --- | --- |
| Runtime | Node.js (bản LTS mới nhất tại thời điểm khởi tạo) | Môi trường chạy backend | Cùng ngôn ngữ với frontend (JavaScript/TypeScript), hệ sinh thái npm phong phú, phù hợp I/O-bound của API thương mại điện tử | Chốt phiên bản LTS trong .nvmrc/engines và ghi vào README; không dùng bản Current cho production |
| Framework | Express.js | Xây dựng RESTful API | Nhẹ, linh hoạt, middleware rõ ràng, phù hợp tách lớp route – controller – service – model (NFR-08) | Không dùng middleware lỗi thời; cấu hình thứ tự middleware đúng (Helmet, CORS, rate limit, body parser, route, xử lý lỗi) |
| Database | MongoDB Atlas | Lưu dữ liệu hệ thống | Schema linh hoạt phù hợp specs khác nhau theo danh mục (7.1); Atlas có replica set sẵn, hỗ trợ transaction (QĐ-10) | Khả năng transaction phụ thuộc gói Atlas — phải chạy script kiểm tra TH-01/TH-02 trên cluster thật trước M3 [Cần xác minh]; bật retryWrites [Cần xác minh] |
| ODM | Mongoose | Schema, validation, truy vấn | Định nghĩa schema rõ ràng, index, middleware, hỗ trợ transaction qua session | Index tạo sẵn khi triển khai; kiểm tra session được truyền đủ trong mọi thao tác thuộc đơn vị xử lý (2.4.4) |
| Authentication | JWT | Xác thực Admin | Không trạng thái, phù hợp API; đặt trong cookie HTTP-only (SEC-01, SEC-02) | JWT không thu hồi được — QĐ-13 cần chốt thời hạn, gia hạn và cơ chế thu hồi (ví dụ số phiên bản token); không lưu JWT trong localStorage |
| Password hashing | bcryptjs | Băm mật khẩu Admin | Thuần JavaScript, không cần build native; đủ an toàn với cost hợp lý (SEC-10) | Chốt cost (đề xuất 10–12) và ghi vào biến môi trường; không log mật khẩu hay hash |
| Image storage | Cloudinary | Lưu trữ, tối ưu hình ảnh | CDN và tối ưu ảnh sẵn; backend kiểm soát upload (SEC-19) | API key chỉ nằm ở backend; giới hạn dung lượng, định dạng, số ảnh; dọn ảnh mồ côi (8.6) |
| Security headers | Helmet | Thiết lập HTTP security headers | Bật các header bảo mật chuẩn (CSP ở mức phù hợp, X-Content-Type-Options, v.v.) | Cấu hình CSP phải tương thích với frontend (Vite, Cloudinary); kiểm tra không chặn tài nguyên hợp lệ |
| CORS | cors | Kiểm soát nguồn truy cập API | Chỉ cho phép origin được duyệt, kèm credentials (SEC-04, SEC-05) | Không dùng `*` cùng credentialed requests; danh sách origin đọc từ biến môi trường, không hardcode |
| Rate limiting | express-rate-limit (hoặc tương đương) | Giới hạn tần suất request | Chống dò mật khẩu, spam đơn, dò mã tra cứu (SEC-11) | Cấu hình riêng cho đăng nhập, tạo đơn, tra cứu đơn, API công khai; xử lý đúng sau reverse proxy (trust proxy) nếu triển khai sau proxy |
| Validation | express-validator hoặc giải pháp tương đương | Kiểm tra dữ liệu đầu vào | Kiểm tra kiểu, độ dài, định dạng ở backend (8.12, SEC-13, SEC-14) | Chỉ nhận chuỗi/số đúng kiểu, từ chối object/mảng (chống NoSQL injection); lỗi trả theo trường |

Ghi chú chung cho Backend:

- Tách lớp: route → controller → service → model. Toàn bộ logic tồn kho và đơn hàng nằm trong service (2.4.4, NFR-08); controller không đổi tồn kho trực tiếp.
- Cấu hình: mọi thông số nhạy cảm (chuỗi kết nối, JWT secret, Cloudinary key, CORS origin, ngưỡng rate limit, thời hạn giỏ hàng, ngưỡng Pending) đọc từ biến môi trường (SEC-17); không commit file .env.
- Logging: log có cấu trúc, không chứa họ tên, số điện thoại, địa chỉ, mã tra cứu, token hay mật khẩu (SEC-20, NFR-12).
- Kiểm thử: có script chạy test tự động cho các kịch bản TH-01 → TH-10 (NFR-09, NFR-10); kết quả lưu cùng mã nguồn.

## 5.3. Thành phần Frontend

| Thành phần | Công nghệ | Vai trò | Lý do chọn | Điểm cần lưu ý |
| --- | --- | --- | --- | --- |
| Framework | React + Vite | Xây dựng giao diện SPA | Hệ sinh thái lớn, component hóa; Vite cho dev server nhanh và build tối ưu | Chốt phương án render SEO (5.2 dưới đây, QĐ-09); code splitting theo route để giảm bundle ban đầu (NFR-01) |
| Ngôn ngữ | JavaScript (hoặc TypeScript nếu nhóm chọn) | Viết mã nguồn frontend | Thống nhất với backend; TypeScript giảm lỗi kiểu nếu nhóm có kinh nghiệm | Nếu chọn TypeScript, cấu hình chặt (strict) và định nghĩa kiểu cho dữ liệu API |
| Styling | TailwindCSS | Thiết kế giao diện | Utility-first, nhất quán, dễ responsive (NFR-06) | Chốt design token (màu, khoảng cách, breakpoint) trước khi làm UI; tránh CSS tùy biến trùng lặp |
| UI Components | shadcn/ui | Thành phần giao diện dùng chung | Component có thể tùy biến, không khóa theme; đồng bộ với Tailwind | Component copy vào mã nguồn — cần quy ước cập nhật; kiểm tra accessibility cơ bản (focus, aria) |
| Routing | React Router | Điều hướng | Chuẩn cho SPA React; hỗ trợ route lồng nhau, lazy loading | Tách route khách hàng và Admin; bảo vệ route Admin ở backend (frontend chỉ chuyển hướng); xử lý 404 và route không tồn tại |
| HTTP Client | Axios hoặc tương đương | Gọi API | Interceptor thuận tiện cho credentials, CSRF, xử lý lỗi thống nhất | Cấu hình withCredentials: true; interceptor xử lý 401 (chuyển đăng nhập) và 429 (thông báo chờ); không log payload nhạy cảm |
| State Management | Redux Toolkit hoặc giải pháp phù hợp | Quản lý trạng thái ứng dụng và giỏ hàng | Redux Toolkit giảm boilerplate, DevTools tốt; giỏ hàng cần state nhất quán giữa các trang | Không lưu dữ liệu nhạy cảm trong state lâu dài; đồng bộ giỏ hàng từ backend sau mỗi thao tác ghi để tránh lệch |
| Form | React Hook Form + thư viện validation phù hợp | Xử lý biểu mẫu | Hiệu năng tốt, kiểm soát lỗi theo trường | Validation ở frontend chỉ để phản hồi nhanh; backend vẫn kiểm tra lại (8.12); hiển thị lỗi theo trường, giữ dữ liệu đang nhập (NFR-11) |
| Icons | lucide-react | Biểu tượng giao diện | Nhẹ, nhất quán, dễ dùng với React | Không lạm dụng icon thay cho nhãn chữ ở hành động quan trọng |
| SEO | react-helmet-async và giải pháp render phù hợp | Quản lý metadata | Cho phép đặt title, meta, canonical, Open Graph theo route | Chỉ có hiệu quả với crawler nếu chọn đúng phương án render (5.2, QĐ-09); structured data phải khớp dữ liệu thật (10.2) |

Ghi chú chung cho Frontend:

- Bảo mật phía client: không lưu token hay dữ liệu nhạy cảm trong localStorage; cookie HTTP-only do backend đặt (SEC-02, SEC-18). Hiển thị dữ liệu khách (họ tên, địa chỉ, ghi chú) dưới dạng văn bản thuần có escape (SEC-15).
- Hiệu năng: lazy load route và ảnh; tối ưu ảnh qua Cloudinary; đo theo NFR-01.
- Responsive: tuân thủ breakpoint ở NFR-06; kiểm tra trên ba nhóm kích thước.
- Cấu hình môi trường: URL API đọc từ biến môi trường build (ví dụ `VITE_API_URL`); không hardcode domain.

## 5.4. Thành phần Hạ tầng

| Thành phần | Công nghệ / dịch vụ | Vai trò | Lý do chọn | Điểm cần lưu ý |
| --- | --- | --- | --- | --- |
| Frontend hosting | Vercel | Triển khai SPA React + Vite | Tích hợp tốt với Vite, CDN toàn cầu, preview deployment | Chưa chốt gói và domain (QĐ-07); gói miễn phí/thấp có giới hạn và có thể tạm ngưng — không dùng làm cam kết uptime (QĐ-11, NFR-03) |
| Backend hosting | Render | Triển khai API Node.js + Express | Hỗ trợ Node, biến môi trường, deploy từ Git | Gói miễn phí có thể ngủ khi không có truy cập, làm chậm lần truy cập đầu (QĐ-11); cấu hình health check và biến môi trường; xác minh trust proxy cho rate limit [Cần xác minh] |
| Database | MongoDB Atlas | Database chính | Replica set sẵn, backup, hỗ trợ transaction theo gói | Kiểm tra khả năng transaction theo gói trước M3 (QĐ-10) [Cần xác minh]; cấu hình IP allowlist, tài khoản database tối thiểu quyền |
| Image CDN | Cloudinary | Lưu trữ và phân phối ảnh | CDN, tối ưu ảnh, biến đổi theo kích thước | API key chỉ ở backend (SEC-17); giới hạn upload (SEC-19); dọn ảnh mồ côi (8.6) |
| Giám sát | UptimeRobot hoặc tương đương | Theo dõi tình trạng dịch vụ | Cảnh báo khi dịch vụ không phản hồi | Công cụ giám sát không phải bảo đảm uptime; endpoint /api/health chỉ trả trạng thái tối thiểu (SEC-18, 8.10) [Đề xuất] |
| Quản lý secrets | Biến môi trường của nền tảng triển khai | Lưu khóa bí mật | Tách khỏi mã nguồn (SEC-17) | Không commit .env; xoay khóa định kỳ; phân quyền người xem biến môi trường |

### 5.4.1. Yêu cầu triển khai chung

| STT | Yêu cầu | Chi tiết | Tham chiếu |
| --- | --- | --- | --- |
| 1 | Cùng origin hoặc cookie hợp lệ | Cookie xác thực Admin và cookie giỏ hàng chỉ hoạt động ổn định khi frontend và backend cùng site hoặc API gọi qua cùng origin với frontend. Đây là quyết định kiến trúc cần chốt trước M1 | QĐ-08, Phần 9 |
| 2 | HTTPS bắt buộc | Mọi môi trường ngoài localhost dùng HTTPS; cookie đặt Secure | SEC-03 |
| 3 | Biến môi trường đầy đủ | Backend: chuỗi kết nối, JWT secret, Cloudinary key, CORS origin, ngưỡng rate limit, thời hạn giỏ, ngưỡng Pending; Frontend: URL API | SEC-17 |
| 4 | Health check | Endpoint GET /api/health trả trạng thái tối thiểu, không lộ phiên bản, cấu hình hay chuỗi kết nối | 8.10, SEC-18 |
| 5 | Tách môi trường | Tối thiểu có môi trường staging và production; không dùng chung database hay Cloudinary account giữa hai môi trường [Đề xuất] | NFR-01, 12.6 |
| 6 | Ghi nhận gói dịch vụ | Ghi lại gói Vercel/Render/Atlas/Cloudinary tại thời điểm nghiệm thu để đối chiếu NFR-03 | NFR-03 |

## 5.5. Định hướng SEO rendering

React + Vite mặc định là SPA: HTML gửi về trình duyệt gần như rỗng, nội dung do JavaScript render. Crawler hiện đại (Googlebot) có thể render JavaScript, nhưng chất lượng lập chỉ mục và tốc độ không ổn định bằng HTML có sẵn nội dung; một số crawler khác (mạng xã hội, công cụ SEO) không render JS. Vì vậy cần đánh giá và chốt phương án render trước M1 (QĐ-09). Ba phương án dưới đây không thay đổi MERN Stack ở backend; chỉ khác cách sinh HTML cho frontend.

### 5.5.1. So sánh phương án

| Tiêu chí | A. SPA + metadata (react-helmet-async) | B. Prerendering / static generation cho trang công khai | C. SSR (ví dụ Next.js) hoặc giải pháp render HTML phía server |
| --- | --- | --- | --- |
| Cách hoạt động | Trình duyệt tải SPA, JS render nội dung và chèn metadata | Trang công khai (chủ đề, danh mục, sản phẩm) được render sẵn thành HTML tĩnh tại build hoặc theo yêu cầu; SPA hydrate | Server render HTML đầy đủ cho mỗi yêu cầu, sau đó hydrate |
| Ưu điểm | Đơn giản nhất, giữ nguyên codebase React + Vite; chi phí thấp | HTML có nội dung cho crawler, cải thiện SEO rõ rệt; vẫn giữ SPA cho phần tương tác; không cần server render phức tạp | SEO tốt nhất, kiểm soát metadata theo route; phù hợp nếu SEO là ưu tiên cao |
| Hạn chế | Phụ thuộc khả năng render JS của crawler; metadata có thể không được đọc đầy đủ | Cần thêm bước build/prerender và pipeline triển khai; dữ liệu động (giá, tồn kho) phải làm mới; trang có bộ lọc phức tạp khó prerender | Thay đổi framework frontend (Next.js) — thay đổi lớn so với MERN Stack; tăng độ phức tạp vận hành (server render, cache); cần chốt lại kiến trúc |
| Ảnh hưởng triển khai | Không đổi | Thêm bước build/prerender trên Vercel hoặc pipeline; cần cơ chế revalidate khi sản phẩm/danh mục thay đổi | Thay đổi hosting frontend (cần môi trường Node cho SSR); thay đổi cấu trúc dự án frontend |
| Phù hợp khi | Ưu tiên tốc độ triển khai; SEO chưa phải kênh chính | Cần SEO tốt cho trang sản phẩm/danh mục mà không đổi framework | SEO là ưu tiên hàng đầu và chấp nhận thay đổi kiến trúc |
| Trạng thái | Khả thi trong V1 | [Đề xuất] nếu cần cải thiện SEO đáng kể mà giữ stack | [Cần xác nhận] — thay đổi lớn, cần chủ dự án phê duyệt |

### 5.5.2. Đề xuất

- Đề xuất ưu tiên: phương án B (prerendering/static generation cho trang chủ, trang danh mục và trang chi tiết sản phẩm) kết hợp SPA cho phần tương tác (giỏ hàng, đặt hàng, tra cứu, Admin). Lý do: đáp ứng NFR-07 và Phần 10 mà không thay đổi MERN Stack; chi phí triển khai thấp hơn SSR; có thể bắt đầu bằng SPA + metadata (phương án A) trong những tuần đầu và bổ sung prerender trước M5 nếu tiến độ cho phép.
- Điều kiện: dữ liệu động (giá, tình trạng còn hàng) trên trang prerender phải được làm mới theo cơ chế revalidate hoặc render lại khi có thay đổi; không đưa giá/tồn kho cũ vào structured data (10.2).
- Quyết định: đây là quyết định kiến trúc cần chốt trước M1 (QĐ-09). Nếu chọn C, phải cập nhật lại Phần 5, 6, 10 và tiến độ; không tự ý chuyển framework mà không có phê duyệt.

## 5.6. Hạ tầng triển khai

### 5.6.1. Sơ đồ triển khai định hướng

```
[Người dùng]
     | HTTPS
     v
[Vercel: Frontend React + Vite] ---- HTTPS (API, credentials) ----> [Render: Backend Node.js + Express]
                                                                              |
                                                                              +--> [MongoDB Atlas]
                                                                              +--> [Cloudinary API]
                                                                              +--> [Dịch vụ giám sát]

[Quản trị viên]
     | HTTPS
     v
[Vercel: Admin Panel (cùng codebase frontend, route /admin)]
```

Lưu ý: sơ đồ trên chỉ là định hướng; chưa chốt domain, gói dịch vụ và chi phí (QĐ-07). Nếu frontend và backend không cùng site hoặc không gọi qua cùng origin, cookie có thể bị chặn (QĐ-08) — phải chốt trước M1.

### 5.6.2. Yêu cầu theo từng thành phần hạ tầng

| Thành phần | Yêu cầu | Trạng thái | Tham chiếu |
| --- | --- | --- | --- |
| Vercel (frontend) | Cấu hình biến môi trường build (`VITE_API_URL`); chốt gói và domain; bật HTTPS; cấu hình redirect/rewrite cho SPA và (nếu chọn) prerender | [Cần xác minh] gói, domain | QĐ-07, QĐ-08 |
| Render (backend) | Cấu hình biến môi trường; bật health check; cấu hình trust proxy nếu sau proxy; chốt gói và vùng triển khai gần người dùng | [Cần xác minh] gói, vùng | QĐ-11, SEC-11 |
| MongoDB Atlas | Replica set; kiểm tra khả năng transaction theo gói (QĐ-10); IP allowlist; tài khoản database tối thiểu quyền; bật backup theo gói | [Cần xác minh] | QĐ-10, 2.4.4 |
| Cloudinary | Tài khoản, API key chỉ ở backend; cấu hình giới hạn upload; quy ước thư mục ảnh (sản phẩm, banner) | [Cần xác minh] | SEC-19, 8.6 |
| Giám sát | Endpoint /api/health; cấu hình kiểm tra định kỳ; cảnh báo khi dịch vụ không phản hồi; không coi là bảo đảm uptime | [Đề xuất] | 8.10, NFR-03 |

### 5.6.3. Ghi chú về uptime và hiệu năng

Không cam kết uptime 99,9% trong V1 (NFR-03). Gói miễn phí hoặc thấp của Vercel, Render, MongoDB Atlas và Cloudinary có thể tạm ngưng dịch vụ khi không có truy cập, làm chậm lần truy cập đầu; không dùng làm cơ sở cam kết uptime hay hiệu năng (QĐ-11). Kết quả đo hiệu năng theo NFR-01 phải ghi rõ gói dịch vụ tại thời điểm đo và không áp dụng cho lần truy cập đầu tiên khi dịch vụ đang ở trạng thái ngủ.

## 5.7. Tổng hợp công nghệ và trạng thái chốt

| STT | Hạng mục | Công nghệ | Trạng thái | Ghi chú |
| --- | --- | --- | --- | --- |
| 1 | Backend runtime | Node.js LTS | [V1] | Chốt phiên bản trong README |
| 2 | Backend framework | Express.js | [V1] | Tách lớp route – controller – service – model |
| 3 | Database | MongoDB Atlas | [V1] | Kiểm tra transaction theo gói [Cần xác minh] |
| 4 | ODM | Mongoose | [V1] | Index và session |
| 5 | Xác thực | JWT trong cookie HTTP-only | [V1] | QĐ-13 chốt thời hạn và thu hồi |
| 6 | Băm mật khẩu | bcryptjs | [V1] | Chốt cost |
| 7 | Lưu ảnh | Cloudinary | [V1] | Key chỉ ở backend |
| 8 | Bảo mật HTTP | Helmet | [V1] | CSP tương thích frontend |
| 9 | CORS | cors | [V1] | Không dùng `*` với credentials |
| 10 | Rate limit | express-rate-limit hoặc tương đương | [V1] | Cấu hình riêng từng nhóm API |
| 11 | Validation | express-validator hoặc tương đương | [V1] | Backend là nơi quyết định |
| 12 | Frontend framework | React + Vite | [V1] | Code splitting |
| 13 | Styling | TailwindCSS | [V1] | Chốt design token |
| 14 | UI components | shadcn/ui | [V1] | Quy ước cập nhật |
| 15 | Routing | React Router | [V1] | Tách route khách/Admin |
| 16 | HTTP client | Axios hoặc tương đương | [V1] | withCredentials |
| 17 | State | Redux Toolkit hoặc tương đương | [V1] | Đồng bộ giỏ sau thao tác ghi |
| 18 | Form | React Hook Form + validation | [V1] | Backend kiểm tra lại |
| 19 | Icons | lucide-react | [V1] | — |
| 20 | SEO metadata | react-helmet-async | [V1] | Kết hợp phương án render (5.5) |
| 21 | Phương án render SEO | Prerendering/static generation (đề xuất) | [Cần xác nhận] QĐ-09 | Chốt trước M1 |
| 22 | Frontend hosting | Vercel | [Cần xác minh] gói, domain | QĐ-07, QĐ-11 |
| 23 | Backend hosting | Render | [Cần xác minh] gói, vùng | QĐ-11 |
| 24 | Giám sát | UptimeRobot hoặc tương đương | [Đề xuất] | Không phải bảo đảm uptime |
| 25 | Quản lý secrets | Biến môi trường | [V1] | Không commit .env |

Các mục [Cần xác nhận] và [Cần xác minh] phải được chốt trước các mốc tương ứng (M1 cho QĐ-08, QĐ-09; M3 cho QĐ-10) và cập nhật lại Phần 5, 9, 10 và tiến độ Phần 11. Mọi thay đổi công nghệ so với bảng trên phải được ghi thành yêu cầu thay đổi và cập nhật SRS trước khi triển khai (mục 1.1).

# PHẦN 6. GIAO DIỆN

Phần này đặc tả yêu cầu giao diện của TechGear Shop V1: nguyên tắc thiết kế (6.1), danh sách màn hình kèm mục tiêu và thành phần chính (6.2), sơ đồ điều hướng (6.3) và yêu cầu về trạng thái giao diện dùng chung (6.4). Mục tiêu là bảo đảm mọi màn hình trong phạm vi V1 có đặc tả đủ để thiết kế UI/UX dựng wireframe, mockup và để QA kiểm thử, đồng thời nhất quán với Use Case (Phần 3), API (Phần 8), cấu trúc dữ liệu (Phần 7), bảo mật (Phần 9) và SEO (Phần 10). Giao diện V1 không có đăng ký/đăng nhập khách hàng, không có thanh toán trực tuyến và không có theo dõi vận đơn tự động (mục 1.3.2); mọi màn hình liên quan đến các tính năng đó nằm ngoài phạm vi.

## 6.1. Nguyên tắc thiết kế

### 6.1.1. Nguyên tắc chung

| STT | Nguyên tắc | Mô tả | Tham chiếu |
| --- | --- | --- | --- |
| 1 | Tập trung vào sản phẩm | Hình ảnh sản phẩm là trọng tâm; giá, giá khuyến mãi và tình trạng còn hàng hiển thị rõ ngay trên thẻ sản phẩm và trang chi tiết | UC-02, UC-06 |
| 2 | Thông số kỹ thuật có cấu trúc | Bảng thông số theo danh mục, có đơn vị đo; nhóm thông số theo cụm (CPU, RAM, lưu trữ, màn hình…); không trộn chuỗi tự do với giá trị số | 7.1, UC-06 |
| 3 | So sánh cấu hình trực quan | Cho phép đặt 2–3 sản phẩm cạnh nhau, làm nổi bật khác biệt; khuyến nghị cùng danh mục để so sánh có nghĩa | UC-24, 2.1.2 bước 5 |
| 4 | Tìm kiếm và lọc dễ dùng | Bộ lọc kết hợp được nhiều điều kiện (danh mục, thương hiệu, khoảng giá, thông số theo giá trị và ngưỡng); hiển thị số điều kiện đang áp dụng và nút xóa nhanh | UC-03, UC-04, UC-05; 8.1 |
| 5 | Giỏ hàng minh bạch | Hiển thị đơn giá hiện hành, số lượng, thành tiền, tạm tính; đánh dấu rõ dòng không còn hợp lệ; không giữ hàng | UC-07, UC-08; BR-CART-01, BR-CART-05 |
| 6 | Đặt hàng ngắn gọn, lỗi rõ ràng | Biểu mẫu chỉ gồm các trường tối thiểu; lỗi hiển thị cạnh từng trường, giữ dữ liệu đang nhập; nêu rõ V1 không thanh toán trực tuyến | UC-09; QĐ-04, QĐ-05, QĐ-06 |
| 7 | Tình trạng hàng do backend quyết định | “Còn hàng” / “Hết hàng” / “Không thể đặt mua” suy ra từ dữ liệu backend, không do frontend tự suy diễn; không hiển thị số tồn chính xác cho khách | 2.4.1, BR-INV-16 |
| 8 | Admin tách biệt và xác thực riêng | Khu vực quản trị có layout, route và kiểm tra phiên riêng; mọi trang quản trị đều yêu cầu phiên hợp lệ; không dựa vào việc giấu đường dẫn | UC-12, 3.2 |
| 9 | Responsive thực chất | Giao diện dùng được trên mobile, tablet, desktop; không chỉ thu nhỏ mà sắp xếp lại nội dung và điều khiển cho cảm ứng | NFR-06 |
| 10 | Dễ quản lý không cần sửa mã | Mọi thao tác quản trị thực hiện qua Admin Panel: thêm, sửa, xóa, cập nhật trạng thái, upload ảnh, điều chỉnh tồn kho | UC-14 → UC-22, NFR-11 |

### 6.1.2. Yêu cầu bổ sung cho giao diện

| STT | Yêu cầu | Chi tiết | Tham chiếu |
| --- | --- | --- | --- |
| 1 | Accessibility cơ bản | Điều khiển có nhãn rõ; focus visible; thao tác chính làm được bằng bàn phím; độ tương phản đủ đọc; thông báo lỗi không chỉ dựa vào màu | NFR-06, NFR-11 |
| 2 | Thông báo trạng thái | Mọi thao tác ghi có phản hồi: thành công (thông báo ngắn), lỗi (theo trường hoặc thông báo chung), đang gửi (vô hiệu nút + spinner) | UC-23, NFR-11 |
| 3 | Bảo vệ dữ liệu đang nhập | Khi lỗi validation hoặc lỗi mạng, giữ nguyên dữ liệu biểu mẫu; khi rời trang có thay đổi chưa lưu, cảnh báo nếu phù hợp | NL-05, NL-06, NFR-11 |
| 4 | Xác nhận trước thao tác khó hoàn tác | Xóa, hủy đơn, đổi trạng thái đơn có ảnh hưởng tồn kho phải có hộp thoại xác nhận nêu rõ hậu quả | 2.3.3, NFR-11 |
| 5 | Hiển thị dữ liệu an toàn | Dữ liệu khách (họ tên, địa chỉ, ghi chú) hiển thị dưới dạng văn bản thuần có escape; không render HTML từ đầu vào người dùng | SEC-15 |
| 6 | Không lộ dữ liệu nội bộ | API công khai chỉ trả trường cần hiển thị; giao diện khách không hiển thị id nội bộ, giá trị băm, số tồn chính xác | SEC-18, BR-INV-16, BR-ORD-17 |
| 7 | Trạng thái tải và rỗng | Mỗi màn hình có trạng thái đang tải (skeleton hoặc spinner) và trạng thái rỗng (thông báo + hành động gợi ý) | 6.4 |
| 8 | Định dạng nhất quán | Giá tiền, ngày giờ, trạng thái đơn dùng cùng định dạng trên toàn hệ thống; đơn vị đo thông số rõ ràng | 7.1, 2.3.2 |

### 6.1.3. Bố cục và breakpoint

| Nhóm | Chiều rộng tham chiếu | Bố cục gợi ý |
| --- | --- | --- |
| Mobile | 360–767 px | Một cột; menu thu gọn; bộ lọc dạng drawer; bảng thông số chuyển thành danh sách nhãn – giá trị; giỏ hàng dạng danh sách dọc |
| Tablet | 768–1023 px | Hai cột cho danh sách sản phẩm; sidebar lọc thu gọn; bảng thông số giữ dạng bảng nếu đủ chỗ |
| Desktop | ≥ 1024 px | Lưới 3–4 cột sản phẩm; sidebar lọc cố định; bảng so sánh và bảng thông số đầy đủ |

Breakpoint cụ thể do thiết kế UI/UX chốt, miễn phủ đủ ba nhóm kích thước ở NFR-06. Giao diện Admin Panel ưu tiên desktop nhưng vẫn dùng được trên tablet; các thao tác chính (xem danh sách, mở chi tiết, đổi trạng thái) không được yêu cầu cuộn ngang quá mức trên tablet.

## 6.2. Danh sách màn hình

Mục này liệt kê toàn bộ màn hình trong phạm vi V1, chia hai khu vực: khách hàng (6.2.1) và quản trị (6.2.2). Mỗi màn hình có mã (SCR-C… cho khách, SCR-A… cho Admin), mục tiêu, thành phần chính, dữ liệu và hành động, trạng thái đặc biệt, responsive và tham chiếu. Các màn hình ngoài phạm vi (đăng ký/đăng nhập khách hàng, thanh toán trực tuyến, theo dõi vận đơn) không được thiết kế trong V1.

### 6.2.1. Khu vực khách hàng

Bảng tổng hợp:

| Mã | Tên màn hình | UC | API chính |
| --- | --- | --- | --- |
| SCR-C01 | Trang chủ | UC-01 | 8.1 (featured, new), 8.2 |
| SCR-C02 | Danh sách sản phẩm | UC-02 → UC-05 | 8.1 |
| SCR-C03 | Chi tiết sản phẩm | UC-06 | 8.1 (slug) |
| SCR-C04 | So sánh sản phẩm | UC-24 | 8.1 |
| SCR-C05 | Giỏ hàng | UC-07, UC-08 | 8.3 |
| SCR-C06 | Biểu mẫu tạo đơn hàng | UC-09 | 8.4 |
| SCR-C07 | Trang xác nhận đặt hàng | UC-10 | 8.4 |
| SCR-C08 | Trang tra cứu đơn hàng | UC-11 | 8.4 |

#### SCR-C01 – Trang chủ

| Hạng mục | Nội dung |
| --- | --- |
| Mục tiêu | Giới thiệu cửa hàng, đưa khách vào danh mục và sản phẩm nổi bật/mới; điểm vào chính của website |
| Thành phần chính | Header (logo, menu danh mục, ô tìm kiếm, liên kết giỏ hàng, liên kết tra cứu đơn); banner đang hoạt động (carousel hoặc khối tĩnh); dải danh mục; khối “Sản phẩm nổi bật”; khối “Sản phẩm mới”; footer |
| Dữ liệu hiển thị | Banner, danh mục đang bật, sản phẩm nổi bật, sản phẩm mới; chỉ dữ liệu đang hoạt động, không gồm sản phẩm ngừng kinh doanh hoặc thuộc danh mục tắt |
| Hành động | Bấm banner (điều hướng theo liên kết đã kiểm tra), chọn danh mục, bấm thẻ sản phẩm, tìm kiếm, mở giỏ hàng, mở trang tra cứu đơn |
| Trạng thái | Đang tải (skeleton banner + lưới sản phẩm); rỗng (ẩn khối nếu không có sản phẩm); lỗi (thông báo chung, cho tải lại) |
| Responsive | Mobile: banner và khối sản phẩm một cột; desktop: lưới 3–4 cột |
| Tham chiếu | UC-01; 8.1, 8.2; 2.1.2 bước 1; SEC-15 (hiển thị liên kết an toàn) |

#### SCR-C02 – Danh sách sản phẩm

| Hạng mục | Nội dung |
| --- | --- |
| Mục tiêu | Duyệt và tìm sản phẩm theo danh mục, bộ lọc và sắp xếp |
| Thành phần chính | Tiêu đề danh mục/kết quả; thanh công cụ (sắp xếp, số kết quả, nút mở bộ lọc trên mobile); sidebar bộ lọc (danh mục, thương hiệu, khoảng giá, thông số theo giá trị và ngưỡng); lưới sản phẩm; phân trang |
| Dữ liệu hiển thị | Mỗi thẻ sản phẩm: ảnh, tên, giá niêm yết, giá khuyến mãi (nếu có), tình trạng còn hàng; tổng số kết quả và trang hiện tại |
| Hành động | Áp dụng/bỏ bộ lọc, sắp xếp, chuyển trang, mở chi tiết, thêm nhanh vào giỏ (nếu hợp lệ), thêm vào danh sách so sánh |
| Trạng thái | Đang tải (skeleton lưới); rỗng (thông báo “Không có sản phẩm phù hợp” + nút xóa bộ lọc); lỗi (thông báo + thử lại) |
| Responsive | Mobile: bộ lọc dạng drawer, lưới 1–2 cột; tablet 2–3 cột; desktop 3–4 cột |
| Tham chiếu | UC-02 → UC-05; 8.1 (page, limit, search, category, brand, minPrice, maxPrice, sort, specs); BR-CART-03 (giới hạn số lượng) |

Ghi chú: bộ lọc thông số phải dùng cú pháp thống nhất với API (8.1) — lọc theo giá trị cụ thể và theo ngưỡng là hai loại khác nhau, không dùng chung một ô nhập mơ hồ. Trang danh sách có bộ lọc không được prerender/SEO như trang danh mục gốc (10.2); canonical trỏ về trang danh mục không kèm bộ lọc.

#### SCR-C03 – Chi tiết sản phẩm

| Hạng mục | Nội dung |
| --- | --- |
| Mục tiêu | Cung cấp đủ thông tin để khách quyết định mua; điểm vào giỏ hàng và so sánh |
| Thành phần chính | Thư viện ảnh (ảnh chính + thumbnail); tên, thương hiệu, mã SKU (nếu có); giá niêm yết và giá khuyến mãi; tình trạng còn hàng; nút “Thêm vào giỏ”, nút “So sánh”; bảng thông số kỹ thuật theo danh mục; thông tin bảo hành; mô tả |
| Dữ liệu hiển thị | Dữ liệu sản phẩm hiện hành do backend trả; không hiển thị số tồn chính xác; nếu sản phẩm không đặt mua được (ngừng kinh doanh, tạm ngưng, hết hàng) thì nút thêm vào giỏ bị vô hiệu kèm lý do |
| Hành động | Thêm vào giỏ (kiểm tra hợp lệ trước khi gọi API), thêm vào so sánh (tối đa 3), chuyển ảnh, quay lại danh sách |
| Trạng thái | Đang tải (skeleton); không tìm thấy (404 thân thiện, gợi ý quay lại danh sách — sản phẩm không công khai trả 404 như không tồn tại, 8.1); lỗi (thông báo + thử lại) |
| Responsive | Mobile: ảnh và thông tin xếp dọc, bảng thông số dạng nhãn – giá trị; desktop: bố cục hai cột ảnh – thông tin, bảng thông số đầy đủ |
| Tham chiếu | UC-06, UC-24; 8.1; 7.1 (specs, warranty); SEC-15; NFR-07 (metadata trang chi tiết) |

#### SCR-C04 – So sánh sản phẩm

| Hạng mục | Nội dung |
| --- | --- |
| Mục tiêu | Đặt 2–3 sản phẩm cạnh nhau để so sánh cấu hình và giá |
| Thành phần chính | Khối chọn sản phẩm (tối đa 3); bảng so sánh theo hàng thông số; nút xóa từng sản phẩm; nút thêm vào giỏ cho từng sản phẩm; liên kết quay lại chi tiết |
| Dữ liệu hiển thị | Thông số hiện hành của các sản phẩm đã chọn; đánh dấu khác biệt nếu có; khuyến nghị chọn cùng danh mục vì bộ thông số khác nhau |
| Hành động | Thêm/bớt sản phẩm khỏi danh sách so sánh, thêm vào giỏ, quay lại chi tiết |
| Trạng thái | Rỗng (hướng dẫn thêm sản phẩm); thiếu sản phẩm (một số sản phẩm không còn công khai — thông báo và cho xóa); lỗi |
| Responsive | Mobile: cuộn ngang có kiểm soát hoặc chuyển sang so sánh từng cặp; desktop: bảng đầy đủ |
| Tham chiếu | UC-24; 2.1.2 bước 5; 7.1. So sánh không tạo dữ liệu nghiệp vụ và không ảnh hưởng giỏ hàng |

#### SCR-C05 – Giỏ hàng

| Hạng mục | Nội dung |
| --- | --- |
| Mục tiêu | Xem và chỉnh sửa giỏ trước khi đặt hàng; hiển thị tạm tính trung thực |
| Thành phần chính | Danh sách dòng (ảnh, tên, đơn giá hiện hành, ô số lượng, thành tiền, nút xóa); đánh dấu dòng không hợp lệ kèm lý do; khối tạm tính; nút “Tiếp tục mua sắm” và “Đặt hàng”; thông báo giỏ trống |
| Dữ liệu hiển thị | Đơn giá và thành tiền do backend tính từ dữ liệu hiện hành; dòng ngừng bán/thiếu hàng bị đánh dấu và không tính vào tạm tính; không hiển thị số tồn chính xác |
| Hành động | Đổi số lượng (trong giới hạn), xóa dòng, xóa toàn bộ, sang biểu mẫu đặt hàng (chỉ khi không còn dòng không hợp lệ) |
| Trạng thái | Đang tải; rỗng (thông báo + gợi ý quay lại danh sách); có dòng không hợp lệ (chặn đặt hàng, hướng dẫn xóa); lỗi |
| Responsive | Mobile: danh sách dọc, khối tạm tính cố định dưới; desktop: bảng + cột tóm tắt |
| Tham chiếu | UC-07, UC-08; 8.3; BR-CART-01, BR-CART-03, BR-CART-05; NL-01, NL-02, NL-03 |

#### SCR-C06 – Biểu mẫu tạo đơn hàng

| Hạng mục | Nội dung |
| --- | --- |
| Mục tiêu | Thu thập thông tin nhận hàng tối thiểu và xác nhận đặt hàng |
| Thành phần chính | Tóm tắt đơn (các dòng, tạm tính, phí vận chuyển = 0); biểu mẫu họ tên, số điện thoại, địa chỉ nhận hàng, ghi chú (không bắt buộc); thông báo “V1 không thanh toán trực tuyến; cách thu tiền và phí (nếu có) do cửa hàng thông báo khi xác nhận đơn”; nút “Xác nhận đặt hàng” |
| Dữ liệu hiển thị | Tổng tiền do backend tính lại khi gửi; tổng khách đã thấy chỉ để đối chiếu (BR-PRC-03) |
| Hành động | Nhập/sửa thông tin, gửi yêu cầu tạo đơn (kèm khóa chống gửi lặp); khi giá đổi, hiển thị số liệu mới và yêu cầu xác nhận lại (NL-04) |
| Trạng thái | Đang gửi (vô hiệu nút + spinner); lỗi theo trường; lỗi chung (giữ dữ liệu, cho thử lại); giỏ rỗng/hết hạn (chặn, quay lại giỏ) |
| Responsive | Mobile: một cột, tóm tắt đơn thu gọn; desktop: hai cột (biểu mẫu – tóm tắt) |
| Tham chiếu | UC-09; 8.4; QĐ-04, QĐ-05, QĐ-06; BR-PRC-03, BR-ORD-05; NL-01 → NL-06, NL-08 |

Ghi chú: giao diện nêu rõ không có thanh toán trực tuyến; không thiết kế trường thẻ hay tài khoản thanh toán (1.3.2).

#### SCR-C07 – Trang xác nhận đặt hàng

| Hạng mục | Nội dung |
| --- | --- |
| Mục tiêu | Xác nhận đơn đã tạo, cung cấp mã đơn và mã tra cứu để khách lưu lại |
| Thành phần chính | Thông báo thành công; mã đơn; mã tra cứu (chỉ hiển thị một lần, kèm nút sao chép/in); tóm tắt đơn theo snapshot; trạng thái “Chờ cửa hàng xác nhận”; liên kết tra cứu đơn |
| Dữ liệu hiển thị | Snapshot dòng sản phẩm, tổng tiền, phí vận chuyển 0; cảnh báo mã tra cứu chỉ hiển thị một lần |
| Hành động | Sao chép/in tóm tắt, sang trang tra cứu, quay về trang chủ |
| Trạng thái | Không truy cập lại được bằng URL cũ nếu không có dữ liệu phản hồi (mã tra cứu không lưu); hướng dẫn liên hệ cửa hàng nếu khách rời trang mà chưa lưu mã (QĐ-07) |
| Responsive | Một cột trên mobile; hai cột (thông báo – tóm tắt) trên desktop |
| Tham chiếu | UC-10; 8.4; QĐ-02, QĐ-04; BR-ORD-06; 1.3.3 (giới hạn mất mã) |

#### SCR-C08 – Trang tra cứu đơn hàng

| Hạng mục | Nội dung |
| --- | --- |
| Mục tiêu | Cho khách xem trạng thái và tóm tắt đơn của mình bằng cặp mã đơn + mã tra cứu |
| Thành phần chính | Biểu mẫu nhập mã đơn, mã tra cứu; nút tra cứu; vùng kết quả (nhãn trạng thái, các dòng theo snapshot, tổng tiền, thông tin nhận hàng với số điện thoại che bớt); thông báo chung khi không khớp |
| Dữ liệu hiển thị | Chỉ dữ liệu tối thiểu của đúng đơn khách; không trả lý do hủy, ghi chú, lịch sử chi tiết (BR-ORD-17) |
| Hành động | Gửi tra cứu (mã gửi trong thân request, không đặt URL); sửa mã và gửi lại |
| Trạng thái | Đang gửi; không khớp (thông báo chung, không phân biệt sai mã đơn hay sai mã tra cứu — NL-09); vượt tần suất (thông báo chờ — NL-08); lỗi chung |
| Responsive | Một cột trên mobile; hai cột (biểu mẫu – kết quả) trên desktop |
| Tham chiếu | UC-11; 8.4; QĐ-02; SEC-11, SEC-21; NL-08, NL-09; UC-11/E5 |

### 6.2.2. Khu vực quản trị

Bảng tổng hợp:

| Mã | Tên màn hình | UC | API chính |
| --- | --- | --- | --- |
| SCR-A01 | Đăng nhập Admin | UC-12 | 8.5 |
| SCR-A02 | Dashboard | UC-13 | 8.10 |
| SCR-A03 | Quản lý sản phẩm (danh sách) | UC-15 | 8.6 |
| SCR-A04 | Form thêm/sửa sản phẩm | UC-14, UC-16 | 8.6 |
| SCR-A05 | Quản lý danh mục | UC-17 | 8.7 |
| SCR-A06 | Quản lý banner | UC-18 | 8.7 |
| SCR-A07 | Quản lý tồn kho | UC-19 | 8.8 |
| SCR-A08 | Danh sách đơn hàng | UC-20 | 8.9 |
| SCR-A09 | Chi tiết đơn hàng và cập nhật trạng thái | UC-21, UC-22 | 8.9 |

#### SCR-A01 – Đăng nhập Admin

| Hạng mục | Nội dung |
| --- | --- |
| Mục tiêu | Xác thực Admin và cấp phiên an toàn |
| Thành phần chính | Biểu mẫu email, mật khẩu; nút đăng nhập; thông báo lỗi chung; (không có đăng ký, không có quên mật khẩu tự động trong V1) |
| Dữ liệu hiển thị | Không trả thông tin về sự tồn tại của tài khoản; lỗi luôn chung “Email hoặc mật khẩu không đúng” |
| Hành động | Gửi đăng nhập; khi thành công chuyển tới Dashboard hoặc trang đã cố truy cập |
| Trạng thái | Đang gửi (vô hiệu nút); lỗi xác thực (chung); vượt tần suất (thông báo chờ); lỗi cấu hình cookie (E5 — hướng dẫn người vận hành) |
| Responsive | Một cột, biểu mẫu căn giữa trên mọi kích thước |
| Tham chiếu | UC-12; 8.5; SEC-01 → SEC-03, SEC-10, SEC-11; QĐ-08, QĐ-13 |

#### SCR-A02 – Dashboard

| Hạng mục | Nội dung |
| --- | --- |
| Mục tiêu | Tổng quan tình hình cửa hàng để Admin quyết định việc cần làm |
| Thành phần chính | Các thẻ chỉ số: số sản phẩm, số danh mục, đơn theo trạng thái, sản phẩm hết hàng, đơn Pending quá ngưỡng, tổng số lượng đang giữ; lối tắt tới các mục quản lý |
| Dữ liệu hiển thị | Chỉ số tính từ dữ liệu thực; không có chỉ số doanh thu (1.3.2); ngưỡng Pending đọc từ cấu hình (QĐ-15) |
| Hành động | Mở danh sách đơn, sản phẩm, tồn kho; không có thao tác ghi trực tiếp trên Dashboard ngoài điều hướng |
| Trạng thái | Đang tải (skeleton thẻ); lỗi (thông báo + tải lại) |
| Responsive | Mobile: thẻ xếp dọc; desktop: lưới thẻ |
| Tham chiếu | UC-13; 8.10; 2.4.7 (đơn Pending quá ngưỡng, đang giữ) |

#### SCR-A03 – Quản lý sản phẩm (danh sách)

| Hạng mục | Nội dung |
| --- | --- |
| Mục tiêu | Tìm, lọc và quản lý sản phẩm, gồm cả sản phẩm ngừng kinh doanh |
| Thành phần chính | Ô tìm kiếm (tên/slug); bộ lọc danh mục và trạng thái bán; bảng sản phẩm (ảnh đại diện, tên, danh mục, giá, trạng thái bán, tồn khả dụng); phân trang; nút “Thêm sản phẩm”; hành động trên dòng (sửa, ngừng kinh doanh, xóa vĩnh viễn nếu được phép) |
| Dữ liệu hiển thị | Khác danh sách công khai: gồm cả sản phẩm ngừng kinh doanh; hiển thị trạng thái bán và tồn khả dụng (chỉ Admin) |
| Hành động | Tìm/lọc, mở form thêm/sửa, ngừng kinh doanh, xóa vĩnh viễn (có kiểm tra ràng buộc và hộp thoại xác nhận) |
| Trạng thái | Đang tải; rỗng (gợi ý thêm sản phẩm); lỗi; xóa bị từ chối (409 — gợi ý ngừng kinh doanh) |
| Responsive | Desktop ưu tiên bảng đầy đủ; tablet ẩn bớt cột phụ; mobile dạng danh sách thẻ |
| Tham chiếu | UC-15, UC-14; 8.6; QĐ-12; BR-INV-13 |

#### SCR-A04 – Form thêm/sửa sản phẩm

| Hạng mục | Nội dung |
| --- | --- |
| Mục tiêu | Tạo hoặc cập nhật sản phẩm, thông số, bảo hành, ảnh và SEO |
| Thành phần chính | Thông tin cơ bản (tên, slug, danh mục, thương hiệu, mô tả); giá niêm yết, giá khuyến mãi; bảo hành; vùng thông số theo danh mục (khóa chuẩn hóa); SEO (title, description, keywords); tải nhiều ảnh, chọn ảnh đại diện và sắp thứ tự; trạng thái bán; trường tồn kho đầu kỳ chỉ khi tạo mới |
| Dữ liệu hiển thị | Khi sửa: tồn kho chỉ hiển thị, không cho sửa (BR-INV-13); số phiên bản bản ghi để phát hiện sửa đồng thời |
| Hành động | Lưu, hủy, tải ảnh, đổi danh mục (yêu cầu rà soát lại thông số), gỡ ảnh |
| Trạng thái | Đang gửi; lỗi theo trường (giá, slug trùng, danh mục, thông số sai kiểu/đơn vị); lỗi upload theo từng ảnh; sửa đồng thời (409, yêu cầu tải lại); phiên hết hạn (401) |
| Responsive | Mobile: một cột; desktop: nhóm trường theo khối, có thể dùng tab cho thông số/ảnh/SEO |
| Tham chiếu | UC-14, UC-16; 8.6; 2.2.2; 7.1; SEC-19; QĐ-12; 8.12 |

Ghi chú: form không nhận trường tồn kho khi sửa; mọi thay đổi tồn đi qua SCR-A07 (BR-INV-13, TH-09).

#### SCR-A05 – Quản lý danh mục

| Hạng mục | Nội dung |
| --- | --- |
| Mục tiêu | Thêm, sửa, bật/tắt và xóa danh mục |
| Thành phần chính | Danh sách danh mục (tên, slug, trạng thái, số sản phẩm); nút thêm; form sửa (tên, slug, mô tả, icon, trạng thái, SEO); cảnh báo khi đổi slug |
| Dữ liệu hiển thị | Số sản phẩm tham chiếu (kể cả ngừng kinh doanh) để quyết định xóa |
| Hành động | Thêm/sửa, bật/tắt, xóa (chỉ khi không còn sản phẩm; nếu còn trả 409 kèm gợi ý) |
| Trạng thái | Đang tải; lỗi slug trùng (409); lỗi validation (422); xóa bị từ chối (409); phiên hết hạn (401) |
| Responsive | Danh sách dạng bảng trên desktop, thẻ trên mobile |
| Tham chiếu | UC-17; 8.7; 2.2.3; QĐ-12; Phần 10 (cảnh báo đổi slug) |

#### SCR-A06 – Quản lý banner

| Hạng mục | Nội dung |
| --- | --- |
| Mục tiêu | Quản lý banner hiển thị trên trang chủ |
| Thành phần chính | Danh sách banner (ảnh thu nhỏ, tiêu đề, vị trí, trạng thái); form thêm/sửa (tiêu đề, ảnh, liên kết, vị trí, trạng thái); bật/tắt nhanh |
| Dữ liệu hiển thị | Ảnh xem trước; trạng thái bật/tắt |
| Hành động | Thêm/sửa, bật/tắt, xóa; tải ảnh lên |
| Trạng thái | Lỗi ảnh hoặc liên kết không hợp lệ (422); Cloudinary không phản hồi (báo lỗi, giữ dữ liệu, thử lại); sửa đồng thời (409) |
| Responsive | Bảng trên desktop; thẻ trên mobile |
| Tham chiếu | UC-18; 8.7; 2.2.4; SEC-19; liên kết chỉ nhận nội bộ hoặc http/https |

#### SCR-A07 – Quản lý tồn kho

| Hạng mục | Nội dung |
| --- | --- |
| Mục tiêu | Xem và điều chỉnh tồn kho có kiểm soát, có ghi nhận |
| Thành phần chính | Bảng tồn (sản phẩm, tồn khả dụng, đang giữ, tồn thực tế); lọc hết hàng; tìm theo tên; form điều chỉnh (Nhập thêm / Giảm / Đặt lại theo kiểm kê; số lượng; lý do; mã đơn liên quan); xác nhận tồn mới dự kiến; hiển thị biến động gần đây |
| Dữ liệu hiển thị | Tồn khả dụng, đang giữ (tính từ đơn chưa bàn giao), tồn thực tế = khả dụng + đang giữ; tồn đã thấy để phát hiện lỗi thời |
| Hành động | Áp dụng điều chỉnh (cập nhật nguyên tử có điều kiện); không bao giờ gửi trường tồn qua form sản phẩm |
| Trạng thái | Lỗi số lượng (422); giảm vượt tồn (409); “đặt lại” lỗi thời (409 — TH-04); C < H (409 kèm danh sách đơn đang giữ); lỗi ghi (5xx, hướng dẫn kiểm tra lại) |
| Responsive | Bảng trên desktop; thẻ trên mobile; form điều chỉnh dạng modal |
| Tham chiếu | UC-19; 8.8; 2.4.6, 2.4.8; BR-INV-13, BR-INV-14 |

#### SCR-A08 – Danh sách đơn hàng

| Hạng mục | Nội dung |
| --- | --- |
| Mục tiêu | Giúp Admin thấy và ưu tiên các đơn cần xử lý |
| Thành phần chính | Bộ lọc trạng thái; tìm theo mã đơn hoặc số điện thoại [Đề xuất]; bộ lọc nhanh “Pending quá ngưỡng”; chỉ số tổng số lượng đang giữ; bảng đơn (mã đơn, khách, tổng tiền, trạng thái, thời điểm tạo); phân trang |
| Dữ liệu hiển thị | Đơn mới nhất trước; thông tin khách đầy đủ theo quyền Admin; không ghi dữ liệu khách vào log |
| Hành động | Lọc, tìm, mở chi tiết đơn |
| Trạng thái | Đang tải; rỗng (không có đơn phù hợp); lỗi tham số lọc (422) |
| Responsive | Bảng trên desktop; thẻ trên mobile |
| Tham chiếu | UC-20; 8.9; 2.2.6, 2.4.7; QĐ-15; NFR-12 |

#### SCR-A09 – Chi tiết đơn hàng và cập nhật trạng thái

| Hạng mục | Nội dung |
| --- | --- |
| Mục tiêu | Xem đầy đủ đơn và thực hiện chuyển trạng thái hợp lệ |
| Thành phần chính | Thông tin nhận hàng; các dòng theo snapshot; tổng tiền; trạng thái hiện tại; lịch sử trạng thái; nút chuyển trạng thái (chỉ các trạng thái đích hợp lệ của trạng thái hiện tại); hộp thoại xác nhận nêu rõ ảnh hưởng tồn kho; ô lý do (bắt buộc với CĐ-03, 05, 08, 10) và ghi chú |
| Dữ liệu hiển thị | Snapshot bất biến; lý do/ghi chú/lịch sử chỉ dành cho Admin (BR-ORD-17); không có trường thanh toán |
| Hành động | Chọn trạng thái đích, nhập lý do/ghi chú, xác nhận; không cho sửa dòng, giá, tổng tiền hay thông tin nhận hàng |
| Trạng thái | Đơn không tồn tại (404); trạng thái đã đổi bởi người khác (409 — TH-05); cặp (S, T) không hợp lệ (409); thiếu lý do (422); lỗi ghi (5xx, hướng dẫn kiểm tra lại); phiên hết hạn (401) |
| Responsive | Mobile: một cột, nút chuyển trạng thái trong vùng dễ chạm; desktop: hai cột (thông tin – lịch sử và hành động) |
| Tham chiếu | UC-21, UC-22; 8.9; 2.2.7, 2.3.3 → 2.3.6; BR-ORD-08 → BR-ORD-17; TH-05, TH-08 |

## 6.3. Sơ đồ điều hướng

```
[Header chung]
 ├── Logo -> Trang chủ (SCR-C01)
 ├── Menu danh mục -> Danh sách sản phẩm (SCR-C02)
 ├── Ô tìm kiếm -> Danh sách sản phẩm với search (SCR-C02)
 ├── Liên kết giỏ hàng -> Giỏ hàng (SCR-C05)
 └── Liên kết tra cứu đơn -> Tra cứu đơn hàng (SCR-C08)

Trang chủ (SCR-C01)
 ├── Danh mục -> Danh sách sản phẩm (SCR-C02)
 ├── Sản phẩm nổi bật/mới -> Chi tiết sản phẩm (SCR-C03)
 └── Banner (liên kết nội bộ đã kiểm tra) -> đích tương ứng

Danh sách sản phẩm (SCR-C02)
 └── Thẻ sản phẩm -> Chi tiết sản phẩm (SCR-C03)

Chi tiết sản phẩm (SCR-C03)
 ├── Thêm vào giỏ -> Giỏ hàng (SCR-C05) hoặc giỏ thu gọn
 └── So sánh -> So sánh sản phẩm (SCR-C04)

So sánh sản phẩm (SCR-C04)
 ├── Quay lại chi tiết (SCR-C03)
 └── Thêm vào giỏ -> Giỏ hàng (SCR-C05)

Giỏ hàng (SCR-C05)
 └── Đặt hàng -> Biểu mẫu tạo đơn (SCR-C06)

Biểu mẫu tạo đơn (SCR-C06)
 └── Xác nhận -> Trang xác nhận đặt hàng (SCR-C07)

Trang xác nhận đặt hàng (SCR-C07)
 ├── Tra cứu đơn -> Tra cứu đơn hàng (SCR-C08)
 └── Về trang chủ (SCR-C01)

Tra cứu đơn hàng (SCR-C08)
 └── (kết quả chỉ đọc)
```

Khu vực quản trị (route /admin, yêu cầu phiên):

```
Đăng nhập (SCR-A01) -> Dashboard (SCR-A02)
 ├── Sản phẩm (SCR-A03) -> Form thêm/sửa (SCR-A04)
 ├── Danh mục (SCR-A05)
 ├── Banner (SCR-A06)
 ├── Tồn kho (SCR-A07)
 └── Đơn hàng (SCR-A08) -> Chi tiết đơn & trạng thái (SCR-A09)
```

Mọi route quản trị đi qua kiểm tra phiên (GET /api/admin/me); khi 401, chuyển về SCR-A01 và ghi nhớ trang đang xem (UC-12/A2). Route khách hàng không hiển thị liên kết tới khu vực quản trị.

## 6.4. Trạng thái giao diện dùng chung

| Trạng thái | Quy ước hiển thị | Áp dụng |
| --- | --- | --- |
| Đang tải | Skeleton hoặc spinner tại vùng nội dung; không chặn toàn trang nếu chỉ một phần đang tải | Mọi màn hình |
| Rỗng | Thông báo ngắn + hành động gợi ý (ví dụ “Giỏ hàng trống — Tiếp tục mua sắm”) | Danh sách, giỏ, so sánh, đơn hàng |
| Lỗi theo trường | Thông báo cạnh trường; viền hoặc biểu tượng lỗi; giữ dữ liệu đã nhập | Biểu mẫu khách và Admin |
| Lỗi chung | Thông báo không lộ thông tin nội bộ + nút thử lại nếu phù hợp | Mọi màn hình |
| Đang gửi | Vô hiệu nút hành động chính + chỉ báo; ngăn gửi lặp | Biểu mẫu, nút chuyển trạng thái, tải ảnh |
| Xác nhận | Hộp thoại nêu rõ hành động và hậu quả (xóa, hủy đơn, đổi trạng thái có ảnh hưởng tồn kho) | SCR-A03, SCR-A05, SCR-A06, SCR-A09 |
| Phiên hết hạn | Chuyển về đăng nhập kèm thông báo; không tự gửi lại thao tác ghi | Toàn bộ khu vực quản trị |
| Vượt tần suất | Thông báo chờ và thử lại sau (không tiết lộ chi tiết kỹ thuật) | Giỏ, tạo đơn, tra cứu, đăng nhập |

Các màn hình trong 6.2 phải được thiết kế đủ cho các trạng thái trên; QA dùng mục 12.6 và Phần 4 để kiểm thử. Màn hình nào không đặc tả được trạng thái rỗng/lỗi/đang tải thì chưa đủ điều kiện chuyển sang phát triển.