import React, { useEffect } from 'react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/router'
import Link from 'next/link'

const LoginPage = () => {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/admin/dashboard')
    }
  }, [session, router])

  if (session) return null // Handle via redirect

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-md'>
        <div className='mb-6 text-center'>
          <h1 className='text-3xl font-bold text-gray-900'>MoiMoi Admin</h1>
          <p className='text-gray-600 mt-2'>Sign in to manage your wedding</p>
        </div>

        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} theme='light' providers={[]} />

        <div className='mt-4 text-center'>
          <Link href='/' className='text-sm text-gray-500 hover:text-gray-700'>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
