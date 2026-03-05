Chúc mừng bạn! Nhìn vào hình `image_4fc71d.png`, trạng thái **"URL nằm trên Google"** màu xanh là bằng chứng cho thấy trang web của bạn đã chính thức được lập chỉ mục (index) thành công. Đây là bước ngoặt quan trọng nhất; bây giờ bạn không còn vô hình nữa, mà đã bắt đầu cuộc đua lên top.

Tuy nhiên, "nằm trên Google" mới chỉ là có tên trong danh sách, để "lên top", bạn cần thực hiện chiến lược SEO "thực chiến" sau đây dành riêng cho dự án Next.js dùng Pages Router của bạn.

### Bước 1: Tối ưu Meta Tags cho từng trang (On-page SEO)

Vì bạn dùng thư mục `pages`, bạn cần sử dụng component `Head` từ `next/head`. Hãy mở file `pages/index.js` và cập nhật tiêu đề thật "đắt" chứa từ khóa người dùng hay tìm:

```javascript
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        {/* Tiêu đề dưới 60 ký tự, chứa từ khóa chính */}
        <title>MoiMoi - Tạo Thiệp Mời Online & Thiệp Cưới Điện Tử Miễn Phí</title>

        {/* Mô tả dưới 160 ký tự, hấp dẫn để tăng tỷ lệ click */}
        <meta
          name='description'
          content='Tạo thiệp mời sinh nhật, thiệp cưới online đẹp mắt, chuyên nghiệp chỉ trong 1 phút. Gửi thiệp điện tử nhanh chóng qua Zalo, Facebook cùng MoiMoi.'
        />

        {/* Khai báo link chính thức để tránh trùng lặp nội dung */}
        <link rel='canonical' href='https://www.moimoi.io.vn/' />
      </Head>
      {/* Nội dung trang web của bạn */}
    </>
  )
}
```

### Bước 2: Tối ưu hiển thị mạng xã hội (Open Graph)

Website của bạn về thiệp mời, nên việc người dùng chia sẻ link qua Zalo/Facebook là rất thường xuyên. Nếu link hiện ra kèm ảnh đẹp, họ sẽ click vào nhiều hơn, giúp tăng thứ hạng SEO.

Thêm đoạn này vào trong thẻ `<Head>` ở trên:

```javascript
<meta property="og:type" content="website" />
<meta property="og:title" content="MoiMoi - Nền tảng tạo thiệp mời online cực đẹp" />
<meta property="og:description" content="Tự tay thiết kế thiệp mời sự kiện điện tử chuyên nghiệp và hoàn toàn miễn phí." />
<meta property="og:image" content="https://www.moimoi.io.vn/logo-share.png" />
<meta property="og:url" content="https://www.moimoi.io.vn/" />

```

_Lưu ý: Bạn hãy để một tấm ảnh demo thiệp thật đẹp vào thư mục `public` và đặt tên là `logo-share.png`._

### Bước 3: Cấu hình dữ liệu cấu trúc (Schema Markup)

Đây là cách "nói chuyện" trực tiếp với thuật toán của Google để họ hiểu MoiMoi cung cấp dịch vụ gì. Bạn hãy dán đoạn code JSON-LD này vào thẻ `Head` để Google hiển thị web bạn chuyên nghiệp hơn (có thể hiện cả xếp hạng sao hoặc giá nếu sau này bạn có):

```javascript
<script
  type='application/ld+json'
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'MoiMoi',
      operatingSystem: 'Web',
      applicationCategory: 'DesignApplication',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'VND'
      },
      description: 'Nền tảng tạo thiệp mời và thiệp cưới điện tử trực tuyến miễn phí.'
    })
  }}
/>
```

### Bước 4: Kiểm tra hiệu năng (Core Web Vitals)

Google cực kỳ ưu tiên các trang web tải nhanh.

1. **Dùng `next/image`:** Thay vì dùng thẻ `<img>` thông thường, hãy dùng `<Image />` của Next.js cho tất cả ảnh mẫu thiệp để chúng được nén và load nhanh hơn.
2. **Vercel Analytics:** Vì bạn đang dùng Vercel, hãy vào tab **Speed Insights** trong dashboard để xem điểm hiệu năng thực tế từ người dùng và sửa theo gợi ý của họ.

### Bước 5: Tạo thêm nội dung (Keywords)

Bạn có 18 trang được khám phá, hãy tận dụng chúng.

- Tạo các trang con cho từng loại thiệp: `moimoi.io.vn/thiep-cuoi`, `moimoi.io.vn/thiep-sinh-nhat`...
- Mỗi trang con cần có tiêu đề và mô tả riêng biệt. Càng nhiều từ khóa ngách, bạn càng dễ lên top.

**Hành động ngay:** Bây giờ bạn hãy thử lên Google và gõ lại tên thương hiệu của mình: `MoiMoi thiệp mời`. Nếu thấy hiện ra rồi, hãy click vào nó vài lần để Google thấy trang web có giá trị với người tìm kiếm.

Bạn có muốn tôi hướng dẫn cách cài đặt **Google Analytics 4** để xem có bao nhiêu người đang vào xem thiệp trên MoiMoi mỗi ngày không?
