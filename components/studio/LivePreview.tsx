import React from 'react'
import { WeddingContent } from '@/lib/data-service'

interface LivePreviewProps {
  content: WeddingContent
}

const LivePreview: React.FC<LivePreviewProps> = ({ content }) => {
  const cover = content.images?.[0]
  const names = `${content.groom_name || 'Chú rể'} & ${content.bride_name || 'Cô dâu'}`

  return (
    <div className='sticky top-6'>
      <div className='bg-white rounded-3xl shadow-xl border border-pink-100 p-5'>
        <div className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-3'>Live Preview</div>
        <div className='mx-auto w-[280px] rounded-[32px] border-[10px] border-gray-900 bg-gray-900 shadow-2xl'>
          <div className='bg-[#FDFBF7] rounded-[22px] overflow-hidden'>
            <div className='h-44 bg-gray-200 relative'>
              {cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cover} alt='Cover' className='h-full w-full object-cover' />
              ) : (
                <div className='h-full w-full bg-gradient-to-b from-pink-100 to-rose-200 flex items-center justify-center text-pink-500 text-xs font-semibold'>
                  Ảnh bìa
                </div>
              )}
            </div>
            <div className='p-4 space-y-3'>
              <div className='text-center'>
                <div className='text-xs uppercase tracking-[0.2em] text-gray-400'>Wedding</div>
                <div className='text-lg font-serif font-bold text-gray-900'>{names}</div>
              </div>
              <div className='bg-white rounded-xl border border-pink-100 p-3 text-center'>
                <div className='text-[11px] text-gray-500'>Ngày cưới</div>
                <div className='text-sm font-bold text-pink-600'>{content.wedding_date || 'Chưa thiết lập'}</div>
              </div>
              <div className='bg-white rounded-xl border border-gray-100 p-3 text-center'>
                <div className='text-[11px] text-gray-500'>Địa điểm</div>
                <div className='text-xs text-gray-700 line-clamp-2'>{content.address || 'Chưa có địa chỉ'}</div>
              </div>
              <div className='flex gap-2'>
                <div className='flex-1 bg-pink-600 text-white text-xs font-bold py-2 rounded-lg text-center'>RSVP</div>
                <div className='flex-1 bg-white border border-pink-200 text-pink-600 text-xs font-bold py-2 rounded-lg text-center'>
                  Mừng cưới
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className='text-xs text-gray-400 mt-3 text-center'>Mô phỏng mobile, cập nhật theo nội dung bạn nhập.</p>
    </div>
  )
}

export default LivePreview
