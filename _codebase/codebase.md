# Project Export

## Project Statistics

- Total files: 63

## Folder Structure

```
components
  common
    Pagination.tsx
  guest
    MoneyGift.tsx
    RSVPForm.tsx
    Wishes.tsx
  landing
    Features.tsx
    Footer.tsx
    Header.tsx
    Hero.tsx
    Pricing.tsx
    TemplateGallery.tsx
  studio
    LivePreview.tsx
    StudioEmptyState.tsx
    StudioLayout.tsx
    StudioLoading.tsx
    TabAlbum.tsx
    TabBank.tsx
    TabInfo.tsx
  TodoList.tsx
  ui
    ToastProvider.tsx
constants
  roles.ts
lib
  data-service.ts
  image-processor.ts
  initSupabase.ts
  mock-service.ts
  package-service.ts
  plan-store.ts
  schema.ts
  useWedding.ts
pages
  admin
    index.tsx
  api
    create-payment.ts
    create-wedding.ts
    delete-image.ts
    get-packages.ts
    hello.ts
    packages
      [id].ts
    packages.ts
    save-packages.ts
    templates
      [id].ts
    templates.ts
    trigger-deploy.ts
    upload-image.ts
    vnpay-return.ts
  care
    index.tsx
  finance
    index.tsx
  index.tsx
  studio
    editor.tsx
    guests.tsx
    index.tsx
    login.tsx
    payment-result.tsx
    settings.tsx
    templates
      add.tsx
      index.tsx
      [id]
        [action].tsx
    upgrade
      add.tsx
      index.tsx
      [id]
        [action].tsx
    upgrade.tsx
  [slug]
    index.tsx
    [page].tsx
  _app.tsx
  _document.tsx
package.json

```

### components\common\Pagination.tsx

```tsx
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  itemLabel?: string // e.g., "người dùng", "giao dịch", "yêu cầu"
  accentColor?: 'blue' | 'green' | 'indigo' | 'pink' // Theme color
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemLabel = 'items',
  accentColor = 'blue'
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const colorClasses = {
    blue: 'bg-blue-600 text-white',
    green: 'bg-green-600 text-white',
    indigo: 'bg-indigo-600 text-white',
    pink: 'bg-pink-600 text-white'
  }

  return (
    <div className='px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4'>
      <div className='text-sm text-gray-500'>
        Hiển thị {startItem} - {endItem} trong tổng số {totalItems} {itemLabel}
      </div>
      <div className='flex gap-2'>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className='px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-lg text-sm font-bold ${
              currentPage === page ? colorClasses[accentColor] : 'border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className='px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
```

### components\guest\MoneyGift.tsx

```tsx
import { useToast } from '@/components/ui/ToastProvider'
import { WeddingContent } from '@/lib/data-service'
import { Copy, CreditCard } from 'lucide-react'

interface MoneyGiftProps {
  content: WeddingContent
  guestName?: string
}

const BANK_MAP: Record<string, string> = {
  Vietcombank: 'VCB',
  Techcombank: 'TCB',
  MBBank: 'MB',
  ACB: 'ACB',
  Vietinbank: 'ICB',
  BIDV: 'BIDV',
  VPBank: 'VPB',
  TPBank: 'TPB'
}

export default function MoneyGift({ content, guestName }: MoneyGiftProps) {
  const { toast } = useToast()

  if (!content.bank_name || !content.account_number) return null

  const bankCode = BANK_MAP[content.bank_name] || content.bank_name
  const transferNote = `Mung cuoi ${guestName || ''}`.trim()
  const qrUrl = `https://img.vietqr.io/image/${bankCode}-${content.account_number}-compact2.jpg?amount=0&addInfo=${encodeURIComponent(transferNote)}&accountName=${encodeURIComponent(content.account_name || '')}`

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast('Đã sao chép số tài khoản!', 'success')
  }

  const copyNote = () => {
    navigator.clipboard.writeText(transferNote)
    toast('Đã sao chép nội dung chuyển khoản!', 'success')
  }

  return (
    <div className='max-w-md mx-auto bg-white rounded-3xl overflow-hidden shadow-xl border border-pink-100'>
      <div className='bg-gradient-to-r from-pink-600 to-rose-500 p-6 text-white text-center'>
        <div className='w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm'>
          <CreditCard className='text-white' />
        </div>
        <h3 className='text-xl font-bold font-serif'>Hộp Mừng Cưới</h3>
        <p className='text-pink-100 text-sm opacity-90'>Gửi lời chúc và quà mừng đến cô dâu chú rể</p>
      </div>

      <div className='p-8 space-y-6'>
        {/* QR Code */}
        <div className='flex justify-center'>
          <div className='p-2 bg-white rounded-xl shadow-lg border border-gray-100'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrUrl} alt='VietQR' className='w-48 h-48 object-contain' />
          </div>
        </div>

        {/* Bank Info */}
        <div className='space-y-4 text-center'>
          <div>
            <div className='text-xs text-gray-500 uppercase tracking-wider font-bold mb-1'>Ngân Hàng</div>
            <div className='text-lg font-bold text-gray-800'>{content.bank_name}</div>
          </div>
          <div>
            <div className='text-xs text-gray-500 uppercase tracking-wider font-bold mb-1'>Chủ Tài Khoản</div>
            <div className='text-lg font-bold text-gray-800 uppercase'>{content.account_name}</div>
          </div>
          <div className='relative'>
            <div className='text-xs text-gray-500 uppercase tracking-wider font-bold mb-1'>Số Tài Khoản</div>
            <div className='flex items-center justify-center gap-2'>
              <div className='text-xl font-mono font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-lg'>
                {content.account_number}
              </div>
              <button
                onClick={() => copyToClipboard(content.account_number || '')}
                className='p-2 text-gray-400 hover:text-pink-600 transition-colors'
                title='Sao chép'
              >
                <Copy size={18} />
              </button>
            </div>
          </div>
          <div className='relative'>
            <div className='text-xs text-gray-500 uppercase tracking-wider font-bold mb-1'>Nội Dung Chuyển Khoản</div>
            <div className='flex items-center justify-center gap-2'>
              <div className='text-sm font-mono font-semibold text-gray-700 bg-gray-50 px-3 py-2 rounded-lg'>
                {transferNote}
              </div>
              <button
                onClick={copyNote}
                className='p-2 text-gray-400 hover:text-pink-600 transition-colors'
                title='Sao chép nội dung'
              >
                <Copy size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### components\guest\RSVPForm.tsx

```tsx
import { useToast } from '@/components/ui/ToastProvider'
import { dataService } from '@/lib/data-service'
import { Check, Loader2, Send } from 'lucide-react'
import { useState } from 'react'

interface RSVPFormProps {
  weddingId: string
}

export default function RSVPForm({ weddingId }: RSVPFormProps) {
  const [formData, setFormData] = useState({
    guest_name: '',
    phone: '',
    is_attending: true,
    adults: 1,
    children: 0,
    wishes: '',
    website: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { toast, success, error } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.website) {
      return
    }

    if (!formData.guest_name) {
      toast('Vui lòng nhập tên của bạn', 'warning')
      return
    }

    if (formData.phone && !/^(0|\+84)\d{9,10}$/.test(formData.phone.trim())) {
      toast('Số điện thoại chưa đúng định dạng', 'warning')
      return
    }

    const lastSubmitKey = `rsvp_last_submit_${weddingId}`
    const lastSubmit = typeof window !== 'undefined' ? localStorage.getItem(lastSubmitKey) : null
    if (lastSubmit && Date.now() - Number(lastSubmit) < 5 * 60 * 1000) {
      toast('Bạn vừa gửi RSVP gần đây. Vui lòng thử lại sau ít phút.', 'warning')
      return
    }

    setSubmitting(true)
    try {
      const attendingAdults = formData.is_attending ? formData.adults : 0
      const attendingChildren = formData.is_attending ? formData.children : 0
      const partySize = attendingAdults + attendingChildren
      const meta: string[] = []
      if (formData.is_attending) {
        meta.push(`Người lớn: ${attendingAdults}`)
        meta.push(`Trẻ em: ${attendingChildren}`)
      }
      const metaText = meta.length ? ` [${meta.join(', ')}]` : ''
      const wishesText = formData.wishes.trim()

      const result = await dataService.createRSVP({
        wedding_id: weddingId,
        guest_name: formData.guest_name,
        phone: formData.phone,
        is_attending: formData.is_attending,
        party_size: partySize,
        wishes: `${wishesText}${metaText}`.trim()
      })

      if (result) {
        setSubmitted(true)
        if (typeof window !== 'undefined') {
          localStorage.setItem(lastSubmitKey, Date.now().toString())
        }
        success('Gửi phản hồi thành công! Cảm ơn bạn.')
      } else {
        error('Có lỗi xảy ra. Vui lòng thử lại.')
      }
    } catch (e) {
      error('Không thể gửi phản hồi. Vui lòng thử lại sau.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className='max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl text-center border border-green-100'>
        <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600'>
          <Check size={32} />
        </div>
        <h3 className='text-2xl font-serif font-bold text-gray-900 mb-2'>Cảm Ơn Bạn!</h3>
        <p className='text-gray-500'>
          Thông tin phản hồi của bạn đã được ghi nhận. Hẹn gặp bạn tại buổi tiệc vô cùng đặc biệt này nhé!
        </p>
      </div>
    )
  }

  return (
    <div className='max-w-xl mx-auto bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-pink-100'>
      <div className='text-center mb-8'>
        <h3 className='text-3xl font-serif font-bold text-gray-900 mb-2'>Xác Nhận Tham Dự</h3>
        <p className='text-gray-500'>Vui lòng cho chúng mình biết bạn có thể tham dự hay không nhé!</p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Guest Name */}
        <div>
          <label className='block text-sm font-bold text-gray-700 mb-2'>Tên của bạn</label>
          <input
            type='text'
            required
            className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all font-medium'
            placeholder='VD: Nguyễn Văn A'
            value={formData.guest_name}
            onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
          />
        </div>

        {/* Phone */}
        <div>
          <label className='block text-sm font-bold text-gray-700 mb-2'>Số điện thoại (Tùy chọn)</label>
          <input
            type='tel'
            className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all font-medium'
            placeholder='Để chúng mình tiện liên lạc'
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        {/* Honeypot */}
        <input
          type='text'
          tabIndex={-1}
          autoComplete='off'
          className='hidden'
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        />

        {/* Attendance Status */}
        <div>
          <label className='block text-sm font-bold text-gray-700 mb-2'>Bạn sẽ tham dự chứ?</label>
          <div className='grid grid-cols-2 gap-4'>
            <button
              type='button'
              onClick={() => setFormData({ ...formData, is_attending: true })}
              className={`p-4 rounded-xl border-2 transition-all font-bold ${
                formData.is_attending
                  ? 'border-pink-500 bg-pink-50 text-pink-700'
                  : 'border-gray-100 bg-white text-gray-500 hover:border-pink-200'
              }`}
            >
              🎉 Chắc chắn rồi
            </button>
            <button
              type='button'
              onClick={() => setFormData({ ...formData, is_attending: false })}
              className={`p-4 rounded-xl border-2 transition-all font-bold ${
                !formData.is_attending
                  ? 'border-gray-500 bg-gray-100 text-gray-700'
                  : 'border-gray-100 bg-white text-gray-500 hover:border-gray-300'
              }`}
            >
              😢 Tiếc quá, mình bận
            </button>
          </div>
        </div>

        {/* Party Size (Only show if attending) */}
        {formData.is_attending && (
          <div className='animate-in fade-in slide-in-from-top-2'>
            <label className='block text-sm font-bold text-gray-700 mb-2'>Số lượng người tham dự</label>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <div className='text-xs text-gray-500 mb-1'>Người lớn</div>
                <input
                  type='number'
                  min={1}
                  max={20}
                  value={formData.adults}
                  onChange={(e) => setFormData({ ...formData, adults: Math.max(1, Number(e.target.value || 1)) })}
                  className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all font-medium'
                />
              </div>
              <div>
                <div className='text-xs text-gray-500 mb-1'>Trẻ em</div>
                <input
                  type='number'
                  min={0}
                  max={20}
                  value={formData.children}
                  onChange={(e) => setFormData({ ...formData, children: Math.max(0, Number(e.target.value || 0)) })}
                  className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all font-medium'
                />
              </div>
            </div>
          </div>
        )}

        {/* Wishes */}
        <div>
          <label className='block text-sm font-bold text-gray-700 mb-2'>Gửi lời chúc (Tùy chọn)</label>
          <textarea
            rows={3}
            className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all font-medium resize-none'
            placeholder='Gửi những lời chúc tốt đẹp nhất đến cô dâu chú rể...'
            value={formData.wishes}
            onChange={(e) => setFormData({ ...formData, wishes: e.target.value })}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          disabled={submitting}
          className='w-full py-4 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-xl font-bold text-lg shadow-xl shadow-pink-200 hover:scale-[1.02] hover:shadow-pink-300 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2'
        >
          {submitting ? (
            <>
              <Loader2 className='animate-spin' /> Đang gửi...
            </>
          ) : (
            <>
              <Send size={20} /> Gửi Phản Hồi
            </>
          )}
        </button>
      </form>
    </div>
  )
}
```

### components\guest\Wishes.tsx

```tsx
import { useCallback, useEffect, useRef, useState } from 'react'

import { dataService, RSVP } from '../../lib/data-service'

interface WishesProps {
  weddingId: string
}

export default function Wishes({ weddingId }: WishesProps) {
  const [wishes, setWishes] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(true)
  const scrollerRef = useRef<HTMLDivElement>(null)

  const fetchWishes = useCallback(async () => {
    try {
      const data = await dataService.getRSVPs(weddingId)
      // Filter only those with wishes
      setWishes(data.filter((r) => r.wishes && r.wishes.trim().length > 0))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [weddingId])

  useEffect(() => {
    fetchWishes()
  }, [fetchWishes])

  if (loading) return null // Or skeleton
  if (wishes.length === 0) return null

  return (
    <div className='max-w-5xl mx-auto'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-3xl font-serif font-bold text-gray-900'>Lời Chúc Từ Khách Mời</h2>
        <div className='flex gap-2'>
          <button
            onClick={() => scrollerRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
            className='px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50'
          >
            ←
          </button>
          <button
            onClick={() => scrollerRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
            className='px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50'
          >
            →
          </button>
        </div>
      </div>

      <div ref={scrollerRef} className='flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 scroll-smooth'>
        {wishes.map((wish) => (
          <div
            key={wish.id}
            className='min-w-[260px] max-w-[280px] bg-white p-6 rounded-2xl shadow-sm border border-pink-50 hover:shadow-md transition-shadow relative overflow-hidden snap-start'
          >
            <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 to-rose-400'></div>
            <div className='mb-4'>
              <div className='w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-xs mb-3'>
                {wish.guest_name.charAt(0).toUpperCase()}
              </div>
              <p className='text-gray-600 italic leading-relaxed'>&quot;{wish.wishes}&quot;</p>
            </div>
            <div className='border-t border-gray-100 pt-4 flex justify-between items-center'>
              <div className='font-bold text-gray-900 text-sm'>{wish.guest_name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### components\landing\Features.tsx

```tsx
import { MapPin, MailOpen, QrCode } from 'lucide-react'

const features = [
  {
    icon: <MailOpen className='w-8 h-8 text-pink-500' />,
    title: 'RSVP Real-time',
    desc: 'Nhận xác nhận tham dự tức thì. Đồng bộ dữ liệu về Google Sheets giúp bạn quản lý bàn tiệc dễ dàng.'
  },
  {
    icon: <MapPin className='w-8 h-8 text-blue-500' />,
    title: 'Bản Đồ Thông Minh',
    desc: 'Tích hợp Google Maps, giúp khách mời tìm đường đến nhà hàng chỉ với 1 cú chạm, không lo lạc đường.'
  },
  {
    icon: <QrCode className='w-8 h-8 text-green-500' />,
    title: 'Mừng Cưới 4.0',
    desc: 'Tích hợp mã QR VietQR, tự động điền số tài khoản và lời chúc. Tinh tế và tiện lợi.'
  }
]

