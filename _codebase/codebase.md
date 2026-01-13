# Project Export

## Project Statistics

- Total files: 26

## Folder Structure

```
components
  admin
    AdminLayout.tsx
    TabAlbum.tsx
    TabBank.tsx
    TabInfo.tsx
  landing
    Features.tsx
    Footer.tsx
    Header.tsx
    Hero.tsx
    Pricing.tsx
    TemplateGallery.tsx
  TodoList.tsx
lib
  data-service.ts
  initSupabase.ts
  mock-service.ts
  schema.ts
pages
  admin
    dashboard.tsx
    editor.tsx
    guests.tsx
    settings.tsx
  api
    hello.ts
    trigger-deploy.ts
  index.tsx
  _app.tsx
  _document.tsx
utils
  supabase
    client.ts
types
  supabase.ts

```

### components\admin\AdminLayout.tsx

```tsx
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'

interface AdminLayoutProps {
  children: ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter()

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { label: 'Editor', href: '/admin/editor', icon: '✏️' },
    { label: 'Guest Manager', href: '/admin/guests', icon: '👥' },
    { label: 'Settings', href: '/admin/settings', icon: '⚙️' }
  ]

  return (
    <div className='min-h-screen bg-gray-100 flex'>
      {/* Sidebar */}
      <aside className='w-64 bg-white shadow-md flex flex-col'>
        <div className='p-6'>
          <h1 className='text-2xl font-bold text-pink-600'>MoiMoi Admin</h1>
        </div>
        <nav className='flex-1 px-4 space-y-2'>
          {navItems.map((item) => {
            const isActive = router.pathname === item.href
            return (
              <Link href={item.href} key={item.href}>
                <span
                  className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                    isActive ? 'bg-pink-50 text-pink-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className='mr-3'>{item.icon}</span>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>
        <div className='p-4 border-t text-sm text-gray-500'>User: host_001</div>
      </aside>

      {/* Main Content */}
      <main className='flex-1 p-8 overflow-y-auto'>{children}</main>
    </div>
  )
}

export default AdminLayout

```

### components\admin\TabAlbum.tsx

```tsx
import React, { useState } from 'react'

interface TabAlbumProps {
  images: string[]
  onImagesChange: (images: string[]) => void
}

const TabAlbum: React.FC<TabAlbumProps> = ({ images, onImagesChange }) => {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = () => {
    setIsUploading(true)
    // Simulate upload delay
    setTimeout(() => {
      const newImage = `https://via.placeholder.com/400x300?text=New+Image+${images.length + 1}`
      onImagesChange([...images, newImage])
      setIsUploading(false)
    }, 1000)
  }

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove)
    onImagesChange(newImages)
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm space-y-6'>
      <h3 className='text-lg font-medium text-gray-900 border-b pb-2'>Photo Album</h3>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {images.map((img, index) => (
          <div key={index} className='relative group aspect-w-4 aspect-h-3 bg-gray-100 rounded-lg overflow-hidden'>
            <img src={img} alt={`Album ${index}`} className='object-cover w-full h-full' />
            <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center'>
              <button
                onClick={() => removeImage(index)}
                className='opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full transform scale-90 group-hover:scale-100 transition-all'
                title='Remove'
              >
                🗑️
              </button>
            </div>
          </div>
        ))}

        <div
          onClick={handleUpload}
          className='aspect-w-4 aspect-h-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-colors'
        >
          <div className='text-center p-4'>
            {isUploading ? (
              <span className='text-pink-600'>Uploading...</span>
            ) : (
              <>
                <div className='text-3xl mb-2'>📷</div>
                <span className='text-sm text-gray-500 font-medium'>Add Photo</span>
              </>
            )}
          </div>
        </div>
      </div>

      <p className='text-sm text-gray-500 italic'>
        * Note: In this mock version, clicking "Add Photo" simulates a successful upload.
      </p>
    </div>
  )
}

export default TabAlbum

```

### components\admin\TabBank.tsx

```tsx
import React from 'react'
import { Wedding } from '../../lib/data-service'

interface TabBankProps {
  data: Wedding['content']
  onChange: (key: string, value: string) => void
}

const TabBank: React.FC<TabBankProps> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    onChange(name, value)
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm space-y-6'>
      <h3 className='text-lg font-medium text-gray-900 border-b pb-2'>Banking Info</h3>

      <div className='space-y-4 max-w-lg'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Bank Name</label>
          <select
            name='bank_name'
            value={data?.bank_name || ''}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
          >
            <option value=''>Select Bank</option>
            <option value='Vietcombank'>Vietcombank</option>
            <option value='Techcombank'>Techcombank</option>
            <option value='MBBank'>MBBank</option>
            <option value='ACB'>ACB</option>
            <option value='Vietinbank'>Vietinbank</option>
            <option value='BIDV'>BIDV</option>
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Account Number</label>
          <input
            type='text'
            name='account_number'
            value={data?.account_number || ''}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono'
            placeholder='0000 0000 0000'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Account Name (Holder)</label>
          <input
            type='text'
            name='account_name'
            value={data?.account_name || ''}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 uppercase'
            placeholder='NGUYEN VAN A'
          />
        </div>
      </div>

      <div className='bg-blue-50 border-l-4 border-blue-400 p-4 mt-4'>
        <div className='flex'>
          <div className='flex-shrink-0'>ℹ️</div>
          <div className='ml-3'>
            <p className='text-sm text-blue-700'>
              In the real version, we will call VietQR API to verify the account owner's name automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TabBank

