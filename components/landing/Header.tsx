import { useSession } from '@supabase/auth-helpers-react'
import { ArrowRight, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const session = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className='fixed top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md'>
      <div className='container flex items-center justify-between h-16 px-4 md:px-8 mx-auto'>
        {/* Logo */}
        <div className='flex items-center'>
            <Link href='/'>
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src='/image/LOGO.png' alt='MoiMoi.STD' className='h-10 md:h-36 w-auto translate-y-0 md:translate-y-1 object-contain' />
            </Link>
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

        {/* CTA Button (Desktop) */}
        <div className='hidden md:flex items-center space-x-4'>
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
            <button className='px-6 py-2 font-medium text-white transition bg-pink-600 rounded-full hover:bg-pink-700 shadow-lg shadow-pink-200'>
              Tạo Thiệp Ngay
            </button>
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <button className='md:hidden p-2 text-gray-800' onClick={() => setMobileMenuOpen(true)}>
          <Menu className='w-6 h-6' />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
          <div className='fixed inset-0 z-50 bg-white p-6 md:hidden flex flex-col'>
              <div className='flex items-center justify-between mb-8'>
                 <img src='/image/LOGO.png' alt='MoiMoi' className='h-10 w-auto' />
                 <button onClick={() => setMobileMenuOpen(false)} className='p-2 text-gray-500'>
                     <X size={24} />
                 </button>
              </div>

              <div className='flex flex-col space-y-6 text-lg font-medium text-gray-800'>
                  <Link href='#features' onClick={() => setMobileMenuOpen(false)}>Tính năng</Link>
                  <Link href='#templates' onClick={() => setMobileMenuOpen(false)}>Mẫu thiệp</Link>
                  <Link href='#pricing' onClick={() => setMobileMenuOpen(false)}>Bảng giá</Link>
              </div>

              <div className='mt-auto space-y-4'>
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
