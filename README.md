# QR Generator – Tạo Mã QR Miễn Phí, Nhanh Chóng & Không Quảng Cáo

Website tạo mã QR tĩnh (Static QR Code) chuyên nghiệp, hiện đại và bảo mật cao. Ứng dụng hoạt động 100% Client-Side trực tiếp trên trình duyệt, không thông qua máy chủ trung gian, không chứa quảng cáo, không theo dõi người dùng và sẵn sàng triển khai 1-click lên [Vercel](https://vercel.com).

![QR Generator Preview](public/favicon.svg)

---

## 🌟 Tính Năng Nổi Bật

### 1. 100% Static QR Code (Tuyệt Đối Không Dùng Dynamic QR)
- **Mã hóa dữ liệu trực tiếp:** Toàn bộ nội dung bạn nhập (URL, Email, SĐT, Wi-Fi, Văn bản) được nhúng trực tiếp vào ma trận điểm của mã QR.
- **Không qua máy chủ trung gian:** Khi quét mã bằng camera điện thoại, thiết bị sẽ mở thẳng nội dung gốc, tuyệt đối không bị chuyển hướng qua các trang web quảng cáo hay link rút gọn bên thứ ba.
- **Tồn tại vĩnh viễn:** Mã không có hạn sử dụng, không bị khóa sau thời gian dùng thử và không phụ thuộc vào bất kỳ dịch vụ máy chủ nào.
- **Hoạt động Offline (PWA):** Ứng dụng hỗ trợ Service Worker và Web App Manifest, cho phép tạo mã QR ngay cả khi không có kết nối Internet sau lần tải đầu tiên.

### 2. Hỗ Trợ Đa Dạng Loại Dữ Liệu
- 🌐 **URL (Website):** Tự động kiểm tra tính hợp lệ client-side, gợi ý bổ sung tiền tố `https://` thông minh.
- 📶 **Wi-Fi:** Sinh chuẩn IEEE `WIFI:S:...;T:WPA;P:...;;`. Hỗ trợ bật/tắt xem mật khẩu, mạng ẩn (Hidden SSID). Quét là kết nối ngay.
- ✉️ **Email:** Soạn sẵn địa chỉ người nhận, tiêu đề thư và nội dung mẫu (chuẩn `mailto:`).
- 📞 **Số điện thoại:** Định dạng chuẩn `tel:`, bấm quét là thực hiện cuộc gọi trực tiếp.
- 📝 **Văn bản thuần túy (Plain text):** Nhập tin nhắn, ghi chú, mã giảm giá với hỗ trợ Unicode Tiếng Việt đầy đủ.

### 3. Tùy Biến Thẩm Mỹ & Đảm Bảo Khả Năng Quét
- 🎨 **Màu sắc linh hoạt:** Tự do chọn màu nét (Foreground) và màu nền (Background) bằng Color Picker hoặc bảng màu tuyển chọn (Đen cổ điển, Navy, Ruby, Emerald...).
- ⚠️ **Hệ thống đánh giá độ tương phản (WCAG):** Tự động tính toán tỷ lệ tương phản giữa màu nét và màu nền. Nếu độ tương phản quá thấp (< 3:1), hệ thống sẽ cảnh báo trực quan để bạn đổi màu, tránh trường hợp in ra không quét được.
- 🖼️ **Chèn Logo trung tâm:**
  - Hỗ trợ tải logo cá nhân (PNG, JPG, SVG, WebP) hoặc chọn nhanh icon mẫu.
  - Tự động bo góc và vẽ lớp viền đệm bảo vệ (padding badge) để các mắt QR không bị lem vào logo.
  - Tự động kích hoạt mức sửa lỗi tối đa **High (H - 30%)** để mã vẫn quét nhạy 100%.

### 4. Xuất File Đa Định Dạng & In Ấn Chuyên Nghiệp
- 📥 **Tải PNG độ phân giải cao:** Chọn độ phân giải từ 256px đến 2048px (phù hợp in standee, poster lớn).
- 📐 **Tải SVG (Vector độc lập):** Tạo file vector SVG chuẩn W3C, tự động nhúng logo base64. Phóng to vô hạn không vỡ nét cho các xưởng in quảng cáo.
- 📋 **Sao chép tức thì:**
  - *Sao chép QR:* Copy trực tiếp ảnh mã QR dạng binary image blob vào Clipboard máy tính.
  - *Sao chép link:* Copy chuỗi nội dung thô đã mã hóa.
- 🖨️ **In mã QR (`window.print()`):** Giao diện in chuyên biệt (`@media print`), tự động ẩn các thanh điều khiển UI, chỉ in mã QR sắc nét kèm thông tin tóm tắt và hướng dẫn quét trên trang giấy.

### 5. Lịch Sử Cục Bộ & Quyền Riêng Tư
- 🕒 **Lịch sử gần đây (10 mã):** Lưu tạm thời trong `localStorage` của trình duyệt. Cho phép nạp lại cấu hình chỉ với 1 cú click, xóa từng mục hoặc xóa tất cả.
- 🛡️ **Quyền riêng tư tối đa:** Không tích hợp Google Analytics, Facebook Pixel, tracking script, cookies quảng cáo.

### 6. Giao Diện Người Dùng & Dark Mode
- Phong cách **Modern SaaS Minimalist** chuẩn chỉ, bo góc 12-16px, font chữ Inter / Outfit hiện đại.
- Hỗ trợ 3 chế độ giao diện: **Sáng (Light)**, **Tối (Dark)**, và **Hệ thống (System)**.
- Tương thích hoàn hảo trên Desktop (2 cột song song), Tablet và Mobile (1 cột responsive).

---

## 🛠️ Công Nghệ Sử Dụng

- **Core:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Bundler:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [lucide-react](https://lucide.dev/)
- **QR Engine:** [qrcode](https://www.npmjs.com/package/qrcode) (Client-side Canvas & SVG renderer)
- **Deployment:** [Vercel](https://vercel.com/) (Kèm file `vercel.json` chuẩn SPA)

---

## 📁 Cấu Trúc Thư Mục

```
├── public/
│   ├── favicon.svg             # Favicon vector
│   ├── icon-192.png            # PWA icon 192x192
│   ├── icon-512.png            # PWA icon 512x512
│   ├── manifest.webmanifest    # Web App Manifest
│   ├── robots.txt              # SEO robots config
│   ├── sitemap.xml             # SEO sitemap
│   └── sw.js                   # Service worker hỗ trợ offline
├── src/
│   ├── components/
│   │   ├── Header.tsx          # Navigation, theme toggle, mobile menu
│   │   ├── Hero.tsx            # Hero banner giới thiệu tính năng
│   │   ├── QRGenerator.tsx     # Workspace 2 cột (Left: Input/Customizer, Right: Preview)
│   │   ├── QRTypeSelector.tsx  # Bộ chọn loại dữ liệu (URL, Text, Email, Phone, Wi-Fi)
│   │   ├── QRInputForms/       # Form nhập liệu cho từng kiểu dữ liệu
│   │   │   ├── UrlForm.tsx     # Kiểm tra URL & tự động prefix https://
│   │   │   ├── TextForm.tsx    # Nhập văn bản & bộ đếm ký tự
│   │   │   ├── EmailForm.tsx   # Email, Tiêu đề & Nội dung
│   │   │   ├── PhoneForm.tsx   # Số điện thoại
│   │   │   └── WifiForm.tsx    # Tên Wi-Fi, mật khẩu (ẩn/hiện) & mã hóa
│   │   ├── QRCustomizer.tsx    # Tùy chỉnh màu sắc, kích thước, mức sửa lỗi
│   │   ├── LogoUploader.tsx    # Tải logo, chọn icon mẫu, thanh trượt kích thước
│   │   ├── QRPreview.tsx       # Live preview lớn, sắc nét
│   │   ├── DownloadButtons.tsx # Nút tải PNG, SVG, Sao chép QR, In QR
│   │   ├── PrintView.tsx       # Layout chuyên biệt cho in giấy @media print
│   │   ├── QRHistory.tsx       # Lịch sử 10 mã gần nhất (localStorage)
│   │   ├── GuideSection.tsx    # Cẩm nang in ấn vật lý (standee, danh thiếp...)
│   │   ├── PrivacySection.tsx  # Cam kết bảo mật & so sánh Static vs Dynamic QR
│   │   ├── Toast.tsx           # Thông báo toast nổi
│   │   └── Footer.tsx          # Chân trang, điều khoản & bản quyền
│   ├── lib/
│   │   ├── qr.ts               # Xử lý render Canvas, xuất SVG vector & PNG Blob
│   │   ├── validation.ts       # Kiểm tra dữ liệu đầu vào client-side
│   │   ├── contrast.ts         # Tính tỷ lệ tương phản WCAG & cảnh báo quét
│   │   ├── wifi.ts             # Sinh chuỗi payload Wi-Fi chuẩn MeCard
│   │   └── storage.ts          # Quản lý localStorage an toàn
│   ├── types/
│   │   └── qr.ts               # Định nghĩa kiểu dữ liệu TypeScript
│   ├── App.tsx                 # Root Component điều phối trạng thái
│   ├── index.css               # Tailwind CSS & Print styles
│   └── main.tsx                # Entry point React
├── index.html                  # Thẻ meta SEO, Open Graph & fonts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vercel.json                 # Cấu hình Vercel rewrite & security headers
└── README.md
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Local

### Yêu Cầu Hệ Thống
- Đã cài đặt **Node.js** (Khuyên dùng Node 18 trở lên).
- Trình quản lý gói **npm** hoặc **pnpm** / **yarn**.

### Các Bước Thực Hiện

1. **Clone hoặc mở thư mục dự án:**
   ```bash
   cd "c:\Person Project\Link To Qr"
   ```

2. **Cài đặt các gói phụ thuộc:**
   ```bash
   npm install
   ```

3. **Khởi chạy môi trường phát triển (Local Dev Server):**
   ```bash
   npm run dev
   ```
   Mở trình duyệt và truy cập: `http://localhost:3000/`

4. **Kiểm tra TypeScript & Build bản Production:**
   ```bash
   npm run build
   ```
   Kết quả biên dịch sẽ nằm trong thư mục `dist/` sạch sẽ, sẵn sàng triển khai.

5. **Xem trước bản Build (Preview):**
   ```bash
   npm run preview
   ```

---

## ☁️ Hướng Dẫn Triển Khai Lên Vercel

Dự án đã được cấu hình sẵn file `vercel.json` tối ưu cho Single Page Application (SPA) với đầy đủ Security Headers và cấu hình Clean URLs.

### Cách 1: Triển khai qua Vercel Dashboard (Khuyên dùng)
1. Đẩy mã nguồn lên kho lưu trữ **GitHub** hoặc **GitLab** của bạn:
   ```bash
   git init
   git add .
   git commit -m "feat: complete modern static QR Generator"
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. Đăng nhập vào [Vercel](https://vercel.com).
3. Bấm **"Add New..."** ➔ **"Project"**.
4. Chọn kho lưu trữ vừa tạo và nhấn **"Import"**.
5. Cấu hình dự án (Vercel sẽ tự động phát hiện Vite):
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
6. Nhấn **"Deploy"**. Trong chưa đầy 1 phút, website của bạn sẽ hoạt động trên tên miền miễn phí `.vercel.app`.

### Cách 2: Triển khai bằng Vercel CLI
```bash
npm i -g vercel
vercel
```
Làm theo các hướng dẫn trên dòng lệnh để hoàn tất quá trình deploy.

---

## 🔒 Cam Kết Bảo Mật & Bản Quyền

- 100% Client-side: Không có dữ liệu nào được lưu trữ hay gửi lên máy chủ.
- Không Dynamic QR: Không chuyển hướng link qua dịch vụ bên thứ ba.
- Giấy phép mã nguồn mở ISC. Bạn có thể tự do tùy biến và tích hợp vào các dự án cá nhân hoặc thương mại.