```

### components\admin\TabInfo.tsx

```tsx
import React, { useEffect, useState } from 'react'
import { Wedding } from '../../lib/data-service'

interface TabInfoProps {
  data: Wedding['content']
  onChange: (key: string, value: string) => void
}

const TabInfo: React.FC<TabInfoProps> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onChange(name, value)
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm space-y-6'>
      <h3 className='text-lg font-medium text-gray-900 border-b pb-2'>Main Information</h3>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Groom Name</label>
          <input
            type='text'
            name='groom_name'
            value={data?.groom_name || ''}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
            placeholder='Nguyen Van A'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Bride Name</label>
          <input
            type='text'
            name='bride_name'
            value={data?.bride_name || ''}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
            placeholder='Le Thi B'
          />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Wedding Date</label>
          <input
            type='date'
            name='wedding_date'
            value={data?.wedding_date || ''}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Wedding Time</label>
          <input
            type='time'
            name='wedding_time'
            value={data?.wedding_time || ''}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
          />
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Address</label>
        <input
          type='text'
          name='address'
          value={data?.address || ''}
          onChange={handleChange}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
          placeholder='123 Street, District 1, HCMC'
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Google Maps URL</label>
        <input
          type='text'
          name='map_url'
          value={data?.map_url || ''}
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
import Link from 'next/link'
import Image from 'next/image'
import { Menu } from 'lucide-react'

export default function Header() {
  return (
    <header className='fixed top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md'>
      <div className='container flex items-center justify-between h-16 px-8 mx-auto'>
        {/* Logo */}
        <div className='flex items-center'>
          <img src='/image/LOGO.png' alt='MoiMoi.STD' className='h-36 w-auto translate-y-1' />
        </div>

        {/* Desktop Menu */}
        <nav className='hidden gap-12 font-medium text-gray-600 md:flex'>
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

        {/* CTA Button */}
        <div className='hidden md:block'>
          <button className='px-6 py-2 font-medium text-white transition bg-pink-600 rounded-full hover:bg-pink-700'>
            Tạo Thiệp Ngay
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <button className='md:hidden'>
          <Menu className='w-6 h-6 text-gray-800' />
        </button>
      </div>
    </header>
  )
}

```

### components\landing\Hero.tsx

```tsx
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className='pt-32 pb-20 bg-gradient-to-b from-pink-50 to-white'>
      <div className='container px-4 mx-auto text-center'>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-6xl'
        >
          Trao tấm thiệp <br />
          <span className='text-pink-600'>Gói trọn tin yêu</span>
        </motion.h1>

        <p className='max-w-2xl mx-auto mb-8 text-lg text-gray-600'>
          Nền tảng tạo thiệp cưới online phong cách Gen Z. Tích hợp bản đồ, RSVP và QR mừng cưới chỉ trong 1 nốt nhạc.
        </p>

        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
          <button className='px-8 py-3 text-lg font-semibold text-white transition bg-pink-600 rounded-full shadow-lg hover:bg-pink-700 shadow-pink-200'>
            Dùng Thử Miễn Phí
          </button>
          <button className='px-8 py-3 text-lg font-semibold text-gray-700 transition bg-white border border-gray-200 rounded-full hover:bg-gray-50'>
            Xem Mẫu Demo
          </button>
        </div>

        {/* Placeholder cho ảnh Demo */}
        <div className='flex items-center justify-center h-64 max-w-4xl mx-auto mt-16 text-gray-400 bg-gray-200 border-4 border-white shadow-2xl md:h-96 rounded-2xl'>
          Ảnh Demo Giao Diện (Frontend sẽ thay sau)
        </div>
      </div>
    </section>
  )
}

```

### components\landing\Pricing.tsx

```tsx
import { Check, X } from 'lucide-react'

