import { Menu } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  return (
    <header className='fixed top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md'>
      <div className='container flex items-center justify-between h-16 px-8 mx-auto'>
        {/* Logo */}
        <div className='flex items-center'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
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
        <div className='hidden md:flex items-center space-x-4'>
          <Link href='/studio'>
            <button className='text-gray-600 hover:text-pink-600 font-medium transition'>Admin Studio</button>
          </Link>
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
