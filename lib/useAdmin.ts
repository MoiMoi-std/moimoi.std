import { useEffect, useState } from 'react'
import { supabase } from './initSupabase'

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loadingAdmin, setLoadingAdmin] = useState(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const {
          data: { session }
        } = await supabase.auth.getSession()

        if (session?.user?.email) {
          const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || []
          setIsAdmin(adminEmails.includes(session.user.email))
        } else {
          setIsAdmin(false)
        }
      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
      } finally {
        setLoadingAdmin(false)
      }
    }

    checkAdminStatus()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || []
        setIsAdmin(adminEmails.includes(session.user.email))
      } else {
        setIsAdmin(false)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  return { isAdmin, loadingAdmin }
}
