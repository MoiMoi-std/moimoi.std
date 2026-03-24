import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Check, Info, X } from 'lucide-react'
import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'pink'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void
  success: (message: string) => void
  error: (message: string) => void
  pink: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = Math.random().toString(36).substring(2, 9)
      setToasts((prev) => [...prev, { id, message, type }])
      setTimeout(() => {
        removeToast(id)
      }, 3000)
    },
    [removeToast]
  )

  const success = (message: string) => addToast(message, 'success')
  const error = (message: string) => addToast(message, 'error')
  const pink = (message: string) => addToast(message, 'pink')

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, pink }}>
      {children}
      <div className='fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none'>
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  const icons = {
    success: <Check size={18} className='text-green-600' />,
    error: <X size={18} className='text-red-600' />,
    info: <Info size={18} className='text-blue-600' />,
    warning: <AlertTriangle size={18} className='text-yellow-600' />,
    pink: <Info size={18} className='text-pink-600' />
  }

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    pink: 'bg-pink-50 border-pink-200 text-pink-800'
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      className={`min-w-[300px] p-4 rounded-xl shadow-lg border flex items-center gap-3 pointer-events-auto cursor-pointer ${styles[toast.type]}`}
      onClick={onClose}
    >
      <div className={`p-2 rounded-full bg-white/50 backdrop-blur-sm`}>{icons[toast.type]}</div>
      <p className='text-sm font-medium'>{toast.message}</p>
    </motion.div>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