const plans = [
  {
    name: 'Trải Nghiệm',
    price: '0đ',
    desc: 'Dành cho các cặp đôi muốn thử nghiệm trước.',
    features: ['1 Mẫu thiệp cơ bản', 'Giới hạn 50 khách mời RSVP', 'Lưu trữ trong 1 tuần', 'Có logo MoiMoi Studio'],
    notIncluded: ['Nhạc nền', 'Bản đồ chỉ đường', 'QR Mừng cưới', 'Hiệu ứng mở thiệp'],
    highlight: false
  },
  {
    name: 'Gói Cơ Bản',
    price: '199.000đ',
    desc: 'Đầy đủ tính năng cần thiết cho một đám cưới.',
    features: [
      'Kho 20+ mẫu thiệp Premium',
      'Không giới hạn khách RSVP',
      'Tích hợp Bản đồ & QR Mừng cưới',
      'Nhạc nền tùy chọn',
      'Lưu trữ 6 tháng'
    ],
    notIncluded: ['Tên miền riêng (.vn)', 'Hỗ trợ thay đổi thiết kế'],
    highlight: true // Gói này sẽ nổi bật nhất
  },
  {
    name: 'Gói Cao Cấp',
    price: '499.000đ',
    desc: 'Sự hoàn hảo và hỗ trợ tận răng từ đội ngũ.',
    features: [
      'Mọi tính năng của Gói Cơ Bản',
      'Sở hữu tên miền riêng (tu-uyen.vn)',
      'Tùy chỉnh màu sắc/font chữ theo yêu cầu',
      'Chuyên viên hỗ trợ setup 1-1',
      'Lưu trữ vĩnh viễn'
    ],
    notIncluded: [],
    highlight: false
  }
]

