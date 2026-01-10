import Link from 'next/link'
import { Menu } from 'lucide-react'

export default function Header() {
  return (
    <header className='fixed top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md'>
      <div className='container flex items-center justify-between h-16 px-4 mx-auto'>
        {/* Logo */}
        <div className='text-2xl font-bold text-pink-600'>
          MoiMoi<span className='text-gray-800'>.STD</span>
        </div>

        {/* Desktop Menu */}
        <nav className='hidden gap-8 font-medium text-gray-600 md:flex'>
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
