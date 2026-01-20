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
          <Link href='/admin' className='text-xs font-bold text-gray-400 hover:text-gray-900'>
            Admin
          </Link>
          <Link href='/finance' className='text-xs font-bold text-gray-400 hover:text-gray-900'>
            Finance
          </Link>

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