export default function Pricing() {
  return (
    <section id='pricing' className='py-20 bg-gray-50'>
      <div className='container px-4 mx-auto'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900 md:text-4xl'>Bảng Giá Dịch Vụ</h2>
          <p className='max-w-2xl mx-auto text-gray-600'>
            Chi phí chỉ bằng 5 tấm thiệp giấy, nhưng lưu giữ kỷ niệm mãi mãi. Thanh toán 1 lần, sử dụng trọn đời.
          </p>
        </div>

        <div className='grid max-w-6xl gap-8 mx-auto md:grid-cols-3'>
          {plans.map((plan, idx) => (
            <div
              key={idx}
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
              <div className='mb-2 text-4xl font-bold text-pink-600'>{plan.price}</div>
              <p className='mb-6 text-sm text-gray-500'>{plan.desc}</p>

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
                {plan.features.map((feature, i) => (
                  <div key={i} className='flex items-start gap-3 text-sm text-gray-700'>
                    <Check className='w-5 h-5 text-green-500 shrink-0' />
                    <span>{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feature, i) => (
                  <div key={i} className='flex items-start gap-3 text-sm text-gray-400'>
                    <X className='w-5 h-5 text-gray-300 shrink-0' />
                    <span className='line-through'>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

```

### components\landing\TemplateGallery.tsx

```tsx
import { useState } from 'react'
import { ExternalLink } from 'lucide-react'

// Mock Data (Sau này sẽ fetch từ Supabase)
const TEMPLATES = [
  { id: 1, name: 'Vintage Rose', category: 'Cổ điển', color: 'bg-amber-100' },
  { id: 2, name: 'Modern Minimal', category: 'Hiện đại', color: 'bg-gray-100' },
  { id: 3, name: 'Luxury Gold', category: 'Sang trọng', color: 'bg-yellow-50' },
  { id: 4, name: 'Floral Dream', category: 'Hoa lá', color: 'bg-pink-50' },
  { id: 5, name: 'Korean Style', category: 'Hiện đại', color: 'bg-blue-50' },
  { id: 6, name: 'Traditional Red', category: 'Truyền thống', color: 'bg-red-50' }
]

const CATEGORIES = ['Tất cả', 'Hiện đại', 'Cổ điển', 'Sang trọng', 'Truyền thống']

export default function TemplateGallery() {
  const [activeCategory, setActiveCategory] = useState('Tất cả')

  const filteredTemplates =
    activeCategory === 'Tất cả' ? TEMPLATES : TEMPLATES.filter((t) => t.category === activeCategory)

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
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          {filteredTemplates.map((template) => (
            <div key={template.id} className='cursor-pointer group'>
              {/* Card Image Placeholder */}
              <div
                className={`aspect-[3/4] rounded-2xl ${template.color} relative overflow-hidden mb-4 shadow-sm border border-gray-100 transition-transform group-hover:-translate-y-2`}
              >
                <div className='absolute inset-0 flex items-center justify-center font-medium text-gray-400'>
                  Ảnh Mẫu: {template.name}
                </div>

                {/* Hover Overlay */}
                <div className='absolute inset-0 flex items-center justify-center gap-3 transition-opacity opacity-0 bg-black/40 group-hover:opacity-100'>
                  <button className='flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-900 bg-white rounded-full hover:bg-pink-50'>
                    <ExternalLink className='w-4 h-4' /> Xem Demo
                  </button>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-bold text-gray-900'>{template.name}</h3>
                <span className='px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-md'>{template.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

```

### components\TodoList.tsx

```tsx
import { Database } from '@/lib/schema'
import { Session, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'

type Todos = Database['public']['Tables']['todos']['Row']

export default function TodoList({ session }: { session: Session }) {
  const supabase = useSupabaseClient<Database>()
  const [todos, setTodos] = useState<Todos[]>([])
  const [newTaskText, setNewTaskText] = useState('')
  const [errorText, setErrorText] = useState('')

  const user = session.user

  useEffect(() => {
    const fetchTodos = async () => {
      const { data: todos, error } = await supabase.from('todos').select('*').order('id', { ascending: true })

      if (error) console.log('error', error)
      else setTodos(todos)
    }

    fetchTodos()
  }, [supabase])

  const addTodo = async (taskText: string) => {
    let task = taskText.trim()
    if (task.length) {
      const { data: todo, error } = await supabase.from('todos').insert({ task, user_id: user.id }).select().single()

      if (error) {
        setErrorText(error.message)
      } else {
        setTodos([...todos, todo])
        setNewTaskText('')
      }
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      await supabase.from('todos').delete().eq('id', id).throwOnError()
      setTodos(todos.filter((x) => x.id != id))
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <div className='w-full'>
      <h1 className='mb-12'>MoiMoi.std</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          addTodo(newTaskText)
        }}
        className='flex gap-2 my-2'
      >
        <input
          className='w-full p-2 rounded'
          type='text'
          placeholder='make coffee'
          value={newTaskText}
          onChange={(e) => {
            setErrorText('')
            setNewTaskText(e.target.value)
          }}
        />
        <button className='btn-black' type='submit'>
          Add
        </button>
      </form>
      {!!errorText && <Alert text={errorText} />}
      <div className='overflow-hidden bg-white rounded-md shadow'>
        <ul>
          {todos.map((todo) => (
            <Todo key={todo.id} todo={todo} onDelete={() => deleteTodo(todo.id)} />
          ))}
        </ul>
      </div>
    </div>
  )
}

const Todo = ({ todo, onDelete }: { todo: Todos; onDelete: () => void }) => {
  const supabase = useSupabaseClient<Database>()
  const [isCompleted, setIsCompleted] = useState(todo.is_complete)

  const toggle = async () => {
    try {
      const { data } = await supabase
        .from('todos')
        .update({ is_complete: !isCompleted })
        .eq('id', todo.id)
        .throwOnError()
        .select()
        .single()

      if (data) setIsCompleted(data.is_complete)
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <li className='block w-full transition duration-150 ease-in-out cursor-pointer hover:bg-200 focus:outline-none focus:bg-200'>
      <div className='flex items-center px-4 py-4 sm:px-6'>
        <div className='flex items-center flex-1 min-w-0'>
          <div className='text-sm font-medium leading-5 truncate'>{todo.task}</div>
        </div>
        <div>
          <input
            className='cursor-pointer'
            onChange={(e) => toggle()}
            type='checkbox'
            checked={isCompleted ? true : false}
          />
        </div>
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete()
          }}
          className='w-4 h-4 ml-2 border-2 rounded hover:border-black'
        >
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='gray'>
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      </div>
    </li>
  )
}

const Alert = ({ text }: { text: string }) => (
  <div className='p-4 my-3 bg-red-100 rounded-md'>
    <div className='text-sm leading-5 text-red-700'>{text}</div>
  </div>
)

```

### lib\data-service.ts

```ts

import { createClient } from '../utils/supabase/client';
import { Database } from '../types/supabase';

export interface Wedding extends Omit<Database['public']['Tables']['weddings']['Row'], 'content'> {
    // Helper to type the JSON content
    content: WeddingContent;
    template?: Template; // Join result
}

export type RSVP = Database['public']['Tables']['rsvps']['Row'];
export type Template = Database['public']['Tables']['templates']['Row'];

export interface WeddingContent {
    groom_name?: string;
    bride_name?: string;
    wedding_date?: string;
    wedding_time?: string;
    address?: string;
    map_url?: string;
    images?: string[];
    bank_name?: string;
    account_number?: string;
    account_name?: string;
    // Allow flexible structure as JSONB
    [key: string]: any;
}

// Hardcoded for demo purposes as requested in the plan
const DEMO_HOST_ID = 'b34c46c8-a9ef-4932-96c2-42a476d0a88b';

export const dataService = {
    supabase: createClient(),

    getWedding: async (): Promise<Wedding | null> => {
        const supabase = createClient();
        // Fetch wedding for the demo user
        // We join templates to get template info if needed, though mostly we just need wedding data
        const { data, error } = await supabase
            .from('weddings')
            .select('*, template:templates(*)')
            .eq('host_id', DEMO_HOST_ID)
            .single();

        if (error) {
            console.error('Error fetching wedding:', error);
            return null;
        }

        return {
            ...data,
            content: (data.content as unknown as WeddingContent) || {}
        } as Wedding;
    },

    updateWedding: async (weddingId: string, content: WeddingContent): Promise<Wedding | null> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('weddings')
            .update({ content: content })
            .eq('id', weddingId)
            .select()
            .single();

        if (error) {
            console.error('Error updating wedding:', error);
            throw error;
        }

        return {
            ...data,
            content: (data.content as unknown as WeddingContent) || {}
        } as Wedding;
    },

    updateWeddingTemplate: async (weddingId: string, templateId: number): Promise<void> => {
        const supabase = createClient();
        const { error } = await supabase
            .from('weddings')
            .update({ template_id: templateId })
            .eq('id', weddingId);

        if (error) {
            console.error('Error updating template:', error);
            throw error;
        }
    },

    getRSVPs: async (weddingId: string): Promise<RSVP[]> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('rsvps')
            .select('*')
            .eq('wedding_id', weddingId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching RSVPs:', error);
            return [];
        }
        return data;
    },

    getTemplates: async (): Promise<Template[]> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('templates')
            .select('*');

        if (error) {
            console.error('Error fetching templates:', error);
            return [];
        }
        return data;
    },

    deployWedding: async (weddingId: string, templateBranch: string = 'theme-vintage'): Promise<{ success: boolean; status: string }> => {
        try {
            const response = await fetch('/api/trigger-deploy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ weddingId, templateBranch }),
            });

            if (response.ok) {
                return { success: true, status: 'building' };
            } else {
                console.error('Deploy failed');
                return { success: false, status: 'failed' };
            }
        } catch (e) {
            return { success: false, status: 'failed' };
        }
    },

    exportRSVPs: async (weddingId: string): Promise<void> => {
        // For a real app, this would probably fetch a CSV generated by backend or generate client side
        console.log(`Exporting RSVPs for ${weddingId}`);
        alert('Export functionality would generate an Excel file here.');
    }
};

```

### lib\initSupabase.ts

```ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ''
)

```

### lib\mock-service.ts

```ts

export interface Wedding {
  id: string;
  host_id: string;
  template_id: string;
  content: {
    groom_name: string;
    bride_name: string;
    wedding_date: string;
    wedding_time: string;
    address: string;
    map_url: string;
    images: string[];
    bank_name: string;
    account_number: string;
    account_name: string;
  };
  slug: string;
  deployment_status: 'draft' | 'building' | 'published' | 'failed';
  repo_branch?: string;
}

export interface RSVP {
  id: string;
  wedding_id: string;
  guest_name: string;
  phone: string;
  wishes: string;
  is_attending: boolean;
  party_size: number;
  created_at: string;
}

export interface Template {
  id: string;
  name: string;
  thumbnail_url: string;
  repo_branch: string;
}

const MOCK_TEMPLATES: Template[] = [
  {
    id: 'tpl_01',
    name: 'Vintage Theme',
    thumbnail_url: 'https://via.placeholder.com/300x200?text=Vintage',
    repo_branch: 'theme-vintage',
  },
  {
    id: 'tpl_02',
    name: 'Modern Theme',
    thumbnail_url: 'https://via.placeholder.com/300x200?text=Modern',
    repo_branch: 'theme-modern',
  },
];

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
      'https://via.placeholder.com/400x300?text=Wedding+2',
    ],
    bank_name: 'Vietcombank',
    account_number: '999988887777',
    account_name: 'NGUYEN MINH TUAN',
  },
  slug: 'tuan-hien',
  deployment_status: 'draft',
  repo_branch: 'theme-vintage',
};

const MOCK_RSVPS: RSVP[] = [
  {
    id: 'rsvp_1',
    wedding_id: 'wed_123',
    guest_name: 'Nguyen Van A',
    phone: '0909123456',
    wishes: 'Chuc mung hanh phuc!',
    is_attending: true,
    party_size: 2,
    created_at: '2023-10-01T10:00:00Z',
  },
  {
    id: 'rsvp_2',
    wedding_id: 'wed_123',
    guest_name: 'Tran Thi B',
    phone: '0909654321',
    wishes: '',
    is_attending: false,
    party_size: 0,
    created_at: '2023-10-02T11:30:00Z',
  },
];

export const mockService = {
  getWedding: async (): Promise<Wedding> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...MOCK_WEDDING }), 500);
    });
  },

  updateWedding: async (data: Partial<Wedding>): Promise<Wedding> => {
    return new Promise((resolve) => {
      // In a real app, we would merge data here
      console.log('Updating wedding:', data);
      setTimeout(() => resolve({ ...MOCK_WEDDING, ...data }), 800);
    });
  },

  getRSVPs: async (): Promise<RSVP[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_RSVPS]), 600);
    });
  },

  getTemplates: async (): Promise<Template[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_TEMPLATES]), 400);
    });
  },

  deployWedding: async (): Promise<{ success: boolean; status: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, status: 'published' });
      }, 2000);
    });
  },

  exportRSVPs: async (): Promise<void> => {
    return new Promise((resolve) => {
      console.log('Exporting RSVPs...');
      setTimeout(() => {
        alert('Mock: Downloaded rsvps.xlsx');
        resolve();
      }, 1000);
    });
  },
};

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

