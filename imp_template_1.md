Cách bạn tư duy chia làm 2 file như vậy là **hoàn toàn hợp lý và đúng chuẩn** cho một hệ thống thiệp cưới online.

Cụ thể:

1. `pages/[slug]/index.tsx`: Link chung (ví dụ: `moimoi.vn/le-cuoi-hung-mai`). Dành cho tất cả mọi người, không có form RSVP cá nhân hóa, hiển thị lời chúc chung.
2. `pages/[slug]/[guestId].tsx` (bạn đang gọi là `[page].tsx`, nhưng nên đổi tên thành `[guestId]` hoặc `[inviteCode]` cho rõ nghĩa): Link riêng mớm cho từng khách (ví dụ: `moimoi.vn/le-cuoi-hung-mai/khach-moi-a`). Link này định danh được người mở, nên sẽ hiển thị form RSVP để họ xác nhận số lượng đi kèm.

Để giải quyết bài toán **nhiều Template (Style) và chức năng Preview**, bạn cần áp dụng pattern **Component Registry (hoặc Component Mapping)**. Dưới đây là cách triển khai chi tiết:

### 1. Kiến trúc thư mục Template

Thay vì viết toàn bộ giao diện vào file trong `pages/`, bạn hãy tách các giao diện ra một thư mục `templates/` riêng. Mỗi template sẽ chịu trách nhiệm render giao diện dựa trên dữ liệu được truyền vào.

```text
/templates
  /Template01 (Giao diện Cổ điển)
    - GeneralView.tsx (Dùng cho trang chung)
    - GuestView.tsx   (Dùng cho trang khách mời có RSVP)
  /Template02 (Giao diện Hiện đại)
    - GeneralView.tsx
    - GuestView.tsx
  /TemplateRegistry.tsx

```

### 2. Tạo Template Registry

Đây là nơi bạn "đăng ký" các template với hệ thống. Nó giống như một cuốn từ điển, khi bạn tra `templateId`, nó sẽ trả về đúng bộ Component tương ứng.

```tsx
// templates/TemplateRegistry.tsx
import dynamic from 'next/dynamic'

// Khai báo kiểu dữ liệu chung mà mọi template đều phải nhận
export interface WeddingData {
  brideName: string
  groomName: string
  weddingDate: string
  wishes: any[]
  // ... các thông tin khác
}

export interface GuestData {
  guestName: string
  isAttending?: boolean
  // ...
}

// Map các template ID với Component
export const Templates = {
  'classic-01': {
    GeneralView: dynamic(() => import('./Template01/GeneralView')),
    GuestView: dynamic(() => import('./Template01/GuestView'))
  },
  'modern-02': {
    GeneralView: dynamic(() => import('./Template02/GeneralView')),
    GuestView: dynamic(() => import('./Template02/GuestView'))
  }
  // Thêm các template khác vào đây...
}

export type TemplateId = keyof typeof Templates
```

_Lưu ý: Dùng `dynamic` của Next.js giúp hệ thống chỉ tải code của template được chọn, không tải toàn bộ mọi template cùng lúc, giúp web nhẹ và mượt hơn._

### 3. Xử lý hiển thị ở thư mục Pages

Bây giờ, file trong thư mục `pages/` của bạn chỉ đóng vai trò là "Người điều phối" (Lấy data từ database -> Chọn Template -> Hiển thị).

**Trang chung (`pages/[slug]/index.tsx`):**

```tsx
import { GetServerSideProps } from 'next'
import { Templates, TemplateId, WeddingData } from '@/templates/TemplateRegistry'

interface Props {
  weddingData: WeddingData
  templateId: TemplateId
}

export default function GeneralWeddingPage({ weddingData, templateId }: Props) {
  // Trích xuất đúng template mà host đã chọn từ Registry
  const SelectedTemplate = Templates[templateId]?.GeneralView || Templates['classic-01'].GeneralView // fallback

  return <SelectedTemplate data={weddingData} />
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string }

  // Gọi API hoặc query Database để lấy thông tin đám cưới và templateId host đã chọn
  // const data = await getWeddingBySlug(slug);

  return {
    props: {
      weddingData: data.weddingInfo,
      templateId: data.templateId // ví dụ: 'modern-02'
    }
  }
}
```

Trang khách mời `pages/[slug]/[guestId].tsx` cũng làm tương tự, nhưng sẽ render `Templates[templateId].GuestView` và truyền thêm form RSVP.

### 4. Giải quyết bài toán Preview cho Host

Để host có thể coi trước khi chọn, bản chất là bạn đang render chính các Component trong Registry, nhưng thay vì truyền data thật từ Database, bạn **truyền Mock Data (dữ liệu giả)**.

Bạn có thể tạo một trang riêng: `pages/studio/preview/[templateId].tsx`

```tsx
import { useRouter } from 'next/router'
import { Templates, TemplateId } from '@/templates/TemplateRegistry'

// Dữ liệu giả định để host hình dung được thiệp
const MOCK_WEDDING_DATA = {
  brideName: 'Nguyễn Thị Mai',
  groomName: 'Trần Văn Hùng',
  weddingDate: '2026-12-12',
  wishes: ['Chúc hai bạn trăm năm hạnh phúc!']
}

export default function PreviewPage() {
  const router = useRouter()
  const templateId = router.query.templateId as TemplateId

  if (!templateId || !Templates[templateId]) return <div>Đang tải preview...</div>

  const PreviewComponent = Templates[templateId].GeneralView

  return (
    <div className='preview-container'>
      {/* Thanh công cụ ở trên để host bấm "Chọn Template này" */}
      <div className='fixed top-0 w-full bg-white p-4 shadow-md z-50 flex justify-between'>
        <h2>Đang xem trước: {templateId}</h2>
        <button onClick={() => saveTemplateToDB(templateId)}>Sử dụng Template này</button>
      </div>

      {/* Render giao diện thiệp bên dưới */}
      <div className='mt-16'>
        <PreviewComponent data={MOCK_WEDDING_DATA} />
      </div>
    </div>
  )
}
```

**Tóm tắt luồng hoạt động:**

1. Là một Dev, mỗi khi bạn code xong 1 Style mới, bạn cho vào thư mục `templates/`, sau đó vào file `TemplateRegistry.tsx` khai báo tên nó.
2. Host vào trang Studio, bấm xem các mẫu thiệp. Hệ thống trỏ tới `/preview/ten-mau` -> Hiện giao diện với Mock Data.
3. Host bấm chọn -> Lưu `templateId` (ví dụ: `modern-02`) vào Database của đám cưới đó.
4. Khi khách mời truy cập link `/[slug]`, Next.js đọc Database thấy `modern-02`, tự động móc đúng code giao diện `modern-02` ra để hiển thị dữ liệu thật.
