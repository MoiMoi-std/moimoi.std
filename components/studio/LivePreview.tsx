import { Wedding } from '@/lib/data-service'
import { TemplateViewportContext } from '@/lib/TemplateViewportContext'
import { getTemplate } from '@/templates/TemplateRegistry'
import { ExternalLink, Monitor, Smartphone } from 'lucide-react'
import React, { useState } from 'react'

interface LivePreviewProps {
  wedding?: Wedding | null
  isDirty?: boolean
  onUnsavedWarning?: () => void
}

// Phone constants
const PHONE_TEMPLATE_WIDTH = 390
const PHONE_HEIGHT = 560
const PHONE_DISPLAY_WIDTH = 260
const PHONE_SCALE = PHONE_DISPLAY_WIDTH / PHONE_TEMPLATE_WIDTH
const PHONE_VIEWPORT_HEIGHT = Math.round(PHONE_HEIGHT / PHONE_SCALE)

// Laptop constants
const LAPTOP_TEMPLATE_WIDTH = 900
const LAPTOP_DISPLAY_WIDTH = 320
const LAPTOP_SCALE = LAPTOP_DISPLAY_WIDTH / LAPTOP_TEMPLATE_WIDTH
const LAPTOP_DISPLAY_HEIGHT = 210

const LivePreview: React.FC<LivePreviewProps> = ({ wedding, isDirty, onUnsavedWarning }) => {
  const [mode, setMode] = useState<'phone' | 'laptop'>('phone')

  if (!wedding) {
    return (
      <div>
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

  const handleOpen = () => {
    if (isDirty) {
      onUnsavedWarning?.()
      return
    }
    window.open(`/${wedding.slug}`, '_blank')
  }

  return (
    <div>
      <div className='bg-white rounded-3xl shadow-xl border border-pink-100 p-5'>
        {/* Header row */}
        <div className='flex items-center justify-between mb-3'>
          <div className='text-xs font-bold text-gray-500 uppercase tracking-wider'>Live Preview</div>
          <div className='flex items-center gap-2'>
            {/* Phone / Laptop toggle */}
            <div className='flex items-center bg-gray-100 rounded-lg p-0.5'>
              <button
                onClick={() => setMode('phone')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  mode === 'phone' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Smartphone size={12} />
                Phone
              </button>
              <button
                onClick={() => setMode('laptop')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  mode === 'laptop' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Monitor size={12} />
                Laptop
              </button>
            </div>
            <div className='text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full'>
              {wedding.template?.name || 'Default'}
            </div>
          </div>
        </div>

        {mode === 'phone' ? (
          /* ── Phone frame ── */
          <div
            className='relative mx-auto w-[280px] rounded-[32px] border-[10px] border-gray-900 bg-gray-900 shadow-2xl cursor-pointer group'
            onClick={handleOpen}
            title={`Xem thiệp: /${wedding.slug}`}
          >
            {/* Hover overlay */}
            <div
              className='absolute inset-0 z-10 rounded-[22px] flex items-center justify-center bg-black/0 group-hover:bg-black/25 transition-all'
              style={{ pointerEvents: 'none' }}
            >
              <div className='opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-2 shadow-lg'>
                <ExternalLink size={18} className='text-gray-800' />
              </div>
            </div>

            {/* Phone screen */}
            <div
              className='preview-scroll rounded-[22px]'
              style={
                {
                  width: 260,
                  height: PHONE_HEIGHT,
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
                    width: PHONE_TEMPLATE_WIDTH,
                    zoom: PHONE_SCALE,
                    pointerEvents: 'none',
                    userSelect: 'none',
                    '--phone-height': `${PHONE_VIEWPORT_HEIGHT}px`
                  } as React.CSSProperties
                }
              >
                <TemplateViewportContext.Provider value='phone'>
                  <GeneralView wedding={wedding} />
                </TemplateViewportContext.Provider>
              </div>
            </div>
          </div>
        ) : (
          /* ── Laptop frame ── */
          <div className='mx-auto' style={{ width: LAPTOP_DISPLAY_WIDTH + 20 }}>
            {/* Screen body */}
            <div
              className='rounded-t-xl overflow-hidden cursor-pointer group relative'
              style={{
                border: '8px solid #1f1f1f',
                borderBottom: '6px solid #1f1f1f',
                background: '#1f1f1f',
                boxShadow: '0 8px 32px rgba(0,0,0,0.35)'
              }}
              onClick={handleOpen}
              title={`Xem thiệp: /${wedding.slug}`}
            >
              {/* Hover overlay */}
              <div
                className='absolute inset-0 z-10 flex items-center justify-center bg-black/0 group-hover:bg-black/25 transition-all'
                style={{ pointerEvents: 'none' }}
              >
                <div className='opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-2 shadow-lg'>
                  <ExternalLink size={16} className='text-gray-800' />
                </div>
              </div>

              {/* Browser chrome */}
              <div
                style={{
                  background: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '5px 8px'
                }}
              >
                <div style={{ display: 'flex', gap: 3 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff5f57' }} />
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#febc2e' }} />
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#28c840' }} />
                </div>
                <div
                  style={{
                    flex: 1,
                    background: '#fff',
                    borderRadius: 4,
                    padding: '2px 7px',
                    fontSize: 8,
                    color: '#888',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                  }}
                >
                  moimoi.io.vn/{wedding.slug}
                </div>
              </div>

              {/* Scrollable screen content */}
              <div
                className='preview-scroll'
                style={
                  {
                    width: LAPTOP_DISPLAY_WIDTH,
                    height: LAPTOP_DISPLAY_HEIGHT,
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    background: '#fff'
                  } as React.CSSProperties
                }
              >
                <div
                  style={
                    {
                      width: LAPTOP_TEMPLATE_WIDTH,
                      zoom: LAPTOP_SCALE,
                      pointerEvents: 'none',
                      userSelect: 'none'
                    } as React.CSSProperties
                  }
                >
                  <TemplateViewportContext.Provider value='laptop'>
                    <GeneralView wedding={wedding} />
                  </TemplateViewportContext.Provider>
                </div>
              </div>
            </div>

            {/* Laptop base */}
            <div
              style={{
                height: 10,
                background: 'linear-gradient(to bottom, #2a2a2a, #1a1a1a)',
                borderRadius: '0 0 4px 4px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            />
            <div
              style={{
                height: 5,
                background: '#141414',
                borderRadius: '0 0 8px 8px',
                width: '110%',
                marginLeft: '-5%',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
              }}
            />
          </div>
        )}

        <p className='text-xs text-gray-400 mt-3 text-center'>
          Nhấp để xem • <span className='text-pink-500 font-medium'>/{wedding.slug}</span>
        </p>
      </div>
    </div>
  )
}

export default LivePreview
