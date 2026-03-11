# 💌 MoiMoi — Nền tảng Thiệp Cưới Điện Tử

**MoiMoi** là ứng dụng web giúp các cặp đôi tạo và chia sẻ thiệp cưới điện tử đẹp, hiện đại — chỉ trong vài phút. Hỗ trợ QR tiền mừng, RSVP, album ảnh, nhạc nền và nhiều tính năng khác.

🌐 **Live:** [moimoi.io.vn](https://www.moimoi.io.vn)

---

## ✨ Tính năng nổi bật

- 🎨 **Chọn mẫu thiệp** — Thư viện nhiều mẫu thiệp đẹp, phong cách khác nhau
- ✏️ **Studio chỉnh sửa** — Tùy chỉnh thông tin, album ảnh, màu sắc, nhạc nền
- 📷 **Album ảnh cưới** — Upload & quản lý ảnh với chỉnh vị trí focal point + zoom
- 💸 **QR Tiền mừng** — Upload ảnh mã QR chuyển khoản trực tiếp vào thiệp
- 🎵 **Nhạc nền** — Chọn nhạc phát tự động khi khách mở thiệp
- 📋 **Quản lý khách mời (RSVP)** — Thu thập phản hồi xác nhận tham dự
- 🗺️ **Bản đồ chỉ đường** — Nhúng Google Maps vào thiệp
- 🔒 **Bảo mật** — Xác thực Supabase, Row Level Security, thiệp riêng tư/công khai
- ☁️ **Lưu trữ ảnh Cloudinary** — Upload và tối ưu ảnh tự động
- 📦 **Gói dịch vụ** — Hệ thống gói & thanh toán tích hợp VNPay

---

## 🛠 Tech Stack

| Lớp | Công nghệ |
|-----|-----------|
| Framework | [Next.js 13](https://nextjs.org/) (Pages Router) |
| Ngôn ngữ | TypeScript |
| Styling | Tailwind CSS |
| Database & Auth | [Supabase](https://supabase.com/) (PostgreSQL + Row Level Security) |
| Lưu trữ ảnh | [Cloudinary](https://cloudinary.com/) |
| Thanh toán | [VNPay](https://vnpay.vn/) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Icons | [Lucide React](https://lucide.dev/) |
| QR Code | [qrcode](https://github.com/soldair/node-qrcode) |
| Deploy | [Vercel](https://vercel.com/) |

---

## 🚀 Cài đặt & Chạy local

### Yêu cầu

- Node.js >= 18
- npm hoặc yarn
- Tài khoản Supabase
- Tài khoản Cloudinary

### 1. Clone & cài dependencies

```bash
git clone <repo-url>
cd moimoi_std
npm install
```

### 2. Cấu hình biến môi trường

Tạo file `.env` từ mẫu:

```bash
cp .env.example .env
```

Điền các giá trị sau vào `.env`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# VNPay (tuỳ chọn)
VNPAY_TMN_CODE=your_tmn_code
VNPAY_HASH_SECRET=your_hash_secret
```

### 3. Khởi chạy

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

---

## 📁 Cấu trúc thư mục

```
moimoi_std/
├── components/
│   ├── studio/          # Các tab chỉnh sửa (TabAlbum, TabQR, TabInfo, TabStyle...)
│   ├── landing/         # Trang chủ (Hero, Features, Pricing, TemplateGallery...)
│   ├── guest/           # Giao diện khách mời xem thiệp
│   └── ui/              # UI components dùng chung (Toast, Modal...)
├── pages/
│   ├── [slug]/          # Trang thiệp công khai
│   ├── studio/          # Dashboard, editor, guests, upgrade...
│   ├── api/             # API routes (upload, templates, RSVP, payment...)
│   └── index.tsx        # Landing page
├── lib/                 # Utilities (Supabase client, image processor, data service...)
├── templates/           # Template themes
├── styles/              # Tailwind CSS
└── types/               # TypeScript types
```

---

## 📜 Scripts

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Chạy dev server (Next.js + Tailwind watch) |
| `npm run build` | Build production + generate sitemap |
| `npm run start` | Chạy production server |
| `npm run lint` | Kiểm tra linting |
| `npm run format` | Format code với Prettier |

---

## 🗄 Database (Supabase)

Dự án sử dụng PostgreSQL qua Supabase với **Row Level Security** để bảo vệ dữ liệu. Mỗi người dùng chỉ có thể xem và chỉnh sửa thiệp của chính mình.

Các bảng chính: `weddings`, `rsvps`, `templates`, `packages`, `orders`, `musics`

Xem schema chi tiết tại: [`sql_schema.md`](./sql_schema.md)

---

## ☁️ Deploy lên Vercel

1. Push code lên GitHub
2. Import repo vào [Vercel](https://vercel.com/)
3. Cấu hình **Environment Variables** (tương tự file `.env` ở trên)
4. Deploy 🚀

---

## 👨‍💻 Tác giả

Được xây dựng với ❤️ — [moimoi.io.vn](https://www.moimoi.io.vn)
