Để tích hợp hệ thống Template Registry với cơ sở dữ liệu thật (Supabase) và luồng Next.js Pages Router hiện tại, bạn cần điều chỉnh lại một chút kiến trúc kết nối. Điểm mấu chốt là tận dụng `getServerSideProps` để lấy dữ liệu `weddings` và `templates` từ database, sau đó truyền vào đúng Component giao diện.

Dưới đây là hướng dẫn chi tiết từng bước và code hoàn chỉnh để implement:

### Bước 1: Khai báo Template Registry

Tạo thư mục `templates` ở thư mục gốc (ngang hàng với `components` và `pages`). Khai báo các mẫu dựa vào trường `repo_branch` có sẵn trong bảng `templates` của bạn.

**File:** `templates/TemplateRegistry.tsx`

```tsx
import dynamic from 'next/dynamic'
import { Wedding } from '@/lib/data-service'

// Định nghĩa Props chuẩn mà mọi Template đều phải nhận
export interface TemplateProps {
  wedding: Wedding
  guestName?: string // Chỉ có ở trang riêng của khách
}

// Map 'repo_branch' từ DB với Component giao diện tương ứng
export const Templates: Record<
  string,
  {
    GeneralView: React.ComponentType<TemplateProps>
    GuestView: React.ComponentType<TemplateProps>
  }
> = {
  'theme-vintage': {
    GeneralView: dynamic(() => import('./ThemeVintage/GeneralView')),
    GuestView: dynamic(() => import('./ThemeVintage/GuestView'))
  },
  'theme-modern': {
    GeneralView: dynamic(() => import('./ThemeModern/GeneralView')),
    GuestView: dynamic(() => import('./ThemeModern/GuestView'))
  },
  // Default fallback nếu database trả về branch chưa được code
  default: {
    GeneralView: dynamic(() => import('./DefaultTheme/GeneralView')),
    GuestView: dynamic(() => import('./DefaultTheme/GuestView'))
  }
}
```

### Bước 2: Trang chung của cô dâu chú rể (Không form RSVP cá nhân)

File này sẽ query dữ liệu thông qua `slug`. Component sẽ lấy đúng thư mục giao diện dựa theo `repo_branch`.

**File:** `pages/[slug]/index.tsx`

```tsx
import { GetServerSideProps } from 'next'
import { createClient } from '@supabase/supabase-js'
import { Wedding } from '@/lib/data-service'
import { Templates } from '@/templates/TemplateRegistry'

interface Props {
  wedding: Wedding | null
  slug: string
}

export default function GeneralWeddingPage({ wedding, slug }: Props) {
  if (!wedding) {
    return <div className='text-center py-20 text-gray-500'>Không tìm thấy đám cưới với đường dẫn này.</div>
  }

  // Đọc repo_branch từ template host đã chọn, fallback về 'default'
  const branch = wedding.template?.repo_branch || 'default'

  // Trích xuất Component GeneralView
  const SelectedTemplate = Templates[branch]?.GeneralView || Templates['default'].GeneralView

  return <SelectedTemplate wedding={wedding} />
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string }

  const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )

  // Fetch data từ table weddings, join lấy luôn thông tin template host đang chọn
  const { data: weddingData, error } = await supabaseServer
    .from('weddings')
    .select('*, template:templates(*)')
    .eq('slug', slug)
    .single()

  if (error || !weddingData) {
    return { notFound: true } // Tự động trả về trang 404 của Next.js
  }

  return {
    props: {
      slug,
      wedding: {
        ...weddingData,
        content: weddingData.content || {}
      }
    }
  }
}
```

### Bước 3: Trang riêng của khách mời (Có form RSVP & Mừng cưới)

Bạn tích hợp logic decode Base64 URL-safe (đang có sẵn) kết hợp với TemplateRegistry.

**File:** `pages/[slug]/[page].tsx`

