import { Wedding } from '@/lib/data-service'
import { getTemplate } from '@/templates/TemplateRegistry'
import { ExternalLink } from 'lucide-react'
import React from 'react'

interface LivePreviewProps {
  wedding?: Wedding | null
}

// Template renders at 390px (standard mobile), scaled down to fit 260px phone frame
const TEMPLATE_WIDTH = 390
const SCALE = 260 / TEMPLATE_WIDTH

const LivePreview: React.FC<LivePreviewProps> = ({ wedding }) => {
  if (!wedding) {
    return (
      <div className='sticky top-6'>
        <div className='bg-white rounded-3xl shadow-xl border border-pink-100 p-5'>
          <div className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-3'>Live Preview</div>
          <div className='mx-auto w-[280px] rounded-[32px] border-[10px] border-gray-900 bg-gray-900 shadow-2xl'>
            <div className='rounded-[22px] overflow-hidden h-[560px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm'>
              Chưa có dữ liệu
            </div>
          </div>
        </div>
      </div>
    )
  }

  const branch = wedding.template?.repo_branch || 'default'
  const { GeneralView } = getTemplate(branch)

  const handleOpen = () => window.open(`/${wedding.slug}`, '_blank')

  return (
    <div className='sticky top-6'>
      <div className='bg-white rounded-3xl shadow-xl border border-pink-100 p-5'>
        <div className='flex items-center justify-between mb-3'>
          <div className='text-xs font-bold text-gray-500 uppercase tracking-wider'>Live Preview</div>
          <div className='text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full'>
            {wedding.template?.name || 'Default'}
          </div>
        </div>

        {/* Phone frame — click to open full preview */}
        <div
          className='relative mx-auto w-[280px] rounded-[32px] border-[10px] border-gray-900 bg-gray-900 shadow-2xl cursor-pointer group'
          onClick={handleOpen}
          title={`Xem thiệp: /${wedding.slug}`}
        >
          {/* Hover overlay — pointer-events: none to allow scroll passthrough */}
          <div
            className='absolute inset-0 z-10 rounded-[22px] flex items-center justify-center bg-black/0 group-hover:bg-black/25 transition-all'
            style={{ pointerEvents: 'none' }}
          >
            <div className='opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-2 shadow-lg'>
              <ExternalLink size={18} className='text-gray-800' />
            </div>
          </div>

          {/* Phone screen — scrollable, hidden scrollbar */}
          <div
            className='preview-scroll rounded-[22px]'
            style={
              {
                width: 260,
                height: 560,
                overflowX: 'hidden',
                overflowY: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              } as React.CSSProperties
            }
          >
            <div
              style={
                {
                  width: TEMPLATE_WIDTH,
                  zoom: SCALE,
                  pointerEvents: 'none',
                  userSelect: 'none'
                } as React.CSSProperties
              }
            >
              <GeneralView wedding={wedding} />
            </div>
          </div>
        </div>

        <p className='text-xs text-gray-400 mt-3 text-center'>
          Nhấp để xem • <span className='text-pink-500 font-medium'>/{wedding.slug}</span>
        </p>
      </div>
    </div>
  )
}

export default LivePreview
