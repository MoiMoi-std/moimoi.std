import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactNode, useEffect } from 'react'
import { useSession, useSessionContext } from '@supabase/auth-helpers-react'

interface AdminLayoutProps {
  children: ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter()
  const session = useSession()
  const isLoading = useSessionContext().isLoading

  useEffect(() => {
    if (!isLoading && !session) {
      router.push('/admin/login')
    }
  }, [session, isLoading, router])

  if (isLoading || !session) return <div className='p-8'>Loading auth state...</div>

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
        <div className='p-4 border-t text-sm text-gray-500'>User: {session?.user?.email}</div>
      </aside>

      {/* Main Content */}
      <main className='flex-1 p-8 overflow-y-auto'>{children}</main>
    </div>
  )
}

export default AdminLayout