export default function Features() {
  return (
    <section id='features' className='py-20 bg-white'>
      <div className='container px-4 mx-auto'>
        <h2 className='mb-12 text-3xl font-bold text-center'>Tính Năng Vượt Trội</h2>
        <div className='grid gap-8 md:grid-cols-3'>
          {features.map((item, idx) => (
            <div key={idx} className='p-6 transition border border-gray-100 rounded-2xl bg-gray-50 hover:bg-pink-50'>
              <div className='flex items-center justify-center w-16 h-16 mb-4 bg-white rounded-full shadow-sm'>
                {item.icon}
              </div>
              <h3 className='mb-2 text-xl font-bold'>{item.title}</h3>
              <p className='text-gray-600'>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### components\landing\Footer.tsx

```tsx
import Link from 'next/link'
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className='pt-16 pb-8 text-white bg-gray-900 border-t border-gray-800'>
      <div className='container px-4 mx-auto'>
        <div className='grid gap-12 mb-12 md:grid-cols-4'>
          {/* Cột 1: Brand */}
          <div className='space-y-4'>
            <h3 className='text-2xl font-bold text-pink-500'>MoiMoi Studio</h3>
            <p className='text-sm leading-relaxed text-gray-400'>
              Nền tảng thiệp cưới online số 1 Việt Nam. Giúp bạn gửi lời mời trân trọng nhất đến người thân yêu theo
              cách hiện đại nhất.
            </p>
            <div className='flex gap-4 pt-2'>
              <a
                href='#'
                className='flex items-center justify-center w-10 h-10 transition bg-gray-800 rounded-full hover:bg-pink-600'
              >
                <Facebook className='w-5 h-5' />
              </a>
              <a
                href='#'
                className='flex items-center justify-center w-10 h-10 transition bg-gray-800 rounded-full hover:bg-pink-600'
              >
                <Instagram className='w-5 h-5' />
              </a>
            </div>
          </div>

          {/* Cột 2: Quick Links */}
          <div>
            <h4 className='mb-6 text-lg font-bold'>Liên Kết Nhanh</h4>
            <ul className='space-y-3 text-sm text-gray-400'>
              <li>
                <Link href='#templates' className='transition hover:text-pink-500'>
                  Mẫu thiệp mới
                </Link>
              </li>
              <li>
                <Link href='#features' className='transition hover:text-pink-500'>
                  Tính năng
                </Link>
              </li>
              <li>
                <Link href='#pricing' className='transition hover:text-pink-500'>
                  Bảng giá
                </Link>
              </li>
              <li>
                <Link href='#' className='transition hover:text-pink-500'>
                  Về chúng tôi
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Legal */}
          <div>
            <h4 className='mb-6 text-lg font-bold'>Chính Sách</h4>
            <ul className='space-y-3 text-sm text-gray-400'>
              <li>
                <a href='#' className='transition hover:text-pink-500'>
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href='#' className='transition hover:text-pink-500'>
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href='#' className='transition hover:text-pink-500'>
                  Chính sách hoàn tiền
                </a>
              </li>
              <li>
                <a href='#' className='transition hover:text-pink-500'>
                  Hướng dẫn thanh toán
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 4: Contact */}
          <div>
            <h4 className='mb-6 text-lg font-bold'>Liên Hệ</h4>
            <ul className='space-y-4 text-sm text-gray-400'>
              <li className='flex items-start gap-3'>
                <MapPin className='w-5 h-5 text-pink-500 shrink-0' />
                <span>Tầng 3, Tòa nhà Innovation, Quận 1, TP.HCM</span>
              </li>
              <li className='flex items-center gap-3'>
                <Phone className='w-5 h-5 text-pink-500 shrink-0' />
                <span>0909.123.456</span>
              </li>
              <li className='flex items-center gap-3'>
                <Mail className='w-5 h-5 text-pink-500 shrink-0' />
                <span>support@moimoi.vn</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='pt-8 text-sm text-center text-gray-500 border-t border-gray-800'>
          <p>© 2026 MoiMoi Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
```

### components\landing\Header.tsx

```tsx
import { useSession } from '@supabase/auth-helpers-react'
import { ArrowRight, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const session = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className='fixed top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md'>
      <div className='container flex items-center h-16 px-4 md:px-8 mx-auto relative'>
        {/* Left: Navigation (Desktop) */}
        <nav className='hidden md:flex flex-1 items-center justify-start gap-8 font-medium text-gray-600'>
          <Link href='#features' className='transition hover:text-pink-600'>
            Tính năng
          </Link>
          <Link href='#templates' className='transition hover:text-pink-600'>
            Mẫu thiệp
          </Link>
          <Link href='#pricing' className='transition hover:text-pink-600'>
            Bảng giá
          </Link>
        </nav>

        {/* Center: Logo */}
        <div className='flex-1 md:flex-none flex justify-start md:justify-center md:absolute md:left-1/2 md:-translate-x-1/2 z-10'>
          <Link href='/'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src='/image/LOGO.png' alt='MoiMoi.STD' className='h-10 md:h-16 w-auto object-contain py-2' />
          </Link>
        </div>

        {/* Right: CTA Buttons (Desktop) */}
        <div className='hidden md:flex flex-1 items-center justify-end space-x-4'>
          {/* Dev Links (Temporary) */}
          {/* <Link href='/admin' className='text-xs font-bold text-gray-400 hover:text-gray-900'>
            Admin
          </Link>
          <Link href='/finance' className='text-xs font-bold text-gray-400 hover:text-gray-900'>
            Finance
          </Link> */}

          {session ? (
            <Link href='/studio'>
              <button className='text-gray-600 hover:text-pink-600 font-medium transition flex items-center mb-0 gap-2'>
                <span className='w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 text-xs font-bold'>
                  {session.user.email?.[0].toUpperCase()}
                </span>
                Vào Studio
              </button>
            </Link>
          ) : (
            <Link href='/studio/login'>
              <button className='text-gray-600 hover:text-pink-600 font-medium transition'>Đăng Nhập</button>
            </Link>
          )}

          <Link href='/studio'>
            <button className='px-5 py-2 font-medium text-white transition bg-pink-600 rounded-full hover:bg-pink-700 shadow-lg shadow-pink-200'>
              Tạo Thiệp
            </button>
          </Link>
        </div>

        {/* Mobile Menu Icon (Right aligned on mobile) */}
        <div className='flex md:hidden flex-1 justify-end'>
          <button className='p-2 text-gray-800' onClick={() => setMobileMenuOpen(true)}>
            <Menu className='w-6 h-6' />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className='fixed inset-0 z-[100] bg-white p-6 md:hidden flex flex-col h-screen w-screen overflow-y-auto'>
          <div className='flex items-center justify-between mb-8'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src='/image/LOGO.png' alt='MoiMoi' className='h-10 w-auto' />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className='p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors'
            >
              <X size={24} />
            </button>
          </div>

          <div className='flex flex-col space-y-6 text-lg font-medium text-gray-800 flex-1'>
            <Link href='#features' onClick={() => setMobileMenuOpen(false)} className='py-2 border-b border-gray-50'>
              Tính năng
            </Link>
            <Link href='#templates' onClick={() => setMobileMenuOpen(false)} className='py-2 border-b border-gray-50'>
              Mẫu thiệp
            </Link>
            <Link href='#pricing' onClick={() => setMobileMenuOpen(false)} className='py-2 border-b border-gray-50'>
              Bảng giá
            </Link>
          </div>

          <div className='mt-auto space-y-4 pb-8'>
            {session ? (
              <Link href='/studio' onClick={() => setMobileMenuOpen(false)}>
                <button className='w-full py-3 bg-pink-50 text-pink-600 rounded-xl font-bold flex items-center justify-center gap-2'>
                  <span className='w-6 h-6 rounded-full bg-pink-200 flex items-center justify-center text-xs'>
                    {session.user.email?.[0].toUpperCase()}
                  </span>
                  Vào Studio
                </button>
              </Link>
            ) : (
              <Link href='/studio/login' onClick={() => setMobileMenuOpen(false)}>
                <button className='w-full py-3 border border-pink-200 text-pink-600 rounded-xl font-bold'>
                  Đăng Nhập
                </button>
              </Link>
            )}

            <Link href='/studio' onClick={() => setMobileMenuOpen(false)}>
              <button className='w-full py-3 bg-pink-600 text-white rounded-xl font-bold shadow-lg shadow-pink-200 flex items-center justify-center'>
                Tạo Thiệp Ngay <ArrowRight size={18} className='ml-2' />
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
```

### components\landing\Hero.tsx

```tsx
import { motion } from 'framer-motion'
import { ArrowRight, Heart, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className='relative pt-40 pb-20 overflow-hidden bg-[#FDFBF7]'>
      {/* Animated Background Blobs */}
      <div className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none'>
        <div className='absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-pink-200/30 rounded-full blur-[100px] animate-pulse'></div>
        <div className='absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[100px] animate-pulse delay-1000'></div>
      </div>

      <div className='container px-4 mx-auto text-center relative z-10'>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className='inline-flex items-center px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-pink-600 uppercase bg-white border border-pink-100 rounded-full shadow-sm'>
            <Sparkles size={16} className='mr-2' />
            Thiết kế cho Gen Z
          </div>

          <h1 className='max-w-4xl mx-auto mb-6 text-5xl font-bold leading-tight text-gray-900 md:text-7xl font-serif tracking-tight'>
            Trao tấm thiệp <br />
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-gold-dark italic'>
              Gói trọn tin yêu
            </span>
          </h1>

          <p className='max-w-2xl mx-auto mb-10 text-lg text-gray-600 md:text-xl font-sans leading-relaxed'>
            Nền tảng tạo thiệp cưới online đẳng cấp. Tích hợp bản đồ, RSVP và QR mừng cưới tinh tế chỉ trong 1 nốt nhạc.
          </p>

          <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Link href='/studio'>
              <button className='px-8 py-4 text-base font-bold text-white transition-all transform bg-pink-600 rounded-full shadow-xl hover:bg-pink-700 hover:shadow-pink-300 hover:-translate-y-1 flex items-center gap-2'>
                Dùng Thử Miễn Phí <ArrowRight size={20} />
              </button>
            </Link>
            <Link href='#templates'>
              <button className='px-8 py-4 text-base font-bold text-gray-700 transition-all bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300'>
                Xem Mẫu Demo
              </button>
            </Link>
          </div>
        </motion.div>

        {/* CSS-Only Wedding Card Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className='relative max-w-5xl mx-auto mt-20'
        >
          {/* Card Container */}
          <div className='relative bg-white rounded-[2rem] shadow-2xl shadow-pink-900/10 p-4 md:p-8 border border-white/50 backdrop-blur-sm'>
            <div className='absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 rounded-[2rem] pointer-events-none'></div>

            {/* Browser Toolbar UI (Decorative) */}
            <div className='flex items-center gap-2 mb-4 md:mb-6 px-4 opacity-30'>
              <div className='w-3 h-3 bg-red-400 rounded-full'></div>
              <div className='w-3 h-3 bg-yellow-400 rounded-full'></div>
              <div className='w-3 h-3 bg-green-400 rounded-full'></div>
              <div className='ml-4 flex-1 h-6 bg-gray-100 rounded-lg max-w-sm'></div>
            </div>

            {/* Hero Content Inside Mockup */}
            <div className='relative overflow-hidden rounded-2xl bg-[#FAFAFA] aspect-[16/9] md:aspect-[21/9] flex items-center justify-center group'>
              {/* Decorative Background inside Card */}
              <div className='absolute inset-0'>
                <div className='absolute top-0 right-0 w-64 h-64 bg-rose-100 rounded-full mix-blend-multiply blur-3xl opacity-50'></div>
                <div className='absolute bottom-0 left-0 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply blur-3xl opacity-50'></div>
              </div>

              <div className='relative z-10 text-center p-8'>
                <div className='mb-4 font-serif text-2xl md:text-5xl font-bold text-gray-800'>
                  Minh Nhật <span className='text-pink-500'>&</span> Thanh Hằng
                </div>
                <p className='text-sm md:text-lg text-gray-500 uppercase tracking-[0.2em] mb-6'>
                  Save the Date • 20.12.2026
                </p>
                <div className='inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white rounded-full shadow-lg text-pink-500 animate-bounce cursor-pointer hover:bg-pink-50 transition-colors'>
                  <Heart fill='currentColor' size={24} />
                </div>
              </div>

              {/* Checkmark Badge */}
              <div className='absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/50 flex items-center gap-3 transform translate-y-2 opacity-100 transition-all'>
                <div className='w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600'>
                  <Sparkles size={14} />
                </div>
                <div>
                  <div className='text-xs font-bold text-gray-800'>RSVP Confirmed</div>
                  <div className='text-[10px] text-gray-500'>Vừa nhận được 1 xác nhận</div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements around mockup */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className='absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-pink-400 to-rose-400 rounded-2xl rotate-12 shadow-xl opacity-20 md:opacity-100 blur-sm md:blur-0'
          ></motion.div>
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className='absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-tr from-blue-400 to-purple-400 rounded-full shadow-xl opacity-20 md:opacity-100 blur-sm md:blur-0'
          ></motion.div>
        </motion.div>
      </div>
    </section>
  )
}
```

### components\landing\Pricing.tsx

```tsx
import { Plan, formatVnd } from '@/lib/plan-store'
import { Check, Clock, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

interface ApiPackage {
  id: number
  name: string
  price: number
  original_price: number
  duration_months: number
  description?: string
  features?: string[]
  is_active: boolean
}

export default function Pricing() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/packages')
        if (!response.ok) {
          console.error('Failed to fetch packages')
          return
        }
        const result = await response.json()
        const packages: ApiPackage[] = result.data || []

        // Map API data to Plan format
        const mappedPlans: Plan[] = packages
          .filter((pkg) => pkg.is_active)
          .map((pkg) => {
            // Parse features if it's a JSON string
            let features: string[] = []
            if (Array.isArray(pkg.features)) {
              features = pkg.features
            } else if (typeof pkg.features === 'string') {
              try {
                features = JSON.parse(pkg.features)
              } catch {
                features = []
              }
            }

            // Fallback to default features if empty
            if (features.length === 0) {
              features = [
                'Thiết kế thiệp cưới online',
                'Quản lý danh sách khách mời',
                'Thu thập xác nhận tham dự',
                'Hỗ trợ kỹ thuật 24/7'
              ]
            }

            return {
              id: pkg.id.toString(),
              name: pkg.name,
              price: pkg.price,
              discountPrice: pkg.original_price > pkg.price ? pkg.price : undefined,
              duration: `${pkg.duration_months} tháng`,
              description: pkg.description || 'Gói dịch vụ thiệp cưới trực tuyến',
              features: features,
              notIncluded: [],
              isActive: pkg.is_active,
              highlight: false // Có thể thêm logic để highlight package nào đó
            }
          })

        setPlans(mappedPlans)
      } catch (error) {
        console.error('Error fetching packages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [])

  const visiblePlans = useMemo(() => {
    return plans.filter((plan) => plan.isActive !== false)
  }, [plans])

  if (loading) {
    return (
      <section id='pricing' className='py-20 bg-gray-50'>
        <div className='container px-4 mx-auto'>
          <div className='mb-16 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-gray-900 md:text-4xl'>Bảng Giá Dịch Vụ</h2>
            <p className='max-w-2xl mx-auto text-gray-600'>Đang tải...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id='pricing' className='py-20 bg-gray-50'>
      <div className='container px-4 mx-auto'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900 md:text-4xl'>Bảng Giá Dịch Vụ</h2>
          <p className='max-w-2xl mx-auto text-gray-600'>
            MoiMoi giúp bạn thong dong<br></br>
            Giá mềm như bún, hài lòng khách qua
          </p>
        </div>

        <div className='grid max-w-7xl gap-8 mx-auto md:grid-cols-2 lg:grid-cols-4'>
          {visiblePlans.map((plan) => {
            const hasDiscount = plan.discountPrice && plan.discountPrice < plan.price
            const displayPrice = hasDiscount ? plan.discountPrice : plan.price
            const originalPrice = hasDiscount ? plan.price : plan.discountPrice

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-white border-2 border-pink-500 shadow-xl scale-105 z-10'
                    : 'bg-white border border-gray-100 hover:shadow-lg'
                }`}
              >
                {plan.highlight && (
                  <div className='absolute top-0 px-4 py-1 text-sm font-bold text-white -translate-x-1/2 -translate-y-1/2 bg-pink-600 rounded-full left-1/2'>
                    Khuyên Dùng
                  </div>
                )}

                <h3 className='mb-2 text-xl font-bold text-gray-900'>{plan.name}</h3>
                <div className='mb-2 text-4xl font-bold text-pink-600'>{formatVnd(displayPrice || 0)}</div>
                {plan.duration && (
                  <div className='mb-2 text-sm font-semibold text-gray-500'>Thời gian: {plan.duration}</div>
                )}
                {hasDiscount && originalPrice && (
                  <div className='text-xs text-gray-400 line-through mb-1 opacity-70'>{formatVnd(originalPrice)}</div>
                )}
                <p className='mb-6 text-sm text-gray-500'>{plan.description}</p>

                <button
                  className={`w-full py-3 rounded-xl font-bold mb-8 transition ${
                    plan.highlight
                      ? 'bg-pink-600 text-white hover:bg-pink-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Chọn Gói Này
                </button>

                <div className='space-y-4'>
                  {Array.isArray(plan.features) &&
                    plan.features.map((feature, i) => (
                      <div key={i} className='flex items-start gap-3 text-sm text-gray-700'>
                        <Check className='w-5 h-5 text-green-500 shrink-0' />
                        <span>{feature}</span>
                      </div>
                    ))}
                  {Array.isArray(plan.notIncluded) &&
                    plan.notIncluded.map((feature, i) => (
                      <div key={i} className='flex items-start gap-3 text-sm text-gray-400'>
                        <X className='w-5 h-5 text-gray-300 shrink-0' />
                        <span className='line-through'>{feature}</span>
                      </div>
                    ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

### components\landing\TemplateGallery.tsx

```tsx
import { useEffect, useMemo, useState } from 'react'
import { ExternalLink } from 'lucide-react'

interface Template {
  id: number
  name: string
  repo_branch: string
  thumbnail_url?: string
  is_active: boolean
  packages?: any[]
}

const CATEGORIES = ['Tất cả', 'Vintage', 'Modern', 'Minimal', 'Luxury', 'Traditional']
const CARD_COLORS = ['bg-amber-100', 'bg-gray-100', 'bg-yellow-50', 'bg-pink-50', 'bg-blue-50', 'bg-red-50']

const matchCategory = (template: Template, category: string) => {
  if (category === 'Tất cả') return true
  const keyword = category.toLowerCase()
  return template.name.toLowerCase().includes(keyword) || template.repo_branch.toLowerCase().includes(keyword)
}

export default function TemplateGallery() {
  const [activeCategory, setActiveCategory] = useState('Tất cả')
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  const INITIAL_VISIBLE_COUNT = 6

  useEffect(() => {
    const loadTemplates = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/templates')
        if (response.ok) {
          const result = await response.json()
          setTemplates(result.data || [])
        } else {
          console.error('Failed to fetch templates')
        }
      } catch (error) {
        console.error('Error fetching templates:', error)
      } finally {
        setLoading(false)
      }
    }
    loadTemplates()
  }, [])

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => matchCategory(template, activeCategory))
  }, [activeCategory, templates])

  const visibleTemplates = useMemo(() => {
    if (showAll) return filteredTemplates
    return filteredTemplates.slice(0, INITIAL_VISIBLE_COUNT)
  }, [filteredTemplates, showAll])

  useEffect(() => {
    setShowAll(false)
  }, [activeCategory])

  return (
    <section id='templates' className='py-20 bg-white'>
      <div className='container px-4 mx-auto'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold'>Kho Giao Diện Đa Dạng</h2>
          <p className='text-gray-600'>Hơn 50+ mẫu thiệp được thiết kế tỉ mỉ, phù hợp mọi phong cách.</p>
        </div>

        {/* Filter Tabs */}
        <div className='flex flex-wrap justify-center gap-2 mb-10'>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Templates */}
        {loading ? (
          <div className='text-center text-gray-400 py-16'>Đang tải kho mẫu...</div>
        ) : (
          <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
            {visibleTemplates.map((template, index) => (
              <div key={template.id} className='cursor-pointer group'>
                {/* Card Image */}
                <div
                  className={`aspect-[3/4] rounded-2xl relative overflow-hidden mb-4 shadow-sm border border-gray-100 transition-transform group-hover:-translate-y-2 ${
                    !template.thumbnail_url ? CARD_COLORS[index % CARD_COLORS.length] : ''
                  }`}
                >
                  {template.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={template.thumbnail_url} alt={template.name} className='w-full h-full object-cover' />
                  ) : (
                    <div className='absolute inset-0 flex items-center justify-center font-medium text-gray-400'>
                      Ảnh Mẫu: {template.name}
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className='absolute inset-0 flex items-center justify-center gap-3 transition-opacity opacity-0 bg-black/40 group-hover:opacity-100'>
                    <button className='flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-900 bg-white rounded-full hover:bg-pink-50'>
                      <ExternalLink className='w-4 h-4' /> Xem Demo
                    </button>
                  </div>
                </div>

                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-bold text-gray-900'>{template.name}</h3>
                  <span className='px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-md'>{template.repo_branch}</span>
                </div>

                {/* Packages Info */}
                <div className='mt-2'>
                  {template.packages && template.packages.length > 0 ? (
                    <div className='flex flex-wrap gap-1'>
                      {template.packages.map((pkg: any) => (
                        <span
                          key={pkg.id}
                          className='inline-flex items-center px-2 py-1 text-xs font-semibold text-pink-700 bg-pink-50 rounded-full'
                        >
                          {pkg.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className='inline-flex items-center px-2 py-1 text-xs font-semibold text-green-700 bg-green-50 rounded-full'>
                      Tất cả gói
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredTemplates.length > INITIAL_VISIBLE_COUNT && (
          <div className='mt-10 flex justify-center'>
            <button
              type='button'
              onClick={() => setShowAll((prev) => !prev)}
              className='px-6 py-3 rounded-full text-sm font-bold border border-gray-200 text-gray-700 hover:bg-gray-50'
            >
              {showAll ? 'Thu gọn' : 'Xem thêm'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
```

### components\studio\LivePreview.tsx

```tsx
import React from 'react'
import { WeddingContent } from '@/lib/data-service'

interface LivePreviewProps {
  content?: WeddingContent
}

const LivePreview: React.FC<LivePreviewProps> = ({ content }) => {
  if (!content) {
    return (
      <div className='sticky top-6'>
        <div className='bg-white rounded-3xl shadow-xl border border-pink-100 p-5'>
          <div className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-3'>Live Preview</div>
          <div className='mx-auto w-[280px] rounded-[32px] border-[10px] border-gray-900 bg-gray-900 shadow-2xl'>
            <div className='bg-[#FDFBF7] rounded-[22px] overflow-hidden'>
              <div className='h-44 bg-gray-200 flex items-center justify-center text-gray-400'>Chưa có dữ liệu</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const cover = content.images?.[0]
  const names = `${content.groom_name || 'Chú rể'} & ${content.bride_name || 'Cô dâu'}`

  return (
    <div className='sticky top-6'>
      <div className='bg-white rounded-3xl shadow-xl border border-pink-100 p-5'>
        <div className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-3'>Live Preview</div>
        <div className='mx-auto w-[280px] rounded-[32px] border-[10px] border-gray-900 bg-gray-900 shadow-2xl'>
          <div className='bg-[#FDFBF7] rounded-[22px] overflow-hidden'>
            <div className='h-44 bg-gray-200 relative'>
              {cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cover} alt='Cover' className='h-full w-full object-cover' />
              ) : (
                <div className='h-full w-full bg-gradient-to-b from-pink-100 to-rose-200 flex items-center justify-center text-pink-500 text-xs font-semibold'>
                  Ảnh bìa
                </div>
              )}
            </div>
            <div className='p-4 space-y-3'>
              <div className='text-center'>
                <div className='text-xs uppercase tracking-[0.2em] text-gray-400'>Wedding</div>
                <div className='text-lg font-serif font-bold text-gray-900'>{names}</div>
              </div>
              <div className='bg-white rounded-xl border border-pink-100 p-3 text-center'>
                <div className='text-[11px] text-gray-500'>Ngày cưới</div>
                <div className='text-sm font-bold text-pink-600'>{content.wedding_date || 'Chưa thiết lập'}</div>
              </div>
              <div className='bg-white rounded-xl border border-gray-100 p-3 text-center'>
                <div className='text-[11px] text-gray-500'>Địa điểm</div>
                <div className='text-xs text-gray-700 line-clamp-2'>{content.address || 'Chưa có địa chỉ'}</div>
              </div>
              <div className='flex gap-2'>
                <div className='flex-1 bg-pink-600 text-white text-xs font-bold py-2 rounded-lg text-center'>RSVP</div>
                <div className='flex-1 bg-white border border-pink-200 text-pink-600 text-xs font-bold py-2 rounded-lg text-center'>
                  Mừng cưới
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className='text-xs text-gray-400 mt-3 text-center'>Mô phỏng mobile, cập nhật theo nội dung bạn nhập.</p>
    </div>
  )
}

export default LivePreview
```

### components\studio\StudioEmptyState.tsx

```tsx
import React from 'react'

interface StudioEmptyStateProps {
  message?: string
}

const StudioEmptyState: React.FC<StudioEmptyStateProps> = ({ message = 'Vui lòng tạo đám cưới trước.' }) => {
  return <div className='text-center mt-10 text-gray-500'>{message}</div>
}

export default StudioEmptyState
```

### components\studio\StudioLayout.tsx

```tsx
import { useSession, useSessionContext } from '@supabase/auth-helpers-react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  CreditCard,
  DollarSign,
  Edit3,
  Headset,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Menu,
  Settings,
  Shield,
  Users,
  X
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactNode, useEffect, useState } from 'react'

interface StudioLayoutProps {
  children: ReactNode
}

const StudioLayout: React.FC<StudioLayoutProps> = ({ children }) => {
  const router = useRouter()
  const session = useSession()
  const { isLoading, supabaseClient } = useSessionContext()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // ... (rest of logic remains same until return)

  useEffect(() => {
    if (!isLoading && !session) {
      router.push('/studio/login')
    }
  }, [session, isLoading, router])

  const handleLogout = async () => {
    await supabaseClient.auth.signOut()
    router.push('/')
  }

  if (isLoading || !session)
    return (
      <div className='flex items-center justify-center min-h-screen bg-[#FDFBF7]'>
        <div className='text-pink-600 font-serif text-xl animate-pulse'>Đang tải studio của bạn...</div>
      </div>
    )

  const navItems = [
    { label: 'Tổng Quan', href: '/studio', icon: LayoutDashboard },
    { label: 'Chỉnh Sửa Thiệp', href: '/studio/editor', icon: Edit3 },
    { label: 'Kho Giao Diện', href: '/studio/templates', icon: LayoutTemplate },
    { label: 'Khách Mời', href: '/studio/guests', icon: Users },
    { label: 'Nâng cấp gói', href: '/studio/upgrade', icon: CreditCard }
    // { label: 'Cài Đặt', href: '/studio/settings', icon: Settings },
    // Dev items
    // { label: 'Quản trị (Admin)', href: '/admin', icon: Shield },
    // { label: 'Kế toán (Finance)', href: '/finance', icon: DollarSign },
    // { label: 'CSKH (Support)', href: '/care', icon: Headset }
  ]

  return (
    <div className='min-h-screen bg-[#FDFBF7] flex flex-col md:flex-row font-sans text-slate-800'>
      {/* Mobile Header */}
      <div className='md:hidden bg-white/80 backdrop-blur-md border-b p-4 flex justify-between items-center sticky top-0 z-50'>
        <div className='flex items-center gap-2'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src='/image/logo-notext.png' alt='MoiMoi' className='h-8 w-auto' />
          <h1 className='text-xl font-bold font-serif text-pink-600'>MoiMoi Studio</h1>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className='p-2 text-gray-600 hover:text-pink-600'>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div className='fixed inset-0 bg-black/20 z-40 md:hidden' onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-white border-r border-pink-100 shadow-xl shadow-pink-100/20 flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className='p-8 flex flex-col items-center text-center border-b border-pink-50'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src='/image/logo-notext.png' alt='MoiMoi' className='h-12 w-auto mb-3' />
          <h1 className='text-xl font-bold font-serif text-pink-600'>MoiMoi Studio</h1>
          <p className='text-[10px] text-gray-400 mt-1 uppercase tracking-widest'>Không Gian Sáng Tạo</p>
        </div>

        <nav className='flex-1 px-4 space-y-2 py-4'>
          {navItems.map((item) => {
            const isActive =
              router.pathname === item.href || (item.href !== '/studio' && router.pathname.startsWith(item.href))
            return (
              <Link href={item.href} key={item.href} onClick={() => setSidebarOpen(false)}>
                <span
                  className={`flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-50 to-white text-pink-600 font-medium shadow-sm border border-pink-100'
                      : 'text-gray-500 hover:bg-pink-50/50 hover:text-pink-500'
                  }`}
                >
                  <item.icon
                    size={20}
                    className={`mr-3 transition-colors ${isActive ? 'text-pink-500' : 'text-gray-400 group-hover:text-pink-400'}`}
                  />
                  {item.label}
                </span>
              </Link>
            )
          })}

          <div className='pt-4 mt-4 border-t border-dashed border-gray-200'>
            <Link href='/' onClick={() => setSidebarOpen(false)}>
              <span className='flex items-center px-4 py-3 rounded-xl cursor-pointer text-gray-500 hover:bg-pink-50/50 hover:text-pink-500 transition-all duration-200 group'>
                <ArrowLeft size={20} className='mr-3 text-gray-400 group-hover:text-pink-400' />
                Về Trang Chủ
              </span>
            </Link>
          </div>
        </nav>

        <div className='p-4 border-t border-pink-50 bg-pink-50/30'>
          <div className='flex items-center mb-4 px-2'>
            <div className='w-8 h-8 rounded-full bg-gradient-to-tr from-pink-300 to-purple-300 flex items-center justify-center text-white font-bold text-xs'>
              {session?.user?.email?.[0].toUpperCase()}
            </div>
            <div className='ml-3 overflow-hidden'>
              <p className='text-sm font-medium text-gray-700 truncate'>{session?.user?.email}</p>
              <p className='text-xs text-green-600'>● Trực tuyến</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className='w-full flex items-center justify-center px-4 py-2 border border-pink-200 text-pink-600 rounded-lg hover:bg-pink-50 hover:border-pink-300 transition-colors text-sm font-medium'
          >
            <LogOut size={16} className='mr-2' />
            Đăng Xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className='flex-1 p-6 md:p-10 overflow-y-auto w-full'>
        <AnimatePresence mode='wait' initial={false}>
          <motion.div
            key={router.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className='max-w-5xl mx-auto'
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default StudioLayout
```

### components\studio\StudioLoading.tsx

```tsx
import React from 'react'

interface StudioLoadingProps {
  message?: string
}

const StudioLoading: React.FC<StudioLoadingProps> = ({ message = 'Đang tải...' }) => {
  return (
    <div className='flex items-center justify-center h-full min-h-[50vh]'>
      <div className='text-pink-600 animate-pulse text-lg font-medium'>{message}</div>
    </div>
  )
}

export default StudioLoading
```

### components\studio\TabAlbum.tsx

```tsx
import React, { useState, useEffect, useRef } from 'react'

interface TabAlbumProps {
  images: string[]
  onChange: (images: string[]) => void
}

const TabAlbum: React.FC<TabAlbumProps> = ({ images, onChange }) => {
  const [albumImages, setAlbumImages] = useState<string[]>(images || [])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setAlbumImages(images || [])
  }, [images])

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    // Validate image files only
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    const invalidFiles: string[] = []
    const validFiles: File[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (validImageTypes.includes(file.type)) {
        validFiles.push(file)
      } else {
        invalidFiles.push(file.name)
      }
    }

    if (invalidFiles.length > 0) {
      alert(`Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP, SVG).\n\nFile không hợp lệ:\n${invalidFiles.join('\n')}`)
      if (validFiles.length === 0) {
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        return
      }
    }

    // Convert to base64 for preview only
    const newImageUrls: string[] = []

    for (const file of validFiles) {
      const reader = new FileReader()
      const imageUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => {
          resolve(e.target?.result as string)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      newImageUrls.push(imageUrl)
    }

    const updatedImages = [...albumImages, ...newImageUrls]
    setAlbumImages(updatedImages)
    onChange(updatedImages)

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeImage = (indexToRemove: number) => {
    // Just remove from state, actual Cloudinary deletion happens on Save
    const newImages = albumImages.filter((_, index) => index !== indexToRemove)
    setAlbumImages(newImages)
    onChange(newImages)
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm space-y-6'>
      <h3 className='text-lg font-medium text-gray-900 border-b pb-2'>Album Ảnh Cưới</h3>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {albumImages.map((img, index) => (
          <div key={index} className='relative group aspect-w-4 aspect-h-3 bg-gray-100 rounded-lg overflow-hidden'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={`Album ${index}`} className='object-cover w-full h-full' />
            <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center'>
              <button
                onClick={() => removeImage(index)}
                className='opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full transform scale-90 group-hover:scale-100 transition-all'
                title='Xóa ảnh'
              >
                🗑️
              </button>
            </div>
          </div>
        ))}

        <div
          onClick={handleUploadClick}
          className='aspect-w-4 aspect-h-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-colors'
        >
          <div className='text-center p-4'>
            <div className='text-3xl mb-2'>📷</div>
            <span className='text-sm text-gray-500 font-medium'>Thêm Ảnh</span>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input ref={fileInputRef} type='file' accept='image/*' multiple onChange={handleFileChange} className='hidden' />
    </div>
  )
}

export default TabAlbum
```

### components\studio\TabBank.tsx

```tsx
import React, { useState, useEffect } from 'react'
import { Wedding } from '../../lib/data-service'
import { X, Search, Check } from 'lucide-react'

interface Bank {
  code: string
  name: string
  shortName: string
}

const BANKS: Bank[] = [
  { code: 'Vietcombank', name: 'Ngân hàng TMCP Ngoại thương Việt Nam', shortName: 'Vietcombank' },
  { code: 'BIDV', name: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam', shortName: 'BIDV' },
  { code: 'Vietinbank', name: 'Ngân hàng TMCP Công thương Việt Nam', shortName: 'VIETINBANK' },
  { code: 'Agribank', name: 'Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam', shortName: 'AGRIBANK' },
  { code: 'ABBank', name: 'Ngân hàng An Bình', shortName: 'ABBANK' },
  { code: 'ACB', name: 'Ngân hàng Á Châu', shortName: 'ACB' },
  { code: 'ANZ', name: 'Ngân hàng TNHH Một Thành Viên ANZ Việt Nam', shortName: 'ANZ' },
  { code: 'BacABank', name: 'Ngân hàng Bắc Á', shortName: 'BAC A BANK' },
  { code: 'Bangkok Bank', name: 'Ngân hàng Bangkok Bank - CN TP Hồ Chí Minh', shortName: 'BANGKOK BANK' },
  { code: 'BaoViet Bank', name: 'Ngân hàng Bảo Việt', shortName: 'BAO VIET BANK' },
  { code: 'DongA Bank', name: 'Ngân hàng TMCP Đông Á', shortName: 'DongA Bank' },
  { code: 'Eximbank', name: 'Ngân hàng TMCP Xuất Nhập khẩu', shortName: 'Eximbank' },
  { code: 'HDBank', name: 'Ngân hàng TMCP Phát triển TP.HCM', shortName: 'HDBank' },
  { code: 'LienVietPostBank', name: 'Ngân hàng TMCP Bưu điện Liên Việt', shortName: 'LienVietPostBank' },
  { code: 'MBBank', name: 'Ngân hàng TMCP Quân đội', shortName: 'MBBank' },
  { code: 'MSB', name: 'Ngân hàng TMCP Hàng Hải', shortName: 'MSB' },
  { code: 'Nam A Bank', name: 'Ngân hàng TMCP Nam Á', shortName: 'Nam A Bank' },
  { code: 'NCB', name: 'Ngân hàng TMCP Quốc Dân', shortName: 'NCB' },
  { code: 'OCB', name: 'Ngân hàng TMCP Phương Đông', shortName: 'OCB' },
  { code: 'PVcomBank', name: 'Ngân hàng TMCP Đại Chúng Việt Nam', shortName: 'PVcomBank' },
  { code: 'Sacombank', name: 'Ngân hàng TMCP Sài Gòn Thương Tín', shortName: 'Sacombank' },
  { code: 'SCB', name: 'Ngân hàng TMCP Sài Gòn', shortName: 'SCB' },
  { code: 'SeABank', name: 'Ngân hàng TMCP Đông Nam Á', shortName: 'SeABank' },
  { code: 'SHB', name: 'Ngân hàng TMCP Sài Gòn - Hà Nội', shortName: 'SHB' },
  { code: 'Techcombank', name: 'Ngân hàng TMCP Kỹ thương Việt Nam', shortName: 'Techcombank' },
  { code: 'TPBank', name: 'Ngân hàng TMCP Tiên Phong', shortName: 'TPBank' },
  { code: 'VIB', name: 'Ngân hàng TMCP Quốc tế', shortName: 'VIB' },
  { code: 'VietABank', name: 'Ngân hàng TMCP Việt Á', shortName: 'VietABank' },
  { code: 'VietBank', name: 'Ngân hàng TMCP Việt Nam Thương Tín', shortName: 'VietBank' },
  { code: 'VietCapital Bank', name: 'Ngân hàng TMCP Bản Việt', shortName: 'VietCapital Bank' },
  { code: 'VPBank', name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng', shortName: 'VPBank' },
  { code: 'Woori Bank', name: 'Ngân hàng TNHH MTV Woori Việt Nam', shortName: 'Woori Bank' }
]

interface TabBankProps {
  content?: Wedding['content']
  onChange: (key: string, value: string) => void
}

const TabBank: React.FC<TabBankProps> = ({ content, onChange }) => {
  const [formData, setFormData] = useState({
    bank_name: content?.bank_name || '',
    account_number: content?.account_number || '',
    account_name: content?.account_name || ''
  })
  const [showBankModal, setShowBankModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const formatAccountNumber = (value: string) => {
    // Loại bỏ khoảng trắng và chỉ lấy số
    const numbersOnly = value.replace(/\D/g, '').slice(0, 12)
    // Format thành nhóm 4 số
    return numbersOnly.replace(/(.{4})/g, '$1 ').trim()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // Chỉ cho phép nhập số cho trường account_number và giới hạn 12 ký tự
    if (name === 'account_number') {
      const numbersOnly = value.replace(/\D/g, '').slice(0, 12)
      setFormData((prev) => ({ ...prev, [name]: numbersOnly }))
      onChange(name, numbersOnly)
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
    onChange(name, value)
  }

  const handleBankSelect = (bankCode: string) => {
    setFormData((prev) => ({ ...prev, bank_name: bankCode }))
    onChange('bank_name', bankCode)
    setShowBankModal(false)
    setSearchQuery('')
  }

  // Backend logic: tìm kiếm ngân hàng theo tên đầy đủ, tên viết tắt và code
  const filteredBanks = BANKS.filter((bank) => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return true

    return (
      bank.code.toLowerCase().includes(query) ||
      bank.shortName.toLowerCase().includes(query) ||
      bank.name.toLowerCase().includes(query) ||
      // Tìm kiếm không dấu
      bank.shortName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .includes(query) ||
      bank.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .includes(query)
    )
  })

  const selectedBank = BANKS.find((b) => b.code === formData.bank_name)

  return (
    <>
      <div className='bg-white p-6 rounded-lg shadow-sm space-y-6'>
        <h3 className='text-lg font-medium text-gray-900 border-b pb-2'>Thông Tin Ngân Hàng</h3>

        <div className='space-y-4 max-w-lg'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Tên Ngân Hàng</label>
            <button
              type='button'
              onClick={() => setShowBankModal(true)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-left bg-white hover:bg-gray-50'
            >
              {selectedBank ? (
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-sm'>
                    {selectedBank.shortName.charAt(0)}
                  </div>
                  <div>
                    <div className='font-medium text-gray-900'>{selectedBank.shortName}</div>
                    <div className='text-xs text-gray-500'>{selectedBank.name}</div>
                  </div>
                </div>
              ) : (
                <span className='text-gray-400'>Chọn ngân hàng</span>
              )}
            </button>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Số Tài Khoản</label>
            <input
              type='text'
              name='account_number'
              value={formatAccountNumber(formData.account_number)}
              onChange={handleChange}
              maxLength={14}
              inputMode='numeric'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono'
              placeholder='0000 0000 0000'
            />
            <p className='mt-1 text-xs text-gray-500'>Chỉ nhập số, tối đa 12 chữ số</p>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Tên Chủ Tài Khoản</label>
            <input
              type='text'
              name='account_name'
              value={formData.account_name}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 uppercase'
              placeholder='NGUYEN VAN A'
            />
          </div>
        </div>
      </div>

      {/* Bank Modal */}
      {showBankModal && (
        <div
          className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'
          onClick={() => {
            setShowBankModal(false)
            setSearchQuery('')
          }}
        >
          <div
            className='bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className='p-4 border-b flex items-center justify-between'>
              <h2 className='text-lg font-semibold text-gray-900'>Chọn ngân hàng</h2>
              <button
                onClick={() => {
                  setShowBankModal(false)
                  setSearchQuery('')
                }}
                className='text-gray-500 hover:text-gray-700'
              >
                <X size={24} />
              </button>
            </div>

            {/* Search */}
            <div className='p-4 border-b'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
                <input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Nhập tên ngân hàng'
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
                  autoFocus
                />
              </div>
            </div>

            {/* Bank List */}
            <div className='overflow-y-auto' style={{ maxHeight: 'calc(80vh - 180px)' }}>
              {filteredBanks.map((bank) => (
                <button
                  key={bank.code}
                  onClick={() => handleBankSelect(bank.code)}
                  className='w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 border-b border-gray-100'
                >
                  <div className='w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold flex-shrink-0'>
                    {bank.shortName.charAt(0)}
                  </div>
                  <div className='flex-1 text-left'>
                    <div className='font-medium text-gray-900'>{bank.shortName}</div>
                    <div className='text-sm text-gray-500'>{bank.name}</div>
                  </div>
                  {formData.bank_name === bank.code && <Check className='text-green-500 flex-shrink-0' size={20} />}
                </button>
              ))}
              {filteredBanks.length === 0 && (
                <div className='text-center py-12 text-gray-500'>Không tìm thấy ngân hàng</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TabBank
```

### components\studio\TabInfo.tsx

```tsx
import React, { useState, useEffect } from 'react'
import { Wedding } from '../../lib/data-service'

interface TabInfoProps {
  content?: Wedding['content']
  onChange: (key: string, value: string) => void
}

const TabInfo: React.FC<TabInfoProps> = ({ content, onChange }) => {
  const [formData, setFormData] = useState({
    groom_name: content?.groom_name || '',
    bride_name: content?.bride_name || '',
    wedding_date: content?.wedding_date || '',
    wedding_time: content?.wedding_time || '',
    address: content?.address || '',
    map_url: content?.map_url || ''
  })

  useEffect(() => {
    setFormData({
      groom_name: content?.groom_name || '',
      bride_name: content?.bride_name || '',
      wedding_date: content?.wedding_date || '',
      wedding_time: content?.wedding_time || '',
      address: content?.address || '',
      map_url: content?.map_url || ''
    })
  }, [content])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    onChange(name, value)
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm space-y-6'>
      <h3 className='text-lg font-medium text-gray-900 border-b pb-2'>Thông Tin Chính</h3>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Tên Chú Rể</label>
          <input
            type='text'
            name='groom_name'
            value={formData.groom_name}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
            placeholder='Nguyễn Văn A'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Tên Cô Dâu</label>
          <input
            type='text'
            name='bride_name'
            value={formData.bride_name}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
            placeholder='Lê Thị B'
          />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Ngày Cưới</label>
          <input
            type='date'
            name='wedding_date'
            value={formData.wedding_date}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Giờ Cưới</label>
          <input
            type='time'
            name='wedding_time'
            value={formData.wedding_time}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
          />
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Địa Chỉ Tổ Chức</label>
        <input
          type='text'
          name='address'
          value={formData.address}
          onChange={handleChange}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
          placeholder='Số 123, Đường ABC, Quận 1, TP.HCM'
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Link Google Maps</label>
        <input
          type='text'
          name='map_url'
          value={formData.map_url}
          onChange={handleChange}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
          placeholder='https://maps.google.com/...'
        />
      </div>
    </div>
  )
}

export default TabInfo
```

### components\TodoList.tsx

```tsx
// import { Database } from '@/lib/schema'
import { Session, useSupabaseClient } from '@supabase/auth-helpers-react'
// import { useEffect, useState } from 'react'

// type Todos = Database['public']['Tables']['todos']['Row']

export default function TodoList({ session }: { session: Session }) {
  //   const supabase = useSupabaseClient<Database>()
  //   const [todos, setTodos] = useState<Todos[]>([])
  //   const [newTaskText, setNewTaskText] = useState('')
  //   const [errorText, setErrorText] = useState('')
  //   const user = session.user
  //   useEffect(() => {
  //     const fetchTodos = async () => {
  //       const { data: todos, error } = await supabase.from('todos').select('*').order('id', { ascending: true })
  //       if (error) console.log('error', error)
  //       else setTodos(todos)
  //     }
  //     fetchTodos()
  //   }, [supabase])
  //   const addTodo = async (taskText: string) => {
  //     let task = taskText.trim()
  //     if (task.length) {
  //       const { data: todo, error } = await supabase.from('todos').insert({ task, user_id: user.id }).select().single()
  //       if (error) {
  //         setErrorText(error.message)
  //       } else {
  //         setTodos([...todos, todo])
  //         setNewTaskText('')
  //       }
  //     }
  //   }
  //   const deleteTodo = async (id: number) => {
  //     try {
  //       await supabase.from('todos').delete().eq('id', id).throwOnError()
  //       setTodos(todos.filter((x) => x.id != id))
  //     } catch (error) {
  //       console.log('error', error)
  //     }
  //   }
  //   return (
  //     <div className='w-full'>
  //       <h1 className='mb-12'>MoiMoi.std</h1>
  //       <form
  //         onSubmit={(e) => {
  //           e.preventDefault()
  //           addTodo(newTaskText)
  //         }}
  //         className='flex gap-2 my-2'
  //       >
  //         <input
  //           className='w-full p-2 rounded'
  //           type='text'
  //           placeholder='make coffee'
  //           value={newTaskText}
  //           onChange={(e) => {
  //             setErrorText('')
  //             setNewTaskText(e.target.value)
  //           }}
  //         />
  //         <button className='btn-black' type='submit'>
  //           Add
  //         </button>
  //       </form>
  //       {!!errorText && <Alert text={errorText} />}
  //       <div className='overflow-hidden bg-white rounded-md shadow'>
  //         <ul>
  //           {todos.map((todo) => (
  //             <Todo key={todo.id} todo={todo} onDelete={() => deleteTodo(todo.id)} />
  //           ))}
  //         </ul>
  //       </div>
  //     </div>
  //   )
}

// const Todo = ({ todo, onDelete }: { todo: Todos; onDelete: () => void }) => {
//   const supabase = useSupabaseClient<Database>()
//   const [isCompleted, setIsCompleted] = useState(todo.is_complete)

//   const toggle = async () => {
//     try {
//       const { data } = await supabase
//         .from('todos')
//         .update({ is_complete: !isCompleted })
//         .eq('id', todo.id)
//         .throwOnError()
//         .select()
//         .single()

//       if (data) setIsCompleted(data.is_complete)
//     } catch (error) {
//       console.log('error', error)
//     }
//   }

//   return (
//     <li className='block w-full transition duration-150 ease-in-out cursor-pointer hover:bg-200 focus:outline-none focus:bg-200'>
//       <div className='flex items-center px-4 py-4 sm:px-6'>
//         <div className='flex items-center flex-1 min-w-0'>
//           <div className='text-sm font-medium leading-5 truncate'>{todo.task}</div>
//         </div>
//         <div>
//           <input
//             className='cursor-pointer'
//             onChange={(e) => toggle()}
//             type='checkbox'
//             checked={isCompleted ? true : false}
//           />
//         </div>
//         <button
//           onClick={(e) => {
//             e.preventDefault()
//             e.stopPropagation()
//             onDelete()
//           }}
//           className='w-4 h-4 ml-2 border-2 rounded hover:border-black'
//         >
//           <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='gray'>
//             <path
//               fillRule='evenodd'
//               d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
//               clipRule='evenodd'
//             />
//           </svg>
//         </button>
//       </div>
//     </li>
//   )
// }

// const Alert = ({ text }: { text: string }) => (
//   <div className='p-4 my-3 bg-red-100 rounded-md'>
//     <div className='text-sm leading-5 text-red-700'>{text}</div>
//   </div>
// )
```

### components\ui\ToastProvider.tsx

```tsx
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Check, Info, X } from 'lucide-react'
import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void
  success: (message: string) => void
  error: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = Math.random().toString(36).substring(2, 9)
      setToasts((prev) => [...prev, { id, message, type }])
      setTimeout(() => {
        removeToast(id)
      }, 3000)
    },
    [removeToast]
  )

  const success = (message: string) => addToast(message, 'success')
  const error = (message: string) => addToast(message, 'error')

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error }}>
      {children}
      <div className='fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none'>
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  const icons = {
    success: <Check size={18} className='text-green-600' />,
    error: <X size={18} className='text-red-600' />,
    info: <Info size={18} className='text-blue-600' />,
    warning: <AlertTriangle size={18} className='text-yellow-600' />
  }

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      className={`min-w-[300px] p-4 rounded-xl shadow-lg border flex items-center gap-3 pointer-events-auto cursor-pointer ${styles[toast.type]}`}
      onClick={onClose}
    >
      <div className={`p-2 rounded-full bg-white/50 backdrop-blur-sm`}>{icons[toast.type]}</div>
      <p className='text-sm font-medium'>{toast.message}</p>
    </motion.div>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
```

### constants\roles.ts

```ts
export enum UserRole {
  HOST = 'host',
  CO_HOST = 'co_host',
  COLLABORATOR = 'collaborator',
  SUPER_ADMIN = 'super_admin',
  SUPPORT = 'support'
}

export const ROLE_PERMISSIONS = {
  [UserRole.HOST]: {
    canEdit: true,
    canPublish: true,
    canDelete: true,
    canManageBilling: true,
    canViewRSVP: true
  },
  [UserRole.CO_HOST]: {
    canEdit: true,
    canPublish: false,
    canDelete: false,
    canManageBilling: false,
    canViewRSVP: true
  },
  [UserRole.COLLABORATOR]: {
    canEdit: false,
    canPublish: false,
    canDelete: false,
    canManageBilling: false,
    canViewRSVP: true
  },
  [UserRole.SUPER_ADMIN]: {
    canEdit: true,
    canPublish: true,
    canDelete: true,
    canManageBilling: true,
    canViewRSVP: true,
    canManageUsers: true
  },
  [UserRole.SUPPORT]: {
    canEdit: false,
    canPublish: false,
    canDelete: false,
    canManageBilling: false,
    canViewRSVP: true,
    canImpersonate: true
  }
}

export const DEFAULT_ROLE = UserRole.HOST
```

### lib\data-service.ts

```ts
import { Database } from '../types/supabase'
import { supabase } from './initSupabase'

export interface Wedding extends Omit<Database['public']['Tables']['weddings']['Row'], 'content'> {
  content: WeddingContent
  template?: Template
}

export type RSVP = Database['public']['Tables']['rsvps']['Row']
export type Template = Database['public']['Tables']['templates']['Row']

export interface WeddingContent {
  groom_name?: string
  bride_name?: string
  wedding_date?: string
  wedding_time?: string
  address?: string
  map_url?: string
  images?: string[]
  bank_name?: string
  account_number?: string
  account_name?: string
  [key: string]: any
}

export const dataService = {
  getWedding: async (): Promise<Wedding | null> => {
    const {
      data: { user }
    } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('weddings')
      .select('*, template:templates(*)')
      .eq('host_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Error fetching wedding:', error)
      return null
    }

    // Kiểm tra data trước khi truy cập properties
    if (!data) {
      return null
    }

    return {
      ...data,
      content: (data.content as unknown as WeddingContent) || {}
    } as Wedding
  },

  getWeddingBySlug: async (slug: string): Promise<Wedding | null> => {
    const { data, error } = await supabase.from('weddings').select('*, template:templates(*)').eq('slug', slug).single()

    if (error) return null

    return {
      ...data,
      content: (data.content as unknown as WeddingContent) || {}
    } as Wedding
  },

  createWedding: async (): Promise<Wedding | null> => {
    const {
      data: { user }
    } = await supabase.auth.getUser()
    if (!user) return null

    // Call API to bypass RLS
    const response = await fetch('/api/create-wedding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ host_id: user.id })
    })

    if (!response.ok) {
      const err = await response.json()
      console.error('Failed to create wedding:', err)
      throw new Error(err.error || 'Failed to create')
    }
    const data = await response.json()

    return {
      ...data,
      content: (data.content as unknown as WeddingContent) || {}
    } as Wedding
  },

  updateWedding: async (weddingId: string, content: WeddingContent): Promise<Wedding | null> => {
    const { data, error } = await supabase
      .from('weddings')
      .update({ content: content })
      .eq('id', weddingId)
      .select()
      .single()

    if (error) {
      console.error('Error updating wedding:', error)
      throw error
    }

    return {
      ...data,
      content: (data.content as unknown as WeddingContent) || {}
    } as Wedding
  },

  updateWeddingTemplate: async (weddingId: string, templateId: number): Promise<void> => {
    const { error } = await supabase.from('weddings').update({ template_id: templateId }).eq('id', weddingId)
    if (error) {
      console.error('Error updating template:', error)
      throw error
    }
  },

  getRSVPs: async (weddingId: string): Promise<RSVP[]> => {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) {
      console.warn('RSVP fetch failed or empty, using mock data:', error)
      return createMockGuests(15, weddingId)
    }
    return data
  },

  getTemplates: async (): Promise<Template[]> => {
    try {
      const response = await fetch('/api/templates')
      if (!response.ok) {
        console.error('Templates API failed:', response.status)
        return []
      }
      const result = await response.json()
      if (result.success && result.data) {
        return result.data
      }
      return []
    } catch (error) {
      console.error('Template fetch failed:', error)
      return []
    }
  },

  deployWedding: async (
    weddingId: string,
    templateBranch: string = 'theme-vintage'
  ): Promise<{ success: boolean; status: string }> => {
    try {
      const response = await fetch('/api/trigger-deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weddingId, templateBranch })
      })

      if (response.ok) {
        await supabase.from('weddings').update({ deployment_status: 'published' }).eq('id', weddingId)

        return { success: true, status: 'building' }
      } else {
        console.error('Deploy failed')
        return { success: false, status: 'failed' }
      }
    } catch (e) {
      return { success: false, status: 'failed' }
    }
  },

  exportRSVPs: async (weddingId: string): Promise<void> => {
    console.log(`Exporting RSVPs for ${weddingId}`)
    console.log(`Export functionality would generate an Excel file here.`)
  },

  createRSVP: async (rsvp: Database['public']['Tables']['rsvps']['Insert']): Promise<RSVP | null> => {
    const { data, error } = await supabase.from('rsvps').insert(rsvp).select().single()

    if (error) {
      console.error('Error creating RSVP:', error)
      return null
    }
    return data
  }
}

const TEMPLATE_NAMES = [
  'Vintage Rose',
  'Modern Minimal',
  'Luxury Gold',
  'Floral Dream',
  'Korean Style',
  'Traditional Red',
  'Olive Garden',
  'Midnight Bloom',
  'Classic Ivory',
  'Warm Terracotta',
  'Ocean Breeze',
  'Sunset Bliss'
]

const TEMPLATE_BRANCHES = ['vintage', 'modern', 'minimal', 'luxury', 'classic', 'floral', 'korean', 'traditional']
const TEMPLATE_COLORS = ['#FDE68A', '#E5E7EB', '#FEF3C7', '#FCE7F3', '#DBEAFE', '#FEE2E2', '#E0F2FE', '#E7E5E4']

const createTemplateThumbnail = (name: string, subtitle: string, color: string) => {
  const safeName = name.replace(/&/g, 'and')
  const safeSubtitle = subtitle.replace(/&/g, 'and')
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="800">
      <rect width="100%" height="100%" fill="${color}"/>
      <rect x="40" y="60" width="520" height="680" rx="32" fill="rgba(255,255,255,0.6)"/>
      <text x="300" y="380" text-anchor="middle" font-size="36" font-family="Arial" fill="#374151">${safeName}</text>
      <text x="300" y="430" text-anchor="middle" font-size="20" font-family="Arial" fill="#9CA3AF">${safeSubtitle}</text>
    </svg>
  `
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const createMockTemplates = (count: number): Template[] => {
  const now = new Date().toISOString()
  return Array.from({ length: count }, (_, index) => {
    const name = TEMPLATE_NAMES[index % TEMPLATE_NAMES.length]
    const style = TEMPLATE_BRANCHES[index % TEMPLATE_BRANCHES.length]
    return {
      id: index + 1,
      name: `${name} ${index + 1}`,
      repo_branch: `theme-${style}`,
      thumbnail_url: createTemplateThumbnail(
        `${name} ${index + 1}`,
        `Theme ${style}`,
        TEMPLATE_COLORS[index % TEMPLATE_COLORS.length]
      ),
      created_at: now
    }
  })
}

const createMockGuests = (count: number, weddingId: string): RSVP[] => {
  const firstNames = [
    'An',
    'Bình',
    'Chi',
    'Dũng',
    'Em',
    'Giang',
    'Hà',
    'Khánh',
    'Lan',
    'Minh',
    'Nam',
    'Oanh',
    'Phúc',
    'Quân',
    'Sơn',
    'Thảo',
    'Uyên',
    'Vinh',
    'Xuân',
    'Yến'
  ]
  const middleNames = ['Văn', 'Thị', 'Đức', 'Ngọc', 'Hữu', 'Phương', 'Thanh', 'Hoàng', 'Minh', 'Thu']
  const lastNames = [
    'Nguyễn',
    'Trần',
    'Lê',
    'Phạm',
    'Hoàng',
    'Huỳnh',
    'Phan',
    'Vũ',
    'Võ',
    'Đặng',
    'Bùi',
    'Đỗ',
    'Hồ',
    'Ngô',
    'Dương',
    'Lý'
  ]

  const wishes = [
    'Chúc mừng hạnh phúc hai bạn!',
    'Chúc hai bạn trăm năm hạnh phúc, sớm sinh quý tử.',
    'Mãi mãi bên nhau bạn nhé!',
    'Happy Wedding! Chúc mừng ngày trọng đại.',
    'Rất tiếc không thể tham dự, chúc hai bạn hạnh phúc.',
    '',
    'Chúc mừng đám cưới!'
  ]

  return Array.from({ length: count }, (_, index) => {
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const middleName = middleNames[Math.floor(Math.random() * middleNames.length)]
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const fullName = `${lastName} ${middleName} ${firstName} - ${['Bạn cấp 3', 'Đồng nghiệp', 'Họ hàng', 'Bạn đại học'][Math.floor(Math.random() * 4)]}`
    const isAttending = Math.random() > 0.2 // 80% attending
    const hasPhone = Math.random() > 0.1 // 90% have phone

    return {
      id: index + 1000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      wedding_id: weddingId,
      guest_name: fullName,
      phone: hasPhone
        ? `09${Math.floor(Math.random() * 100000000)
            .toString()
            .padStart(8, '0')}`
        : null,
      email: null,
      party_size: Math.floor(Math.random() * 3) + 1, // 1-4 people
      is_attending: isAttending,
      wishes: wishes[Math.floor(Math.random() * wishes.length)],
      dietary_restrictions: null
    }
  })
}
```

### lib\image-processor.ts

```ts
// Helper functions to process images before saving to Supabase

export interface ProcessImagesResult {
  newImages: string[]
  uploadedCount: number
  deletedCount: number
}

/**
 * Process images: upload base64 to Cloudinary, delete removed Cloudinary images
 * @param currentImages - Current images array (may contain base64 and URLs)
 * @param previousImages - Previous images array from Supabase (URLs only)
 * @returns Processed images array with all Cloudinary URLs
 */
export async function processImages(
  currentImages: string[],
  previousImages: string[] = []
): Promise<ProcessImagesResult> {
  const newImages: string[] = []
  let uploadedCount = 0
  let deletedCount = 0

  for (const img of currentImages) {
    if (img.startsWith('data:')) {
      try {
        const blob = await fetch(img).then((r) => r.blob())
        const file = new File([blob], 'image.jpg', { type: blob.type })

        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          const data = await response.json()
          newImages.push(data.urls[0])
          uploadedCount++
        } else {
          console.error('Failed to upload image')
        }
      } catch (error) {
        console.error('Error uploading base64 image:', error)
      }
    } else {
      newImages.push(img)
    }
  }

  const removedImages = previousImages.filter(
    (oldImg) => !newImages.includes(oldImg) && (oldImg.startsWith('http://') || oldImg.startsWith('https://'))
  )

  for (const imageUrl of removedImages) {
    try {
      const response = await fetch('/api/delete-image', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageUrl })
      })

      if (response.ok) {
        deletedCount++
      }
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  return {
    newImages,
    uploadedCount,
    deletedCount
  }
}
```

### lib\initSupabase.ts

```ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
)
```

### lib\mock-service.ts

```ts
export interface Wedding {
  id: string
  host_id: string
  template_id: string
  content: {
    groom_name: string
    bride_name: string
    wedding_date: string
    wedding_time: string
    address: string
    map_url: string
    images: string[]
    bank_name: string
    account_number: string
    account_name: string
  }
  slug: string
  deployment_status: 'draft' | 'building' | 'published' | 'failed'
  repo_branch?: string
}

export interface RSVP {
  id: string
  wedding_id: string
  guest_name: string
  phone: string
  wishes: string
  is_attending: boolean
  party_size: number
  created_at: string
}

export interface Template {
  id: string
  name: string
  thumbnail_url: string
  repo_branch: string
}

const MOCK_TEMPLATES: Template[] = [
  {
    id: 'tpl_01',
    name: 'Vintage Theme',
    thumbnail_url: 'https://via.placeholder.com/300x200?text=Vintage',
    repo_branch: 'theme-vintage'
  },
  {
    id: 'tpl_02',
    name: 'Modern Theme',
    thumbnail_url: 'https://via.placeholder.com/300x200?text=Modern',
    repo_branch: 'theme-modern'
  }
]

const MOCK_WEDDING: Wedding = {
  id: 'wed_123',
  host_id: 'user_001',
  template_id: 'tpl_01',
  content: {
    groom_name: 'Minh Tuan',
    bride_name: 'Thu Hien',
    wedding_date: '2023-12-25',
    wedding_time: '18:00',
    address: 'Grand Palace, 142/18 Cong Hoa, Tan Binh, TP.HCM',
    map_url: 'https://maps.google.com',
    images: [
      'https://via.placeholder.com/400x300?text=Wedding+1',
      'https://via.placeholder.com/400x300?text=Wedding+2'
    ],
    bank_name: 'Vietcombank',
    account_number: '999988887777',
    account_name: 'NGUYEN MINH TUAN'
  },
  slug: 'tuan-hien',
  deployment_status: 'draft',
  repo_branch: 'theme-vintage'
}

const MOCK_RSVPS: RSVP[] = [
  {
    id: 'rsvp_1',
    wedding_id: 'wed_123',
    guest_name: 'Nguyen Van A',
    phone: '0909123456',
    wishes: 'Chuc mung hanh phuc!',
    is_attending: true,
    party_size: 2,
    created_at: '2023-10-01T10:00:00Z'
  },
  {
    id: 'rsvp_2',
    wedding_id: 'wed_123',
    guest_name: 'Tran Thi B',
    phone: '0909654321',
    wishes: '',
    is_attending: false,
    party_size: 0,
    created_at: '2023-10-02T11:30:00Z'
  }
]

export const mockService = {
  getWedding: async (): Promise<Wedding> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...MOCK_WEDDING }), 500)
    })
  },

  updateWedding: async (data: Partial<Wedding>): Promise<Wedding> => {
    return new Promise((resolve) => {
      // In a real app, we would merge data here
      console.log('Updating wedding:', data)
      setTimeout(() => resolve({ ...MOCK_WEDDING, ...data }), 800)
    })
  },

  getRSVPs: async (): Promise<RSVP[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_RSVPS]), 600)
    })
  },

  getTemplates: async (): Promise<Template[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_TEMPLATES]), 400)
    })
  },

  deployWedding: async (): Promise<{ success: boolean; status: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, status: 'published' })
      }, 2000)
    })
  },

  exportRSVPs: async (): Promise<void> => {
    return new Promise((resolve) => {
      console.log('Exporting RSVPs...')
      setTimeout(() => {
        alert('Mock: Downloaded rsvps.xlsx')
        resolve()
      }, 1000)
    })
  }
}
```

### lib\package-service.ts

```ts
import { supabase } from './initSupabase'

// Feature structure
export interface FeatureData {
  features: string[]
  highlight?: boolean
  description?: string
  notIncluded?: string[]
}

// Types for Package
export interface Package {
  id: number
  name: string
  price: number
  original_price: number
  duration_months: number
  max_rsvps: number
  features: FeatureData | string[] // Support both old and new format
  promotion_end_date: string
  is_active: boolean
  created_at: string
}

export interface PackageInsert {
  name: string
  price: number
  original_price: number
  duration_months: number
  max_rsvps: number
  features: FeatureData | string[]
  promotion_end_date?: string
  is_active?: boolean
}

export interface PackageUpdate {
  name?: string
  price?: number
  original_price?: number
  duration_months?: number
  max_rsvps?: number
  features?: FeatureData | string[]
  promotion_end_date?: string
  is_active?: boolean
}

// Types for Template (already in DB)
export interface Template {
  id: number
  name: string
  repo_branch: string
  thumbnail_url: string | null
  created_at: string
}

export interface PackageWithTemplates extends Package {
  templates: Template[]
}

export const packageService = {
  /**
   * GET: Lấy tất cả packages kèm templates
   */
  getAllPackages: async (): Promise<PackageWithTemplates[]> => {
    const { data: packages, error: pkgError } = await supabase
      .from('packages')
      .select('*')
      .order('price', { ascending: true })

    if (pkgError || !packages) {
      console.error('Error fetching packages:', pkgError)
      throw pkgError || new Error('No packages found')
    }

    // Fetch templates cho từng package
    const packagesWithTemplates = await Promise.all(
      packages.map(async (pkg) => {
        const { data: ptData } = await supabase.from('package_templates').select('template_id').eq('package_id', pkg.id)

        const templateIds = ptData?.map((pt) => pt.template_id) || []

        if (templateIds.length === 0) {
          return { ...pkg, templates: [] }
        }

        const { data: templates } = await supabase.from('templates').select('*').in('id', templateIds)

        return {
          ...pkg,
          templates: templates || []
        }
      })
    )

    return packagesWithTemplates
  },

  /**
   * GET: Lấy thông tin 1 package
   */
  getPackageById: async (id: number): Promise<Package | null> => {
    const { data, error } = await supabase.from('packages').select('*').eq('id', id).single()

    if (error) {
      console.error('Error fetching package:', error)
      return null
    }

    return data
  },

  /**
   * POST: Tạo package mới
   */
  createPackage: async (packageData: PackageInsert): Promise<Package> => {
    const { data, error } = await supabase.from('packages').insert(packageData).select().single()

    if (error) {
      console.error('Error creating package:', error)
      throw error
    }

    return data
  },

  /**
   * PUT/PATCH: Cập nhật package
   */
  updatePackage: async (id: number, packageData: PackageUpdate): Promise<Package> => {
    // Check package tồn tại trước
    const { data: existing, error: checkError } = await supabase.from('packages').select('id').eq('id', id).single()

    if (checkError || !existing) {
      throw new Error(`Package with ID ${id} not found`)
    }

    // Update package
    const { data, error } = await supabase.from('packages').update(packageData).eq('id', id).select().single()

    if (error) {
      console.error('Error updating package:', error)
      throw error
    }

    return data
  },

  /**
   * PATCH: Toggle is_active status
   */
  toggleActive: async (id: number, isActive: boolean): Promise<Package> => {
    const { data, error } = await supabase
      .from('packages')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error toggling package active status:', error)
      throw error
    }

    return data
  },

  /**
   * DELETE: Xóa package
   */
  deletePackage: async (id: number): Promise<boolean> => {
    // Check package tồn tại trước
    const { data: existing, error: checkError } = await supabase.from('packages').select('id').eq('id', id).single()

    if (checkError || !existing) {
      throw new Error(`Package with ID ${id} not found`)
    }

    // Delete package
    const { error } = await supabase.from('packages').delete().eq('id', id)

    if (error) {
      console.error('Error deleting package:', error)
      throw error
    }

    return true
  }
}
```

### lib\plan-store.ts

```ts
export type Plan = {
  id: string
  name: string
  price: number
  duration?: string
  description: string
  features: string[]
  notIncluded: string[]
  highlight?: boolean
  isActive?: boolean
  discountPrice?: number
  discountEndsAt?: string
}

const STORAGE_KEY = 'moimoi_plans_v1'
const FOREVER_DISCOUNT_ENDS_AT = '2099-12-31T23:59:59.999Z'

const DEFAULT_PLANS: Plan[] = [
  {
    id: 'student',
    name: 'Sinh Viên',
    price: 250000,
    duration: '6 tháng',
    description: 'Ưu đãi cho lễ tốt nghiệp, sinh nhật và đám cưới nhỏ',
    features: ['5 Mẫu thiệp cơ bản', 'Giới hạn 50 khách mời RSVP', 'Lưu trữ trong 6 tháng', 'Có logo MoiMoi Studio'],
    notIncluded: ['Nhạc nền', 'Bản đồ chỉ đường', 'QR Mừng cưới', 'Hiệu ứng mở thiệp'],
    highlight: false,
    isActive: true,
    discountPrice: 150000,
    discountEndsAt: FOREVER_DISCOUNT_ENDS_AT
  },
  {
    id: 'basic',
    name: 'Gói Cơ Bản',
    price: 800000,
    duration: '2 năm',
    description: 'Đầy đủ tính năng cần thiết cho một đám cưới.',
    features: [
      'Kho 20+ mẫu thiệp Premium',
      'Giới hạn 100 khách mời RSVP',
      'Không giới hạn khách RSVP',
      'Tích hợp Bản đồ & QR Mừng cưới',
      'Nhạc nền tùy chọn',
      'Lưu trữ 2 năm'
    ],
    notIncluded: ['Hỗ trợ thay đổi thiết kế'],
    highlight: true,
    isActive: true,
    discountPrice: 500000,
    discountEndsAt: FOREVER_DISCOUNT_ENDS_AT
  },
  {
    id: 'advanced',
    name: 'Gói Nâng Cao',
    price: 999000,
    duration: '3 năm',
    description: 'Tùy chỉnh nâng cao, thể hiện phong cách riêng của bạn.',
    features: [
      'Mọi tính năng của Gói Cơ Bản',
      'Giới hạn 250 khách mời RSVP',
      'Hỗ trợ thay đổi thiết kế (màu sắc, font chữ)',
      'Hiệu ứng mở thiệp độc đáo',
      'Lưu trữ 3 năm'
    ],
    notIncluded: ['Sở hữu slug tùy chọn', 'Hỗ trợ setup 1-1', 'Thiết kế theo yêu cầu'],
    highlight: false,
    isActive: true,
    discountPrice: 699000,
    discountEndsAt: FOREVER_DISCOUNT_ENDS_AT
  },
  {
    id: 'premium',
    name: 'Gói Cao Cấp',
    price: 1699000,
    duration: '5 năm',
    description: 'Sự hoàn hảo và hỗ trợ tận răng từ đội ngũ.',
    features: [
      'Mọi tính năng của Gói Cơ Bản & Nâng cao',
      'Giới hạn 500 khách mời RSVP',
      'Thiết kế thiệp theo yêu cầu',
      'Sở hữu slug tùy chọn (moimoi.io.vn/yourname)',
      'Tùy chỉnh màu sắc/font chữ theo yêu cầu',
      'Chuyên viên hỗ trợ setup 1-1',
      'Lưu trữ 5 năm'
    ],
    notIncluded: [],
    highlight: false,
    isActive: true,
    discountPrice: 1299000,
    discountEndsAt: FOREVER_DISCOUNT_ENDS_AT
  }
]

const clonePlans = (plans: Plan[]) =>
  plans.map((plan) => ({
    ...plan,
    features: [...plan.features],
    notIncluded: [...plan.notIncluded]
  }))

export const getDefaultPlans = () => clonePlans(DEFAULT_PLANS)

export const getPlans = (): Plan[] => {
  if (typeof window === 'undefined') {
    return getDefaultPlans()
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return getDefaultPlans()
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return getDefaultPlans()
    return clonePlans(parsed)
  } catch (err) {
    return getDefaultPlans()
  }
}

export const savePlans = (plans: Plan[]) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
}

export const formatVnd = (price: number) => {
  return `${price.toLocaleString('vi-VN')}đ`
}

export const isDiscountActive = (plan: Plan) => {
  if (!plan.discountPrice || !plan.discountEndsAt) return false
  return new Date(plan.discountEndsAt).getTime() > Date.now()
}

export const generatePlanId = (name: string) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
```

### lib\schema.ts

```ts
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          id: number
          inserted_at: string
          is_complete: boolean | null
          task: string | null
          user_id: string
        }
        Insert: {
          id?: number
          inserted_at?: string
          is_complete?: boolean | null
          task?: string | null
          user_id: string
        }
        Update: {
          id?: number
          inserted_at?: string
          is_complete?: boolean | null
          task?: string | null
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
```

### lib\useWedding.ts

```ts
import { useCallback, useEffect, useState } from 'react'
import { Wedding, dataService } from './data-service'

export const useWedding = () => {
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchWedding = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await dataService.getWedding()
      setWedding(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    const run = async () => {
      try {
        const data = await dataService.getWedding()
        if (!active) return
        setWedding(data)
      } catch (err) {
        if (!active) return
        setError(err as Error)
      } finally {
        if (active) setLoading(false)
      }
    }
    run()
    return () => {
      active = false
    }
  }, [])

  return { wedding, setWedding, loading, error, refetch: fetchWedding }
}
```

### pages\admin\index.tsx

```tsx
import Pagination from '@/components/common/Pagination'
import StudioLayout from '@/components/studio/StudioLayout'
import { Activity, Ban, MoreVertical, Search, Shield, UserCheck } from 'lucide-react'
import { useState } from 'react'

// Mock Data
const MOCK_USERS = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'vana@gmail.com',
    role: 'User',
    status: 'Active',
    plan: 'Free',
    created: '2023-10-10'
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'b.tran@yahoo.com',
    role: 'User',
    status: 'Active',
    plan: 'Premium',
    created: '2023-10-12'
  },
  {
    id: 3,
    name: 'Lê Văn C',
    email: 'levanc@company.com',
    role: 'User',
    status: 'Banned',
    plan: 'Free',
    created: '2023-10-15'
  },
  {
    id: 4,
    name: 'Admin User',
    email: 'admin@moimoi.vn',
    role: 'Super Admin',
    status: 'Active',
    plan: 'Unlimited',
    created: '2023-01-01'
  },
  {
    id: 5,
    name: 'Finance Staff',
    email: 'finance@moimoi.vn',
    role: 'Accountant',
    status: 'Active',
    plan: 'Unlimited',
    created: '2023-01-01'
  }
]

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  return (
    <StudioLayout>
      <div className='space-y-6'>
        {/* Header inside Content */}
        <div className='flex items-center justify-between mb-2'>
          {/* ... Existing header ... */}
          <div className='flex items-center gap-3'>
            <div className='bg-gray-900 text-white p-2 rounded-lg'>
              <Shield size={24} />
            </div>
            <h1 className='text-2xl font-bold font-serif text-gray-900'>Admin Portal</h1>
          </div>
          <div className='text-sm text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm'>Super Admin Mode</div>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='text-gray-500 text-xs font-bold uppercase tracking-wider mb-2'>Tổng User</div>
            <div className='text-3xl font-bold'>12,345</div>
            <div className='text-green-500 text-sm mt-1 flex items-center gap-1'>
              <Activity size={14} /> +12% tháng này
            </div>
          </div>
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='text-gray-500 text-xs font-bold uppercase tracking-wider mb-2'>Đám Cưới Mới</div>
            <div className='text-3xl font-bold'>850</div>
            <div className='text-green-500 text-sm mt-1'>+5% tuần này</div>
          </div>
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='text-gray-500 text-xs font-bold uppercase tracking-wider mb-2'>User Premium</div>
            <div className='text-3xl font-bold text-pink-600'>432</div>
            <div className='text-gray-400 text-sm mt-1'>3.5% conversion</div>
          </div>
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='text-gray-500 text-xs font-bold uppercase tracking-wider mb-2'>Report / Spam</div>
            <div className='text-3xl font-bold text-red-600'>12</div>
            <div className='text-red-400 text-sm mt-1'>Cần xử lý</div>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* System Config */}
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <h3 className='font-bold text-gray-900 mb-4 flex items-center gap-2'>
              <Activity size={18} className='text-blue-500' /> System Status
            </h3>
            <div className='space-y-4'>
              <div className='flex items-center justify-between p-3 bg-gray-50 rounded-xl'>
                <div>
                  <div className='font-bold text-sm'>Bảo Trì Hệ Thống</div>
                  <div className='text-xs text-gray-500'>Chặn truy cập user, chỉ admin login</div>
                </div>
                <div className='relative inline-flex items-center cursor-pointer'>
                  <input type='checkbox' className='sr-only peer' />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </div>
              <div className='flex items-center justify-between p-3 bg-gray-50 rounded-xl'>
                <div>
                  <div className='font-bold text-sm'>Cho phép đăng ký mới</div>
                  <div className='text-xs text-gray-500'>Người lạ có thể tạo tài khoản</div>
                </div>
                <div className='relative inline-flex items-center cursor-pointer'>
                  <input type='checkbox' className='sr-only peer' defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Log */}
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <h3 className='font-bold text-gray-900 mb-4 flex items-center gap-2'>
              <Shield size={18} className='text-purple-500' /> Admin Audit Log
            </h3>
            <div className='space-y-3'>
              {[
                { action: 'Approved Refund #TRX-993', user: 'Finance', time: '10 min ago' },
                { action: 'Banned user "Spammer123"', user: 'Super Admin', time: '1 hour ago' },
                { action: 'Updated System Config', user: 'Tech Lead', time: '2 hours ago' }
              ].map((log, i) => (
                <div
                  key={i}
                  className='flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0'
                >
                  <div>
                    <span className='font-medium text-gray-800'>{log.action}</span>
                    <div className='text-xs text-gray-400'>{log.user}</div>
                  </div>
                  <span className='text-xs text-gray-400'>{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
          <div className='p-6 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4'>
            <h2 className='text-lg font-bold'>Quản Lý Người Dùng</h2>
            <div className='relative'>
              <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
              <input
                type='text'
                placeholder='Tìm kiếm user...'
                className='pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full text-left'>
              <thead className='bg-gray-50 text-gray-500 text-xs font-bold uppercase'>
                <tr>
                  <th className='px-6 py-4'>User Info</th>
                  <th className='px-6 py-4'>Role</th>
                  <th className='px-6 py-4'>Status</th>
                  <th className='px-6 py-4'>Plan</th>
                  <th className='px-6 py-4'>Joined</th>
                  <th className='px-6 py-4 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50'>
                {MOCK_USERS.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((user) => (
                  <tr key={user.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4'>
                      <div className='font-bold text-gray-900'>{user.name}</div>
                      <div className='text-gray-500 text-sm'>{user.email}</div>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-600'>
                        {user.role}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      {user.status === 'Active' ? (
                        <span className='text-green-600 text-xs font-bold flex items-center gap-1'>
                          <UserCheck size={14} /> Active
                        </span>
                      ) : (
                        <span className='text-red-600 text-xs font-bold flex items-center gap-1'>
                          <Ban size={14} /> Banned
                        </span>
                      )}
                    </td>
                    <td className='px-6 py-4'>
                      {user.plan === 'Premium' ? (
                        <span className='text-pink-600 font-bold text-sm'>Premium 👑</span>
                      ) : (
                        <span className='text-gray-500 text-sm'>Free</span>
                      )}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-500'>{user.created}</td>
                    <td className='px-6 py-4 text-right'>
                      <button className='p-2 text-blue-600 hover:text-blue-800' onClick={() => setSelectedUser(user)}>
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={MOCK_USERS.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            itemLabel='người dùng'
            accentColor='blue'
          />
        </div>
      </div>

      {/* Subscription Modal */}
      {selectedUser && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
          <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' onClick={() => setSelectedUser(null)}></div>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50'>
              <h3 className='font-bold text-lg'>Quản Lý Gói Dịch Vụ</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className='text-gray-400 hover:text-gray-600 text-2xl leading-none'
              >
                &times;
              </button>
            </div>
            <div className='p-6 space-y-4'>
              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg'>
                  {selectedUser.name[0]}
                </div>
                <div>
                  <div className='font-bold text-gray-900'>{selectedUser.name}</div>
                  <div className='text-sm text-gray-500'>{selectedUser.email}</div>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <label className='text-xs font-bold text-gray-500 uppercase'>Gói Hiện Tại</label>
                  <select
                    className='w-full border border-gray-200 rounded-lg p-2 font-medium'
                    defaultValue={selectedUser.plan}
                  >
                    <option value='Free'>Free Plan</option>
                    <option value='Premium'>Premium Plan (1 Year)</option>
                    <option value='Lifetime'>Lifetime Access</option>
                  </select>
                </div>
                <div className='space-y-1'>
                  <label className='text-xs font-bold text-gray-500 uppercase'>Trạng Thái</label>
                  <select
                    className='w-full border border-gray-200 rounded-lg p-2 font-medium'
                    defaultValue={selectedUser.status}
                  >
                    <option value='Active'>Active</option>
                    <option value='Suspended'>Suspended</option>
                    <option value='Banned'>Banned</option>
                  </select>
                </div>
              </div>

              <div className='bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-sm text-yellow-800'>
                <strong>Lưu ý:</strong> Việc thay đổi gói sẽ có hiệu lực ngay lập tức. Email thông báo sẽ được gửi cho
                khách hàng.
              </div>
            </div>
            <div className='px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3'>
              <button
                onClick={() => setSelectedUser(null)}
                className='px-4 py-2 text-gray-600 font-bold text-sm hover:bg-gray-100 rounded-lg'
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  alert('Cập nhật thành công!')
                  setSelectedUser(null)
                }}
                className='px-4 py-2 bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-200'
              >
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </StudioLayout>
  )
}
```

### pages\api\create-payment.ts

```ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { VNPay, ProductCode, VnpLocale, HashAlgorithm } from 'vnpay'
import { supabase } from '@/lib/initSupabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { planId, planName, amount, weddingId } = req.body

  if (!planId || !amount || !weddingId) {
    return res.status(400).json({ error: 'Missing planId, amount, or weddingId' })
  }

  try {
    // Generate unique order code
    const orderCode = `ORD-${Date.now()}`

    // 0. Resolve numeric package_id: planId is now the DB packages.id as string
    const numericPackageId = Number(planId)
    if (!numericPackageId || isNaN(numericPackageId)) {
      return res.status(400).json({ error: `planId không hợp lệ: "${planId}"` })
    }

    // Verify the package exists and get duration
    const { data: packageRow, error: packageError } = await supabase
      .from('packages')
      .select('id, duration_months')
      .eq('id', numericPackageId)
      .single()

    if (packageError || !packageRow) {
      console.error('Package lookup error:', packageError)
      return res.status(400).json({ error: `Không tìm thấy gói trong hệ thống` })
    }

    // Compute expires_at from duration_months
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + (packageRow.duration_months ?? 12))

    // 1. Create pending order in Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_code: orderCode,
        wedding_id: weddingId,
        package_id: numericPackageId,
        amount: amount,
        payment_method: 'VNPAY',
        status: 'pending',
        expires_at: expiresAt.toISOString(),
        payment_info: { plan_id: planId, plan_name: planName }
      })
      .select()
      .single()

    if (orderError) {
      console.error('Create order error:', orderError)
      return res.status(500).json({ error: 'Không thể tạo đơn hàng' })
    }

    // 2. Build VNPay payment URL
    const vnpay = new VNPay({
      tmnCode: process.env.VNPAY_TMN_CODE || '',
      secureSecret: process.env.VNPAY_HASH_SECRET || '',
      vnpayHost: 'https://sandbox.vnpayment.vn',
      testMode: true,
      hashAlgorithm: HashAlgorithm.SHA512,
      enableLog: true
    })

    // Use order.id as txnRef so we can look it up on return
    const txnRef = order.id

    const returnUrl = process.env.VNPAY_RETURN_URL || 'http://localhost:3000/api/vnpay-return'

    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_IpAddr: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1',
      vnp_ReturnUrl: returnUrl,
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: `Thanh toan goi ${planName || planId} - ${orderCode}`,
      vnp_OrderType: ProductCode.Other,
      vnp_Locale: VnpLocale.VN
    })

    return res.status(200).json({ paymentUrl, orderId: order.id })
  } catch (error: any) {
    console.error('VNPay create payment error:', error)
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
}
```

### pages\api\create-wedding.ts

```ts
import { createClient } from '@supabase/supabase-js'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { host_id } = req.body
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Missing Supabase Service Key or URL' })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  try {
    const { data, error } = await supabase
      .from('weddings')
      .insert({
        host_id,
        content: {},
        template_id: 1, // Default
        deployment_status: 'draft'
      })
      .select()
      .single()

    if (error) {
      console.error('Insert error details:', error)
      throw error
    }

    res.status(200).json(data)
  } catch (err: any) {
    console.error('Create handler error:', err)
    res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
}
```

### pages\api\delete-image.ts

```ts
import { NextApiRequest, NextApiResponse } from 'next'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { imageUrl } = req.body

    if (!imageUrl || typeof imageUrl !== 'string') {
      return res.status(400).json({ error: 'Image URL is required' })
    }

    const urlParts = imageUrl.split('/upload/')
    if (urlParts.length < 2) {
      return res.status(400).json({ error: 'Invalid Cloudinary URL' })
    }

    const pathAfterUpload = urlParts[1]
    const pathParts = pathAfterUpload.split('/')
    const publicIdParts = pathParts.slice(1)
    const publicIdWithExt = publicIdParts.join('/')
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '')

    const result = await cloudinary.uploader.destroy(publicId)

    if (result.result === 'ok' || result.result === 'not found') {
      return res.status(200).json({
        success: true,
        message: 'Image deleted successfully',
        result: result.result
      })
    } else {
      return res.status(500).json({
        error: 'Failed to delete image from Cloudinary',
        result: result.result
      })
    }
  } catch (error) {
    console.error('Delete error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
```

### pages\api\get-packages.ts

```ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/initSupabase'
import { Plan } from '@/lib/plan-store'

function durationLabel(months: number): string {
  if (months < 12) return `${months} tháng`
  const years = months / 12
  return Number.isInteger(years) ? `${years} năm` : `${months} tháng`
}

function parseFeatures(raw: unknown): {
  features: string[]
  notIncluded: string[]
  description?: string
  highlight?: boolean
} {
  if (!raw) return { features: [], notIncluded: [] }

  // Array of strings → treat all as features
  if (Array.isArray(raw)) {
    return { features: raw.map(String), notIncluded: [] }
  }

  // Object with known keys
  if (typeof raw === 'object' && raw !== null) {
    const obj = raw as Record<string, unknown>
    const features = Array.isArray(obj.features) ? obj.features.map(String) : []
    const notIncluded = Array.isArray(obj.notIncluded)
      ? obj.notIncluded.map(String)
      : Array.isArray(obj.not_included)
        ? (obj.not_included as unknown[]).map(String)
        : []
    const description = typeof obj.description === 'string' ? obj.description : undefined
    const highlight = typeof obj.highlight === 'boolean' ? obj.highlight : undefined
    return { features, notIncluded, description, highlight }
  }

  return { features: [], notIncluded: [] }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { data: packages, error } = await supabase
    .from('packages')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true })

  if (error) {
    console.error('Fetch packages error:', error)
    return res.status(500).json({ error: 'Không thể tải danh sách gói' })
  }

  const plans: Plan[] = (packages ?? []).map((pkg) => {
    const { features, notIncluded, description, highlight } = parseFeatures(pkg.features)

    // price = selling price, original_price = strikethrough price
    const hasDiscount = pkg.original_price != null && pkg.original_price > pkg.price

    return {
      id: String(pkg.id),
      name: pkg.name,
      price: hasDiscount ? (pkg.original_price as number) : pkg.price,
      discountPrice: hasDiscount ? pkg.price : undefined,
      discountEndsAt: pkg.promotion_end_date ?? undefined,
      duration: pkg.duration_months ? durationLabel(pkg.duration_months) : undefined,
      description: description ?? '',
      features,
      notIncluded,
      highlight: highlight ?? false,
      isActive: pkg.is_active
    }
  })

  return res.status(200).json({ plans })
}
```

### pages\api\hello.ts

```ts
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({ name: 'John Doe' })
}
```

### pages\api\packages\[id].ts

```ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { packageService } from '../../../lib/package-service'

/**
 * GET    /api/packages/[id] - Lấy thông tin 1 package
 * PUT    /api/packages/[id] - Cập nhật package
 * DELETE /api/packages/[id] - Xóa package
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  // Validate ID
  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Package ID is required'
    })
  }

  const packageId = parseInt(id, 10)

  if (isNaN(packageId)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid package ID format'
    })
  }

  // GET: Lấy thông tin 1 package
  if (req.method === 'GET') {
    try {
      const packageData = await packageService.getPackageById(packageId)

      if (!packageData) {
        return res.status(404).json({
          success: false,
          error: 'Package not found'
        })
      }

      return res.status(200).json({
        success: true,
        data: packageData
      })
    } catch (error: any) {
      console.error('GET Error:', error)
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    }
  }

  // PUT/PATCH: Cập nhật package
  if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const packageData = req.body

      const updatedPackage = await packageService.updatePackage(packageId, packageData)

      return res.status(200).json({
        success: true,
        data: updatedPackage,
        message: 'Package updated successfully'
      })
    } catch (error: any) {
      console.error('UPDATE Error:', error)

      if (error.message?.includes('no rows')) {
        return res.status(404).json({
          success: false,
          error: 'Package not found'
        })
      }

      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    }
  }

  // DELETE: Xóa package
  if (req.method === 'DELETE') {
    try {
      await packageService.deletePackage(packageId)

      return res.status(200).json({
        success: true,
        message: 'Package deleted successfully'
      })
    } catch (error: any) {
      console.error('DELETE Error:', error)

      if (error.message?.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: 'Package not found'
        })
      }

      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' })
}
```

### pages\api\packages.ts

```ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { packageService } from '../../lib/package-service'

/**
 * GET  /api/packages - Lấy tất cả packages
 * POST /api/packages - Tạo package mới
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET: Lấy tất cả packages
  if (req.method === 'GET') {
    try {
      const packages = await packageService.getAllPackages()

      return res.status(200).json({
        success: true,
        data: packages,
        count: packages.length
      })
    } catch (error: any) {
      console.error('GET Error:', error)
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    }
  }

  // POST: Tạo package mới
  if (req.method === 'POST') {
    try {
      const packageData = req.body

      // Validate required fields
      if (!packageData.name || packageData.price === undefined) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: name, price'
        })
      }

      const newPackage = await packageService.createPackage(packageData)

      return res.status(201).json({
        success: true,
        data: newPackage,
        message: 'Package created successfully'
      })
    } catch (error: any) {
      console.error('POST Error:', error)
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' })
}
```

### pages\api\save-packages.ts

```ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/initSupabase'
import { Plan } from '@/lib/plan-store'

/**
 * POST /api/save-packages - Lưu tất cả packages vào database
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { plans } = req.body as { plans: Plan[] }

    if (!Array.isArray(plans)) {
      return res.status(400).json({ error: 'Invalid plans data' })
    }

    // Lấy tất cả packages hiện có trong database
    const { data: existingPackages, error: fetchError } = await supabase.from('packages').select('id')

    if (fetchError) {
      console.error('Error fetching existing packages:', fetchError)
      return res.status(500).json({ error: 'Không thể tải danh sách gói hiện có' })
    }

    const existingIds = new Set((existingPackages || []).map((pkg) => String(pkg.id)))
    const planIds = new Set(plans.map((p) => p.id).filter((id) => !isNaN(parseInt(id))))

    // Xóa các packages không còn trong danh sách (chỉ xóa những gói có ID là số)
    const idsToDelete = Array.from(existingIds).filter((id) => !planIds.has(id))
    if (idsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('packages')
        .delete()
        .in(
          'id',
          idsToDelete.map((id) => parseInt(id))
        )

      if (deleteError) {
        console.error('Error deleting packages:', deleteError)
      }
    }

    // Upsert từng package
    const results = await Promise.all(
      plans.map(async (plan) => {
        try {
          // Parse features object
          const featuresObj: Record<string, any> = {
            features: plan.features || [],
            notIncluded: plan.notIncluded || [],
            description: plan.description || '',
            highlight: plan.highlight || false
          }

          // Determine price and original_price based on discount
          const hasDiscount = plan.discountPrice != null && plan.discountPrice > 0
          const price = hasDiscount ? plan.discountPrice : plan.price
          const originalPrice = hasDiscount ? plan.price : null

          // Parse duration to months
          let durationMonths: number | null = null
          if (plan.duration) {
            const lowerDuration = plan.duration.toLowerCase()
            if (lowerDuration.includes('tháng')) {
              const match = lowerDuration.match(/(\d+)\s*tháng/)
              if (match) durationMonths = parseInt(match[1])
            } else if (lowerDuration.includes('năm')) {
              const match = lowerDuration.match(/(\d+)\s*năm/)
              if (match) durationMonths = parseInt(match[1]) * 12
            } else if (lowerDuration.includes('vĩnh viễn') || lowerDuration.includes('forever')) {
              durationMonths = 9999
            }
          }

          const packageId = parseInt(plan.id)
          const isNewPackage = isNaN(packageId)

          if (isNewPackage) {
            // Insert new package
            const { data, error } = await supabase
              .from('packages')
              .insert({
                name: plan.name,
                price: price,
                original_price: originalPrice,
                duration_months: durationMonths,
                features: featuresObj,
                is_active: plan.isActive !== false,
                promotion_end_date: plan.discountEndsAt || null
              })
              .select()
              .single()

            if (error) {
              console.error(`Error inserting package ${plan.name}:`, error)
              return { success: false, id: plan.id, error: error.message }
            }

            return { success: true, id: plan.id, data }
          } else {
            // Update existing package
            const { data, error } = await supabase
              .from('packages')
              .update({
                name: plan.name,
                price: price,
                original_price: originalPrice,
                duration_months: durationMonths,
                features: featuresObj,
                is_active: plan.isActive !== false,
                promotion_end_date: plan.discountEndsAt || null
              })
              .eq('id', packageId)
              .select()
              .single()

            if (error) {
              console.error(`Error updating package ${plan.id}:`, error)
              return { success: false, id: plan.id, error: error.message }
            }

            return { success: true, id: plan.id, data }
          }
        } catch (err: any) {
          console.error(`Error processing package ${plan.id}:`, err)
          return { success: false, id: plan.id, error: err.message }
        }
      })
    )

    const failed = results.filter((r) => !r.success)
    if (failed.length > 0) {
      console.error('Failed packages:', failed)
      return res.status(500).json({
        success: false,
        error: `Không thể lưu ${failed.length} gói`,
        details: failed
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Đã lưu tất cả gói thành công',
      count: results.length
    })
  } catch (error: any) {
    console.error('Error saving packages:', error)
    return res.status(500).json({
      success: false,
      error: 'Lỗi server khi lưu packages',
      message: error.message
    })
  }
}
```

### pages\api\templates\[id].ts

```ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

/**
 * GET /api/templates/[id] - Lấy chi tiết template kèm packages
 * PATCH /api/templates/[id] - Cập nhật template và packages liên kết
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const templateId = parseInt(id as string)

  if (isNaN(templateId)) {
    return res.status(400).json({ error: 'Invalid template ID' })
  }

  if (req.method === 'GET') {
    try {
      // Lấy thông tin template
      const { data: template, error: templateError } = await supabase
        .from('templates')
        .select('*')
        .eq('id', templateId)
        .single()

      if (templateError) throw templateError
      if (!template) {
        return res.status(404).json({ error: 'Template not found' })
      }

      // Lấy packages liên kết
      const { data: packageTemplates, error: ptError } = await supabase
        .from('package_templates')
        .select('package_id, packages(id, name, price, original_price, duration_months, is_active)')
        .eq('template_id', templateId)

      if (ptError) throw ptError

      const packages = packageTemplates?.map((pt: any) => pt.packages).filter(Boolean) || []

      return res.status(200).json({
        success: true,
        data: {
          ...template,
          packages
        }
      })
    } catch (error: any) {
      console.error('GET Template Error:', error)
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    }
  }

  if (req.method === 'PATCH' || req.method === 'PUT') {
    try {
      const {
        name,
        repo_branch,
        thumbnail_url,
        is_active,
        package_ids // Mảng ID của packages mà template sẽ thuộc về
      } = req.body

      // Chuẩn bị dữ liệu cập nhật template
      const updateData: any = {}
      if (name !== undefined) updateData.name = name
      if (repo_branch !== undefined) updateData.repo_branch = repo_branch
      if (thumbnail_url !== undefined) updateData.thumbnail_url = thumbnail_url
      if (is_active !== undefined) updateData.is_active = is_active

      // Cập nhật template nếu có dữ liệu
      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabase.from('templates').update(updateData).eq('id', templateId)

        if (updateError) throw updateError
      }

      // Cập nhật quan hệ với packages nếu có package_ids
      if (package_ids !== undefined && Array.isArray(package_ids)) {
        // Xóa tất cả quan hệ cũ
        const { error: deleteError } = await supabase.from('package_templates').delete().eq('template_id', templateId)

        if (deleteError) throw deleteError

        // Thêm quan hệ mới
        if (package_ids.length > 0) {
          const insertData = package_ids.map((pkgId: number) => ({
            template_id: templateId,
            package_id: pkgId
          }))

          const { error: insertError } = await supabase.from('package_templates').insert(insertData)

          if (insertError) throw insertError
        }
      }

      // Lấy dữ liệu mới sau khi cập nhật
      const { data: updatedTemplate, error: fetchError } = await supabase
        .from('templates')
        .select('*')
        .eq('id', templateId)
        .single()

      if (fetchError) throw fetchError

      // Lấy packages liên kết mới
      const { data: packageTemplates, error: ptError } = await supabase
        .from('package_templates')
        .select('package_id, packages(id, name, price, original_price, duration_months, is_active)')
        .eq('template_id', templateId)

      if (ptError) throw ptError

      const packages = packageTemplates?.map((pt: any) => pt.packages).filter(Boolean) || []

      return res.status(200).json({
        success: true,
        data: {
          ...updatedTemplate,
          packages
        },
        message: 'Template updated successfully'
      })
    } catch (error: any) {
      console.error('PATCH Template Error:', error)
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
```

### pages\api\templates.ts

```ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

/**
 * GET /api/templates - Lấy tất cả templates kèm packages
 * POST /api/templates - Tạo template mới
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { package_id } = req.query

      // Lấy tất cả templates
      const { data: templates, error: templatesError } = await supabase
        .from('templates')
        .select('*')
        .order('id', { ascending: true })

      if (templatesError) throw templatesError

      // Lấy package_templates để map templates với packages
      const { data: packageTemplates, error: ptError } = await supabase
        .from('package_templates')
        .select('template_id, package_id, packages(id, name, price, original_price, duration_months, is_active)')

      if (ptError) throw ptError

      // Map templates với packages
      const templatesWithPackages = templates.map((template) => {
        const relatedPackages = packageTemplates
          .filter((pt: any) => pt.template_id === template.id)
          .map((pt: any) => pt.packages)
          .filter(Boolean)

        return {
          ...template,
          packages: relatedPackages
        }
      })

      // Filter theo package_id nếu có
      let result = templatesWithPackages
      if (package_id && typeof package_id === 'string') {
        const pkgId = parseInt(package_id)
        result = templatesWithPackages.filter((t) => t.packages.some((p: any) => p.id === pkgId))
      }

      return res.status(200).json({
        success: true,
        data: result,
        count: result.length
      })
    } catch (error: any) {
      console.error('GET Templates Error:', error)
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, repo_branch, thumbnail_url, is_active, package_ids } = req.body

      if (!name || !repo_branch) {
        return res.status(400).json({ error: 'Name and repo_branch are required' })
      }

      // Tạo template mới
      const { data: newTemplate, error: insertError } = await supabase
        .from('templates')
        .insert({
          name,
          repo_branch,
          thumbnail_url: thumbnail_url || null,
          is_active: is_active !== undefined ? is_active : true
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Thêm quan hệ với packages nếu có
      if (package_ids && Array.isArray(package_ids) && package_ids.length > 0) {
        const insertData = package_ids.map((pkgId: number) => ({
          template_id: newTemplate.id,
          package_id: pkgId
        }))

        const { error: ptError } = await supabase.from('package_templates').insert(insertData)

        if (ptError) throw ptError
      }

      // Lấy template với packages
      const { data: packageTemplates, error: ptError } = await supabase
        .from('package_templates')
        .select('package_id, packages(id, name, price, original_price, duration_months, is_active)')
        .eq('template_id', newTemplate.id)

      if (ptError) throw ptError

      const packages = packageTemplates?.map((pt: any) => pt.packages).filter(Boolean) || []

      return res.status(201).json({
        success: true,
        data: {
          ...newTemplate,
          packages
        },
        message: 'Template created successfully'
      })
    } catch (error: any) {
      console.error('POST Template Error:', error)
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
```

### pages\api\trigger-deploy.ts

```ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { weddingId, templateBranch } = req.body
  const GITHUB_PAT = process.env.GITHUB_PAT // Token GitHub (Classic) có quyền 'repo'
  const REPO_OWNER = 'MoiMoi-std'
  const REPO_NAME = 'moimoi.std'

  try {
    const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${GITHUB_PAT}`
      },
      body: JSON.stringify({
        event_type: 'deploy_wedding_trigger',
        client_payload: {
          wedding_id: weddingId,
          template_branch: templateBranch || 'theme-vintage'
        }
      })
    })

    if (response.status === 204) {
      res.status(200).json({ message: 'Deployment triggered successfully' })
    } else {
      const errorText = await response.text()
      res.status(500).json({ error: errorText })
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
```

### pages\api\upload-image.ts

```ts
import { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

// Disable bodyParser to use formidable
export const config = {
  api: {
    bodyParser: false
  }
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const form = formidable({
      multiples: true,
      maxFileSize: 10 * 1024 * 1024
    })

    const [fields, files] = await form.parse(req)

    const uploadedFiles = files.file
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const uploadedUrls: string[] = []

    for (const file of uploadedFiles) {
      try {
        const result = await cloudinary.uploader.upload(file.filepath, {
          folder: 'moimoi',
          resource_type: 'auto',
          transformation: [{ width: 1920, height: 1080, crop: 'limit' }, { quality: 'auto:good' }]
        })

        uploadedUrls.push(result.secure_url)
        fs.unlinkSync(file.filepath)
      } catch (uploadError) {
        console.error('Error uploading to Cloudinary:', uploadError)
      }
    }

    if (uploadedUrls.length === 0) {
      return res.status(500).json({ error: 'Failed to upload images to Cloudinary' })
    }
    return res.status(200).json({
      success: true,
      urls: uploadedUrls
    })
  } catch (error) {
    console.error('Upload error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
```

### pages\api\vnpay-return.ts

```ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { VNPay, HashAlgorithm } from 'vnpay'
import { supabase } from '@/lib/initSupabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const vnpay = new VNPay({
      tmnCode: process.env.VNPAY_TMN_CODE || '',
      secureSecret: process.env.VNPAY_HASH_SECRET || '',
      vnpayHost: 'https://sandbox.vnpayment.vn',
      testMode: true,
      hashAlgorithm: HashAlgorithm.SHA512,
      enableLog: true
    })

    const verify = vnpay.verifyReturnUrl(req.query as any)

    const orderId = req.query.vnp_TxnRef as string
    const responseCode = req.query.vnp_ResponseCode as string
    const transactionNo = req.query.vnp_TransactionNo as string
    const vnpAmount = req.query.vnp_Amount as string

    if (verify.isVerified && verify.isSuccess) {
      // 1. Fetch the order to get wedding_id and plan info
      const { data: order } = await supabase.from('orders').select('*').eq('id', orderId).single()

      if (order) {
        const paymentInfo = (order.payment_info as any) || {}
        const planId = paymentInfo.plan_id || ''
        const planName = paymentInfo.plan_name || ''

        // Get wedding to extract host_id for created_by
        let createdBy = null
        if (order.wedding_id) {
          const { data: wedding } = await supabase
            .from('weddings')
            .select('host_id')
            .eq('id', order.wedding_id)
            .single()
          createdBy = wedding?.host_id || null
        }

        // 2. Insert transaction record first
        const { data: transactionData, error: transactionError } = await supabase
          .from('transactions')
          .insert({
            transaction_code: transactionNo,
            customer: order.wedding_id,
            service: `Goi ${planName || planId}`,
            amount: order.amount,
            payment_gateway: 'VNPAY',
            status: 'success',
            transaction_date: new Date().toISOString().split('T')[0],
            created_by: createdBy
          })
          .select()
          .single()

        if (transactionError) {
          console.error('❌ Transaction insert error:', transactionError)
        } else {
          console.log('✅ Transaction inserted successfully:', transactionData)
        }

        // 3. Update order status to 'paid' and save transaction id
        await supabase
          .from('orders')
          .update({
            status: 'paid',
            transaction_id: transactionData?.id ? String(transactionData.id) : null,
            paid_at: new Date().toISOString(),
            payment_info: {
              ...paymentInfo,
              vnp_response_code: responseCode,
              vnp_transaction_no: transactionNo,
              vnp_amount: vnpAmount
            }
          })
          .eq('id', orderId)

        // 4. Update wedding plan
        if (order.wedding_id) {
          const { data: wedding } = await supabase
            .from('weddings')
            .select('content')
            .eq('id', order.wedding_id)
            .single()

          if (wedding) {
            const content = (wedding.content as any) || {}
            await supabase
              .from('weddings')
              .update({
                content: {
                  ...content,
                  plan: planId,
                  plan_activated_at: new Date().toISOString(),
                  vnpay_txn_ref: orderId,
                  vnpay_transaction_no: transactionNo
                }
              })
              .eq('id', order.wedding_id)
          }
        }

        // Redirect to success page
        const params = new URLSearchParams({
          status: 'success',
          plan: planId,
          orderId: orderId,
          transactionNo: transactionNo || '',
          amount: vnpAmount || ''
        })
        return res.redirect(302, `/studio/payment-result?${params.toString()}`)
      }
    }

    // Payment failed or order not found
    const params = new URLSearchParams({
      status: 'failed',
      orderId: orderId || '',
      code: responseCode || 'unknown',
      message: verify.isVerified ? 'Giao dịch không thành công' : 'Xác thực chữ ký thất bại'
    })

    // Update order status to failed
    if (orderId) {
      await supabase.from('orders').update({ status: 'failed' }).eq('id', orderId)
    }

    return res.redirect(302, `/studio/payment-result?${params.toString()}`)
  } catch (error: any) {
    console.error('VNPay return verification error:', error)
    return res.redirect(
      302,
      `/studio/payment-result?status=failed&message=${encodeURIComponent('Lỗi xác thực thanh toán')}`
    )
  }
}
```

### pages\care\index.tsx

```tsx
import Pagination from '@/components/common/Pagination'
import StudioLayout from '@/components/studio/StudioLayout'
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  Eye,
  FileSpreadsheet,
  Flag,
  Headset,
  MessageSquare,
  PlusCircle,
  Search,
  ThumbsDown,
  Upload
} from 'lucide-react'
import { useState } from 'react'

// Mock Data for Tickets
const TICKETS = [
  {
    id: 'TCK-001',
    user: 'vana@gmail.com',
    plan: 'Free',
    subject: 'Lỗi không upload được ảnh',
    priority: 'High',
    status: 'Open',
    created: '10 mins ago'
  },
  {
    id: 'TCK-002',
    user: 'b.tran@yahoo.com',
    plan: 'Premium',
    subject: 'Hỏi về gói Premium',
    priority: 'Medium',
    status: 'In Progress',
    created: '1 hour ago'
  },
  {
    id: 'TCK-003',
    user: 'customer@gmail.com',
    plan: 'Free',
    subject: 'Muốn đổi mẫu thiệp',
    priority: 'Low',
    status: 'Open',
    created: '2 hours ago'
  }
]

// Mock Data for Moderation
const MODERATION_QUEUE = [
  {
    id: 'WED-999',
    user: 'spam_user@bot.com',
    reason: 'Nội dung quảng cáo',
    content_preview: 'Mua bán nhà đất giá rẻ...',
    status: 'Pending'
  },
  {
    id: 'WED-888',
    user: 'couple_autochuyen@gmail.com',
    reason: 'Hình ảnh nhạy cảm',
    content_preview: '[Image attachment]',
    status: 'Pending'
  }
]

// Mock Data for Marketing
const MARKETING_LEADS = [
  {
    id: 'LEA-001',
    name: 'Ngọc Lan',
    source: 'Facebook',
    interest: 'Premium Plan',
    status: 'New',
    last_msg: 'Giá gói Premium bao nhiêu ạ?'
  },
  {
    id: 'LEA-002',
    name: 'Minh Hùng',
    source: 'Zalo',
    interest: 'Custom Domain',
    status: 'Contacted',
    last_msg: 'Đã gửi báo giá, chờ phản hồi.'
  }
]

// Mock Data for Concierge
const CONCIERGE_TASKS = [
  {
    id: 'CON-112',
    user: 'lan.nguyen@test.com',
    type: 'Import Excel',
    count: 145,
    status: 'Pending',
    file: 'danh_sach_khach_moi_v1.xlsx'
  },
  { id: 'CON-113', user: 'tuan.le@gmail.com', type: 'Manual Entry', count: 20, status: 'Completed', file: '-' },
  {
    id: 'CON-114',
    user: 'hoa.pham@test.com',
    type: 'Import Excel',
    count: 89,
    status: 'Pending',
    file: 'guests_export.csv'
  },
  { id: 'CON-115', user: 'minh.vu@gmail.com', type: 'Manual Entry', count: 50, status: 'Completed', file: '-' },
  {
    id: 'CON-116',
    user: 'linh.tran@test.com',
    type: 'Import Excel',
    count: 200,
    status: 'Pending',
    file: 'wedding_guests_final.xlsx'
  },
  {
    id: 'CON-117',
    user: 'quan.do@test.com',
    type: 'Import Excel',
    count: 75,
    status: 'Completed',
    file: 'invite_list.xlsx'
  }
]

export default function CustomerCareDashboard() {
  const [activeTab, setActiveTab] = useState<'tickets' | 'moderation' | 'marketing' | 'concierge'>('tickets')
  const [conciergePage, setConciergePage] = useState(1)
  const conciergeItemsPerPage = 3

  return (
    <StudioLayout>
      <div className='space-y-8'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='bg-blue-600 text-white p-2 rounded-lg'>
              <Headset size={24} />
            </div>
            <h1 className='text-2xl font-bold font-serif text-gray-900'>Customer Care & Marketing</h1>
          </div>
          <div className='text-sm text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm'>Support Agent</div>
        </div>

        {/* Support Stats */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='text-gray-500 text-xs font-bold uppercase tracking-wider mb-2'>Đang chờ xử lý</div>
            <div className='text-3xl font-bold text-orange-500'>5</div>
            <div className='text-gray-400 text-sm mt-1'>Tickets</div>
          </div>
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='text-gray-500 text-xs font-bold uppercase tracking-wider mb-2'>Lead Mới (Fanpage)</div>
            <div className='text-3xl font-bold text-blue-500'>12</div>
            <div className='text-gray-400 text-sm mt-1'>Cần tư vấn ngay</div>
          </div>
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='text-gray-500 text-xs font-bold uppercase tracking-wider mb-2'>Duyệt nội dung</div>
            <div className='text-3xl font-bold text-red-500'>{MODERATION_QUEUE.length}</div>
            <div className='text-gray-400 text-sm mt-1'>Pending items</div>
          </div>
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='text-gray-500 text-xs font-bold uppercase tracking-wider mb-2'>Import Data</div>
            <div className='text-3xl font-bold text-indigo-500'>{CONCIERGE_TASKS.length}</div>
            <div className='text-gray-400 text-sm mt-1'>Pending requests</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className='flex space-x-2 border-b border-gray-200 pb-1 overflow-x-auto'>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 font-bold text-sm transition-colors relative whitespace-nowrap ${activeTab === 'tickets' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Hỗ Trợ Kỹ Thuật
            {activeTab === 'tickets' && <div className='absolute bottom-[-5px] left-0 w-full h-0.5 bg-blue-600'></div>}
          </button>
          <button
            onClick={() => setActiveTab('marketing')}
            className={`px-4 py-2 font-bold text-sm transition-colors relative whitespace-nowrap ${activeTab === 'marketing' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Tư Vấn & Marketing
            {activeTab === 'marketing' && (
              <div className='absolute bottom-[-5px] left-0 w-full h-0.5 bg-blue-600'></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('concierge')}
            className={`px-4 py-2 font-bold text-sm transition-colors relative whitespace-nowrap ${activeTab === 'concierge' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Hỗ Trợ Nhập Liệu
            {activeTab === 'concierge' && (
              <div className='absolute bottom-[-5px] left-0 w-full h-0.5 bg-blue-600'></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-4 py-2 font-bold text-sm transition-colors relative whitespace-nowrap ${activeTab === 'moderation' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Kiểm Duyệt Nội Dung
            {activeTab === 'moderation' && (
              <div className='absolute bottom-[-5px] left-0 w-full h-0.5 bg-blue-600'></div>
            )}
          </button>
        </div>

        {/* Main Content Area */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]'>
          {activeTab === 'tickets' && (
            <div>
              <div className='p-6 border-b border-gray-100 flex justify-between items-center'>
                <h2 className='text-lg font-bold'>Danh Sách Yêu Cầu (Tickets)</h2>
                <button className='flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100'>
                  <Clock size={16} /> History
                </button>
              </div>
              <div className='divide-y divide-gray-50'>
                {TICKETS.map((ticket) => (
                  <div
                    key={ticket.id}
                    className='p-6 hover:bg-gray-50 transition-colors flex justify-between items-center group cursor-pointer'
                  >
                    <div className='flex items-start gap-4'>
                      <div
                        className={`mt-1 p-2 rounded-full ${ticket.status === 'Open' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}
                      >
                        <MessageSquare size={18} />
                      </div>
                      <div>
                        <div className='font-bold text-gray-900 mb-1'>
                          {ticket.subject} <span className='text-xs text-gray-400 font-normal'>#{ticket.id}</span>
                        </div>
                        <div className='text-sm text-gray-500 mb-2 flex items-center gap-2'>
                          From: <span className='font-medium text-gray-700'>{ticket.user}</span>
                          {ticket.plan === 'Premium' && (
                            <span className='px-1.5 py-0.5 bg-pink-100 text-pink-700 text-[10px] font-bold uppercase rounded border border-pink-200'>
                              Premium
                            </span>
                          )}
                          {ticket.plan === 'Free' && (
                            <span className='px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded border border-gray-200'>
                              Free
                            </span>
                          )}
                        </div>
                        <div className='flex items-center gap-2'>
                          {ticket.priority === 'High' && (
                            <span className='px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold uppercase rounded'>
                              High Priority
                            </span>
                          )}
                          <span className='text-xs text-gray-400'>{ticket.created}</span>
                        </div>
                      </div>
                    </div>
                    <button className='opacity-0 group-hover:opacity-100 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg hover:bg-blue-700 transition-all'>
                      Phản hồi
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'marketing' && (
            <div>
              <div className='p-6 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4'>
                <div>
                  <h2 className='text-lg font-bold'>Tư Vấn & Leads (Fanpage/Zalo)</h2>
                  <p className='text-sm text-gray-500'>Quản lý tin nhắn từ khách hàng tiềm năng</p>
                </div>
                <div className='flex gap-2'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-2.5 text-gray-400' size={16} />
                    <input
                      type='text'
                      placeholder='Tìm tên/sđt...'
                      className='pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm'
                    />
                  </div>
                  <button className='flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-bold hover:bg-pink-700 shadow-sm'>
                    <PlusCircle size={16} /> Tạo Đơn Mới
                  </button>
                </div>
              </div>
              <div className='divide-y divide-gray-50'>
                {MARKETING_LEADS.map((lead) => (
                  <div key={lead.id} className='p-6 hover:bg-gray-50 transition-colors'>
                    <div className='flex justify-between items-start'>
                      <div className='flex gap-4'>
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${lead.source === 'Facebook' ? 'bg-blue-600' : 'bg-blue-400'}`}
                        >
                          {lead.source === 'Facebook' ? 'f' : 'Z'}
                        </div>
                        <div>
                          <div className='font-bold text-gray-900 text-lg'>{lead.name}</div>
                          <div className='text-sm text-gray-500 flex items-center gap-2'>
                            Nguồn: {lead.source}
                            <span className='w-1 h-1 bg-gray-300 rounded-full'></span>
                            Quan tâm: <span className='font-medium text-pink-600'>{lead.interest}</span>
                          </div>
                          <div className='mt-2 bg-gray-100 p-3 rounded-lg rounded-tl-none text-sm text-gray-700 inline-block relative border border-gray-200'>
                            {lead.last_msg}
                          </div>
                        </div>
                      </div>
                      <div className='flex flex-col gap-2'>
                        <button className='px-4 py-2 border border-gray-200 text-gray-700 font-bold text-sm rounded-lg hover:bg-white hover:border-gray-300'>
                          Chat Fanpage
                        </button>
                        <button className='px-4 py-2 bg-green-50 text-green-700 font-bold text-sm rounded-lg hover:bg-green-100 border border-green-100'>
                          Chốt Đơn
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'concierge' && (
            <div>
              <div className='p-6 border-b border-gray-100 flex justify-between items-center'>
                <h2 className='text-lg font-bold'>Dịch Vụ Hỗ Trợ Nhập Liệu (Concierge)</h2>
                <button className='flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm'>
                  <PlusCircle size={16} /> Tạo Yêu Cầu Mới
                </button>
              </div>

              <div className='p-6'>
                {/* Import Tool */}
                <div className='bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8'>
                  <h3 className='font-bold text-indigo-900 mb-2 flex items-center gap-2'>
                    <FileSpreadsheet size={18} /> Công Cụ Import Excel
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='col-span-1'>
                      <label className='block text-xs font-bold text-gray-500 uppercase mb-1'>
                        Bước 1: Chọn Khách Hàng
                      </label>
                      <div className='relative'>
                        <Search className='absolute left-3 top-2.5 text-gray-400' size={16} />
                        <input
                          type='text'
                          placeholder='Email người dùng...'
                          className='w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white'
                        />
                      </div>
                    </div>
                    <div className='col-span-2'>
                      <label className='block text-xs font-bold text-gray-500 uppercase mb-1'>
                        Bước 2: Upload File (.xlsx, .csv)
                      </label>
                      <div className='border-2 border-dashed border-indigo-200 rounded-lg p-4 bg-white flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 transition-colors'>
                        <Upload className='text-indigo-400 mb-2' size={24} />
                        <div className='text-sm font-medium text-indigo-900'>
                          Kéo thả file vào đây hoặc click để chọn
                        </div>
                        <div className='text-xs text-gray-400 mt-1'>Hỗ trợ Excel Template v2.0</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Tasks */}
                <h3 className='font-bold text-gray-900 mb-4'>Hoạt Động Gần Đây</h3>
                <div className='bg-white border border-gray-200 rounded-xl overflow-hidden'>
                  <table className='w-full text-left'>
                    <thead className='bg-gray-50 text-gray-500 text-xs font-bold uppercase'>
                      <tr>
                        <th className='px-6 py-3'>ID</th>
                        <th className='px-6 py-3'>Loại Yêu Cầu</th>
                        <th className='px-6 py-3'>Khách Hàng</th>
                        <th className='px-6 py-3'>Số Lượng</th>
                        <th className='px-6 py-3'>Trạng Thái</th>
                        <th className='px-6 py-3 text-right'>Action</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-50'>
                      {CONCIERGE_TASKS.slice(
                        (conciergePage - 1) * conciergeItemsPerPage,
                        conciergePage * conciergeItemsPerPage
                      ).map((task) => (
                        <tr key={task.id} className='hover:bg-gray-50'>
                          <td className='px-6 py-4 font-mono text-xs text-gray-500'>{task.id}</td>
                          <td className='px-6 py-4 font-medium text-gray-900 flex items-center gap-2'>
                            {task.type === 'Import Excel' ? (
                              <FileSpreadsheet size={16} className='text-green-600' />
                            ) : (
                              <Database size={16} className='text-blue-600' />
                            )}
                            {task.type}
                          </td>
                          <td className='px-6 py-4 text-sm text-gray-600'>{task.user}</td>
                          <td className='px-6 py-4 font-bold'>{task.count}</td>
                          <td className='px-6 py-4'>
                            {task.status === 'Completed' ? (
                              <span className='text-green-600 text-xs font-bold border border-green-200 bg-green-50 px-2 py-0.5 rounded'>
                                Hoàn thành
                              </span>
                            ) : (
                              <span className='text-orange-600 text-xs font-bold border border-orange-200 bg-orange-50 px-2 py-0.5 rounded'>
                                Đang xử lý
                              </span>
                            )}
                          </td>
                          <td className='px-6 py-4 text-right'>
                            <button className='text-blue-600 text-xs font-bold hover:underline'>Chi tiết</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  currentPage={conciergePage}
                  totalItems={CONCIERGE_TASKS.length}
                  itemsPerPage={conciergeItemsPerPage}
                  onPageChange={setConciergePage}
                  itemLabel='yêu cầu'
                  accentColor='indigo'
                />
              </div>
            </div>
          )}

          {activeTab === 'moderation' && (
            <div>
              <div className='p-6 border-b border-gray-100 flex justify-between items-center'>
                <h2 className='text-lg font-bold'>Hàng Chờ Kiểm Duyệt</h2>
                <div className='text-sm text-orange-500 font-medium flex items-center gap-2'>
                  <AlertCircle size={16} /> Cần xử lý gấp
                </div>
              </div>
              <div className='divide-y divide-gray-50'>
                {MODERATION_QUEUE.map((item) => (
                  <div key={item.id} className='p-6'>
                    <div className='flex justify-between items-start mb-4'>
                      <div>
                        <div className='font-bold text-gray-900 flex items-center gap-2'>
                          <Flag size={16} className='text-red-500' />
                          Báo cáo vi phạm: {item.reason}
                        </div>
                        <div className='text-sm text-gray-500 mt-1'>User: {item.user}</div>
                      </div>
                      <a href='#' className='text-blue-600 text-sm font-bold hover:underline flex items-center gap-1'>
                        <Eye size={16} /> Xem trang thật
                      </a>
                    </div>
                    <div className='bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 text-sm text-gray-600 italic'>
                      &quot;{item.content_preview}&quot;
                    </div>
                    <div className='flex justify-end gap-3'>
                      <button className='flex items-center gap-2 px-4 py-2 border border-green-200 bg-green-50 text-green-700 rounded-lg text-sm font-bold hover:bg-green-100'>
                        <CheckCircle size={16} /> Bỏ qua (An toàn)
                      </button>
                      <button className='flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 shadow-sm'>
                        <ThumbsDown size={16} /> Gỡ bỏ & Cảnh báo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </StudioLayout>
  )
}
```

### pages\finance\index.tsx

```tsx
import Pagination from '@/components/common/Pagination'
import StudioLayout from '@/components/studio/StudioLayout'
import { ArrowUpRight, CreditCard, DollarSign, Download, FileText, Filter, PlusCircle, Search, X } from 'lucide-react'
import { useState } from 'react'

const TRANSACTIONS = [
  {
    id: 'TRX-9821',
    user: 'vana@gmail.com',
    amount: 490000,
    plan: 'Premium (1 Year)',
    date: '2023-11-20',
    status: 'Success',
    method: 'Momo'
  },
  {
    id: 'TRX-9822',
    user: 'lan.nguyen@test.com',
    amount: 490000,
    plan: 'Premium (1 Year)',
    date: '2023-11-20',
    status: 'Pending',
    method: 'Bank Transfer'
  },
  {
    id: 'TRX-9823',
    user: 'hoang.pham@dev.io',
    amount: 99000,
    plan: 'Template: Vintage',
    date: '2023-11-19',
    status: 'Failed',
    method: 'Visa'
  },
  {
    id: 'TRX-9824',
    user: 'quynh.rose@mail.com',
    amount: 490000,
    plan: 'Premium (1 Year)',
    date: '2023-11-19',
    status: 'Success',
    method: 'VietQR'
  },
  {
    id: 'TRX-9825',
    user: 'minh.tri@startup.co',
    amount: 490000,
    plan: 'Premium (1 Year)',
    date: '2023-11-18',
    status: 'Success',
    method: 'Momo'
  },
  {
    id: 'TRX-9826',
    user: 'minh.tri@startup.co',
    amount: 490000,
    plan: 'Premium (1 Year)',
    date: '2023-11-18',
    status: 'Success',
    method: 'Momo'
  },
  {
    id: 'TRX-9827',
    user: 'minh.tri@startup.co',
    amount: 490000,
    plan: 'Premium (1 Year)',
    date: '2023-11-18',
    status: 'Success',
    method: 'Momo'
  },
  {
    id: 'TRX-9828',
    user: 'minh.tri@startup.co',
    amount: 490000,
    plan: 'Premium (1 Year)',
    date: '2023-11-18',
    status: 'Success',
    method: 'Momo'
  },
  {
    id: 'TRX-9829',
    user: 'minh.tri@startup.co',
    amount: 490000,
    plan: 'Premium (1 Year)',
    date: '2023-11-18',
    status: 'Success',
    method: 'Momo'
  },
  {
    id: 'TRX-9830',
    user: 'minh.tri@startup.co',
    amount: 490000,
    plan: 'Premium (1 Year)',
    date: '2023-11-18',
    status: 'Success',
    method: 'Momo'
  },
  {
    id: 'TRX-9831',
    user: 'minh.tri@startup.co',
    amount: 490000,
    plan: 'Premium (1 Year)',
    date: '2023-11-18',
    status: 'Success',
    method: 'Momo'
  }
]

// Mock data cho nhật ký thu chi
const JOURNAL_ENTRIES = [
  {
    id: 'JNL-001',
    purpose: 'Thanh toán hosting tháng 11',
    amount: -350000,
    content: 'Gia hạn hosting AWS cho hệ thống',
    type: 'expense',
    date: '2023-11-15'
  },
  {
    id: 'JNL-002',
    purpose: 'Doanh thu gói Premium',
    amount: 490000,
    content: 'Khách hàng vana@gmail.com nâng cấp gói Premium',
    type: 'income',
    date: '2023-11-20'
  },
  {
    id: 'JNL-003',
    purpose: 'Chi phí marketing Facebook Ads',
    amount: -800000,
    content: 'Chạy quảng cáo Facebook tháng 11',
    type: 'expense',
    date: '2023-11-12'
  },
  {
    id: 'JNL-004',
    purpose: 'Doanh thu template',
    amount: 99000,
    content: 'Bán template Vintage cho khách hàng',
    type: 'income',
    date: '2023-11-19'
  },
  {
    id: 'JNL-005',
    purpose: 'Chi phí văn phòng',
    amount: -500000,
    content: 'Thuê văn phòng làm việc tháng 11',
    type: 'expense',
    date: '2023-11-01'
  }
]

export default function FinanceDashboard() {
  const [activeTab, setActiveTab] = useState<'history' | 'journal'>('history')
  const [currentPage, setCurrentPage] = useState(1)
  const [journalPage, setJournalPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [entries, setEntries] = useState(JOURNAL_ENTRIES)
  const [searchTerm, setSearchTerm] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    purpose: '',
    amount: '',
    content: '',
    type: 'income' as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0]
  })

  // Filter state
  const [filterData, setFilterData] = useState({
    startDate: '',
    endDate: '',
    type: 'all' as 'all' | 'income' | 'expense'
  })

  // Filtered entries
  const filteredEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.date)
    const start = filterData.startDate ? new Date(filterData.startDate) : null
    const end = filterData.endDate ? new Date(filterData.endDate) : null

    const dateMatch = (!start || entryDate >= start) && (!end || entryDate <= end)
    const typeMatch = filterData.type === 'all' || entry.type === filterData.type
    const searchMatch = searchTerm === '' || entry.id.toLowerCase().includes(searchTerm.toLowerCase())

    return dateMatch && typeMatch && searchMatch
  })

  const itemsPerPage = 5

  const handleAddEntry = () => {
    const newEntry = {
      id: `JNL-${String(entries.length + 1).padStart(3, '0')}`,
      purpose: formData.purpose,
      amount: formData.type === 'income' ? Number(formData.amount) : -Number(formData.amount),
      content: formData.content,
      type: formData.type,
      date: formData.date
    }
    setEntries([newEntry, ...entries])
    setShowAddModal(false)
    // Reset form
    setFormData({
      purpose: '',
      amount: '',
      content: '',
      type: 'income',
      date: new Date().toISOString().split('T')[0]
    })
  }

  const exportToExcel = () => {
    // Tạo CSV content
    const headers = ['Mã GD', 'Mục đích', 'Số tiền', 'Nội dung', 'Loại', 'Ngày']
    const rows = entries.map((entry) => [
      entry.id,
      entry.purpose,
      entry.amount.toLocaleString('vi-VN'),
      entry.content,
      entry.type === 'income' ? 'Thu' : 'Chi',
      entry.date
    ])

    let csvContent = headers.join(',') + '\n'
    rows.forEach((row) => {
      csvContent += row.map((cell) => `"${cell}"`).join(',') + '\n'
    })

    // Download file
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `nhat-ky-thu-chi-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <StudioLayout>
      <div className='space-y-8'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='bg-green-600 text-white p-2 rounded-lg'>
              <DollarSign size={24} />
            </div>
            <h1 className='text-2xl font-bold font-serif text-gray-900'>Finance Dashboard</h1>
          </div>
          <div className='text-sm text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm'>Kế Toán Viên</div>
        </div>

        {/* Revenue Overview */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='flex justify-between items-start mb-4'>
              <div>
                <div className='text-gray-500 text-xs font-bold uppercase tracking-wider'>Doanh Thu Tháng</div>
                <div className='text-3xl font-bold text-gray-900 mt-1'>45,290,000 ₫</div>
              </div>
              <div className='bg-green-50 text-green-600 p-2 rounded-lg'>
                <ArrowUpRight size={20} />
              </div>
            </div>
            <div className='text-sm text-green-600 font-medium'>+18.2% so với tháng trước</div>
          </div>

          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='flex justify-between items-start mb-4'>
              <div>
                <div className='text-gray-500 text-xs font-bold uppercase tracking-wider'>Giao Dịch Chờ Duyệt</div>
                <div className='text-3xl font-bold text-orange-500 mt-1'>12</div>
              </div>
              <div className='bg-orange-50 text-orange-500 p-2 rounded-lg'>
                <FileText size={20} />
              </div>
            </div>
            <div className='text-sm text-gray-500 font-medium'>Cần xử lý trong 24h</div>
          </div>

          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='flex justify-between items-start mb-4'>
              <div>
                <div className='text-gray-500 text-xs font-bold uppercase tracking-wider'>Tổng Đơn Hàng</div>
                <div className='text-3xl font-bold text-gray-900 mt-1'>1,204</div>
              </div>
              <div className='bg-purple-50 text-purple-600 p-2 rounded-lg'>
                <CreditCard size={20} />
              </div>
            </div>
            <div className='text-sm text-gray-500 font-medium'>Conversion rate: 4.2%</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className='flex space-x-2 border-b border-gray-200 pb-1 overflow-x-auto'>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-bold text-sm transition-colors relative whitespace-nowrap ${
              activeTab === 'history' ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Lịch Sử Giao Dịch
            {activeTab === 'history' && <div className='absolute bottom-[-5px] left-0 w-full h-0.5 bg-green-600'></div>}
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`px-4 py-2 font-bold text-sm transition-colors relative whitespace-nowrap ${
              activeTab === 'journal' ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Nhật Ký Thu Chi
            {activeTab === 'journal' && <div className='absolute bottom-[-5px] left-0 w-full h-0.5 bg-green-600'></div>}
          </button>
        </div>

        {/* Tab Content */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]'>
          {activeTab === 'history' && (
            <div>
              <div className='p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4'>
                <h2 className='text-lg font-bold'>Lịch Sử Giao Dịch</h2>
                <div className='flex gap-2'>
                  <button className='flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-bold hover:bg-pink-700 shadow-sm'>
                    <FileText size={16} /> Tạo Hóa Đơn Mới
                  </button>
                  <button className='flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50'>
                    <Filter size={16} /> Lọc
                  </button>
                  <button className='flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800'>
                    <Download size={16} /> Xuất Báo Cáo
                  </button>
                </div>
              </div>

              <div className='overflow-x-auto'>
                <table className='w-full text-left'>
                  <thead className='bg-gray-50 text-gray-500 text-xs font-bold uppercase'>
                    <tr>
                      <th className='px-6 py-4'>Mã GD</th>
                      <th className='px-6 py-4'>Khách Hàng</th>
                      <th className='px-6 py-4'>Dịch Vụ</th>
                      <th className='px-6 py-4'>Số Tiền</th>
                      <th className='px-6 py-4'>Cổng TT</th>
                      <th className='px-6 py-4'>Trạng Thái</th>
                      <th className='px-6 py-4 min-w-[140px]'>Ngày</th>
                      {/* <th className='px-6 py-4 text-right'>Action</th> */}
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-50'>
                    {TRANSACTIONS.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((trx) => (
                      <tr key={trx.id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 font-mono text-sm text-gray-600'>{trx.id}</td>
                        <td className='px-6 py-4 font-medium text-gray-900'>{trx.user}</td>
                        <td className='px-6 py-4 text-sm text-gray-600'>{trx.plan}</td>
                        <td className='px-6 py-4 font-bold text-gray-900'>{trx.amount.toLocaleString('vi-VN')} ₫</td>
                        <td className='px-6 py-4 text-sm text-gray-500'>{trx.method}</td>
                        <td className='px-6 py-4'>
                          {trx.status === 'Success' && (
                            <span className='inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold'>
                              Success
                            </span>
                          )}
                          {trx.status === 'Pending' && (
                            <span className='inline-flex items-center px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-bold'>
                              Pending
                            </span>
                          )}
                          {trx.status === 'Failed' && (
                            <span className='inline-flex items-center px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold'>
                              Failed
                            </span>
                          )}
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-500 min-w-[140px] whitespace-nowrap'>{trx.date}</td>
                        {/* <td className='px-6 py-4 text-right'>
                          <div className='flex justify-end gap-2'>
                            {trx.status === 'Pending' ? (
                              <button className='px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700'>
                                Duyệt
                              </button>
                            ) : trx.status === 'Success' ? (
                              <>
                                <button
                                  className='px-3 py-1 border border-gray-300 text-gray-600 text-xs font-bold rounded hover:bg-gray-50'
                                  title='Xuất hóa đơn'
                                >
                                  <FileText size={14} />
                                </button>
                                <button
                                  className='px-3 py-1 border border-red-200 text-red-600 text-xs font-bold rounded hover:bg-red-50'
                                  title='Hoàn tiền'
                                >
                                  Refund
                                </button>
                              </>
                            ) : (
                              <button className='text-gray-400 text-xs hover:text-gray-600'>Chi tiết</button>
                            )}
                          </div>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={currentPage}
                totalItems={TRANSACTIONS.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                itemLabel='giao dịch'
                accentColor='green'
              />
            </div>
          )}

          {activeTab === 'journal' && (
            <div>
              <div className='p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4'>
                <h2 className='text-lg font-bold'>Nhật Ký Thu Chi</h2>
                <div className='flex gap-2 flex-wrap'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
                    <input
                      type='text'
                      placeholder='Tìm mã giao dịch...'
                      className='pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 text-sm'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className='flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-bold hover:bg-pink-700 shadow-sm'
                  >
                    <PlusCircle size={16} /> Thêm Giao Dịch
                  </button>
                  <button
                    onClick={() => setShowFilterModal(true)}
                    className='flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50'
                  >
                    <Filter size={16} /> Lọc
                  </button>
                  <button
                    onClick={exportToExcel}
                    className='flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800'
                  >
                    <Download size={16} /> Xuất Excel
                  </button>
                </div>
              </div>

              <div className='overflow-x-auto'>
                <table className='w-full text-left'>
                  <thead className='bg-gray-50 text-gray-500 text-xs font-bold uppercase'>
                    <tr>
                      <th className='px-6 py-4'>Mã GD</th>
                      <th className='px-6 py-4'>Mục Đích</th>
                      <th className='px-6 py-4'>Số Tiền</th>
                      <th className='px-6 py-4'>Nội Dung</th>
                      <th className='px-6 py-4'>Loại</th>
                      <th className='px-6 py-4 min-w-[140px]'>Ngày</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-50'>
                    {filteredEntries
                      .slice((journalPage - 1) * itemsPerPage, journalPage * itemsPerPage)
                      .map((entry) => (
                        <tr key={entry.id} className='hover:bg-gray-50'>
                          <td className='px-6 py-4 font-mono text-sm text-gray-600'>{entry.id}</td>
                          <td className='px-6 py-4 font-medium text-gray-900'>{entry.purpose}</td>
                          <td className='px-6 py-4'>
                            <span className={`font-bold ${entry.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {entry.amount > 0 ? '+' : ''}
                              {entry.amount.toLocaleString('vi-VN')} ₫
                            </span>
                          </td>
                          <td className='px-6 py-4 text-sm text-gray-600'>{entry.content}</td>
                          <td className='px-6 py-4'>
                            {entry.type === 'income' ? (
                              <span className='inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold'>
                                Thu
                              </span>
                            ) : (
                              <span className='inline-flex items-center px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold'>
                                Chi
                              </span>
                            )}
                          </td>
                          <td className='px-6 py-4 text-sm text-gray-500 min-w-[140px] whitespace-nowrap'>
                            {entry.date}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={journalPage}
                totalItems={filteredEntries.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setJournalPage}
                itemLabel='giao dịch'
                accentColor='green'
              />
            </div>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
          <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' onClick={() => setShowAddModal(false)}></div>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-pink-600'>
              <h3 className='font-bold text-lg text-white'>Thêm Giao Dịch Thu Chi</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className='text-white hover:text-pink-100 text-2xl leading-none'
              >
                <X size={24} />
              </button>
            </div>
            <div className='p-6 space-y-4'>
              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Loại Giao Dịch</label>
                <div className='grid grid-cols-2 gap-3'>
                  <button
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                    className={`px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                      formData.type === 'income'
                        ? 'bg-pink-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Thu
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                    className={`px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                      formData.type === 'expense'
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Chi
                  </button>
                </div>
              </div>

              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Mục Đích</label>
                <input
                  type='text'
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                  placeholder='VD: Thanh toán hosting'
                />
              </div>

              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Số Tiền (₫)</label>
                <input
                  type='number'
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                  placeholder='500000'
                />
              </div>

              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Nội Dung</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                  placeholder='Mô tả chi tiết về giao dịch'
                  rows={3}
                />
              </div>

              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Ngày</label>
                <input
                  type='date'
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                />
              </div>
            </div>
            <div className='px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3'>
              <button
                onClick={() => setShowAddModal(false)}
                className='px-4 py-2 text-gray-600 font-bold text-sm hover:bg-gray-100 rounded-lg'
              >
                Hủy
              </button>
              <button
                onClick={handleAddEntry}
                className='px-4 py-2 bg-pink-600 text-white font-bold text-sm hover:bg-pink-700 rounded-lg shadow-lg shadow-pink-200'
                disabled={!formData.purpose || !formData.amount || !formData.content}
              >
                Lưu Giao Dịch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
          <div
            className='absolute inset-0 bg-black/40 backdrop-blur-sm'
            onClick={() => setShowFilterModal(false)}
          ></div>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-pink-600'>
              <h3 className='font-bold text-lg text-white'>Lọc Giao Dịch</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className='text-white hover:text-pink-100 text-2xl leading-none'
              >
                <X size={24} />
              </button>
            </div>
            <div className='p-6 space-y-4'>
              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Loại Giao Dịch</label>
                <div className='grid grid-cols-3 gap-3'>
                  <button
                    onClick={() => setFilterData({ ...filterData, type: 'all' })}
                    className={`px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                      filterData.type === 'all'
                        ? 'bg-pink-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setFilterData({ ...filterData, type: 'income' })}
                    className={`px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                      filterData.type === 'income'
                        ? 'bg-pink-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Thu
                  </button>
                  <button
                    onClick={() => setFilterData({ ...filterData, type: 'expense' })}
                    className={`px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                      filterData.type === 'expense'
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Chi
                  </button>
                </div>
              </div>

              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Từ Ngày</label>
                <input
                  type='date'
                  value={filterData.startDate}
                  onChange={(e) => setFilterData({ ...filterData, startDate: e.target.value })}
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                />
              </div>

              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Đến Ngày</label>
                <input
                  type='date'
                  value={filterData.endDate}
                  onChange={(e) => setFilterData({ ...filterData, endDate: e.target.value })}
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                />
              </div>
            </div>
            <div className='px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3'>
              <button
                onClick={() => {
                  setFilterData({ startDate: '', endDate: '', type: 'all' })
                  setSearchTerm('')
                  setShowFilterModal(false)
                }}
                className='px-4 py-2 text-gray-600 font-bold text-sm hover:bg-gray-100 rounded-lg'
              >
                Xóa Bộ Lọc
              </button>
              <button
                onClick={() => {
                  setShowFilterModal(false)
                  setJournalPage(1) // Reset to first page when filter applied
                }}
                className='px-4 py-2 bg-pink-600 text-white font-bold text-sm hover:bg-pink-700 rounded-lg shadow-lg shadow-pink-200'
              >
                Áp Dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </StudioLayout>
  )
}
```

### pages\index.tsx

```tsx
import Features from '@/components/landing/Features'
import Footer from '@/components/landing/Footer' // Mới
import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import Pricing from '@/components/landing/Pricing' // Mới
import TemplateGallery from '@/components/landing/TemplateGallery' // Mới
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>MoiMoi Studio | Thiệp Cưới Online 4.0</title>
        <meta
          name='description'
          content='Nền tảng tạo thiệp cưới online đẹp, hiện đại phong cách Gen Z. Tích hợp QR mừng cưới, bản đồ và RSVP chuyên nghiệp. Dùng thử miễn phí!'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>

      <main className='min-h-screen font-sans text-gray-900'>
        <Header />
        <Hero />
        <Features />
        <TemplateGallery />
        <Pricing />
        <Footer />
      </main>
    </>
  )
}
```

### pages\studio\editor.tsx

```tsx
import { CreditCard, Image as ImageIcon, Info, Save, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'
import StudioEmptyState from '../../components/studio/StudioEmptyState'
import LivePreview from '../../components/studio/LivePreview'
import StudioLayout from '../../components/studio/StudioLayout'
import StudioLoading from '../../components/studio/StudioLoading'
import TabAlbum from '../../components/studio/TabAlbum'
import TabBank from '../../components/studio/TabBank'
import TabInfo from '../../components/studio/TabInfo'
import { useToast } from '../../components/ui/ToastProvider'
import { dataService } from '../../lib/data-service'
import { processImages } from '../../lib/image-processor'
import { useWedding } from '../../lib/useWedding'

const Editor = () => {
  const { wedding, setWedding, loading } = useWedding()
  const [activeTab, setActiveTab] = useState<'info' | 'album' | 'bank' | 'admin'>('info')
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [adminJsonDraft, setAdminJsonDraft] = useState('')
  const [customFieldKey, setCustomFieldKey] = useState('')
  const [customFieldValue, setCustomFieldValue] = useState('')
  const [adminLogs, setAdminLogs] = useState<string[]>([])
  const [originalImages, setOriginalImages] = useState<string[]>([])
  const { success, error } = useToast()

  // Store original images when wedding loads
  useEffect(() => {
    if (wedding?.content?.images) {
      setOriginalImages(wedding.content.images)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wedding?.id])

  const handleInfoChange = (key: string, value: string) => {
    if (!wedding) return
    setWedding({
      ...wedding,
      content: { ...wedding.content, [key]: value }
    })
  }

  const handleImagesChange = (images: string[]) => {
    if (!wedding) return
    setWedding({
      ...wedding,
      content: { ...wedding.content, images }
    })
  }

  const handleSave = async () => {
    if (!wedding) return
    setSaving(true)
    try {
      const previousImages = originalImages
      const currentImages = wedding.content.images || []

      const { newImages, uploadedCount, deletedCount } = await processImages(currentImages, previousImages)

      if (uploadedCount > 0 || deletedCount > 0) {
        console.log(`Images processed: +${uploadedCount} uploaded, -${deletedCount} deleted`)
      }

      const updatedContent = { ...wedding.content, images: newImages }
      await dataService.updateWedding(wedding.id, updatedContent)

      // Update local state and original images
      setWedding({ ...wedding, content: updatedContent })
      setOriginalImages(newImages)

      success('Lưu thay đổi thành công!')
    } catch (e) {
      console.error('Save error:', e)
      error('Lưu thất bại. Vui lòng thử lại.')
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!wedding) return
    setPublishing(true)
    try {
      const previousImages = originalImages
      const currentImages = wedding.content.images || []

      const { newImages, uploadedCount, deletedCount } = await processImages(currentImages, previousImages)

      if (uploadedCount > 0 || deletedCount > 0) {
        console.log(`Images processed: +${uploadedCount} uploaded, -${deletedCount} deleted`)
      }

      const updatedContent = { ...wedding.content, images: newImages }
      await dataService.updateWedding(wedding.id, updatedContent)

      const supabase = (await import('../../lib/initSupabase')).supabase
      const { error: publishError } = await supabase
        .from('weddings')
        .update({ deployment_status: 'published' })
        .eq('id', wedding.id)

      if (publishError) throw publishError

      setWedding({ ...wedding, content: updatedContent, deployment_status: 'published' })
      setOriginalImages(newImages)

      success('Xuất bản thành công! Thiệp của bạn đã được công khai.')
    } catch (e) {
      console.error('Publish error:', e)
      error('Xuất bản thất bại. Vui lòng thử lại.')
    } finally {
      setPublishing(false)
    }
  }

  useEffect(() => {
    if (isAdminMode && wedding) {
      setAdminJsonDraft(JSON.stringify(wedding.content || {}, null, 2))
    }
  }, [isAdminMode, wedding])

  useEffect(() => {
    if (!isAdminMode && activeTab === 'admin') {
      setActiveTab('info')
    }
  }, [isAdminMode, activeTab])

  const applyAdminJson = () => {
    if (!wedding) return
    try {
      const parsed = JSON.parse(adminJsonDraft || '{}')
      setWedding({ ...wedding, content: parsed })
      setAdminLogs((prev) => [`Cập nhật JSON lúc ${new Date().toLocaleTimeString()}`, ...prev])
      success('Đã áp dụng JSON nâng cao!')
    } catch (err) {
      error('JSON không hợp lệ. Vui lòng kiểm tra lại.')
    }
  }

  const addCustomField = () => {
    if (!wedding || !customFieldKey.trim()) return
    const updated = {
      ...wedding.content,
      [customFieldKey]: customFieldValue
    }
    setWedding({ ...wedding, content: updated })
    setAdminJsonDraft(JSON.stringify(updated || {}, null, 2))
    setAdminLogs((prev) => [`Thêm field "${customFieldKey}"`, ...prev])
    setCustomFieldKey('')
    setCustomFieldValue('')
    success('Đã thêm field tùy chỉnh.')
  }

  if (loading)
    return (
      <StudioLayout>
        <StudioLoading message='Đang tải trình chỉnh sửa...' />
      </StudioLayout>
    )

  return (
    <StudioLayout>
      <div className='mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
        <div>
          <h2 className='text-3xl font-serif font-bold text-gray-900'>Chỉnh Sửa Thiệp</h2>
          <p className='text-gray-500 mt-1'>Tùy chỉnh nội dung thiệp mời của bạn</p>
        </div>
        <div className='flex flex-wrap items-center gap-4'>
          <label className='flex items-center gap-3 text-sm font-semibold text-gray-600'>
            <span>Chế độ quản trị</span>
            <button
              type='button'
              onClick={() => setIsAdminMode((prev) => !prev)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                isAdminMode ? 'bg-pink-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
                  isAdminMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
          <button
            onClick={handleSave}
            disabled={saving || publishing}
            className='flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all shadow-lg shadow-gray-200 disabled:opacity-50 font-medium'
          >
            {saving ? (
              'Đang lưu...'
            ) : (
              <>
                <Save size={18} className='mr-2' /> Lưu bản nháp
              </>
            )}
          </button>
          <button
            onClick={handlePublish}
            disabled={saving || publishing}
            className='flex items-center justify-center px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-all shadow-lg shadow-pink-200 disabled:opacity-50 font-medium'
          >
            {publishing ? (
              'Đang xuất bản...'
            ) : (
              <>
                <Save size={18} className='mr-2' /> Xuất Bản
              </>
            )}
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8'>
        <div className='bg-white rounded-3xl shadow-sm border border-pink-100 overflow-hidden min-h-[600px]'>
          {/* Modern Tabs */}
          <div className='flex border-b border-gray-100'>
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-4 text-center font-medium transition-colors border-b-2 ${
                activeTab === 'info'
                  ? 'border-pink-500 text-pink-600 bg-pink-50/30'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className='flex items-center justify-center gap-2'>
                <Info size={18} /> Thông Tin
              </div>
            </button>
            <button
              onClick={() => setActiveTab('album')}
              className={`flex-1 py-4 text-center font-medium transition-colors border-b-2 ${
                activeTab === 'album'
                  ? 'border-pink-500 text-pink-600 bg-pink-50/30'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className='flex items-center justify-center gap-2'>
                <ImageIcon size={18} /> Album Ảnh
              </div>
            </button>
            <button
              onClick={() => setActiveTab('bank')}
              className={`flex-1 py-4 text-center font-medium transition-colors border-b-2 ${
                activeTab === 'bank'
                  ? 'border-pink-500 text-pink-600 bg-pink-50/30'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className='flex items-center justify-center gap-2'>
                <CreditCard size={18} /> Tiền mừng
              </div>
            </button>
            {isAdminMode && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex-1 py-4 text-center font-medium transition-colors border-b-2 ${
                  activeTab === 'admin'
                    ? 'border-pink-500 text-pink-600 bg-pink-50/30'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className='flex items-center justify-center gap-2'>
                  <Shield size={18} /> Quản Trị
                </div>
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className='p-8'>
            <div className={activeTab === 'info' ? 'block' : 'hidden'}>
              <TabInfo content={wedding?.content} onChange={handleInfoChange} />
            </div>
            <div className={activeTab === 'album' ? 'block' : 'hidden'}>
              <TabAlbum images={wedding?.content?.images || []} onChange={handleImagesChange} />
            </div>
            <div className={activeTab === 'bank' ? 'block' : 'hidden'}>
              <TabBank content={wedding?.content} onChange={handleInfoChange} />
            </div>
            {activeTab === 'admin' && (
              <div className='space-y-6'>
                <div className='bg-pink-50/60 border border-pink-100 rounded-2xl p-5'>
                  <h4 className='font-bold text-gray-900 mb-2'>JSON nội dung (nâng cao)</h4>
                  <p className='text-sm text-gray-500 mb-4'>Dành cho dev chỉnh sửa trực tiếp cấu trúc dữ liệu thiệp.</p>
                  <textarea
                    value={adminJsonDraft}
                    onChange={(e) => setAdminJsonDraft(e.target.value)}
                    rows={12}
                    className='w-full rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-pink-200'
                  />
                  <div className='mt-4 flex flex-wrap gap-3'>
                    <button
                      onClick={applyAdminJson}
                      className='px-5 py-2 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-700'
                    >
                      Áp dụng JSON
                    </button>
                    <button
                      onClick={() => setAdminJsonDraft(JSON.stringify(wedding?.content || {}, null, 2))}
                      className='px-5 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 font-bold hover:bg-gray-50'
                    >
                      Reset JSON
                    </button>
                  </div>
                </div>

                <div className='grid gap-4 md:grid-cols-2'>
                  <div className='bg-white border border-gray-100 rounded-2xl p-5 shadow-sm'>
                    <h4 className='font-bold text-gray-900 mb-3'>Thêm field tùy chỉnh</h4>
                    <div className='space-y-3'>
                      <input
                        value={customFieldKey}
                        onChange={(e) => setCustomFieldKey(e.target.value)}
                        placeholder='Tên field (vd: theme_color)'
                        className='w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200'
                      />
                      <input
                        value={customFieldValue}
                        onChange={(e) => setCustomFieldValue(e.target.value)}
                        placeholder='Giá trị'
                        className='w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200'
                      />
                      <button
                        onClick={addCustomField}
                        className='w-full px-4 py-2 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800'
                      >
                        Thêm field
                      </button>
                    </div>
                  </div>

                  <div className='bg-white border border-gray-100 rounded-2xl p-5 shadow-sm'>
                    <h4 className='font-bold text-gray-900 mb-3'>Log thay đổi (mock)</h4>
                    <div className='space-y-2 text-sm text-gray-500 max-h-48 overflow-auto'>
                      {adminLogs.length === 0 ? (
                        <div className='text-gray-400'>Chưa có thay đổi nào.</div>
                      ) : (
                        adminLogs.map((log, index) => (
                          <div key={index} className='border-b border-gray-100 pb-2'>
                            {log}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <LivePreview content={wedding?.content} />
      </div>
    </StudioLayout>
  )
}

export default Editor
```

### pages\studio\guests.tsx

```tsx
import {
  Check,
  Copy,
  Download,
  Edit,
  Link as LinkIcon,
  MessageSquare,
  Phone,
  QrCode,
  Search,
  Share2,
  Trash2,
  UserPlus,
  Users,
  X
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Pagination from '../../components/common/Pagination'
import StudioEmptyState from '../../components/studio/StudioEmptyState'
import StudioLayout from '../../components/studio/StudioLayout'
import StudioLoading from '../../components/studio/StudioLoading'
import { useToast } from '../../components/ui/ToastProvider'
import { RSVP, dataService } from '../../lib/data-service'
import { useWedding } from '../../lib/useWedding'

interface LinkFormData {
  name: string
}

const Guests = () => {
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [filteredRsvps, setFilteredRsvps] = useState<RSVP[]>([])
  const { wedding, loading: weddingLoading } = useWedding()
  const [loading, setLoading] = useState(true)
  const [linkFormData, setLinkFormData] = useState<LinkFormData>({ name: '' })
  const [generatedLink, setGeneratedLink] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const [editingRSVP, setEditingRSVP] = useState<RSVP | null>(null)
  const [qrGuest, setQrGuest] = useState<{ name: string; link: string } | null>(null)
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [selectedRsvpIds, setSelectedRsvpIds] = useState<number[]>([])
  const [visibleColumns, setVisibleColumns] = useState({
    phone: true,
    status: true,
    party: true,
    wishes: true
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const qrCanvasRef = useRef<HTMLCanvasElement>(null)
  const { toast, error } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      if (!wedding || weddingLoading) {
        setLoading(false)
        return
      }
      setLoading(true)
      const rsvpData = await dataService.getRSVPs(wedding.id)
      setRsvps(rsvpData)
      setFilteredRsvps(rsvpData)
      setLoading(false)
    }
    fetchData()
  }, [wedding, weddingLoading])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRsvps(rsvps)
    } else {
      setFilteredRsvps(
        rsvps.filter(
          (r) =>
            r.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) || (r.phone && r.phone.includes(searchTerm))
        )
      )
    }
  }, [searchTerm, rsvps])

  // Generate QR Code when qrGuest changes
  useEffect(() => {
    if (qrGuest && qrCanvasRef.current) {
      import('qrcode').then((QRCode) => {
        QRCode.toCanvas(qrCanvasRef.current, qrGuest.link, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
      })
    }
  }, [qrGuest])

  // Mã hóa tên khách thành Base64 URL-safe để tránh bị đoán
  const encodeGuestName = (name: string) =>
    btoa(unescape(encodeURIComponent(name)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

  const generateLink = () => {
    if (!linkFormData.name.trim() || !wedding) return

    const encoded = encodeGuestName(linkFormData.name)
    const link = `http://localhost:3000/${wedding.slug}/${encoded}`
    setGeneratedLink(link)
  }

  const copyToClipboard = (text: string, label: string = 'liên kết') => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast(`Đã sao chép ${label}!`, 'success')
      })
      .catch(() => {
        error('Sao chép thất bại. Vui lòng thử lại.')
      })
  }

  const handleExport = () => {
    if (!rsvps.length) {
      toast('Không có dữ liệu để xuất.', 'info')
      return
    }

    const headers = ['Tên Khách Mời', 'Số Điện Thoại', 'Tham Dự', 'Số Người', 'Lời Chúc', 'Thời Gian Gửi']
    const rows = rsvps.map((r) => [
      r.guest_name,
      r.phone || '',
      r.is_attending === true ? 'Có' : r.is_attending === false ? 'Không' : 'Chưa trả lời',
      r.party_size ?? '',
      (r.wishes || '').replace(/,/g, ' '),
      r.created_at ? new Date(r.created_at).toLocaleString('vi-VN') : ''
    ])

    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `danh_sach_khach_moi_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    toast(`Đã xuất ${rsvps.length} khách mời!`, 'success')
  }

  const handleEditRSVP = (rsvp: RSVP) => {
    setEditingRSVP({ ...rsvp })
  }

  const handleSaveRSVPEdit = async () => {
    if (!editingRSVP || !wedding) return

    try {
      // TODO: Call API to update RSVP
      // await dataService.updateRSVP(editingRSVP.id, editingRSVP)

      const updatedRsvps = rsvps.map((r) => (r.id === editingRSVP.id ? editingRSVP : r))
      setRsvps(updatedRsvps)
      setFilteredRsvps(updatedRsvps)
      setEditingRSVP(null)
      toast('Đã cập nhật thông tin khách mời!', 'success')
    } catch (err) {
      error('Có lỗi xảy ra khi cập nhật!')
    }
  }

  const handleDeleteRSVP = async (rsvp: RSVP) => {
    if (!confirm(`Xác nhận xóa khách mời "${rsvp.guest_name}"?`)) return

    try {
      // TODO: Call API to delete RSVP
      // await dataService.deleteRSVP(rsvp.id)

      const newRsvps = rsvps.filter((r) => r.id !== rsvp.id)
      setRsvps(newRsvps)
      setFilteredRsvps(newRsvps)
      toast('Đã xóa khách mời!', 'info')
    } catch (err) {
      error('Có lỗi xảy ra khi xóa!')
    }
  }

  const toggleRsvpSelection = (id: number) => {
    setSelectedRsvpIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const toggleSelectAll = (checked: boolean, ids: number[]) => {
    setSelectedRsvpIds((prev) => {
      if (checked) {
        const merged = new Set([...prev, ...ids])
        return Array.from(merged)
      }
      return prev.filter((id) => !ids.includes(id))
    })
  }

  const bulkUpdateAttendance = (isAttending: boolean) => {
    if (selectedRsvpIds.length === 0) {
      toast('Chưa chọn khách mời nào.', 'info')
      return
    }
    const updatedRsvps = rsvps.map((r) => (selectedRsvpIds.includes(r.id) ? { ...r, is_attending: isAttending } : r))
    setRsvps(updatedRsvps)
    setFilteredRsvps(updatedRsvps)
    toast(`Đã cập nhật trạng thái cho ${selectedRsvpIds.length} khách.`, 'success')
  }

  const bulkDelete = () => {
    if (selectedRsvpIds.length === 0) {
      toast('Chưa chọn khách mời nào.', 'info')
      return
    }
    if (!confirm(`Xác nhận xóa ${selectedRsvpIds.length} khách mời đã chọn?`)) return
    const updatedRsvps = rsvps.filter((r) => !selectedRsvpIds.includes(r.id))
    setRsvps(updatedRsvps)
    setFilteredRsvps(updatedRsvps)
    setSelectedRsvpIds([])
    toast('Đã xóa khách mời đã chọn!', 'info')
  }

  const bulkExport = () => {
    if (selectedRsvpIds.length === 0) {
      toast('Chưa chọn khách mời nào.', 'info')
      return
    }
    toast(`Đang xuất ${selectedRsvpIds.length} khách (mock).`, 'info')
  }

  const bulkGenerateQr = () => {
    if (selectedRsvpIds.length === 0) {
      toast('Chưa chọn khách mời nào.', 'info')
      return
    }
    toast(`Đã tạo QR hàng loạt cho ${selectedRsvpIds.length} khách (mock).`, 'success')
  }

  const toggleColumn = (key: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleShowQR = (rsvp: RSVP) => {
    if (!wedding) return
    const encoded = encodeGuestName(rsvp.guest_name)
    const link = `http://localhost:3000/${wedding.slug}/${encoded}`
    setQrGuest({ name: rsvp.guest_name, link })
  }

  const downloadQR = () => {
    if (!qrCanvasRef.current || !qrGuest) return
    const url = qrCanvasRef.current.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `QR_${qrGuest.name.replace(/\s/g, '_')}.png`
    link.href = url
    link.click()
    toast('Đã tải QR Code!', 'success')
  }

  const getGuestLink = (rsvp: RSVP) => {
    if (!wedding) return ''
    const encoded = encodeGuestName(rsvp.guest_name)
    return `http://localhost:3000/${wedding.slug}/${encoded}`
  }

  useEffect(() => {
    if (!isAdminMode) setSelectedRsvpIds([])
  }, [isAdminMode])

  useEffect(() => {
    setSelectedRsvpIds((prev) => prev.filter((id) => filteredRsvps.some((r) => r.id === id)))
  }, [filteredRsvps])

  if (weddingLoading || loading) {
    return (
      <StudioLayout>
        <StudioLoading message='Đang tải danh sách khách...' />
      </StudioLayout>
    )
  }

  if (!wedding) {
    return (
      <StudioLayout>
        <StudioEmptyState />
      </StudioLayout>
    )
  }

  const paginatedRsvps = filteredRsvps.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const pageIds = paginatedRsvps.map((rsvp) => rsvp.id)
  const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedRsvpIds.includes(id))
  const columnCount =
    (isAdminMode ? 1 : 0) +
    1 +
    (visibleColumns.phone ? 1 : 0) +
    (visibleColumns.status ? 1 : 0) +
    (visibleColumns.party ? 1 : 0) +
    (visibleColumns.wishes ? 1 : 0) +
    1

  return (
    <StudioLayout>
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8'>
        <div>
          <h2 className='text-3xl font-serif font-bold text-gray-900'>Quản Lý Khách Mời</h2>
          <p className='text-gray-500 mt-1'>Theo dõi danh sách khách mời tham gia, quản lý được tiền mừng cưới.</p>
          <p className='text-gray-500 mt-1'>
            Số khách hiện tại: <span className='text-red-500 text-xl font-bold'>{rsvps.length}</span>
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          <button
            onClick={handleExport}
            className='flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm'
          >
            <Download size={18} className='mr-2' /> Xuất Danh Sách
          </button>
          <label className='flex items-center gap-3 text-sm font-semibold text-gray-600'>
            <span>Chế độ quản trị</span>
            <button
              type='button'
              onClick={() => setIsAdminMode((prev) => !prev)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                isAdminMode ? 'bg-pink-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
                  isAdminMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
        </div>
      </div>

      {isAdminMode && (
        <div className='bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
            <div>
              <h3 className='text-lg font-bold text-gray-900'>Quản trị nhanh</h3>
              <p className='text-sm text-gray-500'>Đã chọn {selectedRsvpIds.length} khách</p>
            </div>
            <div className='flex flex-wrap gap-3'>
              <button
                onClick={() => toggleSelectAll(true, pageIds)}
                className='px-4 py-2 text-sm font-bold border border-gray-200 rounded-lg hover:bg-gray-50'
              >
                Chọn trang này
              </button>
              <button
                onClick={() => setSelectedRsvpIds([])}
                className='px-4 py-2 text-sm font-bold border border-gray-200 rounded-lg hover:bg-gray-50'
              >
                Bỏ chọn
              </button>
              <button
                onClick={() => bulkUpdateAttendance(true)}
                className='px-4 py-2 text-sm font-bold bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100'
              >
                Đánh dấu tham dự
              </button>
              <button
                onClick={() => bulkUpdateAttendance(false)}
                className='px-4 py-2 text-sm font-bold bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100'
              >
                Đánh dấu vắng
              </button>
              <button
                onClick={bulkGenerateQr}
                className='px-4 py-2 text-sm font-bold bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100'
              >
                QR hàng loạt
              </button>
              <button
                onClick={bulkExport}
                className='px-4 py-2 text-sm font-bold bg-white text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50'
              >
                Xuất đã chọn
              </button>
              <button
                onClick={bulkDelete}
                className='px-4 py-2 text-sm font-bold bg-red-600 text-white rounded-lg hover:bg-red-700'
              >
                Xóa đã chọn
              </button>
            </div>
          </div>
          <div className='mt-4 flex flex-wrap gap-4 text-sm text-gray-600'>
            <label className='flex items-center gap-2'>
              <input type='checkbox' checked={visibleColumns.phone} onChange={() => toggleColumn('phone')} />
              Hiện cột SĐT
            </label>
            <label className='flex items-center gap-2'>
              <input type='checkbox' checked={visibleColumns.status} onChange={() => toggleColumn('status')} />
              Hiện trạng thái
            </label>
            <label className='flex items-center gap-2'>
              <input type='checkbox' checked={visibleColumns.party} onChange={() => toggleColumn('party')} />
              Hiện số lượng
            </label>
            <label className='flex items-center gap-2'>
              <input type='checkbox' checked={visibleColumns.wishes} onChange={() => toggleColumn('wishes')} />
              Hiện lời chúc
            </label>
          </div>
        </div>
      )}

      <div className='space-y-8'>
        {/* Link Generator - Full Width */}
        <div className='bg-white p-6 rounded-3xl shadow-sm border border-pink-100'>
          <div className='flex items-center gap-2 mb-4 text-pink-600 font-bold uppercase text-xs tracking-wider'>
            <LinkIcon size={16} />
            <span>Tạo Link Mời</span>
          </div>
          <h3 className='text-lg font-bold text-gray-900 mb-4'>Tạo Link Cá Nhân Hóa</h3>
          <p className='text-sm text-gray-500 mb-4'>Nhập đầy đủ thông tin khách để tạo link mời riêng.</p>

          <div className='flex gap-4'>
            <div className='flex-1'>
              <label className='block text-sm font-bold text-gray-700 mb-1'>Tên Khách Mời (*)</label>
              <div className='relative'>
                <UserPlus className='absolute left-3 top-3 text-gray-400' size={20} />
                <input
                  type='text'
                  className='w-full pl-10 pr-4 py-3 bg-gray-50 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all'
                  placeholder='Ví dụ: Anh Nam & Chị Lan'
                  value={linkFormData.name}
                  onChange={(e) => setLinkFormData({ name: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button
            onClick={generateLink}
            disabled={!linkFormData.name.trim()}
            className='mt-4 w-full md:w-auto px-8 bg-pink-600 text-white py-3 rounded-xl hover:bg-pink-700 transition-all font-bold shadow-lg shadow-pink-200 disabled:opacity-50 disabled:shadow-none'
          >
            Tạo Link
          </button>

          {generatedLink && (
            <div className='mt-6 p-4 bg-green-50 rounded-2xl border border-green-100 animate-in slide-in-from-top-2'>
              <div className='text-xs font-bold text-green-700 uppercase mb-2'>Tạo Thành Công</div>
              <code className='block text-sm text-gray-600 break-all bg-white p-2 rounded border border-green-100 mb-3'>
                {generatedLink}
              </code>
              <div className='flex gap-2'>
                <button
                  onClick={() => copyToClipboard(generatedLink)}
                  className='flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-green-200 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium'
                >
                  <Copy size={16} /> Sao chép
                </button>
                <button
                  className='flex-1 flex items-center justify-center gap-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium shadow-md shadow-blue-200'
                  onClick={() =>
                    window.open(`http://zalo.me/share/?url=${encodeURIComponent(generatedLink)}`, '_blank')
                  }
                >
                  <Share2 size={16} /> Zalo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RSVP List - Full Width */}
        <div className='bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden'>
          <div className='p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4'>
            <div className='relative w-full sm:w-auto flex-1'>
              <Search className='absolute left-3 top-3 text-gray-400' size={18} />
              <input
                type='text'
                placeholder='Tìm kiếm khách mời...'
                className='w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-pink-200 transition-all'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={handleExport}
              className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-pink-300 hover:text-pink-600 transition-all'
            >
              <Download size={16} />
              Xuất Excel
            </button>
          </div>

          <div className='bg-gray-50/50 p-6 rounded-b-3xl min-h-[400px]'>
            {paginatedRsvps.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-12 text-center'>
                <div className='w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 text-gray-300 shadow-sm'>
                  <Search size={24} />
                </div>
                <h3 className='text-lg font-bold text-gray-900'>Không tìm thấy khách mời</h3>
                <p className='text-gray-500 max-w-xs mx-auto mt-1'>
                  Thử tìm kiếm với từ khóa khác hoặc thêm khách mời mới vào danh sách.
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
                {paginatedRsvps.map((rsvp) => {
                  const isSelected = selectedRsvpIds.includes(rsvp.id)
                  return (
                    <div
                      key={rsvp.id}
                      className={`group relative bg-white rounded-2xl p-5 border transition-all hover:shadow-lg ${
                        isSelected
                          ? 'border-pink-500 ring-1 ring-pink-500 shadow-pink-100'
                          : 'border-gray-100 shadow-sm'
                      }`}
                      onClick={() => isAdminMode && toggleRsvpSelection(rsvp.id)}
                    >
                      {/* Flex Container for Horizontal Layout */}
                      <div className='flex flex-col sm:flex-row gap-4 h-full'>
                        {/* Left Side: Info */}
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-start justify-between gap-2 mb-2'>
                            <h3 className='font-bold text-gray-900 text-lg truncate' title={rsvp.guest_name}>
                              {rsvp.guest_name}
                            </h3>
                            {/* Mobile Checkbox (if needed) or Status for Mobile Layout */}
                          </div>

                          {/* Details Row: Inline on Desktop */}
                          <div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 mb-3'>
                            {visibleColumns.phone && (
                              <div className='flex items-center gap-1.5'>
                                <Phone size={14} className='text-gray-400' />
                                {rsvp.phone ? (
                                  <span className='font-mono font-medium'>{rsvp.phone}</span>
                                ) : (
                                  <span className='text-gray-300 italic text-xs'>Trống</span>
                                )}
                              </div>
                            )}
                            {visibleColumns.party && (
                              <div className='flex items-center gap-1.5'>
                                <Users size={14} className='text-gray-400' />
                                <div className='flex items-center gap-2'>
                                  <span className='hidden sm:inline text-gray-500'>Khách:</span>
                                  {isAdminMode ? (
                                    <input
                                      type='number'
                                      min={1}
                                      value={rsvp.party_size ?? 1}
                                      onClick={(e) => e.stopPropagation()}
                                      onChange={(e) => {
                                        const updatedRsvps = rsvps.map((r) =>
                                          r.id === rsvp.id ? { ...r, party_size: parseInt(e.target.value) || 1 } : r
                                        )
                                        setRsvps(updatedRsvps)
                                        setFilteredRsvps(updatedRsvps)
                                      }}
                                      className='w-12 h-6 text-center border border-gray-200 rounded text-xs font-bold focus:border-pink-500 focus:outline-none bg-gray-50 focus:bg-white'
                                    />
                                  ) : (
                                    <span className='font-bold text-gray-900'>{rsvp.party_size}</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Wishes / Message */}
                          {visibleColumns.wishes && (rsvp.wishes || isAdminMode) && (
                            <div className='flex items-start gap-2 text-sm text-gray-500 bg-gray-50/80 rounded-lg p-2.5'>
                              <MessageSquare size={14} className='mt-0.5 text-gray-400 shrink-0' />
                              <p className='line-clamp-2 italic text-xs w-full'>
                                {rsvp.wishes || <span className='text-gray-300'>Chưa có lời chúc</span>}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Right Side: Status & Actions */}
                        <div className='flex flex-row sm:flex-col sm:items-end justify-between sm:justify-start gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 sm:pl-4 sm:border-l border-gray-50 min-w-[120px]'>
                          {/* Status Badge */}
                          <div className='flex items-center gap-2'>
                            {isAdminMode && (
                              <div onClick={(e) => e.stopPropagation()} className='sm:hidden'>
                                <input
                                  type='checkbox'
                                  checked={isSelected}
                                  onChange={() => toggleRsvpSelection(rsvp.id)}
                                  className='w-5 h-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500'
                                />
                              </div>
                            )}

                            {rsvp.is_attending ? (
                              <span className='inline-flex items-center px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-bold border border-green-100 whitespace-nowrap'>
                                Tham dự
                              </span>
                            ) : (
                              <span className='inline-flex items-center px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-bold border border-red-100 whitespace-nowrap'>
                                Vắng mặt
                              </span>
                            )}

                            {isAdminMode && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const updatedRsvps = rsvps.map((r) =>
                                    r.id === rsvp.id ? { ...r, is_attending: !r.is_attending } : r
                                  )
                                  setRsvps(updatedRsvps)
                                  setFilteredRsvps(updatedRsvps)
                                }}
                                className='hidden sm:block text-xs text-gray-400 hover:text-pink-600 underline decoration-dotted'
                              >
                                Đổi
                              </button>
                            )}
                          </div>

                          {/* Actions Row */}
                          <div className='flex gap-1 justify-end mt-auto'>
                            {isAdminMode && (
                              <div className='hidden sm:flex items-center justify-center w-8 h-8 mr-2 absolute top-4 right-4'>
                                <div
                                  className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                                    isSelected
                                      ? 'bg-pink-500 border-pink-500 text-white'
                                      : 'bg-white border-gray-300 text-transparent hover:border-pink-300'
                                  }`}
                                >
                                  <Check size={14} strokeWidth={3} />
                                </div>
                              </div>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                copyToClipboard(getGuestLink(rsvp), 'link')
                              }}
                              className='w-8 h-8 flex items-center justify-center text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors'
                              title='Sao chép link mời'
                            >
                              <LinkIcon size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleShowQR(rsvp)
                              }}
                              className='w-8 h-8 flex items-center justify-center text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors'
                              title='Xem mã QR'
                            >
                              <QrCode size={16} />
                            </button>

                            {isAdminMode && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEditRSVP(rsvp)
                                  }}
                                  className='w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                                  title='Chỉnh sửa'
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteRSVP(rsvp)
                                  }}
                                  className='w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                                  title='Xóa khách'
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {filteredRsvps.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={filteredRsvps.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              itemLabel='khách mời'
              accentColor='pink'
            />
          )}
        </div>
      </div>

      {/* Edit RSVP Modal */}
      {editingRSVP && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-2xl max-w-md w-full shadow-2xl'>
            <div className='p-6 border-b border-gray-100 flex justify-between items-center'>
              <h3 className='text-lg font-bold text-gray-900'>Chỉnh Sửa Khách Mời</h3>
              <button
                onClick={() => setEditingRSVP(null)}
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
              >
                <X size={20} />
              </button>
            </div>
            <div className='p-6 space-y-4'>
              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Tên Khách Mời</label>
                <input
                  type='text'
                  value={editingRSVP.guest_name}
                  onChange={(e) => setEditingRSVP({ ...editingRSVP, guest_name: e.target.value })}
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none'
                />
              </div>
              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Số Điện Thoại</label>
                <input
                  type='text'
                  value={editingRSVP.phone || ''}
                  onChange={(e) => setEditingRSVP({ ...editingRSVP, phone: e.target.value })}
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none'
                />
              </div>
              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Số Lượng Người</label>
                <input
                  type='number'
                  min='1'
                  value={editingRSVP.party_size ?? 1}
                  onChange={(e) => setEditingRSVP({ ...editingRSVP, party_size: parseInt(e.target.value) || 1 })}
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none'
                />
              </div>
            </div>
            <div className='p-6 border-t border-gray-100 flex gap-3 justify-end'>
              <button
                onClick={() => setEditingRSVP(null)}
                className='px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium'
              >
                Hủy
              </button>
              <button
                onClick={handleSaveRSVPEdit}
                className='px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-bold'
              >
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrGuest && (
        <div
          className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'
          onClick={() => setQrGuest(null)}
        >
          <div className='bg-white rounded-2xl max-w-md w-full shadow-2xl' onClick={(e) => e.stopPropagation()}>
            <div className='p-6 border-b border-gray-100 flex justify-between items-center'>
              <h3 className='text-lg font-bold text-gray-900'>QR Code - {qrGuest.name}</h3>
              <button onClick={() => setQrGuest(null)} className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
                <X size={20} />
              </button>
            </div>
            <div className='p-8 flex flex-col items-center'>
              <canvas ref={qrCanvasRef} className='border-4 border-gray-200 rounded-xl shadow-lg mb-4' />
              <p className='text-sm text-gray-500 text-center mb-4 break-all'>{qrGuest.link}</p>
              <div className='flex gap-3 w-full'>
                <button
                  onClick={() => copyToClipboard(qrGuest.link, 'link')}
                  className='flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 font-medium'
                >
                  <Copy size={16} /> Sao chép Link
                </button>
                <button
                  onClick={downloadQR}
                  className='flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold shadow-lg shadow-purple-200'
                >
                  <Download size={16} /> Tải QR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </StudioLayout>
  )
}

export default Guests
```

### pages\studio\index.tsx

```tsx
import { ArrowRight, Calendar, Clock, Edit, Gift, Heart, MapPin, Share2, Sparkles, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import StudioLayout from '../../components/studio/StudioLayout'
import StudioLoading from '../../components/studio/StudioLoading'
import { useToast } from '../../components/ui/ToastProvider'
import { dataService } from '../../lib/data-service'
import { useWedding } from '../../lib/useWedding'

const baseUrl = process.env.NEXT_SITE_URL || 'https://www.moimoi.io.vn/'

const Dashboard = () => {
  const { wedding, setWedding, loading } = useWedding()
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  const [creating, setCreating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (wedding?.content?.wedding_date) {
      const interval = setInterval(() => {
        const weddingDate = new Date(`${wedding.content.wedding_date}T${wedding.content.wedding_time || '00:00'}`)
        const now = new Date()
        const diff = weddingDate.getTime() - now.getTime()

        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((diff % (1000 * 60)) / 1000)
          setTimeRemaining({ days, hours, minutes, seconds })
        } else {
          setTimeRemaining(null)
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [wedding])

  if (loading)
    return (
      <StudioLayout>
        <StudioLoading message='Đang tải studio của bạn...' />
      </StudioLayout>
    )

  if (!wedding)
    return (
      <StudioLayout>
        <div className='flex flex-col items-center justify-center h-[70vh] text-center'>
          <div className='w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mb-6 animate-pulse'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src='/image/logo-notext.png' alt='MoiMoi' className='w-12 h-12 object-contain' />
          </div>
          <h2 className='text-3xl font-serif font-bold text-gray-900 mb-4'>Chào mừng bạn đến với MoiMoi Studio!</h2>
          <p className='text-gray-500 max-w-md mb-8'>
            Hãy bắt đầu hành trình tạo nên đám cưới trong mơ của bạn. Thiết lập thông tin và gửi lời mời đến những người
            thân yêu.
          </p>
          <button
            onClick={async () => {
              if (creating) return
              setCreating(true)
              await dataService.createWedding()
              const data = await dataService.getWedding()
              setWedding(data)
              setCreating(false)
              toast('Đã khởi tạo đám cưới thành công!', 'success')
            }}
            disabled={creating}
            className='px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-full font-bold shadow-lg hover:shadow-pink-300 hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-60 disabled:hover:scale-100'
          >
            <Sparkles size={20} /> {creating ? 'Đang khởi tạo...' : 'Bắt Đầu Ngay'}
          </button>
        </div>
      </StudioLayout>
    )

  const quickStats = [
    {
      label: 'Ngày Còn Lại',
      value: timeRemaining ? timeRemaining.days : '-',
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    { label: 'Khách Đã Mời', value: '0', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Lời Chúc', value: '0', icon: Heart, color: 'text-red-600', bg: 'bg-red-100' }
  ]

  return (
    <StudioLayout>
      {/* Hero Section */}
      <div className='relative overflow-hidden rounded-3xl bg-white shadow-sm border border-pink-100 p-8 md:p-12 mb-8'>
        <div className='relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6'>
          <div className='max-w-2xl'>
            <div className='inline-flex items-center px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider mb-3'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src='/image/logo-notext.png' alt='MoiMoi' className='w-4 h-4 object-contain mr-2' />
              Studio Đám Cưới
            </div>
            <h2 className='font-serif font-bold text-gray-900 mb-2 leading-tight'>
              <span className='block text-xl md:text-2xl text-gray-500 mb-1 font-sans font-medium'>Xin chào,</span>
              <span className='text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500'>
                {wedding.content.groom_name || 'Bạn'} & {wedding.content.bride_name || 'Người Thương'}
              </span>
            </h2>
            <p className='text-gray-500 text-lg mt-2'>Cùng nhau tạo nên những khoảnh khắc tuyệt vời nhất.</p>
          </div>

          <div className='flex gap-3 flex-wrap sm:flex-nowrap'>
            <button
              onClick={() => window.open(window.location.origin + `/${wedding.slug}`, '_blank')}
              className='whitespace-nowrap flex items-center px-5 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm font-medium group'
            >
              Xem Thiệp{' '}
              <ArrowRight size={18} className='ml-2 text-gray-400 group-hover:text-pink-500 transition-colors' />
            </button>
            <Link href='/studio/editor'>
              <button className='whitespace-nowrap flex items-center px-5 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-all shadow-lg shadow-pink-200 font-medium'>
                <Edit size={18} className='mr-2' /> Chỉnh Sửa
              </button>
            </Link>
          </div>
        </div>

        {/* Background Decor */}
        <div className='absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-pink-100/50 to-purple-100/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none'></div>
      </div>

      {/* Countdown Grid */}
      {!wedding.content.wedding_date ? (
        <div className='bg-white p-8 rounded-2xl shadow-sm border border-pink-100 text-center mb-8'>
          <div className='w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-3 text-pink-500'>
            <Calendar size={24} />
          </div>
          <h3 className='text-lg font-bold text-gray-900 mb-2'>Ngày cưới chưa được thiết lập</h3>
          <p className='text-gray-500 mb-4'>Hãy cập nhật ngày cưới để kích hoạt đồng hồ đếm ngược.</p>
          <Link href='/studio/editor'>
            <button className='px-4 py-2 bg-pink-600 text-white rounded-lg font-bold text-sm hover:bg-pink-700 transition-colors shadow-lg shadow-pink-200'>
              Thiết lập ngày cưới
            </button>
          </Link>
        </div>
      ) : timeRemaining ? (
        <div className='bg-gradient-to-r from-pink-600 to-rose-500 rounded-3xl p-8 mb-8 text-white relative overflow-hidden shadow-xl shadow-pink-200'>
          {/* Background Pattern */}
          <div className='absolute top-0 right-0 -mr-8 -mt-8 opacity-10 rotate-12'>
            <Clock size={180} />
          </div>
          <div className='absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-white rounded-full opacity-10 blur-2xl'></div>

          <div className='relative z-10 flex flex-col md:flex-row items-center justify-between gap-8'>
            <div className='text-center md:text-left'>
              <div className='inline-flex items-center px-2 py-1 rounded-lg bg-pink-500/50 border border-pink-400/50 backdrop-blur-sm text-pink-50 text-[10px] font-bold uppercase tracking-wider mb-2'>
                <Heart size={10} className='mr-1 fill-current' /> Sắp diễn ra
              </div>
              <h3 className='text-2xl font-serif font-bold'>Đếm Ngược Ngày Cưới</h3>
              <p className='text-pink-100 text-sm mt-1 opacity-90'>Chỉ còn một chút thời gian nữa thôi...</p>
            </div>

            <div className='flex items-center gap-2 md:gap-6'>
              {[
                { label: 'Ngày', value: timeRemaining.days },
                { label: 'Giờ', value: timeRemaining.hours },
                { label: 'Phút', value: timeRemaining.minutes },
                { label: 'Giây', value: timeRemaining.seconds }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className='flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-2xl p-3 md:p-4 min-w-[70px] md:min-w-[90px] border border-white/10'
                >
                  <div className='text-2xl md:text-3xl font-serif font-bold mb-0.5 tabular-nums text-white'>
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className='text-[10px] md:text-xs uppercase font-medium tracking-wider text-pink-100'>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className='bg-white p-8 rounded-2xl shadow-sm border border-pink-100 text-center mb-8'>
          <div className='text-4xl mb-2'>🎉</div>
          <h3 className='text-lg font-bold text-gray-900 mb-1'>Đám cưới đã diễn ra!</h3>
          <p className='text-gray-500'>Chúc hai bạn trăm năm hạnh phúc.</p>
        </div>
      )}

      {/* Main Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Column: Quick Stats & Actions */}
        <div className='lg:col-span-2 space-y-8'>
          {/* Quick Stats */}
          <div className='grid grid-cols-3 gap-4'>
            {quickStats.map((stat, idx) => (
              <div
                key={idx}
                className='bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-pink-100 transition-colors group'
              >
                <div
                  className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                >
                  <stat.icon size={20} />
                </div>
                <div className='text-2xl font-bold text-gray-900'>{stat.value}</div>
                <div className='text-xs text-gray-500 font-medium uppercase mt-1'>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Wedding Details Card */}
          <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-xl font-bold text-gray-900'>Chi Tiết Lễ Cưới</h3>
              <Link href='/studio/editor' className='text-sm font-bold text-pink-600 hover:text-pink-700'>
                Chỉnh Sửa
              </Link>
            </div>

            <div className='space-y-6'>
              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 mt-1'>
                  <Calendar size={20} />
                </div>
                <div>
                  <div className='font-bold text-gray-900'>Thời Gian</div>
                  <div className='text-gray-500'>
                    {wedding?.content.wedding_date || 'Chưa thiết lập'} - {wedding?.content.wedding_time || '--:--'}
                  </div>
                </div>
              </div>
              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 mt-1'>
                  <MapPin size={20} />
                </div>
                <div>
                  <div className='font-bold text-gray-900'>Địa Điểm</div>
                  <div className='text-gray-500 max-w-sm'>{wedding?.content.address || 'Chưa thiết lập địa chỉ'}</div>
                  {wedding?.content.map_url && (
                    <a
                      href={wedding.content.map_url}
                      target='_blank'
                      rel='noreferrer'
                      className='text-xs font-bold text-blue-600 hover:underline mt-1 inline-block'
                    >
                      Xem Bản Đồ
                    </a>
                  )}
                </div>
              </div>
              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mt-1'>
                  <Gift size={20} />
                </div>
                <div>
                  <div className='font-bold text-gray-900'>Ngân Hàng Phản Hồi</div>
                  <div className='text-gray-500'>{wedding?.content.bank_name || 'Chưa thiết lập'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status & Publish */}
        <div className='space-y-8'>
          {/* Publish Status Card */}
          <div className='bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden'>
            <div className='relative z-10'>
              <div className='flex flex-col items-center py-2 justify-between mb-6'>
                <div className='font-bold text-lg w-full text-center mb-2'>Trạng Thái Website</div>
                <div
                  className={`px-3 w-full rounded-lg text-xs py-2 text-center font-bold uppercase ${wedding.deployment_status === 'published' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}
                >
                  {wedding.deployment_status === 'published' ? 'Đã Xuất Bản' : 'Nháp'}
                </div>
              </div>

              <p className='text-gray-400 text-sm leading-relaxed'>
                {wedding.deployment_status === 'published'
                  ? 'Website của bạn đang hoạt động và sẵn sàng đón khách!'
                  : 'Website của bạn đang ở chế độ nháp. Hãy xuất bản để chia sẻ với mọi người.'}
              </p>

              {/* <Link href='/studio/settings'>
                <button className='w-full py-4 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-colors'>
                  {wedding.deployment_status === 'published' ? 'Cấu Hình' : 'Xuất Bản Ngay'}
                </button>
              </Link> */}
            </div>

            {/* Decorative Circles */}
            <div className='absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-pink-500 rounded-full opacity-20 blur-3xl'></div>
            <div className='absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-purple-500 rounded-full opacity-20 blur-3xl'></div>
          </div>

          {/* Share Card */}
          <div className='bg-pink-50 p-8 rounded-3xl border border-pink-100'>
            <h3 className='font-bold text-gray-900 mb-2 flex items-center gap-2'>
              <Share2 size={18} className='text-pink-600' /> Chia Sẻ
            </h3>
            <p className='text-sm text-gray-600 mb-4'>Gửi link website cho bạn bè và người thân.</p>
            <div className='bg-white p-3 rounded-xl border border-pink-200 flex items-center justify-between gap-2 shadow-sm'>
              <code className='text-xs text-gray-500 truncate flex-1'>
                {baseUrl}/{wedding.slug}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${baseUrl}/${wedding.slug}`)
                  toast('Đã sao chép liên kết!', 'success')
                }}
                className='text-xs font-bold text-pink-600 hover:text-pink-700 whitespace-nowrap'
              >
                Sao chép
              </button>
            </div>
          </div>
        </div>
      </div>
    </StudioLayout>
  )
}

export default Dashboard
```

### pages\studio\login.tsx

```tsx
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

type ViewType = 'sign-in' | 'sign-up' | 'forgot-password'

const LoginPage = () => {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()
  const [view, setView] = useState<ViewType>('sign-in')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [slug, setSlug] = useState('')

  useEffect(() => {
    if (session) {
      router.push('/studio')
    }
  }, [session, router])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
      setLoading(false)
    } else {
      // Session will trigger redirect via useEffect
      setMessage({ type: 'success', text: 'Đăng nhập thành công!' })
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp' })
      setLoading(false)
      return
    }

    if (!slug.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng nhập slug cho thiệp cưới' })
      setLoading(false)
      return
    }

    // Validate slug format (chỉ cho phép chữ cái thường, số và dấu gạch ngang)
    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(slug)) {
      setMessage({ type: 'error', text: 'Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang' })
      setLoading(false)
      return
    }

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
      setLoading(false)
      return
    }

    // Tạo wedding record với slug và package_id mặc định
    if (authData.user) {
      const { error: weddingError } = await supabase.from('weddings').insert({
        host_id: authData.user.id,
        slug: slug.toLowerCase().trim(),
        package_id: 5,
        content: {}
      })

      if (weddingError) {
        // Nếu slug bị trùng hoặc lỗi khác
        if (weddingError.code === '23505') {
          setMessage({ type: 'error', text: 'Slug này đã được sử dụng. Vui lòng chọn slug khác.' })
        } else {
          setMessage({ type: 'error', text: 'Có lỗi khi tạo thiệp cưới: ' + weddingError.message })
        }
        setLoading(false)
        return
      }
    }

    setMessage({ type: 'success', text: 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.' })
    setLoading(false)
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/studio/reset-password`
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Email đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư của bạn.' })
    }
    setLoading(false)
  }

  if (session) return null // Handle via redirect

  return (
    <div className='flex items-center justify-center min-h-screen bg-[#FDFBF7] relative overflow-hidden'>
      {/* Animated Background Blobs - matching homepage */}
      <div className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none'>
        <div className='absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-pink-200/30 rounded-full blur-[100px] animate-pulse'></div>
        <div className='absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[100px] animate-pulse'></div>
        <div className='absolute bottom-[10%] left-[30%] w-[35%] h-[35%] bg-rose-200/20 rounded-full blur-[100px] animate-pulse delay-700'></div>
      </div>

      <div className='w-full max-w-md p-6 md:p-10 bg-white rounded-3xl shadow-xl shadow-pink-100/50 border border-white z-10'>
        <div className='mb-8 text-center'>
          <div className='flex items-center justify-center mx-auto mb-6'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src='/image/LOGO.png' alt='MoiMoi.STD' className='h-16 md:h-20 w-auto object-contain' />
          </div>
          <h1 className='text-2xl md:text-3xl font-serif font-bold text-pink-600'>
            {view === 'sign-in' && 'Chào Mừng Trở Lại'}
            {view === 'sign-up' && 'Tạo Tài Khoản Mới'}
            {view === 'forgot-password' && 'Quên Mật Khẩu'}
          </h1>
          <p className='text-gray-500 mt-2'>
            {view === 'sign-in' && 'Đăng nhập để quản lý đám cưới của bạn'}
            {view === 'sign-up' && 'Tạo thiệp cưới online đẹp và chuyên nghiệp'}
            {view === 'forgot-password' && 'Nhập email để đặt lại mật khẩu'}
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              message.type === 'error'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Sign In Form */}
        {view === 'sign-in' && (
          <form onSubmit={handleSignIn} className='space-y-4'>
            <div>
              <label className='block text-sm font-bold text-pink-600 mb-2'>Email</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-4 py-3 bg-white border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-400'
                placeholder='example@email.com'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-bold text-pink-600 mb-2'>Mật khẩu</label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full px-4 py-3 pr-12 bg-white border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-400'
                  placeholder='Nhập mật khẩu'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className='flex justify-end'>
              <button
                type='button'
                onClick={() => setView('forgot-password')}
                className='text-sm text-pink-600 hover:text-pink-700 font-medium'
              >
                Quên mật khẩu?
              </button>
            </div>
            <button
              type='submit'
              disabled={loading}
              className='w-full px-4 py-3 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 transition-colors shadow-lg shadow-pink-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {loading ? (
                <>
                  <Loader2 size={20} className='animate-spin' />
                  Đang xử lý...
                </>
              ) : (
                'Đăng Nhập'
              )}
            </button>
            <div className='text-center text-sm text-gray-600'>
              Chưa có tài khoản?{' '}
              <button
                type='button'
                onClick={() => setView('sign-up')}
                className='text-pink-600 hover:text-pink-700 font-bold'
              >
                Đăng ký ngay
              </button>
            </div>
          </form>
        )}

        {/* Sign Up Form */}
        {view === 'sign-up' && (
          <form onSubmit={handleSignUp} className='space-y-4'>
            <div>
              <label className='block text-sm font-bold text-pink-600 mb-2'>Email</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-4 py-3 bg-white border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-400'
                placeholder='example@email.com'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-bold text-pink-600 mb-2'>Slug Thiệp Cưới</label>
              <div className='relative'>
                <input
                  type='text'
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase())}
                  className='w-full px-4 py-3 bg-white border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-400'
                  placeholder='vd: cuoi-nam-linh-2026'
                  required
                  pattern='[a-z0-9-]+'
                />
              </div>
              <p className='text-xs text-gray-500 mt-1'>URL thiệp: moimoi.io/{slug || 'slug-cua-ban'}</p>
            </div>
            <div>
              <label className='block text-sm font-bold text-pink-600 mb-2'>Mật khẩu</label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full px-4 py-3 pr-12 bg-white border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-400'
                  placeholder='Tối thiểu 6 ký tự'
                  required
                  minLength={6}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div>
              <label className='block text-sm font-bold text-pink-600 mb-2'>Xác nhận mật khẩu</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='w-full px-4 py-3 bg-white border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-400'
                placeholder='Nhập lại mật khẩu'
                required
              />
            </div>
            <button
              type='submit'
              disabled={loading}
              className='w-full px-4 py-3 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 transition-colors shadow-lg shadow-pink-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {loading ? (
                <>
                  <Loader2 size={20} className='animate-spin' />
                  Đang xử lý...
                </>
              ) : (
                'Đăng Ký'
              )}
            </button>
            <div className='text-center text-sm text-gray-600'>
              Đã có tài khoản?{' '}
              <button
                type='button'
                onClick={() => setView('sign-in')}
                className='text-pink-600 hover:text-pink-700 font-bold'
              >
                Đăng nhập
              </button>
            </div>
          </form>
        )}

        {/* Forgot Password Form */}
        {view === 'forgot-password' && (
          <form onSubmit={handleForgotPassword} className='space-y-4'>
            <div>
              <label className='block text-sm font-bold text-pink-600 mb-2'>Email</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-4 py-3 bg-white border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-400'
                placeholder='example@email.com'
                required
              />
            </div>
            <button
              type='submit'
              disabled={loading}
              className='w-full px-4 py-3 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 transition-colors shadow-lg shadow-pink-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {loading ? (
                <>
                  <Loader2 size={20} className='animate-spin' />
                  Đang xử lý...
                </>
              ) : (
                'Gửi Email Đặt Lại Mật Khẩu'
              )}
            </button>
            <div className='text-center text-sm text-gray-600'>
              <button
                type='button'
                onClick={() => setView('sign-in')}
                className='text-pink-600 hover:text-pink-700 font-bold'
              >
                ← Quay lại đăng nhập
              </button>
            </div>
          </form>
        )}

        <div className='mt-8 pt-6 border-t border-gray-100 text-center'>
          <Link
            href='/'
            className='inline-flex items-center text-sm font-medium text-gray-400 hover:text-pink-600 transition-colors'
          >
            <ArrowLeft size={16} className='mr-1' /> Quay về Trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
```

### pages\studio\payment-result.tsx

```tsx
import StudioLayout from '@/components/studio/StudioLayout'
import StudioLoading from '@/components/studio/StudioLoading'
import { formatVnd, getPlans } from '@/lib/plan-store'
import { useWedding } from '@/lib/useWedding'
import { CheckCircle, XCircle, ArrowLeft, Home } from 'lucide-react'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

export default function PaymentResultPage() {
  const router = useRouter()
  const { status, plan, orderId, transactionNo, amount, message, code } = router.query as Record<string, string>
  const { loading } = useWedding()

  const plans = useMemo(() => getPlans(), [])
  const planInfo = useMemo(() => plans.find((p) => p.id === plan), [plans, plan])

  if (loading) {
    return (
      <StudioLayout>
        <StudioLoading message='Đang xử lý kết quả thanh toán...' />
      </StudioLayout>
    )
  }

  const isSuccess = status === 'success'
  const displayAmount = amount ? formatVnd(parseInt(amount) / 100) : ''

  return (
    <StudioLayout>
      <div className='max-w-lg mx-auto py-20 text-center'>
        {/* Icon */}
        <div
          className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-8 ${
            isSuccess ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          {isSuccess ? (
            <CheckCircle size={48} className='text-green-600' />
          ) : (
            <XCircle size={48} className='text-red-500' />
          )}
        </div>

        {/* Title */}
        <h1 className={`text-3xl font-bold mb-4 ${isSuccess ? 'text-green-700' : 'text-red-600'}`}>
          {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
        </h1>

        {/* Description */}
        {isSuccess ? (
          <div className='space-y-3'>
            {planInfo && (
              <p className='text-lg text-gray-700'>
                Gói <span className='font-bold text-pink-600'>{planInfo.name}</span> đã được kích hoạt
              </p>
            )}
            {displayAmount && (
              <p className='text-gray-500'>
                Số tiền: <span className='font-semibold'>{displayAmount}</span>
              </p>
            )}
            {transactionNo && <p className='text-sm text-gray-400'>Mã giao dịch VNPay: {transactionNo}</p>}
            {orderId && <p className='text-sm text-gray-400'>Mã đơn hàng: {orderId.slice(0, 8)}...</p>}
            <div className='bg-green-50 border border-green-200 rounded-2xl p-4 mt-4'>
              <p className='text-green-700 font-semibold'>✅ Gói dịch vụ đã được kích hoạt thành công!</p>
            </div>
          </div>
        ) : (
          <div className='space-y-3'>
            <p className='text-gray-500'>{message || 'Giao dịch không thể hoàn tất. Vui lòng thử lại.'}</p>
            {code && code !== 'unknown' && <p className='text-sm text-gray-400'>Mã lỗi: {code}</p>}
          </div>
        )}

        {/* Actions */}
        <div className='mt-10 space-y-4'>
          {isSuccess ? (
            <button
              onClick={() => router.push('/studio')}
              className='w-full py-4 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-pink-200 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2'
            >
              <Home size={20} />
              Về trang quản lý
            </button>
          ) : (
            <button
              onClick={() => router.push('/studio/upgrade')}
              className='w-full py-4 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-pink-200 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2'
            >
              <ArrowLeft size={20} />
              Quay lại trang nâng cấp
            </button>
          )}
        </div>
      </div>
    </StudioLayout>
  )
}
```

### pages\studio\settings.tsx

```tsx
import { ArrowRight, CheckCircle, Globe, Rocket } from 'lucide-react'
import { useState } from 'react'
import StudioEmptyState from '../../components/studio/StudioEmptyState'
import StudioLayout from '../../components/studio/StudioLayout'
import StudioLoading from '../../components/studio/StudioLoading'
import { useToast } from '../../components/ui/ToastProvider'
import { dataService } from '../../lib/data-service'
import { useWedding } from '../../lib/useWedding'

const Settings = () => {
  const { wedding, setWedding, loading } = useWedding()
  const [deploying, setDeploying] = useState(false)
  const { success, error } = useToast()

  const handlePublish = async () => {
    if (!wedding) return
    setDeploying(true)

    // Simulate deploy
    setTimeout(async () => {
      try {
        const result = await dataService.deployWedding(wedding.id)
        if (result.success) {
          setWedding({ ...wedding, deployment_status: 'published' })
          success('Xuất bản thành công! Đám cưới của bạn đã sẵn sàng.')
        } else {
          error('Xuất bản thất bại. Vui lòng thử lại sau.')
        }
      } catch (e) {
        error('Có lỗi xảy ra. Vui lòng thử lại.')
      } finally {
        setDeploying(false)
      }
    }, 2000)
  }

  if (loading)
    return (
      <StudioLayout>
        <StudioLoading message='Đang tải cài đặt...' />
      </StudioLayout>
    )

  if (!wedding)
    return (
      <StudioLayout>
        <StudioEmptyState />
      </StudioLayout>
    )

  return (
    <StudioLayout>
      <div className='mb-8'>
        <h2 className='text-3xl font-serif font-bold text-gray-900'>Cài Đặt</h2>
        <p className='text-gray-500 mt-1'>Quản lý xuất bản và cấu hình website</p>
      </div>

      <div className='max-w-4xl space-y-8'>
        {/* Publication Section */}
        <div className='bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden'>
          <div className='absolute top-0 right-0 p-12 opacity-5'>
            <Rocket size={200} />
          </div>

          <div className='relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8'>
            <div className='max-w-xl'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='p-2 bg-white/10 text-pink-300 rounded-lg backdrop-blur-sm'>
                  <Globe size={24} />
                </div>
                <h3 className='text-2xl font-bold'>Trạng Thái Xuất Bản</h3>
              </div>
              <p className='text-gray-300 mb-6 text-lg'>
                Sẵn sàng ra mắt? Việc xuất bản chỉ tốn khoảng 2-3 phút. Sau khi xuất bản, khách mời có thể xem thiệp và
                gửi lời chúc ngay lập tức.
              </p>
              {wedding.deployment_status === 'published' && (
                <div className='inline-flex items-center gap-2 bg-green-500/20 border border-green-500/50 px-4 py-2 rounded-full text-green-300 font-medium'>
                  <CheckCircle size={18} />
                  <span>Website đang hoạt động</span>
                </div>
              )}
            </div>

            <div className='flex flex-col gap-3 min-w-[200px]'>
              <button
                onClick={handlePublish}
                disabled={deploying}
                className={`
                  relative overflow-hidden group flex items-center justify-center px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg
                  ${
                    deploying
                      ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                      : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:shadow-pink-500/50 hover:scale-105 active:scale-95'
                  }
                `}
              >
                {deploying ? (
                  <span className='flex items-center'>
                    <svg
                      className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  <span className='flex items-center'>
                    Thực Hiện Xuất Bản{' '}
                    <ArrowRight size={20} className='ml-2 group-hover:translate-x-1 transition-transform' />
                  </span>
                )}
              </button>

              {wedding.deployment_status === 'published' && !deploying && (
                <button
                  onClick={() => window.open(`/${wedding.slug}`, '_blank')}
                  className='text-center text-gray-400 hover:text-white text-sm py-2 transition-colors'
                >
                  Xem thiệp online ↗
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </StudioLayout>
  )
}

export default Settings
```

### pages\studio\templates\add.tsx

```tsx
import StudioLayout from '@/components/studio/StudioLayout'
import { useToast } from '@/components/ui/ToastProvider'
import { ArrowLeft, Save } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface Package {
  id: number
  name: string
  price: number
  original_price: number
  duration_months: number
  is_active: boolean
}

export default function AddTemplatePage() {
  const router = useRouter()
  const { success, error } = useToast()
  const [loading, setLoading] = useState(false)
  const [packages, setPackages] = useState<Package[]>([])
  const [formData, setFormData] = useState({
    name: '',
    repo_branch: '',
    thumbnail_url: '',
    is_active: true,
    package_ids: [] as number[]
  })

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const response = await fetch('/api/packages')
        if (response.ok) {
          const result = await response.json()
          setPackages(result.data || [])
        }
      } catch (err) {
        console.error('Load packages error:', err)
      }
    }
    loadPackages()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to create template')
      }

      success('Tạo template thành công!')
      router.push('/studio/templates?admin=1')
    } catch (err) {
      error('Không thể tạo template. Vui lòng thử lại.')
      console.error('Create template error:', err)
    } finally {
      setLoading(false)
    }
  }

  const togglePackage = (pkgId: number) => {
    setFormData((prev) => {
      const ids = new Set(prev.package_ids)
      if (ids.has(pkgId)) {
        ids.delete(pkgId)
      } else {
        ids.add(pkgId)
      }
      return { ...prev, package_ids: Array.from(ids) }
    })
  }

  return (
    <StudioLayout>
      <div className='max-w-4xl mx-auto'>
        <button
          onClick={() => router.back()}
          className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6'
        >
          <ArrowLeft size={20} />
          Quay lại
        </button>

        <div className='bg-white rounded-3xl border border-gray-100 shadow-sm p-8'>
          <h1 className='text-2xl font-bold text-gray-900 mb-6'>Thêm Template Mới</h1>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Tên Template *</label>
              <input
                type='text'
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className='w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-100'
                placeholder='VD: Mẫu Vintage Hoa'
              />
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Repo Branch *</label>
              <input
                type='text'
                required
                value={formData.repo_branch}
                onChange={(e) => setFormData({ ...formData, repo_branch: e.target.value })}
                className='w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-100'
                placeholder='VD: theme-vintage'
              />
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Thumbnail URL</label>
              <input
                type='url'
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                className='w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-100'
                placeholder='https://...'
              />
            </div>

            <div>
              <label className='flex items-center gap-3'>
                <input
                  type='checkbox'
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className='w-5 h-5 accent-pink-500'
                />
                <span className='text-sm font-bold text-gray-700'>Hiển thị template</span>
              </label>
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-700 mb-3'>Gói áp dụng</label>
              <div className='grid grid-cols-2 gap-3'>
                {packages.map((pkg) => {
                  const checked = formData.package_ids.includes(pkg.id)
                  return (
                    <label
                      key={pkg.id}
                      className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                        checked ? 'border-pink-300 bg-pink-50' : 'border-gray-200 bg-white hover:border-pink-200'
                      }`}
                    >
                      <input
                        type='checkbox'
                        checked={checked}
                        onChange={() => togglePackage(pkg.id)}
                        className='w-5 h-5 accent-pink-500'
                      />
                      <div className='flex-1'>
                        <div className='font-bold text-gray-900'>{pkg.name}</div>
                        <div className='text-xs text-gray-500'>{pkg.price.toLocaleString('vi-VN')}đ</div>
                      </div>
                    </label>
                  )
                })}
              </div>
              <p className='mt-2 text-sm text-gray-500'>Không chọn gói nào = áp dụng cho tất cả gói</p>
            </div>

            <div className='flex gap-3 pt-4'>
              <button
                type='button'
                onClick={() => router.back()}
                className='flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50'
              >
                Hủy
              </button>
              <button
                type='submit'
                disabled={loading}
                className='flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50'
              >
                <Save size={20} />
                {loading ? 'Đang lưu...' : 'Tạo Template'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </StudioLayout>
  )
}
```

### pages\studio\templates\index.tsx

```tsx
import Pagination from '@/components/common/Pagination'
import StudioEmptyState from '@/components/studio/StudioEmptyState'
import StudioLayout from '@/components/studio/StudioLayout'
import StudioLoading from '@/components/studio/StudioLoading'
import { useToast } from '@/components/ui/ToastProvider'
import { dataService, Template } from '@/lib/data-service'
import { useWedding } from '@/lib/useWedding'
import { Check, Eye, EyeOff, LayoutTemplate, Search, Sparkles } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

const PLAN_OPTIONS = ['Sinh Viên', 'Gói Cơ Bản', 'Gói Nâng Cao', 'Gói Cao Cấp']

type TemplateAdminMeta = {
  is_active: boolean
  price: number
  allowed_plans: string[]
  sort_order: number
  tags?: any[]
}

const DEFAULT_META: TemplateAdminMeta = {
  is_active: true,
  price: 0,
  allowed_plans: [],
  sort_order: 0
}

const formatPrice = (price: number) => {
  if (!price) return 'Miễn phí'
  return `${price.toLocaleString('vi-VN')}đ`
}

export default function TemplatesPage() {
  const router = useRouter()
  const { wedding, setWedding, loading } = useWedding()
  const [templates, setTemplates] = useState<Template[]>([])
  const [templateMeta, setTemplateMeta] = useState<Record<number, TemplateAdminMeta>>({})
  const [selectedStyle, setSelectedStyle] = useState('all')
  const [loadingTemplates, setLoadingTemplates] = useState(true)
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'hidden'>('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = isAdminMode ? 6 : 9
  const { toast, success, error } = useToast()

  useEffect(() => {
    if (router.query.admin === '1' || router.query.admin === 'true') {
      setIsAdminMode(true)
    }
  }, [router.query.admin])

  useEffect(() => {
    const loadTemplates = async () => {
      setLoadingTemplates(true)
      try {
        const response = await fetch('/api/templates')
        if (!response.ok) {
          error('Không thể tải danh sách templates')
          setLoadingTemplates(false)
          return
        }
        const result = await response.json()
        const data = result.success && result.data ? result.data : []

        setTemplates(data)
        setTemplateMeta((prev) => {
          const next = { ...prev }
          data.forEach((template: any, index: number) => {
            if (!next[template.id]) {
              // Extract packages info from API response
              const packages = template.packages || []
              const allowed_plans = packages.map((pkg: any) => pkg.name)
              const price = packages.length > 0 ? packages[0].price : 0

              next[template.id] = {
                ...DEFAULT_META,
                is_active: template.is_active !== undefined ? template.is_active : true,
                sort_order: index + 1,
                price: price,
                allowed_plans: allowed_plans,
                tags: template.tags || []
              }
            }
          })
          return next
        })
      } catch (err) {
        error('Lỗi khi tải templates')
        console.error('Load templates error:', err)
      } finally {
        setLoadingTemplates(false)
      }
    }
    loadTemplates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateMeta = (templateId: number, patch: Partial<TemplateAdminMeta>) => {
    setTemplateMeta((prev) => {
      const current = prev[templateId] || DEFAULT_META
      return {
        ...prev,
        [templateId]: { ...current, ...patch }
      }
    })
  }

  const togglePlan = (templateId: number, plan: string) => {
    setTemplateMeta((prev) => {
      const current = prev[templateId] || DEFAULT_META
      const allowed = new Set(current.allowed_plans)
      if (allowed.has(plan)) {
        allowed.delete(plan)
      } else {
        allowed.add(plan)
      }
      return {
        ...prev,
        [templateId]: { ...current, allowed_plans: Array.from(allowed) }
      }
    })
  }

  const templatesWithMeta = useMemo(() => {
    return templates.map((template) => ({
      ...template,
      meta: templateMeta[template.id] || DEFAULT_META
    }))
  }, [templates, templateMeta])

  const filteredTemplates = useMemo(() => {
    let data = templatesWithMeta
    if (!isAdminMode) {
      data = data.filter((template) => template.meta.is_active)
    }

    if (selectedStyle !== 'all') {
      const keyword = selectedStyle.toLowerCase()
      data = data.filter((template) => template.name.toLowerCase().includes(keyword))
    }

    if (searchTerm.trim()) {
      const keyword = searchTerm.toLowerCase()
      data = data.filter((template) => {
        return template.name.toLowerCase().includes(keyword)
      })
    }

    if (isAdminMode) {
      if (statusFilter !== 'all') {
        data = data.filter((template) =>
          statusFilter === 'active' ? template.meta.is_active : !template.meta.is_active
        )
      }
      if (planFilter !== 'all') {
        data = data.filter((template) => template.meta.allowed_plans.includes(planFilter))
      }
    }

    return data.sort((a, b) => a.meta.sort_order - b.meta.sort_order)
  }, [templatesWithMeta, isAdminMode, planFilter, searchTerm, selectedStyle, statusFilter])

  const pagedTemplates = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredTemplates.slice(start, start + itemsPerPage)
  }, [currentPage, filteredTemplates, itemsPerPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedStyle, statusFilter, planFilter, isAdminMode])

  if (loadingTemplates) {
    return (
      <StudioLayout>
        <StudioLoading message='Đang tải thư viện mẫu...' />
      </StudioLayout>
    )
  }

  const applyTemplate = async (templateId: number) => {
    const meta = templateMeta[templateId] || DEFAULT_META
    if (!isAdminMode && meta.allowed_plans.length > 0) {
      toast(`Mẫu này thuộc gói: ${meta.allowed_plans.join(', ')}. Hãy nâng cấp để mở khóa đầy đủ.`, 'info')
    }
    try {
      if (wedding) {
        await dataService.updateWeddingTemplate(wedding.id, templateId)
        setWedding({ ...wedding, template_id: templateId })
        success('Đã áp dụng mẫu thiệp!')
      }
    } catch (e) {
      error('Không thể áp dụng mẫu. Vui lòng thử lại.')
    }
  }

  return (
    <StudioLayout>
      <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-3xl font-serif font-bold text-gray-900'>Kho Giao Diện</h1>
          <p className='text-gray-500'>Chọn mẫu thiệp phù hợp với phong cách của bạn</p>
          {isAdminMode && <p className='mt-2 text-xs text-pink-600 font-semibold'>Đang bật chế độ quản trị (mock)</p>}
        </div>
        <div className='flex items-center gap-3'>
          <label className='flex items-center gap-3 text-sm font-semibold text-gray-600'>
            <span>Chế độ quản trị</span>
            <button
              type='button'
              onClick={() => setIsAdminMode((prev) => !prev)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                isAdminMode ? 'bg-pink-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
                  isAdminMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
          {isAdminMode && (
            <button
              onClick={() => router.push('/studio/templates/add')}
              className='px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-xl text-sm font-bold'
            >
              + Thêm Template
            </button>
          )}
        </div>
      </div>

      <div className='mt-6 flex flex-wrap items-center gap-3'>
        <div className='relative'>
          <Search size={16} className='absolute left-3 top-2.5 text-gray-400' />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Tìm mẫu theo tên hoặc tag...'
            className='pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-100'
          />
        </div>
        <div className='flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2'>
          <LayoutTemplate size={16} className='text-gray-400' />
          <select
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            className='text-sm font-medium text-gray-700 focus:outline-none'
          >
            <option value='all'>Tất cả</option>
            <option value='vintage'>Vintage</option>
            <option value='modern'>Modern</option>
            <option value='minimal'>Minimal</option>
          </select>
        </div>
        {isAdminMode && (
          <>
            <div className='flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2'>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'hidden')}
                className='text-sm font-medium text-gray-700 focus:outline-none'
              >
                <option value='all'>Tất cả trạng thái</option>
                <option value='active'>Đang hiển thị</option>
                <option value='hidden'>Đang ẩn</option>
              </select>
            </div>
            <div className='flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2'>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className='text-sm font-medium text-gray-700 focus:outline-none'
              >
                <option value='all'>Tất cả gói</option>
                {PLAN_OPTIONS.map((plan) => (
                  <option key={plan} value={plan}>
                    {plan}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
        <button
          onClick={() => toast('Bộ lọc demo dựa theo tên mẫu', 'info')}
          className='px-4 py-2 bg-pink-50 text-pink-600 rounded-xl text-sm font-bold'
        >
          Mẹo chọn mẫu
        </button>
      </div>

      <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {pagedTemplates.map((template) => {
          const meta = template.meta
          const isActive = wedding?.template_id === template.id
          const hasPlanLimit = meta.allowed_plans.length > 0
          return (
            <div
              key={template.id}
              className={`bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow ${
                !meta.is_active && isAdminMode ? 'opacity-80 border-dashed' : ''
              }`}
            >
              <div className='aspect-[4/3] bg-gray-100'>
                {template.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={template.thumbnail_url} alt={template.name} className='w-full h-full object-cover' />
                ) : (
                  <div className='h-full w-full flex items-center justify-center text-gray-400 text-sm'>
                    Chưa có ảnh mẫu
                  </div>
                )}
              </div>
              <div className='p-5 space-y-3'>
                <div className='flex items-center justify-between'>
                  <h3 className='font-bold text-gray-900'>{template.name}</h3>
                  {isActive && (
                    <span className='inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full'>
                      <Check size={12} /> Đang dùng
                    </span>
                  )}
                </div>
                {/* <p className='text-sm text-gray-500'>Gợi ý phong cách: {template.repo_branch}</p> */}
                <div className='flex flex-wrap gap-2 text-sm'>
                  <span className='px-2 py-1 rounded-full bg-gray-100 text-gray-600'>
                    Giá: {formatPrice(meta.price)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full ${
                      hasPlanLimit ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
                    }`}
                  >
                    {hasPlanLimit ? `Gói: ${meta.allowed_plans.join(', ')}` : 'Tất cả gói'}
                  </span>
                </div>
                <button
                  onClick={() => applyTemplate(template.id)}
                  className='w-full py-2.5 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg shadow-pink-200'
                >
                  <Sparkles size={16} /> Áp Dụng Mẫu
                </button>
                {isAdminMode && (
                  <button
                    onClick={() => router.push(`/studio/templates/${template.id}/edit`)}
                    className='w-full py-2.5 border-2 border-pink-500 text-pink-600 rounded-xl font-bold hover:bg-pink-50'
                  >
                    Chỉnh sửa
                  </button>
                )}
                {!isAdminMode && hasPlanLimit && (
                  <div className='text-sm text-gray-500 bg-pink-50/60 border border-pink-100 rounded-lg p-3'>
                    Mẫu này thuộc gói trả phí. Nâng cấp để mở khóa và được giảm giá bằng với gói đã mua trước đó.
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <Pagination
        currentPage={currentPage}
        totalItems={filteredTemplates.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        itemLabel='mẫu thiệp'
        accentColor='pink'
      />
    </StudioLayout>
  )
}
```

### pages\studio\templates\[id]\[action].tsx

```tsx
import StudioLayout from '@/components/studio/StudioLayout'
import StudioLoading from '@/components/studio/StudioLoading'
import { useToast } from '@/components/ui/ToastProvider'
import { ArrowLeft, Save } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface Package {
  id: number
  name: string
  price: number
  original_price: number
  duration_months: number
  is_active: boolean
}

interface Template {
  id: number
  name: string
  repo_branch: string
  thumbnail_url: string
  is_active: boolean
  packages: Package[]
}

export default function EditTemplatePage() {
  const router = useRouter()
  const { id, action } = router.query
  const { success, error } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [template, setTemplate] = useState<Template | null>(null)
  const [packages, setPackages] = useState<Package[]>([])
  const [formData, setFormData] = useState({
    name: '',
    repo_branch: '',
    thumbnail_url: '',
    is_active: true,
    package_ids: [] as number[]
  })

  useEffect(() => {
    if (!id || action !== 'edit') return

    const loadData = async () => {
      try {
        const [templateRes, packagesRes] = await Promise.all([fetch(`/api/templates/${id}`), fetch('/api/packages')])

        if (templateRes.ok) {
          const result = await templateRes.json()
          const data = result.data
          setTemplate(data)
          setFormData({
            name: data.name,
            repo_branch: data.repo_branch,
            thumbnail_url: data.thumbnail_url || '',
            is_active: data.is_active,
            package_ids: data.packages.map((p: Package) => p.id)
          })
        } else {
          error('Không tìm thấy template')
          router.push('/studio/templates?admin=1')
        }

        if (packagesRes.ok) {
          const result = await packagesRes.json()
          setPackages(result.data || [])
        }
      } catch (err) {
        error('Lỗi khi tải dữ liệu')
        console.error('Load data error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, action, error, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      console.log('📤 Sending update request:', {
        url: `/api/templates/${id}`,
        formData
      })

      const response = await fetch(`/api/templates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      console.log('📥 Update response:', result)

      if (!response.ok) {
        throw new Error('Failed to update template')
      }

      success('Cập nhật template thành công!')
      router.push('/studio/templates?admin=1')
    } catch (err) {
      error('Không thể cập nhật template. Vui lòng thử lại.')
      console.error('Update template error:', err)
    } finally {
      setSaving(false)
    }
  }

  const togglePackage = (pkgId: number) => {
    setFormData((prev) => {
      const ids = new Set(prev.package_ids)
      if (ids.has(pkgId)) {
        ids.delete(pkgId)
      } else {
        ids.add(pkgId)
      }
      return { ...prev, package_ids: Array.from(ids) }
    })
  }

  if (loading) {
    return (
      <StudioLayout>
        <StudioLoading message='Đang tải template...' />
      </StudioLayout>
    )
  }

  if (!template) {
    return (
      <StudioLayout>
        <div className='text-center py-12'>
          <p className='text-gray-500'>Không tìm thấy template</p>
        </div>
      </StudioLayout>
    )
  }

  return (
    <StudioLayout>
      <div className='max-w-4xl mx-auto'>
        <button
          onClick={() => router.push('/studio/templates?admin=1')}
          className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6'
        >
          <ArrowLeft size={20} />
          Quay lại danh sách
        </button>

        <div className='bg-white rounded-3xl border border-gray-100 shadow-sm p-8'>
          <h1 className='text-2xl font-bold text-gray-900 mb-6'>Chỉnh sửa Template</h1>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Tên Template *</label>
              <input
                type='text'
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className='w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-100'
                placeholder='VD: Mẫu Vintage Hoa'
              />
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Repo Branch *</label>
              <input
                type='text'
                required
                value={formData.repo_branch}
                onChange={(e) => setFormData({ ...formData, repo_branch: e.target.value })}
                className='w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-100'
                placeholder='VD: theme-vintage'
              />
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Thumbnail URL</label>
              <input
                type='url'
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                className='w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-100'
                placeholder='https://...'
              />
              {formData.thumbnail_url && (
                <div className='mt-3'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.thumbnail_url}
                    alt='Preview'
                    className='w-full max-w-md rounded-lg border border-gray-200'
                  />
                </div>
              )}
            </div>

            <div>
              <label className='flex items-center gap-3'>
                <input
                  type='checkbox'
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className='w-5 h-5 accent-pink-500'
                />
                <span className='text-sm font-bold text-gray-700'>Hiển thị template</span>
              </label>
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-700 mb-3'>Gói áp dụng</label>
              <div className='grid grid-cols-2 gap-3'>
                {packages.map((pkg) => {
                  const checked = formData.package_ids.includes(pkg.id)
                  return (
                    <label
                      key={pkg.id}
                      className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                        checked ? 'border-pink-300 bg-pink-50' : 'border-gray-200 bg-white hover:border-pink-200'
                      }`}
                    >
                      <input
                        type='checkbox'
                        checked={checked}
                        onChange={() => togglePackage(pkg.id)}
                        className='w-5 h-5 accent-pink-500'
                      />
                      <div className='flex-1'>
                        <div className='font-bold text-gray-900'>{pkg.name}</div>
                        <div className='text-xs text-gray-500'>{pkg.price.toLocaleString('vi-VN')}đ</div>
                      </div>
                    </label>
                  )
                })}
              </div>
              <p className='mt-2 text-sm text-gray-500'>Không chọn gói nào = áp dụng cho tất cả gói</p>
            </div>

            <div className='flex gap-3 pt-4'>
              <button
                type='button'
                onClick={() => router.push('/studio/templates?admin=1')}
                className='flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50'
              >
                Hủy
              </button>
              <button
                type='submit'
                disabled={saving}
                className='flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50'
              >
                <Save size={20} />
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </StudioLayout>
  )
}
```

### pages\studio\upgrade\add.tsx

```tsx
import StudioLayout from '@/components/studio/StudioLayout'
import { useToast } from '@/components/ui/ToastProvider'
import { ArrowLeft, Save } from 'lucide-react'
import { useRouter } from 'next/router'
import { useState } from 'react'

// Interface cho API response
interface ApiPackage {
  id: number
  name: string
  price: number
  original_price: number
  duration_months: number
  max_rsvps: number
  features: any // Can be string[] or object with structure
  promotion_end_date: string
  created_at: string
  templates: any[]
}

// API function
const createPackageAPI = async (packageData: {
  name: string
  price: number
  original_price: number
  duration_months: number
  max_rsvps: number
  features: string[] | { features: string[]; highlight: boolean; description: string; notIncluded: string[] }
}): Promise<ApiPackage | null> => {
  try {
    const response = await fetch('/api/packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(packageData)
    })
    const result = await response.json()
    return result.success && result.data ? result.data : null
  } catch (error) {
    console.error('Error creating package:', error)
    return null
  }
}

export default function AddPackagePage() {
  const router = useRouter()
  const { success, error } = useToast()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    originalPrice: 0,
    price: 0,
    durationText: '',
    maxRsvps: 100,
    featuresText: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      error('Vui lòng nhập tên gói.')
      return
    }
    if (formData.originalPrice <= 0) {
      error('Vui lòng nhập giá gốc hợp lệ.')
      return
    }
    if (formData.price < 0) {
      error('Giá khuyến mãi không thể âm.')
      return
    }
    if (formData.price > 0 && formData.price > formData.originalPrice) {
      error('Giá khuyến mãi phải nhỏ hơn giá gốc.')
      return
    }
    if (formData.maxRsvps <= 0) {
      error('Số lượng khách mời phải lớn hơn 0.')
      return
    }
    if (!formData.durationText.trim()) {
      error('Vui lòng nhập thời gian.')
      return
    }

    setSaving(true)
    try {
      const features = formData.featuresText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)

      if (features.length === 0) {
        error('Vui lòng nhập ít nhất 1 tính năng.')
        setSaving(false)
        return
      }

      let durationMonths = 12
      if (formData.durationText.toLowerCase().includes('vĩnh viễn')) {
        durationMonths = 60
      } else {
        const match = formData.durationText.match(/\d+/)
        if (match) {
          durationMonths = parseInt(match[0])
        }
      }

      // Lưu features theo format mới với structure đầy đủ
      const featuresData = {
        features: features,
        highlight: false,
        description: '',
        notIncluded: []
      }

      const packageData = {
        name: formData.name.trim(),
        price: formData.price || formData.originalPrice,
        original_price: formData.originalPrice,
        duration_months: durationMonths,
        max_rsvps: formData.maxRsvps,
        features: featuresData
      }

      const result = await createPackageAPI(packageData)

      if (result) {
        success('Đã tạo gói mới thành công!')
        router.push('/studio/upgrade')
      } else {
        error('Không thể tạo gói. Vui lòng thử lại.')
      }
    } catch (e) {
      error('Có lỗi xảy ra khi tạo gói.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <StudioLayout>
      <div className='max-w-3xl mx-auto py-10'>
        <button
          onClick={() => router.push('/studio/upgrade')}
          className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6'
        >
          <ArrowLeft size={20} />
          Quay lại danh sách
        </button>

        <h1 className='text-3xl font-bold text-gray-900 mb-8'>Tạo gói mới</h1>

        <form onSubmit={handleSubmit} className='bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6'>
          <div className='grid gap-6 md:grid-cols-2'>
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Tên gói *</label>
              <input
                type='text'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder='Vd: Gói Premium'
                className='w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-200'
              />
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Thời gian *</label>
              <input
                type='text'
                value={formData.durationText}
                onChange={(e) => setFormData({ ...formData, durationText: e.target.value })}
                placeholder='Vd: 12 tháng hoặc Vĩnh viễn'
                className='w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-200'
              />
              <p className='text-xs text-gray-400 mt-1'>
                Nhập số tháng hoặc &quot;Vĩnh viễn&quot; (sẽ chuyển thành 60 tháng)
              </p>
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Giá gốc (VNĐ) *</label>
              <input
                type='number'
                min={0}
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: parseInt(e.target.value) || 0 })}
                placeholder='999000'
                className='w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-200'
              />
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Giá khuyến mãi (VNĐ)</label>
              <input
                type='number'
                min={0}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                placeholder='0 = không có khuyến mãi'
                className='w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-200'
              />
              <p className='text-xs text-gray-400 mt-1'>Để 0 nếu không có khuyến mãi (sẽ dùng giá gốc)</p>
            </div>

            <div className='md:col-span-2'>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Tối đa khách mời *</label>
              <input
                type='number'
                min={0}
                value={formData.maxRsvps}
                onChange={(e) => setFormData({ ...formData, maxRsvps: parseInt(e.target.value) || 100 })}
                placeholder='100'
                className='w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-200'
              />
            </div>

            <div className='md:col-span-2'>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Tính năng (mỗi dòng 1 tính năng) *</label>
              <textarea
                rows={8}
                value={formData.featuresText}
                onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                placeholder='Tất cả mẫu thiệp&#10;Không giới hạn khách mời&#10;Tích hợp bản đồ&#10;...'
                className='w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-200'
              />
            </div>
          </div>

          <div className='flex items-center justify-between pt-6 border-t border-gray-100'>
            <button
              type='button'
              onClick={() => router.push('/studio/upgrade')}
              className='px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50'
            >
              Hủy
            </button>
            <button
              type='submit'
              disabled={saving}
              className='flex items-center gap-2 px-6 py-3 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <Save size={20} />
              {saving ? 'Đang lưu...' : 'Tạo gói'}
            </button>
          </div>
        </form>
      </div>
    </StudioLayout>
  )
}
```

### pages\studio\upgrade\index.tsx

```tsx
import StudioEmptyState from '@/components/studio/StudioEmptyState'
import StudioLayout from '@/components/studio/StudioLayout'
import StudioLoading from '@/components/studio/StudioLoading'
import { useToast } from '@/components/ui/ToastProvider'
import { dataService } from '@/lib/data-service'
import { Plan, formatVnd, generatePlanId, getPlans, isDiscountActive, savePlans } from '@/lib/plan-store'
import { useWedding } from '@/lib/useWedding'
import { Check, Clock, CreditCard, Edit, Plus, Save, Sparkles, Trash2 } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

// Interface cho API response
interface ApiPackage {
  id: number
  name: string
  price: number
  original_price: number
  duration_months: number
  max_rsvps: number
  features: any // Can be string[] or object with structure
  promotion_end_date: string
  is_active: boolean
  created_at: string
  templates: any[]
}

// Hàm chuyển đổi data từ API sang format Plan
const mapApiPackageToPlan = (pkg: ApiPackage): Plan => {
  // Check if features is new format (object) or old format (array)
  let featuresArray: string[] = []
  let notIncludedArray: string[] = []
  let highlight = false
  let description = `Tối đa ${pkg.max_rsvps} khách mời`

  if (pkg.features && typeof pkg.features === 'object' && !Array.isArray(pkg.features)) {
    // New format: features is an object with structure
    const featureData = pkg.features as any
    featuresArray = Array.isArray(featureData.features) ? featureData.features : []
    notIncludedArray = Array.isArray(featureData.notIncluded) ? featureData.notIncluded : []
    highlight = featureData.highlight || false
    description = featureData.description || description
  } else if (Array.isArray(pkg.features)) {
    // Old format: features is simple array
    featuresArray = pkg.features
  }

  return {
    id: String(pkg.id),
    name: pkg.name,
    price: pkg.original_price || pkg.price,
    discountPrice: pkg.price < pkg.original_price ? pkg.price : undefined,
    discountEndsAt: pkg.promotion_end_date !== '2100-01-01T00:00:00+00:00' ? pkg.promotion_end_date : undefined,
    duration: pkg.duration_months >= 60 ? 'Vĩnh viễn' : `${pkg.duration_months} tháng`,
    description: description,
    features: featuresArray,
    notIncluded: notIncludedArray,
    highlight: highlight,
    isActive: pkg.is_active
  }
}

const fetchPackages = async (): Promise<Plan[]> => {
  try {
    const response = await fetch('/api/packages')
    const result = await response.json()

    if (result.success && result.data) {
      return result.data.map(mapApiPackageToPlan)
    }
    return []
  } catch (error) {
    console.error('Error fetching packages:', error)
    return getPlans() // Fallback về localStorage nếu API lỗi
  }
}

export default function UpgradePage() {
  const router = useRouter()
  const { wedding, setWedding, loading } = useWedding()
  const [paying, setPaying] = useState(false)
  const [plans, setPlans] = useState<Plan[]>([])
  const [plansLoading, setPlansLoading] = useState(true)
  const [isAdminMode, setIsAdminMode] = useState(false)
  const { success, error } = useToast()

  useEffect(() => {
    const loadPackages = async () => {
      setPlansLoading(true)
      try {
        const data = await fetchPackages()
        setPlans(data)
      } finally {
        setPlansLoading(false)
      }
    }
    loadPackages()
  }, [])

  const visiblePlans = useMemo(() => plans.filter((plan) => plan.isActive !== false), [plans])

  if (plansLoading) {
    return (
      <StudioLayout>
        <StudioLoading message='Đang tải gói dịch vụ...' />
      </StudioLayout>
    )
  }

  const currentPlan = wedding?.content?.plan || ''

  const handleUpgrade = async (planId: string) => {
    if (paying) return

    // Kiểm tra wedding khi thanh toán
    if (!wedding) {
      error('Vui lòng tạo đám cưới trước khi nâng cấp gói.')
      return
    }

    setPaying(true)
    try {
      const updated = await dataService.updateWedding(wedding.id, {
        ...wedding.content,
        plan: planId,
        plan_activated_at: new Date().toISOString()
      })
      if (updated) {
        setWedding(updated)
        success('Thanh toán demo thành công! Gói dịch vụ đã được kích hoạt.')
      }
    } catch (e) {
      error('Không thể nâng cấp. Vui lòng thử lại.')
    } finally {
      setPaying(false)
    }
  }

  const updatePlan = (planId: string, patch: Partial<Plan>) => {
    setPlans((prev) => prev.map((plan) => (plan.id === planId ? { ...plan, ...patch } : plan)))
  }

  const removePlan = (planId: string) => {
    setPlans((prev) => prev.filter((plan) => plan.id !== planId))
  }

  return (
    <StudioLayout>
      <div className='max-w-5xl mx-auto py-10'>
        <div className='text-center mb-16'>
          <h1 className='text-4xl font-serif font-bold text-gray-900 mb-4'>Nâng Cấp Gói Dịch Vụ</h1>
          <p className='text-gray-500 text-lg'>Mở khóa toàn bộ tính năng cao cấp cho đám cưới của bạn</p>
        </div>

        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-xl font-bold text-gray-900'>Danh sách gói</h2>
          <div className='flex items-center gap-4'>
            {isAdminMode && (
              <button
                onClick={() => router.push('/studio/upgrade/add')}
                className='flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-700'
              >
                <Plus size={18} />
                Tạo gói mới
              </button>
            )}
            <label className='flex items-center gap-3 text-sm font-semibold text-gray-600'>
              <span>Chế độ quản trị</span>
              <button
                type='button'
                onClick={() => setIsAdminMode((prev) => !prev)}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                  isAdminMode ? 'bg-pink-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
                    isAdminMode ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
          </div>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 items-start'>
          {(isAdminMode ? plans : visiblePlans).map((plan) => {
            const discountActive = isDiscountActive(plan)
            const displayPrice = discountActive && plan.discountPrice ? plan.discountPrice : plan.price
            return (
              <div
                key={plan.id}
                className={`bg-white p-8 rounded-3xl border shadow-sm relative ${
                  plan.highlight ? 'border-pink-500 shadow-xl' : 'border-gray-100'
                } ${plan.isActive === false ? 'opacity-60' : ''}`}
              >
                {plan.highlight && (
                  <div className='absolute top-0 right-0 bg-gradient-to-l from-pink-500 to-rose-500 text-white text-sm font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider'>
                    Phổ Biến Nhất
                  </div>
                )}
                <div className='mb-6'>
                  <h3 className='text-xl font-bold text-gray-900'>{plan.name}</h3>
                  <div className='mt-4 flex items-baseline gap-3 flex-wrap'>
                    <span className='text-4xl font-extrabold tracking-tight text-pink-600'>
                      {formatVnd(displayPrice)}
                    </span>
                    {discountActive && (
                      <span className='text-sm font-semibold text-gray-400 line-through opacity-70'>
                        {formatVnd(plan.price)}
                      </span>
                    )}
                  </div>
                  {plan.duration && (
                    <div className='mt-2 text-sm font-semibold text-gray-500'>Thời gian: {plan.duration}</div>
                  )}
                  {discountActive && plan.discountEndsAt && (
                    <div className='mt-3 inline-flex items-center gap-2 text-sm font-semibold text-pink-600 bg-pink-50 px-3 py-1 rounded-full'>
                      <Clock size={14} /> Ưu đãi đến {new Date(plan.discountEndsAt).toLocaleDateString('vi-VN')}
                    </div>
                  )}
                  <p className='mt-4 text-gray-500'>{plan.description}</p>
                </div>
                <ul className='space-y-4 mb-8'>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className='flex items-center text-gray-700 font-medium'>
                      <div className='mr-3 bg-pink-100 rounded-full p-1 text-pink-600'>
                        <Check size={14} />
                      </div>
                      {feature}
                    </li>
                  ))}
                  {plan.notIncluded.map((feature, idx) => (
                    <li key={idx} className='flex items-center text-gray-400 text-sm'>
                      <span className='mr-3 text-gray-300'>•</span>
                      <span className='line-through'>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className='space-y-3'>
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={currentPlan === plan.id || paying}
                    className='w-full py-4 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-pink-200 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:scale-100'
                  >
                    {currentPlan === plan.id ? (
                      <>
                        <Check size={20} /> Đang sử dụng
                      </>
                    ) : paying ? (
                      'Đang xử lý...'
                    ) : (
                      <>
                        <CreditCard size={20} /> Thanh Toán Ngay (Demo)
                      </>
                    )}
                  </button>
                  {currentPlan !== plan.id && (
                    <div className='flex items-center justify-center gap-2 text-sm text-gray-400'>
                      <Sparkles size={14} /> Demo kích hoạt gói để test nhanh.
                    </div>
                  )}
                  <p className='text-center text-sm text-gray-400'>Hoàn tiền 100% nếu không hài lòng trong 7 ngày.</p>
                </div>

                {isAdminMode && (
                  <div className='mt-8 border-t border-gray-100 pt-6'>
                    <div className='flex flex-wrap gap-3 items-center'>
                      <button
                        onClick={() =>
                          router.push({
                            pathname: `/studio/upgrade/${plan.id}/edit`,
                            query: { packageData: JSON.stringify(plan) }
                          })
                        }
                        className='flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50'
                      >
                        <Edit size={16} />
                        Chỉnh sửa
                      </button>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm text-gray-600'>Hiển thị:</span>
                        <button
                          onClick={async () => {
                            const newStatus = !plan.isActive
                            try {
                              const response = await fetch(`/api/packages/${plan.id}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ is_active: newStatus })
                              })
                              const result = await response.json()
                              if (result.success) {
                                // Reload packages
                                const updatedPackages = await fetchPackages()
                                setPlans(updatedPackages)
                                success(newStatus ? 'Đã kích hoạt gói' : 'Đã ẩn gói')
                              } else {
                                error('Không thể thay đổi trạng thái')
                              }
                            } catch (e) {
                              error('Có lỗi xảy ra')
                            }
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            plan.isActive ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              plan.isActive ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </StudioLayout>
  )
}
```

### pages\studio\upgrade\[id]\[action].tsx

```tsx
import StudioLayout from '@/components/studio/StudioLayout'
import { useToast } from '@/components/ui/ToastProvider'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

// Interface cho API response
interface ApiPackage {
  id: number
  name: string
  price: number
  original_price: number
  duration_months: number
  max_rsvps: number
  features: any // Can be string[] or object with structure
  promotion_end_date: string
  created_at: string
  templates: any[]
}

// API functions
const updatePackageAPI = async (id: number, packageData: Partial<ApiPackage>): Promise<ApiPackage | null> => {
  try {
    const response = await fetch(`/api/packages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(packageData)
    })
    const result = await response.json()
    return result.success && result.data ? result.data : null
  } catch (error) {
    console.error('Error updating package:', error)
    return null
  }
}

const getPackageById = async (id: number): Promise<ApiPackage | null> => {
  try {
    const response = await fetch(`/api/packages/${id}`)
    const result = await response.json()
    return result.success && result.data ? result.data : null
  } catch (error) {
    console.error('Error fetching package:', error)
    return null
  }
}

export default function UpgradeActionPage() {
  const router = useRouter()
  const { action, id } = router.query

  if (!router.isReady) return null

  const packageId = parseInt(id as string)

  if (action === 'edit') {
    return <EditPackagePage packageId={packageId} />
  }

  // Invalid action, redirect
  router.push('/studio/upgrade')
  return null
}

// Component: Edit Package
function EditPackagePage({ packageId }: { packageId: number }) {
  const router = useRouter()
  const { success, error } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    originalPrice: 0,
    price: 0,
    durationMonths: 12,
    maxRsvps: 100,
    featuresText: ''
  })

  useEffect(() => {
    const loadPackage = async () => {
      // Thử lấy data từ router query trước (đã có từ listing page)
      const { packageData } = router.query
      if (packageData && typeof packageData === 'string') {
        try {
          const plan = JSON.parse(packageData)
          // Parse duration from "12 tháng" or "Vĩnh viễn" format
          let durationMonths = 12
          if (plan.duration) {
            if (plan.duration.toLowerCase().includes('vĩnh viễn')) {
              durationMonths = 60
            } else {
              const match = plan.duration.match(/\d+/)
              if (match) {
                durationMonths = parseInt(match[0])
              }
            }
          }

          // Extract features from new or old format
          let featuresText = ''
          if (Array.isArray(plan.features)) {
            featuresText = plan.features.join('\n')
          } else if (plan.features && Array.isArray(plan.features.features)) {
            featuresText = plan.features.features.join('\n')
          }

          setFormData({
            name: plan.name,
            originalPrice: plan.price,
            price: plan.discountPrice || plan.price,
            durationMonths: durationMonths,
            maxRsvps: plan.maxRsvps || 100,
            featuresText: featuresText
          })
          setLoading(false)
          return
        } catch (e) {
          console.error('Parse packageData error:', e)
        }
      }

      // Fallback: Gọi API nếu không có data (user refresh/bookmark)
      const pkg = await getPackageById(packageId)
      if (pkg) {
        // Extract features from new or old format
        let featuresText = ''
        if (Array.isArray(pkg.features)) {
          featuresText = pkg.features.join('\n')
        } else if (pkg.features && typeof pkg.features === 'object') {
          const featureData = pkg.features as any
          if (Array.isArray(featureData.features)) {
            featuresText = featureData.features.join('\n')
          }
        }

        setFormData({
          name: pkg.name,
          originalPrice: pkg.original_price,
          price: pkg.price,
          durationMonths: pkg.duration_months,
          maxRsvps: pkg.max_rsvps,
          featuresText: featuresText
        })
      } else {
        error('Không tìm thấy gói này.')
        router.push('/studio/upgrade')
      }
      setLoading(false)
    }
    loadPackage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageId, router.query])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      error('Vui lòng nhập tên gói.')
      return
    }
    if (formData.originalPrice <= 0) {
      error('Vui lòng nhập giá gốc hợp lệ.')
      return
    }
    if (formData.price < 0) {
      error('Giá khuyến mãi không thể âm.')
      return
    }
    if (formData.price > 0 && formData.price > formData.originalPrice) {
      error('Giá khuyến mãi phải nhỏ hơn giá gốc.')
      return
    }
    if (formData.maxRsvps <= 0) {
      error('Số lượng khách mời phải lớn hơn 0.')
      return
    }
    if (formData.durationMonths <= 0) {
      error('Thời gian phải lớn hơn 0.')
      return
    }

    setSaving(true)
    try {
      const features = formData.featuresText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)

      if (features.length === 0) {
        error('Vui lòng nhập ít nhất 1 tính năng.')
        setSaving(false)
        return
      }

      // Lưu features theo format mới với structure đầy đủ
      const featuresData = {
        features: features,
        highlight: false,
        description: '',
        notIncluded: []
      }

      const packageData = {
        name: formData.name.trim(),
        price: formData.price || formData.originalPrice,
        original_price: formData.originalPrice,
        duration_months: formData.durationMonths,
        max_rsvps: formData.maxRsvps,
        features: featuresData
      }

      const result = await updatePackageAPI(packageId, packageData)

      if (result) {
        success('Đã cập nhật gói thành công!')
        router.push('/studio/upgrade')
      } else {
        error('Không thể cập nhật gói. Vui lòng thử lại.')
      }
    } catch (e) {
      error('Có lỗi xảy ra khi cập nhật gói.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <StudioLayout>
        <div className='max-w-3xl mx-auto py-10'>
          <p className='text-center text-gray-500'>Đang tải...</p>
        </div>
      </StudioLayout>
    )
  }

  return (
    <StudioLayout>
      <div className='max-w-3xl mx-auto py-10'>
        <button
          onClick={() => router.push('/studio/upgrade')}
          className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6'
        >
          <ArrowLeft size={20} />
          Quay lại danh sách
        </button>

        <h1 className='text-3xl font-bold text-gray-900 mb-8'>Chỉnh sửa gói</h1>

        <form onSubmit={handleSubmit} className='bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6'>
          <div className='grid gap-6 md:grid-cols-2'>
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Tên gói *</label>
              <input
                type='text'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className='w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-200'
              />
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Thời gian (tháng) *</label>
              <input
                type='number'
                min={1}
                value={formData.durationMonths}
                onChange={(e) => setFormData({ ...formData, durationMonths: parseInt(e.target.value) || 12 })}
                className='w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-200'
              />
              <p className='text-xs text-gray-400 mt-1'>60 = Vĩnh viễn</p>
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Giá gốc (VNĐ) *</label>
              <input
                type='number'
                min={0}
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: parseInt(e.target.value) || 0 })}
                className='w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-200'
              />
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Giá khuyến mãi (VNĐ)</label>
              <input
                type='number'
                min={0}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                className='w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-200'
              />
              <p className='text-xs text-gray-400 mt-1'>Để 0 nếu không có khuyến mãi (sẽ dùng giá gốc)</p>
            </div>

            <div className='md:col-span-2'>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Tối đa khách mời *</label>
              <input
                type='number'
                min={0}
                value={formData.maxRsvps}
                onChange={(e) => setFormData({ ...formData, maxRsvps: parseInt(e.target.value) || 100 })}
                className='w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-200'
              />
            </div>

            <div className='md:col-span-2'>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Tính năng (mỗi dòng 1 tính năng) *</label>
              <textarea
                rows={8}
                value={formData.featuresText}
                onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                className='w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-200'
              />
            </div>
          </div>

          <div className='flex items-center justify-between pt-6 border-t border-gray-100'>
            <button
              type='button'
              onClick={() => router.push('/studio/upgrade')}
              className='px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50'
            >
              Hủy
            </button>
            <button
              type='submit'
              disabled={saving}
              className='flex items-center gap-2 px-6 py-3 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <Save size={20} />
              {saving ? 'Đang lưu...' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </StudioLayout>
  )
}
```

### pages\studio\upgrade.tsx

```tsx
import StudioEmptyState from '@/components/studio/StudioEmptyState'
import StudioLayout from '@/components/studio/StudioLayout'
import StudioLoading from '@/components/studio/StudioLoading'
import { useToast } from '@/components/ui/ToastProvider'
import { dataService } from '@/lib/data-service'
import { Plan, formatVnd, isDiscountActive } from '@/lib/plan-store'
import { useWedding } from '@/lib/useWedding'
import { Check, Clock, CreditCard, Edit, Plus, Sparkles, Trash2 } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

// Interface cho API response
interface ApiPackage {
  id: number
  name: string
  price: number
  original_price: number
  duration_months: number
  max_rsvps: number
  features: any // Can be string[] or object with structure
  promotion_end_date: string
  is_active: boolean
  created_at: string
  templates: any[]
}

// Hàm chuyển đổi data từ API sang format Plan
const mapApiPackageToPlan = (pkg: ApiPackage): Plan => {
  // Check if features is new format (object) or old format (array)
  let featuresArray: string[] = []
  let notIncludedArray: string[] = []
  let highlight = false
  let description = `Tối đa ${pkg.max_rsvps} khách mời`

  if (pkg.features && typeof pkg.features === 'object' && !Array.isArray(pkg.features)) {
    // New format: features is an object with structure
    const featureData = pkg.features as any
    featuresArray = Array.isArray(featureData.features) ? featureData.features : []
    notIncludedArray = Array.isArray(featureData.notIncluded) ? featureData.notIncluded : []
    highlight = featureData.highlight || false
    description = featureData.description || description
  } else if (Array.isArray(pkg.features)) {
    // Old format: features is simple array
    featuresArray = pkg.features
  }

  return {
    id: String(pkg.id),
    name: pkg.name,
    price: pkg.original_price || pkg.price,
    discountPrice: pkg.price < pkg.original_price ? pkg.price : undefined,
    discountEndsAt: pkg.promotion_end_date !== '2100-01-01T00:00:00+00:00' ? pkg.promotion_end_date : undefined,
    duration: pkg.duration_months >= 60 ? 'Vĩnh viễn' : `${pkg.duration_months} tháng`,
    description: description,
    features: featuresArray,
    notIncluded: notIncludedArray,
    highlight: highlight,
    isActive: pkg.is_active
  }
}

const fetchPackages = async (): Promise<Plan[]> => {
  try {
    const response = await fetch('/api/packages')
    const result = await response.json()

    if (result.success && result.data) {
      return result.data.map(mapApiPackageToPlan)
    }
    return []
  } catch (error) {
    console.error('Error fetching packages:', error)
    return []
  }
}

const deletePackageAPI = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`/api/packages/${id}`, {
      method: 'DELETE'
    })
    const result = await response.json()
    return result.success
  } catch (error) {
    console.error('Error deleting package:', error)
    return false
  }
}

export default function UpgradePage() {
  const router = useRouter()
  const { wedding, setWedding, loading } = useWedding()
  const [paying, setPaying] = useState(false)
  const [plans, setPlans] = useState<Plan[]>([])
  const [plansLoading, setPlansLoading] = useState(true)
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { success, error } = useToast()

  useEffect(() => {
    const loadPackages = async () => {
      setPlansLoading(true)
      try {
        const data = await fetchPackages()
        setPlans(data)
      } finally {
        setPlansLoading(false)
      }
    }
    loadPackages()
  }, [])

  const visiblePlans = useMemo(() => plans.filter((plan) => plan.isActive !== false), [plans])

  // Get current plan and calculate prices (must be before any return statements)
  const currentPlan = wedding?.content?.plan || ''

  // Find current plan details
  const currentPlanDetails = useMemo(() => {
    if (!currentPlan || !plans.length) return null
    return plans.find((p) => p.id === currentPlan)
  }, [currentPlan, plans])

  // Get the actual price to pay for current plan (considering discount)
  const getCurrentPlanPrice = useMemo(() => {
    if (!currentPlanDetails) return 0
    const discountActive = isDiscountActive(currentPlanDetails)
    return discountActive && currentPlanDetails.discountPrice
      ? currentPlanDetails.discountPrice
      : currentPlanDetails.price
  }, [currentPlanDetails])

  const currentPlanPrice = getCurrentPlanPrice

  if (loading || plansLoading) {
    return (
      <StudioLayout>
        <StudioLoading message='Đang tải gói dịch vụ...' />
      </StudioLayout>
    )
  }

  if (!wedding) {
    return (
      <StudioLayout>
        <StudioEmptyState />
      </StudioLayout>
    )
  }

  const handleUpgrade = async (plan: Plan) => {
    if (paying) return
    setPaying(true)
    try {
      const discountActive = isDiscountActive(plan)
      let finalPrice = discountActive && plan.discountPrice ? plan.discountPrice : plan.price

      // Deduct current plan price if user already has a plan
      if (currentPlanDetails && currentPlanPrice > 0) {
        finalPrice = Math.max(0, finalPrice - currentPlanPrice)
      }

      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          planName: plan.name,
          amount: finalPrice,
          weddingId: wedding.id
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Lỗi tạo thanh toán')

      // Redirect to VNPay payment page
      window.location.href = data.paymentUrl
    } catch (e: any) {
      error(e.message || 'Không thể tạo thanh toán. Vui lòng thử lại.')
      setPaying(false)
    }
  }

  const removePlan = async (packageId: number) => {
    if (deleting) return

    // Xác nhận trước khi xóa
    if (!confirm(`Bạn có chắc muốn xóa gói này?`)) {
      return
    }

    setDeleting(true)
    try {
      const result = await deletePackageAPI(packageId)

      if (!result) {
        throw new Error('Không thể xóa gói')
      }

      success('Đã xóa gói thành công!')

      // Reload packages from database
      const updatedPlans = await fetchPackages()
      setPlans(updatedPlans)
    } catch (err: any) {
      console.error('Delete package error:', err)
      error(err.message || 'Không thể xóa gói. Vui lòng thử lại.')
    } finally {
      setDeleting(false)
    }
  }

  const handleEdit = (plan: Plan) => {
    // Chuyển đến trang edit
    router.push({
      pathname: `/studio/upgrade/${plan.id}/edit`,
      query: { packageData: JSON.stringify(plan) }
    })
  }

  return (
    <StudioLayout>
      <div className='max-w-5xl mx-auto py-10'>
        <div className='text-center mb-16'>
          <h1 className='text-4xl font-serif font-bold text-gray-900 mb-4'>Nâng Cấp Gói Dịch Vụ</h1>
          <p className='text-gray-500 text-lg'>Mở khóa toàn bộ tính năng cao cấp cho đám cưới của bạn</p>
        </div>

        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-xl font-bold text-gray-900'>Danh sách gói</h2>
          <div className='flex items-center gap-4'>
            {isAdminMode && (
              <button
                onClick={() => router.push('/studio/upgrade/add')}
                className='flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-700'
              >
                <Plus size={18} />
                Tạo gói mới
              </button>
            )}
            <label className='flex items-center gap-3 text-sm font-semibold text-gray-600'>
              <span>Chế độ quản trị</span>
              <button
                type='button'
                onClick={() => setIsAdminMode((prev) => !prev)}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                  isAdminMode ? 'bg-pink-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
                    isAdminMode ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
          </div>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 items-start'>
          {(isAdminMode ? plans : visiblePlans).map((plan) => {
            const discountActive = isDiscountActive(plan)
            let displayPrice = discountActive && plan.discountPrice ? plan.discountPrice : plan.price

            // Check if this plan is lower than current plan
            const isLowerThanCurrent = currentPlanDetails && displayPrice <= currentPlanPrice
            const isCurrentPlan = currentPlan === plan.id

            // Calculate upgrade price (deduct current plan price)
            let upgradePrice = displayPrice
            let showUpgradePrice = false
            if (currentPlanDetails && !isCurrentPlan && !isLowerThanCurrent && currentPlanPrice > 0) {
              upgradePrice = Math.max(0, displayPrice - currentPlanPrice)
              showUpgradePrice = true
            }

            return (
              <div
                key={plan.id}
                className={`bg-white p-8 rounded-3xl border shadow-sm relative ${
                  plan.highlight ? 'border-pink-500 shadow-xl' : 'border-gray-100'
                } ${plan.isActive === false ? 'opacity-60' : ''}`}
              >
                {plan.highlight && (
                  <div className='absolute top-0 right-0 bg-gradient-to-l from-pink-500 to-rose-500 text-white text-sm font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider'>
                    Phổ Biến Nhất
                  </div>
                )}
                <div className='mb-6'>
                  <h3 className='text-xl font-bold text-gray-900'>{plan.name}</h3>
                  <div className='mt-4 flex items-baseline gap-3 flex-wrap'>
                    {showUpgradePrice ? (
                      <>
                        <span className='text-4xl font-extrabold tracking-tight text-pink-600'>
                          {formatVnd(upgradePrice)}
                        </span>
                        <span className='text-sm font-semibold text-gray-400 line-through opacity-70'>
                          {formatVnd(displayPrice)}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className='text-4xl font-extrabold tracking-tight text-pink-600'>
                          {formatVnd(displayPrice)}
                        </span>
                        {discountActive && (
                          <span className='text-sm font-semibold text-gray-400 line-through opacity-70'>
                            {formatVnd(plan.price)}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  {showUpgradePrice && (
                    <div className='mt-2 text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full inline-flex items-center gap-1'>
                      <Sparkles size={14} /> Đã giảm {formatVnd(currentPlanPrice)} từ gói hiện tại
                    </div>
                  )}
                  {plan.duration && (
                    <div className='mt-2 text-sm font-semibold text-gray-500'>Thời gian: {plan.duration}</div>
                  )}
                  {discountActive && plan.discountEndsAt && (
                    <div className='mt-3 inline-flex items-center gap-2 text-sm font-semibold text-pink-600 bg-pink-50 px-3 py-1 rounded-full'>
                      <Clock size={14} /> Ưu đãi đến {new Date(plan.discountEndsAt).toLocaleDateString('vi-VN')}
                    </div>
                  )}
                  <p className='mt-4 text-gray-500'>{plan.description}</p>
                </div>
                <ul className='space-y-4 mb-8'>
                  {Array.isArray(plan.features) && plan.features.length > 0 ? (
                    plan.features.map((feature, idx) => (
                      <li key={idx} className='flex items-center text-gray-700 font-medium'>
                        <div className='mr-3 bg-pink-100 rounded-full p-1 text-pink-600'>
                          <Check size={14} />
                        </div>
                        {feature}
                      </li>
                    ))
                  ) : (
                    <li className='text-gray-400 text-sm italic'>Chưa có tính năng nào</li>
                  )}
                  {Array.isArray(plan.notIncluded) &&
                    plan.notIncluded.map((feature, idx) => (
                      <li key={idx} className='flex items-center text-gray-400 text-sm'>
                        <span className='mr-3 text-gray-300'>•</span>
                        <span className='line-through'>{feature}</span>
                      </li>
                    ))}
                </ul>

                <div className='space-y-3'>
                  <button
                    onClick={() => handleUpgrade(plan)}
                    disabled={isCurrentPlan || isLowerThanCurrent || paying}
                    className='w-full py-4 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-pink-200 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed'
                  >
                    {isCurrentPlan ? (
                      <>
                        <Check size={20} /> Đang sử dụng
                      </>
                    ) : isLowerThanCurrent ? (
                      'Bạn đã sở hữu gói cao hơn'
                    ) : paying ? (
                      'Đang chuyển đến VNPay...'
                    ) : (
                      <>
                        <CreditCard size={20} /> {showUpgradePrice ? 'Nâng cấp' : 'Thanh Toán qua VNPay'}
                      </>
                    )}
                  </button>
                  <p className='text-center text-sm text-gray-400'>Hoàn tiền 100% nếu không hài lòng trong 7 ngày.</p>
                </div>

                {isAdminMode && (
                  <div className='mt-8 border-t border-gray-100 pt-6 space-y-4 text-sm'>
                    <div className='flex flex-wrap gap-3'>
                      <button
                        onClick={() => handleEdit(plan)}
                        className='px-3 py-2 rounded-lg border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 flex items-center gap-2'
                      >
                        <Edit size={16} /> Sửa
                      </button>
                      <button
                        onClick={() => removePlan(parseInt(plan.id))}
                        disabled={deleting}
                        className='px-3 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2'
                      >
                        <Trash2 size={16} /> {deleting ? 'Đang xóa...' : 'Xóa'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </StudioLayout>
  )
}
```

### pages\[slug]\index.tsx

```tsx
import RSVPForm from '@/components/guest/RSVPForm'
import { Calendar, Clock, Heart, MapPin, Music } from 'lucide-react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'

interface WeddingPageProps {
  wedding: any
}

export default function WeddingPage({ wedding }: WeddingPageProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  const [showRSVP, setShowRSVP] = useState(false)

  const { content, template } = wedding || {}

  // Merge template default_content với wedding content
  const mergedContent = {
    ...(template?.default_content || {}),
    ...content
  }

  const primaryColor = mergedContent.primary_color || '#d97706'
  const fontFamily = mergedContent.font_family || 'Cormorant Garamond, serif'

  // Countdown timer — must be before any early return
  useEffect(() => {
    if (mergedContent.wedding_date) {
      const interval = setInterval(() => {
        const weddingDate = new Date(`${mergedContent.wedding_date}T${mergedContent.wedding_time || '00:00'}`)
        const now = new Date()
        const diff = weddingDate.getTime() - now.getTime()

        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((diff % (1000 * 60)) / 1000)
          setTimeRemaining({ days, hours, minutes, seconds })
        } else {
          setTimeRemaining(null)
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [mergedContent.wedding_date, mergedContent.wedding_time])

  // 404 nếu không tìm thấy
  if (!wedding) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>404 - Wedding not found</h1>
          <p className='text-gray-500'>Không tìm thấy thiệp cưới với slug này.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>
          {mergedContent.groom_name} & {mergedContent.bride_name} - Thiệp Cưới
        </title>
        <meta
          name='description'
          content={`Trân trọng kính mời bạn đến dự lễ thành hôn của ${mergedContent.groom_name} và ${mergedContent.bride_name}`}
        />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap'
          rel='stylesheet'
        />
      </Head>

      <div className='min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50' style={{ fontFamily }}>
        {/* Hero Section */}
        <section className='relative min-h-screen flex items-center justify-center overflow-hidden'>
          {/* Background Pattern */}
          <div className='absolute inset-0 opacity-5'>
            <div
              className='absolute inset-0'
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }}
            ></div>
          </div>

          {/* Decorative Elements */}
          <div
            className='absolute top-10 left-10 w-32 h-32 border-2 rounded-full opacity-20'
            style={{ borderColor: primaryColor }}
          ></div>
          <div
            className='absolute bottom-10 right-10 w-40 h-40 border-2 rounded-full opacity-20'
            style={{ borderColor: primaryColor }}
          ></div>

          <div className='relative z-10 text-center px-4 max-w-4xl mx-auto'>
            {/* Save The Date Badge */}
            <div
              className='inline-block mb-8 px-6 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border'
              style={{ borderColor: `${primaryColor}20` }}
            >
              <p className='text-sm font-medium tracking-[0.3em] uppercase' style={{ color: primaryColor }}>
                Save The Date
              </p>
            </div>

            {/* Names */}
            <h1
              className='text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight'
              style={{ color: primaryColor }}
            >
              {mergedContent.groom_name}
              <span className='block text-3xl md:text-4xl my-4 opacity-60'>&</span>
              {mergedContent.bride_name}
            </h1>

            {/* Date */}
            {mergedContent.wedding_date && (
              <p className='text-xl md:text-2xl text-gray-600 mb-8 font-light tracking-wider'>
                {new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}

            {/* Divider */}
            <div className='flex items-center justify-center gap-4 my-8'>
              <div
                className='h-px w-16 bg-gradient-to-r from-transparent'
                style={{ background: `linear-gradient(to right, transparent, ${primaryColor})` }}
              ></div>
              <Heart size={24} fill={primaryColor} color={primaryColor} className='animate-pulse' />
              <div
                className='h-px w-16 bg-gradient-to-l from-transparent'
                style={{ background: `linear-gradient(to left, transparent, ${primaryColor})` }}
              ></div>
            </div>

            {/* Subtitle */}
            <p className='text-lg md:text-xl text-gray-500 italic max-w-2xl mx-auto'>
              Trân trọng kính mời bạn đến dự buổi lễ thành hôn của chúng tôi
            </p>

            {/* Scroll Indicator */}
            <div className='mt-16 animate-bounce'>
              <div
                className='w-6 h-10 border-2 rounded-full mx-auto flex items-start justify-center p-2'
                style={{ borderColor: primaryColor }}
              >
                <div className='w-1 h-3 rounded-full' style={{ backgroundColor: primaryColor }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Countdown Section */}
        {timeRemaining && (
          <section
            className='py-16 px-4'
            style={{ background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}05)` }}
          >
            <div className='max-w-4xl mx-auto text-center'>
              <h2 className='text-3xl md:text-4xl font-bold mb-4' style={{ color: primaryColor }}>
                Đếm Ngược Đến Ngày Vui
              </h2>
              <p className='text-gray-600 mb-8'>Chỉ còn một chút nữa thôi...</p>

              <div className='grid grid-cols-4 gap-4 md:gap-8'>
                {[
                  { label: 'Ngày', value: timeRemaining.days },
                  { label: 'Giờ', value: timeRemaining.hours },
                  { label: 'Phút', value: timeRemaining.minutes },
                  { label: 'Giây', value: timeRemaining.seconds }
                ].map((item) => (
                  <div
                    key={item.label}
                    className='bg-white rounded-2xl shadow-lg p-4 md:p-6 border'
                    style={{ borderColor: `${primaryColor}20` }}
                  >
                    <div className='text-3xl md:text-5xl font-bold mb-2' style={{ color: primaryColor }}>
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div className='text-xs md:text-sm text-gray-500 uppercase tracking-wider'>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Event Details Section */}
        <section className='py-20 px-4 bg-white'>
          <div className='max-w-4xl mx-auto'>
            <div className='text-center mb-16'>
              <h2 className='text-4xl md:text-5xl font-bold mb-4' style={{ color: primaryColor }}>
                Thông Tin Sự Kiện
              </h2>
              <div className='w-20 h-1 mx-auto rounded-full' style={{ backgroundColor: primaryColor }}></div>
            </div>

            <div className='grid md:grid-cols-2 gap-8'>
              {/* Date & Time */}
              <div
                className='bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 shadow-lg border'
                style={{ borderColor: `${primaryColor}20` }}
              >
                <div className='flex items-center gap-4 mb-4'>
                  <div className='p-3 rounded-full' style={{ backgroundColor: `${primaryColor}20` }}>
                    <Calendar size={24} color={primaryColor} />
                  </div>
                  <h3 className='text-xl font-semibold text-gray-800'>Thời Gian</h3>
                </div>
                <p className='text-gray-600 text-lg mb-2'>
                  {mergedContent.wedding_date &&
                    new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                </p>
                <div className='flex items-center gap-2 text-gray-500'>
                  <Clock size={18} />
                  <span>Lúc {mergedContent.wedding_time || '00:00'}</span>
                </div>
              </div>

              {/* Location */}
              <div
                className='bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 shadow-lg border'
                style={{ borderColor: `${primaryColor}20` }}
              >
                <div className='flex items-center gap-4 mb-4'>
                  <div className='p-3 rounded-full' style={{ backgroundColor: `${primaryColor}20` }}>
                    <MapPin size={24} color={primaryColor} />
                  </div>
                  <h3 className='text-xl font-semibold text-gray-800'>Địa Điểm</h3>
                </div>
                <p className='text-gray-600 text-lg mb-4'>{mergedContent.address}</p>
                {mergedContent.map_url && (
                  <a
                    href={mergedContent.map_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all hover:scale-105'
                    style={{ backgroundColor: primaryColor }}
                  >
                    <MapPin size={18} />
                    Xem Bản Đồ
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        {mergedContent.images && mergedContent.images.length > 0 && (
          <section
            className='py-20 px-4'
            style={{ background: `linear-gradient(to bottom, ${primaryColor}05, white)` }}
          >
            <div className='max-w-6xl mx-auto'>
              <div className='text-center mb-16'>
                <h2 className='text-4xl md:text-5xl font-bold mb-4' style={{ color: primaryColor }}>
                  Khoảnh Khắc Của Chúng Tôi
                </h2>
                <div className='w-20 h-1 mx-auto rounded-full' style={{ backgroundColor: primaryColor }}></div>
              </div>

              <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {mergedContent.images.slice(0, 6).map((img: string, idx: number) => (
                  <div key={idx} className='relative group overflow-hidden rounded-2xl shadow-lg aspect-square'>
                    <img
                      src={img}
                      alt={`Wedding photo ${idx + 1}`}
                      className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'></div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* RSVP Section */}
        <section className='py-20 px-4 bg-white'>
          <div className='max-w-3xl mx-auto'>
            <div className='text-center mb-12'>
              <h2 className='text-4xl md:text-5xl font-bold mb-4' style={{ color: primaryColor }}>
                Xác Nhận Tham Dự
              </h2>
              <p className='text-gray-600 text-lg'>Vui lòng cho chúng tôi biết bạn có thể tham dự hay không</p>
            </div>

            <RSVPForm weddingId={wedding.id} />
          </div>
        </section>

        {/* Footer */}
        <footer
          className='py-12 px-4 text-center'
          style={{ background: `linear-gradient(to bottom, white, ${primaryColor}10)` }}
        >
          <div className='mb-6'>
            <Heart size={32} fill={primaryColor} color={primaryColor} className='mx-auto mb-4' />
            <p className='text-2xl font-bold mb-2' style={{ color: primaryColor }}>
              {mergedContent.groom_name} & {mergedContent.bride_name}
            </p>
            <p className='text-gray-500'>Cảm ơn bạn đã đến chung vui cùng chúng tôi</p>
          </div>
          <div className='text-sm text-gray-400'>
            <p>Powered by MoiMoi Studio</p>
          </div>
        </footer>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string }

  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )

  // Query 1: Lấy wedding data
  const { data: weddingData, error: weddingError } = await supabase
    .from('weddings')
    .select('*')
    .eq('slug', slug)
    .single()

  if (weddingError || !weddingData) {
    console.log('Wedding Error:', weddingError)
    return { props: { wedding: null } }
  }

  // Query 2: Lấy template data dựa trên template_id
  let templateData = null
  if (weddingData.template_id) {
    const { data: template, error: templateError } = await supabase
      .from('templates')
      .select('*')
      .eq('id', weddingData.template_id)
      .single()

    if (!templateError && template) {
      templateData = template
    }
    console.log('Template Data:', templateData)
  }

  // Query 3: Lấy package data dựa trên package_id
  let packageData = null
  if (weddingData.package_id) {
    const { data: pkg, error: packageError } = await supabase
      .from('packages')
      .select('*')
      .eq('id', weddingData.package_id)
      .single()

    if (!packageError && pkg) {
      packageData = pkg
    }
    console.log('Package Data:', packageData)
  }

  return {
    props: {
      wedding: {
        ...weddingData,
        content: weddingData.content || {},
        template: templateData,
        package: packageData
      }
    }
  }
}
```

### pages\[slug]\[page].tsx

```tsx
import { createClient } from '@supabase/supabase-js'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useState } from 'react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

interface GuestPageProps {
  wedding: any
  guestName: string
  slug: string
}

export default function GuestPage({ wedding, guestName, slug }: GuestPageProps) {
  const [wish, setWish] = useState('')
  const [phone, setPhone] = useState('')
  const [isAttending, setIsAttending] = useState<boolean | null>(null)
  const [partySize, setPartySize] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // 404
  if (!wedding) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fdf2f8',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>💔</div>
          <h1 style={{ color: '#9f1239', marginBottom: '8px' }}>Không tìm thấy thiệp cưới</h1>
          <p style={{ color: '#6b7280' }}>Link mời có thể đã hết hạn hoặc không hợp lệ.</p>
        </div>
      </div>
    )
  }

  const { content, template } = wedding
  const mergedContent = { ...(template?.default_content || {}), ...content }
  const primary = mergedContent.primary_color || '#e11d48'
  const formattedName = guestName

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSubmitError('')

    try {
      const { error } = await supabase.from('rsvps').insert({
        wedding_id: wedding.id,
        guest_name: formattedName,
        phone: phone.trim() || null,
        is_attending: isAttending,
        party_size: isAttending ? partySize : 1,
        wishes: wish.trim() || null
      })

      if (error) throw error
      setSubmitted(true)
    } catch (err: any) {
      console.error('RSVP error:', err)
      setSubmitError('Có lỗi xảy ra, vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    border: '1.5px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    background: '#fafafa',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    color: '#111827'
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '600',
    fontSize: '13px',
    color: '#374151',
    letterSpacing: '0.04em'
  }

  return (
    <>
      <Head>
        <title>Thiệp mời — {formattedName}</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link
          href='https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap'
          rel='stylesheet'
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #fdf2f8; -webkit-font-smoothing: antialiased; }
          input:focus, textarea:focus, select:focus {
            border-color: ${primary} !important;
            background: #fff !important;
            box-shadow: 0 0 0 3px ${primary}20 !important;
            outline: none;
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes floatY {
            0%, 100% { transform: translateY(0); }
            50%       { transform: translateY(-10px); }
          }
          @keyframes shimmer {
            0%   { background-position: -200% center; }
            100% { background-position:  200% center; }
          }
          .anim-fade { animation: fadeUp 0.55s cubic-bezier(.22,.68,0,1.2) both; }
          .anim-fade:nth-child(2) { animation-delay: .08s; }
          .anim-fade:nth-child(3) { animation-delay: .16s; }
          .anim-fade:nth-child(4) { animation-delay: .24s; }
          .float { animation: floatY 3.2s ease-in-out infinite; display: inline-block; }
          .btn-attend:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(34,197,94,.25); }
          .btn-decline:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(239,68,68,.25); }
          .btn-submit:not(:disabled):hover { transform: translateY(-2px); }
        `}</style>
      </Head>

      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(155deg,#fdf2f8 0%,#fce7f3 45%,#fdf4ff 100%)',
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {/* ── Hero ── */}
        <div style={{ position: 'relative', overflow: 'hidden', padding: '64px 20px 72px', textAlign: 'center' }}>
          {/* background blobs */}
          <div
            style={{
              position: 'absolute',
              top: -80,
              right: -80,
              width: 260,
              height: 260,
              borderRadius: '50%',
              background: `${primary}12`,
              pointerEvents: 'none'
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -50,
              left: -50,
              width: 180,
              height: 180,
              borderRadius: '50%',
              background: `${primary}0d`,
              pointerEvents: 'none'
            }}
          />

          <div
            className='float'
            style={{ fontSize: '3.2rem', marginBottom: '22px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,.12))' }}
          >
            💍
          </div>

          <p
            style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#9ca3af',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '14px'
            }}
          >
            TRÂN TRỌNG KÍNH MỜI
          </p>

          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2rem, 7vw, 3.4rem)',
              fontWeight: '700',
              color: primary,
              lineHeight: 1.15,
              marginBottom: '14px',
              textShadow: `0 2px 30px ${primary}35`
            }}
          >
            {formattedName}
          </h1>

          <p style={{ fontSize: '15px', color: '#9ca3af', fontWeight: '300', marginBottom: '10px' }}>
            tới tham dự lễ thành hôn của
          </p>

          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
              fontWeight: '700',
              color: '#1f2937',
              letterSpacing: '0.01em'
            }}
          >
            {mergedContent.groom_name} &amp; {mergedContent.bride_name}
          </h2>

          {/* divider */}
          <div
            style={{
              margin: '24px auto 0',
              width: '60px',
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${primary}, transparent)`
            }}
          />
        </div>

        {/* ── Cards ── */}
        <div
          style={{
            maxWidth: '540px',
            margin: '0 auto',
            padding: '0 16px 70px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {/* Cover image */}
          {mergedContent.cover_image && (
            <div
              className='anim-fade'
              style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,.13)' }}
            >
              <img
                src={mergedContent.cover_image}
                alt='Wedding Cover'
                style={{ width: '100%', display: 'block', maxHeight: '300px', objectFit: 'cover' }}
              />
            </div>
          )}

          {/* Event info */}
          <div
            className='anim-fade'
            style={{
              background: 'rgba(255,255,255,.82)',
              backdropFilter: 'blur(16px)',
              borderRadius: '20px',
              padding: '26px 24px',
              border: '1px solid rgba(255,255,255,.95)',
              boxShadow: '0 4px 24px rgba(0,0,0,.05)'
            }}
          >
            <p
              style={{
                fontSize: '11px',
                fontWeight: '700',
                color: primary,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                textAlign: 'center',
                marginBottom: '18px'
              }}
            >
              ✨ Thông tin sự kiện
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { icon: '📅', label: 'Ngày cưới', value: mergedContent.event_date },
                { icon: '⏰', label: 'Giờ', value: mergedContent.wedding_time },
                { icon: '📍', label: 'Địa điểm', value: mergedContent.address }
              ].map(({ icon, label, value }) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px 14px',
                    background: `${primary}08`,
                    borderRadius: '12px'
                  }}
                >
                  <span style={{ fontSize: '20px', flexShrink: 0, lineHeight: 1 }}>{icon}</span>
                  <div>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        color: primary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        display: 'block',
                        marginBottom: '2px'
                      }}
                    >
                      {label}
                    </span>
                    <span style={{ fontSize: '15px', color: '#111827', fontWeight: '500', lineHeight: 1.4 }}>
                      {value || '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RSVP Form / Success */}
          {!submitted ? (
            <div
              className='anim-fade'
              style={{
                background: 'rgba(255,255,255,.92)',
                backdropFilter: 'blur(16px)',
                borderRadius: '20px',
                padding: '28px 24px',
                border: '1px solid rgba(255,255,255,.95)',
                boxShadow: '0 4px 24px rgba(0,0,0,.05)'
              }}
            >
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: primary,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  marginBottom: '4px'
                }}
              >
                💌 Xác nhận tham dự
              </p>
              <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px', marginBottom: '24px' }}>
                Vui lòng điền thông tin để chúng tôi chuẩn bị tốt hơn
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Tham dự? */}
                <div>
                  <label style={labelStyle}>Bạn có tham dự không? *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                      type='button'
                      className='btn-attend'
                      onClick={() => setIsAttending(true)}
                      style={{
                        padding: '13px 8px',
                        borderRadius: '12px',
                        border: isAttending === true ? '2px solid #22c55e' : '1.5px solid #e5e7eb',
                        background: isAttending === true ? '#f0fdf4' : '#fafafa',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: isAttending === true ? '#15803d' : '#6b7280',
                        transition: 'all .2s',
                        fontFamily: 'inherit'
                      }}
                    >
                      ✅ Có, tôi sẽ đến
                    </button>
                    <button
                      type='button'
                      className='btn-decline'
                      onClick={() => setIsAttending(false)}
                      style={{
                        padding: '13px 8px',
                        borderRadius: '12px',
                        border: isAttending === false ? '2px solid #ef4444' : '1.5px solid #e5e7eb',
                        background: isAttending === false ? '#fef2f2' : '#fafafa',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: isAttending === false ? '#dc2626' : '#6b7280',
                        transition: 'all .2s',
                        fontFamily: 'inherit'
                      }}
                    >
                      ❌ Xin lỗi, tôi bận
                    </button>
                  </div>
                </div>

                {/* Số điện thoại */}
                <div>
                  <label style={labelStyle}>
                    Số điện thoại&nbsp;
                    <span
                      style={{
                        color: '#9ca3af',
                        fontSize: '12px',
                        fontWeight: '400',
                        textTransform: 'none',
                        letterSpacing: 0
                      }}
                    >
                      (tùy chọn)
                    </span>
                  </label>
                  <input
                    type='tel'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder='0901 234 567'
                    style={inputStyle}
                  />
                </div>

                {/* Số người tham dự — luôn hiển thị */}
                <div>
                  <label style={labelStyle}>Số người tham dự</label>
                  <div style={{ display: 'flex' }}>
                    {[1, 2, 3, 4, 5].map((n, i) => (
                      <button
                        key={n}
                        type='button'
                        onClick={() => setPartySize(n)}
                        style={{
                          flex: 1,
                          padding: '12px 4px',
                          border: '1.5px solid',
                          borderColor: partySize === n ? primary : '#e5e7eb',
                          borderRight: i < 4 ? 'none' : '1.5px solid',
                          borderRightColor: partySize === n ? primary : '#e5e7eb',
                          borderRadius: i === 0 ? '10px 0 0 10px' : i === 4 ? '0 10px 10px 0' : '0',
                          background: partySize === n ? primary : '#fafafa',
                          color: partySize === n ? '#fff' : '#6b7280',
                          fontWeight: '700',
                          fontSize: '15px',
                          cursor: 'pointer',
                          transition: 'all .18s',
                          fontFamily: 'inherit'
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '5px' }}>người tham dự</p>
                </div>

                {/* Lời chúc */}
                <div>
                  <label style={labelStyle}>
                    Lời chúc&nbsp;
                    <span
                      style={{
                        color: '#9ca3af',
                        fontSize: '12px',
                        fontWeight: '400',
                        textTransform: 'none',
                        letterSpacing: 0
                      }}
                    >
                      (tùy chọn)
                    </span>
                  </label>
                  <textarea
                    value={wish}
                    onChange={(e) => setWish(e.target.value)}
                    placeholder='Chúc hai bạn trăm năm hạnh phúc, vạn sự như ý...'
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }}
                  />
                </div>

                {/* Submit */}
                <button
                  type='submit'
                  className='btn-submit'
                  disabled={loading || isAttending === null}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background:
                      isAttending === null || loading
                        ? '#e5e7eb'
                        : `linear-gradient(135deg, ${primary} 0%, ${primary}cc 100%)`,
                    color: isAttending === null || loading ? '#9ca3af' : '#fff',
                    border: 'none',
                    borderRadius: '14px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: loading || isAttending === null ? 'not-allowed' : 'pointer',
                    letterSpacing: '0.03em',
                    transition: 'all .25s',
                    boxShadow: isAttending !== null && !loading ? `0 6px 22px ${primary}45` : 'none',
                    fontFamily: 'inherit'
                  }}
                >
                  {loading ? '⏳ Đang gửi...' : '💌 Gửi xác nhận'}
                </button>

                {/* Error */}
                {submitError && (
                  <div
                    style={{
                      padding: '12px 16px',
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '10px',
                      color: '#dc2626',
                      fontSize: '14px',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}
                  >
                    ❌ {submitError}
                  </div>
                )}
              </form>
            </div>
          ) : (
            /* ── Success Screen ── */
            <div
              className='anim-fade'
              style={{
                background: 'rgba(255,255,255,.95)',
                borderRadius: '24px',
                padding: '52px 28px',
                textAlign: 'center',
                boxShadow: '0 10px 48px rgba(0,0,0,.08)',
                border: '1px solid rgba(255,255,255,.95)'
              }}
            >
              <div className='float' style={{ fontSize: '4rem', marginBottom: '22px' }}>
                {isAttending ? '🎊' : '💝'}
              </div>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.55rem',
                  fontWeight: '700',
                  color: isAttending ? '#15803d' : primary,
                  marginBottom: '12px',
                  lineHeight: 1.3
                }}
              >
                {isAttending ? 'Hẹn gặp bạn tại đám cưới!' : 'Cảm ơn bạn đã phản hồi!'}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '15px', lineHeight: 1.75, maxWidth: '300px', margin: '0 auto' }}>
                {isAttending
                  ? `Chúng tôi rất vui được đón tiếp ${formattedName}. Hẹn gặp trong ngày vui! 🥂`
                  : 'Rất tiếc khi bạn không thể tham dự. Mong có dịp gặp nhau trong tương lai! 💕'}
              </p>
              {wish && (
                <div
                  style={{
                    marginTop: '28px',
                    padding: '16px 20px',
                    background: `${primary}08`,
                    borderRadius: '14px',
                    borderLeft: `3px solid ${primary}`,
                    textAlign: 'left'
                  }}
                >
                  <p
                    style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      color: primary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '8px'
                    }}
                  >
                    Lời chúc của bạn
                  </p>
                  <p style={{ color: '#374151', fontStyle: 'italic', fontSize: '14px', lineHeight: 1.7 }}>
                    &ldquo;{wish}&rdquo;
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug, page } = context.params as { slug: string; page: string }

  // Decode Base64 URL-safe → tên thật của khách
  let guestName = page
  try {
    const base64 = page.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '=='.slice(0, (4 - (base64.length % 4)) % 4)
    guestName = decodeURIComponent(escape(atob(padded)))
  } catch {
    // Nếu decode thất bại (ví dụ: URL cũ dạng slug), dùng thẳng page
    guestName = page
  }

  const { createClient: createServerClient } = require('@supabase/supabase-js')
  const supabaseServer = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )

  // Query 1: Lấy wedding data
  const { data: weddingData, error: weddingError } = await supabaseServer
    .from('weddings')
    .select('*')
    .eq('slug', slug)
    .single()

  if (weddingError || !weddingData) {
    return { props: { wedding: null, guestName, slug } }
  }

  // Query 2: Lấy template data
  let templateData = null
  if (weddingData.template_id) {
    const { data: template } = await supabaseServer
      .from('templates')
      .select('*')
      .eq('id', weddingData.template_id)
      .single()
    templateData = template
  }

  // Query 3: Lấy package data
  let packageData = null
  if (weddingData.package_id) {
    const { data: pkg } = await supabaseServer.from('packages').select('*').eq('id', weddingData.package_id).single()
    packageData = pkg
  }

  return {
    props: {
      slug,
      guestName, // tên thật sau khi decode Base64
      wedding: {
        ...weddingData,
        content: weddingData.content || {},
        template: templateData,
        package: packageData
      }
    }
  }
}
```

### pages_app.tsx

```tsx
import { ToastProvider } from '@/components/ui/ToastProvider'
import { supabase } from '@/lib/initSupabase'
import '@/styles/app.css'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </SessionContextProvider>
  )
}
```

### pages_document.tsx

```tsx
import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap'
          rel='stylesheet'
        />
        <link rel='icon' href='/image/logo-favicon.png' />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

### package.json

```json
{
  "name": "nextjs-todo-list",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "dev": "concurrently \"npm run dev:css\" \"next dev\"",
    "dev:css": "tailwindcss -w -i ./styles/tailwind.css -o styles/app.css",
    "build": "next build",
    "build:css": "tailwindcss -m -i ./styles/tailwind.css -o styles/app.css",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "dependencies": {
    "@next/font": "13.1.6",
    "@supabase/auth-helpers-react": "^0.3.1",
    "@supabase/auth-ui-react": "^0.2.8",
    "@supabase/auth-ui-shared": "^0.1.8",
    "@supabase/ssr": "^0.8.0",
    "@supabase/supabase-js": "^2.90.1",
    "@types/formidable": "^3.4.6",
    "@types/node": "18.14.0",
    "@types/react": "18.0.28",
    "@types/react-dom": "18.0.11",
    "cloudinary": "^2.9.0",
    "clsx": "^2.1.1",
    "eslint": "8.34.0",
    "eslint-config-next": "13.1.6",
    "formidable": "^3.5.4",
    "framer-motion": "^12.25.0",
    "lucide-react": "^0.562.0",
    "next": "13.1.6",
    "next-cloudinary": "^6.17.5",
    "qrcode": "^1.5.4",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "tailwind-merge": "^3.4.0",
    "typescript": "4.9.5",
    "vnpay": "^2.4.4"
  },
  "devDependencies": {
    "@types/qrcode": "^1.5.6",
    "concurrently": "^7.6.0",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-prettier": "^5.5.4",
    "prettier": "^3.7.4",
    "tailwindcss": "^3.2.7"
  }
}
```