### pages\admin\dashboard.tsx

```tsx
import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Wedding, RSVP, dataService } from '../../lib/data-service'
import Link from 'next/link'

const Dashboard = () => {
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const weddingData = await dataService.getWedding()
      let rsvpData: RSVP[] = []
      if (weddingData) {
        rsvpData = await dataService.getRSVPs(weddingData.id)
      }
      setWedding(weddingData)
      setRsvps(rsvpData)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <AdminLayout>Loading...</AdminLayout>
  if (!wedding)
    return <AdminLayout>Error loading data. Are you sure you have set up the seed data correctly?</AdminLayout>

  const attendingCount = rsvps.filter((r) => r.is_attending).reduce((acc, curr) => acc + (curr.party_size || 0), 0)
  const totalGuests = rsvps.reduce((acc, curr) => acc + (curr.party_size || 0), 0)

  // Parse date safely
  const daysLeft = wedding.content.wedding_date
    ? Math.max(
        0,
        Math.ceil((new Date(wedding.content.wedding_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      )
    : 0

  return (
    <AdminLayout>
      <div className='mb-8'>
        <h2 className='text-3xl font-bold text-gray-800'>Dashboard</h2>
        <p className='text-gray-600'>Overview of your wedding invitation</p>
      </div>

      {/* Status Card */}
      <div className='bg-white p-6 rounded-lg shadow-md mb-8 border-l-4 border-pink-500'>
        <div className='flex justify-between items-center'>
          <div>
            <h3 className='text-lg font-medium text-gray-900'>Current Status</h3>
            <div className='mt-2 flex items-center space-x-2'>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold 
                ${
                  wedding.deployment_status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : wedding.deployment_status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                }`}
              >
                {(wedding.deployment_status || 'DRAFT').toUpperCase()}
              </span>
              {wedding.deployment_status === 'published' && (
                <span className='text-sm text-gray-500'>Last updated: 2 hours ago</span>
              )}
            </div>
          </div>
          {wedding.deployment_status === 'published' ? (
            <div className='flex flex-col items-end'>
              <a
                href={`https://moimoi.vn/${wedding.slug}`}
                target='_blank'
                rel='noreferrer'
                className='text-pink-600 hover:underline font-medium flex items-center'
              >
                moimoi.vn/{wedding.slug} ↗
              </a>
              <button
                className='text-xs text-gray-500 hover:text-gray-700 mt-1'
                onClick={() => alert('Copied to clipboard!')}
              >
                Copy Link
              </button>
            </div>
          ) : (
            <Link href='/admin/settings'>
              <button className='bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors'>
                Go to Publish
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded-lg shadow-sm'>
          <div className='text-gray-500 text-sm font-medium uppercase'>Total Invitations</div>
          <div className='mt-2 text-3xl font-bold text-gray-900'>{rsvps.length}</div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-sm'>
          <div className='text-gray-500 text-sm font-medium uppercase'>Confirmed Attending</div>
          <div className='mt-2 text-3xl font-bold text-green-600'>{attendingCount}</div>
          <div className='text-xs text-gray-400 mt-1'>Guests</div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-sm'>
          <div className='text-gray-500 text-sm font-medium uppercase'>Days Left</div>
          <div className='mt-2 text-3xl font-bold text-blue-600'>{daysLeft}</div>
          <div className='text-xs text-gray-400 mt-1'>Until Big Day</div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Dashboard

```

### pages\admin\editor.tsx

```tsx
import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import TabInfo from '../../components/admin/TabInfo'
import TabAlbum from '../../components/admin/TabAlbum'
import TabBank from '../../components/admin/TabBank'
import { Wedding, dataService } from '../../lib/data-service'

const Editor = () => {
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'info' | 'album' | 'bank'>('info')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const data = await dataService.getWedding()
      setWedding(data)
      setLoading(false)
    }
    fetchData()
  }, [])

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
    await dataService.updateWedding(wedding.id, wedding.content)
    setSaving(false)
    alert('Changes saved successfully!')
  }

  if (loading) return <AdminLayout>Loading...</AdminLayout>
  if (!wedding) return <AdminLayout>Error loading data</AdminLayout>

  return (
    <AdminLayout>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h2 className='text-3xl font-bold text-gray-800'>Editor</h2>
          <p className='text-gray-600'>Update your wedding details</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className='bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 transition-colors disabled:bg-pink-300'
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className='bg-white rounded-lg shadow-sm mb-6'>
        <div className='flex border-b'>
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'info' ? 'text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('info')}
          >
            Info & Location
            {activeTab === 'info' && <div className='absolute bottom-0 left-0 w-full h-0.5 bg-pink-600'></div>}
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'album' ? 'text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('album')}
          >
            Photo Album
            {activeTab === 'album' && <div className='absolute bottom-0 left-0 w-full h-0.5 bg-pink-600'></div>}
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'bank' ? 'text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('bank')}
          >
            Bank & Gift
            {activeTab === 'bank' && <div className='absolute bottom-0 left-0 w-full h-0.5 bg-pink-600'></div>}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className='transition-all duration-300'>
        {activeTab === 'info' && <TabInfo data={wedding.content} onChange={handleInfoChange} />}
        {activeTab === 'album' && (
          <TabAlbum images={wedding.content.images || []} onImagesChange={handleImagesChange} />
        )}
        {activeTab === 'bank' && <TabBank data={wedding.content} onChange={handleInfoChange} />}
      </div>
    </AdminLayout>
  )
}

