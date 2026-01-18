import { useSession, useSessionContext } from '@supabase/auth-helpers-react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Edit3, LayoutDashboard, LogOut, Menu, Settings, Users, X } from 'lucide-react'
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
    { label: 'Khách Mời', href: '/studio/guests', icon: Users },
    { label: 'Cài Đặt', href: '/studio/settings', icon: Settings }
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
        <div
          className='fixed inset-0 bg-black/20 z-40 md:hidden'
          onClick={() => setSidebarOpen(false)}
        />
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
            const isActive = router.pathname === item.href || (item.href !== '/studio' && router.pathname.startsWith(item.href))
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