```tsx
import { GetServerSideProps } from 'next'
import { createClient } from '@supabase/supabase-js'
import { Wedding } from '@/lib/data-service'
import { Templates } from '@/templates/TemplateRegistry'

interface Props {
  wedding: Wedding | null
  guestName: string
  slug: string
}

export default function GuestWeddingPage({ wedding, guestName, slug }: Props) {
  if (!wedding) {
    return <div className='text-center py-20'>Không tìm thấy đám cưới.</div>
  }

  const branch = wedding.template?.repo_branch || 'default'
  // Dùng GuestView để render (Component này bên trong sẽ gọi <RSVPForm />)
  const SelectedTemplate = Templates[branch]?.GuestView || Templates['default'].GuestView

  return <SelectedTemplate wedding={wedding} guestName={guestName} />
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug, page } = context.params as { slug: string; page: string }

  // Decode Base64 lấy tên khách mời
  let guestName = page
  try {
    const base64 = page.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '=='.slice(0, (4 - (base64.length % 4)) % 4)
    guestName = decodeURIComponent(escape(atob(padded)))
  } catch {
    guestName = page
  }

  const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )

  const { data: weddingData, error } = await supabaseServer
    .from('weddings')
    .select('*, template:templates(*)')
    .eq('slug', slug)
    .single()

  if (error || !weddingData) {
    return { notFound: true }
  }

  return {
    props: {
      slug,
      guestName,
      wedding: {
        ...weddingData,
        content: weddingData.content || {}
      }
    }
  }
}
```

### Bước 4: Dựng code thực tế cho 1 Style

Đây là cách bạn build phần UI của từng Template độc lập, sử dụng lại các Component hệ thống (như `RSVPForm`, `MoneyGift`, `Wishes`) và nhúng dữ liệu `content` từ database.

**File:** `templates/ThemeVintage/GeneralView.tsx`

```tsx
import { TemplateProps } from '../TemplateRegistry'
import Wishes from '@/components/guest/Wishes'

export default function ThemeVintageGeneral({ wedding }: TemplateProps) {
  const { content } = wedding
  const coverImage = content.images?.[0] || '/images/default-cover.jpg'

  return (
    <div className='bg-[#fcf9f2] min-h-screen font-serif text-[#4a4a4a]'>
      {/* Banner */}
      <section className='relative h-screen flex items-center justify-center'>
        <img
          src={coverImage}
          alt='Cover'
          className='absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply'
        />
        <div className='relative z-10 text-center space-y-6'>
          <p className='tracking-widest uppercase text-sm'>Save the Date</p>
          <h1 className='text-6xl italic'>
            {content.groom_name} & {content.bride_name}
          </h1>
          <p className='text-xl'>{content.wedding_date}</p>
        </div>
      </section>

      {/* Lời chúc chung */}
      <section className='py-20 px-4'>
        <Wishes weddingId={wedding.id} />
      </section>
    </div>
  )
}
```

**File:** `templates/ThemeVintage/GuestView.tsx`

```tsx
import { TemplateProps } from '../TemplateRegistry'
import RSVPForm from '@/components/guest/RSVPForm'
import MoneyGift from '@/components/guest/MoneyGift'

export default function ThemeVintageGuest({ wedding, guestName }: TemplateProps) {
  const { content } = wedding

  return (
    <div className='bg-[#fcf9f2] min-h-screen font-serif text-[#4a4a4a]'>
      {/* Lời mời đích danh */}
      <section className='py-20 text-center px-4'>
        <h2 className='text-3xl mb-4'>Thân mời</h2>
        <div className='inline-block px-8 py-3 bg-white border border-[#d4c5b9] rounded-xl text-2xl font-bold text-[#8c7362] shadow-sm'>
          {guestName}
        </div>
        <p className='mt-6 text-lg max-w-lg mx-auto leading-relaxed'>
          Đến dự buổi tiệc chung vui cùng {content.groom_name} và {content.bride_name} vào lúc {content.wedding_time}{' '}
          ngày {content.wedding_date}.
        </p>
        <p className='mt-2 text-gray-500'>{content.address}</p>
      </section>

      {/* Component Form Xác Nhận tham dự */}
      <section className='py-10'>
        <RSVPForm weddingId={wedding.id} />
      </section>

      {/* Component QR Mừng Cưới */}
      <section className='py-10 pb-20'>
        <MoneyGift content={content} guestName={guestName} />
      </section>
    </div>
  )
}
```

Kiến trúc này đảm bảo data logic tập trung hoàn toàn ở Router của `pages/` và xử lý giao diện (UI) cô lập hoàn toàn trong thư mục `templates/`. Việc host bấm xem trước (Preview) ở môi trường CMS/Studio vẫn có thể tái sử dụng chính các Component ở `templates/Theme.../GeneralView` bằng cách đẩy dữ liệu giả lập (Mock object khớp interface `Wedding`) mà không cần thay đổi một dòng code nào trong file giao diện.
