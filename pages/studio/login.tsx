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

    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.' })
    }
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
              message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
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
              <button type='button' onClick={() => setView('sign-up')} className='text-pink-600 hover:text-pink-700 font-bold'>
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
              <button type='button' onClick={() => setView('sign-in')} className='text-pink-600 hover:text-pink-700 font-bold'>
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
              <button type='button' onClick={() => setView('sign-in')} className='text-pink-600 hover:text-pink-700 font-bold'>
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