export default Editor

```

### pages\admin\guests.tsx

```tsx
import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { RSVP, Wedding, dataService } from '../../lib/data-service'

const Guests = () => {
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [loading, setLoading] = useState(true)
  const [guestName, setGuestName] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const weddingData = await dataService.getWedding()
      let rsvpData: RSVP[] = []
      if (weddingData) {
        rsvpData = await dataService.getRSVPs(weddingData.id)
      }
      setWedding(weddingData)
      setRsvps(rsvpData)
      setLoading(false)
    }
    fetchData()
  }, [])

  const generateLink = () => {
    if (!guestName.trim() || !wedding) return
    const link = `https://moimoi.vn/${wedding.slug}?g=${encodeURIComponent(guestName)}`
    setGeneratedLink(link)
  }

  const copyToClipboard = () => {
    if (!generatedLink) return
    // In a real browser this works, but for mock sometimes we need clipboard API support.
    // We'll assume simplest fallback or just alert for now since permissions might vary.
    navigator.clipboard
      .writeText(generatedLink)
      .then(() => {
        alert('Link copied to clipboard!')
      })
      .catch(() => {
        alert('Failed to copy. Please manually copy the link.')
      })
  }

  const handleExport = async () => {
    if (wedding) {
      await dataService.exportRSVPs(wedding.id)
    }
  }

  if (loading) return <AdminLayout>Loading...</AdminLayout>

  return (
    <AdminLayout>
      <div className='mb-8'>
        <h2 className='text-3xl font-bold text-gray-800'>Guest Manager</h2>
        <p className='text-gray-600'>Manage invitations and RSVPs</p>
      </div>

      {/* Link Generator */}
      <div className='bg-white p-6 rounded-lg shadow-md mb-8'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>Create Invitation Link</h3>
        <div className='flex flex-col md:flex-row gap-4'>
          <input
            type='text'
            className='flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
            placeholder='Enter guest name (e.g. Anh Nam)'
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
          <button
            onClick={generateLink}
            disabled={!guestName.trim()}
            className='bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 transition-colors disabled:bg-gray-400'
          >
            Generate Link
          </button>
        </div>

        {generatedLink && (
          <div className='mt-4 p-4 bg-green-50 rounded-md border border-green-200 flex flex-col md:flex-row justify-between items-center gap-4'>
            <code className='text-green-800 break-all'>{generatedLink}</code>
            <div className='flex gap-2'>
              <button
                onClick={copyToClipboard}
                className='text-sm bg-white border border-green-300 text-green-700 px-3 py-1 rounded hover:bg-green-100 transition-colors'
              >
                Copy
              </button>
              <button
                className='text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors'
                onClick={() => window.open(`http://zalo.me/share/?url=${encodeURIComponent(generatedLink)}`, '_blank')}
              >
                Share Zalo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RSVP Table */}
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <div className='px-6 py-4 border-b border-gray-100 flex justify-between items-center'>
          <h3 className='text-lg font-medium text-gray-900'>RSVP List</h3>
          <button
            onClick={handleExport}
            className='text-sm text-gray-600 hover:text-pink-600 flex items-center font-medium border px-3 py-1 rounded hover:border-pink-600 transition-colors'
          >
            📥 Export Excel
          </button>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-left'>
            <thead className='bg-gray-50 text-gray-600 text-sm uppercase'>
              <tr>
                <th className='px-6 py-3'>Guest Name</th>
                <th className='px-6 py-3'>Phone</th>
                <th className='px-6 py-3'>Attending</th>
                <th className='px-6 py-3'>Party Size</th>
                <th className='px-6 py-3'>Wishes</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {rsvps.map((rsvp) => (
                <tr key={rsvp.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 font-medium text-gray-900'>{rsvp.guest_name}</td>
                  <td className='px-6 py-4 text-gray-600'>{rsvp.phone}</td>
                  <td className='px-6 py-4'>
                    {rsvp.is_attending ? (
                      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                        Yes
                      </span>
                    ) : (
                      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
                        No
                      </span>
                    )}
                  </td>
                  <td className='px-6 py-4 text-gray-600'>{rsvp.party_size}</td>
                  <td className='px-6 py-4 text-gray-500 text-sm max-w-xs truncate' title={rsvp.wishes || ''}>
                    {rsvp.wishes || '-'}
                  </td>
                </tr>
              ))}
              {rsvps.length === 0 && (
                <tr>
                  <td colSpan={5} className='px-6 py-8 text-center text-gray-500'>
                    No RSVPs yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Guests

```

### pages\admin\settings.tsx

```tsx
import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Template, Wedding, dataService } from '../../lib/data-service'

const Settings = () => {
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [deploying, setDeploying] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const weddingData = await dataService.getWedding()
      const templateData = await dataService.getTemplates()
      setWedding(weddingData)
      setTemplates(templateData)
      if (weddingData) {
        setSelectedTemplateId(weddingData.template_id)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const handlePublish = async () => {
    setDeploying(true)
    // Update template if changed
    if (wedding && selectedTemplateId && selectedTemplateId !== wedding.template_id) {
      await dataService.updateWeddingTemplate(wedding.id, selectedTemplateId)
    }

    // Call deploy - using wedding ID as the trigger
    const result = await dataService.deployWedding(wedding?.id || '')

    setDeploying(false)
    if (result.success) {
      alert('Wedding website published successfully!')
      // Update local state to reflect published
      if (wedding) setWedding({ ...wedding, deployment_status: 'published' })
    } else {
      alert('Failed to publish. Please try again.')
    }
  }

  if (loading) return <AdminLayout>Loading...</AdminLayout>
  if (!wedding) return <AdminLayout>Error loading data</AdminLayout>

  return (
    <AdminLayout>
      <div className='mb-8'>
        <h2 className='text-3xl font-bold text-gray-800'>Settings</h2>
        <p className='text-gray-600'>Configuration and Deployment</p>
      </div>

      <div className='bg-white p-6 rounded-lg shadow-md mb-8'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>Choose Template</h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className={`border-2 rounded-lg p-2 cursor-pointer transition-all ${selectedTemplateId === tpl.id ? 'border-pink-500 ring-2 ring-pink-200' : 'border-gray-200 hover:border-gray-300'}`}
              onClick={() => setSelectedTemplateId(tpl.id)}
            >
              <div className='aspect-w-16 aspect-h-9 bg-gray-100 rounded mb-3 overflow-hidden'>
                <img
                  src={tpl.thumbnail_url || 'https://via.placeholder.com/300x200'}
                  alt={tpl.name}
                  className='object-cover w-full h-full'
                />
              </div>
              <div className='flex justify-between items-center px-1'>
                <span className='font-medium text-gray-800'>{tpl.name}</span>
                {selectedTemplateId === tpl.id && <span className='text-pink-600 text-sm font-bold'>Selected</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='bg-white p-6 rounded-lg shadow-md'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>Publication</h3>
        <p className='text-gray-600 mb-6'>
          When you are ready, click Publish to build your wedding website. This process usually takes 2-3 minutes.
        </p>

        <div className='flex items-center space-x-4'>
          <button
            onClick={handlePublish}
            disabled={deploying}
            className={`flex items-center px-6 py-3 rounded-md text-white font-medium transition-colors ${
              deploying ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700'
            }`}
          >
            {deploying ? (
              <>
                <svg
                  className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Publishing...
              </>
            ) : (
              'Publish Website'
            )}
          </button>

          {wedding.deployment_status === 'published' && !deploying && (
            <span className='text-green-600 font-medium flex items-center'>✓ Currently Live</span>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default Settings

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
        const response = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/vnd.github.v3+json',
                    Authorization: `Bearer ${GITHUB_PAT}`,
                },
                body: JSON.stringify({
                    event_type: 'deploy_wedding_trigger',
                    client_payload: {
                        wedding_id: weddingId,
                        template_branch: templateBranch || 'theme-vintage',
                    },
                }),
            }
        )

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

### pages\index.tsx

```tsx
import Head from 'next/head'
import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import TemplateGallery from '@/components/landing/TemplateGallery' // Mới
import Pricing from '@/components/landing/Pricing' // Mới
import Footer from '@/components/landing/Footer' // Mới

export default function Home() {
  return (
    <>
      <Head>
        <title>MoiMoi Studio | Thiệp Cưới Online 4.0</title>
        <meta name='description' content='Nền tảng tạo thiệp cưới online chuyên nghiệp.' />
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

### pages\_app.tsx

```tsx
import { supabase } from '@/lib/initSupabase'
import '@/styles/app.css'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}

```

### pages\_document.tsx

```tsx
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='en'>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

```

### utils\supabase\client.ts

```ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
```

### types\supabase.ts

```ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      rsvps: {
        Row: {
          created_at: string
          guest_name: string
          id: number
          is_attending: boolean | null
          party_size: number | null
          phone: string | null
          wedding_id: string
          wishes: string | null
        }
        Insert: {
          created_at?: string
          guest_name: string
          id?: number
          is_attending?: boolean | null
          party_size?: number | null
          phone?: string | null
          wedding_id: string
          wishes?: string | null
        }
        Update: {
          created_at?: string
          guest_name?: string
          id?: number
          is_attending?: boolean | null
          party_size?: number | null
          phone?: string | null
          wedding_id?: string
          wishes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          created_at: string
          id: number
          name: string
          repo_branch: string
          thumbnail_url: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          repo_branch: string
          thumbnail_url?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          repo_branch?: string
          thumbnail_url?: string | null
        }
        Relationships: []
      }
      weddings: {
        Row: {
          content: Json | null
          created_at: string
          deployment_status: string | null
          host_id: string
          id: string
          slug: string
          template_id: number | null
        }
        Insert: {
          content?: Json | null
          created_at?: string
          deployment_status?: string | null
          host_id: string
          id?: string
          slug: string
          template_id?: number | null
        }
        Update: {
          content?: Json | null
          created_at?: string
          deployment_status?: string | null
          host_id?: string
          id?: string
          slug?: string
          template_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "weddings_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

```
