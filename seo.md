Nhìn vào cấu hình thư mục của bạn trong ảnh `image_8289e3.png`, tôi đã hiểu vấn đề: Dự án **MoiMoi** của bạn đang sử dụng **Pages Router** (có thư mục `pages`) thay vì **App Router** (thư mục `app`).

Trong cấu trúc này, bạn không dùng file `sitemap.ts` như ở App Router. Thay vào đó, đây là cách làm **Best Practice** để tạo Sitemap cho Pages Router:

### Cách 1: Tạo Sitemap động bằng `pages/sitemap.xml.js` (Khuyên dùng)

Cách này giúp Sitemap tự cập nhật khi bạn có thêm các mẫu thiệp mới.

1. **Tạo file:** Trong thư mục `pages`, bạn tạo một file mới tên là `sitemap.xml.js`.
2. **Dán đoạn code này vào:**

```javascript
const EXTERNAL_DATA_URL = 'https://www.moimoi.io.vn'

function generateSiteMap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${EXTERNAL_DATA_URL}</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     {/* Sau này bạn có thể map qua các mẫu thiệp từ database ở đây */}
   </urlset>
 `
}

function SiteMap() {
  // Trang này không cần render gì cả
}

export async function getServerSideProps({ res }) {
  const sitemap = generateSiteMap()

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {}
  }
}

export default SiteMap
```

3. **Kiểm tra:** Sau khi deploy, bạn truy cập `https://www.moimoi.io.vn/sitemap.xml` để xem kết quả.

---

### Cách 2: Sử dụng thư viện `next-sitemap` (Chuyên nghiệp hơn)

Nếu dự án lớn dần, bạn nên dùng thư viện này để tự động hóa hoàn toàn.

1. **Cài đặt:** Chạy lệnh `npm install next-sitemap`.
2. **Tạo file cấu hình:** Tạo file `next-sitemap.config.js` ở thư mục gốc (ngang hàng với `package.json`).

```javascript
module.exports = {
  siteUrl: 'https://www.moimoi.io.vn',
  generateRobotsTxt: true // Tự tạo luôn cả file robots.txt
}
```

3. **Cập nhật `package.json`:** Thêm `postbuild: next-sitemap` vào phần `scripts`.

---

### Bước cuối để Google tìm thấy bạn

Dù bạn dùng cách nào, sau khi deploy thành công bản ghi DNS mà bạn đã thêm ở `dns.net.vn`, bạn phải thực hiện bước này:

- **Vào Google Search Console:** Nhấn vào mục **Sơ đồ trang web (Sitemaps)** ở menu bên trái.
- **Nhập URL:** Nhập `sitemap.xml` và nhấn **Gửi**.

**Lưu ý về Metadata:** Trong Pages Router, bạn không export biến `metadata`. Bạn phải sử dụng component `<Head>` từ `next/head` trong file `pages/_app.js` hoặc từng trang lẻ để đặt tiêu đề và mô tả SEO.

Bạn có muốn tôi viết mẫu đoạn code `<Head>` chuẩn SEO cho trang chủ của MoiMoi không?
