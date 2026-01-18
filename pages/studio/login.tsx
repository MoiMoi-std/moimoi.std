import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const LoginPage = () => {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/studio')
    }
  }, [session, router])

  if (session) return null // Handle via redirect

  return (
    <div className='flex items-center justify-center min-h-screen bg-[#FDFBF7] relative overflow-hidden'>
      {/* Background Decor */}
      <div className='absolute top-0 right-0 w-96 h-96 bg-pink-100 rounded-full blur-3xl opacity-50 -mr-20 -mt-20'></div>
      <div className='absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50 -ml-20 -mb-20'></div>

      <div className='w-full max-w-md p-10 bg-white rounded-3xl shadow-xl shadow-pink-100/50 border border-white z-10'>
        <div className='mb-8 text-center'>
          <div className='w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl'>
            🔐
          </div>
          <h1 className='text-3xl font-serif font-bold text-gray-900'>Chào Mừng Trở Lại</h1>
          <p className='text-gray-500 mt-2'>Đăng nhập để quản lý đám cưới của bạn</p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#E27D60',
                  brandAccent: '#C38D9E'
                },
                radii: {
                  borderRadiusButton: '12px',
                  inputBorderRadius: '12px'
                }
              }
            }
          }}
          theme='light'
          providers={[]}
        />

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
