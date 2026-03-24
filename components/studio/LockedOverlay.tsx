import React from 'react'
import { Crown } from 'lucide-react'
import Link from 'next/link'

interface LockedOverlayProps {
  message?: string
  className?: string
}

const LockedOverlay: React.FC<LockedOverlayProps> = ({
  message = 'Tính năng này dành cho gói nâng cao. Vui lòng nâng cấp để sử dụng.',
  className = ''
}) => {
  return (
    <div
      className={`absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center rounded-xl border-2 border-dashed border-pink-200 group cursor-default shadow-inner ${className}`}
    >
      <div className='bg-gradient-to-br from-amber-400 to-yellow-600 p-3 rounded-full shadow-lg mb-4 transform transition-transform group-hover:scale-110'>
        <Crown className='text-white' size={32} />
      </div>
      <h3 className='text-lg font-bold text-gray-900 mb-2 font-serif'>Tính năng cao cấp</h3>
      <p className='text-sm text-gray-600 mb-6 max-w-[240px]'>{message}</p>
      <Link
        href='/studio/upgrade'
        className='px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-full text-sm font-semibold hover:from-pink-600 hover:to-rose-700 transition-all shadow-md shadow-pink-100 flex items-center gap-2 active:scale-95'
      >
        <span>Nâng cấp ngay</span>
      </Link>
    </div>
  )
}

export default LockedOverlay
